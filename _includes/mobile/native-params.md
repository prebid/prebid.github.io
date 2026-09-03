Using the `NativeParameters` object (with the PrebidRequest object) or the `NativeRequest` object,  you can customize the bid request for native ads.

#### assets
{:.no_toc}

The array of requested asset objects. Prebid SDK supports all kinds of assets according to the [IAB spec](https://iabtechlab.com/wp-content/uploads/2016/07/OpenRTB-Native-Ads-Specification-Final-1.2.pdf)  except `video`.

#### eventtrackers
{:.no_toc}

The array of requested native trackers. Prebid SDK supports inly `image` trackers according to the [IAB spec](https://iabtechlab.com/wp-content/uploads/2016/07/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

#### version
{:.no_toc}

Version of the Native Markup version in use. The default value is `1.2`

#### context
{:.no_toc}

The context in which the ad appears.

#### contextSubType
{:.no_toc}

A more detailed context in which the ad appears.

#### placementType
{:.no_toc}

The design/format/layout of the ad unit being offered.

#### placementCount
{:.no_toc}

The number of identical placements in this Layout.

#### sequence
{:.no_toc}

0 for the first ad, 1 for the second ad, and so on.

#### asseturlsupport
{:.no_toc}

Whether the supply source/impression supports returning an assetsurl instead of an asset object. 0 or the absence of the field indicates no such support.

#### durlsupport
{:.no_toc}

Whether the supply source / impression supports returning a dco url instead of an asset object. 0 or the absence of the field indicates no such support.

#### privacy
{:.no_toc}

Set to 1 when the native ad supports buyer-specific privacy notice.  Set to 0 (or field absent) when the native ad doesn’t support custom privacy links or if support is unknown.

#### ext
{:.no_toc}

This object is a placeholder that may contain custom JSON agreed to by the parties to support flexibility beyond the standard defined in this specification
