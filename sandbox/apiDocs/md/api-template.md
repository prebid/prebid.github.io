<div class="api-header">API Endpoint Template</div>

Use this template for various elements you would want to display in your API endpoint documentation. Please follow the steps within the **Publishing Your API Document** (/guide/api-publishing,html). 

#### Code

Code samples should be written within code fencing. In Markdown these are distinguished by three opening and closing backticks. Syntax highlighting can be added by including the name of the code language. 

```javascript

//code exampel for Javascript
for (i=0; i<1000; i++) { 
    console.log("Hello World!");
}
```
#### Tables

{: .table .table-bordered .table-striped }
| CPM                 | 	Granularity                  |  Example |
|---------------------+----------------------------------+--------|
| CPM <= $5            | 	$0.05 increments             | $1.87 floored to $1.85 |
| CPM <= $10 and > $5  | 	$0.10 increments             | $5.09 floored to $5.00 |
| CPM <= $20 and > $10 | 	$0.50 increments             | $14.26 floored to $14.00 |
| CPM > $20           | 	Caps the price bucket at $20 | $24.82 floored to $20.00 |

#### Links

*Absolute*  
[Absolute Link](http://www.linkurl.com)

*Relative*  
[Relative Link](/guide/api-template.html)

#### Alerts

See the [Prebid Alert guide](guide/pb-guide-alerts.html) for the various alerts allowed on Prebid.org. 

#### List  

*Ordered List - Use an ordered list when the user is required a sequential series of steps to complete a task: 

1. Create an API endpoint. 
2. Follow the documentation style guide to create documentation for it. 
3. Follow the API publishing instructions to display documentation on Prebid.org.
4. Bask in glory. 

Use an unordered list when discussing any non-sequential process or topic, such as benefits of using the endpoint you are documenting. 

*Benefits of this endpoint*

- Faster than the other endpoint.
- Easier to implement.
- Compatible with everything ever made. 






 