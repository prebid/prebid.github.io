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

## Types of renderers

From Prebid 11.15 onward, publishers and adapters can specify their custom renderers in two ways: top window renderers (the old-fashioned way) and the new Safe Renderer approach. The latter has the significant advantage of executing renderer code inside the ad frame, where the ad markup and other important data are accessible within the frame context, whereas the old approach executed renderers in the top window. We strongly recommend using the new Safe Renderer approach whenever possible.

If both Safe Renderer and top window renderers are specified, the Safe Renderer takes precedence. You can also disable top window renderers through the top level configuration flag:

```javascript
pbjs.setConfig({ allowTopWindowRenderers: false })
```

## Renderer Implementation Levels

Renderers can be specified at multiple levels by specifying either `safeRenderer` or `renderer` field on one of the following levels:

1. MediaType Level `adUnit.mediaTypes.video|banner|native|audio`: If a renderer is associated with a specific mediaType (video, banner, audio or native), it will be used to display any demand associated with that mediaType. This is the preferred method for all ad types.
2. AdUnit Level `adUnit`: Applied to all bids for this ad unit that don't override it. This is a legacy approach; using the mediaType-level renderer is preferred.
3. Bidder Level `adUnit.bids[]`: Applied only to this bidder, overriding adUnit renderer if both exist.
4. Default: If no renderer is specified at any level, Prebid will use the default renderer for the media type, if one exists. For banner and native ads, Prebid.js has built-in default rendering capabilities.

### Priority Order

When multiple renderers are defined, the following priority is used:

1. MediaType Level renderer
2. AdUnit Level renderer
3. Bidder Level renderer
4. Default renderer

## Safe renderer

The Safe Renderer works similarly to the default Prebid renderer in that it is injected into the ad frame. The key difference is that it does not render the ad by itself. Instead, it loads an external renderer script using the URL specified in the Safe Renderer configuration. Once the script is loaded, the Safe Renderer executes the `window.pbRenderInFrame({ config, ...renderingData })` function, which must be defined by the external script

### Config object

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| -------------- | ---------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url` | Required | String | URL to the external renderer script that will be loaded and executed within Safe renderer |
| `config` | Optional | Object | Object that will be passed to external renderer script as a `config` field. For bid adapters use |
| `getConfig` | Optional | Function | Function that will evaluate `config` object accessible in external renderer script. For publisher's use. Accepts `bidResponse` as a parameter |

```javascript
const adUnits = [
      {
        mediaTypes: {
          video: {
            context: 'outstream',
            playerSize: [300, 250],
            mimes: ['video/mp4'],
            safeRenderer: {
              url: 'https://trafto.s3.eu-central-1.amazonaws.com/rendererV2.js',
              getConfig: (bidResponse) => {
                return {
                  configField: 'passed-from-adunit-config'
                }
              }
            },
          }
        },
        code: adUnitCode,
      }
    ];
```

### External script example implementation

Existing top level custom renderers can be easily migrated to work with the new Safe Renderer approach. The external script simply needs to define the `window.pbRenderInFrame` method and execute the rendering logic inside it. The function accepts a payload object containing `config` (either passed by bid adapters or evaluated by the publisher-provided `getConfig(bidResponse)` function), and [...renderingData](/dev-docs/renderer.html#renderingData).

```javascript
/* global YVAP */
/**
 * Reference implementation for `bid.safeRenderer.url`.
 * Prebid injects this script into the creative iframe and then calls `window.pbRenderInFrame(payload)`.
 */
window.pbRenderInFrame = function ({ config, ...renderingData }) {

  function yvapPlayerRender(b) {
      var safeAdId =
        b.adId != null && String(b.adId).length
          ? String(b.adId).replace(/[^a-zA-Z0-9_-]/g, '')
          : '';
      var targetNodeId =
        'pb-yvap-' +
        (safeAdId || 'slot-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9));
  
      var container = document.createElement('div');
      container.id = targetNodeId;
      if (b.width != null) {
        container.style.width =
          typeof b.width === 'number' ? b.width + 'px' : String(b.width);
      }
      if (b.height != null) {
        container.style.height =
          typeof b.height === 'number' ? b.height + 'px' : String(b.height);
      }
      document.body.appendChild(container);


      function initPlayer() {
        // eslint-disable-next-line no-new
          new YVAP({
            id: targetNodeId,
            player: {
              type: 'Outstream',
              controls: true,
              height: b.height,
              width: b.width
            },
            ads: {
              adTagXml: b.vastXml
            }
          });
      }
  
      if (window.YVAP) {
        initPlayer();
        return;
      }
  
      var script = document.createElement('script');
      script.src = 'https://s.yimg.com/kp/yvap/1.9.0/yvap.js';
      script.async = true;
      script.onload = function () {
        initPlayer();
      };
      script.onerror = function () {
        // eslint-disable-next-line no-console
        console.error('[Yahoo ADS bid adapter]: Outstream renderer script failed to load.');
      };
      var firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        (document.head || document.documentElement).appendChild(script);
      }    
    }

  yvapPlayerRender(renderingData);
};
```

<a id="renderingData"></a>

### Rendering data

{: .table .table-bordered .table-striped }
| Property | Description |
| ---------- | ------------- |
| `ad` | Ad markup |
| `adUrl` | Ad markup url |
| `width` | Width of the creative |
| `height` | Height of the creative |
| `instl` | Interstitial flag (`1` for interstitial, `0` for non-interstitial) |
| `vastXml` | The VAST XML content (if available instead of vastUrl) |
| `vastUrl` | URL to the VAST XML for video ads |
| `mediaType` | Type of media ('video', 'banner', etc.) |
| `safeRenderer` | Prepared Safe Renderer configuration (including `url` and related fields) used to load and run the external renderer script |

## Top window renderer 

### Config object

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
|--------------+----------+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url` | Required | String | URL to the renderer script that will be loaded. This script should create a renderer object in the global scope. |
| `render` | Required | Function | Function that tells Prebid.js how to invoke the renderer script to render a bid. The function receives the bid object as a parameter. |
| `backupOnly` | Optional | Boolean | if set to true, buyer or adapter renderer will be preferred |

### Special Cases

#### Banner with Custom Renderer

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

### Renderer Implementation Example

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

### Common Top window renderer Properties

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
