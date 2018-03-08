import enumNames from "../modules/enum.js";

export const close = () => {
  return {
    type: enumNames.CLOSE_FORM
  };
};

export const open = (data) => {
  return {
    type: enumNames.OPEN_FORM,
    data: data
  };
};

export const change = (data) => {
  return {
    type: enumNames.CHANGE_FORM,
    data: data
  };
};
