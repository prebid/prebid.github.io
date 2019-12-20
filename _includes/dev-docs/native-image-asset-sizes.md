There are two methods for defining sizes for image-like assets (`image` and `icon`).  Both are shown below, but the first example (using `sizes`) is more widely supported by demand partners.

Using `mediaTypes.native.image.sizes` (or `mediaTypes.native.icon.sizes` for icons):

{% highlight js %}

mediaTypes: {
    native: {
        image: {
            required: true,
            sizes: [150, 50]
        }
    }
}

{% endhighlight %}

Using `mediaTypes.native.image.aspect_ratios` (or `mediaTypes.native.icon.aspect_ratios` for icons):

{% highlight js %}

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

{% endhighlight %}

{: .alert.alert-success :}
NOTE: If you're using `aspect_ratios` in a native request sent to Prebid Server, the `min_width` and `min_height` fields become required instead of optional.  If these fields are not included, that native request will be rejected.