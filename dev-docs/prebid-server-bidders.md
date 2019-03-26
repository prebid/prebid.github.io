---
layout: page_v2
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
.bidder-selection {
  margin-bottom: 1em;
}
.bidder-selection input {
  margin-right: 0.5em;
}
.bidder-fetch-error {
  margin-left: 40px;
}
</style>
<script type="text/javascript" src="{{site.baseurl}}/assets/js/prebid-server-api.js"></script>
<div class="bs-docs-section" markdown="1">

# Prebid Server Bidders

Prebid Server adapters aren't javascript, so not all Prebid.js adapters are available in Prebid Server, and vice versa. See [the docs](https://github.com/prebid/prebid-server/blob/master/docs/developers/add-new-bidder.md) for how to build a Prebid Server adapter.

All the Prebid Server bidders are listed below. Select one, and then choose an option for more details.

<fieldset id="bidder-selection" class="bidder-selection">
  <legend>Choose a Bidder from the list</legend>
</fieldset>

<strong>Then select the option which applies to you...</strong>

<span>I want to </span>
<select id="purpose-dropdown">
  <option value="see-details">see details about</option>
  <option value="bidder-params">see the bidder params for</option>
  <option value="see-bugs">see open bugs involving</option>
  <option value="file-bug">log a bug about</option>
</select>
<span id="selected-bidder"></span>
<div id="output-workspace" class="output-workspace"></div>
</div>
<script type="text/javascript" async>
(function() {
    function addBidder(parentNode, bidder, checked) {
      var inputNode = document.createElement("input");
      inputNode.type = "radio";
      inputNode.id = bidder + "-choice";
      inputNode.name = "bidder";
      if (checked) {
        inputNode.checked = true;
      }
      parentNode.appendChild(inputNode);
      var labelNode = document.createElement("label");
      labelNode.htmlFor = inputNode.id;
      labelNode.innerHTML = bidder;
      parentNode.appendChild(labelNode);
      parentNode.appendChild(document.createElement("br"));
    }
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
        window.open(link);
      });
      return button;
    }
    function newParagraph(text) {
      var p = document.createElement("p");
      p.textContent = text;
      return p;
    }
    function makeList(elements) {
      var ul = document.createElement("ul");
      for (var i = 0; i < elements.length; i++) {
        var li = document.createElement("li");
        li.textContent = elements[i];
        ul.appendChild(li);
      }
      return ul;
    }
    function getSelectedBidder() {
      var radios = document.getElementsByName('bidder');
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          return radios[i].id.substring(0, radios[i].id.length - 7);
        }
      }
    }
    function syncOutput(payload) {
      var output = document.getElementById("output-workspace");
      output.innerHTML = "";
      function showBidderInfo(info) {
        output.appendChild(newParagraph("Contact email: " + info.maintainer.email));
        function printCapabilities(capabilities, source, client) {
          if (capabilities) {
            output.appendChild(newParagraph("For " + source + " traffic, this bidder supports the following Media Types:"));
            output.appendChild(makeList(capabilities.mediaTypes));
          } else {
            output.appendChild(newParagraph("This bidder does not support " + source + " traffic. Don't use it in " + client + "."));
          }
        }
        printCapabilities(info.capabilities.site, "Web", "Prebid.js");
        printCapabilities(info.capabilities.app, "Mobile App", "Prebid Mobile");
      }
      function onBidderInfoErr(status, err) {
        var errMsg = document.createElement("p");
        errMsg.innerHTML = "Failed to fetch bidder info. Try again later. HTTP status: " + status + ", body: " + err;
        output.appendChild(errMsg);
      }
      var purpose = document.getElementById("purpose-dropdown").value;
      var bidder = getSelectedBidder();
      document.getElementById("selected-bidder").innerHTML = bidder;
      if (purpose === "bidder-params") {
        var caveat = document.createElement("span");
        caveat.innerHTML = "Prebid Server enforces bidder params with <a href=\"https://spacetelescope.github.io/understanding-json-schema/\">JSON schemas.</a>. Today, the best documentation is the schema itself.";
        var button = newButton("https://github.com/prebid/prebid-server/blob/master/static/bidder-params/" + bidder + ".json", "show me the schema");
        output.appendChild(caveat);
        output.appendChild(document.createElement("br"));
        output.appendChild(document.createElement("br"));
        output.appendChild(button);
      } else if (purpose === "see-details") {
        pbs.fetchBidderInfo(bidder, showBidderInfo, onBidderInfoErr);
      } else if (purpose === "see-bugs") {
        var button = newButton("https://github.com/prebid/prebid-server/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug+%5B" + bidder + "%5D+in%3Atitle+", "Do it!");
        output.appendChild(button);
      } else if (purpose === "file-bug") {
        var button = newButton("https://github.com/prebid/prebid-server/issues/new?title=[" + bidder + "]+(your+bug+description+here)&body=Describe+the+bug+here.+Include+a+sample+request+if+possible.", "Do it!");
        output.appendChild(button);
      } else {
        output.innerHTML = "Uh oh! This option was never implemented. Please <a href=\"https://github.com/prebid/prebid.github.io/issues/new\">file a bug</a> or <a href=\"https://github.com/prebid/prebid.github.io/compare\">submit a PR</a> to fix it.";
      }
    }
    function onSuccess(bidders) {
        bidders.sort();
        var bidderList = document.getElementById("bidder-selection");
        for (var i = 0; i < bidders.length; i++) {
            addBidder(bidderList, bidders[i], i === 0)
        }
        // syncOutput() & event listeners can only be attached after we've fetched the bidders. Otherwise `bidder-dropdown.value` is null.
        document.getElementById("purpose-dropdown").addEventListener("change", syncOutput)
        document.getElementById("bidder-selection").addEventListener("change", syncOutput)
        syncOutput();
    }
    function onError(status, err) {
        var selection = document.getElementById("bidder-selection");
        var errElement = document.createElement("p");
        errElement.className = "bidder-fetch-error"
        errElement.innerHTML = "<strong>Failed to fetch adapters from Prebid Server.</strong> Try reloading the page. HTTP status: " + status + ". error: " + err;
        selection.parentNode.replaceChild(errElement, selection)
    }

    pbs.fetchBidders(onSuccess, onError);
})();
</script>
