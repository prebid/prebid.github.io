---

layout: page_v2
title: Custom or No mediation
description: Integration of Prebid SDK withou primaty Ad Server
sidebarType: 2

---

# Custom Bidding Integration
{:.no_toc}

You can use Prebid SDK to monetize your app with a custom ad server or even without it. Use the `Transport API` to obtain the targeting keywords for following usage with the custom ad server. Use the `Rendering API` to display the winning bid without primary ad server and its SDK.

* TOC
{:toc}

## Transport API

The default ad server for Prebid's Mobile SDK is GAM. The SDK can be expanded to include support for 3rd party ad servers through the fetchDemand function. This function returns the Prebid Server bidder key/values (targeting keys), which can then be passed to the ad server of choice. 

In this mode, the publisher will be responsible for the following actions:

* Call fetchDemand with extended targetingDict callback
* Retrieve targeting keys from extended fetchDemand function
* Convert targeting keys into the format for your ad server
* Pass converted keys to your ad server
* Render ad with Prebid Universal Creative or custom renderer

This approach is avaliable for the following ad formats:

* Display Banner via `BannerAdUnit`
* Video Banner and Instream Video via `VideoAdUnit`
* Display Interstitial via `InterstitialAdUnit`
* Video Interstitial via `VideoInterstitialAdUnit`
* Rewarded Video via `RewardedVideoAdUnit`
* Native Styles via `NativeRequest`

The basic integration steps for these ad units you can find at the page for integration using [Original API](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html). The diference is that you should use  the `fetchDemand` function with following signature:

``` kotlin
public void fetchDemand(@NonNull Object adObj, 
                        @NonNull OnCompleteListener2 listener) { ... }
                        
public interface OnCompleteListener2 {
    /**
     * This method will be called when PrebidMobile finishes attaching keywords to unmodifiableMap.
     * @param resultCode see {@link ResultCode} class definition for details
     * @param unmodifiableMap a map of targeting Key/Value pairs
     */
    @MainThread
    void onComplete(ResultCode resultCode, 
                    @Nullable Map<String, String> unmodifiableMap);
}                        
```

Examples:

``` kotlin
private fun loadRewardedVideo() {
    adUnit?.fetchDemand { resultCode, unmodifiableMap -> 
        val keywords: Map<String, String> = HashMap(unmodifiableMap)

        adServerObject.loadRewardedVideo(ADUNITID_REWARDED, keywords)
    }
}
```

## Rendering API

The integration and usage of the Rendering API is similar to any other Ad SDK. It sends the bid requests to the Prebid Server and renders the winning bid. 

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)


### Banner API

Integration example:


``` kotlin
// 1. Create an Ad View
bannerView = BannerView(requireContext(), configId, adSize)
bannerView?.setBannerListener(this)

// Add view to viewContainer
viewContainer?.addView(bannerView)

// 2. Load ad
bannerView?.loadAd()
```

{% capture warning_note %}  
Pay attention that the `loadAd()` should be called on the main thread. 
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

#### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerAdView` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `size` - the size of the ad unit which will be used in the bid request.

#### Step 2: Load the Ad
{:.no_toc}

Call `loadAd()` and SDK will:

- make bid request to Prebid
- render the winning bid on display

#### Outstream Video
{:.no_toc}

For **Banner Video** you will also need to specify the `bannerView.videoPlacementType`:

``` kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

### Interstitial API

Integration example:

``` kotlin
// 1. Create an Interstitial Ad Unit
interstitialAdUnit = InterstitialAdUnit(requireContext(), configId, minSizePercentage)
interstitialAdUnit?.setInterstitialAdUnitListener(this)

// 2. Load Ad
interstitialAdUnit?.loadAd()
// .....

// 3. Show the ad
interstitialAdUnit?.show()
```

{% capture warning_note %}  
Pay attention that the `loadAd()` should be called on the main thread. 
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

The **default** ad format for interstitial is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```
interstitialAdUnit = InterstitialAdUnit(
                        requireContext(), 
                        configId, 
                        EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO))
```

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit ` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

You can also assign the listener for processing ad events.

> **NOTE:** the `minSizePercentage` - plays an important role in a bidding process for display ads. If the provided space is not enough demand partners won't respond with bids.

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` to make a bid request.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
    //Ad is ready for display
}
```

### Rewarded API

Integration example:

``` kotlin
// 1. Create an Ad Unit
rewardedAdUnit = RewardedAdUnit(requireContext(), configId)
rewardedAdUnit?.setRewardedAdUnitListener(this)
    
// 2. Execute the loadAd function
rewardedAdUnit?.loadAd()

/// .......

// After the ad is loaded you can execute `show` to trigger ad display
rewardedAdUnit?.show()
```

{% capture warning_note %}  
Pay attention that the `loadAd()` should be called on the main thread. 
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

#### Step 1: Create a Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with parameters:

- `adUnitId` - an ID of Stored Impression on the Prebid server.

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` to make a bid request.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(rewardedAdUnit: RewardedAdUnit) {
//Ad is ready for display
}
```
