---
layout: page_v2
title: SharedID and PubCommon ID
description: What are SharedID and PubCommon ID
sidebarType: 9
---

# Prebid SharedID and PubCommon ID
{: .no_toc}

* TOC
{:toc}

## What are they?

SharedId and PubCommon are ID systems that are part of the [Prebid UserId Module framework](/dev-docs/modules/userId.html).

Both systems are owned by Prebid.org, and maintained by a community of developers led by Magnite and Conversant. Prebid.org's [privacy policy](TBD) applies to these systems.

## How do they work?

The SharedID and PubCommon ID systems set a user id cookie in the publisher’s domain.
Since the cookie is set in the publisher's first party domain it is safe from browser restrictions on third party cookies. The follow sections describe the differences between the two systems.

### SharedID

In addition to setting a first party cookie, SharedID also sets a third party cookie.
SharedId keeps these two cookies in sync wherever possible, giving SSPs and DSPs a way to track
consenting users across domains using a first party cookie. This mechanism will only work as long as
third party cookies can be set. For now this applies only to the Chrome browser, and only until
Chrome starts restricting third party cookies, which we expect to be sometime in the spring of 2022.

Today, SharedId supports a universal opt-out signal. However, that opt-out signal is premised on third party cookies. (More on this topic below.)

SharedID is transmitted through the header-bidding ecosystem on user.ext.eids like this:
```
user: {
    ext: {
        eids: {
            "source":"sharedid.org",
            "uids":[
               {
                  "id":"01EAJWWNEPN3CYMM5N8M5VXY22",
                  "atype":1,
                  "ext":{
                     "third":"01EAJWWNEPN3CYMM5N8M5VXY22"
                  }
               }
           ]
        }
    }
}
```

### PubCommon ID

PubCommon started out supporting just first-party cookies, but now also supports setting a third party cookie and keeping them in sync in the same way as
SharedId. However, this syncing functionality is **off** by default. It can be turned on as desired.

PubCommon does not support a universal opt-out, but does support a first-party opt-out, by setting the _pbjs_id_optout to any value.

PubCommon is transmitted through the header-bidding ecosystem on user.ext.eids like this:
```
user: {
    ext: {
        eids: {
            "source":"pubcid.org",
            "uids":[
               {
                  "id":"01EAJWWNEPN3CYMM5N8M5VXY22",
                  "atype":1
               }
           ]
        }
    }
}
```
Note that PubCommon does not carry the `third` party cookie value.

### Detailed Walkthrough

This diagram summarizes the workflow for SharedID and PubCommon:

![SharedID](/assets/images/sharedid.png){: .pb-lg-img :}

1. The page loads the Prebid.js package, which includes the SharedId and/or PubCommon modules.
2. The page enables one or more user ID modules with pbjs.setConfig({usersync}) per the module documentation. The publisher can control which bidders are allowed to receive each type of ID.
3. If permitted, the SharedID and/or PubCommon module retrieves and/or sets the designated first party cookie for this user.
4. If permitted, the SharedID module connects to sharedid.org to see if the user has a third party identification.
5. When a header bidding auction is run, the ID modules are invoked to add their IDs into the bid requests.
6. Bid adapters send the additional IDs to the bidding endpoints, along with other privacy information such as GDPR consent, US Privacy consent, and the Global Privacy Control header.
7. The SharedID and PubCommon IDs are used by the bidder for ad targeting, frequency capping, and/or sequential ads.
8. Bids are sent to the publisher's ad server, where the best ad is chosen for rendering.

### Privacy Discussion

The only privacy scenario where the Prebid User ID module will suppress ID activity is that
cookies cannot be read or set when the [GDPR Enforcement Module](/dev-docs/modules/gdprEnforcement.html) is in place without consent for Purpose 1.

For all other privacy-sensitive scenarios, it is encumbent upon ID providers and bid adapters
to be aware of and enforce relevant regulations such as COPPA, CCPA, and Global Privacy Control.

## Why maintain two modules that are functionally equivalent?

When Prebid.org assumed ownership of PubCommon, it already had hundreds of publishers using it.
Instead of merging the two ID systems, which would have required wrapper updates by publishers,
we decided to add the functionality of Sharedid into PubCommon, giving publishers the choice
of whether to enable it or not.

In the future as third party cookies become more restricted, we anticipate that the two modules will merge.  

## Opt-Out

Prebid recommends that publishers provide their users with information about how IDs are utilized, which includes targeting, frequency capping, and special ad features like sequential ads.

If the publisher's legal staff has determined that a user opt-out is necessary beyond existing
mechanisms like GDPR and CCPA, first party cookies require that opt-out flow be owned
by the publisher.

Third party SharedID cookies support an opt-out page hosted at [sharedid.org](https://id.sharedid.org).
Clicking “Opt Out” will flag the user's third party SharedId cookie as unusable. The next time the SharedId code runs on each publisher's page,
the module will recognize that the browser/user has opted out and will flag that publisher's first party cookie as equally unusable.

Publishers that decide to build a first-party opt-out workflow might follow a process like this:
- User is presented with an option to turn off ad targeting.
- If the user opts out, the page can do one of two things:
    - set a _pbjs_id_optout first party cookie
    - avoid calling pbjs.setConfig to initialize the user ID modules

## Related Topics

- [Prebid Identity Overview](/identity/prebid-identity.html)
- [Prebid.js User ID modules](/dev-docs/modules/userId.html)
