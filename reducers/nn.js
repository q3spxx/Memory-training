import enumNames from "../modules/enum.js";
import cd from 'clone-deep';

const initialState = {
  loaded: false,
  nn: {}
};

export default (state = cd(initialState), action) => {
  switch (action.type) {
    case enumNames.UPDATE_NN:
      return updateNN(state, action.data);
    break;
    default:
      return state;
  };
};

const updateNN = (state, data) => {
  let newState = cd(state);
  newState.nn = JSON.parse(data.network);
  newState.loaded = true;
  return newState;
};
