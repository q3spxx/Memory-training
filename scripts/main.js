import React from 'react';
import ReactDOM from 'react-dom';
import App from '../views/app.jsx';

window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('app'));
}
