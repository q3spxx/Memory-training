'use strict'
require('babel-register');
const DevNN = require('./dev/dev-nn.js');
const db = require('./modules/db.js');
const am = require('./modules/array-math.js');
const helper = require('./modules/helper.js');

class Dev {
  constructor () {
    this.nn = new DevNN();
    this.tempData = {
      rating: {
        min: 10000000000000,
        max: 0
      },
      word: {
        min: 10000000000000,
        max: 0
      },
      translation: {
        min: 10000000000000,
        max: 0
      },
      creationDate: {
        min: 10000000000000,
        max: 0
      },
      answerTimes: {
        min: 10000000000000,
        max: 0
      },
      questionCount: {
        min: 10000000000000,
        max: 0
      },
      wrongCount: {
        min: 10000000000000,
        max: 0
      }
    };
  }
  setTempData (row) {
    if (row.rating > this.tempData.rating.max) this.tempData.rating.max = row.rating;
    if (row.rating < this.tempData.rating.min) this.tempData.rating.min = row.rating;

    if (row.word.length > this.tempData.word.max) this.tempData.word.max = row.word.length;
    if (row.word.length < this.tempData.word.min) this.tempData.word.min = row.word.length;

    if (row.translation.length > this.tempData.translation.max) this.tempData.translation.max = row.translation.length;
    if (row.translation.length < this.tempData.translation.min) this.tempData.translation.min = row.translation.length;

    let date = new Date().getTime() - new Date(row.creationDate).getTime();
    if (date > this.tempData.creationDate.max) this.tempData.creationDate.max = date;
    if (date < this.tempData.creationDate.min) this.tempData.creationDate.min = date;

    if (row.questionCount > this.tempData.questionCount.max) this.tempData.questionCount.max = row.questionCount;
    if (row.questionCount < this.tempData.questionCount.min) this.tempData.questionCount.min = row.questionCount;

    if (row.wrongCount > this.tempData.wrongCount.max) this.tempData.wrongCount.max = row.wrongCount;
    if (row.wrongCount < this.tempData.wrongCount.min) this.tempData.wrongCount.min = row.wrongCount;

    if (am.mean(row.answerTimes) > this.tempData.answerTimes.max) this.tempData.answerTimes.max = am.mean(row.answerTimes);
    if (am.mean(row.answerTimes) < this.tempData.answerTimes.min) this.tempData.answerTimes.min = am.mean(row.answerTimes);
  }
  setTrainingData () {
    this.nn.init([21, 10, 1]);
    db.getAll({table: 'dictionary', options: {sort: "rating"}}).then((dictionary) => {
      dictionary.forEach((row) => {
        row.answerTimes = JSON.parse(row.answerTimes);
        this.setTempData(row);
      });
      let trainingData = [];
      let data = dictionary.map((row, i) => {
        return this.prepareData(row);
      });
      data = data.map((row) => {
        return this.whitening(row)
      });
      data.forEach((row, i) => {
        let temp = [row];
        let correctPredict = 1 / (1 + i / data.length);
        temp[1] = [correctPredict];
        trainingData.push(temp);
      });
      this.nn.setTrainingData(trainingData);
      dev.train();
      dev.save();
    });
  }
  train () {
    this.nn.learning();
    this.nn.runValidation();
  }
  save () {
    let net = JSON.stringify(this.nn.getNet());
    db.update({table: "nn", id: 1, data: {network: net}});
  }
  whitening (row) {
    let avrg = am.mean(row);
    let std = am.std(row);

    return am.andiv(am.ansub(row, avrg), std);
  }
  prepareData (row) {
    let data = [];

    for (let i = 0; i < 21; i++) {
      data[i] = 0;
    };

    switch (row.type) {
      case "noun":
        data[0] = 1;
      break;
      case "adjective":
        data[1] = 1;
      break;
      case "verb":
        data[2] = 1;
      break;
      case "adverb":
        data[3] = 1;
      break;
      case "preposition":
        data[4] = 1;
      break;
      case "conjuction":
        data[5] = 1;
      break;
      case "pronoun":
        data[6] = 1;
      break;
    };
    data[7] = helper.checkRegChars(row.word, "sh");
    data[8] = helper.checkRegChars(row.word, "th");
    data[9] = helper.checkRegChars(row.word, "wh");
    data[10] = helper.checkRegChars(row.word, "ck");
    data[11] = helper.checkRegChars(row.word, "tion");
    data[12] = helper.checkRegChars(row.word, "ea");
    data[13] = helper.checkRegSeveralChars(row.word, ["e", "i"]);
    data[14] = ((row.rating - this.tempData.rating.min) / (1 + this.tempData.rating.max - this.tempData.rating.min) * 0.5);
    data[15] = (row.word.length - this.tempData.word.min) / (1 + this.tempData.word.max - this.tempData.word.min);
    data[16] = (row.translation.length - this.tempData.translation.min) / (1 + this.tempData.translation.max - this.tempData.translation.min);
    data[17] = (row.questionCount - this.tempData.questionCount.min) / (1 + this.tempData.questionCount.max - this.tempData.questionCount.min);
    let date = new Date().getTime() - new Date(row.creationDate).getTime();
    data[18] = (date - this.tempData.creationDate.min) / (1 + this.tempData.creationDate.max - this.tempData.creationDate.min);
    data[19] = (am.mean(row.answerTimes) - this.tempData.answerTimes.min) / (1 + this.tempData.answerTimes.max - this.tempData.answerTimes.min);
    data[20] = (row.wrongCount - this.tempData.wrongCount.min) / (1 + this.tempData.wrongCount.max - this.tempData.wrongCount.min);
    return data;
  }
}
var dev = new Dev();
dev.setTrainingData();
