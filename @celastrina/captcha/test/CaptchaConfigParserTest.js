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
const assert = require("assert");
const {CaptchaConfigParser, GoogleReCaptchaActionV2, CaptchaAddOn} = require("../Captcha");
const {MockAzureFunctionContext} = require("./AzureFunctionContextMock");
const {Configuration, CelastrinaValidationError} = require("@celastrina/core");
const {HTTPAddOn} = require("@celastrina/http");

describe("CaptchaConfigParser", () => {
	describe("#_create(_Captcha)", () => {
		it("Configures the CaptchaAddOn.", async () => {
			let _captcha = new GoogleReCaptchaActionV2("mock_secret");
			let _addon = new CaptchaAddOn();
			let _Object = {
				$object: {contentType: "application/vnd.celastrinajs.config+json;Captcha"},
				captcha: _captcha,
				assignments: ["human1"]
			};
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaConfigParserTest");
			_config.addOn(_addon);
			_config.addOn(new HTTPAddOn());

			let _parser = new CaptchaConfigParser();
			_parser.initialize(_azcontext, _config._config, _config.addOns);

			await assert.doesNotThrow(() => {_parser.parse(_Object);}, "Expected parsing.");

			assert.deepStrictEqual(_addon.captcha, _captcha, "Expected instance of GoogleReCaptchaActionV2.");
			assert.deepStrictEqual(_addon.assignments, ["human1"], "Expected ['human1']");
		});
		it("Defaults assignments.", async () => {
			let _captcha = new GoogleReCaptchaActionV2("mock_secret");
			let _addon = new CaptchaAddOn();
			let _Object = {
				$object: {contentType: "application/vnd.celastrinajs.config+json;Captcha"},
				captcha: _captcha
			};
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaConfigParserTest");
			_config.addOn(_addon);
			_config.addOn(new HTTPAddOn());

			let _parser = new CaptchaConfigParser();
			_parser.initialize(_azcontext, _config._config, _config.addOns);

			await assert.doesNotThrow(() => {_parser.parse(_Object);}, "Expected parsing.");

			assert.deepStrictEqual(_addon.captcha, _captcha, "Expected instance of GoogleReCaptchaActionV2.");
			assert.deepStrictEqual(_addon.assignments, ["human"], "Expected ['human']");
		});
		it("Fails no captcha", async () => {
			let _addon = new CaptchaAddOn();
			let _Object = {
				$object: {contentType: "application/vnd.celastrinajs.config+json;Captcha"},
				assignments: ["human1"]
			};
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaConfigParserTest");
			_config.addOn(_addon);
			_config.addOn(new HTTPAddOn());

			let _parser = new CaptchaConfigParser();
			_parser.initialize(_azcontext, _config._config, _config.addOns);

			await assert.rejects(async () => {await _parser.parse(_Object);},
				CelastrinaValidationError.newValidationError(
					"Attribute 'captcha' is required. Please add a captcha of type CaptchaAction.", "_Captcha.captcha"));
		});
		it("Fails not a CaptchaAction instance", async () => {
			let _addon = new CaptchaAddOn();
			let _Object = {
				$object: {contentType: "application/vnd.celastrinajs.config+json;Captcha"},
				captcha: {},
				assignments: ["human1"]
			};
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaConfigParserTest");
			_config.addOn(_addon);
			_config.addOn(new HTTPAddOn());

			let _parser = new CaptchaConfigParser();
			_parser.initialize(_azcontext, _config._config, _config.addOns);

			await assert.rejects(async () => {await _parser.parse(_Object);},
				CelastrinaValidationError.newValidationError(
					"Attribute 'captcha' is required. Please add a captcha of type CaptchaAction.", "_Captcha.captcha"));
		});
		it("Fails assignments not an array", async () => {
			let _captcha = new GoogleReCaptchaActionV2("mock_secret");
			let _addon = new CaptchaAddOn();
			let _Object = {
				$object: {contentType: "application/vnd.celastrinajs.config+json;Captcha"},
				captcha: _captcha,
				assignments: {}
			};
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaConfigParserTest");
			_config.addOn(_addon);
			_config.addOn(new HTTPAddOn());

			let _parser = new CaptchaConfigParser();
			_parser.initialize(_azcontext, _config._config, _config.addOns);

			await assert.rejects(async () => {await _parser.parse(_Object);},
				CelastrinaValidationError.newValidationError(
					"Attribute 'assignments' must be an array of strings.", "_Captcha.assignments"));
		});
	});
});
