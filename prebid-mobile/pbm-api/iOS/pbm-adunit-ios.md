---
layout: page_v2
title: AdUnit - iOS
description: AdUnit - iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# AdUnit: NSObject
{: .notoc}


The AdUnit class is the superclass of the [BannerAdUnit](/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html) and [InterstitialAdUnit](/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html) classes.


- TOC
 {:toc}

---

## Object

### AdUnit

Create a new Banner Ad Unit or Interstitial Ad Unit with a Prebid Server configuration ID and a banner size if applicable.

**Parameters**

`configId`:  String containing the Prebid Server configuration ID.

`size:`: CGSize conatining width and height of the AdUnit.

**Properties**

`prebidConfigId`: String containing the Prebid Server configuration ID.

`adSizes`: An Array of CGSizes to be used for AdUnit sizes.

---

## Methods


### fetchDemand

Trigger a call to Prebid Server to retrieve demand for this Prebid Mobile ad unit.

**Parameters**

`adObject`: adServer object to which the Prebid keys need to be attached.

`completion`: Closure which receives one argument, the enum `ResultCode`. There is no return value.

### addUserKeyword

Obtains the user keyword and value for targeting of a Prebid Mobile ad unit. If the key already exists the value will be appended to the `customKeywords` property. No duplicates will be added.

**Parameters**

`key`: A String to be used to check if an existing value exists in the `customKeywords` property.

`value`: A String to be appended to the `customKeywords` property.

### removeUserKeyword
Remove a key and all its associated values from `customKeywords` of a given Prebid Mobile ad unit.

**Parameters**

`forKey`: A string containing the key to remove from `customKeywords`.

### clearUserKeywords
Remove all keys and all values from a given Prebid Mobile ad unit.

### setAutoRefreshMillis
If set on a given Prebid Mobile ad unit, the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServes refresh be turned off.

### startAutoRefresh

Starts the auto-refresh behavior for a given Prebid Mobile ad unit.

### stopAutoRefresh
Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

## Examples

**fetchDemand**

**Swift**
```


 func loadDFPBanner(bannerUnit : AdUnit){

     let bannerUnit = BannerAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", size: CGSize(width: 300, height: 250))

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
**Objective-C**

```
-(void) loadDFPBanner {

    self.bannerUnit = [[BannerAdUnit alloc] initWithConfigId:@"6ace8c7d-88c0-4623-8117-75bc3f0a2e45" size:CGSizeMake(300, 250)];
    [self.bannerUnit setAutoRefreshMillisWithTime:35000];
    self.dfpView = [[DFPBannerView alloc] initWithAdSize:kGADAdSizeMediumRectangle];
    self.dfpView.rootViewController = self;
    self.dfpView.adUnitID = @"/19968336/PrebidMobileValidator_Banner_All_Sizes";
    self.dfpView.delegate = self;
    [self.bannerView addSubview:self.dfpView];
    self.dfpView.backgroundColor = [UIColor redColor];
    self.request = [[DFPRequest alloc] init];
    self.request.testDevices = @[kDFPSimulatorID];

    [self.bannerUnit fetchDemandWithAdObject:self.request completion:^(enum ResultCode result) {
        NSLog(@"Prebid demand result %ld", (long)result);
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.dfpView loadRequest:self.request];
        });
    }];
}
```
---
**addKeyword**

```
bannerUnit.addKeyword(key:"Sample", value:"Value to add")
```

**removeUserKeyword**

```
bannerUnit.removeUserKeyword(forKey:"sample")
```

**clearUserKeywords**

```
bannerUnit.clearUserKeywords()
```

**setAutoRefreshMillis**

```
bannerUnit.setAutoRefreshMillis(time:Double)
```
**stopAutoRefresh**

```
bannerUnit.stopAutoRefresh()
```


## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
