---

layout: page_v2
title: Integrating the Android SDK
description: Prebid Android Rendering SDK Integration
sidebarType: 2

---

# Integrating the iOS SDK with your project

## CocoaPods integration

To download and integrate the Rendering Module into your project using CocoaPods, add the following line to your project’s podfile:

```
pod 'PrebidMobile/Rendering'
```

If you integrate Prebid Rendering Module with GAM or MoPub add these pods respectively

```
# + Google Ad Manager (optional)
pod 'PrebidMobile/GAMEventHandlers'

# + MoPub (optional)
pod 'PrebidMobile/MoPubAdapters'
```

## Init Prebid Rendering Module

Firstly import Rendering Module. The best place to do it is the `application:didFinishLaunchingWithOptions` method.


```
import PrebidMobileRendering
```

Then provide the **Prebid Account ID** of your organization. Set the predefined or costom prebid host.
 
```
PrebidRenderingConfig.shared.accountID = YOUR_ACCOUNT_ID
PrebidRenderingConfig.shared.prebidServerHost = HOST
```



