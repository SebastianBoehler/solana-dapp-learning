// Import anchor
use anchor_lang::prelude::*;

declare_id!("53fUjUVA7GCU2r279UD43NjCXRaR2dnocwwDZQKvAf1w");

#[account]
pub struct Counter {
    count: u8,
}

#[derive(Accounts)]
pub struct Initalize<'info> {
    #[account(init, payer = user, space = 8 + 1)]
    pub set: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCounter<'info> {
    #[account(mut)]
    pub set: Account<'info, Counter>,
}

#[program]
mod my_counter {
    use super::*;

    pub fn initalize(ctx: Context<Initalize>) -> Result<()> {
        ctx.accounts.set.count = 0;
        msg!("Initalize account");
        Ok(())
    }

    pub fn decrease_counter(ctx: Context<UpdateCounter>, number: u8) -> Result<()> {
        require!(number > 10, MyError::MaxStepSize);
        ctx.accounts.set.count -= number;
        msg!("Decrease counter {}", number);
        Ok(())
    }

    pub fn increase_counter(ctx: Context<UpdateCounter>, number: u8) -> Result<()> {
        if number >= 5 {
            return err!(MyError::MaxStepSize);
        }
        ctx.accounts.set.count += number;
        msg!("Increased counter {}", number);
        Ok(())
    }
}
#[error_code]
pub enum MyError {
    #[msg("Only positive numbers supported")]
    DataInputInvalid,
    #[msg("Max step size is too big")]
    MaxStepSize,
}
