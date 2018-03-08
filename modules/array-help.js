'use strict'

class AH {
	check (arr) {
		return arr instanceof Array;
	}
	checkEvenly (arr) {
		if (arr.length > 0) {
			let length = arr[0].length;
			for (let index of arr) {
				if (index.length != length) {
					return false;
				};
			};
			return true;
		};
		return false;
	}
}

module.exports = new AH();