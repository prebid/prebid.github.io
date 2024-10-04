---
layout: page_v2
title: Prebid Mobile - GAM with Original API
description: Overview of Prebid Mobile API for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid Mobile with GAM (Original API)
{:.no_toc}

Prebid Mobile is an open-source library that provides an end-to-end header bidding solution for mobile app publishers.

- TOC
{:toc}

## Overview

This is the original Prebid mobile integration approach when SDK plays the transport role, and the winning bid is rendered by the Primary Ad Server SDK using PUC. You can find details of how it works and other integration approaches on the [overview page](/prebid-mobile/prebid-mobile.html#with-ad-server-original-api).

![In-App Bidding with Prebid](/assets/images/prebid-mobile/prebid-in-app-bidding-overview-prebid-original-gam.png)

## Banner API

Starting with Prebid Mobile `2.1.0` you can use `BannerAdUnit` to bid over the banner and/or video demand. The default ad format is `BANNER`. To customize the bidding format, specify the ad formats in the `BannerAdUnit` constructor.

### HTML Banner

Integration example:

```kotlin
private fun createAd() {

    // 1. Create BannerAdUnit
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT)
    adUnit?.setAutoRefreshInterval(refreshTimeSeconds)

    // 2. Configure banner parameters
    val parameters = BannerParameters()
    parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)
    adUnit.bannerParameters = parameters

    // 3. Create AdManagerAdView
    val adView = AdManagerAdView(this)
    adView.adUnitId = AD_UNIT_ID
    adView.setAdSizes(AdSize(WIDTH, HEIGHT))
    adView.adListener = createGAMListener(adView)

    // Add GMA SDK banner view to the app UI
    adWrapperView.addView(adView)

    // 4. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 5. Load GAM Ad
        adView.loadAd(request)
    }
}
```

GAM ad view listener:

```kotlin
private fun createGAMListener(adView: AdManagerAdView): AdListener {
    return object : AdListener() {
        override fun onAdLoaded() {
            super.onAdLoaded()

            // 6. Resize ad view if needed
            AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
                override fun success(width: Int, height: Int) {
                    adView.setAdSizes(AdSize(width, height))
                }

                override fun failure(error: PbFindSizeError) {}
            })
        }
    }
}
```

#### Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `width` - the width of the ad unit which will be used in the bid request.
- `height` - the height of the ad unit which will be used in the bid request.

#### Step 2: Configure banner parameters
{:.no_toc}

Using the `BannerParameters()` you can customize the bid request for BannerAdUnit.

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `BannerBaseAdUnit.Parameters` class is deprecated. Use `BannerParameters` instead.

The `api` property is dedicated to adding values for API Frameworks to a bid response according to the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

- `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
- `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
- `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
- `7` or `Signals.Api.OMID_1` :  signals OMSDK support

#### Step 3: Create an AdManagerAdView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner) to integrate a banner ad unit.

#### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 5: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain the targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 6: Adjust the ad view size
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it's Prebid's ad and resize the ad slot respectively to the creative's properties.

### Video Banner (Outstream Video)

Integration example:

```kotlin
private fun createAd() {
    // 1. Create VideoAdUnit
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT, EnumSet.of(AdUnitFormat.VIDEO))

    // 2. Configure video ad unit
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Create AdManagerAdView
    val gamView = AdManagerAdView(this)
    gamView.adUnitId = AD_UNIT_ID
    gamView.setAdSizes(AdSize(WIDTH, HEIGHT))
    gamView.adListener = createListener(gamView)

    adWrapperView.addView(gamView)

    // 4. Make an ad request
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {
        gamView.loadAd(request)
    }
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoAdUnit` class is deprecated. Use `BannerAdUnit` class with video ad format instead.

Configure Video parameters:

```kotlin
private fun configureVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/x-flv", "video/mp4")).apply {
        api = listOf(
            Signals.Api.VPAID_1,
            Signals.Api.VPAID_2
        )

        maxBitrate = 1500
        minBitrate = 300
        maxDuration = 30
        minDuration = 5
        playbackMethod = listOf(Signals.PlaybackMethod.AutoPlaySoundOn)
        protocols = listOf(
            Signals.Protocols.VAST_2_0
        )
    }
}
```

Setup ad listener:

```kotlin
private fun createListener(gamView: AdManagerAdView): AdListener {
    return object : AdListener() {
        override fun onAdLoaded() {
            AdViewUtils.findPrebidCreativeSize(gamView, object : PbFindSizeListener {
                override fun success(width: Int, height: Int) {
                    gamView.setAdSizes(AdSize(width, height))
                }

                override fun failure(error: PbFindSizeError) {}
            })
        }
    }
}
```

#### Step 1: Create a BannerAdUnit with the video ad type
{:.no_toc}

Initialize the `BannerAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `adSize` - the size of the ad unit which will be used in the bid request.
- `adUnitFormats` - `AdUnitFormat.VIDEO` for a video ad

#### Step 2: Configure video parameters
{:.no_toc}

