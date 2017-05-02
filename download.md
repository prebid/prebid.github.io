---
layout: page
title: Download Prebid.js
description: Documentation on how to download Prebid.js for header bidding.

pid: 0
show_disqus: true

is_top_nav: yeah

top_nav_section: download
nav_section: download


---

<script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>

<script>

$(function(){
  $('#myModal').on('show.bs.modal', function (e) {
    var form_data = get_form_data();
    if(form_data.bidders.length < 1){
      alert('Please select at least 1 bidder');
      return e.preventDefault() // stops modal from being shown
    }
    return;
  });
});

function submit_download() {
    var form_data = get_form_data();

    var alertStatus = $('#download-status');

    if (!(form_data['email'] && form_data['company'])) {
      alertStatus.html('Email and Company fields are required.');
      alertStatus.removeClass('hide');
      return;
    }
    alertStatus.addClass('hide');

    $('#download-button').html('<i class="glyphicon glyphicon-send"></i> Sending Request...').addClass('disabled');
    alertStatus.html('Request sent! Please hang tight, this might take a few minutes.');
    alertStatus.removeClass('hide');
    $.ajax({
        type: "POST",
        url: "http://client-test.devnxs.net/prebid",
        //dataType: 'json',
        data: form_data
    })
    .done(function() {
      var buttn = $('#download-button');
      //buttn.addClass('btn-success');
      buttn.html('<i class="glyphicon glyphicon-ok"></i> Email Sent!');
      console.log('Succeeded!');
      alertStatus.addClass('hide');
    })
    .fail(function(e) {
      errorO = e;
      console.log(e);
      var buttn = $('#download-button');
      buttn.html('<i class="glyphicon glyphicon-envelope"></i> Receive Prebid.js');
      buttn.removeClass('disabled');
      alert('Ran into an issue.'); // + e.responseText
    });

    newDownload(form_data['email'], form_data['company'], form_data['bidders']);
}

function get_form_data() {
    var bidders = [];

    var bidder_check_boxes = $('.bidder-check-box');
    for (var i = 0; i < bidder_check_boxes.length; i++) {
        var box = bidder_check_boxes[i];
        if (box.checked) {
            bidders.push(box.getAttribute('bidderCode'));
        }
    }

    var form_data = {};
    form_data['email'] = $('#input-email').val();
    form_data['company'] = $('#input-company').val();
    form_data['bidders'] = bidders;

    return form_data;
}


</script>

<style>
.disabled {
  color: #aaa;
}
</style>

<div class="bs-docs-section" markdown="1">

# Customize and Download Prebid.js <span class="label label-warning" style="font-size:14px">Beta</span>

{: .lead :}
To improve the speed and load time of your site, build Prebid.js for only the header bidding partners you choose.

### Option 1: Select header bidding partners


<form>

<div class="row">
<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="appnexus" class="bidder-check-box"> AppNexus | Display
    </label>
  </div>
</div>



<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="appnexusAst" class="bidder-check-box"> AppNexusAST (Beta) | Display/Video
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="openx" class="bidder-check-box"> OpenX | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="pubmatic" class="bidder-check-box"> Pubmatic | Display 
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="rubicon" class="bidder-check-box"> Rubicon | Display/Video
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="yieldbot" class="bidder-check-box"> Yieldbot | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="aol" class="bidder-check-box"> AOL | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="indexExchange" class="bidder-check-box"> Index Exchange | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="sovrn" class="bidder-check-box"> Sovrn | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="pulsepoint" class="bidder-check-box"> PulsePoint | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="triplelift" class="bidder-check-box"> TripleLift | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="springserve" class="bidder-check-box"> SpringServe | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="adform" class="bidder-check-box"> Adform | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="nginad" class="bidder-check-box"> NginAd | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="brightcom" class="bidder-check-box"> Brightcom | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="adequant" class="bidder-check-box"> Adequant | Display
    </label>
  </div>
</div>

<div class="col-md-4">
  <div class="checkbox">
    <label>
      <input type="checkbox" bidderCode="sonobi" class="bidder-check-box"> Sonobi | Display
    </label>
  </div>
