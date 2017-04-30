/*
	This library I created to get a lot of content from some websites, quickly.
	This library receives html code as input and returns JSON array of html elements in selected div/other element.
*/

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