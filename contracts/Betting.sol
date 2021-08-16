pragma solidity >0.4.99;

contract Betting {
    address payable public owner;
    uint256 public minimumBet;
    uint256 public totalBetOne;
    uint256 public totalBetTwo;
    uint256 public numberOfBets;
    uint256 public maxAmountOfBets = 1000;
    
    address payable[] public players;
    
    struct Player {
        uint256 amountBet;
        uint16 teamSelected;
    }
    
    // Address of the player => the user info
    mapping(address => Player) public playerInfo;
    function() external payable {}

    constructor() public payable {
        owner = msg.sender;
        minimumBet = 100000000000000;
    }
    
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }
    
    // View - get result without needing a transaction (no gas because only your node has to run the calculation)
    function checkPlayerExists(address player) public view returns(bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == player) {
                return true;
            }
        }
        
        return false;
    }
    
    function bet(uint8 _teamSelected) public payable {
        // Check if player checkPlayerExists
        require(!checkPlayerExists(msg.sender));
        
        // Check if value sent by player is higher than minimum value
        require(msg.value >= minimumBet);
        
        // Set the player informations - amount of bet and team _teamSelected
        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].teamSelected = _teamSelected;
        
        // Add the address of the player to players address
        players.push(msg.sender);
        
        // Increment the stakes of the team selected with the player bet
        if (_teamSelected == 1) {
            totalBetOne += msg.value;
        } else {
            totalBetTwo += msg.value;
        }
    }
    
    function distributePrizes(uint16 teamWinner) public {
        // Create a temporary in memory array with fixed size
        address payable[1000] memory winners;
        
        uint256 count = 0; // Count for the array of winners
        uint256 loserBet = 0; // Takes the value of all losers bets 
        uint256 winnerBet = 0; // Takes the value of all winners bets 
        address add;
        uint256 playersBet;
        address payable playerAddress;
        
        // Loop through the player array to check who selected the winning team 
        for (uint256 i = 0; i < players.length; i++) {
            playerAddress = players[i];
            
            // If the player selected the winning team, we add his address to the winners array
            if (playerInfo[playerAddress].teamSelected == teamWinner) {
                winners[count] = playerAddress;
                count++;
            }
        }
        
        // Define which bet sum is the loser and which is the winner
        if (teamWinner == 1) {
            winnerBet = totalBetOne;
            loserBet = totalBetTwo;
        } else {
            winnerBet = totalBetTwo;
            loserBet = totalBetOne;
        }
        
        // Loop through the array of winners to give ethers to the winners
        for (uint256 j = 0; j < count; j++) {
            // Check that the address in this fixed array is not empty
            if (winners[j] != address(0)) {
                add = winners[j];
                playersBet = playerInfo[add].amountBet;
                
                // Transfer money to user
                winners[j].transfer((playersBet*(1000+(loserBet*1000/winnerBet)))/1000);
            }
        }
        
        delete playerInfo[playerAddress]; // Delete all players
        
        address payable[] memory empty_players_array;
        
        players = empty_players_array;
        
        // Reinitialize bets
        loserBet = 0;
        winnerBet = 0;
        totalBetOne = 0;
        totalBetTwo = 0;
    }
    
    function amountOne() public view returns(uint256) {
        return totalBetOne;
    }
    
    function amountTwo() public view returns(uint256) {
        return totalBetTwo;
    }
}