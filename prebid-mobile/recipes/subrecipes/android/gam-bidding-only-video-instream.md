---
layout: page_v2
title: Android GAM Bidding-Only Integration - Instream Video
description: Android GAM Bidding-Only Integration - Instream Video
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Instream Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Ads within video content are often called 'in-stream' video ads. See the [IAB's format guidelines](https://iabtechlab.com/standards/iab-digital-video-in-stream-ad-format-guidelines/) for more information and the precise definition.

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

## Step 1: Create an Ad Unit
{:.no_toc}

Initialize the VideoAdUnit with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `width` - Width of the video ad unit.
- `height` - Height of the video ad unit

## Step 2: Configure the video parameters
{:.no_toc}

{% include mobile/video-params.md %}

## Step 3: Prepare the Player
{:.no_toc}

Create the instance of `PlayerView` and display it in the app UI.

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. Use the methods which return the targeting map in the result closure.

## Step 5: Generate GAM Instream URI
{:.no_toc}

Using Prebid util method, generate Google IMA URI for downloading the cached creative from the winning bid.

## Step 6: Cretae and init IMA player
{:.no_toc}

Follow the Google Guide for [integrating IMA with ExoPlayer](https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/exoplayer-extension) to run a video and show instream ad from the winning bid.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