Using the `VideoParameters` you can customize the bid request for a `BannerAdUnit`.

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoBaseAdUnit.Parameters` class is deprecated. Use `VideoParameters` instead.

#### placement
{:.no_toc}

[OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Placement Type for the auction can be expressed as an integer array or can use an enum for easier readability. Option 1 (in-stream) is intentionally left out due to lack of in-stream support in Prebid SDK.

In the context of a VideoInterstitialAdUnit, rewarded video ads are typically labeled as interstitial. As such, Prebid SDK will default to value 5 if no placement value is supplied.

- `2` or `InBanner` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
- `3` or `InArticle` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
- `4` or `InFeed` : In-Feed placement is found in content, social, or product feeds.
- `5` or `Slider`, `Floating` or `Interstitial` : Open RTB supports one of three values for option 5 as either Slider, Floating or Interstitial. If an enum value is supplied in placement, bidders will receive value 5 for placement type and assume to be interstitial with the instl flag set to 1.

#### api
{:.no_toc}

The `api` property is dedicated to adding values for API Frameworks to a bid response according to the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

- `1` or `Signals.Api.VPAID_1` : VPAID 1.0
- `2` or `Signals.Api.VPAID_2` : VPAID 2.0
- `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
- `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
- `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
- `7` or `Signals.Api.OMID_1`  : signals OMSDK support

#### maxBitrate
{:.no_toc}

Integer representing the OpenRTB 2.5 maximum bit rate in Kbps.

#### minBitrate
{:.no_toc}

Integer representing the OpenRTB 2.5 minimum bit rate in Kbps.

#### maxDuration
{:.no_toc}

Integer representing the OpenRTB 2.5 maximum video ad duration in seconds.

#### minDuration
{:.no_toc}

Integer representing the OpenRTB 2.5 minimum video ad duration in seconds.

#### mimes
{:.no_toc}

Array of strings representing the supported OpenRTB 2.5 content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).

#### playbackMethod
{:.no_toc}

Array of OpenRTB 2.5 playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is strongly advised to use only the first element of the array.

- `1` or `Signals.PlaybackMethod.AutoPlaySoundOn` : Initiates on Page Load with Sound On
- `2` or `Signals.PlaybackMethod.AutoPlaySoundOff` : Initiates on Page Load with Sound Off by Default
- `3` or `Signals.PlaybackMethod.ClickToPlay` : Initiates on Click with Sound On
- `4` or `Signals.PlaybackMethod.MouseOver` : Initiates on Mouse-Over with Sound On
- `5` or `Signals.PlaybackMethod.EnterSoundOn` : Initiates on Entering Viewport with Sound On
- `6` or `Signals.PlaybackMethod.EnterSoundOff`: Initiates on Entering Viewport with Sound Off by Default

#### protocols
{:.no_toc}

Array or enum of OpenRTB 2.5 supported Protocols. Values can be one of:

- `1` or `Signals.Protocols.VAST_1_0` : VAST 1.0
- `2` or `Signals.Protocols.VAST_2_0` : VAST 2.0
- `3` or `Signals.Protocols.VAST_3_0` : VAST 3.0
- `4` or `Signals.Protocols.VAST_1_0_Wrapper` : VAST 1.0 Wrapper
- `5` or `Signals.Protocols.VAST_2_0_Wrapper` : VAST 2.0 Wrapper
- `6` or `Signals.Protocols.VAST_3_0_Wrapper` : VAST 3.0 Wrapper
- `7` or `Signals.Protocols.VAST_4_0` : VAST 4.0
- `8` or `Signals.Protocols.VAST_4_0_Wrapper` : VAST 4.0 Wrapper

#### Step 3: Create an AdManagerAdView
{:.no_toc}

Just follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner) to integrate a banner ad unit.

#### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 5: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

### Multiformat Banner (HTML + Video)

Integration example:

```kotlin
// 1. Create BannerAdUnit
adUnit = BannerAdUnit(configId, WIDTH, HEIGHT, EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO))
adUnit?.setAutoRefreshInterval(refreshTimeSeconds)

// 2. Configure banner and video parameters
val parameters = BannerParameters()
parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)
adUnit?.bannerParameters = parameters

adUnit?.videoParameters = VideoParameters(listOf("video/mp4"))

// 3. Create AdManagerAdView
val adView = AdManagerAdView(this)
adView.adUnitId = AD_UNIT_ID
adView.setAdSizes(AdSize(WIDTH, HEIGHT))
adView.adListener = createGAMListener(adView)

// Add GMA SDK banner view to the app UI
adWrapperView.addView(adView)

// 4. Make a bid request to Prebid Server
val request = AdManagerAdRequest.Builder().build()
adUnit?.fetchDemand(request) {

    // 5. Load GAM Ad
    adView.loadAd(request)
}
```

#### Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `width` - the width of the ad unit which will be used in the bid request.
- `height` - the height of the ad unit which will be used in the bid request.
- `adUnitFormats` - ad unit formats for the current ad unit.

