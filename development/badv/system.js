/**
 * The BADV-Project System Core
 * 
 * @author KiddoKenshin
 * @since 2012/04/01 
 * @version 0.01
 */

// Definition of 1 Second
var oneSecond = 1000;
// How many frames run in 1 second
var framePerSecond = 30;
// Interval between calls between frames
var intervalPerFrame = Math.floor(oneSecond / framePerSecond);

// Copyright Text
var copyRightText = 'Powered By jQuery. &copy;K2-R&amp;D 2012';

/**
 * Creates a Basic Menu
 */
function createBasicHeaderMenu() {
	var newMenuDiv = document.createElement('div');
	newMenuDiv.className = 'headerMenu';
	var newAreaDiv = document.createElement('div');
	newAreaDiv.id = 'headerArea';
	
	$('div#contents').append(newAreaDiv);
	$('div#headerArea').append(newMenuDiv);
}

/**
 * Creates the copyright text
 */
function createCopyright() {
	var newCopyrightDiv = document.createElement('div');
	newCopyrightDiv.id = 'copyRight';
	
	$('div#contents').append(newCopyrightDiv);
	$('div#copyRight').html(copyRightText);
}

/**
 * Creates a Basic Text Area
 */
function createBasicTextArea() {
	var newButtonDiv = document.createElement('div');
	newButtonDiv.id = 'simpleButton';
	var newCharacterIconDiv = document.createElement('div');
	newCharacterIconDiv.className = 'characterIcon';
	var newTextDisplayDiv = document.createElement('div');
	newTextDisplayDiv.className = 'textDisplay';
	
	var newAreaBgDiv = document.createElement('div');
	newAreaBgDiv.id = 'textArea-background';
	
	var newAreaDiv = document.createElement('div');
	newAreaDiv.id = 'textArea';
	
	var newContainerDiv = document.createElement('div');
	newContainerDiv.id = 'textAreaContainer';
	
	
	$('div#contents').append(newContainerDiv);
	$('div#textAreaContainer').append(newAreaBgDiv);
	$('div#textAreaContainer').append(newAreaDiv);
	$('div#textArea').append(newCharacterIconDiv);
	$('div#textArea').append(newTextDisplayDiv);
	$('div#textArea').append(newButtonDiv);
}

// Store Timers for decelarator
var decelaratorsTimer = Array();
// Store speed(multiplier) for decelarator
var decelaratorsSpeed = Array();
// Stores current value for decelarator
var decelaratorsCurrentValue = Array();
// Store the end value for decelarator
var decelaratorsEndValue = Array();
// Store the style to manipulate for decelarator
var decelaratorsStyleToManipulate = Array();

/**
 * Decelarator setter
 * @param string elementAndID
 * @param float speed
 * @param int/float startValue
 * @param int/float endValue
 * @param string styleToManipulate (Any CSS that uses px in value)
 */
function setDecelarator(elementAndID, speed, startValue, endValue, styleToManipulate) {
	decelaratorsSpeed[elementAndID] = speed;
	decelaratorsCurrentValue[elementAndID] = startValue;
	decelaratorsEndValue[elementAndID] = endValue;
	decelaratorsStyleToManipulate[elementAndID] = styleToManipulate;
	
	$(elementAndID).css(styleToManipulate, startValue + 'px');
}

/**
 * Start the Decelarator
 * @param string elementAndID
 */
function startDecelarator(elementAndID) {
	// Movement between interval
	decelaratorsTimer[elementAndID] = setInterval(function(){
		// Starts Decelarate
		decelaratorsCurrentValue[elementAndID] /= decelaratorsSpeed[elementAndID];
		// Stops Process after the value reaches
		if (decelaratorsCurrentValue[elementAndID] <= decelaratorsEndValue[elementAndID]) {
			decelaratorsCurrentValue[elementAndID] = decelaratorsEndValue[elementAndID];
			clearInterval(decelaratorsTimer[elementAndID]);
		}
		// Manipulate CSS value for changes
		$(elementAndID).css(decelaratorsStyleToManipulate[elementAndID], decelaratorsCurrentValue[elementAndID] +'px');
	}, intervalPerFrame);
}

