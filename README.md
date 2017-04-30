# divJSON
#This library I created to get a lot of content from some websites, quickly.
#It receives html code as input and returns JSON array of html elements that are in selected div or in another element.


```javascript
var divJSON = require('./divJSON/index.js');

// Improvised content
var html = '<div class="div_1"><span id="span_1">the content</span></div>';

// Put html code into the library
divJSON = new divJSON(html);

// Get the content of the span_1
var content = divJSON.getContent('span_1');

// Result: { content: 'the content' }
console.log(content);

```
