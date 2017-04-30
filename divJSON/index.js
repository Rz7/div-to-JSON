/*
	The library is to convert HTML code to JSON.

	github@Rz7, 2017.
*/


var divJSON = function divJSON(something) {
	var self = this;

	// result
	self.result = null;

	if(something)
		self.run(something);

	return this;
}

divJSON.prototype.run = function(someCode) {
	var self = this;

	someCode = self.preparation(someCode);
	self.result = self.convertHTMLtoJSON(someCode).json;

	return self;
};

divJSON.prototype.getContent = function(value) {
	var self = this;

	if( typeof self.result == 'undefined')
		return null;

	return self.recursiveSearching(self.result, value);
};

divJSON.prototype.recursiveSearching = function(_json, value) {
	var self = this;

	for(var i in _json)
	{
		if(i.indexOf(value) != -1)
			return _json[i];

		if(typeof _json[i] == 'object' && Object.keys(_json[i]).length > 0)
		{
			var __json = self.recursiveSearching(_json[i], value);
			if( __json != null)
				return __json;
		}
	}

	return null;
};

divJSON.prototype.preparation = function(htmlCode) {
	var self = this;

	var clean = [
		'\r',
		'\n',
		'	',
		'</br>',
		'<br>',
		'</i>',
		'<i>',
		'<!DOCTYPE html>'
	];

	for(var i in clean)
		htmlCode = htmlCode.replace(new RegExp(clean[i], 'g'), '');

	return htmlCode;
};

divJSON.prototype.convertHTMLtoJSON = function(htmlCode, startPoint, previousBlockName) {
	var self = this;
	var json = {};

	if( ! startPoint)
		startPoint = 0;

	if( ! previousBlockName)
		previousBlockName = "";

	// ID_counter is for block that do not have a specific class
	var id_counter = 0;

	while(true) {

		var nearestBlockIndex = htmlCode.indexOf('<', startPoint) + 1;
		if( nearestBlockIndex === 0) {
			return {
				json: json,
				indexPoint: htmlCode.length
			};
		}

		// console.log('c: ' + nearestBlockIndex + ' - ' + htmlCode[nearestBlockIndex]);

		var nearestBlock = self.getNearestBlock(htmlCode, nearestBlockIndex, previousBlockName);
		if(nearestBlock !== false)
		{
			switch(nearestBlock)
			{
				case 'meta':
				case 'img':
				case 'link':
				case 'input':
					startPoint = htmlCode.indexOf('>', nearestBlockIndex) + 1;
					continue;
				case '!':
					startPoint = htmlCode.indexOf('-->', nearestBlockIndex) + 3;
					continue;
				case '/':
				{
					/*
						If true, then it means that the closest <...> is having
						closing slash and the name of the block we're in,
						we need to get the content of the block
					*/

					var content = self.contentCollecting(htmlCode, startPoint);

					if( content && content !== "")
						json['content'] = content;

					return {
						json: json,
						indexPoint: nearestBlockIndex + nearestBlock.length + 1
					};
				}
			}

			if( nearestBlock != 'unknown' && typeof json[nearestBlock] == 'undefined')
				json[nearestBlock] = {};

			var indentityName = "";
			var idName = self.getNearestBlockId(htmlCode, nearestBlockIndex);
			if(idName != "") {
				indentityName = "#"+idName;
			} else {
				var classNames = self.getNearestBlockClass(htmlCode, nearestBlockIndex);
				indentityName = classNames+'_ID-'+(++id_counter);
			}

			// Get the data
			var convertedData = self.convertHTMLtoJSON(htmlCode, nearestBlockIndex, nearestBlock);

			// Update JSON array
			if(nearestBlock != 'unknown') {
				json[nearestBlock][indentityName] = convertedData.json;
				var styleData = self.getNearestBlockStyle(htmlCode, nearestBlockIndex);
				if(styleData) json[nearestBlock][indentityName]['style'] = styleData;
			}

			if(startPoint == convertedData.indexPoint) {
				return {
					json: json,
					indexPoint: htmlCode.length
				};
			}

			startPoint = convertedData.indexPoint;
		}
	}
};

divJSON.prototype.getNearestBlock = function(htmlCode, nearestBlockIndex) {
	var self = this;

	var supportedBlocks = [
		'div',
		'a',
		'html',
		'head',
		'body',
		'title',
		'span',
		'hr',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'label',
		'canvas',
		'form',
		'ul',
		'li ',
		'p',
		'center',
		'/',


		// Without closing
		'meta',
		'img',
		'link',
		'input',
		'!--' // commenting
	];

	if( typeof htmlCode != 'string')
		return 'unknown';

	// Set to <
	nearestBlockIndex--;

	for(var s in supportedBlocks) {
		if(htmlCode.indexOf('<' + supportedBlocks[s], nearestBlockIndex) == nearestBlockIndex)
			return supportedBlocks[s];
	}

	return 'unknown';
};

divJSON.prototype.getNearestBlockId = function(htmlCode, indexFrom) {
	return this.getNearestBlockIdentifier(htmlCode, indexFrom, 'id')
};

divJSON.prototype.getNearestBlockClass = function(htmlCode, indexFrom) {
	return this.getNearestBlockIdentifier(htmlCode, indexFrom, 'class')
};

divJSON.prototype.getNearestBlockStyle = function(htmlCode, indexFrom) {
	return this.getNearestBlockIdentifier(htmlCode, indexFrom, 'style')
};

divJSON.prototype.getNearestBlockIdentifier = function(htmlCode, indexFrom, type) {
	var self = this;

	var indentityName = "";
	var _starter = type+"=";

	var _index = htmlCode.indexOf(_starter, indexFrom);

	if(_index == -1 || _index > htmlCode.indexOf(">", indexFrom))
		return indentityName;

	for(var i = _index + _starter.length + 1; i < htmlCode.length; ++i)
	{
		if(htmlCode[i] === '"' || htmlCode[i] === '\'')
			break;

		indentityName += htmlCode[i];
	}
	
	return indentityName;
};

divJSON.prototype.contentCollecting = function(htmlCode, indexFrom) {
	var self = this;

	var content = "";
	var nearestBlockOpening = htmlCode.indexOf('>', indexFrom);
	var nearestBlockClosing = htmlCode.indexOf('<', indexFrom);
	if(nearestBlockOpening === -1 || nearestBlockClosing === -1) return "";

	for(var h = nearestBlockOpening + 1; h < nearestBlockClosing; ++h) {
		content += htmlCode[h];
	}

	return content;
};

module.exports = divJSON;
