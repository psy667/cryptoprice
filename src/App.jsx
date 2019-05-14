import React, { Component } from 'react';
import './App.css';
import testData from './test';
import ListItem from './components/ListItem.jsx';

import io from 'socket.io-client';

class App extends Component {

  constructor(props){
    super(props);


    this.dict = {
      number: '#',
      name: 'Name',
      marketCap: 'Market Cap.',
      change: 'Change',
      price: 'Price'
    },

    this.state = {
      rawData: testData,
      filterData: testData,
      users: '',
      sorting: {
        number: true,
        name: null,
        marketCap: null,
        change: null,
        price: null
      }
    };
  }
  toggleSortOrder = prop => {
    const oldSorting = this.state.sorting;
    const newSorting = {};
    Object.keys(oldSorting).map(item => {
      newSorting[item] = item === prop ? !oldSorting[item] : null;
    });
    this.setState({sorting: newSorting});
  }
  sort = (prop, desc = true)  => {
    const filterData = this.state.rawData.slice();

    if(typeof filterData[0][prop] === 'number'){
      filterData.sort((a, b) => b[prop] - a[prop]);
    } else{
      filterData.sort();
    }
    this.setState({filterData: desc === true ? filterData : filterData.reverse()});
  }
  handleSort = prop => () => {
    const order = this.state.sorting[prop];
    this.sort(prop, order);
    this.toggleSortOrder(prop);
  }
  componentDidMount(){
    this.socket = io();
    this.socket.on('event', (msg) => {
      this.setState({rawData: msg});
      const [sortProp, order] = Object.entries(this.state.sorting).filter(item => item[1] !== null)[0];

      // console.log(sor)
      this.sort(sortProp, !order);
      // this.toggleSortOrder(sortProp);
      console.log(msg);
    });

    this.socket.on('users', data => {
      console.log(data);
      this.setState({users: data});
    });
    // this.sort('price', 1)();
  }
  render() {
    const orderArrow = prop => this.state.sorting[prop] ? <span className='arrow arrowUp'></span> :  <span className='arrow arrowDown'></span>;

    const renderHeadList = Object.keys(this.dict).map(item => {
      return <button key={item} className={item+' sorting'} onClick={this.handleSort(item)}>{this.dict[item]}{orderArrow(item)}</button>;
    });

    const renderList = this.state.filterData.map(item => {
      return <ListItem data={item} key={item.number}/>;
    });


    return (
      <div className="App">
        <header className="App-header">
          <div className='logo'>CryptoTop</div>
          <a className='btn' href='https://github.com/psy667/cryptoprice'>GitHub</a>
        </header>
        <main>
          <div className='table'>
            <div className='table-head'>
              { renderHeadList }
            </div>
            <div className='table-items'>
              { renderList }
            </div>
            <div className='users-counter'>Online users: {this.state.users}</div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
