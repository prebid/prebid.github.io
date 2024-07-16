---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Multiformat Banner+Video+InAppNative
description: iOS GAM Bidding-Only Integration - Multiformat Banner+Video+InAppNative
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Multiformat Banner+Video+InAppNative

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Starting with version `2.1.5` Prebid SDK supports the fully multiformat ad unit. It allows to run bid requests with any combination of `banner`, `video`, and `native` formats.

The following code demonstrates the integration of multiformat ad unit.

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

## Step 1: Create a PrebidAdUnit
{:.no_toc}

Initialize the `PrebidAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server

## Step 2: Setup the parameters
{:.no_toc}

For each ad format you should create a respective configuration parameter:

### BannerParameters
{:.no_toc}

{% include mobile/banner-params.md %}

### VideoParameters
{:.no_toc}

{% include mobile/video-params.md %}

### NativeParameters
{:.no_toc}

{% include mobile/native-params.md %}

## Step 3: Create PrebidRequest
{:.no_toc}

Create the instance of `PrebidRequest` initializing it with respective ad format parameters.

In addition you can set the following properties of the `PrebidRequest`.

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 5: Create a GAMBannerView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

## Step 6: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Step 7: Process the Ad Response
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it is a Prebid ad and resize the ad slot respectively to the creative's properties.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
