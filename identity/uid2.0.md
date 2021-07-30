---
layout: page_v2
title: UID2
description: What is UID2
sidebarType: 9
---

# Prebid UID2
{: .no_toc}

{: .alert.alert-danger :}
Prebid is not ready to support UID2 in production. We're releasing this documentation to
address industry curiosity about how it will work when hosted by Prebid.org,
but we aren't yet accepting requests to utilize Prebid's UID2 Operator.
When the IAB and Prebid are ready to host this service, this page
will be updated with details and there will be a blog post.

* TOC
{:toc}

## What is it?

Unified ID 2.0 (UID2) is a deterministic identifier based on user information such as email or phone number built with user-transparency and privacy controls. The UID2 identifier enables logged-in experiences from publisher websites, mobile apps, and CTV apps to monetize through programmatic workflows. Benefitting from several layers of security and privacy measures, UID2s safely distribute across the open internet.

The [IAB](https://iabtechlab.com/blog/working-together-to-support-uid2/) is the administrator of the UID2 service, and Prebid.org is one of several 'operators',
meaning we host a global cluster of servers that publishers may use to integrate UID2 into their identity solutions.

Core principals of UID2 include:
- Independent Governance
- First-Party Relationships
- Non-Proprietary (Universal) Standard
- Open Source
- Interoperable
- Secure and Encrypted Data
- Transparency and Control

See the [UID2 docs](https://github.com/UnifiedID2/uid2docs) for more details
about how it's designed to keep user identity safe.

## How does it work?

This diagram summarizes how UID2 works with Prebid:

![Prebid Server Cookie Sync](/assets/images/UID2.png){:class="pb-xlg-img"}

1. The Publisher obtains an 'API token' from the IAB and stores it in their server.
2. The Publisher obtains consent from each user to utilize their static information for relevant advertising.
3. The 'advertising token' is obtained from Prebid's UID2 cluster or another UID2 operator. This is an encrypted ID based on a stable piece of identification (such as email).
4. Prebid verifies the publisher API token is valid.
5. Assuming everything looks good, an advertising token is returned and stored in a first party cookie.
6. Prebid.js bid requests are enriched with the UID2 advertising token
7. Bidders with valid decryption keys can unlock the advertising token to obtain a user ID. This can be used to make advertising more targeted and relevant.

### 1. Obtain an API Token

The publisher needs to request a UID2 API token from the IAB.

{: .alert.alert-danger :}
As of August 2021, the IAB is not prepared to generate API tokens.
When that changes this page will be updated.

### 2. Obtain User Consent

Publishers must confirm with each user that their UID2 ID may be used for
personalized advertising. There are two ways do do it: using an SSO or
publisher obtained consent.

#### SSO providers

Single Sign-On (SSO) providers like [OpenPass](https://github.com/criteo/openpass/blob/main/README.md) provide a modularized approch to gaining user consent. By adding OpenPass to your site you can safely obtain user consent for use in ad targeting. 

#### Publisher obtained consent

If using an SSO provider is not an option, publishers may ask for and obtain consent from users themselves.

{: .alert.alert-danger :}
This approch places consent liability on the publisher.  If publishers are found to have garnered user email addresses without consent they can have their UID2 API tokens revoked. Publishers should also comply with applicable regional privacy obligations like GDPR. In some locales, withholding content in exchange for consent is illegal.

### 3. Get UID2 Advertising Token

After confirming consent, the publisher's server calls the Prebid operator with the API token and the user's static information to get the
advertising token that's passed through the ecosystem.

The API Key should be passed in an Authorization HTTP header on the requests. 
ex. Authorization: Bearer <your api key> 

Endpoint: GET /token/generate 

ex
```
GET https://integ.uidapi.com/token/generate?email=fake@email.com
```

**Parameter(s)**

- email: User's email address (string) 
- email_hash: Standard SHA256 hash of normalized email address. 

Note: email or email_hash parameter is required.

**Return Values**

The service endpoint will return with a JSON payload containing an `advertising_token` which should be stored in a cookie in th publishers domain under the name `__uid2_advertising_token`.  The User ID [UID2](https://docs.prebid.org/dev-docs/modules/userId.html#unified-id-20) sub adapter will retrieve the `advertising_token` and add it to your bid requests. 

```JSON
{ 
 "advertising_token", 
 "user_token", 
 "refresh_token" 
} 
```

Please make sure email addresses are normalized using the following rules:

- Remove all trailing and leading white spaces 
- Remove all dots before @ symbol. ASCII code 46 (e.g. foo.bar@xyz.com transforms to foobar@xyz.com)
- Strip all trailing characters (including) + upto the @ symbol in email address. (e.g. foo+bar@xyz.c om transforms to foo@xyz.com) 
- Lowercase all ASCII characters 

### 4. Prebid Verifies the API Token with the Administrator

Periodically, each UID2 operator must confirm that a given API Token is still
valid. This enables the administrator to control who has access to utilize
the UID2 system. This is where publishers and buyers who mishandle user
identity data may be excluded.

### 5. Store the Advertising Token

As noted in step 3 above, the response from the UID2 operator call will
include an 'advertising_token'. The publisher must store this value in the
first party cookie '__uid2_advertising_token' so that the call
doesn't need to be made on every page.

Note there's also a [token refresh](https://github.com/UnifiedID2/uid2docs/blob/main/api/v1/endpoints/get-token-refresh.md) period that requires getting an
updated advertising token periodically. See the UID2 documentation for details.

### 6. Enriched Prebid.js Header Bidding

The Prebid.js [UID2 Module](/dev-docs/modules/userId.html#unified-id-20)
 should be configured to read the '__uid2_advertising_token' cookie, the value of which will be passed along through the
relevant bid adapters.

### 7. Bidders Utilize the Token

Bidders in good standing with the UID2 administrator and operator will
be able to decode incoming advertising tokens. The decoded token allows
them to look up user-related data for relevant ad targeting.

## More Information

For further information, such as how to logout, refresh tokens, and
alternate integration methods, see the [UID2 documentation](https://github.com/UnifiedID2/uid2docs/blob/main/api/README.md).

## Related Reading

- [UID2 Integration Guide](https://github.com/UnifiedID2/uid2docs/blob/main/api/v1/guides/README.md)
- [Prebid.js UID2 User ID module](/dev-docs/modules/userId.html#unified-id-20)
