import React from 'react';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import {connect} from "react-redux";
import {close, changeForm, change} from "../actions/formActions.js";

class Form extends React.Component {
  constructor () {
    super();
    this.submit = this.submit.bind(this);
  }
  submit () {
      let data = {};
      this.props.inputs.forEach((input) => {
        data[input.key] = input.value;
      });
      this.props.submit(data);
  }
  getInput (input, i) {
    switch (input.type) {
      case "text":
        return <TextField
          name={input.key}
          key={input.key}
          label={input.label}
          value={input.value}
          onChange={event => this.props.change({id: i, value: event.target.value})}
          margin="normal"
        />
      break;
      case "select":
        return <TextField
          name={input.key}
          select
          key={input.key}
          label={input.label}
          value={input.value}
          onChange={event => this.props.change({id: i, value: event.target.value})}
          margin="normal"
          >
          {
            input.options.map((option, i) => {
              return <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            })
          }
          </TextField>
        break;
        default: return ""
    }
  }
  render () {
      return (
        <Dialog onRequestClose={this.props.close} open={this.props.opened}>
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>
            {
              this.props.inputs.map((input, i) => {
                return this.getInput(input, i);
              })
            }
          </DialogContent>
          <DialogContent>
            <Button onClick={this.submit}>ok</Button>
            <Button onClick={this.props.cancel}>cancel</Button>
          </DialogContent>
        </Dialog>
      );
  }
};

const mapStateToProps = (state) => {
  return {
    opened: state.form.opened,
    inputs: state.form.inputs,
    title: state.form.title,
    type: state.form.type,
    submit: state.form.submit
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    change: data => dispatch(change(data)),
    cancel: () => dispatch(close())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