#### Step 2-5
{:.no_toc}

Steps 2-5 are the same as for Display Banner. Setting up banner and video parameters can be found in Display Banner and Video Banner respectively.

## Interstitial API

Starting with Prebid Mobile `2.1.0` you can use `InterstitialAdUnit` to bid over the banner and/or video demand. The default ad format is `BANNER`. To customize the bidding format, specify the ad formats in the `InterstitialAdUnit` constructor.

### HTML Interstitial

Integration example:

```kotlin
private fun createAd() {
    // 1. Create InterstitialAdUnit
    adUnit = InterstitialAdUnit(CONFIG_ID, 80, 60)

    // 2. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 3. Load a GAM interstitial ad
        AdManagerInterstitialAd.load(
                this,
                AD_UNIT_ID,
                request,
                createListner())
    }
}
```

You also need to implement `AdManagerInterstitialAdLoadCallback` in order to track the ad rediness:

```kotlin
private fun createListner(): AdManagerInterstitialAdLoadCallback {
    return object : AdManagerInterstitialAdLoadCallback() {

        override fun onAdLoaded(adManagerInterstitialAd: AdManagerInterstitialAd) {
            super.onAdLoaded(adManagerInterstitialAd)

            // 4.  Present the interstitial ad
            adManagerInterstitialAd.show(this@GamOriginalApiDisplayInterstitialActivity)
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
            super.onAdFailedToLoad(loadAdError)
            Log.e("GAM", "Ad failed to load: $loadAdError")
        }
    }
}
```

#### Step 1: Create an InterstitialAdUnit
{:.no_toc}

Initialize the Interstitial Ad Unit with properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occupy of a device's screen. Support in SDK version 1.2+
- `minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occupy of a device's screen. Support in SDK version 1.2+

> **NOTE:** As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process to monetize sizes smaller than full screen ads. App developers can specify a minimum width and minimum height percentage an ad can occupy of a devices screen, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.
>
> PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.
>
> Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

#### Step 2: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 3: Load a GAM interstitial ad
{:.no_toc}

You should now request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 4: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

### Video Interstitial

Integration Example:

```kotlin
private fun createAd() {

    // 1. Create InterstitialAdUnit
    adUnit = InterstitialAdUnit(CONFIG_ID, EnumSet.of(AdUnitFormat.VIDEO))

    // 2. Configure video ad unit
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 4. Load a GAM ad
        AdManagerInterstitialAd.load(
            this@GamOriginalApiVideoInterstitialActivity,
            AD_UNIT_ID,
            request,
            createAdListener()
        )
    }
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoInterstitialAdUnit` class is deprecated. Use `InterstitialAdUnit` class with video ad format instead.

Configuration function:

```kotlin
private fun configureVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/x-flv", "video/mp4")).apply {
        placement = Signals.Placement.Interstitial

        api = listOf(
            Signals.Api.VPAID_1,
            Signals.Api.VPAID_2
        )

        maxBitrate = 1500
        minBitrate = 300
        maxDuration = 30
        minDuration = 5
        playbackMethod = listOf(Signals.PlaybackMethod.AutoPlaySoundOn)
        protocols = listOf(
            Signals.Protocols.VAST_2_0
        )
    }
}
```

GAM Ad Listener:

```kotlin
private fun createAdListener(): AdManagerInterstitialAdLoadCallback {
    return object : AdManagerInterstitialAdLoadCallback() {
        override fun onAdLoaded(interstitialAd: AdManagerInterstitialAd) {
            super.onAdLoaded(interstitialAd)

            // 5. Display an interstitial ad
            interstitialAd.show(this@GamOriginalApiVideoInterstitialActivity)
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
            super.onAdFailedToLoad(loadAdError)
            Log.e("GAM", "Ad failed to load: $loadAdError")
        }
    }
}
```

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit` with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `adUnitFormats` - AdUnitFormat.VIDEO for a video ad

#### Step 2: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-2-configure-video-parameters) object.

#### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 4: Load a GAM interstitial ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 5: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

### Multiformat Interstitial (HTML + Video)

Integration example:

