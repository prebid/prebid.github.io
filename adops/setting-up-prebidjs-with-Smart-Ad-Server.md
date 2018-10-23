<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-site-verification" content="_SMhyxJ4MnU9eTUQQNMUwU5W18T5tjNF7A6mumIci-A" />
    <meta name="keywords" content="Header Bidding, Advanced Bidding, Header Bid, Pre-bid">
    <meta name="description" content="Setting up Prebid.js with Smart Ad Server" />

    <link rel="shortcut icon" type="image/png" href="/favicon.png" /> 

    
        <title>Setting up Prebid.js with Smart Ad Server</title>
    

    <link href="/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="/assets/css/docs.min.css" rel="stylesheet">
    <link href="/assets/css/style.css" rel="stylesheet">

    <style>
        #content {
            background:#3b88c3;
            background:linear-gradient(135deg, #3b88c3, );
        }
    </style>

    <script src="/assets/js/jquery.min.js"></script>
    <script src="/assets/js/bootstrap.min.js"></script>
    <script src="/assets/js/bootbox.min.js"></script>
    <script src="/assets/js/docs.min.js"></script>
    <script type="text/javascript" src="/assets/js/pbjs_home.js"></script>
</head>

<body>
<header class="navbar navbar-static-top bs-docs-nav" id="top">
    <div class="container">
        <div class="navbar-header" role="banner">
            <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/">Prebid</a>
        </div>

        <nav class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" role="navigation">
            <ul class="nav navbar-nav">

                <li class="dropdown">

                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        About
                        <span class="caret" />
                    </a>

                    <ul class="dropdown-menu">
                        <li><a href="/overview/intro.html">What is Prebid?</a></li>
                        <li><a href="/overview/what-is-prebid-org.html">What is Prebid.org?</a></li>
                        <li><a href="/overview/prebid-members.html">Prebid.org Membership</a></li>
                        <li><a href="/overview/prebid-management-committees.html">Prebid Management Committees</a></li>
                        <li><a href="/wrapper_code_of_conduct.html">Wrapper Code of Conduct</a></li>
                        <li><a href="/principles.html">Project Principles</a></li>
                        <li><a href="/overview/getting-started.html">Getting Started</a></li>
                        <li><a href="/dev-docs/faq.html">FAQ</a></li>
                        <li><a href="/blog.html">Blog</a></li>
                    </ul>
                </li>

                <li class="dropdown">

                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        Docs
                        <span class="caret" />
                    </a>

                    <ul class="dropdown-menu">
                        <li class="dropdown-submenu">
                            <a href="/overview/getting-started.html">Prebid.js for web</a>
                            <ul class="dropdown-menu">
                                <li><a href="/dev-docs/docs-by-format.html">Docs by Format</a></li>
                                <li><a href="/adops/docs-by-ad-server.html">Docs by Ad Server</a></li>
                                <li><a href="/dev-docs/examples/basic-example.html">Examples</a></li>
                                <li><a href="/dev-docs/modules/index.html">Modules</a></li>
                            </ul>
                        </li>
                        <li><a href="/prebid-video/video-overview.html">Prebid.js for video</a></li>
                        <li><a href="/dev-docs/get-started-with-prebid-server.html">Prebid Server</a></li>
                        <li><a href="/prebid-mobile/prebid-mobile.html">Prebid Mobile for apps</a></li>
                        <li><a href="/adops.html">For Ad Ops</a></li>
                        <li><a href="/dev-docs/getting-started.html">For Developers</a></li>
                    </ul>
                </li>

                <li class="dropdown">

                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        Tools &amp; Analytics
                        <span class="caret" />
                    </a>

                    <ul class="dropdown-menu">
                        <li><a href="https://chrome.google.com/webstore/detail/headerbid-expert/cgfkddgbnfplidghapbbnngaogeldmop">Chrome Extension</a></li>
                        <li><a href="/overview/analytics.html">Analytics</a></li>
                    </ul>
                </li>

                <li class="dropdown">

                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        Support
                        <span class="caret" />
                    </a>

                    <ul class="dropdown-menu">
                        <li><a href="/support/">Get Help</a></li>
                        <li><a href="/dev-docs/prebid-troubleshooting-guide.html">Troubleshooting</a></li>
                        <li><a href="/videos/">Training Videos</a></li>
                        <li><a href="http://stackoverflow.com/questions/tagged/prebid.js">Stack Overflow</a></li>
                        <li><a href="https://reddit.com/r/adops">Ad Ops Reddit</a></li>
                        <li><a href="https://redditadops.slack.com/messages/C0HVALS8P"><strong>#headerbidding</strong> channel (Reddit Ad Ops Slack)</a></li>
                    </ul>
                </li>

                <li class="dropdown">

                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        Contribute
                        <span class="caret" />
                    </a>

                    <ul class="dropdown-menu" role="menu">
                        <li class="dropdown-submenu">
                            <a href="#">Repos</a>
                            <ul class="dropdown-menu">
                                <li><a href="https://github.com/prebid/Prebid.js/">Prebid.js</a></li>
                                <li><a href="https://github.com/prebid/prebid-server">Prebid Server</a></li>
                                <li><a href="https://github.com/prebid/prebid-mobile-ios">Prebid Mobile for iOS apps</a></li>
                                <li><a href="https://github.com/prebid/prebid-mobile-android">Prebid Mobile for Android apps</a></li>
                            </ul>
                        </li>
                        <li><a href="/dev-docs/bidder-adaptor.html">Add an Adapter</a></li>
                        <li><a href="/dev-docs/release-notes.html">Release Notes</a></li>
                    </ul>
                </li>

                <li>

                    <a href="/download.html">
                        Download
                    </a>

                </li>

            </ul>

        </nav>
    </div>
