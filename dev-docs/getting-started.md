---
layout: page_v2
title: Getting Started
description: Dev docs for getting started with Prebid.js for header bidding
sidebarType: 1
---



# Getting Started for Developers
{: .no_toc }

* TOC
{: toc }

### Quick Start

The easiest way to get started with Prebid.js is to use the example code below.

{% include dev-docs/build-from-source-warning.md %}

<div id="jsfiddle">
</div>

<script type="text/javascript">
    __tcfapi("checkConsent", 2, (data, success) => {
        console.log("checkConsent");
        if (data && success) {
	    document.getElementById("jsfiddle").innerHTML += '<iframe width="100%" height="1600" src="//jsfiddle.net/Prebid_Examples/bryzc7g6/3/embedded/html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>';
        } else {
            document.getElementById("jsfiddle").innerHTML += '<br/>(Cookie permissions for JSFiddle needed to run code demos. Update <a onclick="__tcfapi(\'showConsentManager\')" href="javascript:void(0);">Privacy Settings</a>.)';
        }
    }, {
        data: [{
            vendorId: 10376,
            purposeIds: [1]
        }]
    });
</script>

### Next Steps

1. Set up your ad server using the [corresponding Ad Ops setup instructions]({{site.baseurl}}/adops/send-all-bids-adops.html)
2. Once you're comfortable with the basic setup, check out [the examples showing other use cases]({{site.baseurl}}/dev-docs/examples/basic-example.html)


