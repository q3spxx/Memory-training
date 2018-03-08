'use strict'

const ah = require("./array-help.js");

class AM {
	asum (a, b) {
		if (!ah.check(a) || !ah.check(b)) {
			console.error("Arguments is not arrays!");
			return;
		};
		return a.map((value, i) => {
			return value + b[i];
		});
	}
	amul (a, b) {
		if (!ah.check(a) || !ah.check(b)) {
			console.error("Arguments is not arrays!");
			return;
		};

		return a.map((value, i) => {
			return value * b[i];
		});
	}
	arandom (count, limit) {
		let arr = [];
		for (let i = 0; i < count; i++) {
			arr.push(Math.random() * limit);
		}
		return arr;
	}
	asub (a, b) {
		if (!ah.check(a) || !ah.check(b)) {
			console.error("Arguments is not arrays!");
			return;
		};
		return a.map((value, i) => {
			return value - b[i];
		});
	}
	ader (a) {
		if (!ah.check(a)) {
			console.error("Argument is not array!");
			return;
		};
		return a.map((value) => {
			return value * (1 - value);
		});
	}
	anmul (a, b) {
		if (!ah.check(a)) {
			console.error("Argument is not array!");
			return;
		};
		return a.map((value) => {
			return value * b;
		});
	}
	ansub (a, b) {
		if (!ah.check(a)) {
			console.error("Argument is not array!");
			return;
		};
		return a.map((value) => {
			return value - b;
		});
	}
	andiv (a, b) {
		if (!ah.check(a)) {
			console.error("Argument is not array!");
			return;
		};
		return a.map((value) => {
			return value / b;
		});
	}
	a2dsum (a) {
		if (!ah.check(a)) {
			console.error("Argument is not array!");
			return;
		};
		return a.map((b) => {
			let sum = 0;
			b.forEach((value) => {
				sum += value;
			});
			return sum;
		});
	}
	asigm (a) {
		if (!ah.check(a)) {
			console.error("Argument is not array!");
			return;
		};
		return a.map((value) => {
			return 1 / (1 + Math.exp(-value));
		});
	}
	a2dmean (a) {
		if (!ah.check(a)) {
			console.error("Argument is not array!");
			return;
		};
		if (a.length == 0) {
			console.error("Array have zero length!");
			return;
		};
		if (!ah.checkEvenly(a)) {
			console.error("Array is not evenly!");
			return;
		};
		let result = [];
		let index = 0;
		let sum = 0;
		while (index < a[0].length) {
			for (let i = 0; i < a.length; i++) {
				sum += a[i][index];
			};
			result.push(sum / a.length);
			index++;
			sum = 0;
		};
		return result;
	}
	apow (a, n) {
		return a.map((value) => {
			return Math.pow(value, n);
		});
	}
	mean (a) {
		let sum = 0;
		a.forEach((value) => {
			sum += value;
		});
		return sum / a.length;
	}
	std (a) {
		let average = this.mean(a);
		let b = this.apow(this.ansub(a, average), 2);
		let sum = 0;
		b.forEach((value) => {
			sum += value;
		});
		return Math.sqrt(sum / a.length);
	}
}

module.exports = new AM();