</header>


<div class="container bs-docs-container">

    

        <div class="row">

            <div class="col-md-3">
                <div class="docs-sidebar">
                      

     
     

     

        

        <h5>AD OPS TUTORIALS</h5>
        <ul class="nav bs-docs-sidena">

        

             

                

                    
                        <li><a href="/adops.html">Before You Start</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/step-by-step.html">Send Top Bid to Adserver</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/send-all-bids-adops.html">Send All Bids to the Ad Server</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/setting-up-prebid-for-amp-in-dfp.html">Setting up Prebid for AMP in DFP</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/setting-up-prebid-multi-format-in-dfp.html">Setting up Prebid Multi-Format in DFP</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/setting-up-prebid-native-in-dfp.html">Setting up Prebid Native in DFP (Alpha)</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/setting-up-prebid-video-in-dfp.html">Setting up Prebid Video in DFP</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/setting-up-prebid-with-the-appnexus-ad-server.html">Setting up Prebid with the AppNexus Publisher Ad Server</a></li>
                    

                

             

        

             

                

                    
                        <li><a class="selected" href="/adops/setting-up-prebidjs-with-Smart-Ad-Server.html">Setting up Prebid.js with Smart Ad Server</a></li>
                    

                

             

        

             

                

                    
                        <li><a href="/adops/deals.html">Enable Deals</a></li>
                    

                

             

        

            </ul>

     

        

        <h5>REFERENCE</h5>
        <ul class="nav bs-docs-sidena">

        

             

                

                    
                        <li><a href="/adops/docs-by-ad-server.html">Docs by Ad Server</a></li>
                    

                

             

        

            </ul>

     


                </div>
            </div>

            <div class="col-md-9" role="main">
                <div class="bs-docs-section">
  <h1 id="setting-up-prebidjs-with-smart-ad-server">Setting up Prebid.js with Smart Ad Server</h1>
  <h2 id="introduction">Introduction</h2>
  <p>This article describes the basic steps to set up Prebid.js with Smart Ad Server.</p>

  <p>Comprehensive documentation is available in the article <a href="https://support.smartadserver.com/s/article/Holistic-Setup">Holistic+ Setup</a> in Smart’s Help Center. This documentation may be more up to date than the explanations below.</p>

  <p>For some of the setup steps described below, you need to have a login to <a href="https://manage.smartadserver.com/">Smart’s UI</a>.</p>

  <h2 id="how-it-works">How it works</h2>

  <ul>
    <li>You implement the Prebid.js header bidding wrapper as well as Smart’s ad tags on your website.</li>
    <li>The header auction winner’s data (bidder name, CPM, currency) is passed with the ad call executed by Smart’s ad tag.</li>
    <li>In Smart’s UI, you simply set up an RTB+ insertion in order to establish the competition between the header auction winner and Smart’s connected monetization partners (DSPs);  there is no need to set up multiple line items, price buckets, keyword targeting etc.</li>
    <li>At the same time, Smart’s holistic yield algorithm will make sure your direct (guaranteed) campaigns meet their targets.</li>
    <li>Finally, the impression is given to the highest bid: (1) Smart’s own RTB+ (2) a direct campaign or (3) the header auction winner.</li>
  </ul>

  <h2 id="setup">Setup</h2>
  <h3 id="step-1---implement-the-wrapper">Step 1 - Implement the wrapper</h3>
  <p>Proceed as follows:</p>
  <ul>
    <li>Go to the <a href="http://prebid.org/download.html">Prebid.js download page</a>.</li>
    <li>Select the relevant <strong>Bidder Adapter(s)</strong>, an <strong>Analytics Adapter</strong> (optional) and <strong>Module(s)</strong> (optional).</li>
    <li>Download the code.</li>
    <li>Consult the <a href="/dev-docs/bidders.html">Bidders’ Params</a> to get help for filling the parameters.</li>
    <li>Make sure you specify the timeout; the timeout is the maximum time to wait until the Smart ad call is executed - even if some partners have not responded yet.</li>
    <li>Implement the Prebid.js file on the site.</li>
  </ul>

  <p>This step is also documented <a href="https://support.smartadserver.com/s/article/Holistic-Setup#implement-wrapper">here</a>.</p>

  <h3 id="step-2---implement-smarts-tag">Step 2 - Implement Smart’s tag</h3>
  <p>Smart’s OneCall tagging is strongly recommended. With OneCall, you can set header bidding data per <code class="highlighter-rouge">tagId</code>. The <code class="highlighter-rouge">tagId</code> is the Id of the container (<code class="highlighter-rouge">&lt;div&gt;</code>), where the ad will be displayed. The <code class="highlighter-rouge">tagId</code> format is <code class="highlighter-rouge">sas_&lt;formatId&gt;</code>. e.g. <code class="highlighter-rouge">sas_1234</code>.</p>

  <p>Make sure you use Smart’s <strong>new OneCall tagging</strong>, which uses POST requests with all the necessary information in the request body; simply check if you see the <code class="highlighter-rouge">formats</code> array in your tag. If you see <code class="highlighter-rouge">formatId</code>, you are still dealing with an old tag - in this case, get back to your service contact at Smart.</p>

  <p>For samples of both the new and legacy OneCall as well as a full implementation example, read <a href="https://support.smartadserver.com/s/article/Holistic-Setup#onecall">here</a>.</p>

  <p><strong>Additional resources</strong>:</p>
  <ul>
    <li><a href="https://support.smartadserver.com/s/article/Holistic-Setup#implement-smart-tag">Implementation with Smart’s Standard Call tagging</a></li>
    <li><a href="https://support.smartadserver.com/s/article/Tagging-guide">Full tagging guide</a></li>
  </ul>

  <h3 id="step-3---setup-in-smarts-ui">Step 3 - Setup in Smart’s UI</h3>
  <p>Things to keep in mind for the Setup in <a href="https://manage.smartadserver.com/">Smart’s UI</a>:</p>
  <ul>
    <li>In the RTB+ insertion, you must enable the checkbox “Activate Holistic yield mode” in the “General settings” section of the insertion.</li>
    <li>RTB+ must be enabled and configured in the network global settings.</li>
    <li>The Holistic+ feature must be enabled on the network.</li>
    <li>You must use the official and Holistic RTB+ script templates in the insertions.</li>
  </ul>

  <p>For more details, read <a href="https://support.smartadserver.com/s/article/Holistic-Setup#setup-ui">here</a>.</p>
  <h3 id="step-4---get-reporting">Step 4 - Get reporting</h3>
  <p>Read these articles to learn more about the available header bidding reporting:</p>
  <ul>
    <li><a href="https://support.smartadserver.com/s/article/Holistic-dashboard">Holistic Dashboard</a> - provides a fast and easy overview of basic metrics by delivery channel and RTB product.</li>
    <li><a href="https://support.smartadserver.com/s/article/Holistic-Setup#bdr">Big Data Reports</a> - provides full, in-depth reporting with header bidding related dimensions and metrics.</li>
  </ul>
