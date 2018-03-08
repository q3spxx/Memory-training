import enumNames from "../modules/enum.js";

export const updateDictionary = (dictionary) => {
  return {
    type: enumNames.UPDATE_DICTIONARY,
    data:  dictionary,
    loading: true
  };
};

export const loadingDictionary = (loading) => {
  return {
    type: enumNames.LOADING_DICTIONARY,
    data:  loading
  };
};

export const setChecked = (index) => {
  return {
    type: enumNames.SET_CHECKED,
    data: index
  };
};

export const changePage = (page) => {
  return {
    type: enumNames.CHANGE_PAGE,
    data: page
  };
};

export const changeRowsPerPage = (rowsPerPage) => {
  return {
    type: enumNames.CHANGE_ROWS_PER_PAGE,
    data: rowsPerPage
  };
};

export const setCheckedAll = () => {
  return {
    type: enumNames.SET_CHECKED_ALL
  };
};

export const changeSort = (index) => {
  return {
    type: enumNames.CHANGE_SORT,
    data: index
  };
};
