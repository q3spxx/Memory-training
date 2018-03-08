import enumNames from "../modules/enum.js";
import cd from 'clone-deep';

const initialState = {
  menu: [],
  modules: {},
  running: false,
  loading: false,
  loaded: false,
  test: {
    question: {},
    answer: "",
    deck: [],
    tempDeck: [],
    questionResult: {
      right: true,
      active: false
    },
    questionResultText: "",
    error: false,
    errorText: "",
    completed: false,
    result: []
  }
};

export default (state = cd(initialState), action) => {
  switch (action.type) {
    case enumNames.UPDATE_TESTS:
      return updateTests(state, action.data);
    break;
    case enumNames.RUN_TEST:
      return run(state, action.data.name);
    break;
    case enumNames.CLOSE_TEST:
      return close(state);
    break;
    case enumNames.SET_DECK:
      return setDeck(state, action.data);
    break;
    case enumNames.SET_QUESTION:
      return setQuestion(state, action.data);
    break;
    case enumNames.SET_ANSWER:
      return setAnswer(state, action.data);
    break;
    case enumNames.SET_ERROR:
      return setError(state, action.data);
    break;
    case enumNames.SET_RESULT:
      return setResult(state, action.data);
    break;
    case enumNames.SET_QUESTION_RESULT:
      return setQuestionResult(state, action.data);
    break;
    default:
      return state;
  };
};

const updateTests = (state, modulesTests) => {
  let newState = cd(state);
  let menu = [];
  for (let moduleTest in modulesTests) {
    menu.push({
      name: modulesTests[moduleTest].name,
      label: modulesTests[moduleTest].title
    });
  };
  newState.modules = modulesTests;
  newState.menu = menu;
  newState.loaded = true;
  return newState;
};

const run = (state, name) => {
  let newState = cd(state);
  newState.running = true;
  newState.loading = true;
  newState.test.testType = name;
  return newState;
};

const close = (state) => {
  let newState = cd(initialState);
  newState.menu = state.menu;
  newState.modules = state.modules;
  newState.loaded = true;
  return newState;
};

const setDeck = (state, deck) => {
  let newState = cd(state);
  newState.loading = false;
  newState.test.deck = deck;
  newState.test.tempDeck = deck.map((row, i) => {
    return {
      word: row.word,
      translation: row.translation,
      type: row.type,
      deckIndex: i
    };
  });
  return newState;
};

const setQuestion = (state, question) => {
  let newState = cd(state);
  newState.test.answer = "";
  newState.test.question = question;
  newState.test.questionResult = {
    right: true,
    active: false
  };
  return newState;
};

const setAnswer = (state, answer) => {
  let newState = cd(state);
  newState.test.answer = answer;
  return newState;
};

const setError = (state, data) => {
  let newState = cd(state);
  newState.test.error = data.error;
  newState.test.errorText = data.errorText;
  return newState;
};

const setQuestionResult = (state, result) => {
  let newState = cd(state);
  newState.test.questionResult.active = true;
  newState.test.questionResult.right = result.questionResult;
  newState.test.questionResultText = result.questionResultText;
  newState.test.deck = result.deck;
  newState.test.tempDeck = result.tempDeck;
  return newState;
};

const setResult = (state, result) => {
  let newState = cd(state);
  newState.test.result = result;
  newState.test.completed = true;
  newState.test.questionResult.active = false;
  return newState;
};
