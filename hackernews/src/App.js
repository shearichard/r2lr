import React, { Component } from 'react';
import './App.css';


const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
//
//
const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const midSmallColumn = {
  width: '20%',
};
const smallColumn = {
  width: '10%',
};
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
const Search = ({ 
  value, 
  onChange, 
  onSubmit, 
  children 
  }) =>
  <form onSubmit={onSubmit}>
    {children} <input
      type='text'
      value={value}
      onChange={onChange}
      
    />
  </form>

//
//  T A B L E  F U N C T I O N A L  S T A T E L E S S  C O M P O N E N T
//
const Table = ({ list, onDismiss }) =>
    <div className="table">
      {list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.points}</span>
          <span style={smallColumn}>
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

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

  }
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result){
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
      
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey] : { hits: updatedHits, page } 
      }
    });
  }

  fetchSearchTopStories(searchTerm, page = 0){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState( { error: e } ));
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState( { searchKey: searchTerm } )
    this.fetchSearchTopStories(searchTerm);
  }
  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  } 
  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState( { searchKey: searchTerm } )

    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  } 
  onDismiss(id){
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;

    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { 
        ...results, 
        [searchKey]: { hits: updatedHits, page }
      }
    });
  } 
  render() {
    const {
      searchTerm, 
      results,
      searchKey,
      error
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { error
          ?
          <div className="page">
            <h1>Error</h1>
            <p>Something went wrong. Error was</p>
            <p><strong>{error.message}</strong></p>
          </div>
          :
          <Table 
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}
export default App;
