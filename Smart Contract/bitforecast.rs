use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod bit_forecast {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, new_operator_address: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.owner = *ctx.accounts.owner.key;
        state.operator_address = new_operator_address;
        state.current_epoch = 0;
        state.reward_rate = 94;
        state.round_interval = 300;
        state.min_bet_amount = 2 * 10u64.pow(15);
        state.started_once = false;
        state.locked_once = false;
        state.paused = false;
        Ok(())
    }

    pub fn set_operator(ctx: Context<SetOperator>, new_operator_address: Pubkey) -> Result<()> {
        require!(new_operator_address != Pubkey::default(), ErrorCode::InvalidAddress);
        let state = &mut ctx.accounts.state;
        state.operator_address = new_operator_address;
        Ok(())
    }

    pub fn inject_funds(ctx: Context<InjectFunds>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.program_account.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        emit!(FundsInjectedEvent {
            sender: *ctx.accounts.user.key,
            amount,
        });

        Ok(())
    }

    pub fn extract_funds(ctx: Context<ExtractFunds>, amount: u64) -> Result<()> {
        let state = &ctx.accounts.state;
        require!(
            *ctx.accounts.user.key == state.owner || *ctx.accounts.user.key == state.operator_address,
            ErrorCode::Unauthorized
        );

        **ctx.accounts.program_account.try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.user.try_borrow_mut_lamports()? += amount;

        Ok(())
    }

    pub fn blacklist_insert(ctx: Context<BlacklistManage>, user_address: Pubkey) -> Result<()> {
        let blacklist = &mut ctx.accounts.blacklist;
        require!(!blacklist.addresses.contains(&user_address), ErrorCode::AlreadyBlacklisted);
        blacklist.addresses.push(user_address);
        Ok(())
    }

    pub fn blacklist_remove(ctx: Context<BlacklistManage>, user_address: Pubkey) -> Result<()> {
        let blacklist = &mut ctx.accounts.blacklist;
        let index = blacklist.addresses.iter().position(|&x| x == user_address)
            .ok_or(ErrorCode::NotBlacklisted)?;
        blacklist.addresses.remove(index);
        Ok(())
    }

    pub fn pause(ctx: Context<Pause>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        require!(!state.paused, ErrorCode::AlreadyPaused);
        state.paused = true;
        state.started_once = false;
        state.locked_once = false;

        emit!(ContractPausedEvent {
            epoch: state.current_epoch,
        });

        Ok(())
    }

    pub fn unpause(ctx: Context<Pause>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        require!(state.paused, ErrorCode::NotPaused);
        state.paused = false;

        emit!(ContractUnpausedEvent {
            epoch: state.current_epoch,
        });

        Ok(())
    }

    pub fn start_round(ctx: Context<StartRound>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let rounds = &mut ctx.accounts.rounds;
        require!(!state.paused, ErrorCode::ContractPaused);
        require!(!state.started_once, ErrorCode::RoundAlreadyStarted);

        state.current_epoch += 1;
        let current_timestamp = Clock::get()?.unix_timestamp;
        
        rounds.start_timestamp = current_timestamp;
        rounds.bull_amount = 2 * 10u64.pow(17);
        rounds.bear_amount = 2 * 10u64.pow(17);

        emit!(StartRoundEvent {
            epoch: state.current_epoch,
            round_timestamp: current_timestamp as u32,
        });

        state.started_once = true;
        Ok(())
    }

    pub fn lock_round(ctx: Context<LockRound>, price: i64, timestamp: i64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let rounds = &mut ctx.accounts.rounds;
        require!(state.started_once, ErrorCode::RoundNotStarted);
        require!(!state.locked_once, ErrorCode::RoundAlreadyLocked);
        require!(rounds.start_timestamp != 0, ErrorCode::RoundNotStarted);
        require!(
            Clock::get()?.unix_timestamp >= rounds.start_timestamp + state.round_interval as i64,
            ErrorCode::TooEarlyToLock
        );

        rounds.lock_price = price;
        rounds.lock_timestamp = timestamp;

        let total = rounds.bull_amount + rounds.bear_amount;
        let (bull_odd, bear_odd) = calculate_odds(rounds.bull_amount, rounds.bear_amount, total);

        emit!(LockRoundEvent {
            epoch: state.current_epoch,
            price,
            bull_odd,
            bear_odd,
            total,
        });

        state.current_epoch += 1;
        rounds.start_timestamp = Clock::get()?.unix_timestamp;
        rounds.bull_amount = 2 * 10u64.pow(17);
        rounds.bear_amount = 2 * 10u64.pow(17);

        state.locked_once = true;

        emit!(LockAutomateEvent);

        Ok(())
    }

    pub fn execute(ctx: Context<Execute>, price: i64, timestamp: i64, bet_on_bull: u64, bet_on_bear: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let rounds = &mut ctx.accounts.rounds;
        let house_info = &mut ctx.accounts.house_info;
        require!(state.started_once && state.locked_once, ErrorCode::RoundNotReady);
        
        let current_timestamp = Clock::get()?.unix_timestamp;
        require!(
            current_timestamp >= rounds.start_timestamp + state.round_interval as i64,
            ErrorCode::TooEarlyToExecute
        );
        require!(
            current_timestamp <= rounds.start_timestamp + 2 * state.round_interval as i64,
            ErrorCode::TooLateToExecute
        );

        // Lock current round
        rounds.lock_price = price;
        rounds.lock_timestamp = timestamp;

        // End previous round
        let prev_rounds = &mut ctx.accounts.prev_rounds;
        end_round(prev_rounds, price, state.reward_rate)?;

        // Start new round
        state.current_epoch += 1;
        rounds.start_timestamp = current_timestamp;

        // House bet
        rounds.bull_amount += bet_on_bull;
        rounds.bear_amount += bet_on_bear;
        house_info.house_bet_bull = bet_on_bull;
        house_info.house_bet_bear = bet_on_bear;

        calculate_bet_odds(rounds)?;

        Ok(())
    }

    pub fn force_execute(ctx: Context<Execute>, price: i64, timestamp: i64, bet_on_bull: u64, bet_on_bear: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let rounds = &mut ctx.accounts.rounds;
        let house_info = &mut ctx.accounts.house_info;
        require!(state.started_once && state.locked_once, ErrorCode::RoundNotReady);

        // Lock current round
        rounds.lock_price = price;
        rounds.lock_timestamp = timestamp;

        // End and cancel previous round
        let prev_rounds = &mut ctx.accounts.prev_rounds;
        end_round(prev_rounds, price, state.reward_rate)?;
        prev_rounds.canceled = true;
        prev_rounds.closed = true;

        // Start new round
        state.current_epoch += 1;
        rounds.start_timestamp = Clock::get()?.unix_timestamp;

        // House bet
        rounds.bull_amount += bet_on_bull;
        rounds.bear_amount += bet_on_bear;
        house_info.house_bet_bull = bet_on_bull;
        house_info.house_bet_bear = bet_on_bear;

        calculate_bet_odds(rounds)?;

        emit!(ExecuteForcedEvent);

        Ok(())
    }

    pub fn cancel_round(ctx: Context<CancelRound>, epoch: u32, canceled: bool, closed: bool) -> Result<()> {
        let rounds = &mut ctx.accounts.rounds;
        rounds.canceled = canceled;
        rounds.closed = closed;

        emit!(CancelRoundEvent { epoch });

        Ok(())
    }

    pub fn set_min_bet_amount(ctx: Context<SetMinBetAmount>, new_min_bet_amount: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.min_bet_amount = new_min_bet_amount;

        emit!(MinBetAmountUpdatedEvent {
            epoch: state.current_epoch,
            min_bet_amount: new_min_bet_amount,
        });

        Ok(())
    }

    pub fn set_reward_rate(ctx: Context<SetRewardRate>, new_reward_rate: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.reward_rate = new_reward_rate;

        emit!(RewardRateUpdatedEvent {
            reward_rate: new_reward_rate,
        });

        Ok(())
    }

    pub fn set_round_interval(ctx: Context<SetRoundInterval>, new_interval: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.round_interval = new_interval;

        emit!(RoundIntervalUpdatedEvent {
            new_interval,
        });

        Ok(())
    }

    pub fn bet_bull(ctx: Context<Bet>) -> Result<()> {
        let state = &ctx.accounts.state;
        let rounds = &mut ctx.accounts.rounds;
        let bet_info = &mut ctx.accounts.bet_info;
        let user_bets = &mut ctx.accounts.user_bets;

        check_bet_requirements(state, rounds, bet_info, ctx.accounts.user.key, ctx.accounts.blacklist.to_account_info())?;

        let amount = ctx.accounts.user.lamports();
        let bet_amount = amount - (amount * 20 / 100);
        let parent_reward = amount * 20 / 100;

        reward_parent(ctx.accounts.parent.to_account_info(), parent_reward)?;

        rounds.bull_amount += bet_amount;
        update_bet_info(bet_info, 1, bet_amount, state.current_epoch)?;
        user_bets.epochs.push(state.current_epoch);

        calculate_bet_odds(rounds)?;

        emit!(BetBullEvent {
            sender: *ctx.accounts.user.key,
            epoch: state.current_epoch,
            amount,
        });

        Ok(())
    }

    pub fn bet_bear(ctx: Context<Bet>) -> Result<()> {
        let state = &ctx.accounts.state;
        let rounds = &mut ctx.accounts.rounds;
        let bet_info = &mut ctx.accounts.bet_info;
        let user_bets = &mut ctx.accounts.user_bets;

        check_bet_requirements(state, rounds, bet_info, ctx.accounts.user.key, ctx.accounts.blacklist.to_account_info())?;

        let amount = ctx.accounts.user.lamports();
        let bet_amount = amount - (amount * 20 / 100);
        let parent_reward = amount * 20 / 100;

        reward_parent(ctx.accounts.parent.to_account_info(), parent_reward)?;

        rounds.bear_amount += bet_amount;
        update_bet_info(bet_info, 2, bet_amount, state.current_epoch)?;
        user_bets.epochs.push(state.current_epoch);

        calculate_bet_odds(rounds)?;

        emit!(BetBearEvent {
            sender: *ctx.accounts.user.key,
            epoch: state.current_epoch,
            amount,
        });

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, epoch: u32) -> Result<()> {
        let rounds = &ctx.accounts.rounds;
        let bet_info = &mut ctx.accounts.bet_info;
        let state = &ctx.accounts.state;

        if rounds.closed && bet_info.is_bet && !bet_info.claimed {
            let reward = if rounds.canceled {
                bet_info.amount
            } else if (rounds.is_bull_won && bet_info.position == 1) || (rounds.is_bear_won && bet_info.position == 2) {
                (bet_info.amount * rounds.won_odd * state.reward_rate as u128 / 10000) as u64
            } else if rounds.is_tie {
                bet_info.amount
            } else {
                0
            };

            if reward > 0 {
                **ctx.accounts.program_account.try_borrow_mut_lamports()? -= reward;
                **ctx.accounts.user.try_borrow_mut_lamports()? += reward;
                bet_info.claimed = true;

                emit!(ClaimEvent {
                    sender: *ctx.accounts.user.key,
                    epoch,
                    amount: reward,
                });

                return Ok(());
            }
        }

        Err(ErrorCode::NothingToClaim.into())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 4 + 8 + 8 + 8 + 1 + 1 + 1)]
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetOperator<'info> {
    #[account(mut, has_one = owner)]
    pub state: Account<'info, BitForecastState>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct InjectFunds<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub program_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExtractFunds<'info> {
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub program_account: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RewardUser<'info> {
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub program_account: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct BlacklistManage<'info> {
    #[account(mut)]
    pub blacklist: Account<'info, Blacklist>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Pause<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct StartRound<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub rounds: Account<'info, InternalRound>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct LockRound<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub rounds: Account<'info, InternalRound>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub rounds: Account<'info, InternalRound>,
    #[account(mut)]
    pub prev_rounds: Account<'info, InternalRound>,
    #[account(mut)]
    pub house_info: Account<'info, HouseBetInfo>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelRound<'info> {
    #[account(mut)]
    pub rounds: Account<'info, InternalRound>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetMinBetAmount<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetRewardRate<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetRoundInterval<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(constraint = *authority.key == state.owner || *authority.key == state.operator_address)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Bet<'info> {
    #[account(mut)]
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub rounds: Account<'info, InternalRound>,
    #[account(mut)]
    pub bet_info: Account<'info, BetInfo>,
    #[account(mut)]
    pub user_bets: Account<'info, UserBets>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub parent: AccountInfo<'info>,
    pub blacklist: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    pub state: Account<'info, BitForecastState>,
    #[account(mut)]
    pub rounds: Account<'info, InternalRound>,
    #[account(mut)]
    pub bet_info: Account<'info, BetInfo>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub program_account: AccountInfo<'info>,
}

#[account]
pub struct BitForecastState {
    pub owner: Pubkey,
    pub operator_address: Pubkey,
    pub current_epoch: u32,
    pub reward_rate: u64,
    pub round_interval: u64,
    pub min_bet_amount: u64,
    pub started_once: bool,
    pub locked_once: bool,
    pub paused: bool,
}

#[account]
pub struct InternalRound {
    pub bull_amount: u64,
    pub bear_amount: u64,
    pub lock_price: i64,
    pub end_price: i64,
    pub start_timestamp: i64,
    pub lock_timestamp: i64,
    pub rewards_claimable: u64,
    pub won_odd: u64,
    pub is_bull_won: bool,
    pub is_bear_won: bool,
    pub is_tie: bool,
    pub closed: bool,
    pub canceled: bool,
}

#[account]
pub struct BetInfo {
    pub position: u8,
    pub amount: u64,
    pub claimed: bool,
    pub is_bet: bool,
}

#[account]
pub struct HouseBetInfo {
    pub house_bet_bull: u64,
    pub house_bet_bear: u64,
}

#[account]
pub struct Blacklist {
    pub addresses: Vec<Pubkey>,
}

#[account]
pub struct UserBets {
    pub epochs: Vec<u32>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid address")]
    InvalidAddress,
    #[msg("Already blacklisted")]
    AlreadyBlacklisted,
    #[msg("Not blacklisted")]
    NotBlacklisted,
    #[msg("Already paused")]
    AlreadyPaused,
    #[msg("Not paused")]
    NotPaused,
    #[msg("Contract paused")]
    ContractPaused,
    #[msg("Round already started")]
    RoundAlreadyStarted,
    #[msg("Round not started")]
    RoundNotStarted,
    #[msg("Round already locked")]
    RoundAlreadyLocked,
    #[msg("Too early to lock")]
    TooEarlyToLock,
    #[msg("Round not ready")]
    RoundNotReady,
    #[msg("Too early to execute")]
    TooEarlyToExecute,
    #[msg("Too late to execute")]
    TooLateToExecute,
    #[msg("Round not bettable")]
    RoundNotBettable,
    #[msg("Insufficient bet amount")]
    InsufficientBetAmount,
    #[msg("Already bet in this round")]
    AlreadyBetInRound,
    #[msg("Blacklisted address")]
    BlacklistedAddress,
    #[msg("Nothing to claim")]
    NothingToClaim,
}

// Events
#[event]
pub struct FundsInjectedEvent {
    pub sender: Pubkey,
    pub amount: u64,
}

#[event]
pub struct ContractPausedEvent {
    pub epoch: u32,
}

#[event]
pub struct ContractUnpausedEvent {
    pub epoch: u32,
}

#[event]
pub struct StartRoundEvent {
    pub epoch: u32,
    pub round_timestamp: u32,
}

#[event]
pub struct LockRoundEvent {
    pub epoch: u32,
    pub price: i64,
    pub bull_odd: u64,
    pub bear_odd: u64,
    pub total: u64,
}

#[event]
pub struct LockAutomateEvent;

#[event]
pub struct ExecuteForcedEvent;

#[event]
pub struct CancelRoundEvent {
    pub epoch: u32,
}

#[event]
pub struct MinBetAmountUpdatedEvent {
    pub epoch: u32,
    pub min_bet_amount: u64,
}

#[event]
pub struct RewardRateUpdatedEvent {
    pub reward_rate: u64,
}

#[event]
pub struct RoundIntervalUpdatedEvent {
    pub new_interval: u64,
}

#[event]
pub struct BetBullEvent {
    pub sender: Pubkey,
    pub epoch: u32,
    pub amount: u64,
}

#[event]
pub struct BetBearEvent {
    pub sender: Pubkey,
    pub epoch: u32,
    pub amount: u64,
}

#[event]
pub struct ClaimEvent {
    pub sender: Pubkey,
    pub epoch: u32,
    pub amount: u64,
}

// Helper functions
fn calculate_odds(bull_amount: u64, bear_amount: u64, total: u64) -> (u64, u64) {
    let bull_odd = if (total * 1_000_000) / bull_amount > 3_000_000 {
        4_000_000 - (total * 1_000_000 / bear_amount)
    } else {
        (total * 1_000_000) / bull_amount
    };

    let bear_odd = if (total * 1_000_000) / bear_amount > 3_000_000 {
        4_000_000 - (total * 1_000_000 / bull_amount)
    } else {
        (total * 1_000_000) / bear_amount
    };

    (bull_odd, bear_odd)
}

fn end_round(rounds: &mut Account<InternalRound>, price: i64, reward_rate: u64) -> Result<()> {
    rounds.closed = true;
    rounds.end_price = price;
    let total = rounds.bull_amount + rounds.bear_amount;
    let (bull_odd, bear_odd) = calculate_odds(rounds.bull_amount, rounds.bear_amount, total);

    if price > rounds.lock_price {
        rounds.is_bull_won = true;
        rounds.won_odd = bull_odd;
        rounds.rewards_claimable = (rounds.bull_amount * rounds.won_odd * reward_rate as u128 / 10000) as u64;
    } else if price < rounds.lock_price {
        rounds.is_bear_won = true;
        rounds.won_odd = bear_odd;
        rounds.rewards_claimable = (rounds.bear_amount * rounds.won_odd * reward_rate as u128 / 10000) as u64;
    } else {
        rounds.is_tie = true;
        rounds.won_odd = 1_000_000;
        rounds.rewards_claimable = rounds.bull_amount + rounds.bear_amount;
    }

    Ok(())
}

fn calculate_bet_odds(rounds: &mut Account<InternalRound>) -> Result<()> {
    let total = rounds.bull_amount + rounds.bear_amount;
    let (bull_odd, bear_odd) = calculate_odds(rounds.bull_amount, rounds.bear_amount, total);

    emit!(BetOddsEvent {
        epoch: rounds.key(),
        bull_odd,
        bear_odd,
        total,
    });

    Ok(())
}

fn check_bet_requirements(
    state: &Account<BitForecastState>,
    rounds: &Account<InternalRound>,
    bet_info: &Account<BetInfo>,
    user: &Pubkey,
    blacklist: AccountInfo,
) -> Result<()> {
    require!(
        rounds.start_timestamp != 0 &&
        Clock::get()?.unix_timestamp > rounds.start_timestamp &&
        Clock::get()?.unix_timestamp < rounds.start_timestamp + state.round_interval as i64,
        ErrorCode::RoundNotBettable
    );
    require!(bet_info.amount >= state.min_bet_amount, ErrorCode::InsufficientBetAmount);
    require!(!bet_info.is_bet, ErrorCode::AlreadyBetInRound);
    
    let blacklist_account = Account::<Blacklist>::try_from(&blacklist)?;
    require!(!blacklist_account.addresses.contains(user), ErrorCode::BlacklistedAddress);

    Ok(())
}

fn update_bet_info(bet_info: &mut Account<BetInfo>, position: u8, amount: u64, epoch: u32) -> Result<()> {
    bet_info.position = position;
    bet_info.amount = amount;
    bet_info.is_bet = true;
    Ok(())
}

fn reward_parent(parent: AccountInfo, reward: u64) -> Result<()> {
    **parent.try_borrow_mut_lamports()? += reward;
    Ok(())
}

#[event]
pub struct BetOddsEvent {
    pub epoch: Pubkey,
    pub bull_odd: u64,
    pub bear_odd: u64,
    pub total: u64,
}