```kotlin
// 1. Create InterstitialAdUnit
adUnit = InterstitialAdUnit(configId, EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO))
adUnit?.setMinSizePercentage(80, 60)
adUnit?.videoParameters = VideoParameters(listOf("video/mp4"))

// 2. Make a bid request to Prebid Server
val request = AdManagerAdRequest.Builder().build()
adUnit?.fetchDemand(request) {

    // 3. Load a GAM interstitial ad
    AdManagerInterstitialAd.load(
        this,
        AD_UNIT_ID,
        request,
        createListener()
    )
}
```

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit` with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `adUnitFormats` - ad unit formats for the current ad unit.

#### Steps 2-3
{:.no_toc}

Steps 2-3 are the same as for Display Banner. Setting up banner and video parameters can be found in Display Interstitial and Video Interstitial respectively.

## Rewarded Video API

Integration example:

```kotlin
private fun createAd() {
    // 1. Create RewardedVideoAdUnit
    adUnit = RewardedVideoAdUnit(CONFIG_ID)

    // 2. Configure Video parameters
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 4. Load a GAM Rewarded Ad
        RewardedAd.load(
            this,
            AD_UNIT_ID,
            request,
            createListener()
        )
    }
}
```

Configure video ad unit:

```kotlin
private fun configureVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/mp4")).apply {
        protocols = listOf(Signals.Protocols.VAST_2_0)
        playbackMethod = listOf(Signals.PlaybackMethod.AutoPlaySoundOff)
    }
}
```

Implement Rewarded ad listener:

```kotlin
private fun createListener(): RewardedAdLoadCallback {
    return object : RewardedAdLoadCallback() {
        override fun onAdLoaded(rewardedAd: RewardedAd) {

            // 5. Display rewarded ad
            rewardedAd.show(
                this@GamOriginalApiVideoRewardedActivity
            ) { }
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
            Log.e("GAM", "Ad failed to load: $loadAdError")
        }
    }
}
```

### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the Rewarded Video Ad Unit with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server

### Step 2: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-2-configure-video-parameters) object.

### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

### Step 4: Load a GAM Rewarded Ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

### Step 5: Present the Rewarded Ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/rewarded#show_the_ad) to display a rewarded ad right after receiving it or later in a natural pauses in the flow of an app.

## Instream Video API

Integration example:

```kotlin
private fun createAd() {
    // 1. Create VideoAdUnit
    adUnit = InStreamVideoAdUnit(CONFIG_ID, WIDTH, HEIGHT)

    // 2. Configure video parameters
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Init player view
    playerView = PlayerView(this)
    val params = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 600)
    adWrapperView.addView(playerView, params)

    // 4. Make a bid request to Prebid Server
    adUnit?.fetchDemand { _: ResultCode?, keysMap: Map<String?, String?>? ->

        // 5. Prepare the creative URI
        val sizes = HashSet<AdSize>()
        sizes.add(AdSize(WIDTH, HEIGHT))
        val prebidURL =  Util.generateInstreamUriForGam(
            AD_UNIT_ID,
            sizes,
            keysMap
        )

        adsUri = Uri.parse(prebidURL)

        // 6. Init player
        initializePlayer()
    }
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoAdUnit` class is deprecated. Use `InStreamVideoAdUnit` instead.

Configure the video ad:

```kotlin
private fun configureVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/x-flv", "video/mp4")).apply {
        placement = Signals.Placement.InStream

        api = listOf(
            Signals.Api.VPAID_1,
            Signals.Api.VPAID_2
        )

        maxBitrate = 1500
        minBitrate = 300
        maxDuration = 30
        minDuration = 5
        playbackMethod = listOf(Signals.PlaybackMethod.AutoPlaySoundOn)
        protocols = listOf(
            Signals.Protocols.VAST_2_0
        )
    }
}
```

Init and run IMA player:

```kotlin
private fun initializePlayer() {

    adsLoader = ImaAdsLoader.Builder(this).build()

    val playerBuilder = SimpleExoPlayer.Builder(this)
    player = playerBuilder.build()
    playerView!!.player = player
    adsLoader!!.setPlayer(player)

    val uri = Uri.parse("https://storage.googleapis.com/gvabox/media/samples/stock.mp4")

    val mediaItem = MediaItem.fromUri(uri)
    val dataSourceFactory: DataSource.Factory = DefaultDataSourceFactory(this, getString(R.string.app_name))
    val mediaSourceFactory = ProgressiveMediaSource.Factory(dataSourceFactory)
    val mediaSource: MediaSource = mediaSourceFactory.createMediaSource(mediaItem)
    val dataSpec = DataSpec(adsUri!!)
    val adsMediaSource = AdsMediaSource(
        mediaSource, dataSpec, "ad", mediaSourceFactory,
        adsLoader!!, playerView!!
    )
    player?.setMediaSource(adsMediaSource)
    player?.playWhenReady = true
    player?.prepare()
}
```

### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the VideoAdUnit with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `width` - Width of the video ad unit.
- `height` - Height of the video ad unit

### Step 2: Configure the video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-2-configure-video-parameters) object.

### Step 3: Prepare the Player
{:.no_toc}

Create the instance of `PlayerView` and display it in the app UI.

### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. Use the methods which return the targeting map in the result closure.

### Step 5: Generate GAM Instream URI
{:.no_toc}

Using Prebid util method, generate Google IMA URI for downloading the cached creative from the winning bid.

### Step 6: Cretae and init IMA player
{:.no_toc}

Follow the Google Guide for [integrating IMA with ExoPlayer](https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/exoplayer-extension) to run a video and show instream ad from the winning bid.

## Native API

### Native Banner

Integration example:

```kotlin
private fun createAd() {
    // 1. Create Ad unit
    nativeAdUnit = NativeAdUnit(CONFIG_ID)
    nativeAdUnit?.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
    nativeAdUnit?.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
    nativeAdUnit?.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)

    // 2. Configure Native Assets and Trackers
    addNativeAssets(nativeAdUnit)

    // 3. Create GAM Ad View
    val gamView = AdManagerAdView(this)
    gamView.adUnitId = AD_UNIT_ID
    gamView.setAdSizes(AdSize.FLUID)
    adWrapperView.addView(gamView)

    // 4. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    nativeAdUnit?.fetchDemand(request) {

        // 5. Load a GAM Ad
        gamView.loadAd(request)
    }
}
```

Add native assets:

```kotlin
private fun addNativeAssets(adUnit: NativeAdUnit?)  {
    // ADD ASSETS

    val title = NativeTitleAsset()
    title.setLength(90)
    title.isRequired = true
    adUnit?.addAsset(title)

    val icon = NativeImageAsset(20, 20, 20, 20)
    icon.imageType = NativeImageAsset.IMAGE_TYPE.ICON
    icon.isRequired = true
    adUnit?.addAsset(icon)

    val image = NativeImageAsset(200, 200, 200, 200)
    image.imageType = NativeImageAsset.IMAGE_TYPE.MAIN
    image.isRequired = true
    adUnit?.addAsset(image)

    val data = NativeDataAsset()
    data.len = 90
    data.dataType = NativeDataAsset.DATA_TYPE.SPONSORED
    data.isRequired = true
    adUnit?.addAsset(data)

    val body = NativeDataAsset()
    body.isRequired = true
    body.dataType = NativeDataAsset.DATA_TYPE.DESC
    adUnit?.addAsset(body)

    val cta = NativeDataAsset()
    cta.isRequired = true
    cta.dataType = NativeDataAsset.DATA_TYPE.CTATEXT
    adUnit?.addAsset(cta)

    // ADD EVENT TRACKERS

    val methods = ArrayList<NativeEventTracker.EVENT_TRACKING_METHOD>()
    methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.IMAGE)

    try {
        val tracker = NativeEventTracker(NativeEventTracker.EVENT_TYPE.IMPRESSION, methods)
        adUnit?.addEventTracker(tracker)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

#### Step 1: Create a NativeAdUnit
{:.no_toc}

Initialize the `NativeAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server

#### Step 2: Add Native Assets and Event Trackers
{:.no_toc}

In order to make a bid request for the native ads you should provide a description of native assets that should be present in the native bid response. Prebid SDK supports the following set of assets to request.

- `NativeImageAsset`
- `NativeDataAsset`
- `NativeTitleAsset`

#### Step 3: Create an AdManagerAdView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner) to integrate a banner ad unit.

#### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 4: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

### In-App Native

Visit the [AdOps guide](/adops/gam-native.html#create-mobile-in-app-creative) for instructions on setting up the In-App creatives on GAM. 

At a high level, the in-app workflow is happening the following way:

1. The publisher prepares the ad layout and provides the native ad configuration to the SDK's ad unit.
2. Prebid SDK fetches native demand. However, instead of caching the native assets on the server, the assets are cached locally in the SDK.
3. Ad request are made to Google Ad Manager.
4. Upon receiving results from Google Ad Manager, the SDK determines if any of the received items are from Prebid Server.
5. If there are Prebid ads, the cached assets are then rendered.

{% capture importantNote %}
The cached assets might expire. If this occurs the publisher will receive a notification and they will have to fetch the assets again.
{% endcapture %}

#### Integration Example
{:.no_toc}

```kotlin
private fun createAd() {
    // 1. Create NativeAdUnit
    adUnit = NativeAdUnit(CONFIG_ID);
    adUnit?.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
    adUnit?.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
    adUnit?.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)

    // 2. Add native assets and trackers
    addNativeAssets(adUnit)

    // 3. Make a bid request to Prebid Server
    val adRequest = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(adRequest) {

        // 4. Load a GAM Native Ad
        adLoader = createAdLoader(adWrapperView)
        adLoader?.loadAd(adRequest)
    }
}
```

Add native assets:

```kotlin
private fun addNativeAssets(adUnit: NativeAdUnit?)  {
    // ADD NATIVE ASSETS

    val title = NativeTitleAsset()
    title.setLength(90)
    title.isRequired = true
    adUnit?.addAsset(title)

    val icon = NativeImageAsset(20, 20, 20, 20)
    icon.imageType = NativeImageAsset.IMAGE_TYPE.ICON
    icon.isRequired = true
    adUnit?.addAsset(icon)

    val image = NativeImageAsset(200, 200, 200, 200)
    image.imageType = NativeImageAsset.IMAGE_TYPE.MAIN
    image.isRequired = true
    adUnit?.addAsset(image)

    val data = NativeDataAsset()
    data.len = 90
    data.dataType = NativeDataAsset.DATA_TYPE.SPONSORED
    data.isRequired = true
    adUnit?.addAsset(data)

    val body = NativeDataAsset()
    body.isRequired = true
    body.dataType = NativeDataAsset.DATA_TYPE.DESC
    adUnit?.addAsset(body)

    val cta = NativeDataAsset()
    cta.isRequired = true
    cta.dataType = NativeDataAsset.DATA_TYPE.CTATEXT
    adUnit?.addAsset(cta)

    // ADD NATIVE EVENT TRACKERS
    val methods = ArrayList<EVENT_TRACKING_METHOD>()
    methods.add(EVENT_TRACKING_METHOD.IMAGE)
    methods.add(EVENT_TRACKING_METHOD.JS)
    try {
        val tracker = NativeEventTracker(NativeEventTracker.EVENT_TYPE.IMPRESSION, methods)
        adUnit?.addEventTracker(tracker)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

Prepare Native Ad Loader

```kotlin
private fun createAdLoader(wrapper: ViewGroup): AdLoader? {
    val onGamAdLoaded = OnAdManagerAdViewLoadedListener { adManagerAdView: AdManagerAdView ->
        Log.d(TAG, "Gam loaded")
        adView = adManagerAdView
        wrapper.addView(adManagerAdView)
    }

    val onUnifiedAdLoaded = OnNativeAdLoadedListener { unifiedNativeAd: NativeAd? ->
        Log.d(TAG, "Unified native loaded")
        this.unifiedNativeAd = unifiedNativeAd
    }

    val onCustomAdLoaded = OnCustomFormatAdLoadedListener { nativeCustomTemplateAd: NativeCustomFormatAd? ->
        Log.d(TAG, "Custom ad loaded")

        // 5. Find Prebid Native Ad
        AdViewUtils.findNative(nativeCustomTemplateAd!!, object : PrebidNativeAdListener {
            override fun onPrebidNativeLoaded(ad: PrebidNativeAd) {

                // 6. Render native ad
                inflatePrebidNativeAd(ad, wrapper)
            }

            override fun onPrebidNativeNotFound() {
                Log.e(TAG, "onPrebidNativeNotFound")
            }

            override fun onPrebidNativeNotValid() {
                Log.e(TAG, "onPrebidNativeNotValid")
            }
        })
    }

    return AdLoader.Builder(wrapper.context, AD_UNIT_ID)
        .forAdManagerAdView(onGamAdLoaded, AdSize.BANNER)
        .forNativeAd(onUnifiedAdLoaded)
        .forCustomFormatAd(
            CUSTOM_FORMAT_ID, onCustomAdLoaded
        ) { customAd: NativeCustomFormatAd?, s: String? -> }
        .withAdListener(object : AdListener() {
            override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                super.onAdFailedToLoad(loadAdError)
                Log.e(TAG, "DFP onAdFailedToLoad")
            }
        })
        .build()
}
```

Render a native ad:

```kotlin
private fun inflatePrebidNativeAd(ad: PrebidNativeAd, wrapper: ViewGroup) {
  val nativeContainer = View.inflate(wrapper.context, R.layout.layout_native, null)

  val icon = nativeContainer.findViewById<ImageView>(R.id.imgIcon)
  ImageUtils.download(ad.iconUrl, icon)

  val title = nativeContainer.findViewById<TextView>(R.id.tvTitle)
  title.text = ad.title

  val image = nativeContainer.findViewById<ImageView>(R.id.imgImage)
  ImageUtils.download(ad.imageUrl, image)

  val description = nativeContainer.findViewById<TextView>(R.id.tvDesc)
  description.text = ad.description

  val cta = nativeContainer.findViewById<Button>(R.id.btnCta)
  cta.text = ad.callToAction

  ad.registerView(nativeContainer, Lists.newArrayList(icon, title, image, description, cta), SafeNativeListener())

  wrapper.addView(nativeContainer)
}
```

The listener that you put in registerView() method must not contain any references to View or Activity to prevent memory leak because this listener can remain in the memory for a long time. It's okay to put null listener if you don't need it. It's better to use class implementation with WeakReferences instead of anonymous objects. In Java inner class implementation must be static.

```kotlin
private class SafeNativeListener : PrebidNativeAdEventListener {
  override fun onAdClicked() {}
  override fun onAdImpression() {}
  override fun onAdExpired() {}
}
```

##### Step 1: Create a NativeAdUnit
{:.no_toc}

Initialize the `NativeAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server

##### Step 2: Add Native Assets and Event Trackers
{:.no_toc}

In order to make a bid request for the native ads you should provide a description of native assets that should be present in the native bid response. Prebid SDK supports the following set of assets to request.

- `NativeImageAsset`
- `NativeDataAsset`
- `NativeTitleAsset`

##### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

##### Step 4: Configure and make a GAM ad request
{:.no_toc}

Prepare the `AdManagerAdRequest` and run an ad request as described in the GMA SDK docs for the [native ads](https://developers.google.com/ad-manager/mobile-ads-sdk/android/native/start).

If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative. Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

##### Step 5: Implement OnCustomFormatAdLoadedListener protocol
{:.no_toc}

In order to capture the native ad response, you will need to implement [OnCustomFormatAdLoadedListener](https://developers.google.com/android/reference/com/google/android/gms/ads/nativead/NativeCustomFormatAd.OnCustomFormatAdLoadedListener) protocol.

You should use the following Prebid function to determine whether the Prebid line item should be rendered:

```kotlin
 AdViewUtils.findNative(...)
```

Without it, the SDK won't be able to recognize the Prebid line item.

##### Step 6: Inflate the native layout
{:.no_toc}

Once the Prebid line item is recognized you should extract the ad from the winning bid and init the view properties with native assets data.

## Multiformat API

Starting with version `2.1.5` Prebid SDK supports the fully multiformat ad unit. It allows to run bid requests with any combination of `banner`, `video`, and `native` formats.

The following code demonstrates the integration of multiformat ad unit.

``` kotlin
private fun createAd() {
    // random() only for test cases, in production use only one config id
    val configId = listOf(CONFIG_ID_BANNER, CONFIG_ID_VIDEO, CONFIG_ID_NATIVE).random()

    // Step 1: Create a PrebidAdUnit
    prebidAdUnit = PrebidAdUnit(configId)

    // Step 2: Create PrebidRequest
    val prebidRequest = PrebidRequest()

    // Step 3: Setup the parameters
    prebidRequest.setBannerParameters(createBannerParameters())
    prebidRequest.setVideoParameters(createVideoParameters())
    prebidRequest.setNativeParameters(createNativeParameters())

    // Step 4: Make a bid request
    val gamRequest = AdManagerAdRequest.Builder().build()
    prebidAdUnit?.fetchDemand(prebidRequest, gamRequest) {
        // Step 5: Load an Ad

        loadGam(gamRequest)
    }
}

private fun createBannerParameters(): BannerParameters {
    val parameters = BannerParameters()
    parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)

    return parameters
}

private fun createVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/mp4"))
}

