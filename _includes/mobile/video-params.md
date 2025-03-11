Using the `VideoParameters` object you can customize the bid request for video ads.

#### placement
{:.no_toc}

**Note:** Deprecated as of [OpenRTB v2.6-202303](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list--placement-subtypes---video-) release.

Not needed for Instream video integration, which uses placement=1 and plcmt=1.

The [OpenRTB 2.6](https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf) Placement Type for the auction can be expressed as an integer or you can use an enum for easier readability.

- `2` or `InBanner` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
- `3` or `InArticle` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
- `4` or `InFeed` : In-Feed placement is found in content, social, or product feeds.
- `5` or `Slider`, `Floating` or `Interstitial` : Open RTB supports one of three values for option 5 as either Slider, Floating or Interstitial. If an enum value is supplied in placement, bidders will receive value 5 for placement type and assume to be interstitial with the instl flag set to 1.

Notes:
- `PrebidAdUnit`, `VideoInterstitialAdUnit` and `RewardedVideoAdUnit` will default to placement=5 if no placement value is supplied.

#### plcmnt
{:.no_toc}

The [OpenRTB v2.6-202303](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list--plcmt-subtypes---video-) Placement Type for the auction can be expressed as an integer or you can use an enum for easier readability.

- `1` or `Instream` : Pre-roll, mid-roll, and post-roll ads that are played before, during or after the streaming video content that the consumer has requested. Instream video must be set to “sound on” by default at player start, or have explicitly clear user intent to watch the video content. While there may be other content surrounding the player, the video content must be the focus of the user’s visit. It should remain the primary content on the page and the only video player in-view capable of audio when playing. If the player converts to floating/sticky subsequent ad calls should accurately convey the updated player size..
- `2` or `AccompanyingContent` : Pre-roll, mid-roll, and post-roll ads that are played before, during, or after streaming video content. The video player loads and plays before, between, or after paragraphs of text or graphical content, and starts playing only when it enters the viewport. Accompanying content should only start playback upon entering the viewport. It may convert to a floating/sticky player as it scrolls off the page.
- `3` or `Interstitial` : Video ads that are played without video content. During playback, it must be the primary focus of the page and take up the majority of the viewport and cannot be scrolled out of view. This can be in placements like in-app video or slideshows.
- `4` or `NoContent` or `Standalone` : Video ads that are played without streaming video content. This can be in placements like slideshows, native feeds, in-content or sticky/floating.

Notes:
- `PrebidAdUnit`, `VideoInterstitialAdUnit` and `RewardedVideoAdUnit` will default to plcmnt=3 if no placement value is supplied.

#### api
{:.no_toc}

The `api` property is dedicated to adding values for API Frameworks to bid response according to the [OpenRTB 2.6](https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf) spec. The supported values for GMA SDK integration are:

- `1` or `Signals.Api.VPAID_1` : VPAID 1.0
- `2` or `Signals.Api.VPAID_2` : VPAID 2.0
- `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
- `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
- `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
- `7` or `Signals.Api.OMID_1`  : signals OMSDK support

#### maxBitrate
{:.no_toc}

Integer representing the OpenRTB 2.6 maximum bit rate in Kbps.

#### minBitrate
{:.no_toc}

Integer representing the OpenRTB 2.6 minimum bit rate in Kbps.

#### maxDuration
{:.no_toc}

Integer representing the OpenRTB 2.6 maximum video ad duration in seconds.

#### minDuration
{:.no_toc}

Integer representing the OpenRTB 2.6 minimum video ad duration in seconds.

#### mimes
{:.no_toc}

Array of strings representing the supported OpenRTB 2.6 content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).
Required property.

#### playbackMethod
{:.no_toc}

Array of OpenRTB 2.6 playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is strongly advised to use only the first element of the array.

- `1` or `Signals.PlaybackMethod.AutoPlaySoundOn` : Initiates on Page Load with Sound On
- `2` or `Signals.PlaybackMethod.AutoPlaySoundOff` : Initiates on Page Load with Sound Off by Default
- `3` or `Signals.PlaybackMethod.ClickToPlay` : Initiates on Click with Sound On
- `4` or `Signals.PlaybackMethod.MouseOver` : Initiates on Mouse-Over with Sound On
- `5` or `Signals.PlaybackMethod.EnterSoundOn` : Initiates on Entering Viewport with Sound On
- `6` or `Signals.PlaybackMethod.EnterSoundOff`: Initiates on Entering Viewport with Sound Off by Default

#### protocols
{:.no_toc}

  Array or enum of OpenRTB 2.6 supported Protocols. Values can be one of:

- `1` or `Signals.Protocols.VAST_1_0` : VAST 1.0
- `2` or `Signals.Protocols.VAST_2_0` : VAST 2.0
- `3` or `Signals.Protocols.VAST_3_0` : VAST 3.0
- `4` or `Signals.Protocols.VAST_1_0_Wrapper` : VAST 1.0 Wrapper
- `5` or `Signals.Protocols.VAST_2_0_Wrapper` : VAST 2.0 Wrapper
- `6` or `Signals.Protocols.VAST_3_0_Wrapper` : VAST 3.0 Wrapper
- `7` or `Signals.Protocols.VAST_4_0` : VAST 4.0
- `8` or `Signals.Protocols.VAST_4_0_Wrapper` : VAST 4.0 Wrapper
