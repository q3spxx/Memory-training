import enumNames from "../modules/enum.js";

export const setState = (data) => {
  return {
    type: enumNames.SET_STATE,
    data: data
  };
};

export const setTab = (data) => {
  return {
    type: enumNames.SET_TAB,
    data: data
  };
};
