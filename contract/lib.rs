//using https://beta.solpg.io/tutorials/hello-anchor for building and deploying

// Import anchor
use anchor_lang::prelude::*;

declare_id!("7aAKLxbTS8nGaD5QEpbTooNhqjYn8s6sMmQ4gZJYsQrg");

#[derive(Accounts)]
pub struct Hello {}

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
}
