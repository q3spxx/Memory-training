'use strict'

// const meta = require("./meta.json");
import store from "./store.js";
import dictionary from "./dictionary.js";
import nnm from "./nnm.js";

class Word {
	constructor (row) {
		this.answerTime = 0;
		this.wrongCount = 0;
		this.questionCount = 0;
		this.index = row.index;
		this.word = row.word;
		this.translation = row.translation;
		this.type = row.type;
	}
}

class DeckManager {
	constructor () {
		this.maxRating = 0;
	}
	getRandomWords () {
		let randomWords = [];
		let maxRating = 0;
		// Получаем словарь из хранилища
		let dictionary = store.getState().dictionary.rows;
		// Добавляем в объект их индекс в массиве для облегчения поиска в дальнейшем
		dictionary = dictionary.map((row, i) => {
			row.index = i;
			return row;
		});
    // Если строк меньше чем минимальное количество строк для теста то просто возвращаем словарь
		if (dictionary.length < 20) {
			randomWords = dictionary.map((row) => {
				return new Word(row);
			})
			return randomWords;
		};
		// Сортировка словаря по рейтингу и получение максимального рейтинга
		dictionary = dictionary.sort(this.sort);
		maxRating = dictionary[dictionary.length - 1].rating;
		this.maxRating = maxRating;
		// Добавляем в колоду слово с наименьшим рейтингом
		randomWords.push(new Word(dictionary[0]));
		dictionary.splice(0, 1);
		// Заполнение колоды
		// Защита от зацикливания
		let timeoutCounter = 0;
		while (dictionary.length > 0 && randomWords.length < 20 && timeoutCounter < 1000) {
			// Выбираем случайный индекс
			let random = Math.floor(Math.random() * (dictionary.length - 1));
			// Вычисляем коэффициент "знания слова" по рейтингу, 0 - знаю, 1 - не знаю
			let c = 1 - Number(dictionary[random].rating) / maxRating;
			// Вычисляем возможность попадания слова в колоду
			let add = Math.random() + (0.6 * c);
			// Если возможность больше 1 то добавляем в колоду
			if (add > 1) {
				randomWords.push(new Word(dictionary[random]));
				dictionary.splice(random, 1);
			}
			timeoutCounter++;
		}
		return randomWords;
	}
	getNNWords () {
		let nnWords = [];
		// Получаем словарь из хранилища
		let dictionary = store.getState().dictionary.rows;
		// Добавляем в объект их индекс в массиве для облегчения поиска в дальнейшем
		dictionary = dictionary.map((row, i) => {
			row.index = i;
			return row;
		});
		// Если строк меньше чем минимальное количество строк для теста то просто возвращаем словарь
		if (dictionary.length < 20) {
			nnWords = dictionary.map((row) => {
				return new Word(row);
			})
			return nnWords;
		};

		nnm.setNet();
		dictionary.forEach((row) => {
			console.log(nnm.predict(row));
		});
		// return dictionary.getDictionary().then((list) => {
		// 	if (list.length == 0) return list;
		// 	let words = [];
    //
		// 	if (list.length < 20) {
		// 		words = list.map((value) => {
		// 			return new Word(value);
		// 		})
		// 		return words;
		// 	} else {
		// 		let limit = 0.5;
		// 		while (words.length < 20) {
		// 			let random = Math.floor(Math.random() * (list.length - 1));
		// 			if (nnm.predict(list[random]) < limit) {
		// 				words.push(new Word(list[random]));
		// 				list.splice(random, 1);
		// 				if (words.length >= 20) {
		// 					break;
		// 				};
		// 			}
		// 			limit += 0.0001;
		// 		};
		// 		return words;
		// 	}
    //
		// });
	}
	setRating (deck) {
		let rows = store.getState().dictionary.rows;

		let request = deck.map((row) => {
			let answerTimes = [...rows[row.index].answerTimes];
			answerTimes.push(row.answerTime);

			let wrongCount = rows[row.index].wrongCount + row.wrongCount;


			let questionCount = rows[row.index].questionCount + row.questionCount;
			let points = this.maxRating / 10;
			points = Math.floor(points * (1 / (1 + (row.answerTime / 10000))) * (1 / (1 + row.wrongCount)) * (1 / (1 + (Number(questionCount) / 100))));
			let rating = rows[row.index].rating + points;
			return {
				id: rows[row.index].id,
				data: {
					questionCount: questionCount,
					wrongCount: wrongCount,
					answerTimes: answerTimes,
					rating: rating
				}
			};

		});
		dictionary.edit(request, () => {
			dictionary.getDictionary();
		});
	}
	sort (a, b) {
		return a.rating > b.rating ? 1 : -1;
	}
}

module.exports = new DeckManager();
