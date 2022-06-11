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
const {HeaderParameter, QueryParameter} = require("@celastrina/http");
const {instanceOfCelastrinaType, Configuration, Assertion, Subject} = require("@celastrina/core");
const {GoogleReCaptchaActionV2} = require("../Captcha");
const {MockGoogleReCaptcha} = require("./GoogleReCaptchaMock");
const {MockAzureFunctionContext} = require("./AzureFunctionContextMock");
const {MockHTTPContext} = require("./HTTPContextMock");

describe("GoogleReCaptchaActionV2Test", () => {
	describe("Celastrina Instance Of", () => {
		it("Is Instance of GoogleReCaptchaActionV2", () => {
			assert.strictEqual(instanceOfCelastrinaType(GoogleReCaptchaActionV2, new GoogleReCaptchaActionV2("abcdefghijklmnop")), true,
				"Expected insta of GoogleReCaptchaActionV2.");
		});
	});
	describe("#constructor(secret, parameter, name, timeout, url)", () => {
		it("Sets default values", () => {
			let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
			assert.strictEqual(_captcha._url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
			assert.deepStrictEqual(_captcha._parameter, new HeaderParameter(), "Expected HeaderParameter.");
			assert.strictEqual(_captcha._name, "x-celastrinajs-captcha-token", "Expected 'x-celastrinajs-captcha-token'.");
			assert.strictEqual(_captcha._timeout, 5000, "Expected 5000.");
		});
		it("Sets secret", () => {
			let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
			assert.strictEqual(_captcha._url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
			assert.deepStrictEqual(_captcha._parameter, new HeaderParameter(), "Expected HeaderParameter.");
			assert.strictEqual(_captcha._name, "x-celastrinajs-captcha-token", "Expected 'x-celastrinajs-captcha-token'.");
			assert.strictEqual(_captcha._timeout, 5000, "Expected 5000.");
			assert.strictEqual(_captcha._secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
		});
		it("Sets values", () => {
			let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop", new QueryParameter(), "captchaToken", 1000, "https://www.google.com");
			assert.strictEqual(_captcha._url, "https://www.google.com", "Expected 'https://www.google.com'.");
			assert.deepStrictEqual(_captcha._parameter, new QueryParameter(), "Expected QueryParameter.");
			assert.strictEqual(_captcha._name, "captchaToken", "Expected 'captchaToken'.");
			assert.strictEqual(_captcha._timeout, 1000, "Expected 1000.");
			assert.strictEqual(_captcha._secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
		});
	});
	describe("Getters and Setters",  () => {
		describe("url", () => {
			it("Gets URL", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
			});
			it("Sets URL", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
				_captcha.url = "https://www.google.com";
				assert.strictEqual(_captcha.url, "https://www.google.com", "Expected 'https://www.google.com'.");
			});
		});
		describe("secret", () => {
			it("Gets secret", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
			});
			it("Sets secret", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
				_captcha.secret = "qrstuvwxyz";
				assert.strictEqual(_captcha.secret, "qrstuvwxyz", "Expected 'qrstuvwxyz'.");
			});
		});
		describe("timeout", () => {
			it("Gets timeout", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.timeout, 5000, "Expected 5000.");
			});
			it("Sets timeout", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.timeout, 5000, "Expected 5000.");
				_captcha.timeout = 1000;
				assert.strictEqual(_captcha.timeout, 1000, "Expected 1000.");
			});
		});
		describe("assumeHumanOnTimeout", () => {
			it("Gets timeout", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.assumeHumanOnTimeout, true, "Expected true.");
			});
			it("Sets timeout", () => {
				let _captcha = new GoogleReCaptchaActionV2("abcdefghijklmnop");
				assert.strictEqual(_captcha.assumeHumanOnTimeout, true, "Expected true.");
				_captcha.assumeHumanOnTimeout = false;
				assert.strictEqual(_captcha.assumeHumanOnTimeout, false, "Expected false.");
			});
		});
	});
	describe("#isHuman(context)", () => {
		it("Passes Human Verification", async () => {
			let _mock = new MockGoogleReCaptcha();
			await _mock.start();

			let _captcha = new GoogleReCaptchaActionV2("ABCDEFGHIJKLMNOP");
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("GoogleReCaptchaActionV2Test");

			// Set up the Azure Function Context.
			_azcontext.req.method = "GET";
			_azcontext.req.originalUrl = "https://www.celastrinajs.com";
			_azcontext.req.headers["host"] = "https://www.celastrinajs.com";
			_azcontext.req.headers["accept"] = "*/*";
			_azcontext.req.headers["accept-encoding"] = "gzip, deflate, br";
			_azcontext.req.headers["connection"] = "keep-alive";
			_azcontext.req.headers["user-agent"] = "celastrina-test";
			_azcontext.req.headers["x-celastrinajs-captcha-token"] = "1234567890";

			await _config.initialize(_azcontext);

			let _context = new MockHTTPContext(_config);
			await _context.initialize();
			let _assertion = new Assertion(_context, new Subject("mock_subject_id"), _config.permissions);

			assert.strictEqual(await _captcha.isHuman(_assertion), true, "Expected true.");

			await _mock.stop();
		});
		it("Fails Human Verification", async () => {
			let _mock = new MockGoogleReCaptcha();
			await _mock.start(true);

			let _captcha = new GoogleReCaptchaActionV2("ABCDEFGHIJKLMNOP");
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("GoogleReCaptchaActionV2Test");

			// Set up the Azure Function Context.
			_azcontext.req.method = "GET";
			_azcontext.req.originalUrl = "https://www.celastrinajs.com";
			_azcontext.req.headers["host"] = "https://www.celastrinajs.com";
			_azcontext.req.headers["accept"] = "*/*";
			_azcontext.req.headers["accept-encoding"] = "gzip, deflate, br";
			_azcontext.req.headers["connection"] = "keep-alive";
			_azcontext.req.headers["user-agent"] = "celastrina-test";
			_azcontext.req.headers["x-celastrinajs-captcha-token"] = "1234567890";

			await _config.initialize(_azcontext);

			let _context = new MockHTTPContext(_config);
			await _context.initialize();
			let _assertion = new Assertion(_context, new Subject("mock_subject_id"), _config.permissions);

			assert.strictEqual(await _captcha.isHuman(_assertion), false, "Expected false.");

			await _mock.stop();
		});
		it("Passes Human Verification with Timeout", async () => {
			let _mock = new MockGoogleReCaptcha();
			_mock.timeout = true;
			await _mock.start();
			let _captcha = new GoogleReCaptchaActionV2("ABCDEFGHIJKLMNOP");
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("GoogleReCaptchaActionV2Test");

			// Set up the Azure Function Context.
			_azcontext.req.method = "GET";
			_azcontext.req.originalUrl = "https://www.celastrinajs.com";
			_azcontext.req.headers["host"] = "https://www.celastrinajs.com";
			_azcontext.req.headers["accept"] = "*/*";
			_azcontext.req.headers["accept-encoding"] = "gzip, deflate, br";
			_azcontext.req.headers["connection"] = "keep-alive";
			_azcontext.req.headers["user-agent"] = "celastrina-test";
			_azcontext.req.headers["x-celastrinajs-captcha-token"] = "1234567890";

			await _config.initialize(_azcontext);

			let _context = new MockHTTPContext(_config);
			await _context.initialize();
			let _assertion = new Assertion(_context, new Subject("mock_subject_id"), _config.permissions);

			assert.strictEqual(await _captcha.isHuman(_assertion), true, "Expected true.");

			await _mock.stop();
		});
		it("Fails Human Verification with Timeout", async () => {
			let _mock = new MockGoogleReCaptcha();
			_mock.timeout = true;
			await _mock.start();
			let _captcha = new GoogleReCaptchaActionV2("ABCDEFGHIJKLMNOP");
			_captcha.assumeHumanOnTimeout = false;
			let _azcontext = new MockAzureFunctionContext();
			let _config = new Configuration("GoogleReCaptchaActionV2Test");

			// Set up the Azure Function Context.
			_azcontext.req.method = "GET";
			_azcontext.req.originalUrl = "https://www.celastrinajs.com";
			_azcontext.req.headers["host"] = "https://www.celastrinajs.com";
			_azcontext.req.headers["accept"] = "*/*";
			_azcontext.req.headers["accept-encoding"] = "gzip, deflate, br";
			_azcontext.req.headers["connection"] = "keep-alive";
			_azcontext.req.headers["user-agent"] = "celastrina-test";
			_azcontext.req.headers["x-celastrinajs-captcha-token"] = "1234567890";

			await _config.initialize(_azcontext);

			let _context = new MockHTTPContext(_config);
			await _context.initialize();
			let _assertion = new Assertion(_context, new Subject("mock_subject_id"), _config.permissions);

			assert.strictEqual(await _captcha.isHuman(_assertion), false, "Expected false.");

			await _mock.stop();
		});
	});
});
