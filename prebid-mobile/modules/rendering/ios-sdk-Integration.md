---

layout: page_v2
title: Integrating the Android SDK
description: Prebid Android Rendering SDK Integration
sidebarType: 2

---

# Code Integration for iOS


## CocoaPods integration (BETA)

The rendering API is introduced as a beta release. In order to integrate it you have to set the beta version explisitly:

```
pod 'PrebidMobile'
```

If you need to integrate Prebid with GAM, AdMob or AppLovin MAX add these pods respectively

```
# + Google Ad Manager (optional)
pod 'PrebidMobileGAMEventHandlers'

# + AdMob (optional)
pod 'PrebidMobileAdMobAdapters'

# + MoPub (optional)
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



