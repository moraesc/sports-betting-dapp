import React from 'react';
import './App.css';

import getWeb3 from './utils/getWeb3.js';
import Team from './Team.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      web3: '',
      address: ''
    }
  }

  teams = ['A', 'B'];

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
        {this.teams.map((team) => (
          <div className='team'>
            <Team team={team} />
          </div>
        ))}
      </div>
    );
  }
}

export default App;
