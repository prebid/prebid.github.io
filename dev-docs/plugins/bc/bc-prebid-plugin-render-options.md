---
layout: page
title: Render Options Supported by the Brightcove Prebid Plugin
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---

<div class="bs-docs-section" markdown="1">

# Render Options Supported by the Brightcove Prebid Plugin

## Overview

Options to configure the Plugin are passed into the plugin in a JSON object structure.  These options can include:

- Prebid options, which configure how the prebid process should be executed.
- Rendering options, which customize the ad playback.


## Plugin Rendering Options

These options are used to customize the ad playback characteristics.  The options are included in same JSON structure where the prebid options are also provided.

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

<a name="skippable"></a>
### skippable

**Description:**

Object that specifies the publisher preferences regarding ad skipping behavior.

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

No

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

**Acceptable Values:**

Integer

The number of XML strings being parsed in a wrapper chain to obtain the media file to play. This includes the number of wrapper XML strings and the inline XML.

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

</div>
