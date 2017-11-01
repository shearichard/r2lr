import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 7,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 7,
    objectID: 1,
  },
];

class App extends Component {
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  constructor(props) {
    super(props);

    let rightnow = new Date().toISOString();

    this.state = {
      list, 
      rightnow,
    };

    this.onDismiss = this.onDismiss.bind(this);

  }
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  render() {
      return (
          <div className="App">
              {this.state.list.map(item => {
                  /****************************************/
                  const onHandleDismiss = () =>
                      this.onDismiss(item.objectID);
                  /****************************************/
                  return (
                      <div key={item.objectID}>
                          <span>
                              <a href={item.url}>{item.title}</a>
                          </span>
                          <span>{item.author}</span>
                          <span>{item.num_comments}</span>
                          <span>{item.points}</span>
                          <span>
                          <button
                              onClick={onHandleDismiss}
                              type="button"
                          >
                              Dismiss
                          </button>
                      </span>
                  </div>
              );
          }
          )}
      </div>
      );
  }

}






export default App;
