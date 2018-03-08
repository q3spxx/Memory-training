'use babel';

import React from 'react';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import tm from '../modules/tests.js';
import {connect} from 'react-redux';
import {runTest} from "../actions/testsActions.js";
import palette from '../styles/palette.js';

class TestsMenu extends React.Component {
  handleClick (type) {
    tm.run(type);
    this.props.openTestWindow(type);
  }
  componentDidMount () {
    if (!this.props.loaded) tm.loadTests();
  }
  render () {
    return (
      <div>
        {
          this.props.menu.map((test, i) => {
            return (
              <Paper style={{overflow: "auto", marginTop: "6px"}} key={i}>
                <div className="test-menu-li-title">
                  <Typography style={{color: palette.textPrimary,
                                      fontFamily: "Oswald"}}
                              type="title">{test.label}</Typography>
                </div>
                <div className="test-menu-li-button">
                  <Button
                    className="test-menu-button-start"
                    style={{float: "right",
                            backgroundColor: palette.secondary,
                            color:  palette.textSecondary
                            }}
                    onClick={event => this.props.run(test.name)}>Start</Button>
                </div>
              </Paper>
            );
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loaded: state.tests.loaded,
    menu: state.tests.menu
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    run: name => dispatch(runTest(name))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestsMenu);
