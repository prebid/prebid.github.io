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

* TOC
{:toc}

## Overview

This is the original Prebid mobile integration approach when SDK plays the transport role, and the winning bid is rendered by the Primary Ad Server SDK using PUC. You can find details of how it works and other integration approaches on the [overview page](/prebid-mobile/prebid-mobile.html#with-ad-server-original-api).  

![In-App Bidding with Prebid](/assets/images/prebid-mobile/prebid-in-app-bidding-overview-prebid-original-gam.png)

## Display Banner

Integration example:

```kotlin
private fun createAd() {

    // 1. Create BannerAdUnit
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT)
    adUnit?.setAutoRefreshInterval(refreshTimeSeconds)

    // 2. Configure banner parameters
    val parameters = BannerBaseAdUnit.Parameters()
    parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)

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

GAM ad view listner:

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

Using the `BannerBaseAdUnit.Parameters()` you can customize the bid request for BannerAdUnit. 

The `api` property is dedicated to adding values for API Frameworks to a bid response according to the OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1` :  signals OMSDK support

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

## Video Banner

Integration example:

```kotlin
private fun createAd() {
    // 1. Create VideoAdUnit
    adUnit = VideoAdUnit(CONFIG_ID, WIDTH, HEIGHT)

    // 2. Configure video ad unit
    adUnit?.parameters = configureVideoParameters()

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

Configure Video parameters:

```kotlin
private fun configureVideoParameters(): VideoBaseAdUnit.Parameters {
    return VideoBaseAdUnit.Parameters().apply {

        api = listOf(
            Signals.Api.VPAID_1,
            Signals.Api.VPAID_2
        )

        maxBitrate = 1500
        minBitrate = 300
        maxDuration = 30
        minDuration = 5
        mimes = listOf("video/x-flv", "video/mp4")
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

#### Step 1: Create a VideoAdUnit
{:.no_toc}

Initialize the `VideoAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `adSize` - the size of the ad unit which will be used in the bid request.

#### Step 2: Configure video parameters
{:.no_toc}

Using the `VideoParameters` you can customize the bid request for a VideoAdUnit. 

#### placement
{:.no_toc}

[OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Placement Type for the auction can be expressed as an integer array or can use an enum for easier readability. Option 1 (in-stream) is intentionally left out due to lack of in-stream support in Prebid SDK. 

In the context of a VideoInterstitialAdUnit, rewarded video ads are typically labeled as interstitial. As such, Prebid SDK will default to value 5 if no placement value is supplied.

* `2` or `InBanner` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
* `3` or `InArticle` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
* `4` or `InFeed` : In-Feed placement is found in content, social, or product feeds.
* `5` or `Slider`, `Floating` or `Interstitial` : Open RTB supports one of three values for option 5 as either Slider, Floating or Interstitial. If an enum value is supplied in placement, bidders will receive value 5 for placement type and assume to be interstitial with the instl flag set to 1.


#### api
{:.no_toc}

The `api` property is dedicated to adding values for API Frameworks to a bid response according to the OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

* `1` or `Signals.Api.VPAID_1` : VPAID 1.0  
* `2` or `Signals.Api.VPAID_2` : VPAID 2.0  
* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1`  : signals OMSDK support


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

## Display Interstitial

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

> PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

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

## Video Interstitial

Integration Example: 

```kotlin
private fun createAd() {

    // 1. Create VideoInterstitialAdUnit
    adUnit = VideoInterstitialAdUnit(CONFIG_ID)

    // 2. Configure video ad unit
    adUnit?.parameters = configureVideoParameters()

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

Configuration function:

```kotlin
private fun configureVideoParameters(): VideoBaseAdUnit.Parameters {
    return VideoBaseAdUnit.Parameters().apply {
        placement = Signals.Placement.Interstitial

        api = listOf(
            Signals.Api.VPAID_1,
            Signals.Api.VPAID_2
        )

        maxBitrate = 1500
        minBitrate = 300
        maxDuration = 30
        minDuration = 5
        mimes = listOf("video/x-flv", "video/mp4")
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

Initialize the Interstitial Video Ad Unit with the following properties:
    
- `configId` - an ID of Stored Impression on the Prebid Server

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

## Rewarded Video

Integration example:

```kotlin
private fun createAd() {
    // 1. Create RewardedVideoAdUnit
    adUnit = RewardedVideoAdUnit(CONFIG_ID)

    // 2. Configure Video parameters
    adUnit?.parameters = configureVideoParameters()

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

Configure vide ad unit:

```kotlin
private fun configureVideoParameters(): VideoBaseAdUnit.Parameters {
    return VideoBaseAdUnit.Parameters().apply {
        mimes = listOf("video/mp4")
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

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the Rewarded Video Ad Unit with the following properties:
    
- `configId` - an ID of Stored Impression on the Prebid Server

#### Step 2: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-2-configure-video-parameters) object.

#### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests. 

#### Step 4: Load a GAM Rewarded Ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative. 

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 5: Present the Rewarded Ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/rewarded#show_the_ad) to display a rewarded ad right after receiving it or later in a natural pauses in the flow of an app.

## Video Instream

Integration example: 

```kotlin
private fun createAd() {
    // 1. Create VideoAdUnit
    adUnit = VideoAdUnit(CONFIG_ID, WIDTH, HEIGHT)

    // 2. Configure video parameters
    adUnit?.parameters = configureVideoParameters()

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

Configure the video ad:

```kotlin
private fun configureVideoParameters(): VideoBaseAdUnit.Parameters {
    return VideoBaseAdUnit.Parameters().apply {
        placement = Signals.Placement.InStream

        api = listOf(
            Signals.Api.VPAID_1,
            Signals.Api.VPAID_2
        )

        maxBitrate = 1500
        minBitrate = 300
        maxDuration = 30
        minDuration = 5
        mimes = listOf("video/x-flv", "video/mp4")
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

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the VideoAdUnit with the following properties:
    
- `configId` - an ID of Stored Impression on the Prebid Server
- `width` - Width of the video ad unit.
- `height` - Height of the video ad unit

#### Step 2: Configure the video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-2-configure-video-parameters) object.

#### Step 3: Prepare the Player 
{:.no_toc}

Create the instance of `PlayerView` and display it in the app UI. 

#### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. Use the methods which return the targeting map in the result closure. 

#### Step 5: Generate GAM Instream URI
{:.no_toc}

Using Prebid util method, generate Google IMA URI for downloading the cached creative from the winning bid.

#### Step 6: Cretae and init IMA player
{:.no_toc}

Follow the Google Guide for [integrating IMA with ExoPlayer](https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/exoplayer-extension) to run a video and show instream ad from the winning bid.   


## Native Style Banner

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

## In-App Native

Integration example: 

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
    ad.registerView(nativeContainer, object : PrebidNativeAdEventListener {
        override fun onAdClicked() {}
        override fun onAdImpression() {}
        override fun onAdExpired() {}
    })

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

    wrapper.addView(nativeContainer)
}
```
#### Step 1: Create a NativeAdUnit
{:.no_toc}

Initialize the `NativeAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server

#### Step 2: Add Native Assets and Event Trackers
{:.no_toc}

In order to make a bid request for the native ads you should provide a description of native assets that should be present in the native bid response. Prebid SDK supports the following set of assets to request. 

- `NativeImageAsset`
- `NativeDataAsset`
- `NativeTitleAsset`

#### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests. 

#### Step 4: Configure and make a GAM ad request
{:.no_toc}

Prepare the `AdManagerAdRequest` and run an ad request as described in the GMA SDK docs for the [native ads](https://developers.google.com/ad-manager/mobile-ads-sdk/android/native/start).

If the `AdManagerAdRequest ` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative. Be sure that you make the ad request with the same `AdManagerAdRequest ` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 4: Implement OnCustomFormatAdLoadedListener protocol
{:.no_toc}

In order to capture the native ad response you will need to implement [OnCustomFormatAdLoadedListener](https://radeon-drivers.com/?_=%2Fandroid%2Freference%2Fcom%2Fgoogle%2Fandroid%2Fgms%2Fads%2Fnativead%2FNativeCustomFormatAd.OnCustomFormatAdLoadedListener%23UUlexhFFzSDzTfOQ54KBpjGsLVY524B1MgR06Ro%3D) protocol. 
 
You should use following Prebid function to determine whether the Prebid line item should be rendered:

```
 AdViewUtils.findNative(...)
```

Without it the SDK won't be able to recognize the Prebid line item.

#### Step 6: Inflate the native layout
{:.no_toc}

Once the Prebid line item is recognized you should extract the ad from the winning bid and init the view properties with native assets data. 

## Ad Unit Configuration

Each ad unit in the Original API is a subclass of the `AdUnit` class, which provides the following properties and methods for additional configuration. 

### Properties

#### pbAdSlot
{:.no_toc}

PB Ad Slot is an identifier tied to the placement the ad will be delivered in. The use case for PB Ad Slot is to pass to exchange an ID they can use to tie to reporting systems or use for data science driven model building to match with impressions sourced from alternate integrations. A common ID to pass is the ad server slot name.

`adUnit.ortb2Imp.ext.data.pbadslot = "/1111111/homepage/med-rect-2"`

### AppContext


#### setAppContent
{:.no_toc}

Provides targeting information for the `app.content` field of the bid request. Parameter is an `ContentObject` which provides all respective fields. 


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

### Context Keywords

#### addContextKeywords
{:.no_toc}

Ad Unit context keywords object is a free form list of comma separated keywords about the app as defined in app.keyword in OpenRTB 2.5.

**Parameters**
`keyword` : a keyword of type string.

```java
void addContextKeyword(String keyword)
```

#### addContextKeywords
{:.no_toc}

**Parameters**
`keyword` : a keyword of type string.

```java
void addContextKeywords(Set<String> keywords)
```

#### removeContextKeywords
{:.no_toc}

**Parameters**
`keyword`: a keyword of type string.

```java
void removeContextKeyword(String keyword)
```

#### clearContextKeywords
{:.no_toc}

```java
void clearContextKeywords()
```

### First Party Data

First Party Data (FPD) is free form data supplied by the publisher to provide additional targeting of the user or inventory context. It is used primarily for striking PMP (Private MarketPlace) deals with Advertisers. Data supplied in the data parameters are typically not sent to DSPs whereas information sent in non-data objects (i.e. `setYearOfBirth`, `setGender`, etc.) will be. Access to FPD can be limited to a supplied set of Prebid bidders via an access control list.

Data is broken up into two different data types:
* User
  * Global in scope only
* Inventory (context)
  * Global scope
  * Ad Unit grain

 The first party inventory context will apply to the specic ad unit the data object it is applied to. For global user or inventory context level first party data, refer to [first party data section of the Targeting](pbm-targeting-params-android#first-party-data) page.


#### addContextData
{:.no_toc}

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key

```java
void addContextData(String key, String value)
```

#### updateContextData
{:.no_toc}

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key

```java
void updateContextData(String key, Set<String> value)
```

#### removeContextData
{:.no_toc}

**Parameters**
`key`: string containing the key

```java
void removeContextData(String key)
```

#### clearContextData
{:.no_toc}

```java
void clearContextData()
```

### UserKeyword

#### setUserKeyword
{:.no_toc}

Set a single key-value pair.

**Parameters**

- `key`: String containing the key.
- `value`: String containing the value.

#### setUserKeywords
{:.no_toc}

Define multiple values for a single key.

**Parameters**

- `key`: String containing the key.
- `values`: String array containing the list of values for the key.

#### removeUserKeyword
{:.no_toc}

Remove a key and all its associated values from a given Prebid Mobile ad unit.

**Parameters**

- `key`: String containing the key you want to remove.

#### removeUserKeywords
{:.no_toc}

Clear all key-value combinations from the Prebid Mobile ad unit.

### UserData

The following methods enable adding `user.data[]` objects into the bid request:

```
public void addUserData(DataObject dataObject)

public ArrayList<DataObject> getUserData() 

public void clearUserData() 
```

### App Content Data

In order to set the `app.contnent.data[]` objects use the `getAppContent()` first and then one of the respective methods of the `ContentObject` class:

```
public void addData(@NonNull DataObject dataObject)

public ArrayList<DataObject> getDataList()

public void setDataList(@NonNull ArrayList<DataObject> dataObjects) 

public void clearDataList()     
```

