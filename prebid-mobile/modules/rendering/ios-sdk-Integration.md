---

layout: page_v2
title: Integrating the Android SDK
description: Prebid Android Rendering SDK Integration
sidebarType: 2

---

# Code Integration for iOS


## CocoaPods integration

Starting with v2.0.0 the Rendering API is a part of Prebid Mobile SDK. Add the following item into your podfile to integrate it:

```
pod 'PrebidMobile'
```

If you need to integrate Prebid with GAM, AdMob or AppLovin MAX add these pods respectively

```
# + Google Ad Manager (optional)
pod 'PrebidMobileGAMEventHandlers'

# + AdMob (optional)
pod 'PrebidMobileAdMobAdapters'

# + MAX (optional)
pod 'PrebidMobileMAXAdapters'
```


## Init Prebid Rendering

The best place for initialization is the `application:didFinishLaunchingWithOptions` method. Import the SDK first:

```
import PrebidMobile
```

Then set the predefined or costom Prebid Server **host** and provide the **Prebid Account ID**.
 
```
Prebid.shared.prebidServerHost = HOST
Prebid.shared.prebidServerAccountId = YOUR_ACCOUNT_ID
```

And initialize the SDK: 

```
Prebid.initializeSDK()
```



