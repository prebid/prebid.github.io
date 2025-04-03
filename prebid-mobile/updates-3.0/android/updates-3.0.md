---
layout: page_v2
title: Prebid Mobile 3.0 Updates
description: Prebid Mobile 3.0 Updates
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

# Prebid Mobile 3.0

{:.no_toc}

This page provides a detailed list of removed APIs in PrebidMobile SDK 3.0, along with their corresponding recommended
replacements.

## Elimination of Deprecated Functionality

PrebidMobile 3.0 introduces significant changes and removes several deprecated features. Below is a detailed breakdown
of these removals, and how publishers should migrate to the new alternatives.

### PrebidMobile

{: .table .table-bordered .table-striped }

| Removed                          | Alternative                            |
|----------------------------------|----------------------------------------|
| isCoppaEnabled                   | None, removed.                         |
| useExternalBrowser               | None, removed.                         |
| sendMraidSupportParams           | None, by default true.                 |
| logLevel                         | setLogLevel()                          |
| setPrebidServerHost()            | initializeSdk() with host parameter    |
| setExternalUserIds()             | TargetingParams.setExternalUserIds()   |
| initializeSdk(context, listener) | initializeSdk(context, host, listener) |
| getApplicationContext()          | None, removed.                         |

---

### Ad units

All classes with ad unit data: AdUnit, BannerView, InterstitialAdUnit, RewardedAdUnit, MediationBannerAdUnit,
MediationBaseInterstitialAdUnit, MediationNativeAdUnit, PrebidRequest, TargetingParams.

{: .table .table-bordered .table-striped }

| Removed                    | Alternative                                                 |
|----------------------------|-------------------------------------------------------------|
| addContextData()           | None, removed. Can be replaced with OpenRTB config.         |
| updateContextData()        | None, removed. Can be replaced with OpenRTB config.         |
| removeContextData()        | None, removed. Can be replaced with OpenRTB config.         |
| clearContextData()         | None, removed. Can be replaced with OpenRTB config.         |
| getContextDataDictionary() | None, removed. Can be replaced with OpenRTB config.         |
| addContextKeyword()        | None, removed. Can be replaced with OpenRTB config.         |
| addContextKeywords()       | None, removed. Can be replaced with OpenRTB config.         |
| removeContextKeyword()     | None, removed. Can be replaced with OpenRTB config.         |
| clearContextKeywords()     | None, removed. Can be replaced with OpenRTB config.         |
| getContextKeywordsSet()    | None, removed. Can be replaced with OpenRTB config.         |
| addExtKeyword()            | None, removed. Can be replaced with OpenRTB config.         |
| addExtKeywords()           | None, removed. Can be replaced with OpenRTB config.         |
| removeExtKeyword()         | None, removed. Can be replaced with OpenRTB config.         |
| clearExtKeywords()         | None, removed. Can be replaced with OpenRTB config.         |
| getExtKeywordsSet()        | None, removed. Can be replaced with OpenRTB config.         |
| addExtData()               | None, removed. Can be replaced with OpenRTB config.         |
| updateExtData()            | None, removed. Can be replaced with OpenRTB config.         |
| removeExtData(String key)  | None, removed. Can be replaced with OpenRTB config.         |
| clearExtData()             | None, removed. Can be replaced with OpenRTB config.         |
| getExtDataDictionary()     | None, removed. Can be replaced with OpenRTB config.         |
| setAppContent()            | None, removed. Can be replaced with OpenRTB config.         |
| getAppContent()            | None, removed. Can be replaced with OpenRTB config.         |
| addUserData()              | None, removed. Can be replaced with OpenRTB config.         |
| getUserData()              | None, removed. Can be replaced with OpenRTB config.         |
| clearUserData()            | None, removed. Can be replaced with OpenRTB config.         |
| setOrtbConfig()            | setImpOrtbConfig() or TargetingParams.setGlobalOrtbConfig() |

### AdUnit

{: .table .table-bordered .table-striped }

| Removed                          | Alternative                      |
|----------------------------------|----------------------------------|
| setAutoRefreshPeriodMillis()     | setAutoRefreshInterval()         |
| fetchDemand(OnCompleteListener2) | fetchDemand(OnFetchDemandResult) |

### BannerAdUnit

{: .table .table-bordered .table-striped }

| Removed               | Alternative      |
|-----------------------|------------------|
| setParameters()       | Parameters class |
| getParameters()       | Parameters class |
| setBannerParameters() | BannerParameters |
| getBannerParameters() | BannerParameters |

---

### InterstitialAdUnit

{: .table .table-bordered .table-striped }

| Removed              | Alternative      |
|----------------------|------------------|
| setParameters()      | Parameters class |
| getParameters()      | Parameters class |
| setVideoParameters() | VideoParameters  |
| getVideoParameters() | VideoParameters  |

---

### VideoAdUnit

The class was removed. Alternative - BannerAdUnit with video ad format.

### VideoInterstitialAdUnit

The class was removed. Alternative - InterstitialAdUnit with video ad format.

### Support Classes - TargetingParams

{: .table .table-bordered .table-striped }

| Removed                      | Alternative                                   |
|------------------------------|-----------------------------------------------|
| setUserAge()                 | None, removed.                                |
| getUserAge()                 | None, removed.                                |
| getYearOfBirth()             | Deprecated in OpenRTB. Removed.               |
| setYearOfBirth()             | Deprecated in OpenRTB. Removed.               |
| GENDER                       | Deprecated in OpenRTB. Removed.               |
| getGender()                  | Deprecated in OpenRTB. Removed.               |
| setGender()                  | Deprecated in OpenRTB. Removed.               |
| setUserId()                  | None, removed.                                |
| getUserId()                  | None, removed.                                |
| setBuyerId()                 | None, removed.                                |
| getBuyerId()                 | None, removed.                                |
| getUserCustomData()          | None, removed.                                |
| setUserCustomData()          | None, removed.                                |
| storeExternalUserId()        | None, removed.                                |
| fetchStoredExternalUserId()  | None, removed.                                |
| fetchStoredExternalUserIds() | None, removed.                                |
| removeStoredExternalUserId() | None, removed.                                |
| clearStoredExternalUserIds() | setExternalUserIds() and getExternalUserIds() |

### ExternalUserId

{: .table .table-bordered .table-striped }

| Removed                                        | Alternative                  |
|------------------------------------------------|------------------------------|
| ExternalUserId(source, identifier, atype, ext) | ExternalUserId(source, uids) |
| getAtype()                                     | Use UniqueId class.          |
| setAtype()                                     | Use UniqueId class.          |
| getIdentifier()                                | Use UniqueId class.          |
| setIdentifier()                                | Use UniqueId class.          |

### PrebidNativeAd

{: .table .table-bordered .table-striped }

| Removed                                         | Alternative                        |
|-------------------------------------------------|------------------------------------|
| registerView(view, listener)                    | registerView(view, list, listener) |
| registerViewList(container, viewList, listener) | registerView(view, list, listener) |

### AdFormat

{: .table .table-bordered .table-striped }

| Removed | Alternative |
|---------|-------------|
| DISPLAY | BANNER      |

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
| NativeImageAsset() | NativeImageAsset(w, h, minw, minh) |

### Other Changes

- Removed deprecated `InitError` class.
- Removed deprecated `SdkInitListener` interface.
- Removed deprecated `OnCompleteListener` interface.
- Introduced `SdkInitialization` listener without deprecated callbacks.
