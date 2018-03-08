import enumNames from "../modules/enum.js";
import oa from 'object-assign';

const initialState = {
  win: enumNames.MENU,
  tab: 2
};

export default (state = initialState, action) => {
  switch (action.type) {
    case enumNames.SET_STATE:
      return setState(state, action.data);
    break;
    case enumNames.SET_TAB:
      return setTab(state, action.data);
    break;
    case enumNames.RUN_TEST:
      return setState(state, action.data.win);
    break;
    case enumNames.CLOSE_TEST:
      return setState(state, action.data.win);
    break;
    default:
      return state;
  };
};

const setState = (state, win) => {
  let newState = oa({}, state);
  newState.win = win;
  return newState;
};

const setTab = (state, tab) => {
  let newState = oa({}, state);
  newState.tab = tab;
  return newState;
};
