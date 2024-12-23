// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Contex
abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return payable(msg.sender);
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this;
        return msg.data;
    }
}

// Reentrancy Guard

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// Ether Transfer

abstract contract EtherTransfer {
    function _safeTransferSCAI(address to, uint256 value) internal 
    {
        (bool success, ) = to.call{gas: 23000, value: value}("");
        require(success, "Transfer Failed");
    }
}

// Ownable

abstract contract Ownable is Context {
    address internal _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner); //done

    constructor() { 
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function OwnershipRenounce() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function OwnershipTransfer(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// Pausable

abstract contract Pausable is Context {
    event ContractPaused(address account);
    event ContractUnpaused(address account);

    bool private _paused;

    constructor() {
        _paused = false;
    }

    function IsPaused() public view virtual returns (bool) {
        return _paused;
    }

    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }

    function _Pause() internal virtual whenNotPaused {
        _paused = true;
        emit ContractPaused(_msgSender());
    }

    function _Unpause() internal virtual whenPaused {
        _paused = false;
        emit ContractUnpaused(_msgSender());
    }
}

// Prediction contract

contract BitForecast is Ownable, Pausable, ReentrancyGuard, EtherTransfer{

    struct InternalRound {
        uint256 bullAmount;
        uint256 bearAmount;
        int256 lockprice;
        int256 endprice;
        uint32 startTimestamp;
        uint32 lockTimestamp;
        uint256 rewardsClaimable;
        uint256 wonOdd;
        bool isbullwon;
        bool isbearwon;
        bool istie;
        bool closed;
        bool canceled;
    }

// User Bet Info

struct BetInfo {
    uint8 position;
    uint256 amount;
    bool claimed;
    bool isbet; // default false
}

struct HouseBetInfo{
    uint256 houseBetBull;
    uint256 houseBetBear;
}

mapping(uint256 => InternalRound) public _Rounds;
mapping(uint256 => HouseBetInfo) public _houseInfo;
mapping(uint256 => mapping(address => BetInfo)) public Bets; //done
mapping(address => uint256[]) public UserBets;
mapping(address => bool) internal _Blacklist;
mapping(address => bool) public isParentSet;
mapping(address => address) public Parent;
mapping(address => address[] daughters) public referrals;

uint32 public currentEpoch;

address public operatorAddress;


// Defaults
uint256 internal _minHouseBetRatio = 90;        // houseBetBear/houseBetBull min value
uint256 public rewardRate = 94;                 // Percents
uint256 constant public minimumRewardRate = 90; // Minimum reward rate 90%
uint256 public roundInterval = 300;             // In seconds    
uint256 public minBetAmount = 2e15;             // Updated to use scientific notation

bool public startedOnce = false;
bool public lockedOnce = false;

    // Events

    event BetBear(address indexed sender, uint256 indexed epoch, uint256 amount);//done
    event BetBull(address indexed sender, uint256 indexed epoch, uint256 amount);//done
    event Claim(address indexed sender, uint256 indexed epoch, uint256 amount); //done
    
    event StartRound(uint256 indexed epoch, uint32 roundTimestamp); //done
    event LockRound(uint256 indexed epoch, int256 price, uint256 bullOdd, uint256 bearOdd, uint256 pool); //repair
    event EndRound(uint256 indexed epoch, uint256 pool, int256 lockedprice, uint256 outcome); //done
    event CancelRound(uint256 indexed epoch); //done
    event ContractPaused_(uint256 indexed epoch); //done
    event ContractUnpaused_(uint256 indexed epoch); //done
    event Betodds(uint256 indexed epoch, uint256 bullOdd, uint256 bearOdd, uint256 pool); //repair

    event InjectFunds(address indexed sender); //done
    event MinBetAmountUpdated(uint256 indexed epoch, uint256 minBetAmount); //done
    event HouseBetMinRatioUpdated(uint256 minRatioPercents); //done
    event RewardRateUpdated(uint256 rewardRate); //done
    event RoundIntervalUpdated(uint32 newInterval); //done
    event LockAutomate();
    event ExecuteForced(); //done

    // Set Constructor

    constructor(address newOperatorAddress) {
        operatorAddress = newOperatorAddress;
    }

    // Set Onlyowner or Operator Modifier

    modifier onlyOwnerOrOperator() {
        require(msg.sender == _owner || msg.sender == operatorAddress, "Only owner or operator can call this function");
        _;
    }

    // INTERNAL FUNCTIONS ---------------->

    //  Start Round Internal
    
// Safe Start Round Internal
function _safeStartRound(uint256 epoch) internal {
    InternalRound storage round = _Rounds[epoch];
    round.startTimestamp = uint32(block.timestamp);
    emit StartRound(epoch, round.startTimestamp);
}

// Safe Lock Round Internal
function _safeLockRound(uint256 epoch, int256 price, uint32 timestamp) internal { 
    InternalRound storage round = _Rounds[epoch];
    round.lockprice = price;
    round.lockTimestamp = timestamp;

    // Calculate and emit bull-bear odds
    uint256 total = round.bullAmount + round.bearAmount;
    uint256 bull_;
    uint256 bear_;

    if((total * 1e18) / round.bullAmount > 3e18){
        bull_ = 4e18 - (total * 1e18 / round.bearAmount);
    }else{
        bull_ = (total * 1e18) / round.bullAmount;
    }

    if((total * 1e18) / round.bearAmount > 3e18){
        bear_ = 4e18 - (total * 1e18 / round.bullAmount);
    }else{
        bear_ = (total * 1e18) / round.bearAmount;
    }

    emit LockRound(epoch, price, bull_, bear_, total);
}

// Safe End Round Internal
function _safeEndRound(uint256 epoch, int256 endprice) internal { 
    InternalRound storage round = _Rounds[epoch];
    round.closed = true;
    round.endprice = endprice;
    uint256 total = round.bullAmount + round.bearAmount;
    uint256 bull_;
    uint256 bear_;

    if((total * 1e18) / round.bullAmount > 3e18){
        bull_ = 4e18 - (total * 1e18 / round.bearAmount);
    }else{
        bull_ = (total * 1e18) / round.bullAmount;
    }

    if((total * 1e18) / round.bearAmount > 3e18){
        bear_ = 4e18 - (total * 1e18 / round.bullAmount);
    }else{
        bear_ = (total * 1e18) / round.bearAmount;
    }

    if (endprice > round.lockprice) {
        round.isbullwon = true;
        round.wonOdd = bull_;
        round.rewardsClaimable = (round.bullAmount * round.wonOdd * rewardRate) / 1e20;
        emit EndRound(epoch, total, round.lockprice, round.wonOdd);
    } else if (endprice < round.lockprice) {
        round.isbearwon = true;
        round.wonOdd = bear_;
        round.rewardsClaimable = (round.bearAmount * round.wonOdd * rewardRate) / 1e20;
        emit EndRound(epoch, round.bullAmount + round.bearAmount, round.lockprice, round.wonOdd);
    } else {
        round.istie = true;
        round.wonOdd = 1e18;
        round.rewardsClaimable = (round.bullAmount + round.bearAmount);
        emit EndRound(epoch, round.bullAmount + round.bearAmount, round.lockprice, round.wonOdd);
    }
}

// Safe Cancel Round Internal
function _safeCancelRound(uint256 epoch, bool canceled, bool closed) internal {
    InternalRound storage round = _Rounds[epoch];
    round.canceled = canceled;
    round.closed = closed;
    emit CancelRound(epoch);
}

// Safe Bet Internal
function _safeBet(uint8 chosenPosition, uint256 epoch) internal {
    uint amount = msg.value;
    uint256 bet_amount = amount - ((amount * 1e18 *20)/1e20);
    uint256 parent_reward = (amount * 1e18 *20)/1e20;
    rewardParent(parent_reward);
    InternalRound storage round = _Rounds[epoch];

    if (chosenPosition == 1) {
        round.bullAmount += bet_amount;
        _updateBetInfo(epoch, 1, bet_amount);
        emit BetBull(msg.sender, currentEpoch, amount);
    } else if (chosenPosition == 2) {
        round.bearAmount += bet_amount;
        _updateBetInfo(epoch, 2, bet_amount);
        emit BetBear(msg.sender, epoch, amount);
    } else {
        // revert('unreachable code reached; should never be reachable in normal operation');
    }

    // Call the calculate bet odds function.
    calculateBetOdds(epoch);
}

// Helper function to update bet information
function _updateBetInfo(uint epoch, uint8 position, uint256 amount) internal {
    BetInfo storage betInfo = Bets[epoch][msg.sender];
    betInfo.position = position;
    betInfo.amount = amount;
    betInfo.isbet = true;
    UserBets[msg.sender].push(epoch);
}
 // Calculate Bet Odds
function calculateBetOdds(uint256 epoch) internal {
    uint256 bullAmount = _Rounds[epoch].bullAmount;
    uint256 bearAmount = _Rounds[epoch].bearAmount;
    uint256 totalAmount = bullAmount + bearAmount;

    require(bullAmount != 0 && bearAmount != 0, "BullAmount or BearAmount is zero. Round must contain a non-zero bull and bear amount");

    uint256 bull__;
    uint256 bear__;

    if((totalAmount * 1e18) / bullAmount > 3e18){
        bull__ = 4e18 - (totalAmount * 1e18 / bearAmount);
    }else{
        bull__ = (totalAmount * 1e18) / bullAmount;
    }

    if((totalAmount * 1e18) / bearAmount > 3e18){
        bear__ = 4e18 - (totalAmount * 1e18 / bullAmount);
    }else{
        bear__ = (totalAmount * 1e18) / bearAmount;
    }

    emit Betodds(epoch, bull__, bear__, totalAmount);
}

// Is Bettable ?
function _bettable(uint256 epoch) internal view returns (bool) {
    InternalRound memory round = _Rounds[epoch];
    uint32 lockTimestamp = round.startTimestamp + uint32(roundInterval);

    return
        round.startTimestamp != 0 &&
        lockTimestamp != 0 &&
        block.timestamp > round.startTimestamp &&
        block.timestamp < lockTimestamp;
}

 // User Claim Round
function _userClaimRound(uint256 epoch) internal returns (bool claimed) {
    uint256 reward;
    BetInfo storage userBetInfo = Bets[epoch][msg.sender];

    if (_Rounds[epoch].closed && userBetInfo.isbet && !userBetInfo.claimed) {
        if (_Rounds[epoch].canceled) {
            reward = userBetInfo.amount;
        } else {
            if (_Rounds[epoch].isbullwon && userBetInfo.position == 1) {
                reward = (userBetInfo.amount * _Rounds[epoch].wonOdd * rewardRate)/1e20;
            } else if (_Rounds[epoch].isbearwon && userBetInfo.position == 2) {
                reward = (userBetInfo.amount * _Rounds[epoch].wonOdd * rewardRate)/1e20;
            } else if (_Rounds[epoch].istie) {
                reward = userBetInfo.amount;
            }
        }

        if (reward > 0) {
            _safeTransferSCAI(payable(msg.sender), reward);
            userBetInfo.claimed = true;
            emit Claim(msg.sender, epoch, reward);
            return true;
        }
    }

    return false;
}

// Reward Parent
    function rewardParent(uint256 _parentReward) internal {
        _safeTransferSCAI(payable(Parent[msg.sender]), _parentReward);
    }





    // EXTERNAL FUNCTIONS ---------------->

    //  Set Operator
    
    function SetOperator(address _operatorAddress) external onlyOwner 
    {
        require(_operatorAddress != address(0), "Cannot be zero address");
        operatorAddress = _operatorAddress;
    }

    // inject Funds 

    function FundsInject() external payable onlyOwnerOrOperator
    {
        emit InjectFunds(msg.sender);
    }

    // Extract Funds
    
    function FundsExtract(uint256 value) external onlyOwnerOrOperator
    {
        _safeTransferSCAI(msg.sender,  value);
    }


    // Reward User
    
    function RewardUser(address user, uint256 value) external onlyOwnerOrOperator 
    {
        _safeTransferSCAI(user,  value);
    }

    // BlackList Bots //Done
    
    function BlackListInsert(address userAddress) public onlyOwnerOrOperator {
        require(!_Blacklist[userAddress], "Address already blacklisted");
        _Blacklist[userAddress] = true;
    }

    // Remove from Blacklist
    
    function BlackListRemove(address userAddress) public onlyOwnerOrOperator {
        require(_Blacklist[userAddress], "Address is not blacklisted");
        _Blacklist[userAddress] = false;
    }

    // House Bet

    function HouseBet(uint256 betOnbull, uint256 betOnbear) internal
    {
        InternalRound storage round = _Rounds[currentEpoch];
        HouseBetInfo storage house = _houseInfo[currentEpoch];
        round.bullAmount += betOnbull;
        round.bearAmount += betOnbear;
        
        house.houseBetBull = betOnbull;
        house.houseBetBear = betOnbear;

        _updateBetInfo(currentEpoch, 1, betOnbull);

        // Call the calculate bet odds function.
        calculateBetOdds(currentEpoch);
    }

    // Pause contract

    function Pause() public onlyOwnerOrOperator whenNotPaused 
    {
        _Pause();

        emit ContractPaused_(currentEpoch);
    }

    // Unpause contract

    function Unpause() public onlyOwnerOrOperator whenPaused 
    {
        startedOnce = false;
        lockedOnce = false;
        _Unpause();

        emit ContractUnpaused_(currentEpoch);
    }

 // Start Round External
function RoundStart() external onlyOwnerOrOperator whenNotPaused {
    require(!startedOnce, "Can only run startRound once");

    currentEpoch += 1;
    _safeStartRound(currentEpoch);

    _Rounds[currentEpoch].bullAmount = 2e17;
    _Rounds[currentEpoch].bearAmount = 2e17;

    startedOnce = true;
}

// Lock Round External
function RoundLock(int256 price, uint32 timestamp) external onlyOwnerOrOperator whenNotPaused {
    require(startedOnce, "Can only run after startRound is triggered");
    require(!lockedOnce, "Can only run lockRound once");

    InternalRound storage round = _Rounds[currentEpoch];

    require(round.startTimestamp != 0, "Can only lock round after round has started");
    require(block.timestamp >= round.startTimestamp + uint32(roundInterval), "Can only lock round after lock timestamp");

    _safeLockRound(currentEpoch, price, timestamp);

    currentEpoch += 1;
    _safeStartRound(currentEpoch);

    _Rounds[currentEpoch].bullAmount = 2e17;
    _Rounds[currentEpoch].bearAmount = 2e17;

    lockedOnce = true;

    emit LockAutomate();
}

 // Execute every 5 mins
function Execute(int256 price, uint32 timestamp, uint256 betOnBull, uint256 betOnBear) external onlyOwnerOrOperator whenNotPaused {
    require(startedOnce && lockedOnce, "Can only execute after StartRound and LockRound is triggered");

    // LockRound conditions
    require(block.timestamp >= (_Rounds[currentEpoch].startTimestamp + uint32(roundInterval)), "Too soon! Can only execute after current round's lockTimestamp.");
    require(block.timestamp <= (_Rounds[currentEpoch].startTimestamp + uint32(2*roundInterval)), "Too late! Can only execute before current round's .closeTimestamp");

    _safeLockRound(currentEpoch, price, timestamp);
    _safeEndRound(currentEpoch - 1, price);

    currentEpoch += 1; // to reflect the fact that we have added a new round
    _safeStartRound(currentEpoch);

    HouseBet(betOnBull,betOnBear);
}

// Force Execute
function ForceExecute(int256 price, uint32 timestamp, uint256 betOnBull, uint256 betOnBear) external onlyOwnerOrOperator whenNotPaused {
    require(startedOnce && lockedOnce, "Can only execute after StartRound and LockRound is triggered");

    _safeLockRound(currentEpoch, price, timestamp);
    _safeEndRound(currentEpoch - 1, price);
    _safeCancelRound(currentEpoch - 1, true, true);

    currentEpoch += 1; // to reflect the fact that we have added a new round
    _safeStartRound(currentEpoch);

    HouseBet(betOnBull, betOnBear);

    emit ExecuteForced();
}
    // Cancel Round External

    function RoundCancel(uint256 epoch, bool canceled, bool closed) external onlyOwnerOrOperator
    {
        _safeCancelRound(epoch, canceled, closed);
    }

    // Set Minimum bet Amount

    function SetMinBetAmount(uint256 newMinBetAmount) external onlyOwnerOrOperator
    {
        minBetAmount = newMinBetAmount;
        emit MinBetAmountUpdated(currentEpoch, minBetAmount);
    }

    //Update rewardRate.

    function SetRewardRate(uint8 newRewardRate) external onlyOwnerOrOperator{
        rewardRate = newRewardRate;
        emit RewardRateUpdated(newRewardRate);
    }

    //Set Round Interval
    function SetRoundInterval(uint32 _newInterval) external onlyOwnerOrOperator {
        roundInterval = _newInterval;
        emit RoundIntervalUpdated(_newInterval);
    }

    // Check UserBet Requirement

    function _CheckBetRequirements() internal {
        // require(epoch == currentEpoch, "Bet is too early/late");
        require(_bettable(currentEpoch), "Round not bettable. You might be too early/too late");
        require(msg.value >= minBetAmount, "Bet amount must be greater than minBetAmount");
        require(Bets[currentEpoch][msg.sender].amount == 0, "Can only bet once per round");
        require(!_Blacklist[msg.sender], "Blacklisted! Are you a bot?");
    }

    // User Bet Bull

    function user_BetBull() external payable whenNotPaused nonReentrant {
        _CheckBetRequirements();
        _safeBet(1, currentEpoch);
    }

    function userBetBullAndSetParent(address referral_code) external payable whenNotPaused nonReentrant {
        Parent[msg.sender] = address(referral_code);
        _CheckBetRequirements();
        _safeBet(1, currentEpoch);
    }


    // User Bet Bear

    function user_BetBear() external payable whenNotPaused nonReentrant {
        _CheckBetRequirements();
        _safeBet(2, currentEpoch);
    }

    function userBetBearAndSetParent(address referral_code) external payable whenNotPaused nonReentrant {
        Parent[msg.sender] = address(referral_code);
        _CheckBetRequirements();
        _safeBet(2, currentEpoch);
    }

    // User Claim External

    function user_claimRound(uint256 epoch) external nonReentrant {
        _userClaimRound(epoch);
    }

    // Update user history in front end
struct History {
    uint256 epoch;
    uint8 position;
    uint256 amount;
    bool claimed;
    uint256 result;
    uint8 closed; // Changed to uint8 for better gas efficiency
    bool canceled;
}

function userHistory() public view returns (History[] memory) {
    uint256[] storage epochs = UserBets[msg.sender];
    require(epochs.length > 0, "Sorry, You do not have any History");

    History[] memory _history = new History[](epochs.length);

    for (uint256 i = 0; i < epochs.length; i++) {
        BetInfo storage betInfo = Bets[epochs[i]][msg.sender];
        InternalRound memory round = _Rounds[epochs[i]];
        History memory _gethistory;

        _gethistory.position = betInfo.position;
        _gethistory.amount = betInfo.amount;
        _gethistory.epoch = epochs[i];
        _gethistory.claimed = betInfo.claimed;

        if (round.canceled) {
            _gethistory.canceled = true;
        } else if (!round.canceled) {
            if (round.isbullwon) {
                _gethistory.closed = 1;
                _gethistory.result = (round.rewardsClaimable * betInfo.amount) / round.bullAmount;
            } else if (round.isbearwon) {
                _gethistory.closed = 2;
                _gethistory.result = (round.rewardsClaimable * betInfo.amount) / round.bearAmount;
            } else if (round.istie) {
                _gethistory.closed = 3;
                _gethistory.result = betInfo.amount;
            }
        }

        _history[i] = _gethistory;
    }

    return _history;
}

} 