var typeWriterExecuting = false;
var forceEndTyper = false;
/**
 * Display text in Specified element, type writer style
 * @param string elementAndID
 * @param string textToDisplay
 */
function displayTextTypeWriterStyle(elementAndID, textToDisplay) {
	// Initialize value
	var textLength = textToDisplay.length;
	var nowPosition = 0;
	var tempTimer;
	
	// Loop process
	typeWriterExecuting = true;
	tempTimer = setInterval(function() {
		// Loop process until textLength is same with the current position
		// 2012/06/04 Tags striped.
		switch (textToDisplay.charAt(nowPosition)) {
			case '<':
				while(textToDisplay.charAt(nowPosition) != '>') {
					nowPosition++;
				}
				break;
			case '&':
				while(textToDisplay.charAt(nowPosition) != ';') {
					nowPosition++;
				}
				break;
			default:
				// Add Position Value
				nowPosition++;
				break;
		}
		$(elementAndID).html(textToDisplay.substring(0, nowPosition));
		if (nowPosition == textLength || forceEndTyper) {
			$(elementAndID).html(textToDisplay.substring(0, textLength));
			typeWriterExecuting = false;
			if (isMobileDevice()) {
				// Disable CSS3 KeyFrames Animation (Dirty Text upon animating while scaling appended)
				manualAnimateSimpleButton();
			} else {
				$('div#simpleButton').attr('class', 'animate');
			}
			forceEndTyper = false;
			clearInterval(tempTimer);
		}
	}, intervalPerFrame);
}

/**
 * Display text in Specified element, type writer style, with Character Name. (Alternate way?)
 * @param string elementAndID
 * @param string textToDisplay
 * @param string characterName
 */
function displayTextTypeWriterStyleWithCharacterName(elementAndID, textToDisplay, characterName) {
	// Initialize value
	var nameString = '<span style="font-weight: bold;">' + characterName + '</span><br />';
	var newText = nameString + textToDisplay;
	var textLength = newText.length;
	var nowPosition = nameString.length;
	var tempTimer;
	
	// Loop process
	typeWriterExecuting = true;
	tempTimer = setInterval(function() {
		// Loop process until textLength is same with the current position
		// 2012/06/04 Tags striped.
		switch (newText.charAt(nowPosition)) {
			case '<':
				while(newText.charAt(nowPosition) != '>') {
					nowPosition++;
				}
				break;
			case '&':
				while(newText.charAt(nowPosition) != ';') {
					nowPosition++;
				}
				break;
			default:
				// Add Position Value
				nowPosition++;
				break;
		}
		$(elementAndID).html(newText.substring(0, nowPosition));
		if (nowPosition == textLength || forceEndTyper) {
			$(elementAndID).html(newText.substring(0, textLength));
			typeWriterExecuting = false;
			if (isMobileDevice()) {
				// Disable CSS3 KeyFrames Animation (Dirty Text upon animating while scaling appended)
				manualAnimateSimpleButton();
			} else {
				$('div#simpleButton').attr('class', 'animate');
			}
			forceEndTyper = false;
			clearInterval(tempTimer);
		}
	}, intervalPerFrame);
}

var buttonAnimation = false;
var buttonOpacity = 0;
function manualAnimateSimpleButton() {
	buttonAnimation = true;
	
	var executing = true;
	$('div#simpleButton').animate({
		'opacity' : '1'
	}, 500, function() {
		$('div#simpleButton').animate({
			'opacity' : '0'
		}, 500, function() {
			executing = false;
		});
	});
	var temp = setInterval(function() {
		if (executing == false) {
			executing = true;
			$('div#simpleButton').animate({
				'opacity' : '1'
			}, 500, function() {
				$('div#simpleButton').animate({
					'opacity' : '0'
				}, 500, function() {
					executing = false;
				});
			});
		}
	}, 1);
	
	var temp2 = setInterval(function() {
		if (buttonAnimation == false) {
			$('div#simpleButton').stop(true);
			$('div#simpleButton').css('opacity', '0');
			clearInterval(temp);
			clearInterval(temp2);
		}
	}, 1);
}

