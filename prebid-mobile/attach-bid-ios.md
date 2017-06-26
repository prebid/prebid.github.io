---
layout: page
title: Attach Bid to Ad View
description: Attach Bid to Ad View
pid: 3
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
---

<div class="bs-docs-section" markdown="1">

# Attach top bid to ad object
{:.no_toc}

Prebid Mobile continuously pre-caches creatives in the background, so that right before the ad unit makes an ad request from your network, your app can ask Prebid Mobile for a bid price and creative without waiting as shown in the code below.

Prebid Mobile will immediately tell your app whether it has a bid or not without waiting. If it does have a bid, the code below will attach the bids to the ad request by applying keyword targeting.


```objc
#import <PrebidMobile/PrebidMobile.h>
  
// Set the prebid keywords on your adObject, upon completion load the adObject's ad
[PrebidMobile setBidKeywordsOnAdObject:YOUR-AD-VIEW withAdUnitId:@"HomeScreen" withTimeout:600 completionHandler:^{
    [YOUR-AD-VIEW YOUR-ADS-LOAD-METHOD];
}];
```

</div>
