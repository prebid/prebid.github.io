---
layout: page_v2
title: BannerAdUnit AdUnit
description: BannerAdUnit AdUnit
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# BannerAdUnit: AdUnit
{: .notoc}

The BannerAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the BannerAdUnit object to create and configure a banner ad unit in your app.  

- TOC
 {:toc}

## Object

### BannerAdUnit

Create a new Banner Ad Unit associated with a Prebid Server configuration ID and a banner size.

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

**Parameters**

`configId (String)`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

`size (CGSize)`: Width and height of the banner.


#### Parameters


Parameters is a sub class of BannerAdUnit. Create a new Parameters class to define the parameters of the video ad unit. Parameters contain the OpenRTB video attributes.

`api: [int]`: OpenRTB placement

**Parameters**

Array of integers or a predefined constant representing the supported [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Frameworks. While OpenRTB allows additional API Frameworks, they were intentionally left out as constants since they do not make sense in a banner context. If there is a desire to pass API Frameworks that are not represented as a constants within Parameters, they can be passed an integer, where Prebid SDK will pass Prebid Server whatever is present:

* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1` :  signals OMSDK support


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
bannerUnit.addAdditionalSize(sizes: [CGSize(width: 320, height: 50), CGSize(width: 300, height: 250)])
```
Once a BannerAdUnit is created use Google Mobile Ads or MoPub to retrieve and display creatives.

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

Import the GoogleMobileAds from the [google-mobile-sdk](https://developers.google.com/admob/ios/download) into the UIViewController displaying the BannerAdUnit

**Swift**
```
func loadDFPBanner(bannerUnit : AdUnit){
        print("Google Mobile Ads SDK version: \(DFPRequest.sdkVersion())")
        dfpBanner = DFPBannerView(adSize: kGADAdSizeMediumRectangle)
        dfpBanner.adUnitID = "/19968336/PrebidMobileValidator_Banner_All_Sizes"
        dfpBanner.rootViewController = self
        dfpBanner.delegate = self
        dfpBanner.backgroundColor = .red
        appBannerView.addSubview(dfpBanner)
        request.testDevices = [ kGADSimulatorID,"cc7ca766f86b43ab6cdc92bed424069b"]

        bannerUnit.fetchDemand(adObject:self.request) { (ResultCode) in
            print("Prebid demand fetch for Google Ad Manager \(ResultCode.name())")
            self.dfpBanner!.load(self.request)
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


**MoPub**

Import MoPub from the [mopub-ios-sdk](https://github.com/mopub/mopub-ios-sdk) into the UIViewController displaying the BannerAdUnit

**Swift**
```
func loadMoPubBanner(bannerUnit: AdUnit){

        let sdkConfig = MPMoPubConfiguration(adUnitIdForAppInitialization: "a935eac11acd416f92640411234fbba6")
        sdkConfig.globalMediationSettings = []

        MoPub.sharedInstance().initializeSdk(with: sdkConfig) {

        }

        mopubBanner = MPAdView(adUnitId: "a935eac11acd416f92640411234fbba6", size: CGSize(width: 300, height: 250))
        mopubBanner!.delegate = self

        appBannerView.addSubview(mopubBanner!)

        // Do any additional setup after loading the view, typically from a nib.
        bannerUnit.fetchDemand(adObject: mopubBanner!){ (ResultCode) in
            print("Prebid demand fetch for mopub \(ResultCode)")

            self.mopubBanner!.loadAd()
        }

    }
```

**Objective-C**

```
-(void) loadMoPubBanner {

    MPMoPubConfiguration *configuration = [[MPMoPubConfiguration alloc] initWithAdUnitIdForAppInitialization:@"a935eac11acd416f92640411234fbba6"];

    [[MoPub sharedInstance] initializeSdkWithConfiguration:configuration completion:^{

    }];
    self.mopubAdView = [[MPAdView alloc] initWithAdUnitId:@"a935eac11acd416f92640411234fbba6" size:CGSizeMake(300, 250)];
    self.mopubAdView.delegate = self;

    [self.bannerView addSubview:self.mopubAdView];

    self.bannerUnit = [[BannerAdUnit alloc] initWithConfigId:@"6ace8c7d-88c0-4623-8117-75bc3f0a2e45" size:CGSizeMake(300, 250)];
    // Do any additional setup after loading the view, typically from a nib.
    [self.bannerUnit fetchDemandWithAdObject:self.mopubAdView completion:^(enum ResultCode result) {         
        NSLog(@"Prebid demand result %ld", (long)result);
        [self.mopubAdView loadAd];
    }];
}
```

## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
