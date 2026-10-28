---
layout: example
title: Prebid as Ad Server with Cross-Origin Rendering
left_nav_override: Examples
description: Running Prebid.js as an ad server and rendering ads in cross-origin frames
sidebarType: 1

about:
- This example extends <a href="/dev-docs/examples/no-adserver.html">Running Prebid.js as an ad server</a>. Each winning ad is rendered in a cross-origin frame, so the creative can't access the publisher page, similar to the isolation a SafeFrame provides.
- The frame runs the creative script Prebid.js uses for cross-domain rendering (<a href="https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/x-domain/creative.html">integrationExamples/gpt/x-domain/creative.html</a>), loaded from a <code>data:</code> URL, so no extra hosting is needed.
- Creatives get an opaque origin, so they can't use cookies or local storage, and the SafeFrame <code>$sf</code> API isn't provided. See the notes below the example.

---

## Cross-Origin Rendering Example

{% capture htmlCodePrebid %}<h5>test-div</h5>
<div id='test-div'></div>
<h5>test-div2</h5>
<div id='test-div2'></div>

<!-- Creative script from Prebid.js integrationExamples/gpt/x-domain/creative.html -->
<script type="text/plain" id="prebid-creative-script">(()=>{const e="Prebid Request",n="Prebid Response",t="Prebid Event",r="adRenderFailed",o="adRenderSucceeded",s=(()=>{const e={frameBorder:0,scrolling:"no",marginHeight:0,marginWidth:0,topMargin:0,leftMargin:0,allowTransparency:"true"};return(n,t)=>{const r=n.createElement("iframe");return Object.entries(Object.assign({},t,e)).forEach(([e,n])=>r.setAttribute(e,n)),r}})();function a(e){return!!e.frames.__pb_locator__}window.pbRender=function(i){let c=i.parent;try{for(;c!==i.top&&!a(c);)c=c.parent;a(c)||(c=i.parent)}catch(e){}return function({adId:a,pubUrl:d,...p}){const u=new URL(d,window.location).origin;function l(e,n,t){const r=new MessageChannel;r.port1.onmessage=f(t),c.postMessage(JSON.stringify(Object.assign({message:e,adId:a},n)),u,[r.port2])}function g(e){l(t,{event:r,info:{reason:e?.reason||"exception",message:e?.message}}),e?.stack&&console.error(e)}function f(e){return function(){try{return e.apply(this,arguments)}catch(e){g(e)}}}l(e,{options:p},function(e){let r;try{r=JSON.parse(e.data)}catch(e){return}if(r.message===n&&r.adId===a){const e=s(i.document,{width:0,height:0,style:"display: none"});e.onload=f(function(){const n=e.contentWindow;n.Promise.resolve(n.render(r,{sendMessage:l,mkFrame:s},i)).then(()=>l(t,{event:o}),g)}),e.srcdoc=`<script>${r.renderer}<\/script>`,i.document.body.appendChild(e)}})}}(window)})();</script>
{% endcapture %}

{% capture jsCode %}var adUnits = [
    {
        code: 'test-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            }
        },
        bids: [
            {
                bidder: 'msft',
                params: {
                    placement_id: 13144370
                }
            }
        ]
    },
    {
        code: 'test-div2',
        mediaTypes: {
            banner: {
                sizes: [[728, 90]]
            }
        },
        bids: [
            {
                bidder: 'msft',
                params: {
                    placement_id: 13144370
                }
            }
        ]
    }
];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        timeout: 2000,
        bidsBackHandler: function() {
            pbjs.getHighestCpmBids().forEach(renderInCrossOriginFrame);
        }
    });
});

// The document loaded into each ad frame: Prebid's cross-domain creative script, then a call
// that asks this page's Prebid.js (identified by pubUrl) to render the given ad.
function creativeDocument(winningBid) {
    var creativeScript = document.getElementById('prebid-creative-script').textContent;
    var renderArgs = JSON.stringify({
        adId: winningBid.adId,
        pubUrl: window.location.href
    });
    // '\x3C' is '<', escaped so that this code can also be shown as text on the page
    return '\x3C!doctype html>\x3Chtml>\x3Cbody style="margin:0">' +
        '\x3Cscript>' + creativeScript + '\x3C/script>' +
        '\x3Cscript>pbRender(' + renderArgs + ');\x3C/script>' +
        '\x3C/body>\x3C/html>';
}

function renderInCrossOriginFrame(winningBid) {
    var div = document.getElementById(winningBid.adUnitCode);
    if (!div || !winningBid.adId) {
        return;
    }
    var iframe = document.createElement('iframe');
    iframe.width = winningBid.width;
    iframe.height = winningBid.height;
    iframe.scrolling = 'no';
    iframe.title = '3rd party ad content';
    iframe.setAttribute('aria-label', 'Advertisement');
    iframe.style.border = '0';
    // A data: URL document has its own opaque origin, so the creative can't reach this page.
    // allow-same-origin keeps that opaque origin (it doesn't grant this page's origin); it's needed
    // because the creative script renders the ad in a nested frame it has to script.
    iframe.sandbox = 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation';
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(creativeDocument(winningBid));
    div.appendChild(iframe);
}
{% endcapture %}

{% include code/web-example.html id="cross-origin-prebid-example" html=htmlCodePrebid js=jsCode scripts="pbjs" %}

## How It Works

1. The auction runs as in [Running Prebid.js as an ad server](/dev-docs/examples/no-adserver.html).
1. Instead of calling `pbjs.renderAd` on a same-origin frame, the page creates an iframe whose `src` is a `data:` URL containing the creative script and a `pbRender({ adId, pubUrl })` call.
1. The creative script asks Prebid.js on the parent page for the ad with `postMessage` and a `MessageChannel` port. `pubUrl` tells it which origin to send the request to.
1. Prebid.js answers over the port with the ad and its renderer, and the creative script renders the ad inside the frame. `adRenderSucceeded` and `adRenderFailed` events fire on the page as usual.

## Notes

- **Isolation:** the frame's origin is opaque (`null`), so the creative can't read or change the publisher's DOM, cookies or storage. The only channel to the page is Prebid's rendering messages.
- **Storage:** with an opaque origin, `document.cookie` and `localStorage` throw. Creatives that need them should be rendered from a real origin instead: host the creative document (for example a copy of `creative.html` that reads `adId` and `pubUrl` from its URL) on a separate domain, and use that URL as the iframe `src`. This is the model GAM SafeFrames use.
- **Sandbox:** don't drop `allow-same-origin`. Without it, the nested frame the creative script renders into gets a different opaque origin, and rendering fails with a cross-origin error.
- **SafeFrame API:** this example isolates creatives but doesn't provide the IAB SafeFrame `$sf.ext` API (expand, geometry, viewability). Creatives that depend on it won't be able to expand.
- **Sizes:** the frame is sized from the winning bid's `width` and `height`.
