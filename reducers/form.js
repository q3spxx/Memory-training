import enumNames from "../modules/enum.js";
import oa from 'object-assign';

const initialState = {
  opened: false,
  inputs: [],
  title: "Form",
  type: "",
  submit: () => {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case enumNames.CLOSE_FORM:
      return oa({}, state, close());
    break;
    case enumNames.OPEN_FORM:
      return oa({}, state, open(action.data));
    break;
    case enumNames.CHANGE_FORM:
      return oa({}, state, change(state.inputs, action.data));
    break;
    default:
      return state;
  };
};

const close = () => {
  return initialState;
};

const open = (data) => {
  return {
    opened: true,
    inputs: data.inputs,
    type: data.type,
    title: data.title,
    submit: data.submit
  };
};

const change = (inputs, data) => {
  inputs = [...inputs];
  inputs[data.id].value = data.value;
  return {
    inputs: inputs
  };
};
