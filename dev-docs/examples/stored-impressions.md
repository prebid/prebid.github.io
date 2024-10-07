---
layout: example
title: PBS+PBJS Stored Impressions
description: Different prebid server stored impression variants

sidebarType: 1

about:
- Show cases three variants of prebid server integrations
- stored impression in ortb2Imp object on the ad unit
- stored impression on a bids object with module configured
- client-side adapters that are configured as PBS adapters
---

Prebid.js has two main ways to select configuration for an ad unit:

1. Reuse the client-side configuration, but mark a bidder as server-side in the `s2sConfig`
2. Set a stored impression id in the `ortb2Imp.ext.prebid.storedrequest.id` property

Using Prebid Server offers a few benefits, such as:

1. Reduced latency due to less requests
2. Reduced javascript bundle size as most bidder adapters are not required
3. More control over configuration and faster reaction times, because no client-side configuration must be rolled-out

There are however a few drawbacks:

1. Reduced client-side analytics, because some information is left on the server and not available to client-side analytics adapters. (Note, this problem is getting better with time.)
2. Some bidders may lack features in their server-side adapters that are available client-side

## Integration variants

Every option has a certain use case. Choose the one that fits best.

You can learn more about the general configuration here:

- [adunit reference on stored impressions](/dev-docs/adunit-reference.html#stored-imp)
- [prebidServer module for prebid.js](/dev-docs/modules/prebidServer.html)

### Reusing client-side configuration

{% capture tipNoteClientSide %}
Use this if you want to AB test client vs server
{% endcapture %}

{% include alerts/alert_tip.html content=tipNoteClientSide %}

{% capture warnNoteClientSide %}
This requires client-side adapters to be present
{% endcapture %}

{% include alerts/alert_warning.html content=warnNoteClientSide %}

```js
pbjs.setConfig({
    // configure a single prebid server instance
    s2sConfig: [{
        accountId: '1001',
        bidders: ['bidderA'],
        endpoint: 'https://mypbs.example.com/path',
        syncEndpoint: 'https://mypbs.example.com/path',
        timeout: 1000
    }]
});

pbjs.addAdUnits({
    code: "test-div",
    bids: [
        {
            // this bidder is part of the bidders array, so it will not make client-side calls, but
            // there params will be transfered to prebid server
            bidder: 'bidderA',
            params: {
                placementId: 12345
            }
        },
        {
            // this one stays client-side
            bidder: 'bidderB',
            params: {
                placementId: 55555
            }
        }
    ]
});
```

### adUnit.ortb2Imp configuration

{% capture tipNoteOrtb2Imp %}
When using [PBS stored impressions](/dev-docs/modules/prebidServer.html#stored-imp), the `AdUnit.bids` array is not required.
Use this if you want to configure everything server side and have a **single** prebid server endpoint.
{% endcapture %}

{% include alerts/alert_tip.html content=tipNoteOrtb2Imp %}

```js
pbjs.setConfig({
    // configure a single prebid server instance
    s2sConfig: [{
        accountId: '1001',
        bidders: ['bidderA', 'bidderB'],
        endpoint: 'https://mypbs.example.com/path',
        syncEndpoint: 'https://mypbs.example.com/path',
        timeout: 1000
    }]
});

pbjs.addAdUnits({
    code: "test-div",
    ortb2Imp: {
        ext: {
            prebid: {
                storedrequest: {
                    id: 'stored-request-id'
                }
            }
        }
    }
    // no bids object
});
```

See [defining endpoints for prebid server](/dev-docs/modules/prebidServer.html#defining-endpoints)

### bids[].module configuration

{% capture tipNoteModule %}
Use [PBS stored impressions](/dev-docs/modules/prebidServer.html#stored-imp) together with client-side bidders - or stored impressions from multiple instances of Prebid Server 
{% endcapture %}

{% include alerts/alert_tip.html content=tipNoteModule %}

```js
pbjs.setConfig({
    s2sConfig: [
      {
          name: "pbs-appnexus",
          accountId: '12345',
          bidders: ['appnexus','pubmatic'],
          defaultVendor: 'appnexus',
          timeout: 1000,
      },
      {
          name: "pbs-rubicon",
          accountId: '678910',
          bidders: ['rubicon'],
          defaultVendor: 'rubicon',
          timeout: 1000,
      },
    ]
});

pbjs.addAdUnits({
    code: "test-div",
    bids: [
        {
            module: "pbsBidAdapter",
            params: {
                configName: "pbs-appnexus"
            },
            ortb2Imp: {
                ext: {
                    prebid: {
                        storedrequest: {
                            id: 'stored-request-server-1'
                        }
                    }
                }
            }
        },
        {
            module: "pbsBidAdapter",
            params: {
                configName: "pbs-rubicon"
            },
            ortb2Imp: {
                ext: {
                    prebid: {
                        storedrequest: {
                            id: 'stored-request-server-2'
                        }
                    }
                }
            }
        },
        {
            bidder: 'client-bidder',
            // ...
        }
    ]
});
```

See [defining endpoints for prebid server](/dev-docs/modules/prebidServer.html#defining-endpoints)

{% capture htmlCodePrebid %}<h5>Div-1</h5>
<div id='div-1'>
  <script type='text/javascript'>
    googletag.cmd.push(function() {
      googletag.display('div-1');
    });
  </script>
</div>
{% endcapture %}

{% capture jsCode %}// TODO add code example
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
