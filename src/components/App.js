import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducer from '../store.js';
import Layout from './Layout';

let store = createStore (reducer);

const App = React.createClass ({
  render () {
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
  }
});

export default App;
