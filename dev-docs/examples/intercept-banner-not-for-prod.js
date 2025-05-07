window.pbjs = window.pbjs || { que: [] };
pbjs.que.push(() => {
    pbjs.setConfig({
       debugging: {
           enabled: true,
           intercept: [{
               when: {
                     bidder: 'appnexus',
               },
               then: {
                     ad: '<html><body><img src="https://vcdn.adnxs.com/p/creative-image/27/c0/52/67/27c05267-5a6d-4874-834e-18e218493c32.png" width="300" height="250" /></body></html>'
               }
           }]
       }
    })
 })