---

layout: page_v2
title: Multiformat (Banner + In-App Native) - GAM Bidding Only 
description: xxx
sidebarType: 2

---

# Multiformat (Banner + In-App Native)

A *multiformat* slot is able to display different ad formats. This scenario covers an adunit that can receive bids for both HTML Banner (WebView) and In-App Native (i.e. publisher-defined layout of native views like text, images, buttons). 

Different display mechanisms are used for these formats: 

- **banner** is rendered by the GMA SDK
- **native** is rendered in the publisher’s custom view

From the high level perspective the integration consists of three steps:

1. [Define the Native Ad Configuration](TBD) 
2. [Configure and perform the multiformat request](TBD)
3. [Manage the Ad Response](TBD)

The following sections describe these steps in details. 

#### Define the Native Ad Configuration

According to the [OpenRTB protocol](https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf) the native object in the Bid Request should contain request payload complying with the [Native Ad Specification v1.2](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). For this purpose, publishers should provide the set of native assets that confirms the ad’s layout in the app. 

{: .alert.alert-info :}
While the IAB Native spec v1.2 is the most recent, you may want to check with the rest of your tech stack for compatibility. Older versions are still in use by some bidders.

The Prebid SDK provides API classes to register needed native assets:    

```swift
private var nativeRequestAssets: [NativeAsset] {
    let title = NativeAssetTitle(length: 90, required: true)
    let body = NativeAssetData(type: DataAsset.description, required: true)
        
    let image = NativeAssetImage(minimumWidth: 120, minimumHeight: 100, required: true)
    image.type = ImageAsset.Main     
    let sponsored = NativeAssetData(type: DataAsset.sponsored, required: true)
        
    return [title, body, image, sponsored]
}

// optional
private var eventTrackers: [NativeEventTracker] {
        [NativeEventTracker(event: EventType.Impression, methods: [EventTracking.Image,EventTracking.js])]
}
```

#### Configure and perform the multiformat request

To integrate multiformat ads into the app you should use the `PrebidAdUnit` and `PrebidRequest` classes. They'll be used to make multiformat bid requests.

The following code snippets show the integration approach. The description for each integration step is provided after the code examples.

Integration example(Swift):

```swift
 func createAd() {
        // 1. Enable adding an id for each asset in the assets array (Prebid SDK)
        Prebid.shared.shouldAssignNativeAssetID = true
        
        // 2. Setup a PrebidAdUnit (Prebid SDK)
        adUnit = PrebidAdUnit(configId: CONFIG_ID)
        adUnit.setAutoRefreshMillis(time: 30000)
        
        // 3. Setup the parameters (Prebid SDK)
        let bannerParameters = BannerParameters()
        bannerParameters.api = [Signals.Api.MRAID_2, Signals.Api.OMID_1]
        bannerParameters.adSizes = [adSize]
        
        let nativeParameters = NativeParameters()
        nativeParameters.assets = nativeAssets
        nativeParameters.context = ContextType.Social
        nativeParameters.placementType = PlacementType.FeedContent
        nativeParameters.contextSubType = ContextSubType.Social
        nativeParameters.eventtrackers = eventTrackers
        
        // 4. Configure the PrebidRequest (Prebid SDK)
        let prebidRequest = PrebidRequest(bannerParameters: bannerParameters, nativeParameters: nativeParameters)
        
        // 5. Make the bid request (Prebid SDK)
        let gamRequest = GAMRequest()
        adUnit.fetchDemand(adObject: gamRequest, request: prebidRequest) { [weak self] bidInfo in
            guard let self = self else { return }
            // 6. Configure and make a GAM ad request (Google Mobile Ads SDK)
            self.adLoader = GADAdLoader(adUnitID: AD_UNIT_ID, rootViewController: self, adTypes: [.customNative, .gamBanner], options: [])
            self.adLoader?.delegate = self
            self.adLoader?.load(gamRequest)
        }
    }
```

##### Step 1: Enable adding an id for each asset in the assets array

Set the `Prebid.shared.shouldAssignNativeAssetID` to `true`. This will cause SDK to add IDs for each registered native asset.

##### Step 2: Setup a PrebidAdUnit 

Initialize the `PrebidAdUnit` with the following properties:

- **configId** - an ID of the Ad Unit Level Stored Request in Prebid Server

##### Step 3: Setup the parameters 

Next, for each ad format you set the respective configuration parameters:

- [BannerParameters](TBD)
- [VideoParameters](TBD)
- [NativeParameters](TBD)

Using the `NativeParameters` you can customize the bid request for native ads:

