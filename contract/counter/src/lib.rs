// Import anchor
use anchor_lang::prelude::*;

declare_id!("53fUjUVA7GCU2r279UD43NjCXRaR2dnocwwDZQKvAf1w");

#[account]
pub struct Counter {
    count: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init, payer = user, space = 8 + 1,
        seeds=[b"counter", user.key().as_ref()], bump
    )]
    pub set: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCounter<'info> {
    user: Signer<'info>,
    #[account(
        mut,
        seeds=[b"counter", user.key().as_ref()], bump
    )]
    pub set: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct CloseCounter<'info> {
    #[account(mut)]
    user: Signer<'info>,
    #[account(
        mut,
        seeds=[b"counter", user.key().as_ref()], bump,
        close = user,
    )]
    pub set: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[program]
mod my_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.set.count = 0;
        msg!("Initialize account");
        Ok(())
    }

    pub fn decrease_counter(ctx: Context<UpdateCounter>, number: u8) -> Result<()> {
        require!(number > 0 && number <= 4, MyError::MaxStepSize);
        ctx.accounts.set.count = subtract(ctx.accounts.set.count, number)?;
        msg!("Decrease counter {}", number);
        Ok(())
    }

    pub fn increase_counter(ctx: Context<UpdateCounter>, number: u8) -> Result<()> {
        if number == 0 || number >= 5 {
            return err!(MyError::MaxStepSize);
        }
        ctx.accounts.set.count = add(ctx.accounts.set.count, number)?;
        msg!("Increased counter {}", number);
        Ok(())
    }

    pub fn close_counter_pda(_ctx: Context<CloseCounter>) -> Result<()> {
        Ok(())
    }
}
#[error_code]
pub enum MyError {
    #[msg("Only positive numbers supported")]
    DataInputInvalid,
    #[msg("Max step size is too big")]
    MaxStepSize,
    #[msg("Counter arithmetic exceeds the u8 range")]
    OutOfRange,
}

fn add(count: u8, step: u8) -> Result<u8> {
    count
        .checked_add(step)
        .ok_or_else(|| error!(MyError::OutOfRange))
}

fn subtract(count: u8, step: u8) -> Result<u8> {
    count
        .checked_sub(step)
        .ok_or_else(|| error!(MyError::OutOfRange))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn arithmetic_rejects_wraparound() {
        assert_eq!(add(0, 4).unwrap(), 4);
        assert_eq!(subtract(4, 4).unwrap(), 0);
        assert!(add(255, 1).is_err());
        assert!(subtract(0, 1).is_err());
    }
}
