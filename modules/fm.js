'use babel'

import fs from "fs";

class FM {
	write (file, data) {
		fs.writeFile(`./${file}`, data, {flag: "a"}, (err) => {
			if (err) this.error(err);
		});;
	}
	writeFile (file, data) {
		fs.writeFile(`./${file}`, data, (err) => {
			if (err) this.error(err);
		});
	}
	getTests () {
		return fs.readdirSync("./tests");
	}
}

export default new FM();
