import {createStore} from "redux";
import {combineReducers} from 'redux';
import dictionary from '../reducers/dictionary.js';
import form from '../reducers/form.js';
import tests from '../reducers/tests.js';
import main from '../reducers/main.js';
import nn from '../reducers/nn.js';

const store = createStore(combineReducers({
  dictionary,
  form,
  tests,
  main,
  nn
}));

export default store;
