
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const moment = require("moment");

class GoogleReCaptchaMock {
	constructor(version = "v2", secret = "ABCDEFGHIJKLMNOP", v3ThresholdResponse = .8,
	            action = "mock", url = "https://www.google.com/recaptcha/api/siteverify",
	            responseCode = "1234567890", hostname = "celastrinajs.com") {
		this._version = version;
		this._url = url;
		this._responseCode = responseCode;
		this._mock = null;
		this._host = hostname;
		this._v3ThresholdResponse = v3ThresholdResponse;
		this._action = action;
		this._secret = secret;

		this.recaptchaReceived = false;
	}
	reset(version = "v2", v3ThresholdResponse = .8, responseCode = "1234567890",
	      action = "mock") {
		this.recaptchaReceived = false;
		this._version = version;
		this._responseCode = responseCode;
		this._v3ThresholdResponse = v3ThresholdResponse;
		this._action = action;
	}
	async start(foozled = false, version = "v2", v3ThresholdResponse = .8,
	      responseCode = "1234567890", action = "mock") {
		this._version = version;
		this._responseCode = responseCode;
		this._v3ThresholdResponse = v3ThresholdResponse;
		this._action = action;
		this._mock =  new MockAdapter(axios);
		let _this = this;
		this._mock.onPost(this._url).reply((config) => {
			_this.recaptchaReceived = true;
			let _recaptcha = {
				success: false,
				challenge_ts: moment().format(),
				hostname: _this._host,
				"error-codes": []
			};
			let _response = [200, _recaptcha];
			let _body = config.data;
			if(typeof _body === "undefined" || _body == null) {
				_recaptcha["error-codes"].push("bad-request");
			}
			else {
				if(typeof _body.secret !== "string" || _body.secret.trim().length === 0)
					_recaptcha["error-codes"].push("missing-input-secret");
				else if(typeof _body.response !== "string" || _body.response.trim().length === 0)
					_recaptcha["error-codes"].push("missing-input-response");
				else {
					if(_body.secret !== _this._secret)
						_recaptcha["error-codes"].push("invalid-input-secret");
					else if(_body.response !== _this._responseCode)
						_recaptcha["error-codes"].push("invalid-input-response");
					else {
						if(_this._version === "v2")
							_recaptcha.success = !foozled;
						else if(_this._version === "v3") {
							_recaptcha.success = !foozled;
							_recaptcha.score = _this._v3ThresholdResponse;
							_recaptcha.action = _this._action;
						}
						else
							_recaptcha["error-codes"].push("bad-request");
					}
				}
			}
			return _response;
		});
	}
	async stop() {
		this._mock.restore();
		this._mock = null;
	}
}

module.exports = {
	MockGoogleReCaptcha: GoogleReCaptchaMock
};
