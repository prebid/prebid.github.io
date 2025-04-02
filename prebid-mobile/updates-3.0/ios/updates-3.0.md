---
layout: page_v2
title: Prebid Mobile 3.0 Updates
description: Prebid Mobile 3.0 Updates
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 2
---

# Prebid Mobile 3.0

{:.no_toc}

This page provides a detailed list of removed APIs in PrebidMobile SDK 3.0, along with their corresponding recommended replacements.

- TOC
  {:toc}

## Elimination of Deprecated Functionality

PrebidMobile 3.0 introduces significant changes and removes several deprecated features. Below is a detailed breakdown of these removals, and how users should migrate to the new alternatives.

### Targeting

| Removed                                | Alternative                       |
| -------------------------------------- | --------------------------------- |
| buyerUID                               | Arbitrary ORTB API                |
| userCustomData                         | Arbitrary ORTB API                |
| locationPrecision                      | None, removed                     |
| setLocationPrecision(\_:)              | None, removed                     |
| getLocationPrecision()                 | None, removed                     |
| setCustomParams(\_:)                   | None, removed                     |
| addCustomParam(\_:withName:)           | None, removed                     |
| addUserData(key:value:)                | userExt, Arbitrary ORTB API       |
| updateUserData(key:value:)             | None, removed                     |
| removeUserData(for:)                   | None, removed                     |
| clearUserData()                        | None, removed                     |
| getUserData()                          | None, removed                     |
| userDataDictionary                     | None, removed                     |
| userKeywords                           | getUserKeywords()                 |
| addContextData(key:value:)             | addAppExtData(key:value:)         |
| updateContextData(key:value:)          | updateAppExtData(key:value:)      |
| removeContextData(for:)                | removeAppExtData(for:)            |
| clearContextData()                     | clearAppExtData()                 |
| getContextData()                       | getAppExtData()                   |
| contextDataDictionary                  | getAppExtData()                   |
| addContextKeyword(\_:)                 | addAppKeyword(\_:)                |
| addContextKeywords(\_:)                | addAppKeywords(\_:)               |
| removeContextKeyword(\_:)              | removeAppKeyword(\_:)             |
| clearContextKeywords()                 | clearAppKeywords()                |
| getContextKeywords()                   | getAppKeywords()                  |
| contextKeywords                        | getAppKeywords()                  |
| yearOfBirth                            | None, deprecated by ORTB.         |
| setYearOfBirth(yob:)                   | None, deprecated by ORTB.         |
| getYearOfBirth()                       | None, deprecated by ORTB.         |
| clearYearOfBirth()                     | None, deprecated by ORTB.         |
| userGender                             | None, deprecated by ORTB.         |
| userGenderDescription()                | None, deprecated by ORTB.         |
| userID                                 | Arbitrary ORTB API                |
| eids                                   | Targeting.setExternalUserIds(\_:) |
| storeExternalUserId(\_:)               | None, removed                     |
| fetchStoredExternalUserIds()           | None, removed                     |
| fetchStoredExternalUserId(\_ source:)  | None, removed                     |
| removeStoredExternalUserId(\_ source:) | None, removed                     |
| removeStoredExternalUserIds()          | None, removed                     |

### Prebid

| Removed                                | Alternative                                      |
| -------------------------------------- | ------------------------------------------------ |
| bidderNameAppNexus                     | None, removed                                    |
| bidderNameRubiconProject               | None, removed                                    |
| externalUserIdArray                    | Targeting.setExternalUserIds(\_:)                |
| prebidServerHost                       | initializeSDK(serverURL:)                        |
| useExternalClickthroughBrowser         | None, removed                                    |
| impClickbrowserType                    | None, removed                                    |
| setCustomPrebidServer(url:)            | initializeSDK(serverURL:)                        |
| initializeSDK(_:_:)                    | initializeSDK(serverURL:_:_)                     |
| initializeSDK(gadMobileAdsVersion:\_:) | initializeSDK(serverURL:gadMobileAdsVersion:\_:) |
| initializeSDK(\_:)                     | initializeSDK(serverURL:\_:)                     |

### AdUnit

| Removed                       | Alternative                     |
| ----------------------------- | ------------------------------- |
| addContextData(key:value:)    | Arbitrary ORTB API              |
| updateContextData(key:value:) | None, removed                   |
| removeContextData(forKey:)    | None, removed                   |
| clearContextData()            | None, removed                   |
| addContextKeyword(\_:)        | Arbitrary ORTB API              |
| addContextKeywords(\_:)       | Arbitrary ORTB API              |
| removeContextKeyword(\_:)     | None, removed                   |
| clearContextKeywords()        | None, removed                   |
| addExtKeyword(\_:)            | Arbitrary ORTB API              |
| addExtKeywords(\_:)           | Arbitrary ORTB API              |
| removeExtKeyword(\_:)         | None, removed                   |
| clearExtKeywords()            | None, removed                   |
| addExtData(key:value:)        | Arbitrary ORTB API              |
| updateExtData(key:value:)     | None, removed                   |
| removeExtData(forKey:)        | None, removed                   |
| clearExtData()                | None, removed                   |
| setAppContent(\_:)            | Arbitrary ORTB API              |
| getAppContent()               | None, removed                   |
| clearAppContent()             | None, removed                   |
| addAppContentData(\_:)        | Arbitrary ORTB API              |
| removeAppContentData(\_:)     | None, removed                   |
| clearAppContentData()         | None, removed                   |
| getUserData()                 | None, removed                   |
| addUserData(\_:)              | Arbitrary ORTB API              |
| removeUserData(\_:)           | None, removed                   |
| clearUserData()               | None, removed                   |
| setOrtbConfig(\_:)            | setImpORTBConfig(\_:)           |
| getOrtbConfig()               | getImpORTBConfig()              |
| fetchDemand(completion:, \_:) | fetchDemand(completionBidInfo:) |