private fun createNativeParameters(): NativeParameters {
    val assets = mutableListOf<NativeAsset>()

    val title = NativeTitleAsset()
    title.setLength(90)
    title.isRequired = true
    assets.add(title)

    val icon = NativeImageAsset(20, 20, 20, 20)
    icon.imageType = NativeImageAsset.IMAGE_TYPE.ICON
    icon.isRequired = true
    assets.add(icon)

    val image = NativeImageAsset(200, 200, 200, 200)
    image.imageType = NativeImageAsset.IMAGE_TYPE.MAIN
    image.isRequired = true
    assets.add(image)

    val data = NativeDataAsset()
    data.len = 90
    data.dataType = NativeDataAsset.DATA_TYPE.SPONSORED
    data.isRequired = true
    assets.add(data)

    val body = NativeDataAsset()
    body.isRequired = true
    body.dataType = NativeDataAsset.DATA_TYPE.DESC
    assets.add(body)

    val cta = NativeDataAsset()
    cta.isRequired = true
    cta.dataType = NativeDataAsset.DATA_TYPE.CTATEXT
    assets.add(cta)

    val nativeParameters = NativeParameters(assets)
    nativeParameters.addEventTracker(
        NativeEventTracker(
            NativeEventTracker.EVENT_TYPE.IMPRESSION,
            arrayListOf(NativeEventTracker.EVENT_TRACKING_METHOD.IMAGE)
        )
    )
    nativeParameters.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
    nativeParameters.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
    nativeParameters.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)

    return nativeParameters
}
```

If you use Custom Native Ads follow the [guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/native-banner) on how to implement processing of the ad response of the respective type. The following code snipet demonstrates how you can process the banner, video and in-banner native (Native Styles) ad resposnse:

``` kotlin
private fun loadGam(gamRequest: AdManagerAdRequest) {
    val onBannerLoaded = OnAdManagerAdViewLoadedListener { adView ->
        showBannerAd(adView)
    }

    val onNativeLoaded = OnNativeAdLoadedListener { nativeAd ->
        showNativeAd(nativeAd, adWrapperView)
    }

    val onPrebidNativeAdLoaded = OnCustomFormatAdLoadedListener { customNativeAd ->
        showPrebidNativeAd(customNativeAd)
    }

    // Prepare the lisners for multiformat Ad Response
    val adLoader = AdLoader.Builder(this, AD_UNIT_ID)
        .forAdManagerAdView(onBannerLoaded, AdSize.BANNER, AdSize.MEDIUM_RECTANGLE)
        .forNativeAd(onNativeLoaded)
        .forCustomFormatAd(CUSTOM_FORMAT_ID, onPrebidNativeAdLoaded, null)
        .withAdListener(AdListenerWithToast(this))
        .withAdManagerAdViewOptions(AdManagerAdViewOptions.Builder().build())
        .build()

    adLoader.loadAd(gamRequest)
}
```

The methods managing the prebid and GAM ads:

``` kotlin
private fun showBannerAd(adView: AdManagerAdView) {
    adWrapperView.addView(adView)
    AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
        override fun success(width: Int, height: Int) {
            adView.setAdSizes(AdSize(width, height))
        }

        override fun failure(error: PbFindSizeError) {}
    })
}

