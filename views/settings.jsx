import React from 'react';
import nnm from "../modules/nnm.js";

export default class Settings extends React.Component {
  render () {
    return (
      <div>
        <h1>
          Settings
        </h1>
        <button onClick={() => {nnm.setTrainingData()}}>run</button>
      </div>
    );
  }
}
