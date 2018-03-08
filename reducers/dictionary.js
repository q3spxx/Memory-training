import enumNames from "../modules/enum.js";
import oa from 'object-assign';

const initialState = {
  loading: false,
  loaded: false,
  rows: [],
  view: [],
  page: 0,
  rowsPerPage: 10,
  checkedAll: false,
  updateButton: false,
  indexCheckedRow: null,
  titles: [
    {label: enumNames.WORD_TITLE, active: false, direction: "asc", property: "word", numeric: false},
    {label: enumNames.TRANSLATION_TITLE, active: false, direction: "asc", property: "translation", numeric: false},
    {label: enumNames.TYPE_TITLE, active: false, direction: "asc", property: "type", numeric: false},
    {label: enumNames.RATING_TITLE, active: true, direction: "desc", property: "rating", numeric: true}
  ],
  sort: 3
};

export default (state = initialState, action) => {
  switch (action.type) {
    case enumNames.UPDATE_DICTIONARY:
      return oa({}, state, updateDictionary(state.titles, state.sort, action.data));
    break;
    case enumNames.LOADING_DICTIONARY:
      return oa({}, state, loadingDictionary(action.data));
    break;
    case enumNames.SET_CHECKED:
      return oa({}, state, setChecked(state.view, action.data));
    break;
    case enumNames.SET_CHECKED_ALL:
      return oa({}, state, setCheckedAll(state.view, state.checkedAll));
    break;
    case enumNames.CHANGE_PAGE:
      return oa({}, state, changePage(action.data));
    break;
    case enumNames.CHANGE_ROWS_PER_PAGE:
      return oa({}, state, changeRowsPerPage(action.data));
    break;
    case enumNames.CHANGE_SORT:
      return oa({}, state, changeSort(state.titles, state.sort, state.view, action.data));
    break;
    default:
      return state;
  };
}

const updateDictionary = (titles, sort, data) => {
  let view = data.map((row) => {
    return {
      row: {
        id: row.id,
        word: row.word,
        translation: row.translation,
        type: row.type,
        rating: row.rating
      },
      checked: false
    };
  });
  return {
    loading: false,
    loaded: true,
    checkedAll: false,
    updateButton: false,
    indexCheckedRow: null,
    rows: data,
    view: sortFunc(view, titles[sort].property, titles[sort].direction)
  };
};

const loadingDictionary = (data) => {
  return {
    loading: data
  };
};

const setChecked = (state, index) => {
  let view = [...state];
  view[index].checked = !view[index].checked;

  let checked = false;
  let indexCheckedRow = null;
  for (let i = 0; i < view.length; i++) {
    if (view[i].checked && checked) {
      indexCheckedRow = null;
      checked = false;
      break;
    };
    if (view[i].checked && !checked) {
      indexCheckedRow = i;
      checked = true;
    };
  };

  return {
    view: view,
    updateButton: checked,
    indexCheckedRow: indexCheckedRow
  };
};

const changePage = (page) => {
  return {
    page: page
  };
};

const changeRowsPerPage = (rowsPerPage) => {
  return {
    rowsPerPage: rowsPerPage
  };
};

const setCheckedAll = (state, checked) => {
  checked = !checked;
  state = state.map((row) => {
    row.checked = checked;
    return row;
  });
  return {
    view: state,
    checkedAll: checked
  };
};

const changeSort = (titles, sort, view, index) => {
  titles = [...titles];
  if (titles[index].active) {
    titles[index].direction === "desc" ? titles[index].direction = "asc" : titles[index].direction = "desc";
  } else {
    titles[sort].active = false;
    titles[index].active = true;
  };
  view = sortFunc(view, titles[index].property, titles[index].direction);
  return {
    titles,
    sort: index,
    view
  };
};

const sortFunc = (arr, property, order) => {
  return order === "desc"
  ? arr.sort((a, b) => (b.row[property] < a.row[property] ? -1 : 1))
  : arr.sort((a, b) => (a.row[property] < b.row[property] ? -1 : 1));
};