private fun showNativeAd(ad: NativeAd, wrapper: ViewGroup) {
    val nativeContainer = View.inflate(wrapper.context, R.layout.layout_native, null)

    val icon = nativeContainer.findViewById<ImageView>(R.id.imgIcon)
    val iconUrl = ad.icon?.uri?.toString()
    if (iconUrl != null) {
        ImageUtils.download(iconUrl, icon)
    }

    val title = nativeContainer.findViewById<TextView>(R.id.tvTitle)
    title.text = ad.headline

    val image = nativeContainer.findViewById<ImageView>(R.id.imgImage)
    val imageUrl = ad.images.getOrNull(0)?.uri?.toString()
    if (imageUrl != null) {
        ImageUtils.download(imageUrl, image)
    }

    val description = nativeContainer.findViewById<TextView>(R.id.tvDesc)
    description.text = ad.body

    val cta = nativeContainer.findViewById<Button>(R.id.btnCta)
    cta.text = ad.callToAction

    wrapper.addView(nativeContainer)
}

private fun showPrebidNativeAd(customNativeAd: NativeCustomFormatAd) {
    AdViewUtils.findNative(customNativeAd, object : PrebidNativeAdListener {
        override fun onPrebidNativeLoaded(ad: PrebidNativeAd) {
            inflatePrebidNativeAd(ad)
        }

        override fun onPrebidNativeNotFound() {
            Log.e("PrebidAdViewUtils", "Find native failed: native not found")
        }

        override fun onPrebidNativeNotValid() {
            Log.e("PrebidAdViewUtils", "Find native failed: native not valid")
        }
    })
}

