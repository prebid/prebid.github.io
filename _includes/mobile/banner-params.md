Using the `BannerParameters` object you can customize the bid request for banner ads.

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `BannerBaseAdUnit.Parameters` class is deprecated. Use `BannerParameters` instead.

#### adSizes

Defines the OpenRTB banner.formats array.

#### interstitialMinWidthPerc and interstitialMinHeightPerc
{:.no_toc}

For interstitials only, these define which sizes Prebid Server will choose to send to bidders. See [Prebid Server interstitial support](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#interstitial-support). If this option is used, you'll need to set the size to 1x1.

#### api
{:.no_toc}

The `api` property is dedicated to adding values for API Frameworks to bid response according to the [OpenRTB 2.6](https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf) spec. The supported values for GMA SDK integration are:

- `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
- `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
- `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
- `7` or `Signals.Api.OMID_1`  : signals OMSDK support
