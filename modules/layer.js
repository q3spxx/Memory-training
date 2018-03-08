'use strict'

const am = require("./array-math.js");

class LayerProto {
	constructor () {}
	wmul (values) {
		return this.weights.map((weights, i) => {
			return am.amul(weights, values);
		});
	}
	wsub (values) {
		this.weights = this.weights.map((weights, i) => {
			return am.asub(weights, values[i]);
		});
	}
	vsub (values) {
		return am.asub(this.values, values);
	}
	vder () {
		return am.ader(this.values);
	}
	get2d (factors) {
		return factors.map((factor) => {
			return this.values.map((value) => {
				return value * factor;
			});
		});
	}
	setValues (values) {
		values.forEach((value, i) => {
			this.values[i] = value;
		});
	}
	init (values, weights) {
		this.values = values;
		this.weights = weights;
	}
}

class Layer extends LayerProto {
	constructor (neuronsCount, weightsCount, limit) {
		super();
		this.weights = [];
		this.values = [];

		for (let i = 0; i < neuronsCount; i++) {
			this.values.push(0);
			this.weights.push(am.arandom(weightsCount, limit));
		};
	}
}

module.exports = Layer;