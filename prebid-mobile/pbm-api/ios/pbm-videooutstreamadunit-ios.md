---
layout: page_v2
title: VideoAdUnit AdUnit
description: VideoAdUnit AdUnit
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# VideoAdUnit: AdUnit
{: .notoc}

The VideoAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the VideoAdUnit object to create and configure a video outstream ad unit in your app.  '

- TOC
 {:toc}

## Object

### VideoAdUnit

Create a new Video Outstream Ad Unit associated with a Prebid Server configuration ID and a video size.

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

```VideoAdUnit(configId: String, size: CGSize(width: Int, height: Int), placement:Int)```

**Parameters**

`configId (String)`: Prebid Server configuration ID

`size (CGSize)`: Width and height of the video ad unit


#### CGSize

Size of video ad unit

**Parameters**

`width`: Width of video ad unit in DIPs

`height`: Height of video ad unit in DIPs

### videoAd

* Video event listeners

`videoAd (event: PBVideoAdEvent)`: event to listen to

**Parameters**

Events: one of the below event types
* AdLoadSuccess
* AdLoadFail
* AdClicked
* AdStarted
* AdDidReachEnd



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

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
