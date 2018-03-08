'use strict'

require("babel-polyfill");

class Helper {
	checkType(type) {
		if (type == 'noun' ||
			type == 'verb' ||
			type == 'adjective' ||
			type == 'adverb' ||
			type == 'preposition' ||
			type == 'conjunction' ||
			type == 'pronoun') {
			return true;
		}
		return  false;
	}

	checkLanguage (str, language) {
		switch (language) {
			case "en":
				return this.checkChars(str, 97, 122);
			break;
			case "ru":
				return this.checkChars(str, 1072, 1105);
			break;
		}
	}
	checkChars (str, a, b) {
		let strArr = str.split("");

		for (let char of strArr) {
			if (char.charCodeAt(0) == 32) return true;
			if (char.charCodeAt(0) < a || char.charCodeAt(0) > b) return false;
		}

		return true;
	}

	checkRegChars (word, char) {
		if (word.search(char) == -1) {
			return 0;
		} else {
			return 1;
		};
	}
	checkRegSeveralChars (word, chars) {
		for (let char of chars) {
			if (word.search(char) == -1) {
				return 0;
			};
		};
		return 1;
	}
}
module.exports = new Helper();
