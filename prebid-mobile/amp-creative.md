<script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@0.4.0/dist/creative.js"></script>
<script>
var adId = "%%PATTERN:hb_adid%%";
var cacheHost = "%%PATTERN:hb_cache_host%%";
var cachePath = "%%PATTERN:hb_cache_path%%";
var uuid = "%%PATTERN:hb_cache_id%%";
var mediaType = "%%PATTERN:hb_format%%";
var pubUrl = "%%PATTERN:url%%";
var env = "%%PATTERN:hb_env%%";
var size = "%%PATTERN:hb_size%%";
try {    
    pbjs.renderAd(document, adId, {cacheHost: cacheHost, cachePath: cachePath, uuid: uuid, mediaType: mediaType, pubUrl: pubUrl, env: env, size: size});
} catch(e) {
    console.log(e);
}
</script>
