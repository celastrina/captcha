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
const {GoogleReCaptchaActionV3} = require("../Captcha");
const {HeaderParameter, QueryParameter} = require("@celastrina/http");
const {instanceOfCelastrinaType, Configuration, Subject, Assertion} = require("@celastrina/core");
const {MockGoogleReCaptcha} = require("./GoogleReCaptchaMock");
const {MockAzureFunctionContext} = require("./AzureFunctionContextMock");
const {MockHTTPContext} = require("./HTTPContextMock");

describe("GoogleReCaptchaActionV3", () => {
	describe("Celastrina Instance Of", () => {
		it("Is Instance of GoogleReCaptchaActionV3", () => {
			assert.strictEqual(instanceOfCelastrinaType(GoogleReCaptchaActionV3, new GoogleReCaptchaActionV3("abcdefghijklmnop")), true,
				"Expected insta of GoogleReCaptchaActionV3.");
		});
	});
	describe("#constructor(secret, score, actions, parameter,name, timeout, url)", () => {
		it("Sets default values", () => {
			let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
			assert.strictEqual(_captcha._url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
			assert.deepStrictEqual(_captcha._parameter, new HeaderParameter(), "Expected HeaderParameter.");
			assert.strictEqual(_captcha._name, "x-celastrinajs-captcha-token", "Expected 'x-celastrinajs-captcha-token'.");
			assert.strictEqual(_captcha._timeout, 5000, "Expected 5000.");
			assert.strictEqual(_captcha._score, .8, "Expected .8.");
			assert.deepStrictEqual(_captcha._actions, [], "Expected [].");
		});
		it("Sets secret", () => {
			let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
			assert.strictEqual(_captcha._url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
			assert.deepStrictEqual(_captcha._parameter, new HeaderParameter(), "Expected HeaderParameter.");
			assert.strictEqual(_captcha._name, "x-celastrinajs-captcha-token", "Expected 'x-celastrinajs-captcha-token'.");
			assert.strictEqual(_captcha._timeout, 5000, "Expected 5000.");
			assert.strictEqual(_captcha._secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
			assert.strictEqual(_captcha._score, .8, "Expected .8.");
			assert.deepStrictEqual(_captcha._actions, [], "Expected [].");
		});
		it("Sets values", () => {
			let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop", .5, ["test"], new QueryParameter(), "captchaToken", 1000, "https://www.google.com");
			assert.strictEqual(_captcha._url, "https://www.google.com", "Expected 'https://www.google.com'.");
			assert.deepStrictEqual(_captcha._parameter, new QueryParameter(), "Expected QueryParameter.");
			assert.strictEqual(_captcha._name, "captchaToken", "Expected 'captchaToken'.");
			assert.strictEqual(_captcha._timeout, 1000, "Expected 1000.");
			assert.strictEqual(_captcha._secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
			assert.strictEqual(_captcha._score, .5, "Expected .5.");
			assert.deepStrictEqual(_captcha._actions, ["test"], "Expected [\"test\"].");
		});
	});
	describe("Getters and Setters",  () => {
		describe("url", () => {
			it("Gets URL", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
			});
			it("Sets URL", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
				_captcha.url = "https://www.google.com";
				assert.strictEqual(_captcha.url, "https://www.google.com", "Expected 'https://www.google.com'.");
			});
		});
		describe("secret", () => {
			it("Gets secret", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
			});
			it("Sets secret", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.secret, "abcdefghijklmnop", "Expected 'abcdefghijklmnop'.");
				_captcha.secret = "qrstuvwxyz";
				assert.strictEqual(_captcha.secret, "qrstuvwxyz", "Expected 'qrstuvwxyz'.");
			});
		});
		describe("timeout", () => {
			it("Gets timeout", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.timeout, 5000, "Expected 5000.");
			});
			it("Sets timeout", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.timeout, 5000, "Expected 5000.");
				_captcha.timeout = 1000;
				assert.strictEqual(_captcha.timeout, 1000, "Expected 1000.");
			});
		});
		describe("score", () => {
			it("Gets score", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.score, .8, "Expected .8.");
			});
			it("Sets score", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.strictEqual(_captcha.score, .8, "Expected .8.");
				_captcha.score = .5;
				assert.strictEqual(_captcha.score, .5, "Expected .5.");
			});
		});
		describe("actions", () => {
			it("Gets actions", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.deepStrictEqual(_captcha.actions, [], "Expected [].");
			});
			it("Sets actions", () => {
				let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop");
				assert.deepStrictEqual(_captcha.actions, [], "Expected [].");
				_captcha.actions = ["test"];
				assert.deepStrictEqual(_captcha.actions, ["test"], "Expected [\"test\"].");
			});
		});
	});
	describe("#isActionValid(action)", () => {
		it("Returns true with valid action", () => {
			let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop", .8, ["test1", "test2", "test3"]);
			assert.strictEqual(_captcha.isActionValid("test1"), true, "expected 'test1' true.");
			assert.strictEqual(_captcha.isActionValid("test2"), true, "expected 'test2' true.");
			assert.strictEqual(_captcha.isActionValid("test3"), true, "expected 'test3' true.");
		});
		it("Returns false with invalid action", () => {
			let _captcha = new GoogleReCaptchaActionV3("abcdefghijklmnop", .8, ["test1", "test2", "test3"]);
			assert.strictEqual(_captcha.isActionValid("test4"), false, "expected 'test4' false.");
		});
	});
	describe("#isHuman(context)", () => {
		it("Passes Human Verification", async () => {
			let _mock = new MockGoogleReCaptcha();
			await _mock.start(false, "v3");

			let _captcha = new GoogleReCaptchaActionV3("ABCDEFGHIJKLMNOP");
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
		it("Passes Human Verification With Action", async () => {
			let _mock = new MockGoogleReCaptcha();
			await _mock.start(false, "v3", .8, "1234567890", "testaction2");

			let _captcha = new GoogleReCaptchaActionV3("ABCDEFGHIJKLMNOP", .8, ["testaction2"]);
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
			await _mock.start(true, "v3");

			let _captcha = new GoogleReCaptchaActionV3("ABCDEFGHIJKLMNOP");
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
		it("Fails Human Verification low score", async () => {
			let _mock = new MockGoogleReCaptcha();
			await _mock.start(false, "v3", .5);

			let _captcha = new GoogleReCaptchaActionV3("ABCDEFGHIJKLMNOP");
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
		it("Fails Human Verification wrong action", async () => {
			let _mock = new MockGoogleReCaptcha();
			await _mock.start(false, "v3", .8, "1234567890", "testaction1");

			let _captcha = new GoogleReCaptchaActionV3("ABCDEFGHIJKLMNOP", .8, ["testaction2"]);
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
			let _captcha = new GoogleReCaptchaActionV3("ABCDEFGHIJKLMNOP");
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
			let _captcha = new GoogleReCaptchaActionV3("ABCDEFGHIJKLMNOP");
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

