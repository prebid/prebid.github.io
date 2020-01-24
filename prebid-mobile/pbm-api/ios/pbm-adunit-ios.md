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

{% include alerts/alert_warning.html content="Ad Unit *User* keywords will be deprecated in favor of [targeting keywords](pbm-targeting-ios#user-keywords) for Prebid versions 1.2+. Support will continue for Ad Unit User Keywords as users migrate to targeting user keywords." %}


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
</div>

### setAutoRefreshMillis
If set on a given Prebid Mobile ad unit, the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServes refresh be turned off.

### startAutoRefresh

Starts the auto-refresh behavior for a given Prebid Mobile ad unit.

### stopAutoRefresh
Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

### addContextKeyword
Ad Unit context keywords object is a free form list of comma separated keywords about the app as defined in app.keyword in OpenRTB 2.5. The `addContextKeyword` function adds a single keyword to the ad unit.

```
func addContextKeyword(_ newElement: String)
```

### addContextKeywords
Ad Unit context keywords object is a free form list of comma separated keywords about the app as defined in app.keyword in OpenRTB 2.5. The `addContextKeywords` function adds a multiple keyword to the ad unit.

```
func addContextKeywords(_ newElements: Set<String>)
```

### removeContextKeyword

```
func removeContextKeyword(_ element: String)
```

### clearContextKeywords

```
func clearContextKeywords()
```




### First Party Data

First Party Data (FPD) is free form data supplied by the publisher to provide additional targeting of the user or inventory context, used primarily for striking PMP (Private MarketPlace) deals with Advertisers. Data supplied in the data parameters are typically not sent to DSPs whereas information sent in non-data objects (i.e. `setYearOfBirth`, `setGender`, etc.) will be. Access to FPD can be limited to a supplied set of Prebid bidders via an access control list.

Data is broken up into two different data types:
* User
  * Global in scope only
* Inventory (context)
  * Global scope
  * Ad Unit grain

 The below first party inventory context will apply to the specic ad unit the data object is applied to. For global user or inventory context level first party data, refer to [first party data section of the Targeting](pbm-targeting-params-ios#first-party-data) page.

#### addContextData
```
func addContextData(key: String, value: String)
```

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key


#### updateContextData
```
func updateContextData(key: String, value: Set<String>)
```

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key


#### removeContextData
```
func removeContextData(forKey: String)
```

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key


#### clearContextData
```
func clearContextData()
```

## Examples

**fetchDemand**

**Swift**


<div>
<pre class="pb-code-hl"><code>

 func loadDFPBanner(bannerUnit : AdUnit){

     let bannerUnit = BannerAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", size: CGSize(width: 300, height: 250))

    let dfpBanner = DFPBannerView(adSize: kGADAdSizeMediumRectangle)
    dfpBanner.adUnitID = "/19968336/PriceCheck_300x250"
    dfpBanner.rootViewController = self

    bannerView.addSubview(dfpBanner)
    request.testDevices = [ kGADSimulatorID ]

    // Do any additional setup after loading the view, typically from a nib.
    bannerUnit.fetchDemand(adObject: self.request) { (ResultCode) in
        print("Google Ad Manager banner bids fetch successfull")
        dfpBanner.load(self.request)
    }
}
</code></pre></div>

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

**addContextKeyword**
```
bannerAdUnit.addContextKeyword("adunitContextKeywordValue1")
bannerAdUnit.addContextKeyword("adunitContextKeywordValue2")
bannerAdUnit.addContextKeyword("adunitContextKeywordValue3")
```

**addContextData**
```
bannerAdUnit.addContextData(key: "adunitContextDataKey1", value: "adunitContextDataValue1")
```


## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
