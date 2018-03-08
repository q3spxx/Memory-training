'use strict'

import Layer from "../modules/layer.js";
import am from "../modules/array-math.js";
import NN from "../modules/nn.js";
require("babel-polyfill");

class DevNN extends NN {
	constructor () {
		super();
		this.training = [];
		this.validation = [];
		this.epochs = 2000;
		this.currentEpoch = 1;
		this.learningRate = 0.05;
		this.limit = 0.1;
		this.output = "";
		this.timer = 0;
	}

	learning () {
		for (let i = 0; i < this.epochs; i++) {
			this.currentEpoch++;
			this.timer++;
			if (this.timer > 100) {
				console.log(`Epoch: ${this.currentEpoch} | Age: ${this.age}`);
				console.log(this.output);
				this.timer = 0;
			};
			for (let option of this.training) {
				this.train(option[0], option[1]);
				this.age++;
			}
		}
	}

	runValidation () {
		console.log("Validation");
		for (let option of this.validation) {
			let output = this.predict(option[0]);
			this.mse(option[1], output);
			console.log(this.output);
		}
	}

	mse (a, b) {
		let errors = am.apow(am.asub(a, b), 2);
		this.errors = am.asum(this.errors, errors);
		let str = "Loss:"
		this.errors.forEach((error) => {
			str += " | ";
			str += Number((error / this.age).toFixed(4));
		});
		this.output = str;
	}

	train (inputs, correctPredict) {
		// Запуск предсказания
		let output = this.predict(inputs);
		this.mse(correctPredict, output);
		// Вычисляем ошибку слоя
		let error = am.asub(output, correctPredict);
		// Вычисляем градиент (производная финкции сигмоида)
		let gradient = am.ader(output);
		// Вычисляем дельту (на сколько подкорректировать веса)
		let deltas = am.amul(error, gradient);
		// Идем в обратном направлении и изменяем веса по формуле weight - (prevent_output * delta * learning_rate)
		for (let i = this.layers.length - 1; i > 0; i--) {
			if (i < this.layers.length - 1) {
				output = this.layers[i].values;
				gradient = am.ader(output);
				let factor = this.layers[i + 1].weights.map((weights, j) => {
					return am.anmul(weights, deltas[j]);
				});
				error = am.a2dmean(factor);
				deltas = am.amul(error, gradient)
			};
			let subtrahend = [];
			let input = this.layers[i - 1].values;
			deltas.forEach((delta) => {
				subtrahend.push(am.anmul(input, delta * this.learningRate));
			});
			this.layers[i].wsub(subtrahend);
		};
	}

	init (network) {
		this.layers = [];
		this.epochs = 500;
		this.age = 1;
		this.learningRate = 0.01;
		this.limit = 0.1;
		// Генерация нейронной сети по полученным данным
		network.forEach((neurons, index) => {
			if (index == 0) {
				// Генерация первого слоя, первому слою не нужны веса
				this.layers.push(new Layer(neurons, 0, this.limit));
			} else {
				// Генерация всех остальных слоев, количество весов зависит от количества нейронов предыдущего слоя
				this.layers.push(new Layer(neurons, this.layers[index - 1].values.length, this.limit));
			};
		});
		// Генерация массива ошибок
		this.errors = this.layers[this.layers.length - 1].values.map(() => {
			return 0;
		});
	}

	getNet () {
		this.clearValues();
		return {
			layers: this.layers,
			errors: this.errors,
			age: this.age
		};
	}

	clearValues () {
		this.layers = this.layers.map((layer) => {
			layer.values = layer.values.map((value) => {
				return 0;
			});
			return layer;
		});
	}

	setTrainingData (data) {
		let trainingLength = Math.floor(data.length * 0.9);

		while (this.training.length < trainingLength) {
			let index = Math.floor(Math.random() * data.length);
			this.training.push(data[index]);
			data.splice(index, 1);
		};
		this.validation = data;
	}
};

module.exports = DevNN;
