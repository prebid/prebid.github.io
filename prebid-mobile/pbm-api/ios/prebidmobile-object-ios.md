---
layout: page_v2
title: Prebid Mobile Object
description: Prebid Mobile Object
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid: NSObject
{: .notoc}

The Prebid class is a singleton that enables the user to apply global settings. 

- TOC
 {:toc}

--- 

## Object 

### Prebid

**Properties**


`shareGeoLocation`: Optional Bool, if this flag is True AND the app collects the user’s geographical location data, Prebid Mobile will send the user’s geographical location data to Prebid Server. If this flag is False OR the app does not collect the user’s geographical location data, Prebid Mobile will not populate any user geographical location information in the call to Prebid Server. The default setting is false. 

```
if let shareGeoLocation = Prebid.shared.shareGeoLocation { 
    //do something with shareGeoLocation
}

guard let shareGeoLocation = Prebid.shared.shareGeoLocation else { 
    print("Error retrieving shareGeoLocation")
    return
}

//do something with shareGeoLocation

```

```
let Prebid.shared.shareGeoLocation = true
```



## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)