</div>

            </div>
        </div>

     

    

</div>

<footer class="bs-docs-footer" role="contentinfo">
    <div class="container">
        <div class="bs-docs-social">
            <ul class="bs-docs-social-buttons">

                
                    <li>
                        <iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user=prebid&amp;repo=Prebid.js&amp;type=watch&amp;count=true" width="90" height="20" title="Star on GitHub"></iframe>
                    </li>
                    <li>
                        <iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user=prebid&amp;repo=Prebid.js&amp;type=fork&amp;count=true" width="90" height="20" title="Fork on GitHub"></iframe>
                    </li>
                 

                
                    <li>
                        <a href="https://twitter.com/share" class="twitter-share-button" data-url="http://prebid.org" data-count="horizontal" data-via="" data-text="Prebid" data-hashtags="prebidjs">Tweet</a>
                    </li>
                 

                 

                 

                

            </ul>
        </div>

        <p>
            All demos, instructions, documentation and code included on the Prebid.org website are released under the <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache License</a>.
        </p>

        <p>
            Documentation template by the <a href="http://getbootstrap.com/">Bootstrap team</a>, generated with <a href="https://github.com/mistic100/jekyll-bootstrap-doc">Jekyll Bootstrap Doc</a>.
        </p>

        <ul class="bs-docs-footer-links muted">
            <li>Currently v1.0.0</li>

            
                <li>&middot;</li>
                <li><a href="https://github.com/prebid/">GitHub</a></li>
            
            
        </ul>
    </div>
</footer>





    <script>
        window.twttr = (function (d,s,id) {
            var t, js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return; js=d.createElement(s); js.id=id; js.async=1;
            js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
            return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
        }(document, "script", "twitter-wjs"));
    </script>






<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-90624301-1', 'auto');
    ga('send', 'pageview');
</script>

</body>

</html>