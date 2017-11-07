import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 3,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 2,
    objectID: 1,
  },
];
//isSearchedES5 is just illustrate how this would have been
//implemented prior to ES6
function isSearchedES5(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}
//
//
const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());
//
// B U T T O N  F U N C T I O N A L  S T A T E L E S S  C O M P O N E N T
//
const Button = ({ onClick, className, children }) => 
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
//
// S E A R C H  F U N C T I O N A L  S T A T E L E S S  C O M P O N E N T
//
const Search = ({ value, onChange, children }) =>
  <form>
    {children} <input
      type='text'
      value={value}
      onChange={onChange}
    />
  </form>

//
//  T A B L E  F U N C T I O N A L  S T A T E L E S S  C O M P O N E N T
//
const Table = ({ list, pattern, onDismiss }) =>
    <div className="table">
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
          <span>
            <Button 
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      )}
    </div>
//
//  A P P  C O M P O N E N T
//
class App extends Component {
  constructor(props) {
    super(props);

    let rightnow = new Date().toISOString();

    this.state = {
      list, 
      rightnow,
      searchTerm: '',
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

  }
  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  } 
  onDismiss(id){
    function isNotId(item) {
      return item.objectID !== id;
    }
    // eslint-disable-next-line
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  } 
  //Equivalent (currently unused) to onDismiss but using arrow function
  onDismissES6Style(id){
    const isNotId = item => item.objectID !== id;
    // eslint-disable-next-line
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  } 
  render() {
      const {searchTerm, list } = this.state;
      return (
        <div className="page">
          <div className="interactions">
            <Search 
              value={searchTerm}
              onChange={this.onSearchChange}
            >
              Search
            </Search>
            <Table 
              list={list}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          </div>
        </div>
      );
  }
}
export default App;
