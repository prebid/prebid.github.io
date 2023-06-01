---
layout: page_v2
title: Render Options Supported by the Brightcove Prebid Plugin
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Render Options Supported by the Brightcove Prebid Plugin

## Overview

Configuration options for a single ad break are typically passed into the plugin in a JSON object structure. However, if you want to configure more than one ad break (containing a single ad slot) in a single video, configuration options would be passed into the plugin as an array of JSON objects, each object representing the configuration settings for one of the ad breaks. (See [Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html) for more details.) These options can include:

- Prebid options, which configure how the prebid process should be executed.
- Rendering options, which customize the ad playback.


## Plugin Rendering Options

These options are used to configure how the selected ad should be displayed for each ad break. They are included in the same JSON structure that contains the prebid options for the ad break.

When configuring prebid options for more than one ad break, create an array of prebid and rendering options for each ad break.

{% capture infoNote %}
Many of the rendering options listed below are ignored when the Brightcove IMA Plugin is used to render the ads.  That plugin does not provide an API that can be used to customize the rendering characteristics. These limitations will be noted below.
:::

{% include alerts/alert_note.html content=infoNote %}

- [adRenderer](#adrenderer)
- [skippable](#skippable)
- [skippable.enabled](#enabled)
- [skippable.videoThreshold](#videoThreshold)
- [skippable.videoOffset](#videoOffset)
- [skippable.skipText](#skipText)
- [skippable.skipButtonText](#skipButtonText)
- [adStartTimeout](#adStartTimeout)
- [timeOffset](#timeOffset)
- [adText](#adText)
- [wrapperLimit](#wrapperLimit)
- [frequencyRules](#frequencyRules)
- [label](#labeloption)

<a name="adrenderer"></a>
### adRenderer

**Description:**

This option is used to override the default behavior for selecting the plugin used to render the selected ad(s).

By default, the prebid plugin will select the Brightcove IMA plugin if it detects that Google Ad Manager is the primary ad server.  If dfpParameters are specified in *any* of the prebid configuration options passed into the plugin, then Google Ad Manager is identified as the primary ad server.

If the prebid configuration options do not include any dfpParameters, meaning that Google Ad Manager is *not* the primary ad server, then the MailOnline Prebid plugin will be used to render the ad(s).

Specifying one of the acceptable values listed below will override this behavior; the prebid plugin will use the renderer specified in this option.

{% capture infoNote %}
The prebid plugin will only use the **_first_** definition of the `adRenderer` option to control the ad renderer selection.  If you define this option more than once, the other specifications will be ignored.
:::

{% include alerts/alert_note.html content=infoNote %}

{% capture infoNote %}
If your page includes more than one Brightcove Player within the same HTML document and *any* of these players loads the Brightcove IMA Plugin, then it is recommended that *all* of your players in the document use the Brightcove IMA Plugin. Therefore, even if your prebid configuration does not include Google Ad Manager parameters and you are not using a "custom" renderer, in this case you should explicitly specify the IMA plugin using the `adRenderer` option as shown below. Doing so seems to prevent a problem observed when multiple players are being used in the same HTML document in PC browsers (Edge and Internet Explorer) and some of the players load the IMA plugin and the others load the MailOnline plugin. You can also prevent this collision if your players are loaded into their own iFrames.
:::

{% include alerts/alert_note.html content=infoNote %}

{% capture infoNote %}
If you will be using the Brightcove IMA plugin as the ad renderer, either because Google Ad Manager is the primary ad server or you have explicitly specified the IMA plugin in the `adRenderer` option, then it is *suggested* that you add the IMA plugin to your Brightcove Player configuration in the Brightcove Studio. Doing so prevents some problems observed when the Player is running on iOS and the IMA plugin is loaded at run-time. When you configure IMA in the Studio, do *not* put a URL in the `Ad Tag` field AND select `"On demand"` from the `Request Ads` field.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values**

One of the following strings:

- `‘ima’`: The Brightcove IMA plugin will be used to render the ad(s) regardless of whether Google Ad Manager has been identified as the primary ad server for Prebid.
- `‘mailonline’`: The MailOnline plugin will be used to render the ad(s) regardless of whether Google Ad Manager has been identified as the primary ad server for Prebid.
- `‘custom’`: A custom ad renderer is being provided by the publisher.  This can be either a custom build of MailOnline or a custom renderer altogether.  If this value is specified for `adRenderer`, then the plugin will not attempt to use either of the default ad renderers.  The plugin will simply use the renderer as specified in the custom build of the plugin.  See the ReadMe file for more information on specifying a custom renderer.

**Required**

No

**Default Value:**

None. If this option is not specified with a valid value, the renderer selection will be made based on the presence of dfpParameters.

**Example:**

`options1.adRenderer = 'ima';`

<a name="skippable"></a>
### skippable

**Description:**

Object that specifies the publisher preferences regarding ad skipping behavior.

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad. IMA will only display a SKIP button when the XML that is passed into the IMA renderer specifies a skipOffset value.  If the creative XML containing the skipOffset is passed into a VPAID wrapper such that the skipOffset value is not visible to IMA, then no SKIP button will be displayed.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values:**

JSON object.

**Required?**

No

**Default Value:**

{} (empty object)

This means that the publisher does not have a client-side preference. Skippable behavior would be determined by the presence of the `skipOffset` attribute in the VAST XML.

**Example:**

`options.skippable = {};`

<a name="enabled"></a>
### skippable.enabled

**Description:**

Specifies whether skippable behavior should be enforced regardless of the presence of the `skipOffset` attribute in the creative XML.

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad.
:::

{% include alerts/alert_note.html content=infoNote %}


**Acceptable Values:**

Boolean

- `true`: ad will be skippable as long as the videoThreshold requirement has been met.
- `false`: ad will not be skippable.

**Required?**

No

**Default Value:**

None - If missing, then skippable behavior is controlled by the presence of the `skipOffset` attribute in the creative XML.

**Example:**

`options.skippable.enabled = true;`

<a name="videoThreshold"></a>
### skippable.videoThreshold

**Description:**

Integer that specifies the minimum length in seconds of the ad video for a skip button to be enabled. If the duration of the ad video is less than the `videoThreshold` value, then the ad will not be skippable.

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values:**

Integer greater than zero

**Required?**

No

**Default Value:**

None - If missing and `skippable.enabled = true` then the ad will be skippable regardless of the duration of the ad video.

**Example:**

`options.skippable.videoThreshold = 30;`

<a name="videoOffset"></a>
### skippable.videoOffset

**Description:**

Integer that specifies the time in seconds when the skip button should be enabled (assuming that the `videoThreshold` criteria has been met).

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values:**

Integer greater than zero

**Required?**

Yes if `skippable.enabled = true`; otherwise No.

**Default Value:**

None

**Example:**

`options.skippable.videoOffset = 10`

<a name="skipText"></a>
### skippable.skipText

**Description:**

String used to customize the text that is displayed BEFORE the Skip button is enabled. This allows the publisher to customize the text for non-English language translation.

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values:**

String; use `%%TIME%%` as the placeholder for the countdown time.

**Required?**

No

**Default Value:**

'Skip in %%TIME%% seconds'

**Example:**

`options.skippable.skipText = 'Your ad may be skipped in %%TIME%% seconds'`

<a name="skipButtonText"></a>
### skippable.skipButtonText

**Description:**

String used as the text displayed in the Skip button. This allows the publisher to customize the text of the button, including customizing it for non-English language translation.

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values:**

String

**Required?**

No

**Default Value:**

'SKIP'

**Example:**

`options.skippable.skipButtonText = 'SKIP AD';`

<a name="adStartTimeout"></a>
### adStartTimeout

**Description:**

Specifies how long the plugin can wait for an ad to start.

**Acceptable Values:**

Integer

Max time in milliseconds that the player will wait for a single ad to start. If the ad does not start within that timeout period, then the ad playback will be terminated.

**Required?**

No

**Default Value:**

3000

**Example:**

`options.adStartTimeout=2500;`

<a name="timeOffset"></a>
### timeOffset

**Description:**

Specifies the time offset within the video content when the ad should be scheduled to play.

**Acceptable Values:**

String that can be one of the following:

- `'start'` (for preroll)
- `'end'` (for postroll)
- `'hh:mm:ss'` (to specify a midroll at a specific time)
- `'hh:mm:ss.mmm'` (to specify a midroll at a specfic time, including millseconds)
- `'n%'` (to specify a midroll to play after the specified percentage of the content video has played)

**Required?**

- If specifying a single ad break:  No
- If specifying more than one ad break: Yes, for each set of configuration settings for each ad break. Each `timeOffset` value should be unique.

**Default Value:**

'start'

**Example:**

`options.timeOffset = '15%';`

<a name="adText"></a>
### adText

**Description:**

Specifies the text displayed in the Ad Indicator control.

The Ad Indicator will always be displayed in the top left corner of the top bar in the player.

This field is used to customize the text of the Ad Indicator or to provide a non-English translation for the Ad Indicator.

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values:**

String providing the text for the Ad Indicator.

If the length of the string is too long to fit into the Ad Indicator control, the text will be truncated.

**Required?**

No

**Default Value:**

'Ad'

**Example:**

`options.adText = 'Publicité'`

<a name="wrapperLimit"></a>
### wrapperLimit

**Description:**

Specifies the maximum number of XML redirects that are allowed to be considered when attempting to play an ad.

{% capture infoNote %}
This option is ignored if the Brightcove IMA Plugin is used to render the ad.
:::

{% include alerts/alert_note.html content=infoNote %}

**Acceptable Values:**

Integer

The number of XML documents being parsed in a wrapper chain to obtain the media file to play. This includes the number of wrapper XML documents and the inline XML.

If the number of steps in the XML chain equals or exceeds this limit, no ad will play.

**Required?**

No

**Default Value:**

5

**Example:**

`wrapperLimit: 3`

<a name="frequencyRules"></a>
### frequencyRules

**Description:**

Specifies rules controlling how frequently the plugin should attempt to play an ad.

**Acceptable Values:**

JSON Object

playlistClips = integer that specifies how often an ad should be shown for videos within a single playlist
  - playlistClips = 1: the plugin will attempt to play an ad for every video in the playlist
  - playlistClips = 2: the plugin will attempt to play an ad for every other video in the playlist, starting at video #1
  - playlistClips = 3: the plugin will attempt to play an ad every third video in the playlist, start at video #1

For example, if playlistClips = 2 and there 6 videos in the playlist, the plugin will attempt to play an ad for video #1, video #3, and video #5.

**Required?**

No

**Default Value:**

playlistClips = 1

**Example:**

```
frequencyRules
  {
    playlistClips : 2
  }
```

<a name="labeloption"></a>
### label

**Description:**

User-defined text that identifies a set of prebid/rendering options.  This string is particularly useful when defining configuration options for more than one ad break.  Use this option to make it easier to manage all the sets of configuration options.

**Acceptable Values:**

String that uniquely identifies a set of prebid options.  Your label should be logically correct.  For example, do not use a label of "preroll ad" if the ad is going to be used in the midroll position.

**Required?**

No

**Default Value:**

None

**Example:**

`options1.label = 'midroll-at-5-minutes'`

## Links

### Prebid Options

Information about the Prebid Options supported by the plugin can be found at: **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**

### Plugin API

The Brightcove Prebid Plugin supports an API.  Information about this API can be found at **[Brightcove Prebid Plugin API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**

### Sample Implementations

Sample implementations are provided at:
- **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-custom-header-bidding.html)**

- **[Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html)**

</div>
