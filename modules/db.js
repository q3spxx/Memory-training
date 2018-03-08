const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database.db');

class Database {

	constructor () {
		// db.get("SELECT * FROM sqlite_master", (err, row) => {
		// 	if (row == undefined) {
		// 		db.run("CREATE TABLE dictionary (word TEXT, translation TEXT, type TEXT, rating INTEGER, questionCount INTEGER, creationDate INTEGER, answerTimes TEXT)");
		// 	}
		// });
	}

	add (request) {
		let keys = "";
		let values = "";
		for (let key in request.data) {
			if (keys.length > 0) keys += ", ";
			keys += key;
			if (values.length > 0) values += ", ";
			let value = request.data[key];
			if (typeof(value) == "string") value = `'${request.data[key]}'`;
			values += value;
		};
		let str = `INSERT INTO ${request.table} (${keys}) VALUES (${values})`;
		return new Promise ((resolve, reject) => {
			db.run(str, () => {
				resolve();
			});
		});
	}

	remove (request) {
		return new Promise((resolve, reject) => {
			db.run(`DELETE FROM ${request.table} WHERE rowid=${request.id}`, () => {
				resolve();
			});
		});
	}

	update (request) {
		let newSet = "";
		for (let key in request.data) {
			if (newSet.length > 0) newSet += ", ";
			newSet += `${key} = `;
			let value = request.data[key];
			if (typeof(value) == "string") value = `'${request.data[key]}'`;
			newSet += value;
		};
		let str = `UPDATE ${request.table} SET ${newSet} WHERE rowid = ${request.id}`;
		return new Promise((resolve, reject) => {
			db.run(str, () => {
				resolve();
			});
		});
	}

	get (request)  {
		let promise = new Promise((resolve, reject) => {
			db.get(`SELECT *, rowid AS id FROM ${request.table} WHERE rowid = ${request.id}`, (err, row) => {
				resolve(row);
			});
		});
		return promise;
	}

	getAll (request) {
		let promise = new Promise((resolve, reject) => {
			let data = [];
			let str = `SELECT *, rowid AS id FROM ${request.table}`;
			if ("options" in request) {
				if ("sort" in request.options) {
					str += ` ORDER BY ${request.options.sort}`
				};
			};
			db.each(str, (err, row) => {
				data.push(row);
			}, () => {
				resolve(data);
			});
		});
		return promise;
	}
}


module.exports = new Database();
