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


The AdUnit class is the superclass of the [BannerAdUnit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html) and [InterstitialAdUnit](/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html) classes.


- TOC
 {:toc}

---

## Object

### AdUnit

Create a new Banner Ad Unit or Interstitial Ad Unit with a Prebid Server configuration ID and a banner size if applicable.

**Parameters**

`configId`:  String containing the Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

`size:`: CGSize conatining width and height of the AdUnit.

**Properties**

`prebidConfigId`: String containing the Prebid Server configuration ID.

`adSizes`: An Array of CGSizes to be used for AdUnit sizes.


#### pbAdSlot

PB Ad Slot is an identifier tied to the placement the ad will be delivered in. The use case for PB Ad Slot is to pass to exchange an ID they can use to tie to reporting systems or use for data science driven model building to match with impressions sourced from alternate integrations. A common ID to pass is the ad server slot name.

`adUnit.ortb2Imp.ext.data.pbadslot = "/1111111/homepage/med-rect-2"`

---

## Methods


### fetchDemand

Trigger a call to Prebid Server to retrieve demand for this Prebid Mobile ad unit.

#### Mopub or GAM

By default, Prebid SDK uses inflection to determine the publisher ad server, one of Mopub or Google Ad Manager (GAM), to convert Prebid's targeting keys (PBS bid keys, host and cache key) to trigger targeted line items. To render ads in ad servers other than Mopub or GAM, use the next section's 3rd party ad server support feature.

**Parameters**

`adObject`: adServer object to which the Prebid keys need to be attached.

`completion`: Closure which receives one argument, the enum `ResultCode`. There is no return value.


#### 3rd Party Ad Server

The default ad servers for Prebid's Mobile SDK are MoPub and GAM. The SDK can be expanded to include support for 3rd party ad servers through the fetchDemand function. This function returns the Prebid Server bidder key/values (targeting keys), which can then be passed to the ad server of choice. 

In this mode, the publisher will be responsible for the following actions:
* Call fetchDemand with extended targetingDict callback
* Retrieve targeting keys from extended fetchDemand function
* Convert targeting keys into the format for your ad server
* Pass converted keys to your ad server
* Render ad with Prebid Universal Creative or custom renderer


**Function callbacks**

* `ResultCode`: enum [result codes](https://docs.prebid.org/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
* `targetingDict`: [Prebid Server Response targeting keys](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting)


```
func fetchDemand(completion: @escaping(_ result: ResultCode, _ kvResultDict: [String : String]?) -> Void)
```

Examples:

Swift
```swift
func loadBanner() {
    
    //adUnit is BannerAdUnit type
    adUnit.fetchDemand { [weak self] (resultCode: ResultCode, targetingDict: [String : String]?) in
        
        self?.adServerRequest.customTargeting = targetingDict
        self?.adServerBanner.load(self?.adServerRequest)
    }
}


func loadRewardedVideo() {
    let adUnit = RewardedVideoAdUnit(configId: "1001-1")
    adUnit.fetchDemand { [weak self] (resultCode: ResultCode, targetingDict: [String : String]?) in
        
        //Publisher should provide support for converting keys into format of 3rd party ad server and loading ads
        let keywords = convertDictToAdServerKeywords(dict: targetingDict)
        AdServerLoadAds.loadAd(withAdUnitID: "46d2ebb3ccd340b38580b5d3581c6434", keywords: keywords)
    }
}
```

Objective-C
```objective-C
-(void) loadAdServerBanner {

    //adUnit is BannerAdUnit Type
    [self.adUnit fetchDemandWithCompletion:^(enum ResultCode resultCode, NSDictionary<NSString *,NSString *> * _Nullable targetingDict) {
        
        [self.request setCustomTargeting:targetingDict];
        [self.adServerView loadRequest:self.request];
    }];
}

-(void) loadAdServerRewardedVideo {

    //adUnit is RewardedVideoAdUnit Type
    [adUnit fetchDemandWithCompletion:^(enum ResultCode resultCode, NSDictionary<NSString *,NSString *> * _Nullable targetingDict) {
        
        NSString *keywords = [Utils.shared convertDictToMoPubKeywordsWithDict:targetingDict];
        [adServerRewardedVideo loadRewardedVideoAdWithAdUnitID:@"46d2ebb3ccd340b38580b5d3581c6434" keywords:keywords ];
    
    }];
}
```

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

### App Content

The `ContentObject` alows you to provide more details about content whithin the app. All proeprties provided to the `ContentObject` will be sent in the `app.content` field of the bid request.

```
func setAppContent(_ appContent: ContentObject) 
```
   
```  
func getAppContent() -> ContentObject? 
```

```        
func clearAppContent() 
```
    
### App Content Data

Using the following methods you can add `app.content.data` objects to the bid requests.  
    
```
func addAppContentData(_ dataObjects: [ContentDataObject]) 
```

```
func removeAppContentData(_ dataObject: ContentDataObject) 
```
    
```
func clearAppContentData() 
```

### User Data

Using the following methods you can add `user.data` objects to the bid requests.  

```
func getUserData() -> [PBMORTBContentData]? 
```    
```
func addUserData(_ userDataObjects: [PBMORTBContentData]) 
```

```    
func removeUserData(_ userDataObject: PBMORTBContentData) 
```

```    
func clearUserData() 
```

### Data Object

The Data object is free form data (also known as First Party Data) supplied by the publisher to provide additional targeting of the user or inventory context, used primarily for striking PMP (Private MarketPlace) deals with Advertisers. Data supplied in the data parameters are typically not sent to DSPs whereas information sent in non-data objects (i.e. `setYearOfBirth`, `setGender`, etc.) will be. Access to FPD can be limited to a supplied set of Prebid bidders via an access control list.

Data is broken up into two different data types:
* User
  * Global in scope only
* Inventory (context)
  * Global scope
  * Ad Unit grain

The first party inventory context below will apply to the specic ad unit the data object is applied to. For global user or inventory context level first party data, refer to [first party data section of the Targeting](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#first-party-data) page.

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
     bannerUnit.ortb2Imp.ext.data.pbadslot = "/1111111/homepage/med-rect-2"`

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

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Interstitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
