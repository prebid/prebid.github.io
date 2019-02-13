---
layout: page_v2
title: BannerAdUnit AdUnit
description: BannerAdUnit AdUnit
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# BannerAdUnit AdUnit
{: .notoc}

The BannerAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the BannerAdUnit object to create and configure a banner ad unit in your app.  '

- TOC
 {:toc}

## Object

### BannerAdUnit

Create a new Banner Ad Unit associated with a Prebid Server configuration ID and a banner size. 

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods. 

**Parameters**

`configId (String)`: Prebid Server configuration ID.

`size (CGSize)`: Width and height of the banner.

## Methods

### addAdditionalSize

* Add an additional banner size to the Prebid Mobile ad unit.  Banner ad units must be associated with one or more sizes. 

**Parameters**

`sizes (CGSize)`: The width and height of the banner ad. 

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for addtional parameters and methods. 

---

## Examples

**Create a BannerAdUnit**
```        
let bannerUnit = BannerAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", size: CGSize(width: 300, height: 250))
```
**Add additional ad sizes**

```
bannerUnit.addAdditionalSizes(sizes: CGSize(width: 320, height: 50))
```
Once a BannerAdUnit is created use Google Mobile Ads or MoPub to retrieve and display creatives.

**Google Mobile Ads**

Import the GoogleMobileAds from the [google-mobile-sdk](https://developers.google.com/admob/ios/download) into the UIViewController displaying the BannerAdUnit

```
func loadDFPBanner(bannerUnit : AdUnit){
        let dfpBanner = DFPBannerView(adSize: kGADAdSizeMediumRectangle)
        dfpBanner.adUnitID = "/19968336/PriceCheck_300x250"
        dfpBanner.rootViewController = self
        
        bannerView.addSubview(dfpBanner)
        request.testDevices = [ kGADSimulatorID ]
        
        // Do any additional setup after loading the view, typically from a nib.
        bannerUnit.fetchDemand(adObject: self.request) { (ResultCode) in
            print("DFP banner bids fetch successfull")
            dfpBanner.load(self.request)
        }
    }
```

**MoPub**

Import MoPub from the [mopub-ios-sdk](https://github.com/mopub/mopub-ios-sdk) into the UIViewController displaying the BannerAdUnit

```
func loadMoPubBanner(bannerUnit: AdUnit){
        
        let sdkConfig = MPMoPubConfiguration(adUnitIdForAppInitialization: "a935eac11acd416f92640411234fbba6")
        sdkConfig.globalMediationSettings = []
        
        MoPub.sharedInstance().initializeSdk(with: sdkConfig) {
            
        }
        
        let mopubBanner = MPAdView(adUnitId: "a935eac11acd416f92640411234fbba6", size: CGSize(width: 300, height: 250))
        mopubBanner?.delegate = self
        
        bannerView.addSubview(mopubBanner!)
        
        // Do any additional setup after loading the view, typically from a nib.
        bannerUnit.fetchDemand(adObject: mopubBanner!) { (ResultCode) in
            print("MoPub banner bids fetch successfull")
            mopubBanner?.loadAd()
        }
        
    }
```

## Related Topics 

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)