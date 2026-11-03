There are two methods for defining sizes for image-like assets (`image` and `icon`).  Both are shown below, but the first example (using `sizes`) is more widely supported by demand partners.

Using `mediaTypes.native.image.sizes` (or `mediaTypes.native.icon.sizes` for icons):

```javascript
mediaTypes: {
    native: {
        image: {
            required: true,
            sizes: [150, 50]
        }
    }
}
```

Using `mediaTypes.native.image.aspect_ratios` (or `mediaTypes.native.icon.aspect_ratios` for icons):

```javascript
mediaTypes: {
    native: {
        image: {
            required: true,
            aspect_ratios: [{
                min_width: 300,        /* Optional */
                min_height: 200,       /* Optional */
                ratio_width: 2,        /* Required */
                ratio_height: 3,       /* Required */
         }]
        }
    }
}
```

{: .alert.alert-info :}
Prebid.js converts legacy native assets to an [OpenRTB Native](https://github.com/InteractiveAdvertisingBureau/Native-Ads/blob/main/OpenRTB-Native-Ads-Specification-Final-1.2.pdf) request, which allows only one size per image asset. If `sizes` contains several sizes (e.g. `[[300, 250], [600, 500]]`), only the first one is used as `img.w`/`img.h` (Prebid.js 11.48 and later; earlier versions ignore a multi-size `sizes` array entirely). If `aspect_ratios` has several entries, only the first entry's `min_width`/`min_height` become `img.wmin`/`img.hmin`; all ratios are still passed in `img.ext.aspectratios`. Prebid.js logs a warning when values are dropped. Bid adapters that read the legacy request (`bidRequest.nativeParams`) still see every entry.
