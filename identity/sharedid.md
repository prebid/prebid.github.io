---
layout: page_v2
title: SharedID
description: What is SharedID
sidebarType: 9
---

# Prebid SharedID
{: .no_toc}

* TOC
{:toc}

{: .alert.alert-warning :}
As of Prebid.js 5.0, PubCommon ID is no longer supported -- it's been merged into SharedID. Also, SharedID no longer syncs to sharedid.org like it did in Prebid.js 4.x.

## What is it?

SharedId is a convenient Prebid-owned first party identifier within the [Prebid UserId Module framework](/dev-docs/modules/userId.html).

## How does it work?

The SharedID ID system sets a user id cookie in the publisher’s domain.
Since the cookie is set in the publisher's first party domain it does not fall in scope of browser restrictions on third party cookies.

### Prebid.js 5.x

The SharedID module reads and/or sets a random ID in
the cookie name defined by the publisher when initializing
the module:

```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'sharedId',
            storage: {
                name: '_sharedID', // name of the 1st party cookie
                type: 'cookie',
                expires: 30
            }
        }]
    }
});
```

The 'source' value transmitted through OpenRTB (user.ext.eids) is pubcid.org. For example:
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

{: .alert.alert-info :}
The 'pubcid.org' EID source was adopted by more buyers than 'sharedid.org', so
when PubCommon was folded into SharedID, we kept the more commonly recognized
source value.

### Before Prebid.js 5.0

In addition to setting a first party cookie, SharedID in Prebid.js 4.x also sets a third party cookie where possible, syncing the first and third party cookies (subject to browser capability and user opt-out).

SharedID in Prebid.js 4.x was transmitted through the header-bidding ecosystem on user.ext.eids with a different 'source':
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

### Detailed Walkthrough

This diagram summarizes the workflow for SharedID:

![SharedID](/assets/images/sharedid5.png){: .pb-lg-img :}

1. The page loads the Prebid.js package, which includes the SharedId module.
2. The page enables one or more user ID modules with pbjs.setConfig({usersync}) per the module documentation. The publisher can control which bidders are allowed to receive each type of ID.
3. If permitted, the SharedID module retrieves and/or sets the designated first party cookie for this user.
4. When a header bidding auction is run, the ID modules are invoked to add their IDs into the bid requests.
5. Bid adapters send the additional IDs to the bidding endpoints, along with other privacy information such as GDPR consent, US Privacy consent, and the Global Privacy Control header.
6. SharedID is used by the bidder for ad targeting, frequency capping, and/or sequential ads.
7. Bids are sent to the publisher's ad server, where the best ad is chosen for rendering.

{: .alert.alert-info :}
In Prebid.js 4.x, when SharedID performed third-party syncing there
was an extra step in the diagram between steps 3 and 4 where the module would connect to a server on sharedid.org. This step was
removed in Prebid.js 5.0.

### Privacy Discussion

There are several privacy scenarios in which a user ID is not created or read:

1. The User ID module suppresses all cookie reading and setting activity
when the [GDPR Enforcement Module](/dev-docs/modules/gdprEnforcement.html) is in place and there's no consent for Purpose 1.
2. The User ID module infrastructure supports a first-party opt-out, by setting the `_pbjs_id_optout` cookie or local storage to any value. No other cookies will be set if this one is set.
3. The SharedID module will suppress the ID when the COPPA flag is set.

For all other privacy-sensitive scenarios, it is encumbent upon bid adapters and endpoints
to be aware of and enforce relevant regulations such as CCPA and Global Privacy Control.

## Opt-Out

Prebid recommends that publishers provide their users with information about how IDs are utilized, including targeting, frequency capping, and special ad features like sequential ads.

If the publisher's legal staff has determined that a user opt-out is necessary beyond existing
mechanisms like GDPR and CCPA, the use of first party cookies requires that opt-out flow be owned
by the publisher.

Publishers that decide to build a first-party opt-out workflow might follow a process like this:
- User is presented with an option to turn off ad targeting
- If the user opts out, the page can do one of two things:
    - set a _pbjs_id_optout first party cookie
    - avoid calling pbjs.setConfig to initialize the user ID modules

## Related Topics

- [Prebid Identity Overview](/identity/prebid-identity.html)
- [Prebid.js User ID modules](/dev-docs/modules/userId.html)
