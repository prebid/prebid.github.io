---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a New Analytics Module

---
# Adding a New Analytics Module

This document describes how to add a new Analytics module to Prebid Server.

### 1. Define config params

Analytics modules are enabled through the [Configuration](/prebid-server/developers/configuration.html).
You'll need to define any properties in [config/config.go](https://github.com/prebid/prebid-server/blob/master/config/config.go)
which are required for your module.

### 2. Implement your module

Your new module belongs in the `analytics/{moduleName}` package. It should implement the `PBSAnalyticsModule` interface from
[analytics/core.go](https://github.com/prebid/prebid-server/blob/master/analytics/core.go)

### 3. Connect your Config to the Implementation

The `NewPBSAnalytics` function inside [analytics/config/config.go](https://github.com/prebid/prebid-server/blob/master/analytics/core.go) instantiates Analytics modules
using the app config. You'll need to update this to recognize your new module.

### Example

The [filesystem](https://github.com/prebid/prebid-server/tree/master/analytics/filesystem) module is provided as an example. This module will log dummy messages to a file.

It can be configured with:

```yaml
analytics:
  file:
    filename: "path/to/file.log
```

Prebid Server will then write sample log messages to the file you provided.
