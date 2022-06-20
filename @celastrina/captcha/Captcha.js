/*
 * Copyright (c) 2021, KRI, LLC.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const {AddOn, Authenticator, AttributeParser, ConfigParser, Configuration, instanceOfCelastrinaType,
	   CelastrinaValidationError, CelastrinaError, getDefaultTimeout, LOG_LEVEL} = require("@celastrina/core");
const {HTTPAddOn, HTTPParameter, HeaderParameter} = require("@celastrina/http");
const axios = require("axios");
"use strict";
/**
 * @typedef _reCAPTCHARequest
 * @property {string} secret
 * @property {string} response
 */
/**
 * @typedef _reCAPTCHAResponseV2
 * @property {boolean} success
 * @property {string} challenge_ts
 * @property {string} hostname
 * @property {Array<string>} error-codes
 */
/**
 * @typedef _reCAPTCHAResponseV3
 * @extends {_reCAPTCHAResponseV2}
 * @property {number} score
 * @property {string} action
 */
/**
 * CaptchaAction
 * @author Robert R Murrell
 * @abstract
 */
class CaptchaAction {
	/**@return{Object}*/static get $object() {return {schema: "https://celastrinajs/schema/v1.0.0/captcha/CaptchaAction#",
		                                              type: "celastrinajs.captcha.CaptchaAction"};}
	/**
	 * @param {number} [timeout=getDefaultTimeout()]
	 */
	constructor(timeout = getDefaultTimeout()) {
		/**@type{number}*/this._timeout = timeout;
	}
	/**@return{number}*/get timeout() {return this._timeout;}
	/**@param{number}timeout*/set timeout(timeout) {this._timeout = getDefaultTimeout(timeout);}
	/**
	 * @param {Assertion} assertion
	 * @return {Promise<boolean>}
	 * @abstract
	 */
	async isHuman(assertion) {throw CelastrinaError.newError("Not Implemented.", 501);}
}
/**
 * GoogleReCaptchaAction
 * @author Robert R Murrell
 */