private fun inflatePrebidNativeAd(ad: PrebidNativeAd) {
    val nativeContainer = View.inflate(this, R.layout.layout_native, null)

    val icon = nativeContainer.findViewById<ImageView>(R.id.imgIcon)
    ImageUtils.download(ad.iconUrl, icon)

    val title = nativeContainer.findViewById<TextView>(R.id.tvTitle)
    title.text = ad.title

    val image = nativeContainer.findViewById<ImageView>(R.id.imgImage)
    ImageUtils.download(ad.imageUrl, image)

    val description = nativeContainer.findViewById<TextView>(R.id.tvDesc)
    description.text = ad.description

    val cta = nativeContainer.findViewById<Button>(R.id.btnCta)
    cta.text = ad.callToAction

    ad.registerView(nativeContainer, Lists.newArrayList(icon, title, image, description, cta), null)

    adWrapperView.addView(nativeContainer)
}
```

### Step 1: Create a PrebidAdUnit
{:.no_toc}

Initialize the `PrebidAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server

### Step 2: Create a PrebidRequest
{:.no_toc}

Create the instance of `PrebidRequest` initializing it with respective ad format parameters.

In addition you can set the following properties of the `PrebidRequest`.

### Step 3: Setup the parameters
{:.no_toc}

For each intersted ad format you should creatae a respective configuration parameter:

