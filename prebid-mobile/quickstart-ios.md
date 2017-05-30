---
layout: page
title: Quickstart
description: Quickstart
pid: 0
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
---

<div class="bs-docs-section" markdown="1">

# Quickstart
{:.no_toc}

Get started with Prebid Mobile by creating a Prebid Server account here--http://prebid.org/dev-docs/get-started-with-prebid-server.html

### Use cocoapods?

Easily include the Prebid Mobile SDK for your priamy ad server in your Podfile/

```objc
platform :ios, '8.0'

target 'MyAmazingApp' do 
    pod 'Prebid-Mobile-For-DFP'
    pod 'Prebid-Mobile-For-MoPub'
end
```

### Build framework from source

Build Prebid Mobile from source code. After cloning the repo, from the root directory run

```objc
./scripts/buildPrebidMobile.sh
```

to output the PrebidMobileForDFP and PrebidMobileForMoPub frameworks.

</div>
