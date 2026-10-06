use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use pyth_solana_receiver_sdk::price_update::{get_feed_id_from_hex, PriceUpdateV2};

declare_id!("SwaoHArzRjzX16rctWM6EdeFBWHbitv91H3QuwELeyd");
const SOL_USD_FEED: &str = "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d";

#[program]
mod pyth_program {
    use super::*;
    pub fn pay_usd(ctx: Context<PayUsd>, cents: u64) -> Result<()> {
        let now = Clock::get()?;
        let feed = get_feed_id_from_hex(SOL_USD_FEED)?;
        let price = ctx
            .accounts
            .price_update
            .get_price_no_older_than(&now, 60, &feed)?;
        require!(
            price.publish_time <= now.unix_timestamp,
            PaymentError::InvalidPrice
        );
        let lamports = cents_to_lamports(cents, price.price, price.exponent)?;
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.key(),
                Transfer {
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.to.to_account_info(),
                },
            ),
            lamports,
        )
    }
}

// Ceil to the next lamport so sub-lamport amounts cannot silently round to zero.
fn cents_to_lamports(cents: u64, price: i64, exponent: i32) -> Result<u64> {
    require!(
        cents > 0 && price > 0 && (-18..=0).contains(&exponent),
        PaymentError::InvalidPrice
    );
    let scale = 10u128.pow((-exponent) as u32);
    let numerator = u128::from(cents)
        .checked_mul(1_000_000_000)
        .and_then(|value| value.checked_mul(scale))
        .ok_or_else(|| error!(PaymentError::AmountOutOfRange))?;
    let denominator = (price as u128) * 100;
    let amount = numerator / denominator + u128::from(numerator % denominator != 0);
    u64::try_from(amount).map_err(|_| error!(PaymentError::AmountOutOfRange))
}

#[derive(Accounts)]
pub struct PayUsd<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    pub to: SystemAccount<'info>,
    pub price_update: Account<'info, PriceUpdateV2>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum PaymentError {
    #[msg("Amount and oracle price must be positive, with an exponent from -18 to 0")]
    InvalidPrice,
    #[msg("Payment exceeds the supported integer range")]
    AmountOutOfRange,
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn converts_cents_without_float_or_dust_loss() {
        assert_eq!(
            cents_to_lamports(100, 20_000_000_000, -8).unwrap(),
            5_000_000
        );
        assert_eq!(cents_to_lamports(1, 300, 0).unwrap(), 33_334);
        assert!(cents_to_lamports(0, 100, 0).is_err());
        assert!(cents_to_lamports(100, -1, -8).is_err());
        assert!(cents_to_lamports(100, 1, i32::MIN).is_err());
        assert!(cents_to_lamports(u64::MAX, 1, -18).is_err());
    }
}
