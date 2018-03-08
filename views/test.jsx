'use babel';

import React from 'react';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import {red, grey, green} from 'material-ui/colors';
import tm from '../modules/tests.js';
import {connect} from "react-redux";
import {setAnswer, closeTest} from "../actions/testsActions.js";
import { CircularProgress } from 'material-ui/Progress';
import manifest from '../manifest.json';


class Test extends React.Component {
  constructor () {
    super();
    this.state = {
      style: {
        paper: {
          height: "700px"
        },
        close: {
          float: "right"
        }
      }
    };
    this.callback = this.callback.bind(this);
  }
  callback (event) {
    if (event.keyCode == 13) {
      tm.executor();
      this.setState({});
    };
  }
  componentDidMount () {
    document.addEventListener("keydown", this.callback);
    tm.run();
  }
  componentWillUnmount () {
    document.removeEventListener("keydown", this.callback);
  }
  getResult () {
    return (
      <div className="test-result">
        {
          this.props.result.map((field, i) => {
            return (
              <Typography style={{color: grey[800]}} type="title" key={i}>
                {`${field.label}: ${field.value}`}
              </Typography>
            );
          })
        }
        <div className="test-result-button">
          <Button>repeat</Button>
        </div>
      </div>
    );
  }
  getResultColor () {
    if (this.props.questionResult.right) {
      return green[800];
    } else {
      return red[800];
    }
  }
  getForm () {
    return (
      <div className="test-form">
        <Typography style={{color: grey[900]}} type="display2" align="center">{this.props.question.word}</Typography>
        <Typography style={{color: grey[800]}} type="title" align="center">{this.props.question.type}</Typography>
        {this.props.error ? <Typography style={{color: red[900]}} className="test-answer-error" type="title" align="center">{this.props.errorText}</Typography> : ""}
        {!tm.execution ?
          <div className="test-form-answer">
            <div className="test-form-input">
              <TextField
                style={{width: "140px"}}
                autoFocus={true}
                value={this.props.answer}
                error={this.props.error}
                onChange={event => this.props.setAnswer(event.target.value)}
                />
            </div>
            <div className="test-form-button">
              <Button onClick={event => tm.executor()}>reply</Button>
            </div>
          </div>
          : ""
        }
      </div>
    );
  }
  render () {
    return (
      <div className="test-wrapper">
        {
          this.props.loading ? <CircularProgress  thickness={7} /> :
          <Paper style={this.state.style.paper}>
            <Button style={this.state.style.close} onClick={this.props.close}>close</Button>
            {this.props.questionResult.active ? <Typography style={{color: this.getResultColor()}} className="test-question-result" type="display1" align="center">{this.props.questionResultText}</Typography> : ""}
            {
              this.props.completed ? this.getResult() : this.getForm()
            }
          </Paper>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    completed: state.tests.test.completed,
    result: state.tests.test.result,
    questionResult: state.tests.test.questionResult,
    questionResultText: state.tests.test.questionResultText,
    error: state.tests.test.error,
    errorText: state.tests.test.errorText,
    question: state.tests.test.question,
    answer: state.tests.test.answer,
    loading: state.tests.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAnswer: answer => dispatch(setAnswer(answer)),
    close: event => dispatch(closeTest())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
