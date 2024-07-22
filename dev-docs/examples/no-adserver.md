---
layout: example
title: No Adserver Example
left_nav_override: Examples
description: Running Prebid.js without an ad server
sidebarType: 1

about:
- This example demonstrates running an auction and rendering without an ad server.

jsfiddle_link: jsfiddle.net/Prebid_Examples/svumodbe/embedded/html,result

---

## Basic Prebid.js Example

{% include prebidjs-non-prod.html %}
{% include gptjs.html %}

{% capture htmlCodePrebid %}<h5>test-div</h5>
<div id='test-div'></div>
<h5>test-div2</h5>
<div id='test-div2'></div>
{% endcapture %}

{% capture jsCode %}var adUnits = [
    {
        code: 'test-div',
        mediaTypes: {
            banner: {
                sizes: [[300,250]]
            }
        },
        bids: [
            {
                bidder: 'appnexus',
                params: {
                    placementId: 13144370
                }
            }
        ]
    },
    {
        code: 'test-div2',
        mediaTypes: {
            banner: {
                sizes: [[728,90]]
            }
        },
        bids: [
            {
                bidder: 'appnexus',
                params: {
                    placementId: 13144370
                }
            }
        ]
    }
];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
});

// you could instead pass an array of adUnits
// to getHighestCpmBids() if desired
function renderAllAdUnits() {
    var winners=pbjs.getHighestCpmBids();
    for (var i = 0; i < winners.length; i++) {
        renderOne(winners[i]);
    }
}

function renderOne(winningBid) {
if (winningBid && winningBid.adId) {
    var div = document.getElementById(winningBid.adUnitCode);
    if (div) {
        const iframe = document.createElement('iframe');
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        iframe.marginHeight = '0';
        iframe.marginHeight = '0';
        iframe.name = `prebid_ads_iframe_${winningBid.adUnitCode}`;
        iframe.title = '3rd party ad content';
        iframe.sandbox.add(
            'allow-forms',
            'allow-popups',
            'allow-popups-to-escape-sandbox',
            'allow-same-origin',
            'allow-scripts',
            'allow-top-navigation-by-user-activation'
        );
        iframe.setAttribute('aria-label', 'Advertisment');
        iframe.style.setProperty('border', '0');
        iframe.style.setProperty('margin', '0');
        iframe.style.setProperty('overflow', 'hidden');
            div.appendChild(iframe);
            const iframeDoc = iframe.contentWindow.document;
            pbjs.renderAd(iframeDoc, winningBid.adId);

        // most browsers have a default margin of 8px . We add those after prebid has written to the iframe.
        // internally prebid uses document.write or inserts an element. Either way, this is safe to do here.
        // document.write is sync.
        // see https://github.com/prebid/Prebid.js/blob/92daa81f277598cbed486cf8be01ce796aa80c8f/src/prebid.js#L555-L588

        // you may also use "all: unset".
        // @see https://www.youtube.com/shorts/z47iLmBeRXY

        const normalizeCss = `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}details,main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}[hidden],template{display:none}`;
        const iframeStyle = iframeDoc.createElement('style');
        iframeStyle.appendChild(iframeDoc.createTextNode(normalizeCss));
        iframeDoc.head.appendChild(iframeStyle);
        }
    }
}
pbjs.que.push(function() {
    pbjs.requestBids({
        timeout: 2000,
        bidsBackHandler: renderAllAdUnits
    });
});
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
