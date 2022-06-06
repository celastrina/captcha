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
const {CaptchaAddOn, CaptchaConfigParser, CaptchaAction, GoogleReCaptchaParser, GoogleReCaptchaActionV2} = require("../Captcha");
const {HTTPAddOn} = require("@celastrina/http");
const {instanceOfCelastrinaType, AddOn, Configuration, Sentry, getDefaultTimeout, CelastrinaError} = require("@celastrina/core");
const {MockAzureFunctionContext} = require("./AzureFunctionContextMock");
const {MockCaptchaAction} = require("./CaptchaAuthenticatorTest");

describe("CaptchaAddOn", () => {
	describe("Celastrina Instance Of", () => {
		it("Is Instance of CaptchaAddOn", () => {
			assert.strictEqual(instanceOfCelastrinaType(AddOn, new CaptchaAddOn()), true,
				"Expected insta of CaptchaAddOn.");
			assert.strictEqual(instanceOfCelastrinaType(CaptchaAddOn, new CaptchaAddOn()), true,
				"Expected insta of CaptchaAddOn.");
			assert.strictEqual(CaptchaAddOn.$object.addOn, "celastrinajs.addon.captcha", "Expected 'celastrinajs.addon.captcha'.");
		});
	});
	describe("#constructor(dependencies, lifecycles)", () => {
		it("Should depend on HTTPAddOn",  () => {
			let _addon = new CaptchaAddOn();
			assert.deepStrictEqual(_addon.dependancies, new Set([HTTPAddOn.$object.addOn]), "Expected tp depend on HTTPAddOn");
		});
	});
	describe("Parsers.", () => {
		it("Should use Captcha Config Parser", () => {
			let _addon = new CaptchaAddOn();
			assert.deepStrictEqual(_addon.getConfigParser(), new CaptchaConfigParser(), "Expected CaptchaConfigParser.")
		});
		it("Should use Google Attribute Parser", () => {
			let _addon = new CaptchaAddOn();
			assert.deepStrictEqual(_addon.getAttributeParser(), new GoogleReCaptchaParser(), "Expected GoogleReCaptchaParser.")
		});
	});
	describe("#initialize(azcontext, config)", () => {
		it("should initialize and set authenticator", async () => {
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaAddOnTest");
			let _addon = new CaptchaAddOn();

			await _config.initialize(_azcontext);
			_addon.captcha = new MockCaptchaAction();
			await _addon.initialize(_azcontext, _config._config);

			/**@type{Sentry}*/let _sentry = _config.getValue(Configuration.CONFIG_SENTRY);

			let _authenticator = _sentry.authenticator;
			let _found = false;
			do {
				_found = (_authenticator.name === "CaptchaAuthenticator");
				_authenticator = _authenticator._link;
			}while(_authenticator != null && !_found);

			assert.strictEqual(_found, true, "Expected CaptchaAuthenticator to be added.");
		});
	});
});
