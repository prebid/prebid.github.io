---
layout: page_v2
title: SharedID
description: What is SharedID
sidebarType: 9
---

# Prebid SharedID

{: .no_toc}

- TOC
{:toc}

{: .alert.alert-warning :}
As of Prebid.js 5.0, PubCommon ID is no longer supported -- it's been merged into SharedId. Also, SharedId no longer syncs to sharedid.org like it did in Prebid.js 4.x.

## What is it?

SharedId is a convenient Prebid-owned first party identifier within the [Prebid UserId Module framework](/dev-docs/modules/userId.html).

There are multiple ways to integrate SharedId on your site. See the table below for a breakout of options, and the rest of this document for detailed integration instructions.

{: .table .table-bordered .table-striped }
| Implementation | Description | Cookie Lifetime | Safari Cookie Lifetime | Technical Difficulty | Revenue Benefit |
| --- | --- | --- | --- | --- | --- |
| 3rd Party Cookie Only | No first party cookie solution. | Some Blocked | Blocked | None | Low |
| User Id Submodule | Including User Id Module in your Prebid.js installation. | 365 days | 7 days | Basic | Good |
| PubCID Script | Adding the legacy PubCID script; not maintained by Prebid.org. | 365 days | 7 days | High | Varies |
| SharedId First Party Endpoint | Writing a first party cookie from your web server code. | 365 days | 365 days | Intermediate | Best |

## How does the Prebid UserId Module implementation work?

The SharedID ID system sets a user id cookie in the publisher’s domain.
Since the cookie is set in the publisher's first party domain it does not fall in scope of browser restrictions on third party cookies. Safari has restrictions on first party cookies set via document.cookie. For this reason we recommend considering a server endpoint installation for maximum effect. See the "Alternate Implementations" section below.

### Prebid.js 5 and later

The SharedId module reads and/or sets a random ID in
the cookie name defined by the publisher when initializing
the module:

Example 1: client-side cookie setting

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'sharedId', //"pubCommonId" as a name is supported for backwards compatibility,
            storage: {
                name: '_sharedID', // name of the 1st party cookie, _pubcid is supported for backwards compatibility
                type: 'cookie',
                expires: 30
            }
        }]
    }
});
```

Example 2: setting the cookie with a first party endpoint

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'sharedId', //"pubCommonId" as a name is supported for backwards compatibility,
            params: {
                pixelUrl: "/wp-json/pubcid/v1/extend/" // this parameter identifies your server-side endpoint that will set a first party cookie'
            }, 
            storage: {
                name: '_sharedID', // name of the 1st party cookie, _pubcid is supported for backwards compatibility
                type: 'cookie',
                expires: 30
            }
        }]
    }
});
```

The 'source' value transmitted through OpenRTB (user.ext.eids) is pubcid.org. For example:

```javascript
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

In addition to setting a first party cookie, SharedId in Prebid.js 4.x also sets a third party cookie where possible, syncing the first and third party cookies (subject to browser capability and user opt-out).

SharedId in Prebid.js 4.x was transmitted through the header-bidding ecosystem on user.ext.eids with a different 'source':

```javascript
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

#### Configuration

Below are the available configuration options for the SharedID module.

{: .table .table-bordered .table-striped }
| Parameter Name | Type | Description | | Example |
| --- | --- | --- | --- | --- |
| create (optional) | boolean | If true, then an id is created automatically by the module if none is present. **Default is true.** | | `true` |
| expires (required) | number | Expiration interval in days. | | `30` |
| extend | boolean (optional) | If true, the expiration time is automatically extended whenever the script is executed even if the id exists already. **Default is false.** | For use in combination with a first party endpoint only. **Default is false.** | `true` |
| pixelUrl | string (optional) | Enables the first party endpoint to extend cookie lifetime and specifies where to call out to for a server cookie. | | `/wp-json/pubcid/v1/extend/`
| type | string (required) | Type of storage. Specify one of the following: 'html5' (aka. localstorage) or 'cookie'. | | `cookie` |
### Detailed Walkthrough

This diagram summarizes the workflow for SharedId:

![SharedId](/assets/images/sharedid5.png){: .pb-lg-img :}

