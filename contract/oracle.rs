use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("CR651qrjHq9v18JC9qqzHZcFThFTa9dycHXofxxFcotn");

#[program]
mod my_oracle {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Init done"); // Message will show up in the tx logs
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64, name: String) -> Result<()> {
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
        init, payer = user, space = 8 + 8 + 4 + 7,
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
