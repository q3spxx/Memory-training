import enumNames from "../modules/enum.js";

export const updateNN = (data) => {
  return {
    type: enumNames.UPDATE_NN,
    data: data
  };
};
