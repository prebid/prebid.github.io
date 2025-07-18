---
layout: api_prebidjs
title: pbjs.adServers.dfp.buildAdpodVideoUrl(options) <span style="color:red" markdown="1">[Alpha]</span>
description: adServers.dfp.buildAdpodVideoUrl API
sidebarType: 1
---


{: .alert.alert-info :}
The GAM implementation of this function requires including the `dfpAdServerVideo` module in your Prebid.js build.

This method combines publisher-provided parameters with Prebid.js targeting parameters to build a GAM video ad tag URL that can be used by a video player.

#### Argument Reference

##### The `options` object

{: .table .table-bordered .table-striped }
| Field    | Type   | Description                                                                                                                                                                        |
|----------+--------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| iu | string | `adunit` |
| description_url | string | The value should be the url pointing to a description of the video playing on the page. |

{% include alerts/alert_important.html content="For long form Prebid.js will add key-value strings for multiple bids. This prevents retrieving the description url from bid." %}

#### Example

```JavaScript
pbjs.que.push(function(){
    pbjs.addAdUnits(videoAdUnit);
    pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        },
        adpod: {
            brandCategoryExclusion: true
        },
        brandCategoryTranslation: {
            translationFile: "https://mymappingfile.com/mapping.json"
        }
    });

    pbjs.requestBids({
        bidsBackHandler: function(bids) {
            pbjs.adServers.dfp. buildAdpodVideoUrl({
                codes: ['sample-code'],
                params: {
                    iu: '/123456/testing/prebid.org/adunit1',
                    description_url: 'https://mycontent.com/episode-1'
                },
                callback: function(err, masterTag) {
                    // Invoke video player and pass the master tag
                }
            });
        }
    });
});
```

{% include alerts/alert_warning.html content="Set the `pbjs.setConfig.cache.url` to the URL that will cache the VAST XML. " %}
