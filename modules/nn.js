'use strict'

import Layer from "./layer.js";
import am from "./array-math.js";
require("babel-polyfill");

class NN {
  	constructor () {
  		this.age = 1;
  		this.layers = [];
  		this.errors = [];
  	}
    predict (inputs) {
      this.layers[0].setValues(inputs);
      for (let i = 1; i < this.layers.length; i++) {
        // Умножаем выходные значения предыдущего слоя на веса текущего
        let input = this.layers[i].wmul(this.layers[i - 1].values);
        // Складываем полученные значения для каждого нейрона
        input = am.a2dsum(input);
        // Применяем функцию сигмоида для значения каждого нейрона
        input = am.asigm(input);
        // Записываем результат в значения текущего слоя
        this.layers[i].setValues(input);
      };
      // Возвращаем выходные значения нейронов последнего слоя
      return this.layers[this.layers.length - 1].values;
    }
  	load (network) {
  		this.layers = network.layers.map((layer) => {
  			let l = new Layer(0, 0, 0);
  			l.init(layer.values, layer.weights);
  			return l;
  		});
  		// Генерация массива ошибок
  		this.errors = network.errors;
  		this.age = network.age;
  	}
};

module.exports = NN;