</div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="aardvark" class="bidder-check-box"> Aardvark | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="wideorbit" class="bidder-check-box"> WideOrbit | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="kruxlink" class="bidder-check-box"> Krux Link | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="admedia" class="bidder-check-box"> AdMedia | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="jcm" class="bidder-check-box"> J Carter Marketing | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="memeglobal" class="bidder-check-box"> Meme Global | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="underdogmedia" class="bidder-check-box"> Underdog Media | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="brealtime" class="bidder-check-box"> bRealTime | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="pagescience" class="bidder-check-box"> Pagescience | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="centro" class="bidder-check-box"> Centro | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="adblade" class="bidder-check-box"> Adblade | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="piximedia" class="bidder-check-box"> Piximedia | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="getintent" class="bidder-check-box"> GetIntent | Display/Video
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="defymedia" class="bidder-check-box"> DefyMedia | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="hiromedia" class="bidder-check-box"> HIRO Media | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="roxot" class="bidder-check-box"> Roxot | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="adbutler" class="bidder-check-box"> AdButler | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="komoona" class="bidder-check-box"> Komoona | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="rhythmone" class="bidder-check-box"> RhythmOne | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="vertoz" class="bidder-check-box"> Vertoz | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="adkernel" class="bidder-check-box"> AdKernel | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="conversant" class="bidder-check-box"> Conversant Media | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="featureforward" class="bidder-check-box"> FeatureForward | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="districtmDMX" class="bidder-check-box"> DistrictmDMX | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="gumgum" class="bidder-check-box"> GumGum | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="fidelity" class="bidder-check-box"> Fidelity Media | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="widespace" class="bidder-check-box"> Widespace | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="sekindoUM" class="bidder-check-box"> Sekindo Universal Mccann | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="smartadserver" class="bidder-check-box"> Smart AdServer | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="headbidding" class="bidder-check-box"> Headbidding | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="sharethrough" class="bidder-check-box"> Sharethrough | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="smartyads" class="bidder-check-box"> SmartyAds | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="twenga" class="bidder-check-box"> Twenga | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="xhb" class="bidder-check-box"> Xaxis | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="lifestreet" class="bidder-check-box"> Lifestreet | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="mantis" class="bidder-check-box"> Mantis Ad Network | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="admixer" class="bidder-check-box"> AdMixer | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="vertamedia" class="bidder-check-box"> Vertamedia | Display/Video
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="oftmedia" class="bidder-check-box"> 152Media | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="matomy" class="bidder-check-box"> Matomy | Display
      </label>
    </div>
  </div>

  <div class="col-md-4">
    <div class="checkbox">
      <label>
        <input type="checkbox" bidderCode="stickyadstv" class="bidder-check-box"> StickyAdsTV | Display/Video
      </label>
    </div>
  </div>

</div>

<br>
<p>
(Version 0.19.0)
</p>

<div class="form-group">

  <button type="button" class="btn btn-lg btn-primary" data-toggle="modal" data-target="#myModal">Get Custom Prebid.js</button>

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
          The download link will be in your inbox in a few minutes. Check the spam folder too!
        </div>


        <div class="form-group col-md-6">
            <label for="input-email">Email address</label>
            <input type="email" class="form-control" id="input-email" placeholder="Email" name="email">
        </div>
        <div class="form-group col-md-6">
            <label for="input-company">Company Name</label>
            <input type="text" class="form-control" id="input-company" placeholder="Your Company" name="company_email">
        </div>

        <div class="form-group">
            <button type="button" id="download-button" class="btn btn-lg btn-primary" onclick="submit_download()"><i class="glyphicon glyphicon-envelope"></i> Receive Prebid.js</button>
        </div>

        <div class="alert alert-warning hide" role="alert" id="download-status"></div>

        <p>
        Ran into problems? Email <code>info@prebid.org</code>
        </p>

      </div>


    </div>
  </div>
</div>


<div class="bs-docs-section" markdown="1">

### Option 2: Build from Source Code (More Advanced)

{: .lead :}
Alternatively, you can build Prebid.js from the source code.  For instructions, see the [Prebid.js README on GitHub](https://github.com/prebid/Prebid.js/blob/master/README.md).