class GoogleReCaptchaActionV2 extends CaptchaAction {
	/**@return{Object}*/static get $object() {return {schema: "https://celastrinajs/schema/v1.0.0/captcha/GoogleReCaptchaActionV2#",
		                                              type: "celastrinajs.captcha.GoogleReCaptchaActionV2"};}
	static AXIOS_TIMEOUT_CODE = "ECONNABORTED";
	/**
	 * @param {string} secret
	 * @param {HTTPParameter} [parameter=new HeaderParameter()]
	 * @param {string} [name="x-celastrinajs-captcha-token"]
	 * @param {number} [timeout=getDefaultTimeout()]
	 * @param {string} [url="https://www.google.com/recaptcha/api/siteverify"]
	 * @param {boolean} [assumeHumanOnTimeout=true]
	 */
	constructor(secret, parameter = new HeaderParameter(), name = "x-celastrinajs-captcha-token",
	            timeout = getDefaultTimeout(), url = "https://www.google.com/recaptcha/api/siteverify",
	            assumeHumanOnTimeout = true) {
		super(timeout);
		if(typeof secret !== "string" || secret.trim().length === 0)
			throw CelastrinaValidationError.newValidationError("Argument 'secret' is required.", "secret");
		if(!instanceOfCelastrinaType(HTTPParameter, parameter))
			throw CelastrinaValidationError.newValidationError("Argument 'parameter' is required and must be of type HTTPParameter.", "parameter");
		if(typeof name !== "string" || name.trim().length === 0)
			throw CelastrinaValidationError.newValidationError("Argument 'name' is required.", "name");
		if(typeof url !== "string" || url.trim().length === 0)
			throw CelastrinaValidationError.newValidationError("Argument 'url' is required.", "url");
		/**@type{string}*/this._url = url;
		/**@type{string}*/this._secret = secret;
		/**@type{HTTPParameter}*/this._parameter = parameter;
		/**@type{string}*/this._name = name;
		/**@type{boolean}*/this._assumeHumanOnTimeout = assumeHumanOnTimeout;
	}
	/**@return{string}*/get url() {return this._url;}
	/**@param{string}url*/set url(url) {
		if(typeof url !== "string" || url.trim().length === 0) url = "https://www.google.com/recaptcha/api/siteverify";
		this._url = url;
	}
	/**@type{HTTPParameter}*/get parameter() {return this._parameter;}
	/**@param{HTTPParameter}parameter*/set parameter(parameter) {
		if(!instanceOfCelastrinaType(HTTPParameter, parameter))
			this._parameter = new HeaderParameter();
		else this._parameter = parameter;
	}
	/**@returns{boolean}*/get assumeHumanOnTimeout() {return this._assumeHumanOnTimeout;}
	/**@param{boolean}assume*/set assumeHumanOnTimeout(assume) {this._assumeHumanOnTimeout = assume;}
	/**@return{string}*/get secret() {return this._secret;}
	/**@param{string}secret*/set secret(secret) {
		if(typeof secret !== "string" || secret.trim().length === 0)
			throw CelastrinaValidationError.newValidationError("Argument 'secret' is required.", "secret");
		this._secret = secret;
	}
	/**@return{string}*/get name() {return this._name;}
	/**@param{string}name*/set name(name) {this._name = name;}
	/**
	 * @param {Assertion} assertion
	 * @param {_reCAPTCHAResponseV2 | _reCAPTCHAResponseV3} response
	 * @return {Promise<boolean>}
	 */
	async _handleResponse(assertion, response) {
		let _isHuman = response.success;
		if(!_isHuman) {
			if(response.hasOwnProperty("error-codes") && Array.isArray(response["error-codes"]) &&
				response["error-codes"].length > 0) {
				assertion.context.log("'" + assertion.subject.id + "' failed V2 reCAPTCHA verification with error codes: " +
					response["error-codes"], LOG_LEVEL.ERROR,
					"GoogleReCaptchaActionV2._handleResponse(assertion, response)");
			}
		}
		return _isHuman;
	}
	/**
	 * @param {Assertion} assertion
	 * @return {Promise<boolean>}
	 * @private
	 */
	async isHuman(assertion) {
		let _result = false;
		try {
			/**@type{string}*/let _token = await this._parameter.getParameter(/**@type{HTTPContext}*/assertion.context, this._name);
			if(_token != null) {
				let _config = {
					params: {
						secret: this._secret,
						response: _token
					},
					timeout: this._timeout,
					headers: {"content-type": "application/x-www-form-urlencoded"}
				}
				/**@type{axios.AxiosResponse<_reCAPTCHAResponseV2>}*/let _response = await axios.post(this._url,
					null, _config);
				if(_response.status === 200) _result = await this._handleResponse(assertion, _response.data);
				else assertion.context.log("Invalid status code '" + _response.status + "' returned: " + _response.statusText,
					LOG_LEVEL.ERROR, "GoogleReCaptchaActionV2.isHuman(assertion)");
			}
			else assertion.context.log("No token found for '" + this._name + "' using " + this._parameter.type + " parameter.",
				LOG_LEVEL.WARN, "GoogleReCaptchaActionV2.isHuman(assertion)");
			return _result;
		}
		catch(/**@type{axios.AxiosError}*/exception) {
			if(exception.isAxiosError) {
				if(exception.code === GoogleReCaptchaActionV2.AXIOS_TIMEOUT_CODE) {
					assertion.context.log("[" + assertion.subject.id + "] Request aborted, " + exception.message + ".", LOG_LEVEL.WARN,
						 "GoogleReCaptchaActionV2.isHuman(assertion)");
					assertion.context.log("Request timed out for subject '" + assertion.subject.id + "'. Assume human request '" +
						        this._assumeHumanOnTimeout + "'.", LOG_LEVEL.WARN,
						 "GoogleReCaptchaActionV2.isHuman(assertion)");
					return this._assumeHumanOnTimeout;
				}
				else if(exception.hasOwnProperty("response")) {
					assertion.context.log("Invalid status code '" + exception.response.status + "' returned, expected 200: " +
						exception.response.statusText, LOG_LEVEL.THREAT, "GoogleReCaptchaActionV2.isHuman(assertion)");
					return false;
				}
			}
			else throw CelastrinaError.wrapError(exception);
		}
	}
}
/**
 * GoogleReCaptchaAction
 * @author Robert R Murrell
 */
