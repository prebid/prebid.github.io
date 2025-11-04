---
layout: page_v2
page_type: pbs-module
title: Prebid Server Response Correction Module
display_name: Response Correction Module
sidebarType: 5
---

# Response Correction Module
{:.no_toc}

- TOC
{:toc }

## Overview

(PBS-Java 3.14+)

Part of Prebid Server's job in curating a clean bid stream is in dealing with problems created by bid responses.
For the most part, if a bid adapter is returning something incorrectly, we work with them to correct the issue.
However, that's not always possible in a clean way. This module is a place to collect response corrections that
accounts may want to apply to the bid stream.

For now, there's only one option:

- **app-video-html**: apply a correction to mobile app bidders who are responding to video ads with HTML creatives.

### App Video HTML

This correction addresses an [awkward situation](https://github.com/prebid/prebid-mobile-ios/issues/979) where at least 3 app bidders are declaring hb_format=video but the creative is HTML instead of VAST. This forces pubs to hack an extra set of line items with specific biddercodes. It will be difficult to go to an unknown set of bidders and get them to change their endpoints, and even if they did timing would be awkward no matter what: it affects publisher line items and monetization.

The first task is app-video-html, which should support a list of excluded bidders.

1. If the app-video-html task is enabled and the request is for app, it sniffs all bid responses:
    1. Confirm that we're allowed to modify this bidder. If not, next response.
    1. If the response indicates mediaType=video, it looks at the ad markup. If the string "<\s*VAST\s+" (case insensitive) appears anywhere in the adm, the bid is ok.
    1. Else, if there's no adm, next response.
    1. Else, if adm is a stringified JSON object containing the word 'assets', then this native and unexpected. Log a warning at N% sampling but do nothing.
    1. Else, take action:
        1. Change the PBS mediaType to banner.
        1. Add/overwrite the meta.mediaType to video
        1. Log a warning at N% sampling
1. Host companies and accounts will need to be careful about when this correction is enabled because if the matching ad server line items don't match, renders will fail. e.g. You need to time bidder-related line item changes to the enabling of this module.

## Configuration

The parameters to the module are:

{: .table .table-bordered .table-striped }
| Parameter | Type | Scope | Description | Notes |
| --------- | ---- | ----- | ----------- | ----- |
| enabled | boolean | optional | Enable the module for this account | Defaults to false |
| app-video-html | object | optional | See the [App Video HTML Correction](#app-video-html) above. | |
| app-video-html.enabled | boolean | optional | Enable this correction. | Defaults to false |
| app-video-html.excludedbidders | string array | optional | Bidders who are exempt from the correction. | |

Here's an example of the account config used in PBS-Java:

```json
{
  "hooks": {
    "modules": {
      "pb-response-correction": {
        "enabled": true,
        "app-video-html": {
          "excludedbidders": [
            "bidderA",
            "bidderB"
          ],
          "enabled": true
        }
      }
    }
  },
  "execution-plan": {
    "endpoints": {
      "/openrtb2/auction": {
        "stages": {
          "all-processed-bid-responses": {
            "groups": [
              {
                "timeout": 5,
                "hook-sequence": [
                  {
                    "module-code": "pb-response-correction",
                    "hook-impl-code": "pb-response-correction-all-processed-bid-responses"
                  }
                ]
              }
            ]
          }
        }
      }
    }
  }
}
```

## Further Reading

- [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
- [Building a Prebid Server Module](/prebid-server/developers/add-a-module.html)
