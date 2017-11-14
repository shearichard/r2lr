import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow }  from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App, { Search, Button, Table }  from './App';

Enzyme.configure( { adapter: new Adapter() } );

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <App />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});
describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search/>, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

});
describe('Button', () => {
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button/>, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Button/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('should contain a button element', () => {
    const element = shallow(
      <Button
        className="fooClass"
      >
      Test Label
      </Button>
    );

    expect(element.is('button')).toBe(true);
  });
  it('should contain the label passed to it', () => {
    const element = shallow(
      <Button
        className="fooClass"
      >
      Test Label
      </Button>
    );

    expect(element.text()).toBe("Test Label");
  });

});
describe('Table', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table { ...props } />, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Table { ...props } />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('shows two items in list', () => {
    const element = shallow(
      <Table { ...props } />
    );

    expect(element.find('.table-row').length).toBe(2);
  });
});
