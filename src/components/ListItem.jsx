import React from 'react';
import './ListItem.css';

export default class ListItem extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    const item = this.props.data;
    return (
    <div className='item'>
      <div className='values'>
        <span className='number'>{item.number}</span>
        <span className='name'>{item.name}<span className='shortName'>{item.shortName}</span></span>
        <span className='marketCap'>${item.marketCap}M</span>
        <span className={item.change > 0 ? 'change up' : 'change down'}>
            {item.change > 0 ? '+' : ''}{item.change}%
        </span>
        <span className='price'>${item.price}</span>
      </div>

      <div className={item.number === 1 ? 'chart' : 'chart'}>
        <div className=''></div>
      </div>
    </div>);
  }
}