### PrebidRequest

| Removed                         | Alternative        |
| ------------------------------- | ------------------ |
| addExtData(key:value:)          | Arbitrary ORTB API |
| updateExtData(key:value:)       | None, removed      |
| removeExtData(forKey:)          | None, removed      |
| clearExtData()                  | None, removed      |
| addExtKeyword(\_:)              | Arbitrary ORTB API |
| addExtKeywords(\_:)             | Arbitrary ORTB API |
| removeExtKeyword(\_:)           | None, removed      |
| clearExtKeywords()              | None, removed      |
| setAppContent(\_:)              | Arbitrary ORTB API |
| clearAppContent()               | None, removed      |
| addAppContentData(\_:)          | Arbitrary ORTB API |
| removeAppContentDataObject(\_:) | None, removed      |
| clearAppContentDataObjects()    | None, removed      |
| addUserData(\_:)                | Arbitrary ORTB API |
| removeUserData(\_:)             | None, removed      |
| clearUserData()                 | None, removed      |

### ExternalUserId

| Removed                            | Alternative            |
| ---------------------------------- | ---------------------- |
| identifier                         | uids[].id              |
| atype                              | uids[].atype           |
| init(source:identifier:atype:ext:) | init(source:uids:ext:) |

### BannerAdUnit

| Removed    | Alternative      |
| ---------- | ---------------- |
| parameters | bannerParameters |

### InterstitialAdUnit

| Removed    | Alternative      |
| ---------- | ---------------- |
| parameters | bannerParameters |

### RewardedVideoAdUnit

| Removed    | Alternative     |
| ---------- | --------------- |
| parameters | videoParameters |

### BannerView, InterstitialRenderingAdUnit, RewardedAdUnit, MediationBannerAdUnit, MediationBaseInterstitialAdUnit, MediationNativeAdUnit

| Removed                         | Alternative               |
| ------------------------------- | ------------------------- |
| ortbConfig                      | setImpORTBConfig(\_:)     |
| addExtKeyword(\_:)              | Arbitrary ORTB API        |
| addExtKeywords(\_:)             | Arbitrary ORTB API        |
| removeExtKeyword(\_:)           | None, removed             |
| clearExtKeywords()              | None, removed             |
| addContextData(\_:forKey:)      | addExtData(\_:forKey:)    |
| updateContextData(\_:forKey:)   | updateExtData(\_:forKey:) |
| removeContextDate(forKey:)      | removeExtDate(forKey:)    |
| clearContextData()              | clearExtData()            |
| addContextKeyword(\_:)          | addExtKeyword(\_:)        |
| addContextKeywords(\_:)         | addExtKeywords(\_:)       |
| removeContextKeyword(\_:)       | removeExtKeyword(\_:)     |
| clearContextKeywords()          | clearExtKeywords()        |
| addExtData(key:value:)          | Arbitrary ORTB API        |
| updateExtData(key:value:)       | None, removed             |
| removeExtData(forKey:)          | None, removed             |
| clearExtData()                  | None, removed             |
| setAppContent(\_:)              | Arbitrary ORTB API        |
| clearAppContent()               | None, removed             |
| addAppContentData(\_:)          | Arbitrary ORTB API        |
| removeAppContentDataObject(\_:) | None, removed             |
| clearAppContentDataObjects()    | None, removed             |
| addUserData(\_:)                | Arbitrary ORTB API        |
| removeUserData(\_:)             | None, removed             |
| clearUserData()                 | None, removed             |

### AdFormat

| Removed | Alternative |
| ------- | ----------- |
| display | banner      |

### Utils

| Removed                           | Alternative    |
| --------------------------------- | -------------- |
| convertDictToMoPubKeywords(dict:) | None, removed. |

### Host

| Removed               | Alternative                          |
| --------------------- | ------------------------------------ |
| setCustomHostURL(\_:) | setHostURL(\_:nonTrackingURLString:) |
| getHostURL(host:)     | getHostURL()                         |

### Other SDK Changes

- `imp[].ext.data.adslot` is no longer sent in the request;
- Removed `VideoAdUnit`, alternative - `BannerAdUnit` with video ad format;
- Removed `VideoInterstitialAdUnit`, alternative - `InterstitialAdUnit` with video ad format;
- Removed `PrebidHost` without replacement;
- Removed `PrebidAdMobRewardedVideoAdapter`, alternative - `PrebidAdMobRewardedAdapter`;