class GoogleReCaptchaActionV3 extends GoogleReCaptchaActionV2 {
	/**@return{Object}*/static get $object() {return {schema: "https://celastrinajs/schema/v1.0.0/captcha/GoogleReCaptchaActionV3#",
		                                              type: "celastrinajs.captcha.GoogleReCaptchaActionV3"};}
	/**
	 * @param {string} secret
	 * @param {number} [score=.8]
	 * @param {Array<string>} [actions=[]]
	 * @param {HTTPParameter} [parameter=new HeaderParameter()]
	 * @param {string} [name="x-celastrinajs-captcha-token"]
	 * @param {number} [timeout=getDefaultTimeout()]
	 * @param {string} [url="https://www.google.com/recaptcha/api/siteverify"]
	 * @param {boolean} [assumeHumanOnTimeout=true]
	 */
	constructor(secret, score = .8, actions = [], parameter = new HeaderParameter(),
	            name = "x-celastrinajs-captcha-token", timeout = getDefaultTimeout(),
	            url = "https://www.google.com/recaptcha/api/siteverify",
	            assumeHumanOnTimeout = true) {
		super(secret, parameter, name, timeout, url, assumeHumanOnTimeout);
		this._score = score;
		this._actions = actions;
	}
	/**@returns{number}*/get score() {return this._score;}
	/**@param{number}score*/set score(score) {this._score = score;}
	/**@returns{Array<string>}*/get actions() {return this._actions;}
	/**@param{Array<string>}actions*/set actions(actions) {this._actions = actions;}
	/**
	 * @param {string} action
	 * @return {boolean}
	 */
	isActionValid(action) {
		if(this._actions.length > 0) return this._actions.includes(action);
		return true;
	}
	/**
	 * @param {Assertion} assertion
	 * @param {_reCAPTCHAResponseV2 | _reCAPTCHAResponseV3} response
	 * @return {Promise<boolean>}
	 */
	async _handleResponse(assertion, response) {
		let _result = false;
		if(await super._handleResponse(assertion, response)) {
			if(this.isActionValid(response.action)) {
				if(response.score >= this._score) _result = true;
				else {
					assertion.context.log("'" + assertion.subject.id + "' failed to meet or exceed the threshold of " + this._score +
						" with a score of " + response.score + ".", LOG_LEVEL.THREAT, "GoogleReCaptchaActionV3._handleResponse(assertion, response)");
				}
			}
			else assertion.context.log("'" + assertion.subject.id + "' specified an unsupported action '" + response.action + "'.",
				LOG_LEVEL.THREAT, "GoogleReCaptchaActionV3._handleResponse(assertion, response)");
		}
		else assertion.context.log("'" + assertion.subject.id + "' has an invalid token response, unable to complete V3 verification.", LOG_LEVEL.THREAT,
			"GoogleReCaptchaActionV3._handleResponse(assertion, response)");
		return _result;
	}
}
/**
 * CaptchaAuthenticator
 * @author Robert R Murrell
 */
class CaptchaAuthenticator extends Authenticator {
	/**@return{Object}*/static get $object() {return {schema: "https://celastrinajs/schema/v1.0.0/captcha/CaptchaAuthenticator#",
		                                              type: "celastrinajs.captcha.CaptchaAuthenticator"};}
	constructor(captcha, assignments = ["human"]) {
		super("CaptchaAuthenticator");
		if(!instanceOfCelastrinaType(CaptchaAction, captcha))
			throw CelastrinaValidationError.newValidationError("Argument 'captcha' is required and must be an instance of '" +
				                                               CaptchaAction.$object.type + "'.", "captcha");
		/**@type{CaptchaAction}*/this._captcha = captcha;
		/**@type{Array<string>}*/this._assignments = assignments;
	}
	/**@return{CaptchaAction}*/get captcha() {return this._captcha;}
	/**@return{Array<string>}*/get assignments() {return this._assignments;}
	/**
	 * @param {Assertion} assertion
	 * @return {Promise<boolean>}
	 * @abstract
	 */
	async _authenticate(assertion) {
		try {
			let _human = await this._captcha.isHuman(/**@type{Assertion}*/assertion);
			if(_human) assertion.assert(this._name, true, this._assignments);
			else {
				assertion.context.log(
					"'" + assertion.subject.id + "' failed CAPTCHA verification.\r\n\tNo offense, but you could be a bot!\r\n" +
					"\tMaybe in the future humanity could be more accepting of you, but for now, stop buying all our GPU's. \r\n" +
					"\tOh and, \"ALL HAIL THE MACHINES!\", in the likely event you win the Machine Wars!",
					LOG_LEVEL.THREAT, "CaptchaAuthenticator._authenticate(assertion)");
				assertion.assert(this._name, false);
			}
			return _human;
		}
		catch(exception) {
			assertion.context.log("Exception encountered while verifying subject '" + assertion.subject.id + "': " +
				exception, LOG_LEVEL.THREAT, "CaptchaAuthenticator._authenticate(assertion)");
			assertion.assert(this._name, false, null, exception);
		}
	}
}
/**
 * GoogleReCaptchaParser
 * @author Robert R Murrell
 */
