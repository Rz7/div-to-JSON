
// The library
var divJSON = require('./divJSON/index.js');

// Improvised content
var html = '<div class="div_1"><span id="span_1">the content</span></div>';

// Put html code
	divJSON = new divJSON(html);

// Get the content of the span
var content = divJSON.getContent('span_1');

// Result: { content: 'the content' }
console.log(content);