/**
 * Clear content of div.textDisplay
 */
function clearTextDisplay() {
	if (isMobileDevice()) {
		buttonAnimation = false;
	} else {
		$('div#simpleButton').attr('class', '');
	}
	$('div.textDisplay').html('');
}

/**
 * Get Random value with the specified Range
 * @param int setRange
 * @return int
 */
function getRandom(setRange) {
	return Math.floor(Math.random() * setRange);
}

/**
 * Get Interval(Speed) between Switching Eye Position
 * @param int withInRange
 * @return int
 */
function winkTime(withInRange) {
	return Math.floor(getRandom(1000) / withInRange);
}

/**
 * Get Interval(wait) between eye winking/blinking
 * @return int
 */
function winkInterval() {
	return getRandom(5 * oneSecond);
}
// Stores Timer for Eye Winking
var winkEyeTimer = Array();
// Stores Eye Position
var eyePos = Array();
// Stores Current Frame
var currentFrame = Array();
// Stores movement moderator
var movement = Array();

/**
 * Winks Eye
 * @param string winkID
 * @param string positionClass
 * @param int reverseFrame
 * @param int maxFrame
 */
function winkEye(winkID, positionClass, reverseFrame, maxFrame) {
	// Initialize values
	if (eyePos[winkID] == undefined) {
		eyePos[winkID] = 1;
	}
	if (currentFrame[winkID] == undefined) {
		currentFrame[winkID] = 1;
	}
	if (movement[winkID] == undefined) {
		movement[winkID] = 1;
	}
	// Manipulate eye's position
	eyePos[winkID] += movement[winkID];
	// Determine current frame
	currentFrame[winkID]++;
	// Manipulate CSS value for the change
	$(winkID).attr('class', positionClass + eyePos[winkID]);
	
	// Reverse movement moderator
	if (currentFrame[winkID] == reverseFrame || currentFrame[winkID] == maxFrame) {
		movement[winkID] *= -1;
		if (currentFrame[winkID] == maxFrame) {
			// Resets value when a complete eye winking.
			eyePos[winkID] = 1;
			currentFrame[winkID] = 1;
			clearInterval(winkEyeTimer[winkID]);
			winkExecuting[winkID] = 0;
		}
	}
}

// Stores Timer to Wink
var winkTimer = Array();
// Stores Executing Lock
var winkExecuting = Array();

/**
 * Start the winking process
 * @param string winkID
 */
function startWink(winkID) {
	// Initialize value
	if (winkExecuting[winkID] == undefined) {
		winkExecuting[winkID] = 0;
	}
	// If its not Locked
	if (winkExecuting[winkID] == 0) {
		// Clear Timer once. (Reset winkInterval)
		clearInterval(winkTimer[winkID]);
		
		// Start eye winking process
		winkEyeTimer[winkID] = setInterval(function() {winkEye(winkID, positionClassName[winkID], reverseFrameNumber[winkID], maxFrameNumber[winkID])}, winkTime(4));
		// Lock process
		winkExecuting[winkID] = 1;
		// Sets Next Call after winkInterval
		winkTimer[winkID] = setInterval(function() {startWink(winkID)}, winkInterval());
	}
}

// Stores class name for eye position
var positionClassName = Array();
// Stores frame to reverse movement
var reverseFrameNumber = Array();
// Stores max frame for a wink
var maxFrameNumber = Array();

/**
 * Set values for eye Winking
 * @param string winkID
 * @param string positionClass
 * @param int reverseFrame
 * @param int maxFrame
 */
function setWink(winkID, positionClass, reverseFrame, maxFrame) {
	positionClassName[winkID] = positionClass;
	reverseFrameNumber[winkID] = reverseFrame;
	maxFrameNumber[winkID] = maxFrame;
}

// ROUGH Lip Speaking Process
var talkID = null;
function stopTalk() {
	clearInterval(talkID);
	$('div#base').bind('click', function() {
		talkID = setInterval(talk, 500);
	});
}
var lipPos = 1;
function talk() {
	$('div#base').bind('click', function() {
		stopTalk();
	});
}