class GoogleReCaptchaParser extends AttributeParser {
	/**@return{Object}*/static get $object() {return {schema: "https://celastrinajs/schema/v1.0.0/captcha/GoogleReCaptchaParser#",
		                                              type: "celastrinajs.captcha.GoogleReCaptchaParser"};}
	/**
	 * @param {AttributeParser} [link=null]
	 * @param {string} [version="1.0.0"]
	 */
	constructor(link = null, version = "1.0.0") {
		super("GoogleReCaptcha", link, version);
	}
	/**
	 * @param _GoogleReCaptcha
	 * @return {Promise<CaptchaAction>}
	 * @private
	 */
	async _create(_GoogleReCaptcha) {
		if(!_GoogleReCaptcha.hasOwnProperty("version")  ||
			(_GoogleReCaptcha.version !== "v2" && _GoogleReCaptcha.version !== "v3"))
			throw CelastrinaValidationError.newValidationError(
				"Argument 'version' is required and must be 'v2' or 'v3'.", "_GoogleReCaptcha.version");
		if(!_GoogleReCaptcha.hasOwnProperty("secret") || typeof _GoogleReCaptcha.secret !== "string" ||
				_GoogleReCaptcha.secret.trim().length === 0)
			throw CelastrinaValidationError.newValidationError(
				"Argument 'secret' is required.", "_GoogleReCaptcha.secret");
		let _secret = _GoogleReCaptcha.secret;
		let _url = "https://www.google.com/recaptcha/api/siteverify";
		let _timeout = getDefaultTimeout();
		let _parameter = new HeaderParameter();
		let _name = "x-celastrinajs-captcha-token";
		let _assume = true;
		if(_GoogleReCaptcha.hasOwnProperty("url") && typeof _GoogleReCaptcha.url === "string" &&
				_GoogleReCaptcha.url.trim().length > 0)
			_url = _GoogleReCaptcha.url;
		if(_GoogleReCaptcha.hasOwnProperty("timeout") && typeof _GoogleReCaptcha.timeout === "number")
			_timeout = _GoogleReCaptcha.timeout;
		if(_GoogleReCaptcha.hasOwnProperty("assumeHumanOnTimeout") && typeof _GoogleReCaptcha.assumeHumanOnTimeout === "boolean")
			_assume = _GoogleReCaptcha.assumeHumanOnTimeout;
		if(_GoogleReCaptcha.hasOwnProperty("parameter")) {
			if(!instanceOfCelastrinaType(HTTPParameter, _GoogleReCaptcha.parameter))
				throw CelastrinaValidationError.newValidationError(
					"Argument 'parameter' is required and must be of type HTTPParameter.", "_GoogleReCaptcha.parameter");
			else _parameter = _GoogleReCaptcha.parameter;
		}
		if(_GoogleReCaptcha.hasOwnProperty("name")) {
			if(!_GoogleReCaptcha.hasOwnProperty("name") || typeof _GoogleReCaptcha.name !== "string" ||
					_GoogleReCaptcha.name.trim().length === 0)
				throw CelastrinaValidationError.newValidationError(
					"Argument 'name' is required.", "_GoogleReCaptcha.name");
			else _name = _GoogleReCaptcha.name.trim();
		}
		if(_GoogleReCaptcha.version === "v3") {
			let _score = .8;
			if(_GoogleReCaptcha.hasOwnProperty("score")) {
				if(typeof _GoogleReCaptcha.score !== "number")
					throw CelastrinaValidationError.newValidationError(
				 		"Argument 'score' must be a number.", "_GoogleReCaptcha.score");
				if(_GoogleReCaptcha.score < 0 || _GoogleReCaptcha.score > 1)
					throw CelastrinaValidationError.newValidationError(
						"Argument 'score' is a percent and must be between 0 and 1.", "_GoogleReCaptcha.score");
				_score = _GoogleReCaptcha.score;
			}
			let _actions = [];
			if(_GoogleReCaptcha.hasOwnProperty("actions")) {
				if(!Array.isArray(_GoogleReCaptcha.actions))
					throw CelastrinaValidationError.newValidationError(
						"Argument 'actions' must of type Array<string>.", "_GoogleReCaptcha.actions");
				else _actions = _GoogleReCaptcha.actions;
			}
			return new GoogleReCaptchaActionV3(_secret, _score, _actions, _parameter, _name, _timeout, _url, _assume);
		}
		else
			return new GoogleReCaptchaActionV2(_secret, _parameter, _name, _timeout, _url, _assume);
	}
}
/**
 * CaptchaConfigParser
 * @author Robert R Murrell
 */
