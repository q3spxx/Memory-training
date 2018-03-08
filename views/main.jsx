'use babel';

import React from 'react';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import enumNames from '../modules/enum.js';
import Dictionary from './dictionary.jsx';
import dictionary from '../modules/dictionary.js';
import TestsMenu from "./testsMenu.jsx";
import Test from "./Test.jsx";
import tm from '../modules/tests.js';
import {open} from '../actions/formActions.js';
import store from "../modules/store.js";
import Form from "./form.jsx";
import {connect} from "react-redux";
import {setTab} from "../actions/mainActions.js";
import Settings from "./settings.jsx";
import {grey, indigo} from "material-ui/colors";
import Paper from 'material-ui/Paper';
import palette from '../styles/palette.js';
import nnm from '../modules/nnm.js';

const style = {
  color: grey[50]
};

class Main extends React.Component {
  componentDidMount () {
    if (!this.props.dictionaryLoaded) dictionary.getDictionary();
    if (!this.props.nnLoaded) nnm.getNN();
  }
  getContainer () {
    switch (this.props.tab) {
      case 0:
        return (<Dictionary />);
      break;
      case 1:
        return (<TestsMenu />);
      break;
      case 2:
        return (<Settings />);
      break;
    };
  }
  getWin () {
    switch (this.props.win) {
      case enumNames.MENU:
        return (
          <div className="main-wrapper">
            <Paper>
            <Tabs indicatorColor={palette.secondary}
                  style={{
                    backgroundColor: palette.primary,
                    color: palette.textSecondary
                  }}
                  indicatorClassName="tab-indicator"
                  className="tab"
                  value={this.props.tab}
                  onChange={this.props.setTab}>
              <Tab label={enumNames.DICTIONARY} />
              <Tab label={enumNames.TESTS} />
              <Tab label={enumNames.SETTINGS} />
            </Tabs>
            {this.getContainer()}
            </Paper>
          </div>
        );
      break;
      case enumNames.TEST:
        return <Test />;
      break;
    }
  }
  render() {
    return (
      <div>
        {this.props.form ? <Form /> : ""}
        {this.getWin()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tab: state.main.tab,
    win: state.main.win,
    form: state.form.opened,
    dictionaryLoaded: state.dictionary.loaded,
    nnLoaded: state.nn.loaded,
    test: state.tests.running
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTab: (event, value) => dispatch(setTab(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
