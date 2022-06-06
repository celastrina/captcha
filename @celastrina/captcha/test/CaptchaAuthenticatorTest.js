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
const {CaptchaAction, CaptchaAuthenticator} = require("../Captcha");
const {getDefaultTimeout, Configuration, Subject, Assertion} = require("@celastrina/core");
const {HTTPContext} = require("@celastrina/http");
const {MockAzureFunctionContext} = require("./AzureFunctionContextMock");

class MockCaptchaAction extends CaptchaAction {
	constructor(passHumanCheck = false) {
		super();
		this.isHumanInvoked = false;
		this.passHumanCheck = passHumanCheck;
	}

	reset(passHumanCheck = false) {
		this.isHumanInvoked = false;
		this.passHumanCheck = passHumanCheck;
	}
	/**
	 * @param {HTTPContext} context
	 * @return {Promise<boolean>}
	 * @abstract
	 */
	async isHuman(context) {
		this.isHumanInvoked = true;
		return this.passHumanCheck;
	}
}

describe("CaptchaAuthenticator", () => {
	describe("#constructor(captcha, assignments)", () => {
		it("should fail with bad captcha instance", () => {
			assert.throws(() => {
				let _auth = new CaptchaAuthenticator({});
			}, "should throw exception for non CaptchaAction.");
		});
		it("should set captcha and default assignments", () => {
			let _action = new MockCaptchaAction();
			let _auth = new CaptchaAuthenticator(_action);
			assert.deepStrictEqual(_auth._captcha, _action, "Expected CaptchaAction.");
			assert.deepStrictEqual(_auth._assignments, ["human"], "Expected array ['human'].");
		});
		it("should set captcha and assignments", () => {
			let _action = new MockCaptchaAction();
			let _auth = new CaptchaAuthenticator(_action, ["Robert"]);
			assert.deepStrictEqual(_auth._captcha, _action, "Expected CaptchaAction.");
			assert.deepStrictEqual(_auth._assignments, ["Robert"], "Expected array ['Robert'].");
		});
	});
	describe("Accessors", () => {
		it("should get captcha", () => {
			let _action = new MockCaptchaAction();
			let _auth = new CaptchaAuthenticator(_action);
			assert.deepStrictEqual(_auth.captcha, _action, "Expected CaptchaAction.");
		});
		it("should get assignments", () => {
			let _action = new MockCaptchaAction();
			let _auth = new CaptchaAuthenticator(_action, ["Robert"]);
			assert.deepStrictEqual(_auth.assignments, ["Robert"], "Expected array ['Robert'].");
		});
	});
	describe("Authentication", () => {
		it("should pass and return true", async () => {
			let _mock = new MockCaptchaAction(true);
			let _auth = new CaptchaAuthenticator(_mock);
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaAuthenticatorTest");

			await _config.initialize(_azcontext);
			let _context = new HTTPContext(_config);
			await _context.initialize();
			_context.subject = new Subject("mock_subject_id");
			let _assertion = new Assertion(_context, _context.subject, _config.permissions);

			await _auth.authenticate(_assertion);

			assert.strictEqual(await _assertion.hasAffirmativeAssertion(), true, "Expected true.");
			assert.deepStrictEqual(_assertion._assignments.has("human"), true, "Expected to have 'human' assignment.");
		});
		it("should fail and return false", async () => {
			let _mock = new MockCaptchaAction(false);
			let _auth = new CaptchaAuthenticator(_mock);
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("CaptchaAuthenticatorTest");

			await _config.initialize(_azcontext);
			let _context = new HTTPContext(_config);
			await _context.initialize();
			_context.subject = new Subject("mock_subject_id");
			let _assertion = new Assertion(_context, _context.subject, _config.permissions);

			await _auth.authenticate(_assertion);

			assert.strictEqual(await _assertion.hasAffirmativeAssertion(), false, "Expected false.");
			assert.deepStrictEqual(_assertion._assignments.has("human"), false, "Expected to not have 'human' assignments.");
		});
	});
});

module.exports = {
	MockCaptchaAction: MockCaptchaAction
};
