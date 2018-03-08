'use babel';

import React from 'react';
import Main from './main.jsx';
import {Provider} from 'react-redux';
import store from '../modules/store.js';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Main />
        </Provider>
      </div>
    );
  }
}
