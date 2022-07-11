---
layout: page_v2
title: InterstitialAdUnit - iOS
description: InterstitialAdUnit - iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---
# InterstitialAdUnit (Banner)

The InterstitialAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the InterstitialAdUnit object to create and configure a interstitial ad unit in your app.

## Object

### InterstitialAdUnit

Create a new Interstitial Ad Unit associated with a Prebid Server configuration ID.

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process to monetize sizes smaller than full screen ads. App developers can speicify a minimun width and minimum height percentage an ad can occupy of a devices real state, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.

PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

```
BannerInterstitialAdUnit(configId: String, minWidthPerc: Int, minHeightPerc: Int)
```

**Parameters**

`configId`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

`minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

`minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

#### Parameters


Parameters is a sub class of BannerAdUnit. Create a new Parameters class to define the parameters of the video ad unit. Parameters contain the OpenRTB video attributes.

`api: [int]`: OpenRTB placement

**Parameters**

Array of integers or a predefined constant representing the supported [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Frameworks. While OpenRTB allows additional API Frameworks, they were intentionally left out as constants since they do not make sense in a banner context. If there is a desire to pass API Frameworks that are not represented as a constants within Parameters, they can be passed an integer, where Prebid SDK will pass Prebid Server whatever is present:

* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1` :  signals OMSDK support



## Examples

**Create an InterstitialAdUnit**

```
let adUnit = InterstitialAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45")
```

With optional minWidthPerc and minHeightPerc parameters.
```        
let adUnit = InterstitialAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", minWidthPerc: 50, minHeightPerc: 70)
```


** Define any appropriate API Frameworks **

Swift
```swift
let parameters = BannerAdUnit.Parameters()
parameters.api = [Signals.Api.MRAID_2] //parameters.api = [Signals.Api(5)]
adUnit.setParameters(parameters);
```

Objective C
```
PBBannerAdUnitParameters* parameters = [[PBBannerAdUnitParameters alloc] init];
parameters.api = @[PBApi.MRAID_2];
//parameters.api = @[[[PBApi alloc] initWithIntegerLiteral:5]];
bannerAdUnit.parameters = parameters;
```

**Google Mobile Ads**

**Swift**
```    
func loadDFPInterstitial(adUnit : AdUnit){
        print("Google Mobile Ads SDK version: \(DFPRequest.sdkVersion())")

        let interstitialUnit = InterstitialAdUnit(configId: "6ace8c7d-88c0-4623-8117-75bc3f0a2e45", minWidthPerc: 50, minHeightPerc: 70)
        dfpInterstitial = DFPInterstitial(adUnitID: "/19968336/PrebidMobileValidator_Interstitial")
        dfpInterstitial.delegate = self
        request.testDevices = [ kGADSimulatorID]
        interstitialUnit.fetchDemand(adObject:self.request) { (ResultCode) in

            print("Prebid demand fetch for DFP \(ResultCode)")
            self.dfpInterstitial!.load(self.request)
        }
    }
```

**Objective-C**

```
-(void) loadDFPInterstitial {

    self.interstitialUnit = [[InterstitialAdUnit alloc] initWithConfigId:@"625c6125-f19e-4d5b-95c5-55501526b2a4" minWidthPerc:50 minHeightPerc:70];
    self.dfpInterstitial = [[DFPInterstitial alloc] initWithAdUnitID:@"/19968336/PrebidMobileValidator_Interstitial"];
    self.dfpInterstitial.delegate = self;
    self.request = [[DFPRequest alloc] init];
    self.request.testDevices = @[kDFPSimulatorID];
    [self.interstitialUnit fetchDemandWithAdObject:self.request completion:^(enum ResultCode result) {
        NSLog(@"Prebid demand result %ld", (long)result);
        [self.dfpInterstitial loadRequest:self.request];
    }];
}
```
---
**MoPub**

**Swift**


```
    func loadMoPubInterstitial(adUnit: AdUnit){

        let interstitialUnit = InterstitialAdUnit(configId: "625c6125-f19e-4d5b-95c5-55501526b2a4")

        let sdkConfig = MPMoPubConfiguration(adUnitIdForAppInitialization: "2829868d308643edbec0795977f17437")
        sdkConfig.globalMediationSettings = []

        MoPub.sharedInstance().initializeSdk(with: sdkConfig) {

        }

        self.mopubInterstitial = MPInterstitialAdController(forAdUnitId: "2829868d308643edbec0795977f17437")
        self.mopubInterstitial.delegate = self

        // Do any additional setup after loading the view, typically from a nib.
        interstitialUnit.fetchDemand(adObject: mopubInterstitial!){ (ResultCode) in
            print("Prebid demand fetch for mopub \(ResultCode)")

            self.mopubInterstitial.loadAd()
        }

    }
```

**Objective-C**

```
-(void) loadMoPubInterstitial {

    self.interstitialUnit = [[InterstitialAdUnit alloc] initWithConfigId:@"625c6125-f19e-4d5b-95c5-55501526b2a4"];
    MPMoPubConfiguration *configuration = [[MPMoPubConfiguration alloc] initWithAdUnitIdForAppInitialization:@"2829868d308643edbec0795977f17437"];
    [[MoPub sharedInstance] initializeSdkWithConfiguration:configuration completion:nil];
    self.mopubInterstitial = [MPInterstitialAdController interstitialAdControllerForAdUnitId:@"2829868d308643edbec0795977f17437"];
    self.mopubInterstitial.delegate = self;
    [self.interstitialUnit fetchDemandWithAdObject:self.mopubInterstitial completion:^(enum ResultCode result) {
        NSLog(@"Prebid demand result %ld", (long)result);
        [self.mopubInterstitial loadAd];
    }];


}
```
## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