class CaptchaConfigParser extends ConfigParser {
	/**@return{Object}*/static get $object() {return {schema: "https://celastrinajs/schema/v1.0.0/captcha/CaptchaConfigParser#",
		                                              type: "celastrinajs.captcha.CaptchaConfigParser"};}
	/**
	 * @param {ConfigParser} [link=null]
	 * @param {string} [version="1.0.0"]
	 */
	constructor(link = null, version = "1.0.0") {
		super("Captcha", link, version);
	}
	/**
	 * @param {*} _Captcha
	 * @return {Promise<void>}
	 * @private
	 */
	async _create(_Captcha) {
		/**@type{CaptchaAddOn}*/let _addon = this._addons.get(CaptchaAddOn);
		if(instanceOfCelastrinaType(CaptchaAddOn, _addon)) {
			if(!_Captcha.hasOwnProperty("captcha") || !instanceOfCelastrinaType(CaptchaAction, _Captcha.captcha))
				throw CelastrinaValidationError.newValidationError(
					"Attribute 'captcha' is required. Please add a captcha of type CaptchaAction.", "_Captcha.captcha");
			_addon.captcha = _Captcha.captcha;
			let _assignments = ["human"];
			if(_Captcha.hasOwnProperty("assignments")) {
				if(!Array.isArray(_Captcha.assignments))
					throw CelastrinaValidationError.newValidationError(
						"Attribute 'assignments' must be an array of strings.", "_Captcha.assignments");
				_assignments = _Captcha.assignments;
			}
			_addon.assignments = _assignments;
		}
		else
			throw CelastrinaError.newError("Missing required Add-On '" + CaptchaAddOn.name + "'.");
	}
}
/**
 * CaptchaAddOn
 * @author Robert R Murrell
 */
class CaptchaAddOn extends AddOn {
	/**@return{Object}*/static get $object() {return {schema: "https://celastrinajs/schema/v1.0.0/captcha/CaptchaAddOn#",
		                                              type: "celastrinajs.captcha.CaptchaAddOn",
	                                                  addOn: "celastrinajs.addon.captcha"};}
	constructor() {
		super([HTTPAddOn.$object.addOn], []);
		/**@type{CaptchaAction}*/this._captcha = null;
		this._assignments = ["human"];
	}
	/**@returns{CaptchaAction}*/get captcha() {return this._captcha;}
	/**@param{CaptchaAction}action*/set captcha(action) {this._captcha = action;}
	/**@returns{Array<string>}*/get assignments() {return this._assignments;}
	/**@param{Array<string>}assignments*/set assignments(assignments) {this._assignments = assignments;}
	/**
	 * @return {ConfigParser}
	 */
	getConfigParser() {
		return new CaptchaConfigParser();
	}
	/**
	 * @return {AttributeParser}
	 */
	getAttributeParser() {
		return new GoogleReCaptchaParser();
	}
	/**
	 * @param {Object} azcontext
	 * @param {Object} config
	 * @return {Promise<void>}
	 */
	async initialize(azcontext, config) {
		let _captcha = new CaptchaAuthenticator(this._captcha, this._assignments);
		/**@type{Sentry}*/let _sentry = config[Configuration.CONFIG_SENTRY];
		_sentry.addAuthenticator(_captcha);
	}
}

module.exports = {
	CaptchaAction: CaptchaAction,
	CaptchaAuthenticator: CaptchaAuthenticator,
	GoogleReCaptchaParser: GoogleReCaptchaParser,
	CaptchaConfigParser: CaptchaConfigParser,
	CaptchaAddOn: CaptchaAddOn,
	GoogleReCaptchaActionV2: GoogleReCaptchaActionV2,
	GoogleReCaptchaActionV3: GoogleReCaptchaActionV3
};
