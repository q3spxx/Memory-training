'use strict'

import enumNames from "../modules/enum.js";
import Timer from "../modules/timer.js";
import helper from "../modules/helper.js";


class InvSimpleTest {
	constructor () {
		this.name = "INVSIMPLETEST";
		this.title = "Inverse simple test";
		this.deckType = enumNames.RANDOM_WORDS;
		this.questionCount = 0;
		this.wrongCount = 0;
		this.ended = false;
		this.testTimer = null;
		this.questionTimer = null;
	}

	start () {
		this.init();
		this.testTimer = new Timer();
		this.testTimer.start();
	}
	ask (tempDeck) {
		this.questionTimer = new Timer();
		this.questionTimer.start();
		return {
			word: tempDeck[0].translation,
			type: tempDeck[0].type
		};
	}

	handle (answer, deck, tempDeck) {
		let currentRow = tempDeck[0];
		let result = {
			error: false,
			errorText: ""
		};
		if (!helper.checkLanguage(answer, "en"))	{
			result.error = true;
			result.errorText = "The language should be english";
			return result;
		}
		this.questionCount++;
		deck[currentRow.deckIndex].questionCount++;
		deck[currentRow.deckIndex].answerTime += this.questionTimer.end();

		if (answer == currentRow.word) {
			result.questionResult = true;
			result.questionResultText = `Right (${currentRow.word})`;
			tempDeck.splice(0, 1);
		} else {
			result.questionResult = false;
			result.questionResultText = `Wrong (${currentRow.word})`;
			this.wrongCount++;
			deck[currentRow.deckIndex].wrongCount++;
			tempDeck.push(currentRow);
			tempDeck.splice(0, 1);
		};

		if (tempDeck.length == 0) {
			this.ended = true;
		};
		result.deck = deck;
		result.tempDeck = tempDeck;
		return result;
	}
	getResult (deck) {
		let spendedTime =  new Date(this.testTimer.end());
		let scope = 0;
		deck.forEach((row) => {
			scope += Math.floor(1000 * (1 / (1 + row.wrongCount)) * (1 / (1 + (row.answerTime / 10000))));
		});
		return [{
			label: "Spended time",
			value: `${spendedTime.getUTCHours()}ч. ${spendedTime.getUTCMinutes()}мин. ${spendedTime.getUTCSeconds()}сек.`
		}, {
			label: "Errors percent",
			value: `${Math.floor(this.wrongCount / (this.questionCount) * 100)}%`
		}, {
			label: "Scope",
			value: scope
		}, {
			label: "Questions count",
			value: this.questionCount
		}];
	}
	init () {
		this.questionCount = 0;
		this.wrongCount = 0;
		this.ended = false;
		this.testTimer = null;
		this.questionTimer = null;
	}
}

module.exports = new InvSimpleTest();
