---
layout: page_v2
title: Prebid Mobile 3.0 API Changes
description: Prebid Mobile 3.0 API Changes
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
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

This page provides a detailed list of removed APIs in PrebidMobile SDK 3.0, along with their corresponding recommended replacements.

- TOC
{:toc}

## Elimination of Deprecated Functionality

PrebidMobile 3.0 introduces significant changes and removes several deprecated features. Below is a detailed breakdown of these removals, and how publishers should migrate to the new alternatives.

### Targeting

{: .table .table-bordered .table-striped }

| Removed                                | Alternative                       |
| -------------------------------------- | --------------------------------- |
| buyerUID                               | [setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)                |
| userCustomData                         | [setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)                |
| locationPrecision                      | None, removed                     |
| setLocationPrecision(\_:)              | None, removed                     |
| getLocationPrecision()                 | None, removed                     |
| setCustomParams(\_:)                   | [setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)                   |
| addCustomParam(\_:withName:)           | None, removed                     |
| addUserData(key:value:)                | [userExt](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(py)userExt), [setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)      |
| updateUserData(key:value:)             | None, removed                     |
| removeUserData(for:)                   | None, removed                     |
| clearUserData()                        | None, removed                     |
| getUserData()                          | None, removed                     |
| userDataDictionary                     | None, removed                     |
| userKeywords                           | [getUserKeywords()](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)getUserKeywords)                 |
| addContextData(key:value:)             | [addAppExtData(key:value:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)addAppExtDataWithKey:value:)         |
| updateContextData(key:value:)          | [updateAppExtData(key:value:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)updateAppExtDataWithKey:value:)      |
| removeContextData(for:)                | [removeAppExtData(for:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)removeAppExtDataFor:)            |
| clearContextData()                     | [clearAppExtData()](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)clearAppExtData)                |
| getContextData()                       | [getAppExtData()](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)getAppExtData)                   |
| contextDataDictionary                  | [getAppExtData()](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)getAppExtData)                     |
| addContextKeyword(\_:)                 | [addAppKeyword(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)addAppKeyword:)                |
| addContextKeywords(\_:)                | [addAppKeywords(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)addAppKeywords:)               |
| removeContextKeyword(\_:)              | [removeAppKeyword(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)removeAppKeyword:)             |
| clearContextKeywords()                 | [clearAppKeywords()](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)clearAppKeywords)                |
| getContextKeywords()                   | [getAppKeywords()](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)getAppKeywords)                  |
| contextKeywords                        | [getAppKeywords()](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)getAppKeywords)                  |
| yearOfBirth                            | None, deprecated by ORTB.         |
| setYearOfBirth(yob:)                   | [setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)       |
| getYearOfBirth()                       | None, deprecated by ORTB.         |
| clearYearOfBirth()                     | None, deprecated by ORTB.         |
| userGender                             | [setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)        |
| userGenderDescription()                | None, deprecated by ORTB.         |
| userID                                 | [setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)                |
| eids                                   | [Targeting.shared.setExternalUserIds(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setExternalUserIds:) |
| storeExternalUserId(\_:)               | None, removed                     |
| fetchStoredExternalUserIds()           | None, removed                     |
| fetchStoredExternalUserId(\_ source:)  | None, removed                     |
| removeStoredExternalUserId(\_ source:) | None, removed                     |
| removeStoredExternalUserIds()          | None, removed                     |

### Prebid

{: .table .table-bordered .table-striped }

| Removed                                | Alternative                                      |
| -------------------------------------- | ------------------------------------------------ |
| bidderNameAppNexus                     | None, removed                                    |
| bidderNameRubiconProject               | None, removed                                    |
| externalUserIdArray                    | [Targeting.shared.setExternalUserIds(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setExternalUserIds:)               |
| prebidServerHost                       | [initializeSDK(serverURL:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Prebid.html#/c:@M@PrebidMobile@objc(cs)Prebid(cm)initializeSDKWithServerURL:error::)                        |
| useExternalClickthroughBrowser         | None, removed                                    |
| impClickbrowserType                    | None, removed                                    |
| setCustomPrebidServer(url:)            | [initializeSDK(serverURL:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Prebid.html#/c:@M@PrebidMobile@objc(cs)Prebid(cm)initializeSDKWithServerURL:error::)                        |
| initializeSDK(_:_:)                    | [initializeSDK(serverURL:_:_)](https://docs.prebid.org/prebid-mobile-ios/Classes/Prebid.html#/c:@M@PrebidMobile@objc(cs)Prebid(cm)initializeSDKWithServerURL::error::)                     |
| initializeSDK(gadMobileAdsVersion:\_:) | [initializeSDK(serverURL:gadMobileAdsVersion:\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Prebid.html#/c:@M@PrebidMobile@objc(cs)Prebid(cm)initializeSDKWithServerURL:gadMobileAdsVersion:error::) |
| initializeSDK(\_:)                     | [initializeSDK(serverURL:\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Prebid.html#/c:@M@PrebidMobile@objc(cs)Prebid(cm)initializeSDK::)                     |

### AdUnit

{: .table .table-bordered .table-striped }

| Removed                       | Alternative                     |
| ----------------------------- | ------------------------------- |
| addContextData(key:value:)    | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)setImpORTBConfig:)              |
| updateContextData(key:value:) | None, removed                   |
| removeContextData(forKey:)    | None, removed                   |
| clearContextData()            | None, removed                   |
| addContextKeyword(\_:)        | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)setImpORTBConfig:)              |
| addContextKeywords(\_:)       | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)setImpORTBConfig:)              |
| removeContextKeyword(\_:)     | None, removed                   |
| clearContextKeywords()        | None, removed                   |
| addExtKeyword(\_:)            | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)setImpORTBConfig:)              |
| addExtKeywords(\_:)           | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)setImpORTBConfig:)              |
| removeExtKeyword(\_:)         | None, removed                   |
| clearExtKeywords()            | None, removed                   |
| addExtData(key:value:)        | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)setImpORTBConfig:)             |
| updateExtData(key:value:)     | None, removed                   |
| removeExtData(forKey:)        | None, removed                   |
| clearExtData()                | None, removed                   |
| setAppContent(\_:)            | [Targeting.shared.setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)              |
| getAppContent()               | None, removed                   |
| clearAppContent()             | None, removed                   |
| addAppContentData(\_:)        | [Targeting.shared.setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)              |
| removeAppContentData(\_:)     | None, removed                   |
| clearAppContentData()         | None, removed                   |
| getUserData()                 | None, removed                   |
| addUserData(\_:)              | [Targeting.shared.setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)              |
| removeUserData(\_:)           | None, removed                   |
| clearUserData()               | None, removed                   |
| setOrtbConfig(\_:)            | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)setImpORTBConfig:)           |
| getOrtbConfig()               | [getImpORTBConfig()](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)getImpORTBConfig)              |
| fetchDemand(completion:, \_:) | [fetchDemand(completionBidInfo:)](https://docs.prebid.org/prebid-mobile-ios/Classes/AdUnit.html#/c:@M@PrebidMobile@objc(cs)AdUnit(im)fetchDemandWithCompletionBidInfo:) |

### PrebidRequest

{: .table .table-bordered .table-striped }

| Removed                         | Alternative        |
| ------------------------------- | ------------------ |
| addExtData(key:value:)          | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/PrebidRequest.html#/c:@M@PrebidMobile@objc(cs)PrebidRequest(im)setImpORTBConfig:) |
| updateExtData(key:value:)       | None, removed      |
| removeExtData(forKey:)          | None, removed      |
| clearExtData()                  | None, removed      |
| addExtKeyword(\_:)              | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/PrebidRequest.html#/c:@M@PrebidMobile@objc(cs)PrebidRequest(im)setImpORTBConfig:) |
| addExtKeywords(\_:)             | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/PrebidRequest.html#/c:@M@PrebidMobile@objc(cs)PrebidRequest(im)setImpORTBConfig:) |
| removeExtKeyword(\_:)           | None, removed      |
| clearExtKeywords()              | None, removed      |
| setAppContent(\_:)              | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/PrebidRequest.html#/c:@M@PrebidMobile@objc(cs)PrebidRequest(im)setImpORTBConfig:) |
| clearAppContent()               | None, removed      |
| addAppContentData(\_:)          | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/PrebidRequest.html#/c:@M@PrebidMobile@objc(cs)PrebidRequest(im)setImpORTBConfig:) |
| removeAppContentDataObject(\_:) | None, removed      |
| clearAppContentDataObjects()    | None, removed      |
| addUserData(\_:)                | [setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/PrebidRequest.html#/c:@M@PrebidMobile@objc(cs)PrebidRequest(im)setImpORTBConfig:) |
| removeUserData(\_:)             | None, removed      |
| clearUserData()                 | None, removed      |

### ExternalUserId

{: .table .table-bordered .table-striped }

| Removed                            | Alternative            |
| ---------------------------------- | ---------------------- |
| identifier                         | [uids[].id](https://docs.prebid.org/prebid-mobile-ios/Classes/ExternalUserId.html#/c:@M@PrebidMobile@objc(cs)ExternalUserId(py)uids)              |
| atype                              | [uids[].atype](https://docs.prebid.org/prebid-mobile-ios/Classes/ExternalUserId.html#/c:@M@PrebidMobile@objc(cs)ExternalUserId(py)uids)           |
| init(source:identifier:atype:ext:) | [init(source:uids:ext:)](https://docs.prebid.org/prebid-mobile-ios/Classes/ExternalUserId.html#/c:@M@PrebidMobile@objc(cs)ExternalUserId(im)initWithSource:uids:ext:) |

### BannerAdUnit, InterstitialAdUnit

{: .table .table-bordered .table-striped }

| Removed    | Alternative      |
| ---------- | ---------------- |
| parameters | [BannerAdUnit.bannerParamters](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)BannerAdUnit(py)bannerParameters), [InterstitialAdUnit.bannerParamters](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialAdUnit(py)bannerParameters) |

### RewardedVideoAdUnit

{: .table .table-bordered .table-striped }

| Removed    | Alternative     |
| ---------- | --------------- |
| parameters | [videoParameters](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedVideoAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedVideoAdUnit(py)videoParameters) |

### BannerView, InterstitialRenderingAdUnit, RewardedAdUnit, MediationBannerAdUnit, MediationBaseInterstitialAdUnit, MediationNativeAdUnit

{: .table .table-bordered .table-striped }

| Removed                         | Alternative               |
| ------------------------------- | ------------------------- |
| ortbConfig                      | [BannerView.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(im)setImpORTBConfig:), [InterstitialRenderingAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialRenderingAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialRenderingAdUnit(im)setImpORTBConfig:), [RewardedAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedAdUnit(im)setImpORTBConfig:), [MediationBannerAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBannerAdUnit(im)setImpORTBConfig:), [MediationBaseInterstitialAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBaseInterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBaseInterstitialAdUnit(im)setImpORTBConfig:), [MediationNativeAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationNativeAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationNativeAdUnit(im)setImpORTBConfig:)     |
| addExtKeyword(\_:)              | [BannerView.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(im)setImpORTBConfig:), [InterstitialRenderingAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialRenderingAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialRenderingAdUnit(im)setImpORTBConfig:), [RewardedAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedAdUnit(im)setImpORTBConfig:), [MediationBannerAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBannerAdUnit(im)setImpORTBConfig:), [MediationBaseInterstitialAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBaseInterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBaseInterstitialAdUnit(im)setImpORTBConfig:), [MediationNativeAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationNativeAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationNativeAdUnit(im)setImpORTBConfig:)         |
| addExtKeywords(\_:)             | [BannerView.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(im)setImpORTBConfig:), [InterstitialRenderingAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialRenderingAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialRenderingAdUnit(im)setImpORTBConfig:), [RewardedAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedAdUnit(im)setImpORTBConfig:), [MediationBannerAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBannerAdUnit(im)setImpORTBConfig:), [MediationBaseInterstitialAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBaseInterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBaseInterstitialAdUnit(im)setImpORTBConfig:), [MediationNativeAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationNativeAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationNativeAdUnit(im)setImpORTBConfig:)         |
| removeExtKeyword(\_:)           | None, removed             |
| clearExtKeywords()              | None, removed             |
| addContextData(\_:forKey:)      | [BannerView.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(im)setImpORTBConfig:), [InterstitialRenderingAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialRenderingAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialRenderingAdUnit(im)setImpORTBConfig:), [RewardedAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedAdUnit(im)setImpORTBConfig:), [MediationBannerAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBannerAdUnit(im)setImpORTBConfig:), [MediationBaseInterstitialAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBaseInterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBaseInterstitialAdUnit(im)setImpORTBConfig:), [MediationNativeAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationNativeAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationNativeAdUnit(im)setImpORTBConfig:)    |
| updateContextData(\_:forKey:)   | None, removed |
| removeContextDate(forKey:)      | None, removed    |
| clearContextData()              | None, removed            |
| addContextKeyword(\_:)          | [BannerView.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(im)setImpORTBConfig:), [InterstitialRenderingAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialRenderingAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialRenderingAdUnit(im)setImpORTBConfig:), [RewardedAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedAdUnit(im)setImpORTBConfig:), [MediationBannerAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBannerAdUnit(im)setImpORTBConfig:), [MediationBaseInterstitialAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBaseInterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBaseInterstitialAdUnit(im)setImpORTBConfig:), [MediationNativeAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationNativeAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationNativeAdUnit(im)setImpORTBConfig:)        |
| addContextKeywords(\_:)         | [BannerView.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(im)setImpORTBConfig:), [InterstitialRenderingAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialRenderingAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialRenderingAdUnit(im)setImpORTBConfig:), [RewardedAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedAdUnit(im)setImpORTBConfig:), [MediationBannerAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBannerAdUnit(im)setImpORTBConfig:), [MediationBaseInterstitialAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBaseInterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBaseInterstitialAdUnit(im)setImpORTBConfig:), [MediationNativeAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationNativeAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationNativeAdUnit(im)setImpORTBConfig:)       |
| removeContextKeyword(\_:)       | None, removed     |
| clearContextKeywords()          | None, removed        |
| addExtData(key:value:)          | [BannerView.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(im)setImpORTBConfig:), [InterstitialRenderingAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialRenderingAdUnit.html#/c:@M@PrebidMobile@objc(cs)InterstitialRenderingAdUnit(im)setImpORTBConfig:), [RewardedAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/RewardedAdUnit.html#/c:@M@PrebidMobile@objc(cs)RewardedAdUnit(im)setImpORTBConfig:), [MediationBannerAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBannerAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBannerAdUnit(im)setImpORTBConfig:), [MediationBaseInterstitialAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationBaseInterstitialAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationBaseInterstitialAdUnit(im)setImpORTBConfig:), [MediationNativeAdUnit.setImpORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/MediationNativeAdUnit.html#/c:@M@PrebidMobile@objc(cs)MediationNativeAdUnit(im)setImpORTBConfig:),        |
| updateExtData(key:value:)       | None, removed             |
| removeExtData(forKey:)          | None, removed             |
| clearExtData()                  | None, removed             |
| setAppContent(\_:)              | [Targeting.shared.setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)       |
| clearAppContent()               | None, removed             |
| addAppContentData(\_:)          | [Targeting.shared.setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)        |
| removeAppContentDataObject(\_:) | None, removed             |
| clearAppContentDataObjects()    | None, removed             |
| addUserData(\_:)                | [Targeting.shared.setGlobalORTBConfig(\_:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Targeting.html#/c:@M@PrebidMobile@objc(cs)Targeting(im)setGlobalORTBConfig:)        |
| removeUserData(\_:)             | None, removed             |
| clearUserData()                 | None, removed             |

### AdFormat

{: .table .table-bordered .table-striped }

| Removed | Alternative |
| ------- | ----------- |
| display | [banner](https://docs.prebid.org/prebid-mobile-ios/Classes/AdFormat.html#/c:@M@PrebidMobile@objc(cs)AdFormat(cpy)banner)      |

### Utils

{: .table .table-bordered .table-striped }

| Removed                           | Alternative    |
| --------------------------------- | -------------- |
| convertDictToMoPubKeywords(dict:) | None, removed |

### Host

{: .table .table-bordered .table-striped }

| Removed               | Alternative                          |
| --------------------- | ------------------------------------ |
| setCustomHostURL(\_:) | [setHostURL(\_:nonTrackingURLString:)](https://docs.prebid.org/prebid-mobile-ios/Classes/Host.html#/c:@M@PrebidMobile@objc(cs)Host(im)setHostURL:nonTrackingURLString:error:) |
| getHostURL(host:)     | [getHostURL()](https://docs.prebid.org/prebid-mobile-ios/Classes/Host.html#/c:@M@PrebidMobile@objc(cs)Host(im)getHostURLAndReturnError:)                         |

### Other SDK Changes

- `imp[].ext.data.adslot` is no longer sent in the request;
- Removed `VideoAdUnit`, alternative - [BannerAdUnit](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerAdUnit.html) with video ad format;
- Removed `VideoInterstitialAdUnit`, alternative - [InterstitialAdUnit](https://docs.prebid.org/prebid-mobile-ios/Classes/InterstitialAdUnit.html) with video ad format;
- Removed `PrebidHost` without replacement;
- Removed `PrebidAdMobRewardedVideoAdapter`, alternative - `PrebidAdMobRewardedAdapter`.