- **assets:** the array of requested asset objects. Prebid SDK supports all kinds of assets according to the IAB spec except video;
- **eventtrackers:** the array of requested native trackers. Prebid SDK supports only image trackers according to the [IAB spec](https://iabtechlab.com/wp-content/uploads/2016/07/OpenRTB-Native-Ads-Specification-Final-1.2.pdf);
- **version:** version of the Native Markup version in use. The default value is 1.2;
- **context:** the context in which the ad appears;
- **contextSubType:** a more detailed context in which the ad appears;
- **placementType:** the design/format/layout of the ad unit being offered;
- **placementCount:** the number of identical placements in this layout;
- **sequence:** 0 for the first ad, 1 for the second ad, and so on;
- **asseturlsupport:** whether the supply source/impression supports returning an assetsurl instead of an asset object. 0 or the absence of the field indicates no such support;
- **durlsupport:** whether the supply source / impression supports returning a dco url instead of an asset object. 0 or the absence of the field indicates no such support;
- **privacy:** set to 1 when the native ad supports buyer-specific privacy notice. Set to 0 (or field absent) when the native ad doesn’t support custom privacy links or if support is unknown;
- **ext:** this object is a placeholder that may contain custom JSON agreed to by the parties to support flexibility beyond the standard defined in this specification.

##### Step 4: Configure the PrebidRequest 

Create the instance of `PrebidRequest` initializing it with all needed ad format parameters.

##### Step 5: Make the bid request 

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

##### Step 6: Configure and make a GAM ad request 

Finally it's time to request the ad from GAM. If the a Prebid line item is triggered, the GMA SDK will render the creative.

See the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/native-banner) for more information on how to integrate multiformat ads. 

#### Manage the Ad Response 

The ad response from GAM can be an HTML banner or a Native creative. To render these scenarios, app developers should implement the respective routines:

- Banner: GAMBannerAdLoaderDelegate to properly manage the ad view size for the Prebid ad.
- Native: GADCustomNativeAdLoaderDelegate and NativeDelegate to extract the Prebid native ad creative from the local cache and provide the app’s code with the assets’ content to render.

(TBD - we need a description of how these actually work at runtime... who calls what?)

The following code snippets illustrate the approach.

Implement GAMBannerAdLoaderDelegate

```swift
// This function is used to specify the valid banner sizes for the ad loader (Google Mobile Ads SDK)
func validBannerSizes(for adLoader: GADAdLoader) -> [NSValue] {
   return [NSValueFromGADAdSize(GADAdSizeFromCGSize(adSize))]
}
    
func adLoader(_ adLoader: GADAdLoader, didFailToReceiveAdWithError error: Error) {
   DemoLogger.shared.error("GAM did fail to receive ad with error: \(error)")
}
    
func adLoader(_ adLoader: GADAdLoader, didReceive bannerView: GAMBannerView) {
    self.bannerView.isHidden = false
    self.nativeView.isHidden = true
        
    gamBanner?.removeFromSuperview()
    self.gamBanner = bannerView   
    self.bannerView.addSubview(bannerView)
        
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { [weak self] size in
       bannerView.resize(GADAdSizeFromCGSize(size))
       self?.bannerView.constraints.first { $0.firstAttribute == .width }?.constant = size.width
       self?.bannerView.constraints.first { $0.firstAttribute == .height }?.constant = size.height
    }, failure: { _ in })
}
```

Implement GADCustomNativeAdLoaderDelegate:

```swift
func customNativeAdFormatIDs(for adLoader: GADAdLoader) -> [String] {
    [DM_AD_FORMAT_ID]
}
    
func adLoader(_ adLoader: GADAdLoader, didReceive customNativeAd: GADCustomNativeAd) {
     gamBanner?.removeFromSuperview()
        
     Utils.shared.delegate = self
     Utils.shared.findNative(adObject: customNativeAd)
}
```

Implement Prebid’s protocol NativeAdDelegate

```swift
func nativeAdLoaded(ad: NativeAd) {
     nativeAd = ad
     titleLabel.text = ad.title
     bodyLabel.text = ad.text
        
     if let imageString = ad.imageUrl {
         ImageHelper.downloadImageAsync(imageString) { result in
             if case let .success(image) = result {
                 DispatchQueue.main.async {
                     self.mainImageView.image = image
                 }
             }
          }
      }
        
     sponsoredLabel.text = ad.sponsoredBy

     nativeAd.registerView(view: view, clickableViews: [mainImageView])
}

func nativeAdNotFound() {
    PrebidDemoLogger.shared.error("Native ad not found")
}

func nativeAdNotValid() {
    PrebidDemoLogger.shared.error("Native ad not valid")
}
```