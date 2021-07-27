---
layout: page_v2
title: UID2.0
description: What is UID2.0
sidebarType: 9
---

# Prebid UID2.0
{: .no_toc}

* TOC
{:toc}

## What is it?

UID2.0 is an identification service that transforms a consented user identifer, derived from the users email address, into a pseudonymous user id that can be used in combination with the [UID2 user id subadapter](https://docs.prebid.org/dev-docs/modules/userId.html#unified-id-20) for cross domain behavioral ad targeting. 


## How does it work?

The core principal of UID2.0 is use consent, what makes UID2.0 different from previous iterations of universal identifiers is its requirement that the user actively consent to being tracked.  This consent can be obtained in one of two ways. 

### SSO providers

SSO providers like [OpenPass](https://github.com/criteo/openpass/blob/main/README.md) provide a modularized approch to gaining user consent. By adding the OpenPass module to your site you can safely obtain user consent for use in ad targeting. 

### Publisher obtained consent

If using an SSO provider is not an option, publishers may ask for and obtain consent from their users themselves.  This approch places the consent liability on the publishers.  If publishers are found to have garnered user email addresses without consent they can have their UID2 API tokens revoked. Publishers should also comply with applicable regional privacy obgliations like GDPR. In some locals, withholding content in echange for consent is illegal.

Once available publishers may request UID2.0 API tokens from the IAB [here]()

#### STEP 1
 Request a UID2.0 API token from the IAB.  **please note that as of Augest 2021, the IAB is not prepared to generate API tokens, when that changes this page will be udated**

#### STEP 2
Make an http GET request to the Prebid UID2.0 service endpoint 

##### Authentication and Authorization 

All Endpoints are over HTTPs using API Key provided in step 1. 
The API Key should be passed in an Authorization header on all requests. 
ex. Authorization: Bearer <your api key> 

##### Generating UID2.0

Endpoint: GET /token/generate 

ex
```
GET https://integ.uidapi.com/token/generate?email=fake@email.com
```
###### Parameter(s)

- email: User's email address (string) 
- email_hash: Standard SHA256 hash of normalized email address. 

Note: email or email_hash parameter is required.

##### Returns: 

The service endpoint will return with a JSON payload containing an `advertising_token` which should be stored in a cookie in th publishers domain under the name `__uid2_advertising_token`.  The User ID [UID2.0](https://docs.prebid.org/dev-docs/modules/userId.html#unified-id-20) sub adapter will retrieve the `advertising_token` and add it to your bid requests. 

```JSON
{ 
 "advertising_token", 
 "user_token", 
 "refresh_token" 
} 
```

Pleaes make sure emails are normalized using the following rules:

- Remove all trailing and leading white spaces 
- Remove all dots before @ symbol. ASCII code 46 (e.g. foo.bar@xyz.com transforms to foobar@xyz.com)
- Strip all trailing characters (including) + upto the @ symbol in email address. (e.g. foo+bar@xyz.c om transforms to foo@xyz.com) 
- Lowercase all ASCII characters 

##### Testing UID 2.0 

###### Testing Logout
Using "optout@email.com" will always result in Response token where subsequent refresh token calls will result in a logout response.

###### Validating Tokens 

Endpoint: GET /token/validate 

###### Parameter(s): 

- token: advertising_token value 
- email: User's email address (string) 
- email_hash: Standard SHA256 hash of normalized email address. 

Note: email or email_hash parameter is required. 
Note: Only email address (or hash) of validate@email.com is allowed for security purposes Returns: true|false 
- true: The sent token matches the email (or hash) 
- false: The sent token is invalid or does not match the provided email (or hash)

##### Client Side SDK 

The page should include the following Script: https://integ.uidapi.com/static/js/uid2-sdk-0.0.1a.js

###### Instantiating and Establishing Identity 

Following is what what should be used to instantiate the Unified Id lifecycle on the client: 

```HTML
<script> 
 __uid2.init({ 
 identity : <Response from the generate token api> 
 }); 
</script>
``` 
The identity payload is only required for initialy establishing the identity. 

###### Getting Advertsing Coding for RTB Purposes 

The call would return an AdvertisingToken or Empty String 

```HTML
<script> 
__uid2.getAdvertisingToken(); 
</script> 
```

###### De-Establishing Identity 

The following should be called when user logs out or is unauthenticated 

```HTML
<script> 
__uid2.disconnect(); 
</script>
```

Finally, please make sure you recieve consent before calling the UID2.0 service endpoint, and store a record of consent to ensure compliance with applicable regional privacy regulations. 

