window.pbjs = window.pbjs || { que: [] };
pbjs.que.push(() => {
    pbjs.setConfig({
       debugging: {
           enabled: true,
           intercept: [{
               when: {
                     bidder: 'msft',
               },
               then: {
                     ad: '<html><body><img src="https://files.prebid.org/creatives/prebid300x250.png" width="300" height="250" /></body></html>'
               }
           }]
       }
    })
 })