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

The AdUnit class is the superclass of the [BannerAdUnit]({site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html) and [InterstitialAdUnit]({site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html) classes. 

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

`identifier`: A String Optional, if not nil contains a unique identifier for the AdUnit.

`customKeywords`: A Dictionary with each item containing an Array of Strings.

`userKeywords`: Computed property that returns the customerKeywords.

---

## Methods


### fetchDemand

Trigger a call to Prebid Server to retrieve demand for this Prebid Mobile ad unit. 

**Parameters**

`adObject`: Object to be passed to `validateAndAttachKeywords` method

`completion`: Closure which receives one argument, the enum ResultCode, there is no return value. 

### validateAndAttachKeywords

Validate the bidResponse and attach keywords.

**Parameters**

`adObject (AnyObject)`: 

`bidResponse`: BidResponse object

### addUserKeyword

Obtains the user keyword and value for targeting of a Prebid Mobile ad unit. If the key already exists the value will be appended to the customKeywords property. No duplicates will be added.

**Parameters**

`key`: A String to be used to check if an existing value exists in the customKeywords property. 

`value`: A String to be appended to the customKeywords property.

### addUserKeywords

Obtains the user keyword and values set for user targeting of a Prebid Mobile ad unit. If the passed in key already exist, the values will be replaced with the new set of values. If the key does not exists the key and values will be appended to customKeywords.

**Parameters**

`key`: A string containing the key whose values will be replaced or appended to customKeywords. 

`value`: A string containing the value that will replace existing values or be appended to customKeywords.

### removeUserKeywords

Remove all customKeywords values from a given Prebid Mobile ad unit. 

### removeUserKeyword
Remove a key and all its associated values from customKeywords of a given Prebid Mobile ad unit. 

**Parameters**

`forKey`: A string containing the key to remove from customKeywords.

---

## Examples

**fetchDemand**

```Swift
let bannerUnit = BannerAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", size: CGSize(width: 300, height: 250))

if(adServerName == "DFP"){
    print("entered \(adServerName) loop" )
    loadDFPBanner(bannerUnit: bannerUnit)
 }

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
**addKeyword**

```Swift
    bannerUnit.addKeyword(key:"Sample", value:"Value to add")
```

**addUserKeywords**

```Swift
    let arrValues = ["value1", "value2", "value3"]
    bannerUnit.addUserKeywords(key: "Sample", value:arrValues)
```

**removeUserKeywords**

```Swift
    bannerUnit.removeUserKeywords()
```

**removeUserKeyword**

```Swift
bannerUnit.removeUserKeyword(forKey:"sample")
```


## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitial-ad-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)