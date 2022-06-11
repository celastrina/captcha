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
const {CaptchaAction} = require("../Captcha");

describe("CaptchaAction", () => {
	describe("#constructor(timeout)", () => {
		it("should set default timeout", () => {
			let _action = new CaptchaAction();
			assert.strictEqual(_action._timeout, 5000, "Expected 5000.");
		});
		it("should set timeout", () => {
			let _action = new CaptchaAction(1000);
			assert.strictEqual(_action._timeout, 1000, "Expected 1000.");
		});
	});
	describe("Accessors", () => {
		it("should set timeout", () => {
			let _action = new CaptchaAction();
			_action.timeout = 1000;
			assert.strictEqual(_action._timeout, 1000, "Expected 1000.");
		});
		it("should get timeout", () => {
			let _action = new CaptchaAction();
			_action.timeout = 1000;
			assert.strictEqual(_action.timeout, 1000, "Expected 1000.");
		});
	});
});
