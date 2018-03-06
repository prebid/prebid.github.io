---
layout: page
title: Get Started with Prebid Server
description: Get Started with Prebid Server
pid: 27
top_nav_section: dev_docs
nav_section: prebid-server
---

<div class="bs-docs-section" markdown="1">

# Get Started with Prebid Server
{:.no_toc}

For many publishers, client-side header bidding is a balancing act between the inclusion of demand partners and impact to the page.

Using Prebid Server, sites can move demand partners server-side, eliminating most of the latency impact that comes with adding more partners.

Prebid Server is an open source project, but it requires a server somewhere to run the code. Some Prebid.Org members are running Prebid Server clusters that publishers may utilize, or it can be downloaded and run by DIY publishers.

* TOC
{:toc}

## Architecture

This diagram shows how the components from Prebid Org fit together:

![Prebid Server Architecture]({{site.baseurl}}/assets/images/dev-docs/PrebidServerArchitecture.png)

Prebid Server works with Prebid.js - a special client-side adapter is configured to send requests to the server where server-side bid adapters handle communication to the bidders. Moving a bidder from
client-side to server-side is a tweak to configuration.

Prebid Cache is an important component of the system for video and mobile -- storing bids for a few minutes. When header bidding wins, the creative to be displayed is loaded from the cache.

## Step 1. Choose Your Server Host

- If you plan to host Prebid Server and Prebid Cache in your own environment, see [Running Your Own Prebid Server]({{site.baseurl}}/dev-docs/running-your-own-prebid-server.html) and skip to **Step 2** below. If you do *not* have your own server, please choose from one of the Prebid.org members below to get started.

- **AppNexus**
  - Go to the [Prebid Server sign-up page](https://prebid.adnxs.com) and click the button to sign up.
  - Fill out the form details, including your email address.
  - When approved, you will receive an email with your assigned `accountId`. You will need this for configuring Prebid.js to use Prebid Server.

- **Rubicon Project**
  - Please send an email to prebidserver@rubiconproject.com and proceed to **Step 2** below. You do not have to wait for a verification email to get started.


## Step 2. Download Prebid.js with Prebid Server enabled

- Go to [the Prebid.org download page]({{site.baseurl}}/download.html), select all the demand adapters you want to work with, and include "Prebid Server".

- For example, if you want to use AppNexus, Index Exchange, and Rubicon with Prebid Server, select:
  - *AppNexus*
  - *Index Exchange*
  - *Rubicon*
  - *Prebid Server*

- Then, click **Get Custom Prebid.js** and follow the instructions.

## Step 3. Update your site with the new build of Prebid.js

Update your site's hosted copy of Prebid.js to use the new build you just generated.  (For example, you may host your copy on your site's servers or using a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) such as Fastly or Akamai.)

## Step 4. Configure Server-to-Server bidder adapters

The Prebid Server settings (defined by the [`pbjs.setConfig`]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.setConfig) method) go in the same anonymous function where you define your ad units.  This method must be called before `pbjs.requestBids`.

The code in your Prebid configuration block should look something like the following (unless you want to show video ads, in which case see [Using Prebid Server to show video ads](#prebid-server-video-openrtb) below).

See [The `s2sConfig` object]({{site.baseurl}}/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server) for definitions of the keys in the `s2sConfig` object.

{% highlight js %}
var pbjs = pbjs || {};

pbjs.que.push(function() {

    pbjs.setConfig({
        s2sConfig: {
            accountId: '1',
            bidders: ['appnexus', 'pubmatic'],
            defaultVendor: 'appnexus'
        }
    });

    var adUnits = [{
        code: '/19968336/header-bid-tag-1',
        sizes: sizes,
        bids: [{
            /* Etc. */
        }]
    }];
});
{% endhighlight %}

<a name="prebid-server-video-openrtb" />

### Using Prebid Server to show video ads

If you are using Prebid Server and you want to show video ads, you must use [OpenRTB video parameters](https://www.iab.com/guidelines/real-time-bidding-rtb-project/) in your Prebid ad unit as shown below.

{: .alert.alert-warning :}
The `mimes` parameter is required by OpenRTB.  For all other parameters, check with your server-side header bidding partner.

```javascript
var adUnit1 = {
    code: 'videoAdUnit',
    mediaTypes: {
        video: {
            context: "instream",
            mimes: ['video/mp4'],
            playerSize: [400, 600],
            minduration: 1,
            maxduration: 2,
            protocols: [1, 2],
            w: 1,
            h: 2,
            startdelay: 1,
            placement: 1,
            playbackmethod: [2]
            // other OpenRTB video params
        }
    },
    bids: [
        // ...
    ]
}
```

## Cookie Sync

### Server adapter cookie sync

When Prebid Server reaches out to each bidder adapter (e.g. an SSP), it needs to have the user's ID
for that bidder available.

In order to make these IDs available, Prebid Server and PrebidJS work together to build up a
'match table' stored in the `uids` cookie of Prebid Server's domain. Here's an example of what the
match table looks like:

{% highlight bash %}
pubmatic: 1111111
rubicon:  2222222
appnexus: 3333333
{% endhighlight %}

Here's how it works:

1. When Prebid Server is initialized on the client side, a call to /cookie_sync is made which proactively calls to Prebid Server with the list of adapters in the page.
1. The server can see the `uids` cookie and responds with sync pixels needed for any of the listed adapters. 
1. The browser calls the sync pixels.
1. Sync pixels redirect back to the Prebid Server /setuid command, setting the `uids` cookie.

### DSP Cookie Sync

When a server bidder adapter reaches out to their bidders, those DSPs also need to know this user or they're less likely to bid.

Prebid Server isn't involved in DSP cookie matching at all. The feature in PrebidJS that supports DSP cookie matching is called ["user sync"]({{site.baseurl}}/dev-docs/publisher-api-reference.html#setConfig-Configure-User-Syncing). Publishers are encouraged to consider allowing trusted SSPs to define several iframe-based user syncs on each page.


## Related Topics

+ [Prebid.js Developer Docs]({{site.baseurl}}/dev-docs/getting-started.html)
+ [Add a Bidder Adapter to Prebid Server]({{site.baseurl}}/dev-docs/add-a-prebid-server-adapter.html)
+ [Running Your Own Prebid Server]({{site.baseurl}}/dev-docs/running-your-own-prebid-server.html)

</div>
