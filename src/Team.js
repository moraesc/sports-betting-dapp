import React from 'react';
import getWeb3 from './utils/getWeb3';
import BettingContract from './contracts/Betting.json';
import './App.css';

const contract = require('truffle-contract');

class Team extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: '',
            amount: '',
            input_amount: '',
            wei_conversion: 1000000000000000000
        }

        this.getAmount = this.getAmount.bind(this);
        this.bet = this.bet.bind(this);
        this.make_win = this.make_win.bind(this);
        this.handle_input_change = this.handle_input_change.bind(this);
    }

    team_letter_to_number = {
        A: 1,
        B: 2
    }

    componentDidMount(){
        getWeb3.then(results => {
          results.web3.eth.getAccounts( (error,acc) => {
            this.setState({
              web3: results.web3
            })
          });
          return(results.web3);
        }).then((results) => {
          this.getAmount(results);
        }).catch(() => {
          console.log('Error finding web3');
        })
      }

    bet() {
        const Betting = contract(BettingContract);
        Betting.setProvider(this.state.web3.currentProvider);
        let BettingInstance;

        this.state.web3.eth.getAccounts((error, accounts) => {
            Betting.deployed().then((instance) => {
                BettingInstance = instance;
            }).then((result) => {
                return(BettingInstance.bet(this.team_letter_to_number[this.props.team], {from: accounts[0], value: this.state.input_amount}));
            }).catch(() => {
                console.log('Error with betting');
            })
        })
    }

    getAmount(web3) {
        // Get contract using truffle-contract
        const Betting = contract(BettingContract);

        // Set provider of the contract on the current loaded provider (Metamask)
        Betting.setProvider(web3.currentProvider);

        let BettingInstance;

        web3.eth.getAccounts((error, accounts) => {
            Betting.deployed().then((instance) => {
                BettingInstance = instance;
            }).then((result) => {
                switch (this.props.team) {
                    case 'A':
                        return(BettingInstance.amountOne.call({from: accounts[0]}));
                    case 'B':
                        return(BettingInstance.amounntTwo.call({from: accounts[0]}));
                    default:
                        break;
                }
            }).then((result) => {
                this.setState({amount: result.c/1000})
            })
        })

    }

    make_win() {
        const Betting = contract(BettingContract);
        Betting.setProvider(this.state.web3.currentProvider);
        let BettingInstance;

        this.state.web3.eth.getAccounts((error, accounts) => {
            Betting.deployed().then((instance) => {
                BettingInstance = instance;
            }).then((result) => {
                return(BettingInstance.distributePrizes(this.team_letter_to_number[this.props.team], {from: accounts[0]}));
            }).catch(() => {
                console.log('Error with distributing prizes');
            })
        })
    }

    handle_input_change(event) {
        const value = event.target.value;
        const converted_value = value * this.state.wei_conversion;
        this.setState({input_amount: converted_value});
    }

    render() {
        return(
            <div>
                <h3>Team {this.props.team}</h3>
                <p>Total amount: {this.state.amount}</p>
                <p>Enter an amount to bet: </p>
                <input type='text' onChange={this.handle_input_change} required pattern='[0-9]*[.,][0-9]*'></input>
                <span>ETH</span>
                <br></br>
                <button onClick={this.bet}>Bet</button>
                <br></br>
                <button onClick={this.make_win}>Make this team win</button>
            </div>
        )
    }
}

export default Team;