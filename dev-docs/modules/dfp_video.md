---
layout: page_v2
page_type: module
title: Module - Google Ad Manager Video
description: Addition of DFP Video to the Prebid package
module_code : dfpAdServerVideo
display_name : DFP Video
enable_download : true
sidebarType : 1
---



# DFP Video
{:.no_toc}

This module is required to use the Prebid Instream video examples with DFP Adserver. For instructions showing how to add this module to Prebid.js, see below.

### Step 1:  Prepare the base Prebid file as usual

The standard options:

- Build from a locally-cloned git repo
- Receive the email package from the Prebid [Download]({{site.baseurl}}/download.html) page

### Step 2: Integrate into your prebid.js configuration

The method exposes the [`pbjs.adServers.dfp.buildVideoUrl`]({{site.baseurl}}/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html) method to use. For an example, see the DFP video guide linked below.

## Further Reading

+ [Show Video Ads with DFP]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html)
