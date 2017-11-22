import React, { Component } from 'react';
import fetch from 'isomorphic-fetch'
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import './App.css';


const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

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
const smallColumn = {
  width: '10%',
};
//
//
//
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

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

//
// L O A D I N G  C O M P O N E N T
//
const Loading = () =>
  <div>Loading...</div>

const withLoading = (Component) => (props) =>
  props.isLoading
  ?
  <Loading />
  :
  <Component { ...props } />

const ButtonWithLoading = withLoading(Button);

//
// S E A R C H  F U N C T I O N A L  S T A T E L E S S  C O M P O N E N T
//
class Search extends Component {

  componentDidMount() {
    if(this.input) { 
      this.input.focus(); 
    };
  }

  render() {
    const {
      value, 
      onChange, 
      onSubmit, 
      children 
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        {children}
        <input
          type='text'
          value={value}
          onChange={onChange}
          ref={ (node) => { this.input = node; } }
        />
        {
        <button type="submit">
          {children}
        </button>        
        }
      </form>
    );
  }
}

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
//
// S O R T  C O M P O N E N T 
//
const Sort = ({ sortKey, onSort, children }) =>
  <Button 
    onClick={() => onSort(sortKey)}
    className='button-inline'
  >
    {children}
  </Button>
//
//  T A B L E  F U N C T I O N A L  S T A T E L E S S  C O M P O N E N T
//
//{list.map(item =>
//
const Table = ({ 
    list, 
    sortKey,
    onSort,
    onDismiss 
    }) =>
    <div className="table">
      <div className="table-header">
          <span style={{ width: '40%' }}>
              <Sort
              sortKey={'TITLE'}
              onSort={ onSort }
              >
              Title
              </Sort>
          </span>
          <span style={{ width: '30%' }}>
              <Sort
                  sortKey={'AUTHOR'}
                  onSort={ onSort }
              >
              Author
              </Sort>
          </span>
          <span style={{ width: '10%' }}>
              <Sort
                  sortKey={'COMMENTS'}
                  onSort={ onSort }
              >
              Comments
              </Sort>
          </span>
          <span style={{ width: '10%' }}>
              <Sort
                  sortKey={'POINTS'}
                  onSort={ onSort }
              >
              Points
              </Sort>
          </span>
          <span style={{ width: '10%' }}>
              Archive
          </span>
      </div>
      {SORTS[sortKey](list).map(item =>
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

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss : PropTypes.func.isRequired,
}

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};
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
      isLoading: false,
      sortKey: 'NONE',
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);

  }
  onSort(sortKey) {
    this.setState({ sortKey });
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
      },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page = 0){
    this.setState( { isLoading: true } )

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
      error,
      isLoading,
      sortKey
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
            list={ list }
            sortKey={ sortKey }
            onSort={ this.onSort } 
            onDismiss={ this.onDismiss }
          />
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}
export default App;

export {
  Button, 
  Search,
  Table,
}