1. The page loads the Prebid.js package, which includes the SharedId module.
2. The page enables one or more user ID modules with pbjs.setConfig({usersync}) per the module documentation. The publisher can control which bidders are allowed to receive each type of ID.
3. If permitted, the SharedId module retrieves and/or sets the designated first party cookie for this user.
4. When a header bidding auction is run, the ID modules are invoked to add their IDs into the bid requests.
5. Bid adapters send the additional IDs to the bidding endpoints, along with other privacy information such as GDPR consent, US Privacy consent, and the Global Privacy Control header.
6. SharedId is used by the bidder for ad targeting, frequency capping, and/or sequential ads.
7. Bids are sent to the publisher's ad server, where the best ad is chosen for rendering.

{: .alert.alert-info :}
In Prebid.js 4.x, when SharedId performed third-party syncing there
was an extra step in the diagram between steps 3 and 4 where the module would connect to a server on sharedid.org. This step was
removed in Prebid.js 5.0.

### Privacy Discussion

There are several privacy scenarios in which a user ID is not created or read:

1. The User ID module suppresses all cookie reading and setting activity
when the [GDPR Enforcement Module](/dev-docs/modules/gdprEnforcement.html) is in place and there's no consent for Purpose 1.
2. The User ID module infrastructure supports a first-party opt-out, by setting the `_pbjs_id_optout` cookie or local storage to any value. No other cookies will be set if this one is set.
3. The SharedId module will suppress the ID when the COPPA flag is set.

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
  - set a `_pbjs_id_optout` first party cookie
  - avoid calling pbjs.setConfig to initialize the user ID modules

## Alternative Implementations

For those not using Prebid's header bidding solution, SharedId can deployed via in inline script reference or from a web server.

### SharedId Script

For those interested in implementing SharedId without prebid.js.

