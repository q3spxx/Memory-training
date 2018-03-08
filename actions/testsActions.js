import enumNames from "../modules/enum.js";

export const updateTests = (data) => {
  return {
    type: enumNames.UPDATE_TESTS,
    data: data
  };
};

export const runTest = (name) => {
  return {
    type: enumNames.RUN_TEST,
    data: {
      name: name,
      win: enumNames.TEST
    }
  };
};

export const closeTest = () => {
  return {
    type: enumNames.CLOSE_TEST,
    data: {
      win: enumNames.MENU
    }
  };
}

export const setDeck = (data) => {
  return {
    type: enumNames.SET_DECK,
    data: data
  };
};

export const setQuestion = (data) => {
  return {
    type: enumNames.SET_QUESTION,
    data: data
  };
};

export const setAnswer = (data) => {
  return {
    type: enumNames.SET_ANSWER,
    data: data
  };
};

export const setError = (data) => {
  return {
    type: enumNames.SET_ERROR,
    data: data
  };
};

export const setQuestionResult = (data) => {
  return {
    type: enumNames.SET_QUESTION_RESULT,
    data: data
  };
};

export const setResult = (data) => {
  return {
    type: enumNames.SET_RESULT,
    data: data
  };
};
