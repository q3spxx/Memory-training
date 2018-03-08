'use babel'

const decks = require("./decks.js");
import enumNames from "../modules/enum.js";
import fm from "./fm.js";
import store from "./store.js";
import {
	updateTests,
	setDeck,
	setQuestion,
	setError,
	setQuestionResult,
	setResult} from "../actions/testsActions.js";

class TestsManager {
	constructor () {
		this.end = null;
		this.gen = null;
		this.execution = false;
		this.test = function* () {
			// Получаем из хранилища текущий тест
			let testType = store.getState().tests.test.testType;
			let test = store.getState().tests.modules[testType];
			//Получить колоду для теста
			this.getDeck(test);
			//Запустить тест
			test.start();
			while (!test.ended) {
				//Задать вопрос
				let question = test.ask(store.getState().tests.test.tempDeck);
				yield	store.dispatch(setQuestion(question));
				//Отсылка ответа в тест для обработки
				let state = store.getState();
				let result = test.handle(
					state.tests.test.answer,
					state.tests.test.deck,
					state.tests.test.tempDeck);
				if (result.error) {
					store.dispatch(setError({error: result.error, errorText: result.errorText}));
					continue;
				} else {
					store.dispatch(setError({error: result.error, errorText: ""}));
				};
				store.dispatch(setQuestionResult(result));
				yield this.delay();
			}
			let deck = store.getState().tests.test.deck;
			store.dispatch(setResult(test.getResult(deck)));
			return deck;
		}
	}
	delay () {
		this.execution = true;
		setTimeout(function () {
			this.execution = false;
			this.executor();
		}.bind(this), 2000);
	}
	loadTests () {
		let tests = {};
		fm.getTests().forEach((name) => {
			let test = require(`../tests/${name}`);
			tests[test.name] = test;
		});
		store.dispatch(updateTests(tests));
	}
	getDeck (test) {
		switch (test.deckType) {
			case enumNames.RANDOM_WORDS:
				store.dispatch(setDeck(decks.getRandomWords()));
			break;
			case enumNames.NN_WORDS:
				store.dispatch(setDeck(decks.getNNWords()));
			break;
		};
	}
	run () {
		this.gen = this.test();
		this.gen.next();
	}
	executor () {
		if (this.execution) return;
		let result = this.gen.next();
		if (result.done) {
			decks.setRating(result.value);
		}
	}
}

export default new TestsManager();
