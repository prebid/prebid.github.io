---
layout: page_v2
title: Download Prebid.js
description: Documentation on how to download Prebid.js for header bidding.
sidebarType: 0
---

<style>
a.tip {
    border-bottom: 1px dashed;
    text-decoration: none
}
a.tip:hover {
    cursor: help;
    position: relative
}
a.tip span {
    display: none
}
a.tip:hover span {
    border: #c0c0c0 1px dotted;
    padding: 5px 20px 5px 5px;
    display: block;
    z-index: 100;
    left: 0px;
    background: #f0f0f0;
    margin: 10px;
    width: 300px;
    position: absolute;
    top: 10px;
    text-decoration: none
}
</style>

<script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>

<script>
var currentUrl = new URL(window.location);
var searchParams = currentUrl.searchParams;

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
  setPrepickedModules()
});

function getVersionList() {
  $.ajax({
      type: "GET",
      url: "https://js-download.prebid.org/versions",
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
      setPrepickedVersion();
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
        url: "https://js-download.prebid.org/download",
        dataType: 'text',
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
      if (form_data['removedModules'].length > 0) {
        alert("The following modules were removed from your download because they aren't present in Prebid.js version "+form_data['version']+": "+JSON.stringify(form_data['removedModules']));
      }
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
    var removedModules = [];

    var version_restrictions=$('.version-restriction');
    for (var i = 0; i < version_restrictions.length; i++) {
        var module=version_restrictions[i].getAttribute('moduleCode');
        var restriction_name=version_restrictions[i].getAttribute('name');
        var restriction_value=version_restrictions[i].getAttribute('value');
        if (restriction_name == "min-version") {
          var module_version_array=restriction_value.split(".");
          var pbjs_version_array=version.split(".");
          if ((Number(pbjs_version_array[0]) < Number(module_version_array[0])) ||
              (Number(pbjs_version_array[0]) == Number(module_version_array[0]) &&
               Number(pbjs_version_array[1]) < Number(module_version_array[1]))) {
              removedModules.push(module);
          }
        }
    }

    var bidder_check_boxes = $('.bidder-check-box');
    for (var i = 0; i < bidder_check_boxes.length; i++) {
        var box = bidder_check_boxes[i];
        var module=box.getAttribute('moduleCode');
        if (box.checked && !removedModules.includes(module)) {
            bidders.push(module);
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
    form_data['removedModules'] = removedModules;

    return form_data;
}

function setPrepickedModules() {
    var moduleCheckboxes = document.querySelectorAll('.module-check-box');
    var modules = [];
    var modulesParam = searchParams.get('modules');
    if (modulesParam) {
        modules = modulesParam.split(',');
    }
    if (modules && modules.length) {
        moduleCheckboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
        modules.forEach(function(module) {
            var checkbox = document.getElementById(module);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    moduleCheckboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var module = checkbox.id;
            if (!modules.includes(module)) {
                modules.push(module);
            }
        }
        checkbox.addEventListener('change', function(event) {
            var module = event.target.id;
            if (event.target.checked) {
                modules.push(module);
            } else {
                modules = modules.filter(function(m) {
                    return m !== module;
                });
            }
            if (modules.length) {
                searchParams.set('modules', modules.join(','));
            } else {
                searchParams.delete('modules');
            }
            window.history.replaceState(null, '', currentUrl);
        });
    });
}

function setPrepickedVersion() {
    var version = searchParams.get('version');
    if (version) {
        var versionOption = document.querySelector('#version_selector option[value="' + version + '"]');
        if (versionOption) {
            versionOption.selected = true;
        }
    }
    var versionSelector = document.getElementById('version_selector');
    if (versionSelector) {
        versionSelector.addEventListener('change', function(event) {
            var version = event.target.value;
            searchParams.set('version', version);
            window.history.replaceState(null, '', window.location.pathname + '?' + searchParams.toString());
        });
    }
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

{: .alert.alert-warning :}
Prebid.js is open source software that is offered for free as a convenience. While it is designed to help companies address legal requirements associated with header bidding, we cannot and do not warrant that your use of Prebid.js will satisfy legal requirements. You are solely responsible for ensuring that your use of Prebid.js complies with all applicable laws.  We strongly encourage you to obtain legal advice when using Prebid.js to ensure your implementation complies with all laws where you operate.

{: .alert.alert-danger :}
**Note:** recommended modules are now checked by default. Please uncheck them as desired.

## Option 1: Customize your download here

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% assign module_pages = site.pages | where: "page_type", "module" %}
{% assign analytics_pages = site.pages | where: "layout", "analytics" %}
{% assign userid_pages = site.pages | where: "layout", "userid" %}

<form>
<h4>Select Prebid Version</h4>
<select id="version_selector" class="selectpicker">
</select>
<br>
<h4>Select Bidder Adapters</h4>
<div class="row adapters">
{% for page in bidder_pages %}{% if page.pbjs == true %}{% if page.enable_download == false %}{% continue %}{% endif %}
<div class="col-md-4">
 <div class="checkbox">
  <label>
  {% if page.filename %} <input type="checkbox" id="{{ page.filename }}" moduleCode="{{ page.filename }}" {% elsif page.aliasCode %} <input type="checkbox" id="{{ page.biddercode }}BidAdapter" moduleCode="{{ page.aliasCode }}BidAdapter" {% else %} <input type="checkbox" id="{{ page.biddercode }}BidAdapter" moduleCode="{{ page.biddercode }}BidAdapter" {% endif %} class="bidder-check-box module-check-box"><a href="{{page.url}}"> {{ page.title }}</a>
  {% if page.pbjs_version_notes %}<br/><div style="font-size:80%">{{page.pbjs_version_notes}}</div>{% endif %}
  </label>
</div>
</div>
{% endif %}{% endfor %}
</div>

<br>
<h4>Analytics Adapters</h4>
<div class="row">
{% for page in analytics_pages %}{% if page.enable_download == false %}{% continue %}{% endif %}<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" id="{{ page.modulecode }}" analyticscode="{{ page.modulecode }}" class="analytics-check-box module-check-box"><a href="{{page.url}}"> {{ page.title }}</a></label></div></div>{% endfor %}
</div>
<br/>
<h4>Recommended Modules</h4>
Prebid.org highly recommends that publishers utilize the following modules:
<br/>
{% for page in module_pages %}{% if page.recommended == true %}<div class="row"><div class="checkbox" style="background-color: #e1fce2;"><label> <input type="checkbox" CHECKED id="{{ page.module_code }}" moduleCode="{{ page.module_code }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}" class="tip"><strong>{{ page.display_name }}</strong></a> - {{page.description}}</label></div></div>{% endif %}{% endfor %}
<br/>
<h4>General Modules</h4>
<div class="row">
 {% for page in module_pages %}{% if page.enable_download == false or page.recommended == true or page.vendor_specific == true %}{% continue %}{% endif %}<div class="col-md-4"><div class="checkbox">
  <label> <input type="checkbox" id="{{ page.module_code }}" moduleCode="{{ page.module_code }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}" class="tip">{{ page.display_name }}<span>{{page.description}}</span></a></label>
</div></div>{% endfor %}
</div>

<h4>Vendor-Specific Modules</h4>
These modules may require accounts with a service provider.<br/>
<div class="row">
 {% for page in module_pages %}{% if page.enable_download == false or page.recommended == true %}{% continue %}{% endif %}{% if page.vendor_specific == true %}<div class="col-md-4"><div class="checkbox"><label> <input type="checkbox" id="{{ page.module_code }}" moduleCode="{{ page.module_code }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}" class="tip">{{ page.display_name }}<span>{{page.description}}</span></a></label>
</div></div>{% endif %}{% endfor %}
</div>

<h4>User ID Modules</h4>
<div class="row">
 {% for page in userid_pages %}{% if page.enable_download == false %}{% continue %}{% endif %}<div class="col-md-4"><div class="checkbox"><label> <input type="checkbox" id="{{ page.useridmodule }}" moduleCode="{{ page.useridmodule }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}">{{ page.title }}</a></label>{% if page.pbjs_version_notes %}<br/><div style="font-size:80%">{{page.pbjs_version_notes}}</div>{% endif %}
</div></div>{% endfor %}
</div>

{% for page in module_pages %}{% if page.enable_download == false%}{% continue %}{% endif %}{% if page.min_js_version %}<input type="hidden" class="version-restriction" moduleCode="{{ page.module_code }}" name="min-version" value="{{ page.min_js_version }}">{% endif %}
{% endfor %}

<br>

<div class="form-group">

<button type="button" class="btn btn-lg btn-primary" data-toggle="modal" data-target="#myModal" onclick="submit_download()">Get Prebid.js! </button>

</div>

</form>

{: .alert.alert-info :}
Note: If you receive an error during download you most likely selected a configuration that is not supported. Verify that each bidder / module is available in the selected version. Also please note that even though you can download older versions of Prebid.js,
Prebid only supports the most recent major version. Within a month or so after a major release (e.g. 3.x), we won't patch the previous major release (e.g. 2.x).

</div>

<!-- Modal -->
<div class="modal fade download-form__modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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

## Option 2: Build from Source Code (More Advanced)

{: .lead :}
Alternatively, you can build Prebid.js from the source code. For instructions, see the [Prebid.js README on GitHub](https://github.com/prebid/Prebid.js/blob/master/README.md).