- [BannerParameters](#step-2-configure-banner-parameters) object.
- [VideoParameters](#step-2-configure-the-video-parameters) object.
- [NativeParameters](#nativeparameters) object

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

### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

### Step 5: Load and Ad
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/native-banner) to combine the a banner and custom native ads int the app.

## Ad Unit Configuration

Each ad unit in the Original API is a subclass of the `AdUnit` class, which provides the following properties and methods for additional configuration.

### Ad Slot

PB Ad Slot is an identifier tied to the placement the ad will be delivered in. The use case for PB Ad Slot is to pass to exchange an ID they can use to tie to reporting systems or use for data science driven model building to match with impressions sourced from alternate integrations. A common ID to pass is the ad server slot name.

`adUnit.ortb2Imp.ext.data.pbadslot = "/1111111/homepage/med-rect-2"`

### Auto Refresh

#### setAutoRefreshPeriodMillis
{:.no_toc}

If set on a given Prebid Mobile ad unit, the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServers refresh be turned off.

**Parameters**

- `periodMillis`: Integer defining the refresh time in milliseconds.

#### startAutoRefresh
{:.no_toc}

Starts the auto-refresh behavior for a given Prebid Mobile ad unit.

#### stopAutoRefresh
{:.no_toc}

Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

### GPID

(requires SDK v2.1.6)

The Global Placement ID (GPID) is a key that uniquely identifies a specific instance of an adunit. Some bidders require this value. An important scenario is "infinite scroll" -- if your app creates instances
of an adunit dynamically as the user scrolls through content, the the GPID must be different for each by appending some kind of sequence or ID. e.g. "/newsfeed#7"

Using the following method, you can set the impression-level [GPID](https://docs.prebid.org/features/pbAdSlot.html#the-gpid) value to the bid request:

``` kotlin
adUnit?.gpid = "/36117602/hnp-sfgate.com/Homepage/AP300"
```

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
