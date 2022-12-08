---
layout: userid
title: Novatiq Hyper ID with Prebid SharedID support
description: Novatiq Hyper ID with Prebid SharedID support User ID sub-module
useridmodule: novatiqsharedid
---


You can make use of the Prebid.js SharedId module as follows.

## Novatiq Hyper ID Configuration

Enable by adding the Novatiq and SharedId submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=novatiqIdSystem,userId

Module activation and configuration:

{% highlight javascript %}
pbjs.setConfig({
  userSync: {
    userIds: [
      {
      name: 'novatiq',
      params: {
        // change to the Partner Number you received from Novatiq
        sourceid '1a3',

        // Use the sharedID module
        useSharedId: true,

        // optional: will default to _pubcid if left blank.
        // If not left blank must match "name" in the the module above
        sharedIdName: 'demo_pubcid'
        }
      }
    }],
    // 50ms maximum auction delay, applies to all userId modules
    auctionDelay: 50
  }
});
{% endhighlight %}


If you have any questions, please reach out to us at [prebid@novatiq.com](mailto:prebid@novatiq.com)

