---
layout: page
title: Prebid Server Bidders
description: Get Started with Prebid Server
pid: 28
top_nav_section: dev_docs
nav_section: prebid-server
---
<style>
.output-workspace {
  margin-top: 3em;
}
</style>
<script type="text/javascript" src="{{site.baseurl}}/assets/js/prebid-server-api.js"></script>
<div class="bs-docs-section" markdown="1">

# Prebid Server Bidders

Prebid Server requires a different implementation for each demand source, so not all Prebid.js adapters are in Prebid Server, and vice versa.

All the Prebid Server bidders are listed below.

<ul id="prebid-server-bidder-list"></ul>

### Bidder Details

Use the dropdowns below to get more information about each.

<span>I want to </span>
<select id="purpose-dropdown">
  <option value="bidder-params">see the bidder params for</option>
  <option value="see-bugs">see open bugs for</option>
  <option value="file-bug">log a bug about</option>
</select>
<span> the </span>
<select id="bidder-dropdown"></select>
<span> adapter.</span>
<div id="output-workspace" class="output-workspace"></div>
</div>
<script type="text/javascript" async>
(function() {
    function newOption(text) {
      var element = document.createElement("option");
      element.value = text;
      element.innerHTML = text;
      return element;
    }
    function newButton(link, text) {
      var button = document.createElement("button");
      button.type = "button";
      button.innerHTML = text;
      button.addEventListener("click", function() {
        window.location = link;
      });
      return button;
    }
    function syncOutput() {
      var output = document.getElementById("output-workspace");
      output.innerHTML = "";
      var purpose = document.getElementById("purpose-dropdown").value;
      var bidder = document.getElementById("bidder-dropdown").value;
      if (purpose == "bidder-params") {
        var caveat = document.createElement("span");
        caveat.innerHTML = "Prebid Server enforces bidder params with <a href=\"https://spacetelescope.github.io/understanding-json-schema/\">JSON schemas.</a>. Today, the best documentation is the schema itself.";
        var button = newButton("https://github.com/prebid/prebid-server/blob/master/static/bidder-params/" + bidder + ".json", "show me the schema");
        output.appendChild(caveat);
        output.appendChild(document.createElement("br"));
        output.appendChild(document.createElement("br"));
        output.appendChild(button);
      } else if (purpose == "see-bugs") {
        var button = newButton("https://github.com/prebid/prebid-server/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug+%5B" + bidder + "%5D+in%3Atitle+", "Do it!");
        output.appendChild(button);
      } else if (purpose == "file-bug") {
        var button = newButton("https://github.com/prebid/prebid-server/issues/new?title=[" + bidder + "]+(your+bug+description+here)&body=Describe+the+bug+here.+Include+a+sample+request+if+possible.", "Do it!");
        output.appendChild(button);
      } else {
        output.innerHTML = "Uh oh! This option was never implemented. Please <a href=\"https://github.com/prebid/prebid.github.io/issues/new\">file a bug</a> or <a href=\"https://github.com/prebid/prebid.github.io/compare\">submit a PR</a> to fix it.";
      }
    }
    function onSuccess(bidders) {
        bidders.sort();
	// populate the unordered list
        var list = document.getElementById("prebid-server-bidder-list");
        for (var i = 0; i < bidders.length; i++) {
            var thisElement = document.createElement("li")
            thisElement.innerHTML = bidders[i]
            list.appendChild(thisElement)
        }
	// populate the dropdown
        var bidderDropdown = document.getElementById("bidder-dropdown");
        for (var i = 0; i < bidders.length; i++) {
            bidderDropdown.appendChild(newOption(bidders[i]));
        }
        // syncOutput() & event listeners can only be attached after we've fetched the bidders. Otherwise `bidder-dropdown.value` is null.
        document.getElementById("purpose-dropdown").addEventListener("change", syncOutput)
        document.getElementById("bidder-dropdown").addEventListener("change", syncOutput)
        syncOutput();
    }
    function onError(status, err) {
        var list = document.getElementById("prebid-server-bidder-list");
        var ulErr = document.createElement("span");
        ulErr.innerHTML = "<ul><strong>Failed to fetch Prebid Server adapters</strong>. HTTP status: " + status + ". error: " + err + "</ul>";
        list.parentNode.replaceChild(ulErr, list);


        var dropdown = document.getElementById("bidder-dropdown");
        var dropErr = document.createElement("span");
        dropErr.innerHTML = "{Error}";
        dropdown.parentNode.replaceChild(dropErr, dropdown);
    }

    pbs.fetchBidders(onSuccess, onError);
})();
</script>
