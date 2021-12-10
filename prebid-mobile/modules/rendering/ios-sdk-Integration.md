---

layout: page_v2
title: Integrating the Android SDK
description: Prebid Android Rendering SDK Integration
sidebarType: 2

---

# Code Integration for iOS

<!---
## CocoaPods integration

Rendering is an essential part of Prebid SDK, so you just need to integrate it:

```
pod 'PrebidMobile'
```

If you need to integrate Prebid with GAM or MoPub add these pods respectively

```
# + Google Ad Manager (optional)
pod 'PrebidMobile/GAMEventHandlers'

# + MoPub (optional)
pod 'PrebidMobile/MoPubAdapters'
```
-->

## CocoaPods integration (BETA)

The rendering API is introduced as a beta release. In order to integrate it you have to set the beta version explisitly:

```
pod 'PrebidMobile', '1.13.0-beta1'
```

If you need to integrate Prebid with GAM or MoPub add these pods respectively

```
# + Google Ad Manager (optional)
pod 'PrebidMobile/GAMEventHandlers', '1.13.0-beta1'

# + MoPub (optional)
pod 'PrebidMobile/MoPubAdapters', '1.13.0-beta1'
```



## Init Prebid Rendering

The best place for initialization is the `application:didFinishLaunchingWithOptions` method. Import the SDK first:

```
import PrebidMobile
```

Then set the predefined or costom Prebid Server **host** and provide the **Prebid Account ID**.
 
```
PrebidRenderingConfig.shared.accountID = YOUR_ACCOUNT_ID
PrebidRenderingConfig.shared.prebidServerHost = HOST
```



