// Import anchor
use anchor_lang::prelude::*;

declare_id!("53fUjUVA7GCU2r279UD43NjCXRaR2dnocwwDZQKvAf1w");

#[account]
pub struct Counter {
    count: u8,
}

#[derive(Accounts)]
pub struct Initalize<'info> {
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

    pub fn initialize(ctx: Context<Initalize>) -> Result<()> {
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
}
