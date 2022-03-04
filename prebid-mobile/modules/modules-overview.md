---

layout: page_v2
title: Prebid Modules Overview
description: What is Prebid.js
sidebarType: 2

---

# Prebid Mobile Modules Overview

The design of Prebid Mobile is to provide a lightweight SDK with minimal logic, leveraging Prebid Server to handle requests for demand and a much logic as possible as far as auction dynamics go. Keeping with the spirit of this design principle, Prebid Mobile supports a modular architecture to add in new feature sets, that can potentially load the size of Prebid SDK, into components publishers can select to build when assembling their apps. Modularity follows the approach used across the Prebid suite of products (Prebid JS and Prebid Server) to help reduce the overall size of the prebid library/package.

This page will serve as the central location to link all modular packages, descriptions, and resources for modular links.

## Benefits and Features

Some of the benefits to the modular architecture are the following:

-   Allows the ability to customize the Prebid SDK to the developer needs
-   Allows for the reduced size of Prebid SDK, adding only modules need
-   Allows for the community to add custom and/or 3rd party code without adding code to the core of Prebid SDK
-   Reduces the size of Prebid SDK

## How It Works

The following diagram describes the overall architecture of modularity prior and after release of 1.12 for both iOS and Android. Both platforms share the same architecture.

![Modularity](/assets/images/prebid-mobile/modules/modularity.png)


Prior to Prebid SDK 1.12 there were two targets(PrebidMobile and PrebidMobileCore) which use the same product name and module name(PrebidMobile). These two modules are the same, they include the same source files. Since no new modules have been created prior to 1.12, new modules can be added and built 

1. Set a unique product name and module name for each product:
    * PrebidMobile instead of PrebidMobileCore. It will allows us to seamless migration because it doesn't cause breaking changes. All publishers which now use PrebidMobileCore or PrebidMobile don't need to replace module names in source files
    * PrebidMobileFull instead of PrebidMobile. PrebidMobileFull will not include any source files it will be just a name of dependency which will be responsible to add all sub-dependencies
1. Set dependencies between them
1. Edit final distribution binaries(FatFramework, CocoaPods, Carthage, SPM, cross-project dependency)

Usage:

```bash
import PrebidMobile
import PrebidMobileRendering
```