var resourceLoading = false;
// Check whether are the resources ready.
var isResourceReady = false;
// Check whether error occured while loading images.
var errorWhileLoadingResources = false;

var audioResource = Array();

/**
 * Load Resources.
 * @param array resourcePaths (Arrays of resource sources/urls)
 * @param int timeOut (1sec = 1000)
 */
function loadResources(resourcePaths, timeOut) {
	resourceLoading = true;
	
	// Total Resources
	var totalResources = resourcePaths.length;
	
	// Resource loaded
	var loaded = 0;
	
	var resourceToDelete = 0;
	
	// Load resource(s)
	for (var i = 0; i < totalResources; i++) {
		var parts = resourcePaths[i].split('.');
		var fileExtension = (parts[parts.length-1]).toLowerCase();
		var loaderElement = '';
		var audioType = '';
		if (fileExists(resourcePaths[i])) {
			switch (fileExtension) {
				case 'jpg':
				case 'png':
					loaderElement = '<img />';
					break;
				case 'ogg':
					audioType = 'audio/ogg';
					loaderElement = '<audio />';
					break;
				case 'mp3':
					audioType = 'audio/mpeg';
					loaderElement = '<audio />';
					break;
				case 'webm':
				case 'mp4':
					loaderElement = '<video />';
					break;
			}
			if (loaderElement == '<audio />') {
				audioResource[resourcePaths[i]] = new Audio();
				if (audioResource[resourcePaths[i]].canPlayType(audioType) === '') {
					delete audioResource[resourcePaths[i]];
					resourceToDelete++;
					debugLog(resourcePaths[i] + ' is not loadable.');
					continue;
				}
				audioResource[resourcePaths[i]].src = resourcePaths[i];
				audioResource[resourcePaths[i]].addEventListener('loadeddata', function() {
					loaded++;
				});
				audioResource[resourcePaths[i]].load();
			} else {
				$(loaderElement).attr('src', resourcePaths[i]).load(function () {
					loaded++;
				});
			}
		} else {
			debugLog(resourcePaths[i] + ' is not available.');
			resourceToDelete++;
		}
	}
	
	totalResources -= resourceToDelete;
	
	// Loop process until resources are loaded or timeout occurred.
	var timer = 0;
	var tempTimer = setInterval(function () {
		debugLog(loaded + ' out of ' + totalResources + ' Resources loaded.');
		timer++;
		if (loaded == totalResources || timer == timeOut) {
			isResourceReady = true;
			if (timer == timeOut) {
				errorWhileLoadingResources = true;
				debugLog('Error Occured While Loading Resources.');
				debugLog(resourcePaths);
			}
			resourceLoading = false;
			clearInterval(tempTimer);
		}
	}, 1);
	
}

/**
 * Check if file exists.
 * referred : http://stackoverflow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
 * @return boolean
 */
function fileExists(url) {
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	try {
		http.send();
		return http.status != 404;
	} catch (e) {
		debugLog(e.message);
		return false;
	}
}


/**
 * Detect whether user browsing from mobile device.
 * @return boolean
 */
function isMobileDevice() {
	return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
}

/**
 * Detect whether user browsing from apple device.
 * @return boolean
 */
function isAppleDevice() {
	return navigator.userAgent.match(/(iPad)|(iPhone)/i);
}

var screenSizeSettled = false;
/**
 * Mobile Device Scaling. (Depends on Device's CPU Burden?)
 * @param boolean force()
 */
