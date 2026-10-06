use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("CR651qrjHq9v18JC9qqzHZcFThFTa9dycHXofxxFcotn");

#[program]
mod my_oracle {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, name: String) -> Result<()> {
        require!(name.len() <= 32, OracleError::NameTooLong);
        ctx.accounts.data_store.name = name;
        ctx.accounts.data_store.data = 0;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> Result<()> {
        msg!("Update {}", data);
        ctx.accounts.data_store.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init, payer = user, space = 8 + 8 + 4 + 32,
        seeds=[b"oracle", user.key().as_ref()], bump
    )]
    pub data_store: Account<'info, DataStore>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    user: Signer<'info>,
    #[account(
        mut,
        seeds=[b"oracle", user.key().as_ref()], bump
    )]
    pub data_store: Account<'info, DataStore>,
}

#[account]
pub struct DataStore {
    name: String,
    data: u64,
}

#[error_code]
pub enum OracleError {
    #[msg("The oracle name must fit within 32 UTF-8 bytes")]
    NameTooLong,
}
