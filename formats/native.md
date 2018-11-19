---

layout: page_v2
title: Prebid Native
description: Prebid Native
pid: 1
sidebarType: 7

---

# Prebid Native Ads
{:.no_toc}

Native ads are supported by Prebid.js for mobile web. Prebid Server support is coming soon.

## Prebid.js

### Adops

- [Setting up Prebid Native in DFP](/adops/setting-up-prebid-native-in-dfp.html)

### Developers

- [Setting up Prebid Native](/dev-docs/show-native-ads.html)

### Prebid.js bid adapters that support the Native format

<div id="dynamicTable"></div>

<script type="text/javascript">
var cellContents=[];

{% assign numNative = 0 %}
{% assign nativeBidders = "" %}
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for page in bidder_pages %}
{% if page.media_types contains 'native' and page.prebid_1_0_supported %}
cellContents[{{numNative}}]={};
cellContents[{{numNative}}].href="/dev-docs/bidders.html#{{page.biddercode}}";
cellContents[{{numNative}}].text="{{page.biddercode}}";
   {% assign numNative = numNative | plus: 1 %}
{% endif %}
{% endfor %}

var numCols=4;
if ($(window).width() <= 414) {
   numCols=1;
} else if ($(window).width() <= 768) {
   numCols=2;
}

var numRows=Math.round((cellContents.length / numCols)+0.5)-1;

  var destDiv = document.getElementById('dynamicTable');
  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('class', 'table table-bordered table-striped');
  var tbdy = document.createElement('tbody');
  for (var r = 0; r < numRows; r++) {
    var tr = document.createElement('tr');
    for (var c = 0; c < numCols; c++) {
        var td = document.createElement('td');
	var idx=(r + (c*numRows));
	if (idx < cellContents.length) {
		var aTag = document.createElement('a');
		aTag.setAttribute('href',cellContents[idx].href);
		aTag.innerHTML = cellContents[idx].text;
            	td.appendChild(aTag);
	} else {
	    	td.appendChild(document.createTextNode('&nbsp;'));
	}
        tr.appendChild(td)
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  destDiv.appendChild(tbl)
</script>
