---
layout: page_v2
title: Prebid Mobile 3.0 API Changes
description: Prebid Mobile 3.0 API Changes
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
sidebarType: 2
---

<style>
table th:first-of-type {
    width: 50%;
}
table th:nth-of-type(2) {
    width: 50%;
}
</style>

# Prebid Mobile 3.0 API Changes

{:.no_toc}

This page provides a detailed list of removed APIs in PrebidMobile SDK 3.0, along with their corresponding recommended
replacements.

## Elimination of Deprecated Functionality

PrebidMobile 3.0 introduces significant changes and removes several deprecated features. Below is a detailed breakdown
of these removals, and how publishers should migrate to the new alternatives.

### PrebidMobile

{: .table .table-bordered .table-striped }

| Removed                          | Alternative                                                                                                                                                                                                |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| isCoppaEnabled                   | [setSubjectToCOPPA()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setSubjectToCOPPA(java.lang.Boolean))                                         |
| useExternalBrowser               | None, removed.                                                                                                                                                                                             |
| sendMraidSupportParams           | None, by default true.                                                                                                                                                                                     |
| logLevel                         | [setLogLevel()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/LogUtil.html#setLogLevel(int))                                                                                             |
| setPrebidServerHost()            | [initializeSdk()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/PrebidMobile.html#initializeSdk(android.content.Context,java.lang.String,SdkInitializationListener)) with host parameter |
| setExternalUserIds()             | [TargetingParams.setExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setExternalUserIds(java.util.List))                                            |
| initializeSdk(context, listener) | [initializeSdk()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/PrebidMobile.html#initializeSdk(android.content.Context,java.lang.String,SdkInitializationListener)) with host parameter |
| getApplicationContext()          | PrebidContextHolder.getContext() |

---

### Ad units

All classes with ad unit data: AdUnit, BannerView, InterstitialAdUnit, RewardedAdUnit, MediationBannerAdUnit,
MediationBaseInterstitialAdUnit, MediationNativeAdUnit, PrebidRequest, TargetingParams.

{: .table .table-bordered .table-striped }

| Removed                    | Alternative                                                                                                                                                                                                                                                                                                 |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| addContextData()           | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| updateContextData()        | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| removeContextData()        | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| clearContextData()         | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| getContextDataDictionary() | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| addContextKeyword()        | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| addContextKeywords()       | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| removeContextKeyword()     | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| clearContextKeywords()     | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| getContextKeywordsSet()    | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| addExtKeyword()            | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| addExtKeywords()           | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| removeExtKeyword()         | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| clearExtKeywords()         | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| getExtKeywordsSet()        | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| addExtData()               | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| updateExtData()            | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| removeExtData(String key)  | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| clearExtData()             | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| getExtDataDictionary()     | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| setAppContent()            | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| getAppContent()            | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| addUserData()              | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| getUserData()              | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| clearUserData()            | None, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)).                                                                                                                                       |
| setOrtbConfig()            | [setImpOrtbConfig()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String)) or [TargetingParams.setGlobalOrtbConfig()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setGlobalOrtbConfig(java.lang.String)) |

### AdUnit

{: .table .table-bordered .table-striped }

