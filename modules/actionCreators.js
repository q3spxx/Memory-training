import enumNames from "./enum.js";

export const updateDictionary = (dictionary, loading) => {
  return {
    type: enumNames.UPDATE_DICTIONARY,
    dictionary:  dictionary,
    loading: loading
  };
};

export const loadingDictionary = (loading) => {
  return {
    type: enumNames.LOADING_DICTIONARY,
    loading:  loading
  };
};

export const setCheck = (i) => {
  return {
    type: enumNames.SET_CHECK,
    i:  i
  };
};
