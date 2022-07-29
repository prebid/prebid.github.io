---
layout: page_v2
title: Code Integration
description: Code Integration
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 2
---




# Code Integration for iOS

Get started with Prebid Mobile by creating a [Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html).

### Use Cocoapods?

Easily include the Prebid Mobile SDK for your primary ad server in your Podfile.

```
platform :ios, '8.0'

target 'MyAmazingApp' do
    pod 'PrebidMobile'
end
```

### Build framework from source

Build Prebid Mobile from source code. After cloning the repo, from the root directory run

```
./scripts/buildPrebidMobile.sh
```

to output the PrebidMobile.framework.




## Ad Unit Setup for iOS
{:.no_toc}

Register Prebid Mobile ad units as early as possible in the application's lifecycle.  

When registering a Prebid Mobile ad unit, you must replace `@"PREBID-MOBILE-SLOT-ID"` with a unique user-defined identifier.  Prebid Mobile will use this identifier to determine the unique ad unit to which bid key-values will be associated.  This identifier must be unique across all registered Prebid Mobile ad units, and does not need to map to any ad unit ID defined in your ad server.

We recommend doing this in the `didFinishLaunchingWithOptions` method in `AppDelegate` using the following steps, as shown in the code sample below:

1. Create the ad units and add sizes for banner ad units.  Be sure to replace `@"PREBID-MOBILE-SLOT-ID"` with a unique user-defined identifier.

   NOTE: The [fluid ad size](https://developers.google.com/mobile-ads-sdk/docs/dfp/ios/api/reference/Constants#/c:@kGADAdSizeFluid) (used in Google Ad Manager) is not supported.

2. Add a server-side configuration for each ad unit to Prebid Server Adapter.
3. Set targeting parameters for the ad units. (Optional)
4. Set the primary adserver for the bid to either Google Ad Manager or MoPub. (Primary ad server is necessary to determine the caching mechanism.)
5. Set the Prebid Server host to AppNexus or Rubicon.
6. Register the ad units with the adapter to start the bid fetching process.

### User-Replaced Macros

In the code snippets below, any values that must be substituted by your developers are identified in capital letters.  These values are defined below:

{: .table .table-bordered .table-striped }
| Value | Description |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PREBID-SERVER-ACCOUNT-ID` | Your unique account ID with your Prebid Server vendor.  |
| `PREBID-SERVER-CONFIGURATION-ID` | The ID of a Prebid Server demand partner configuration.  Represents the set of demand that will be fetched for a given ad unit. |


### Ad Unit Registration

Embed the ad unit registration in a try-catch block to catch all the exceptions (if any) thrown by the SDK.

#### Objective-C

ViewController.h
```
@interface ViewController : UIViewController

@property (nonatomic, strong) NSString *adServer;
@property (nonatomic, strong) NSString *adUnit;

@end
```
ViewController.m
```
@import PrebidMobile;
@import GoogleMobileAds;

@interface ViewController () <GADBannerViewDelegate,GADInterstitialDelegate,MPAdViewDelegate,MPInterstitialAdControllerDelegate>

    @property (weak, nonatomic) IBOutlet UIView *bannerView;
    @property (nonatomic, strong) DFPBannerView *dfpView;
    @property (nonatomic, strong) DFPInterstitial *dfpInterstitial;
    @property (nonatomic, strong) DFPRequest *request;
    @property (nonatomic, strong) MPAdView *mopubAdView;
    @property (nonatomic, strong) MPInterstitialAdController *mopubInterstitial;
    @property (nonatomic, strong) BannerAdUnit *bannerUnit;
    @property (nonatomic, strong) InterstitialAdUnit *interstitialUnit;

@end
...

Prebid.shared.prebidServerAccountId = @"PREBID-SERVER-ACCOUNT-ID";  
Prebid.shared.prebidServerHost = PrebidHostAppnexus  
Prebid.shared.shareGeoLocation = true;
```
Create the ad units and add sizes for banner ad units. Replace `PREBID-SERVER-CONFIGURATION-ID` with the ID of your Prebid Server demand partner configuration.

 ```
self.bannerUnit = [[BannerAdUnit alloc] initWithConfigId:@"PREBID-SERVER-CONFIGURATION-ID" size:CGSizeMake(300, 250)];
```
Set targeting parameters for the ad units (Optional).

 ```
[[Targeting sharedInstance] setAge:25];
[[Targeting sharedInstance] setGender:PBTargetingParamsGenderFemale];
```

 Register the ad units with Prebid Mobile to start bid fetching process.  

 If you are using a Prebid Server host other than AppNexus, be sure  to replace `PBServerHostAppNexus`.

 **Google Ad Manager Example**

```
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
```
**MoPub Example**

```
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
```



#### Swift
```
import PrebidMobile
import GoogleMobileAds
import MoPub

...

@IBOutlet var appBannerView: UIView!
@IBOutlet var adServerLabel: UILabel!

var adServerName:String = ""
let request = DFPRequest()
var dfpBanner: DFPBannerView!
var mopubBanner: MPAdView?
```
Create the ad units and add sizes for banner ad units.   Replace `PREBID-SERVER-CONFIGURATION-ID` with the ID of your Prebid Server demand partner configuration. Replace `PREBID-SERVER-ACCOUNT-ID` with your unique account ID with your Prebid Server vendor.

```
Prebid.shared.prebidServerAccountId = "`PREBID-SERVER-ACCOUNT-ID"
Prebid.shared.shareGeoLocation = true

let bannerUnit = BannerAdUnit(configId: "PREBID-SERVER-IMPLEVEL-STOREDREQUEST-ID", size: CGSize(width: 300, height: 250))
 bannerUnit.setAutoRefreshMillis(time: 35000)
```
**Google Ad Manager Example**  

```
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
```
**MoPub Example**  
```
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
```
Note that host should be the prebid server host you're using.

### Set Ad Server Targeting
{:.no_toc}

Prebid Mobile continuously pre-caches creatives in the background, so that right before the ad unit makes an ad request from your network, your app can ask Prebid Mobile for a bid price and creative without waiting as shown in the code below.

**Objective-C**
 ```
 [self.bannerAdUnit addUserKeyword:(NSString*)key:(NSString*)value];
```

**Swift**
```
self.bannerAdUnit.addUserKeyword(key: string, value: string)
```


Use the table below to see which ad objects are supported currently.

{: .table .table-bordered .table-striped }
| Primary Ad Server | Ad Object Type | Ad Server Ad View            | Ad Server Ad Load Method                    |
|-------------------|----------------|------------------------------|---------------------------------------------|
| Google Ad Manager               | Banner         | `DFPBannerView`              | `- (void)loadRequest:(GADRequest *)request` |
| Google Ad Manager               | Interstitial   | `DFPInterstitial`            | `- (void)loadRequest:(GADRequest *)request` |
| MoPub             | Banner         | `MPAdView`                   | `- (void)loadAd`                            |
| MoPub             | Interstitial   | `MPInterstitialAdController` |` - (void)loadAd`                            | -->

## Further Reading

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