1. Clone the [SharedId script repository](https://github.com/prebid/Shared-id-v2)
2. Implement the pubcid.js script on the desired page by following the build instructions in the [readme.md](https://github.com/prebid/Shared-id-v2#readme)

Prebid also recommends implementing a method where users can easily opt-out of targeted advertising. Please refer to the User Opt-Out section located at the bottom of this page.

If there are no custom configurations, then just include the script and it'll use the default values.

```html
<script type="text/javascript" src="//myserver.com/pubcid.min.js"></script>
```

If custom configurations are needed, define the pubcid_options object before inclusion of the script. Below is an example to switch from using local storage to cookie:

```html
<script type="text/javascript">
   window.pubcid_options = {type: 'cookie'};
</script>
<script type="text/javascript" src="//myserver.com/pubcid.min.js"></script>
```

#### Configuration

Below are the available configuration options for the PubCID script.

{: .table .table-bordered .table-striped }
| Parameter Name | Type | Description |  | Example |
| --- | --- | --- | --- | --- |
| create | boolean | If true, then an id is created automatically by the script if it's missing. Default is true. If your server has a component that generates the id instead, then this should be set to false |  | `true` |
| expInterval | decimal | Expiration interval in minutes. Default is 525600, or 1 year |  | `525600` |
| extend | boolean | If true, the the expiration time is automatically extended whenever the script is executed even if the id exists already. Default is true. If false, then the id expires from the time it was initially created. | For publisher server support only.  If true, the publisher's server will create the (pubcid) cookie.  Default is true. | `true` |
| pixelUrl | string (optional) | For publisher server support only. Where to call out to for a server cookie. |  | `/wp-json/pubcid/v1/extend/`
| type | string | Type of storage. It's possible to specify one of the following: 'html5', 'cookie'. Default is 'html5' priority, aka local storage, and fall back to cookie if local storage is unavailable. | If true, the expiration time of the stored IDs will be refreshed during each page load. Default is false. | `cookie` |

#### Example Configurations

Always use cookies and create an ID that expires in 30 days after creation.

```javascript
{ 
    type: 'cookie',
    extend: false,
    expInterval: 43200
}
```

Using a SharedId Endpoint implementation, create the cookie once, which will be allowed to expire before it is created again.

```javascript
{ 
    type: 'cookie',
    pixelUrl: '/wp-json/pubcid/v1/extend/',
    create: false,
    extend: false
}

```

### SharedId First Party Endpoint

Add server-side support for SharedId to better handle the ever-increasing restrictions on cookies in modern web browsers by having the SharedId first party cookie written and extended by your web server.

#### CMS

PubCID/SharedId plugins are available for Wordpress and Drupal. Because the CMS can cache pages to improve scalability, it's impractical to set unique cookies during page generation. Instead these plugins require a dynamic endpoint that serves back a blank pixel along with a unique cookie value. The client side script  needs one additional parameter for this URL. Please consult the corresponding plugin documents for default values:

1. Wordpress : Install directly from the [Wordpress admin page](https://wordpress.org/plugins/publisher-common-id/). Install from [GITHUB](https://github.com/prebid/sharedid-wordpress)
2. Drupal : Install from [Github](https://github.com/prebid/sharedid-drupal).

#### Endpoint Implementations

The Wordpress and Drupal plugins require that the host company integrate a new endpoint into their webserver that can receive request from the page and set a unique cookie.
Below are some examples for how to implement this function in various languages or platforms. It is up to the site owner to integrate an appropriate script for their specific scenario.

##### JAVA

```java
public class PubCid {
    private static final String pubcidCookieName = "_pubcid";
    private static final int expireTime = (int) TimeUnit.DAYS.toSeconds(365); //store cookie for 1 year
 
    /**
     * Returns the pubcid cookie found in the user's list of cookies.
     * Always update the expire time to another year so that the cookie persists.
     *
     * @param cookies User's list of cookies
     * @return the pubcid cookie if found, null otherwise
     */
    public static Cookie getPubcidCookie(Cookie[] cookies) {
 
        Cookie pubcidCookie = fetchPubcidCookie(cookies);
        if (pubcidCookie != null)
            pubcidCookie.setMaxAge(expireTime);
 
        return pubcidCookie;
    }
 
    /**
     * Simple function to test if the user has a pubcid cookie
     *
     * @param cookies User's list of cookies
     * @return true if the cookie is found, false otherwise
     */
    public static boolean hasPubcidCookie(Cookie[] cookies) {
        return fetchPubcidCookie(cookies) != null;
    }
 
    /**
     * Local function to find the pubcid cookie within the user's list of cookie
     *
     * @param cookies User's list of cookies
     * @return pubcid cookie if found, null otherwise
     */
    private static Cookie fetchPubcidCookie(Cookie[] cookies) {
        if (cookies == null) return null;
        return Arrays.stream(cookies)
                .filter(e -> e.getName().equals(pubcidCookieName))
                .findFirst()
                .orElse(null);
    }
}
```

##### PHP

```php
$cookie_name = '_pubcid';
$cookie_path = '/';
$max_age = 365;
 
$value = NULL;
 
// See if the cookie exist already
 
if (isset($_COOKIE[$cookie_name ]))
    $value = $_COOKIE[$cookie_name];
 
// Obtain site domain if defined
if (defined(COOKIE_DOMAIN))
    $cookie_domain = COOKIE_DOMAIN;
else
    $cookie_domain = "";
 
// Update the cookie
if (isset($value)) {
    setcookie(
        $cookie_name,
        $value,
        time() + $max_age * DAY_IN_SECONDS,
        $cookie_path,
        $cookie_domain
    );
}
```

##### Node.js

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
 
app.use(cookieParser());
 
app.get('/', function(req, res) {
 
    // Check for existence of _pubcid cookie
    let value = req.cookies['_pubcid'];
 
    // If pubcid exists, then update its expiration time
    if (value) {
        res.cookie('_pubcid', value, {domain: '.example.com', path: '/', expires: new Date(Date.now() + 1000*60*60*24*365)});
    }
 
    res.render('index');
});
 
app.listen(port, ()=>console.log(`App listening on port ${port}`));
```

##### Apache

```conf
# Add to httpd.conf
# Requires mod_headers and mod_env
 
# Capture _pubcid cookie value if available
SetEnvIf Cookie "(^|;\ *)_pubcid=([^;\ ]+)" PUBCID_VALUE=$2
SetEnvIf Cookie "(^|;\ *)_pubcid=([^;\ ]+)" HAVE_PUBCID=1
 
# Add _pubcid cookie if it exists to the response with 1 year expiration time
Header add Set-Cookie "_pubcid=%{PUBCID_VALUE}e;Domain=.example.com;Path=/;Max-Age=31536000" env=HAVE_PUBCID
```

##### Nginx

```conf
# Add to a location directive
 
    location /example {
        set $pubcid_value $cookie__pubcid;
        if ($pubcid_value) {
            add_header Set-Cookie "_pubcid=$pubcid_value;Domain=.example.com;Path=/;Max-Age=31536000";
        }
    }
```

## Related Topics

- [Prebid Identity Overview](/identity/prebid-identity.html)
- [Prebid.js User ID modules](/dev-docs/modules/userId.html)
