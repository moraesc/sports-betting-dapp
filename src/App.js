import React from 'react';
import logo from './logo.svg';
import './App.css';

import getWeb3 from './utils/getWeb3.js';
import TeamA from './TeamA.js';
import TeamB from './TeamB.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      web3: '',
      address: ''
    }
  }

  componentDidMount() {
    getWeb3.then(results => {
      results.web3.eth.getAccounts((error, acc) => {
        this.setState({
          address: acc[0],
          web3: results.web3
        })
      })
    }).catch(() => {
      console.log('Error finding web3');
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Welcome to my Ethereum Betting App. Your wallet address is {this.state.address}
          </p>
        </header>
        <div className='team-a'>
          <TeamA />
        </div>
        <div className='team-b'>
          {/* <TeamB /> */}
        </div>
      </div>
    );
  }
}

export default App;
