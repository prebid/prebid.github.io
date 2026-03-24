---
layout: page_v2
page_type: module
title: Module - TargetVideo Video
description: Required for serving instream video through TargetVideo.
module_code : targetVideoAdServerVideo
display_name : TargetVideo Video Support
enable_download : true
vendor_specific: true
sidebarType : 1
---



# TargetVideo Video

{:.no_toc}

This module is required to use the Prebid Instream video examples with TargetVideo. For instructions showing how to add this module to Prebid.js, see below.

## Step 1:  Prepare the base Prebid file as usual

The standard options:

- Build from a locally-cloned git repo
- Receive the email package from the Prebid [Download](/download.html) page

## Step 2: Integrate into your prebid.js configuration

The method exposes the [`pbjs.adServers.targetVideo.buildVideoUrl`]({{site.baseurl}}/dev-docs/publisher-api-reference/adServers.targetVideo.buildVideoUrl.html) method to use. 
