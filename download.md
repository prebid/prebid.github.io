---
layout: page_v2
title: Download Prebid.js
description: Documentation on how to download Prebid.js for header bidding.
sidebarType: 0
---

<script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>

<script>

  getVersionList();

$(function(){
  $('#myModal').on('show.bs.modal', function (e) {
    var form_data = get_form_data();
    if(form_data.modules.length < 1){
      alert('Please select at least 1 bidder');
      return e.preventDefault() // stops modal from being shown
    }
    return;
  });

  // show all adapters
  $('.adapters .col-md-4').show();
});

function getVersionList() {
  $.ajax({
      type: "GET",
      url: "http://js-download.prebid.org/versions",
  })
  .success(function(data) {
    try{
      data = JSON.parse(data);
      var versions = data.versions;
      if(!versions || versions.length === 0) {
        showError();
        return;
      }
      versions.forEach(function(version, index){
        if(index === 0) {
          $('.selectpicker').append('<option value="'+version+'">'+version+' - latest </option>');
        }
        else{
          if(version.match(/\d\.\d+\.\d+/i)){
            $('.selectpicker').append('<option value="'+version+'">'+version+'</option>');
          }
          else{
            // $('.selectpicker').append('<option value="'+version+'">'+version+' - deprecated</option>');
          }
        }
      });
    }
    catch(e) {
      console.log(e);
      showError();
    }

  })
  .fail(function(e) {
    console.log(e);
    showError();
  });
  function showError(){
     $('.selectpicker').append('<option value="error">Error generating version list. Please try again later</option>');
  }
}

