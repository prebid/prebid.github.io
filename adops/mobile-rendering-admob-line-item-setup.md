---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# AdMob Setup


## Mediation Group Setup

### Step 1: Create Mediation Group

In your AdMob account go to `Mediation` and click on `Create Mediation Group`:

 <img src="/assets/images/prebid-mobile/modules/rendering/order-admob-create.png" alt="Pipeline Screenshot" align="center">

Choose one of the ad formats:

- Banner
- Interstitial
- Native Advanced
- Rewarded interstitial

Choose a platform - iOS or Android.

Press `CONTINUE`. Then set the name for the mediation group and other properties:

<img src="/assets/images/prebid-mobile/modules/rendering/order-admob-create-properties.png" alt="Pipeline Screenshot" align="center">

Press `ADD AD UNITS` and select the target items in the modal dialog:

<img src="/assets/images/prebid-mobile/modules/rendering/order-admob-create-ad-units.png" alt="Pipeline Screenshot" align="center">

Press `DONE`. And move to the next step.


### Step 2: Add Custom Events

<img src="/assets/images/prebid-mobile/modules/rendering/order-admob-create-add-ad-sources.png" alt="Pipeline Screenshot" align="center">


Now you have to add custom events for possible bid prices. Follow the [price granularity](/adops/price-granularity.html) guide to determine how many entries you need.

Press `ADD CUSTOM EVENT`:

<img src="/assets/images/prebid-mobile/modules/rendering/order-admob-create-add-custom-event-name.png" alt="Pipeline Screenshot" align="center">

Set the `Label` and `eCPM` for the custom event. Press `CONTINUE`.

<img src="/assets/images/prebid-mobile/modules/rendering/order-admob-create-add-custom-event-adapter-name.png" alt="Pipeline Screenshot" align="center">

The fields in this dialog are critical for the proper integration:

- `Class Name` is a name of respective adapter.
    - Banner:
        - iOS: `PrebidAdMobBannerAdapter`
        - Android: `org.prebid.mobile.admob.PrebidBannerAdapter`
    - Interstitial Display:
        - iOS: `PrebidAdMobInterstitialAdapter`
        - Android: `org.prebid.mobile.admob.PrebidInterstitialAdapter`
    - Interstitial Video:
        - iOS: `PrebidAdMobVideoInterstitialAdapter`
        - Android: `org.prebid.mobile.admob.PrebidInterstitialAdapter`
    - Rewarded:
        - iOS: `PrebidAdMobRewardedVideoAdapter `
        - Android: `org.prebid.mobile.admob.PrebidRewardedAdapter`
    - Native:
        - iOS: `PrebidAdMobNativeAdapter `
        - Android: `org.prebid.mobile.admob.PrebidNativeAdapter`
- `Parameter` is a keywords for the current ad source. **Important**: make sure that the price of the ad source is the same as the price in this keyword. For example:

```
{"hb_pb":"0.10"}
```

Prebid SDK will compare the keywords in the winning bids with keywords provided in the `Parameter` fields.

{: .alert.alert-warning :}
The adapter will render the winning bid only if the bid's targeting keywords contain `all` keywords from the Parameter field.


Press `DONE` and repeat the adding of the custom events for all needed prices.

<img src="/assets/images/prebid-mobile/modules/rendering/order-admob-create-list-custom-events.png" alt="Pipeline Screenshot" align="center">

Once you add all needed custom events - press `DONE`. The Mediation Group is ready to serve the prebid demand to your app.
