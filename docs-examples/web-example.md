---
layout: page_v2
title: Web Code Example
description: How web code examples can be written
---

# How to implement code examples for web

The prebid documentation uses bootstrap for styling. Bootstrap offers a [tab component](https://getbootstrap.com/docs/4.6/components/navs/#javascript-behavior).

## Example

{% capture htmlCode %}<h4>Hello world</h4>
<div id="ad-slot" class="border border-info bg-white mb-2" 
     style="height:250px; width: 300px">Ad Slot</div>
     
<button type="button" 
        class="btn btn-primary" 
        onclick="exampleFunction()">Interactive</button>
{% endcapture %}

{% capture jsCode %}console.log('hello world');
function exampleFunction() { 
  alert('hey there'); 
}
{% endcapture %}

{% include code/web-example.html id="hello-world" html=htmlCode js=jsCode %}

## Instructions

The code you need to for this looks like this

{% raw %}

```liquid
<!-- storing the code inside a variable makes it a lot more readable -->
{% capture htmlCode %}<h4>Hello world</h4>
<div id="ad-slot" class="border border-info bg-white mb-2" style="height:250px; width: 300px">Ad Slot</div>
<button type="button" class="btn btn-primary" onclick="exampleFunction()">Interactive</button>
{% endcapture %}

{% capture jsCode %}console.log('hello world');
function exampleFunction() { 
  alert('hey there'); 
}
{% endcapture %}

{% include code/web-example.html id="hello-world" html=htmlCode js=jsCode %}
```

{% endraw %}

There are few things to understand here

1. The `include` directive requires a unique `id` for the page. Otherwise the tabs won't work properly
2. Capturing the code into a variable makes everything a lot more readable

## More information

- [jekyll includes](https://jekyllrb.com/docs/includes/)
- [jekyll includes with parameters](https://jekyllrb.com/docs/includes/#passing-parameter-variables-to-includes)
- [bootstrap tabs](https://getbootstrap.com/docs/4.6/components/navs/#javascript-behavior)
