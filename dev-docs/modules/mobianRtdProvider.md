---
layout: page_v2
title: Mobian Real-Time Data Provider
display_name: Mobian Prebid Brand Safety Evaluation
description: Mobian provides contextual brand safety evaluations of pages given a URL, which publishers can use for targeting as an alternative to keyword-based evaluation.
page_type: module
module_type: rtd
module_code : mobianRtdProvider
enable_download : true
vendor_specific: false
sidebarType : 1
---
# Mobian Brand Safety Module

Mobian uses AI to determine the GARM risk level of articles from our publisher partners.
This methodology is contextual, rather than keyword-based.
Our evaluation of articles is openly available through our API. This prebid header
exposes that API at prebid time so that advertisers can easily target articles with
the desired mobianGarmRisk
