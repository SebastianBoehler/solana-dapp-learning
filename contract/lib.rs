// Import anchor
use anchor_lang::prelude::*;

declare_id!("7aAKLxbTS8nGaD5QEpbTooNhqjYn8s6sMmQ4gZJYsQrg");

#[derive(Accounts)]
pub struct Hello {}

#[account]
#[derive(Default)]
pub struct Interactions {
    counter: u64,
}

//used to modify the Interactions Struct
#[derive(Accounts)]
pub struct SetInteractions<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub set: Account<'info, Interactions>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[program]
mod hello_world {
    use super::*;

    pub fn hello(ctx: Context<Hello>) -> Result<()> {
        msg!("Hello, World!");
        Ok(())
    }

    pub fn another_func(ctx: Context<Hello>) -> Result<()> {
        msg!("Inside another Func");
        Ok(())
    }

    pub fn decrease_counter(ctx: Context<SetInteractions>, number: u64) -> Result<()> {
        ctx.accounts.set.counter -= number;
        msg!("Decrease counter");
        Ok(())
    }

    pub fn increase_counter(ctx: Context<SetInteractions>, number: u64) -> Result<()> {
        ctx.accounts.set.counter += number;
        msg!("Increased counter");
        Ok(())
    }
}
