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
const {GoogleReCaptchaParser, GoogleReCaptchaActionV3, GoogleReCaptchaActionV2} = require("../Captcha");
const {HeaderParameter, QueryParameter} = require("@celastrina/http");
const {instanceOfCelastrinaType, CelastrinaValidationError} = require("@celastrina/core");

describe("GoogleReCaptchaParser", () => {
	describe("#constructor(link, version)", () => {
		it("Should set name", () => {
			let _parser = new GoogleReCaptchaParser();
			assert.strictEqual(_parser.type, "GoogleReCaptcha", "Expected 'GoogleReCaptcha'.");
		});
	});
	describe("#_create(_GoogleReCaptcha)", () => {
		it("Creates V3 CaptchaAction", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v3",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new QueryParameter(),
				name: "x-mock-token",
				score: .25,
				assumeHumanOnTimeout: false,
				actions: ["mock_action"]
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.strictEqual(instanceOfCelastrinaType(GoogleReCaptchaActionV3, _ca), true, "Expected 'GoogleReCaptchaActionV3'.");
			assert.strictEqual(_ca.url, "https://www.mock.com", "Expected 'https://www.mock.com'.");
			assert.strictEqual(_ca.name, "x-mock-token", "Expected 'x-mock-token'.");
			assert.strictEqual(_ca.secret, "mock_secret_value", "Expected 'mock_secret_value'.");
			assert.strictEqual(_ca.assumeHumanOnTimeout, false, "Expected false.");
			assert.strictEqual(_ca.score, .25, "Expected .25.");
			assert.strictEqual(_ca.timeout, 10000, "Expected 10000.");
			assert.deepStrictEqual(_ca.actions, ["mock_action"], "Expected ['mock_action'].");
			assert.deepStrictEqual(_ca.parameter, new QueryParameter(), "Expected 'QueryParameter'.");
		});
		it("Creates V2 CaptchaAction", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new QueryParameter(),
				name: "x-mock-token",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.strictEqual(instanceOfCelastrinaType(GoogleReCaptchaActionV2, _ca), true, "Expected 'GoogleReCaptchaActionV2'.");
			assert.strictEqual(_ca.name, "x-mock-token", "Expected 'x-mock-token'.");
			assert.strictEqual(_ca.url, "https://www.mock.com", "Expected 'https://www.mock.com'.");
			assert.strictEqual(_ca.secret, "mock_secret_value", "Expected 'mock_secret_value'.");
			assert.strictEqual(_ca.assumeHumanOnTimeout, false, "Expected false.");
			assert.strictEqual(_ca.timeout, 10000, "Expected 10000.");
			assert.deepStrictEqual(_ca.parameter, new QueryParameter(), "Expected 'QueryParameter'.");
		});
		it("Fails for version", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				//version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new HeaderParameter(),
				name: "x-mock-token",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			await assert.rejects(_parser._create(_GoogleReCaptcha),
				CelastrinaValidationError.newValidationError(
					"Argument 'version' is required and must be 'v2' or 'v3'.", "_GoogleReCaptcha.version"));
		});
		it("Fails for secret", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				//secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new HeaderParameter(),
				name: "x-mock-token",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			await assert.rejects(_parser._create(_GoogleReCaptcha),
				CelastrinaValidationError.newValidationError(
					"Argument 'secret' is required.", "_GoogleReCaptcha.secret"));
		});
		it("Fails for name zero", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new HeaderParameter(),
				name: "",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			await assert.rejects(_parser._create(_GoogleReCaptcha),
				CelastrinaValidationError.newValidationError(
					"Argument 'name' is required.", "_GoogleReCaptcha.name"));
		});
		it("Fails for name zero with space", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new HeaderParameter(),
				name: "         ",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			await assert.rejects(_parser._create(_GoogleReCaptcha),
				CelastrinaValidationError.newValidationError(
					"Argument 'name' is required.", "_GoogleReCaptcha.name"));
		});
		it("Fails score < 0", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v3",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new QueryParameter(),
				name: "x-mock-token",
				score: -1,
				assumeHumanOnTimeout: false,
				actions: ["mock_action"]
			};
			let _parser = new GoogleReCaptchaParser();

			await assert.rejects(_parser._create(_GoogleReCaptcha),
				CelastrinaValidationError.newValidationError(
					"Argument 'score' is a percent and must be between 0 and 1.", "_GoogleReCaptcha.score"));
		});
		it("Fails score > 1", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v3",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new QueryParameter(),
				name: "x-mock-token",
				score: 1.1,
				assumeHumanOnTimeout: false,
				actions: ["mock_action"]
			};
			let _parser = new GoogleReCaptchaParser();

			await assert.rejects(_parser._create(_GoogleReCaptcha),
				CelastrinaValidationError.newValidationError(
					"Argument 'score' is a percent and must be between 0 and 1.", "_GoogleReCaptcha.score"));
		});
		it("Fails score NaN", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v3",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new QueryParameter(),
				name: "x-mock-token",
				score: "abcdefg",
				assumeHumanOnTimeout: false,
				actions: ["mock_action"]
			};
			let _parser = new GoogleReCaptchaParser();

			await assert.rejects(_parser._create(_GoogleReCaptcha),
				CelastrinaValidationError.newValidationError(
					"Argument 'score' must be a number.", "_GoogleReCaptcha.score"));
		});
		it("It defaults URL", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				timeout: 10000,
				parameter: new HeaderParameter(),
				name: "x-mock-token",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.strictEqual(_ca.url, "https://www.google.com/recaptcha/api/siteverify", "Expected 'https://www.google.com/recaptcha/api/siteverify'.");
		});
		it("It defaults timeout", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				parameter: new HeaderParameter(),
				name: "x-mock-token",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.strictEqual(_ca.timeout, 5000, "Expected 5000.");
		});
		it("It defaults parameter", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				name: "x-mock-token",
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.deepStrictEqual(_ca.parameter, new HeaderParameter(), "Expected 'HeaderParameter'.");
		});
		it("It defaults name", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new HeaderParameter(),
				assumeHumanOnTimeout: false,
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.strictEqual(_ca.name, "x-celastrinajs-captcha-token", "Expected 'x-celastrinajs-captcha-token'.");
		});

		it("It defaults assume", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v2",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new HeaderParameter(),
				name: "x-mock-token"
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.strictEqual(_ca.assumeHumanOnTimeout, true, "Expected true.");
		});
		it("It defaults score", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v3",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new QueryParameter(),
				name: "x-mock-token",
				assumeHumanOnTimeout: false,
				actions: ["mock_action"]
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.strictEqual(_ca.score, .8, "Expected .8.");
		});
		it("It defaults actions", async () => {
			let _GoogleReCaptcha = {
				$object: {contentType: "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
				version: "v3",
				secret : "mock_secret_value",
				url: "https://www.mock.com",
				timeout: 10000,
				parameter: new QueryParameter(),
				name: "x-mock-token",
				score: .25,
				assumeHumanOnTimeout: false
			};
			let _parser = new GoogleReCaptchaParser();

			/**@type{GoogleReCaptchaActionV3|GoogleReCaptchaActionV2}*/let _ca = await _parser._create(_GoogleReCaptcha);

			assert.deepStrictEqual(_ca.actions, [], "Expected [].");
		});

	});
});