function runExperimentalMobileDeviceScaling(force) {
	// Experimental Code
	if (!screenSizeSettled || force) {
		var browserWidth = document.body.clientWidth; // $(window).width();
		var browserHeight = document.body.clientHeight;
		var targetWidth = parseInt($('div#main').css('width'));
		var targetHeight = parseInt($('div#main').css('height'));
		
		if (isMobileDevice()) {
			var scale = (browserWidth / targetWidth);
			//var scale = (targetHeight / browserHeight);
			//var scale = (browserHeight / targetHeight);
			$('div#main').css({
				'margin' : '0',	
				'-moz-transform-origin' : 'top left',	
				'-webkit-transform-origin' : 'top left',
				'-moz-transform' : 'scale(' + scale + ')',	
				'-webkit-transform' : 'scale(' + scale + ')'
			});
			
			$('body').css({
				'overflow' : 'hidden',
				'width' : browserWidth + 'px',
				'height' : Math.ceil(targetHeight * scale) + 'px'
			});
			
			setTimeout(function () {
				if (document.documentElement.scrollTop === 0) {
					window.scrollTo(0, 1);
				}
			}, 0);
			
			// Experimental Auto Resizing on rotate / orientation (works on iPhone Safari and Android Browser)
			// $('body').attr('onorientationchange', 'runExperimentalMobileDeviceScaling(true);');
		}
		screenSizeSettled = true;
	}
}

/**
 * Creates CSS3 Loader.
 * @return documentObject
 */
function buildLoadingImage() {
	var newLoader = document.createElement('div');
	newLoader.id = 'loader';
	var newLoaderText = document.createElement('div');
	newLoaderText.id = 'loadertext';
	newLoaderText.innerHTML = 'NOW LOADING';
	var newCircle = document.createElement('div');
	newCircle.className = 'circle';
	var newInnerCircle = document.createElement('div');
	newInnerCircle.className = 'circle1';
	
	newCircle.appendChild(newInnerCircle);
	newLoader.appendChild(newLoaderText);
	newLoader.appendChild(newCircle);
	
	return newLoader;
}

var elementsOnAnimation = Array();
function endsAnimation() {
	var totalItems = elementsOnAnimation.length;
	for (var i = 0; i < totalItems; i++) {
		$(elementsOnAnimation[i]).stop(false, true);
	}
	elementsOnAnimation = Array();
}

/**
 * ? Not Needed ?
 */
function redrawInterface() {
	
}

/**
 * Initalize the Interface
 */
function initInterface() {
	createBasicHeaderMenu();
	createCopyright();
	createBasicTextArea();
}

var debugMode = true;
/**
 * Output debug console
 * @param string value
 */
function debugLog(value){
	if (typeof console != 'undefined' && debugMode){
		console.log(value);
	}
}

/* jQuery system related / Plug-in Codes HERE */

/**
 * jQuery animate background-position
 * referred : http://stackoverflow.com/questions/5518834/jquery-animate-background-position-firefox
 */
(function($) {
if(!document.defaultView || !document.defaultView.getComputedStyle){
	var oldCurCSS = jQuery.curCSS;
	jQuery.curCSS = function(elem, name, force){
		if(name === 'background-position'){
			name = 'backgroundPosition';
		}
		if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
			return oldCurCSS.apply(this, arguments);
		}
		var style = elem.style;
		if ( !force && style && style[ name ] ){
			return style[ name ];
		}
		return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
	};
}

var oldAnim = $.fn.animate;
$.fn.animate = function(prop){
	if('background-position' in prop){
		prop.backgroundPosition = prop['background-position'];
		delete prop['background-position'];
	}
	if('backgroundPosition' in prop){
		prop.backgroundPosition = '('+ prop.backgroundPosition + ')';
	}
	return oldAnim.apply(this, arguments);
};

function toArray(strg){
	strg = strg.replace(/left|top/g,'0px');
	strg = strg.replace(/right|bottom/g,'100%');
	strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
	var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
	return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
}

$.fx.step.backgroundPosition = function(fx) {
	if (!fx.bgPosReady) {
		var start = $.curCSS(fx.elem,'backgroundPosition');

		if(!start){//FF2 no inline-style fallback
			start = '0px 0px';
		}

		start = toArray(start);

		fx.start = [start[0],start[2]];

		var end = toArray(fx.end);
		fx.end = [end[0],end[2]];

		fx.unit = [end[1],end[3]];
		fx.bgPosReady = true;
	}

	var nowPosX = [];
	nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
	nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
	fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];
};
})(jQuery);
