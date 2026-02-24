---
layout: page_v2
page_type: pbs-module
title: Prebid Server Request Correction Module
display_name: Request Correction Module
sidebarType: 5
---

# Request Correction Module
{:.no_toc}

- TOC
{:toc }

## Overview

(PBS-Java 3.15+)

Part of Prebid Server's job in curating a clean bid stream is in dealing with problems created by errant requests.
When there's a problem in how Prebid SDK or Prebid.js forms the OpenRTB, we'll work with those teams to correct the issue, but
sometimes those bugs will stay out in the wild for a long time before the fix propagates through the ecosystem.

Here are the corrections this module can support. All of them are opt-in by account.

{: .table .table-bordered .table-striped }
| Requestion Correction | Description | Version |
| --------- | ---- | ----- |
| pbsdkUaCleanup | There are versions of PBSDK that set device.ua to include "PrebidMobile/x.y.z", which can cause some bidders to view the request as invalid traffic. | PBS-Java 3.15 |
| pbsdkAndroidInstlRemove | There's a bug in older versions of the Android PBSDK that inject the `instl:1` flag into video auctions. | PBS-Java 3.15 |

### Prebid SDK User Agent Cleanup

This correction addresses a [bug in the PB SDK](https://github.com/prebid/prebid-mobile-ios/issues/932) where the user agent string was set in such a way that some bidders detect the requests as invalid traffic.

If the "pbsdkUaCleanup" correction is enabled, this is what happens:

1. if app.ext.prebid.source!=“prebid-mobile” exit
1. if app.ext.prebid.version >= 2.1.6 exit
1. scan device.ua for the pattern "PrebidMobile/", followed by a number, then any number of non-whitespace characters.
1. If found, remove this pattern from device.ua

### Prebid SDK Interstitial Flag

This correction addresses a [bug in the Android PB SDK](https://github.com/prebid/prebid-mobile-android/issues/757) where the `instl` flag is incorrectly added to the OpenRTB.

If the ‘pbsdkAndroidInstlRemove’ correction is enabled, this is what happens:

1. If imp[0].instl is not specified or is 0, exit
1. if app.ext.prebid.source is not “prebid-mobile”, exit
1. if app.bundle does not contain the string “android”, exit
1. if app.ext.prebid.version > 2.2.3, exit
1. If we're still here, remove the imp[0].instl flag

## Configuration

The parameters to the module are:

{: .table .table-bordered .table-striped }
| Parameter | Type | Scope | Description | Notes |
| --------- | ---- | ----- | ----------- | ----- |
| enabled | boolean | optional | Enable the module for this account | Defaults to false |
| pbsdkUaCleanup | boolean | optional | See [Prebid SDK User Agent Cleanup](#prebid-sdk-user-agent-cleanup) above. | Defaults to false |
| pbsdkAndroidInstlRemove | boolean | optional | See the [Prebid SDK Interstitial Flag](#prebid-sdk-interstitial-flag) correction above. | Defaults to false |

Here's an example of the account config used in PBS-Java:

```json
{
  "hooks": {
    "modules": {
      "pb-request-correction": {
        "enabled": true,
        "pbsdkUaCleanup": true,
        "pbsdkAndroidInstlRemove": true
        }
      }
    }
  },
  "execution-plan": {
    "endpoints": {
      "/openrtb2/auction": {
        "stages": {
          "processed-auction": {
            "groups": [
              {
                "timeout": 5,
                "hook-sequence": [
                  {
                    "module-code": "pb-request-correction",
                    "hook-impl-code": "pb-request-correction-processed-auction"
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
