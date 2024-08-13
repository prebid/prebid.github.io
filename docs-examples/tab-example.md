---
layout: page_v2
title: Tab example
description: How tabs can be used
---

# How to implement tabs for code

The prebid documentation uses bootstrap for styling. Bootstrap offers a [tab component](https://getbootstrap.com/docs/4.6/components/navs/#javascript-behavior).

## Example

{% capture iosCode %}struct Player {
  var name: String
  var highScore: Int = 0
  var history: [Int] = []
  
  init(_ name: String) {
      self.name = name
  }
}

var player = Player("Tomas")
{% endcapture %}

{% capture androidCode %}fun main() {
  val name = "stranger"        // Declare your first variable
  println("Hi, $name!")        // ...and use it!
  print("Current count:")
  for (i in 0..10) {           // Loop over a range from 0 to 10
    print(" $i")
  }
}
{% endcapture %}

{% include code/mobile-sdk.html id="hello-world" kotlin=androidCode swift=iosCode %}

The code you need to for this looks like this

{% raw %}

```liquid
<!-- storing the code inside a variable makes it a lot more readable -->
{% capture iosCode %}struct Player {
    var name: String
    var highScore: Int = 0
    var history: [Int] = []

    init(_ name: String) {
        self.name = name
    }
}

var player = Player("Tomas")
{% endcapture %}

{% capture androidCode %}fun main() {
    val name = "stranger"        // Declare your first variable
    println("Hi, $name!")        // ...and use it!
    print("Current count:")
    for (i in 0..10) {           // Loop over a range from 0 to 10
        print(" $i")
    }
}
{% endcapture %}

<!-- include the code example -->
{% include code/mobile-sdk.html id="hello-world" kotlin=androidCode swift=iosCode %}
```

{% endraw %}

There are few things to understand here

1. The `include` directive requires a unique `id` for the page. Otherwise the tabs won't work properly
2. Capturing the code into a variable makes everything a lot more readable

## More information

- [jekyll includes](https://jekyllrb.com/docs/includes/)
- [jekyll includes with parameters](https://jekyllrb.com/docs/includes/#passing-parameter-variables-to-includes)
- [bootstrap tabs](https://getbootstrap.com/docs/4.6/components/navs/#javascript-behavior)