| Removed                          | Alternative                                                                                                                                                                     |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| setAutoRefreshPeriodMillis()     | [setAutoRefreshInterval()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setAutoRefreshInterval(int))                                             |
| fetchDemand(OnCompleteListener2) | [fetchDemand(OnFetchDemandResult)](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#fetchDemand(org.prebid.mobile.api.original.OnFetchDemandResult)) |

### BannerAdUnit

{: .table .table-bordered .table-striped }

| Removed                   | Alternative                                                                                                                                                            |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| setParameters()           | [setBannerParameters()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/BannerBaseAdUnit.html#setBannerParameters(org.prebid.mobile.BannerParameters)) |
| getParameters()           | [getBannerParameters()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/BannerBaseAdUnit.html#getBannerParameters())                                   |
| Internal Parameters class | [BannerParameters](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/BannerParameters.html)                                                              |

---

### InterstitialAdUnit

{: .table .table-bordered .table-striped }

| Removed                   | Alternative                                                                                                                                                            |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| setParameters()           | [setBannerParameters()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/BannerBaseAdUnit.html#setBannerParameters(org.prebid.mobile.BannerParameters)) |
| getParameters()           | [getBannerParameters()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/BannerBaseAdUnit.html#getBannerParameters())                                   |
| Internal Parameters class | [VideoParameters](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/VideoParameters.html)                                                                |

---

### VideoAdUnit

The class was removed.
Alternative - [BannerAdUnit](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/BannerAdUnit.html) with
video ad format.

### VideoInterstitialAdUnit

The class was removed.
Alternative - [InterstitialAdUnit](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/InterstitialAdUnit.html)
with video ad format.

### Support Classes - TargetingParams

{: .table .table-bordered .table-striped }

| Removed                      | Alternative                                                                                                                                                                                                                                                                           |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| setUserAge()                 | Deprecated in OpenRTB, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String))                                                                                                                                                                                                                                                                      |
| getUserAge()                 | None, removed.                                                                                                                                                                                                                                                                        |
| getYearOfBirth()             | Deprecated in OpenRTB. Removed.                                                                                                                                                                                                                                                       |
| setYearOfBirth()             | Deprecated in OpenRTB, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String))                                                                                                                                                                                                                                                      |
| GENDER                       | Deprecated in OpenRTB. Removed.                                                                                                                                                                                                                                                       |
| getGender()                  | Deprecated in OpenRTB. Removed.                                                                                                                                                                                                                                                       |
| setGender()                  | Deprecated in OpenRTB, removed. Can be replaced with [OpenRTB config](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/AdUnit.html#setImpOrtbConfig(java.lang.String))                                                                                                                                                                                                                                                    |
| setUserId()                  | None, removed. Can be replaced with [TargetingParams.setGlobalOrtbConfig()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setGlobalOrtbConfig(java.lang.String))                                                                                                                                                                                                                                                           |
| getUserId()                  | None, removed.                                                                                                                                                                                                                                                                        |
| setBuyerId()                 | None, removed. Can be replaced with [TargetingParams.setGlobalOrtbConfig()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setGlobalOrtbConfig(java.lang.String))                                                                                                                                                                                                                                                                       |
| getBuyerId()                 | None, removed.                                                                                                                                                                                                                                                                        |
| getUserCustomData()          | None, removed.                                                                                                                             |
| setUserCustomData()          | None, removed. Can be replaced with [TargetingParams.setGlobalOrtbConfig()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setGlobalOrtbConfig(java.lang.String))                                  |
| storeExternalUserId()        | [setExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setExternalUserIds(java.util.List)) and [getExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#getExternalUserIds()) |
| fetchStoredExternalUserId()  | [setExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setExternalUserIds(java.util.List)) and [getExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#getExternalUserIds()) |
| fetchStoredExternalUserIds() | [setExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setExternalUserIds(java.util.List)) and [getExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#getExternalUserIds()) |
| removeStoredExternalUserId() | [setExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setExternalUserIds(java.util.List)) and [getExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#getExternalUserIds()) |
| clearStoredExternalUserIds() | [setExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#setExternalUserIds(java.util.List)) and [getExternalUserIds()](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/TargetingParams.html#getExternalUserIds()) |

### ExternalUserId

{: .table .table-bordered .table-striped }

| Removed                                        | Alternative                  |
|------------------------------------------------|------------------------------|
| ExternalUserId(source, identifier, atype, ext) | [ExternalUserId(source, uids)](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/ExternalUserId.html#%3Cinit%3E(java.lang.String,java.util.List)) |
| getAtype()                                     | Use [UniqueId](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/ExternalUserId.UniqueId.html) class.          |
| setAtype()                                     | Use [UniqueId](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/ExternalUserId.UniqueId.html) class.          |
| getIdentifier()                                | Use [UniqueId](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/ExternalUserId.UniqueId.html) class.          |
| setIdentifier()                                | Use [UniqueId](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/ExternalUserId.UniqueId.html) class.          |

### PrebidNativeAd

{: .table .table-bordered .table-striped }

| Removed                                         | Alternative                        |
|-------------------------------------------------|------------------------------------|
| registerView(view, listener)                    | [registerView(view, list, listener)](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/PrebidNativeAd.html#registerView(android.view.View,java.util.List,org.prebid.mobile.PrebidNativeAdEventListener)) |
| registerViewList(container, viewList, listener) | [registerView(view, list, listener)](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/PrebidNativeAd.html#registerView(android.view.View,java.util.List,org.prebid.mobile.PrebidNativeAdEventListener)) |

### AdFormat

{: .table .table-bordered .table-striped }

| Removed | Alternative |
|---------|-------------|
| DISPLAY | [BANNER](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/api/data/AdUnitFormat.html#BANNER)      |

### Host

{: .table .table-bordered .table-striped }

| Removed  | Alternative                                                   |
|----------|---------------------------------------------------------------|
| APPNEXUS | "<https://ib.adnxs.com/openrtb2/prebid>"                      |
| RUBICON  | "<https://prebid-server.rubiconproject.com/openrtb2/auction>" |

### NativeImageAsset

{: .table .table-bordered .table-striped }

| Removed            | Alternative                        |
|--------------------|------------------------------------|
| NativeImageAsset() | [NativeImageAsset(w, h, minw, minh)](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/NativeImageAsset.html#%3Cinit%3E(int,int,int,int)) |

### Other Changes

- Removed deprecated `InitError` class.
- Removed deprecated `SdkInitListener` interface.
- Removed deprecated `OnCompleteListener` interface.
- Introduced `SdkInitialization` listener without deprecated callbacks.
