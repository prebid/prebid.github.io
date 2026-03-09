---
layout: page_v2
title: Renderer
description: Renderer Reference
sidebarType: 1
---

# Renderer

## What is a Renderer?

A renderer provides publishers with precise control over how ads are displayed on their pages. It's especially valuable for video ads in non-video placements (such as outstream/in-renderer), but can be used with any media type.

In simple terms, a renderer offers publishers:

- The ability to customize how ads appear and behave
- A way to introduce new ad formats without disrupting user experience
- Control over maintaining design consistency between ads and site content

## Renderer Object

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
|--------------+----------+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url` | Required | String | URL to the renderer script that will be loaded. This script should create a renderer object in the global scope. |
| `render` | Required | Function | Function that tells Prebid.js how to invoke the renderer script to render a bid. The function receives the bid object as a parameter. |
| `backupOnly` | Optional | Boolean | if set to true, buyer or adapter renderer will be preferred |

## Renderer Implementation Levels

Renderers can be specified at multiple levels:

1. MediaType Level (adUnit.mediaTypes.video\|banner\|native.renderer): If a renderer is associated with a specific mediaType (video, banner, or native), it will be used to display any demand associated with that mediaType. This is the preferred method for all ad types.
2. AdUnit Level (adUnit.renderer): Applied to all bids for this ad unit that don't override it. This is a legacy approach; using the mediaType-level renderer is preferred.
3. Bidder Level (adUnit.bids[].renderer): Applied only to this bidder, overriding adUnit renderer if both exist.
4. Default: If no renderer is specified at any level, Prebid will use the default renderer for the media type, if one exists. For banner and native ads, Prebid.js has built-in default rendering capabilities.

### Priority Order

When multiple renderers are defined, the following priority is used:

1. MediaType Level renderer
2. AdUnit Level renderer
3. Bidder Level renderer
4. Default renderer

## Special Cases

### Banner with Custom Renderer

Although renderers are commonly associated with video ads, they can also be used with banner ads to create custom rendering experiences:

```javascript
pbjs.addAdUnits({
  code: "custom-banner-container",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
      renderer: {
        url: "https://cdn.example.com/banner-renderer.js",
        render: function (bid) {
          // Create an enhanced banner experience
          const bannerRenderer = new window.BannerRenderer({
            adUnitCode: bid.adUnitCode,
            adHtml: bid.ad,
            width: bid.width,
            height: bid.height,
            // Add animation effects
            effects: {
              fadeIn: true,
              duration: 300,
              onViewable: true,
            },
          });
          bannerRenderer.render();
        },
      },
    },
  },
  bids: [
    {
      bidder: "appnexus",
      params: {
        placementId: 13144370,
      },
    },
  ],
});
```

A banner renderer might be used to:

1. Add entrance/exit animations to standard banner ads
2. Implement viewability-triggered rendering
3. Create interactive enhancements to standard banner creatives
4. Apply custom styling or containers to maintain site design aesthetics
5. Implement fallback scenarios for different devices or browsers

## Renderer Implementation Example

```javascript
// Example of a secure custom banner renderer implementation
window.BannerRenderer = function (config) {
  return {
    render: function (bid) {
      // Get the container element
      const container = document.getElementById(config.adUnitCode);
      if (!container) return;

      // Create iframe to provide a secure environment
      const iframe = document.createElement("iframe");
      iframe.width = `${config.width}px`;
      iframe.height = `${config.height}px`;
      iframe.style.border = "none";
      iframe.style.transition = `opacity ${config.effects.duration}ms ease-in-out`;
      iframe.style.opacity = "0";
      iframe.title = "Advertisement";
      iframe.setAttribute("scrolling", "no");

      // Add iframe to container
      container.appendChild(iframe);

      // Set iframe content
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { margin: 0; padding: 0; overflow: hidden; }
            .ad-container { 
              width: 100%; 
              height: 100%; 
              position: relative;
              background-color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div class="ad-container">${bid.ad || ""}</div>
        </body>
        </html>
      `);
      iframeDoc.close();

      if (config.effects.onViewable) {
        // Set up IntersectionObserver for viewability-triggered effects
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Apply fade-in when ad comes into view
                iframe.style.opacity = "1";
                observer.disconnect(); // Only need to trigger once
              }
            });
          },
          { threshold: 0.5 }
        );

        observer.observe(container);
      } else {
        // Immediate fade-in
        setTimeout(() => {
          iframe.style.opacity = "1";
        }, 10);
      }

      // Cleanup function
      return {
        destroy: function () {
          if (container && iframe) {
            container.removeChild(iframe);
          }
        },
      };
    },
  };
};
```

## Common Renderer Properties

Here are commonly used properties from the bid object that can be accessed in the renderer:

{: .table .table-bordered .table-striped }
| Property | Description |
|--------------+------------------------------------------------------- |
| `adId` | Unique identifier for the bid |
| `adUnitCode` | The code for the ad unit |
| `vastUrl` | URL to the VAST XML for video ads |
| `vastXml` | The VAST XML content (if available instead of vastUrl) |
| `width` | Width of the creative |
| `height` | Height of the creative |
| `playerWidth` | Width of the video player |
| `playerHeight` | Height of the video player |
| `mediaType` | Type of media ('video', 'banner', etc.) |
| `cpm` | The bid's CPM |
| `ad` | Ad markup |
| `adUrl` | Ad markup url |
