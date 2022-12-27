---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developer | Build An Analytics Adapter

---

# Prebid Server - Building an Analytics Adapter
{: .no_toc}

There aren't any open sourced analytics adapters for Prebid Server, 
but there is an internal interface that host companies can use to
integrate their own modules.

Below is an outline of how it's done for both versions of the server.

{: .alert.alert-warning :}
Analytics adapters are subject to a number of specific technical rules. Please become familiar
with the [module rules](/dev-docs/module-rules.html) that apply globally and to analytics adapters in particular.

* TOC
{:toc }

## Adding an Analytics Adapter in PBS-Go

1. Define config params

Analytics modules are enabled through Viper [configuration](https://github.com/prebid/prebid-server/blob/master/docs/developers/configuration.md).
You'll need to define any properties in config/config.go which are required for your module.

2. Implement your module
Your new module belongs in the analytics/{moduleName} package. It should implement the `PBSAnalyticsModule` interface from analytics/core.go

3. Connect your Config to the Implementation
The `NewPBSAnalytics()` function inside analytics/config/config.go instantiates Analytics modules using the app config. You'll need to update this to recognize your new module.

### Example
{:.no_toc}

A simple [filesystem](https://github.com/prebid/prebid-server/tree/master/analytics/filesystem) analytics module is provided as an example. This module will log dummy messages to a file.

It can be configured with:

```
analytics:
  file:
    filename: "path/to/file.log
```
Prebid Server will then write sample log messages to the file you provided.

## Adding an Analytics Adapter in PBS-Java

1. Define config params
Analytics modules are enabled through the [Configuration](https://github.com/prebid/prebid-server-java/blob/master/docs/config.md).

2. Implement your module
Your new module org.prebid.server.analytics.{module}AnalyticsReporter needs to implement the org.prebid.server.analytics.AnalyticsReporter interface.

3. Add your implementation to Spring Context
In order to make Prebid Server aware of the new analytics module it needs to be added to the Spring Context in org.prebid.server.spring.config.AnalyticsConfiguration as a bean.

### Example
{:.no_toc}

The [log module](https://github.com/prebid/prebid-server-java/blob/c5e7782b15c3bd47267a9268fd25a21a8bf34d98/src/main/java/org/prebid/server/analytics/reporter/log/LogAnalyticsReporter.java) is provided as an example. This module will write dummy messages to a log.

It can be configured with:

```
analytics:
  log:
    enabled: true
```

Prebid Server will then write sample log messages to the log.
