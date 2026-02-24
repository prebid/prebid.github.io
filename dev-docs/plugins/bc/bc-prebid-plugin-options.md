---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player - Plugin Options
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Prebid Plugin for Brightcove (Videojs) Player - Plugin Options

## Overview

Configuration options for a single ad break are typically passed into the plugin in a JSON object structure. However, if you want to configure more than one ad break (containing a single ad slot) in a single video, configuration options would be passed into the plugin as an array of JSON objects, each object representing the configuration settings for one of the ad breaks. (See [Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html) for more details.) These options can include:

- Prebid options, which configure how the prebid process should be executed. Visit [Plugin Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html) for details.
- Rendering options, which customize the ad playback. Visit [Plugin Render Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-render-options.html) for details.

## Links

### Plugin API

**[Brightcove Prebid Plugin API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**.

### Sample Implementations

Sample implementations are provided at:

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid in Header]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-header.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-prebid-body.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-third-party-ad-server.html)**

- **[Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-sample-custom-header-bidding.html)**

- **[Specifying Multiple Ad Breaks for a Video]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-multiad-options.html)**

</div>
