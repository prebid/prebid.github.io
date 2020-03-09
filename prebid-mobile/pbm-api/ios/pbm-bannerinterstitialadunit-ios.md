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

As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process. App developers can speicify a minimun width and minimum height percentage an ad can occupy of a devices real state, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.

PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size. If that size is 1x1, it will look up the device's size and use that as the max size. If the wdith and height are not present, it will also use the device size as the max size. (1x1 support so that you don't have to omit size as a parameter to use the device size).

PBS with interstitial support will come preconfigured with a list of common ad sizes, preferentially organized by weighing the larger and more common sizes first. No guarantees to the ordering will be made. PBS will generate a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

```
init(configId: String, minWidthPerc: Int, minHeightPerc: Int)
```

**Parameters**

`configId`: Prebid Server configuration ID.

`minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

`minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occuy of a device's real estate. Support in SDK version 1.2+


## Examples

**Create an InterstitialAdUnit**

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

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
