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
const {CaptchaAddOn, CaptchaConfigParser, GoogleReCaptchaParser} = require("../Captcha");
const {HTTPAddOn} = require("@celastrina/http");

describe("CaptchaAddOn", () => {
	describe("AddOn Types", () => {
		it("should have a stupid value", () => {
			assert.strictEqual(CaptchaAddOn.celastrinaType, "celastrinajs.captcha.CaptchaAddOn", "Expected 'celastrinajs.captcha.CaptchaAddOn'.");
			assert.strictEqual(CaptchaAddOn.addOnName, "celastrinajs.addon.captcha", "Expected 'celastrinajs.addon.captcha'.");
		});
	});
	describe("#constructor(dependencies, lifecycles)", () => {
		it("Should depend on HTTPAddOn",  () => {
			let _addon = new CaptchaAddOn();
			assert.deepStrictEqual(_addon.dependancies, new Set([HTTPAddOn.addOnName]), "Expected tp depend on HTTPAddOn");
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

});