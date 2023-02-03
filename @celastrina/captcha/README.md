# captcha

@celastrina/captcha is a CAPTCHA add-on for @celastrina/http.  @celastrina/captcha comes out-of-the-box with full support
for Google reCAPTCHA v2 and v3.

Fundamentally, @celastrina/captcha integrates with the core Sentry by adding a new Authenticator which takes a captcha 
token and attempts to authenticate a caller as "human". Upon success, the caller will be enrolled in a role you 
configure, to which, the services you want protected can be secured with that role using a Permission.

The following example code creates a v3 Google reCAPTCHA instance:

## Example

```
const {LOG_LEVEL, CelastrinaError, Configuration, Permission} = require(“@celastrina/core”);
const {HTTPAddOn, JSONHTTPContext, JSONHTTPFunction} = require(“@celastrina/http”);
const {CaptchaAddOn, GoogleReCaptchaActionV3} = require(“@celastrina/captcha”);

class MyFirstFunction extends JSONHTTPFunction {
    constructor(config) {
        super(config);
    } 

    async get(context) {
        context.log(“This can only be reached by a human!”, LOG_LEVEL.INFO, “MyFirstFunction._get(context)”);
        context.send({name: “sample”, message: "Welcome human person."}); // Return whatever object you’d like
    }
}
 
const _config = new Configuration(“MyFirstFunction”);
const _httpconfig = new HTTPAddOn();
const _captchaconfig = new CaptchaAddOn();
 
_config.addOn(_httpconfig);
_config.addOn(_captchaconfig);

_captchaconfig.captch = new GoogleReCaptchaActionV3("your_google_site_secret");

_config.permissions.addPermission(new Permission("get", ["human"], new MatchAny()));

module.exports = new MyFirstFunction (_config);
```

The above code secures the HTTP GET method for this function with a role named "human". The "human" role is a default
role assigned by the CaptchaAddOn. The GoogleReCaptchaActionV3 defaults to an acceptability score of .8 or better and 
defaults to no google actions. All the attributes are configurable to meet your needs.

**WARNING**: The code example above has a secret in code/configuration, please do not do this. Either load from a secure App Setting 
or preferably use core JSON configuration and Azure Key Vault.

## Using JSON Configuration

@celastrina/captcha introduces a new configuration type when using JSON based configuration:

### Google reCAPTCHA v2

```
{
  "configurations": [
    {
      "$object": {"contentType": "application/vnd.celastrinajs.config+json;Captcha"},
      "captcha": {
        "$object": {"contentType": "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
        "version": "v2",
        "secret" : "some_secret_value",
        "url": "https://www.google.com/recaptcha/api/siteverify",
        "timeout": 5000,
        "parameter": {"$object": {"contentType": "application/vnd.celastrinajs.attribute+json;HTTPParameter"},
                      "parameter":  "header"},
        "name": "x-celastrinajs-captcha-token",
        "assumeHumanOnTimeout": true
      },
      "assignments": ["human"]
    }
  ]
}
```

### Google reCAPTCHA v3

```
{
  "configurations": [
    {
      "$object": {"contentType": "application/vnd.celastrinajs.config+json;Captcha"},
      "captcha": {
        "$object": {"contentType": "application/vnd.celastrinajs.attribute+json;GoogleReCaptcha"},
        "version": "v3",
        "secret" : "some_secret_value",
        "url": "https://www.google.com/recaptcha/api/siteverify",
        "timeout": 5000,
        "parameter": {"$object": {"contentType": "application/vnd.celastrinajs.attribute+json;HTTPParameter"},
                      "parameter":  "header"},
        "name": "x-celastrinajs-captcha-token",
        "score": .75,
        "actions": ["some_google_captcha_action"],
        "assumeHumanOnTimeout": true
      },
      "assignments": ["human"]
    }
  ]
}
```

## Add-On Dependencies

This module depends on Celastrina Add-On @celastrina/http.

## Documentation and More

For more information please visit [@celastrina/captcha](https://github.com/celastrina/captcha/wiki) wiki on Github.