function submit_download() {
    var form_data = get_form_data();

    var alertStatus = $('#download-status');

    alertStatus.addClass('hide');

    $('#download-button').html('<i class="glyphicon glyphicon-send"></i> Sending Request...').addClass('disabled');
    alertStatus.html('Request sent! This should only take a few moments!');
    alertStatus.removeClass('hide');
    $.ajax({
        type: "POST",
        url: "http://js-download.prebid.org/download",
        //dataType: 'json',
        data: form_data
    })
    .success(function(data, textStatus, jqXHR) {
      var buttn = $('#download-button');
      //buttn.addClass('btn-success');
      buttn.html('<i class="glyphicon glyphicon-ok"></i> Prebid.js file successfully generated!');
      alertStatus.addClass('hide');
      // Try to find out the filename from the content disposition `filename` value
      var filename = "prebid" + form_data['version'] + ".js";
      // this doens't work in our current jquery version.
      var disposition = jqXHR.getResponseHeader('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
      }
      // The actual download
      var blob = new Blob([data], { type: 'text/javascript' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .fail(function(e) {
      errorO = e;
      console.log(e);
      var buttn = $('#download-button');
      buttn.html('<i class="glyphicon glyphicon-envelope"></i> Receive Prebid.js');
      buttn.removeClass('disabled');
      alert('Ran into an issue.');
    });
}

function get_form_data() {
    var bidders = [];
    var analytics = [];
    var version = $('.selectpicker').val();

    var bidder_check_boxes = $('.bidder-check-box');
    for (var i = 0; i < bidder_check_boxes.length; i++) {
        var box = bidder_check_boxes[i];
        if (box.checked) {
            bidders.push(box.getAttribute('moduleCode'));
        }
    }

    var analytics_check_boxes = $('.analytics-check-box');
    for (var i = 0; i < analytics_check_boxes.length; i++) {
        var box = analytics_check_boxes[i];
        if (box.checked) {
            analytics.push(box.getAttribute('analyticscode') + 'AnalyticsAdapter');
        }
    }

    var form_data = {};
    form_data['modules'] = bidders.concat(analytics);
    form_data['version'] = version;

    return form_data;
}


</script>

<style>
.disabled {
  color: #aaa;
}
</style>

<div class="bs-docs-section" markdown="1">

# Customize and Download Prebid.js

{: .lead :}
To improve the speed and load time of your site, build Prebid.js for only the header bidding partners you choose.

### Option 1: Customize your download here

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% assign module_pages = site.pages | where: "page_type", "module" %}

{: .alert.alert-success :}
Note: If you receive an error during download you most likely selected a configuration that is not supported. Verify that each bidder / module is available in the selected version.

<form>
<div class="row">
<h4>Select Prebid Version</h4>
<select id="version_selector" class="selectpicker">
</select>

<h4>Select Bidder Adapters</h4>
<div class="adapters">
{% for page in bidder_pages %}
  {% if page.s2s_only == true %}
    {% continue %}
  {% endif %}
<div class="col-md-4">
 <div class="checkbox">
  <label>
  {% if page.aliasCode %}
    <input type="checkbox" moduleCode="{{ page.aliasCode }}BidAdapter" class="bidder-check-box"> {{ page.title }}
  {% else %}
    <input type="checkbox" moduleCode="{{ page.biddercode }}BidAdapter" class="bidder-check-box"> {{ page.title }}
  {% endif %}

    </label>

</div>
</div>
{% endfor %}
</div>
</div>

<br>
<div class="row">
  <h4>Analytics Adapters</h4>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="adagio" class="analytics-check-box"> Adagio Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="adkernelAdn" class="analytics-check-box"> Adkernel Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="adomik" class="analytics-check-box"> Adomik Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="adxcg" class="analytics-check-box"> Adxcg Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="adxpremium" class="analytics-check-box"> AdxPremium Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="appier" class="analytics-check-box"> Appier Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="datablocks" class="analytics-check-box"> Datablocks Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="eplanning" class="analytics-check-box"> Eplanning Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="finteza" class="analytics-check-box" /> Finteza Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="google" class="analytics-check-box"> Google Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="invisibly" class="analytics-check-box"> Invisibly Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="livewrapped" class="analytics-check-box"> Livewrapped Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="marsmedia" class="analytics-check-box"> Marsmedia Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="openx" class="analytics-check-box" /> OpenX Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="prebidmanager" class="analytics-check-box" /> Prebid Manager
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="pubwise" class="analytics-check-box"> PubWise.io Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="pulsepoint" class="analytics-check-box"> PulsePoint
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="realvu" class="analytics-check-box"> Realvu Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="rivr" class="analytics-check-box" /> Rivr Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="roxot" class="analytics-check-box"> Prebid Analytics by Roxot
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="scaleable" class="analytics-check-box"> Scaleable.ai Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="sigmoid" class="analytics-check-box"> Sigmoid Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="sharethrough" class="analytics-check-box"> Sharethrough
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="sortable" class="analytics-check-box" /> Sortable Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="sovrn" class="analytics-check-box" /> Sovrn Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="staq" class="analytics-check-box" /> STAQ Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="vuble" class="analytics-check-box"> Vuble Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="yieldone" class="analytics-check-box"> Platform One Analytics
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" analyticscode="yuktamedia" class="analytics-check-box"> yuktamedia Analytics
    </label>
  </div>
</div>

</div>
<br/>
<div class="row">
 <h4>Modules</h4>
 {% for page in module_pages %}
  {% if page.enable_download == false %}
    {% continue %}
  {% endif %}
 <div class="col-md-4">
 <div class="checkbox">
  <label> <input type="checkbox" moduleCode="{{ page.module_code }}" class="bidder-check-box"> {{ page.display_name }}</label>
</div>
</div>
 {% endfor %}
<div class="col-md-4"><div class="checkbox">
<label><input type="checkbox" moduleCode="digiTrustIdSystem" class="bidder-check-box"> User ID: DigiTrust ID</label>
</div></div>
<div class="col-md-4"><div class="checkbox">
<label><input type="checkbox" moduleCode="id5IdSystem" class="bidder-check-box"> User ID: ID5 ID</label>
</div></div>
<div class="col-md-4"><div class="checkbox">
<label><input type="checkbox" moduleCode="criteoIdSystem" class="bidder-check-box"> User ID: Criteo ID</label>
</div></div>
<div class="col-md-4"><div class="checkbox">
<label><input type="checkbox" moduleCode="identityLinkIdSystem" class="bidder-check-box"> User ID: IdentityLink ID</label>
</div></div>
</div>

<br>

<div class="form-group">

<button type="button" class="btn btn-lg btn-primary" data-toggle="modal" data-target="#myModal" onclick="submit_download()">Get Prebid.js! </button>

</div>

</form>

</div>

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">

        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>

        <h4 class="modal-title" id="myModalLabel">Download Custom Built Prebid.js</h4>
      </div>

      <div class="modal-body">

        <div class="lead">
          Downloading Prebid.js...
        </div>

        <div class="form-group">
            <button type="button" id="download-button" class="btn btn-lg btn-primary" onclick="submit_download()"><i class="glyphicon glyphicon-envelope"></i> Download Prebid.js</button>
        </div>

        <div class="alert alert-warning hide" role="alert" id="download-status"></div>

        <p>
        Ran into problems? Email <code>support@prebid.org</code>
        </p>

      </div>


    </div>

  </div>
</div>

<div class="bs-docs-section" markdown="1">

### Option 2: Build from Source Code (More Advanced)

{: .lead :}
Alternatively, you can build Prebid.js from the source code. For instructions, see the [Prebid.js README on GitHub](https://github.com/prebid/Prebid.js/blob/master/README.md).
