'use strict'

export default class Timer  {
	constructor () {
		this.date = null;
	}

	getDate () {
		return new Date(this.date);
	}

	start () {
		this.date = new Date().getTime();
	}

	end () {
		return new Date(new Date().getTime() - this.date).getTime();
	}
}
