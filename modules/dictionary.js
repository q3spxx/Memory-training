'use strict'

import db from "./db.js";
require("babel-polyfill");
import store from './store.js';
import {updateDictionary,
				loadingDictionary} from '../actions/dictionaryActions.js';
import {close} from '../actions/formActions.js';
// const log = require("./log.js");
// const am = require("./node_modules/nn/array-math.js");

class Dictionary {
	constructor () {
		this.table = "dictionary";
		this.gen = null;
		this.generator = function* (data, callback) {
			for (let request of data.requests) {
				switch (data.type) {
					case "remove":
						yield db.remove(request);
					break;
					case "add":
						yield db.add(request);
					break;
					case "update":
						yield db.update(request);
					break;
				}
			}
			callback();
			return;
		};
	}
	executor () {
		let next = this.gen.next();
		if (next.done) {
			this.gen = null;
			return;
		};
		const self = this;
		next.value.then((row) => {
			self.executor();
		});
	}
	add (requests, callback) {
		if (!(requests instanceof Array)) {
			if (requests instanceof Object) {
				requests = [requests];
			} else {
				console.log("Invalid data!");
				return;
			};
		};
		if (this.gen != null) {
			console.log("Previous request is not completed!");
			return;
		};
		requests = requests.map((data) => {
			let request = {
				data: {
					word: data.word,
					translation: data.translation,
					type: data.type,
					rating: 0,
					questionCount: 0,
					creationDate: new Date().getTime(),
					answerTimes: JSON.stringify([0]),
					wrongCount: 0
				},
				table: this.table
			}
			return request;
		});
		this.gen = new this.generator({type: "add", requests: requests}, callback);
		this.executor();
		// log.write("add", id);
	}
	remove (requests, callback) {
		if (!(requests instanceof Array)) {
			if (requests instanceof Number) {
				requests = [requests];
			} else {
				console.log("Invalid data!");
				return;
			};
		};
		if (this.gen != null) {
			console.log("Previous request is not completed!");
			return;
		};
		requests = requests.map((data) => {
			let request = {
				id: data,
				table: this.table
			};
			return request;
		});
		this.gen = new this.generator({type: "remove", requests: requests}, callback);
		this.executor();
		// log.write("remove", id);
	}
	edit (requests, callback) {
		if (!(requests instanceof Array)) {
			if (requests instanceof Object) {
				requests = [requests];
			} else {
				console.log("Invalid data!");
				return;
			};
		};
		if (this.gen != null) {
			console.log("Previous request is not completed!");
			return;
		};
		requests = requests.map((request) => {
			if ("answerTimes" in request.data) request.data.answerTimes = JSON.stringify(request.data.answerTimes);
			let result = {
				id: request.id,
				data: request.data,
				table: this.table
			};
			return result;
		});
		this.gen = new this.generator({type: "update", requests: requests}, callback);
		this.executor();
		// log.write("edit", data.id);
	}
	get (id) {
		let request = {
			id: id,
			table: this.table
		};
		return db.get(request).then((row) => {
			row.answerTimes = JSON.parse(row.answerTimes);
			return row;
		});
	}
	getDictionary (options) {
		store.dispatch(loadingDictionary(true));
		let request = {
			table: this.table
		};
		if (options != undefined) request.options = options;
		return db.getAll(request).then((dictionary) => {
			dictionary = dictionary.map((row) => {
				row.answerTimes = JSON.parse(row.answerTimes);
				return row;
			});
			store.dispatch(updateDictionary(dictionary, false));
			return dictionary;
		});
	}
}

module.exports = new Dictionary();
