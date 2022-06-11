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

"use strict";

const {GoogleReCaptchaActionV3, GoogleReCaptchaActionV2} = require("../@celastrina/captcha");
const {HeaderParameter, QueryParameter} = require("@celastrina/http");
const {instanceOfCelastrinaType, Configuration, Subject} = require("@celastrina/core");
const {MockAzureFunctionContext} = require("../@celastrina/captcha/test/AzureFunctionContextMock");
const {MockHTTPContext} = require("../@celastrina/captcha/test/HTTPContextMock");

/**
 *
 * @returns {Promise<void>}
 */
async function integrationTestGoogleRecaptchaV3(secret, token) {
	console.log("Started, using secret '" + secret + "'.");
	let _captcha = new GoogleReCaptchaActionV3(secret);
	let _azcontext = new MockAzureFunctionContext();
	let _config = new Configuration("GoogleReCaptchaActionV2Test");

	// Set up the Azure Function Context.
	_azcontext.req.method = "GET";
	_azcontext.req.originalUrl = "https://localhost";
	_azcontext.req.headers["host"] = "https://www.celastrinajs.com";
	_azcontext.req.headers["accept"] = "*/*";
	_azcontext.req.headers["accept-encoding"] = "gzip, deflate, br";
	_azcontext.req.headers["connection"] = "keep-alive";
	_azcontext.req.headers["user-agent"] = "celastrina-test";
	_azcontext.req.headers["x-celastrinajs-captcha-token"] = token;

	await _config.initialize(_azcontext);

	let _context = new MockHTTPContext(_config);
	await _context.initialize();
	_context.subject = new Subject("mock_subject_id");

	let _result = await _captcha.isHuman(_context);

	if(!_result) throw "Failed to validate as human...";
}

const _aryIArgs = process.argv.slice(2);

const _response = "";

integrationTestGoogleRecaptchaV3(_aryIArgs[0], _response)
	.then(() => {
		console.log("Success!");
	})
	.catch((exception) => {
		console.log("Got an exception...");
		console.log(exception);
		process.exit(1);
	});
