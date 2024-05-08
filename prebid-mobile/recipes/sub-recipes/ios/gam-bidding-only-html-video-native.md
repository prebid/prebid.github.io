---

layout: page_v2
title: Multiformat (HTML + Video + Native) - GAM Bidding Only
description: 
sidebarType: 2

---

# Multiformat (HTML + Video + Native)

Starting with version `2.1.5` Prebid SDK supports the multiformat ad unit. It allows you to run bid requests with any combination of `banner`, `video`, and `native` formats.

The following code demonstrates the integration of the multiformat ad unit.

``` swift
func createAd() {
    // 1. Setup a PrebidAdUnit
    adUnit = PrebidAdUnit(configId: configId)
    adUnit.setAutoRefreshMillis(time: 30_000)

    // 2. Setup the parameters
    let bannerParameters = BannerParameters()
    bannerParameters.api = [Signals.Api.MRAID_2]
    bannerParameters.adSizes = [adSize]

    let videoParameters = VideoParameters(mimes: ["video/mp4"])
    videoParameters.protocols = [Signals.Protocols.VAST_2_0]
    videoParameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
    videoParameters.placement = Signals.Placement.InBanner
    videoParameters.adSize = adSize

    let nativeParameters = NativeParameters()
    nativeParameters.assets = nativeAssets
    nativeParameters.context = ContextType.Social
    nativeParameters.placementType = PlacementType.FeedContent
    nativeParameters.contextSubType = ContextSubType.Social
    nativeParameters.eventtrackers = eventTrackers

    // 3. Configure the PrebidRequest
    let prebidRequest = PrebidRequest(bannerParameters: bannerParameters, videoParameters: videoParameters, nativeParameters: nativeParameters)

    // 4. Make a bid request
    let gamRequest = GAMRequest()
    adUnit.fetchDemand(adObject: gamRequest, request: prebidRequest) { [weak self] _ in
        guard let self = self else { return }

        // 5. Configure and make a GAM ad request
        self.adLoader = GADAdLoader(adUnitID: gamRenderingMultiformatAdUnitId, rootViewController: self,
                                    adTypes: [GADAdLoaderAdType.customNative, GADAdLoaderAdType.gamBanner], options: [])
        self.adLoader.delegate = self
        self.adLoader.load(gamRequest)
    }
}
```

To handle the banner, video and in-banner native (Native Styles) ads:

``` swift
func adLoader(_ adLoader: GADAdLoader, didReceive bannerView: GAMBannerView) {
    self.bannerView.isHidden = false
    self.nativeView.isHidden = true
    self.bannerView.backgroundColor = .clear
    self.bannerView.addSubview(bannerView)

    AdViewUtils.findPrebidCreativeSize(bannerView, success: { [weak self] size in
        bannerView.resize(GADAdSizeFromCGSize(size))

        self?.bannerView.constraints.first { $0.firstAttribute == .width }?.constant = size.width
        self?.bannerView.constraints.first { $0.firstAttribute == .height }?.constant = size.height
    }, failure: { (error) in
        PrebidDemoLogger.shared.error("Error occuring during searching for Prebid creative size: \(error)")
    })
}
```

If you use Custom Native Ads follow the [guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/native-banner) on how to implement processing of the ad response of the respective type. To handle the wining native ad:

``` swift
// MARK: - NativeAdDelegate

func nativeAdLoaded(ad: NativeAd) {
    nativeView.isHidden = false
    bannerView.isHidden = true

    nativeAd = ad
    titleLabel.text = ad.title
    bodyLabel.text = ad.text

    if let iconString = ad.iconUrl {
        ImageHelper.downloadImageAsync(iconString) { result in
            if case let .success(icon) = result {
                DispatchQueue.main.async {
                    self.iconView.image = icon
                }
            }
        }
    }

    if let imageString = ad.imageUrl {
        ImageHelper.downloadImageAsync(imageString) { result in
            if case let .success(image) = result {
                DispatchQueue.main.async {
                    self.mainImageView.image = image
                }
            }
        }
    }

    callToActionButton.setTitle(ad.callToAction, for: .normal)
    sponsoredLabel.text = ad.sponsoredBy

    nativeAd.registerView(view: view, clickableViews: [callToActionButton])
}
```

### Step 1: Create a PrebidAdUnit
{:.no_toc}

Initialize the `PrebidAdUnit` with the following properties:

* `configId` - an ID of the Stored Impression on the Prebid Server

### Step 2: Setup the parameters
{:.no_toc}

For each intersted ad format you should creatae a respective configuration parameter:

* [BannerParameters](#step-2-configure-banner-parameters) object.
* [VideoParameters](#step-3-configure-the-video-parameters) object.
* [NativeParameters](#nativeparameters) object

#### NativeParameters
{:.no_toc}

Using the `NativeParameters` you can customize the bid request for video ads.

##### assets
{:.no_toc}

The array of requested asset objects. Prebid SDK supports all kinds of assets according to the [IAB spec](https://iabtechlab.com/wp-content/uploads/2016/07/OpenRTB-Native-Ads-Specification-Final-1.2.pdf)  except `video`.

##### eventtrackers
{:.no_toc}

The array of requested native trackers. Prebid SDK supports inly `image` trackers according to the [IAB spec](https://iabtechlab.com/wp-content/uploads/2016/07/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

##### version
{:.no_toc}

Version of the Native Markup version in use. The default value is `1.2`

##### context
{:.no_toc}

The context in which the ad appears.

##### contextSubType
{:.no_toc}

A more detailed context in which the ad appears.

##### placementType
{:.no_toc}

The design/format/layout of the ad unit being offered.

##### placementCount
{:.no_toc}

The number of identical placements in this Layout.

##### sequence
{:.no_toc}

0 for the first ad, 1 for the second ad, and so on.

##### asseturlsupport
{:.no_toc}

Whether the supply source/impression supports returning an assetsurl instead of an asset object. 0 or the absence of the field indicates no such support.

##### durlsupport
{:.no_toc}

Whether the supply source / impression supports returning a dco url instead of an asset object. 0 or the absence of the field indicates no such support.

##### privacy
{:.no_toc}

Set to 1 when the native ad supports buyer-specific privacy notice.  Set to 0 (or field absent) when the native ad doesn’t support custom privacy links or if support is unknown.

##### ext
{:.no_toc}

This object is a placeholder that may contain custom JSON agreed to by the parties to support flexibility beyond the standard defined in this specification

### Step 3: Create PrebidRequest
{:.no_toc}

Create the instance of `PrebidRequest` initializing it with respective ad format parameters.

In addition you can set the following properties of the `PrebidRequest`.

### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

### Step 5: Create a GAMBannerView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

### Step 6: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

### Step 7: Process the Ad Response
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it is a Prebid ad and resize the ad slot respectively to the creative's properties.