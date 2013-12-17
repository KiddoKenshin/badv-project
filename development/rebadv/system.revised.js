/**
 * The RE:BADV-Project System Core
 * RE:BADV Project is a short term of REvised Browser ADVenture Project.
 * The purpose of this project is to allow creators to simply able to make Novel/Text based game easily with this.
 * 
 * Requirements:
 * jQuery >= 1.7.3
 * Webkit / Gecko based browsers with HTML5 Support. (Example: Chrome, Firefox)
 * (Optional) Web Audio API supported browser
 * 
 * Not Supported:
 * Non Webkit / Gecko based browsers. (Example: Internet Explorer, -Classic- Opera)
 * 
 * Visions:
 * Firefox OS port
 * 
 * @author KiddoKenshin at K2-R&D.com
 * @since 2012/04/01, RE: 2013/01/17
 * @version 0.01
 */

// General Area //

var reBADV = new Object();

// General Switches
reBADV.debugMode = false;

reBADV.loadComplete = false;

reBADV.oneSecond = 1000;
reBADV.framesPerSecond = 15;
reBADV.intervalPerFrame = Math.floor(reBADV.oneSecond / reBADV.framesPerSecond);

// The everyone's favorite random function 
reBADV.getRandom = function(range) {
	return Math.floor(Math.random() * range);
};

// Rescaler?
reBADV.autoRescale = false; // Set window size changed listener when activated.
reBADV.fullScreen = false;
reBADV.forceWidth = null;
reBADV.forceHeight = null;

/**
 * Screen Re-scaler (Text needed to warn user about the browser/CPU load when scaling used.)
 * @param void
 */
reBADV.rescaler = function() {
	
	// Set Default size
	var mainWidth = parseInt($('div#main').css('width'));
	var mainHeight = parseInt($('div#main').css('height'));
	$('body').css({
		'width' : mainWidth + 'px',
		'height' : mainHeight + 'px'
	});
	
	// ROUGH IDEA (WORK IN PROGRESS)
	// Now apply scaling...
	// When this function is called, 
	// - Auto Full Screen with global variable
	// - Force to a size if (global) parameter is given
	// - Do not do anything?
	
	if (reBADV.fullScreen || (reBADV.forceWidth !== null && reBADV.forceHeight !== null)) {
		var targetWidth = $(window).width(); // document.body.clientWidth;
		var targetHeight = $(window).height(); // document.body.clientHeight;
		if (reBADV.forceWidth !== null && reBADV.forceHeight !== null) {
			targetWidth = reBADV.forceWidth;
			targetHeight = reBADV.forceHeight;
		}
		
		var scale = targetWidth / mainWidth;
		
		if (scale !== 1.0) {
			// Fit inside window (no scroll bars)
			// TODO: no need to compare in Force Mode?
			if (targetHeight < mainHeight) {
				scale = targetWidth / mainHeight;
			}
			
			// Do not allow scaling below 0.5.
			if (scale < 0.5) {
				scale = 0.5;
				targetWidth = mainWidth / 2;
				targetHeight = mainHeight / 2;
			}
			
			$('div#main').css({
				'scaleX' : scale,
				'scaleY' : scale
			});
			$('div#mainWindow').css({
				'width' : targetWidth + 'px',
				'height' : targetHeight + 'px'
			});
		}
	}
	
};

// Android detector
reBADV.androidVer = -1;
reBADV.getAndroidVersion = function() {
	if (reBADV.androidVer === -1) {
		var ua = navigator.userAgent;
		var strings = ua.split('; ');
		var totalStrings = strings.length;
		reBADV.androidVer = 0;
		for (var i = 0; i < totalStrings; i++) {
			if (strings[i].match(/(android)|(Android)/i)) {
				var temp = strings[i].split(' ');
				reBADV.androidVer = parseFloat(temp[1]);
				break;
			}
		}
	}
	
	return reBADV.androidVer;
};

// iOS detector
reBADV.iOSVersion = -1;
reBADV.getiOSVersion = function() {
	if (reBADV.iOSVersion === -1) {
		var agent = window.navigator.userAgent,
		start = agent.indexOf( 'OS ' );
		
		reBADV.iOSVersion = 0;
		if ((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) && start > -1) {
			reBADV.iOSVersion = parseFloat(agent.substr(start + 3, 3).replace('_', '.'));
		}
	}
	
	return reBADV.iOSVersion;
};

// TODO: Firefox OS detector?

// Mobile Device Detector
reBADV.clientDevice = null;
reBADV.isMobile = function() {
	if (reBADV.clientDevice === null) {
		if (reBADV.getAndroidVersion() === 0 && reBADV.getiOSVersion() === 0) {
			reBADV.clientDevice = 'pc';
		} else {
			reBADV.clientDevice = 'mobile';
		}
	}
	
	return reBADV.clientDevice === 'mobile';
};


// Audio Related Area //

// Web Audio API (Audio Data API is Deprecated)
reBADV.audioContext = null;
reBADV.masterVolume = 1;
reBADV.masterVolumeControl = null;
reBADV.bgmVolume = 1;
reBADV.bgmVolumeControl = null;
reBADV.sfxVolume = 1;
reBADV.sfxVolumeControl = null;
reBADV.audioVolume = 1;
reBADV.audioVolumeControl = null;
reBADV.createAudioContext = function() {
	if (typeof(AudioContext) != 'undefined') {
		return new AudioContext();
	} else if (typeof(webkitAudioContext) != 'undefined') {
		return new webkitAudioContext();
	} else if (typeof(mozAudioContext) != 'undefined') {
		return new mozAudioContext();
		// reBADV.consoleLogger('mozAudioContext is still broken');
		// return false;
	} else {
		// Web Audio API is not available
		reBADV.consoleLogger('Web Audio API is not available');
		return false;
	}
};

// Specified Volume control
// TODO: Master Volume, BGM Volume, SFX Volume, Audio(Voice) Volume
// TODO: Example: Master(70%) -> BGM Master(50%) -> BGM (Always 100%)

reBADV.bgmOutput = new Array();
reBADV.bgmVolumeAssigned = new Array();
// TODO: 1Track at a time, Crossfade needed (Only track 1 or 2)
reBADV.playBGM = function(assignId, audioData, volume) {
	if (assignId > 1 || assignId < 0) {
		// throw new Error('Assign ID not appropriate');
		return; 
	}
	
	var neighbourTrackID;
	if (assignId == 0) {
		neighbourTrackID = 1;
	} else {
		neighbourTrackID = 0;
		// onPlayOutput = reBADV.bgmOutput[0];
	}
	
	if (reBADV.bgmOutput[neighbourTrackID] !== undefined) {
		// Playing
		// Cross Fade
		var playingOutput = reBADV.bgmOutput[neighbourTrackID];
		var playingVolume = reBADV.bgmVolumeAssigned[neighbourTrackID];
		var timer1 = setInterval(function() {
			
			playingOutput.stop(0);
		});
		
		var BGMOutput;
		var thisVolume;
		BGMOutput = reBADV.audioContext.createBufferSource();
		BGMOutput.buffer = audioData;
		BGMOutput.loop = true;
		
		thisVolume = reBADV.audioContext.createGain();
		thisVolume.gain.value = 0;
		thisVolume.connect(reBADV.bgmVolumeControl);
		
		BGMOutput.connect(thisVolume);
		BGMOutput.start(0);
		
		reBADV.bgmOutput[assignId] = BGMOutput;
		reBADV.bgmVolumeAssigned[assignId] = thisVolume;
		var timer2 = setInterval(function() {
			
		});
	} else {
		// Just play BGM?
		var BGMOutput = reBADV.audioContext.createBufferSource();
		BGMOutput.buffer = audioData;
		BGMOutput.loop = true;
		
		var thisVolume = reBADV.audioContext.createGain();
		thisVolume.gain.value = 1;
		thisVolume.connect(reBADV.bgmVolumeControl);
		
		BGMOutput.connect(thisVolume);
		BGMOutput.start(0);
		
		reBADV.bgmOutput[assignId] = BGMOutput;
		reBADV.bgmVolumeAssigned[assignId] = thisVolume;
	}
	
};
reBADV.stopBGM = function(assignedId, fadeBGM) {
	var fade = fadeBGM !== undefined;
	if (fade) {
		var volume = parseInt(reBADV.bgmVolumeAssigned[assignedId].gain.value);
		var deduct = (volume / 30);
		
		var count = 0;
		var timer = setInterval(function() {
			count++;
			reBADV.bgmVolumeAssigned[assignedId].gain.value -= (deduct);
			
			if (count == 30) {
				clearInterval(timer);
				reBADV.bgmOutput[assignedId].stop(0);
				delete reBADV.bgmOutput[assignedId];
				delete reBADV.bgmVolumeAssigned[assignedId];
				
				reBADV.consoleLogger('BGM track ' + assignedId + ' stopped');
			}
		}, Math.floor(1000 / 30));
	} else {
		reBADV.bgmOutput[assignedId].stop(0);
		delete reBADV.bgmOutput[assignedId];
		delete reBADV.bgmVolumeAssigned[assignedId];
		
		reBADV.consoleLogger('BGM track ' + assignedId + ' stopped');
	}
};


reBADV.SFXAssigned = new Array();
reBADV.SFXVolumeAssigned = new Array();

// Multiple Tracks (TODO: Pan-able / Balance adjustable audio channel -Still Experimental-)
reBADV.playSFX = function(assignId, audioData, loopSwitch) {
	if (reBADV.audioContext !== false) {
		var SFXOutput = reBADV.audioContext.createBufferSource();
		SFXOutput.buffer = audioData;
		SFXOutput.loop = loopSwitch;
		
		var thisVolume = reBADV.audioContext.createGain();
		thisVolume.gain.value = 1;
		thisVolume.connect(reBADV.sfxVolumeControl);
		
		// Experimental Panner
		if (false) {
			var pannerNode = reBADV.audioContext.createPanner();
			pannerNode.setPosition(0, 0, -4);
			
			// var simpleConvolver = reBADV.audioContext.createConvolver();
			// pannerNode.connect(simpleConvolver);
			pannerNode.connect(thisVolume);
			// simpleConvolver.connect(pannedVolume);
			
			SFXOutput.connect(pannerNode);
			
		}
		
		
		SFXOutput.connect(thisVolume);
		SFXOutput.start(0); // TODO: noteOn() was renamed to start()
		
		reBADV.SFXAssigned[assignId] = SFXOutput;
		reBADV.SFXVolumeAssigned[assignId] = thisVolume;
		
		var timer = null; // TODO: Global Timer Control using global variable?
		if (!loopSwitch) {
			
			var temp = setInterval(function() {
				if (SFXOutput.playbackState == 3) {
					clearInterval(temp);
					SFXOutput.stop(0);
					delete SFXOutput;
					delete reBADV.SFXAssigned[assignId];
					reBADV.consoleLogger('SFX played!');
				}
			}, jQuery.fx.interval);
			
			/* Onended not implemented yet (2013/11/14)
			SFXOutput.onended = function() {
				SFXOutput.stop(0);
				delete SFXOutput;
				delete reBADV.SFXAssigned[assignId];
				reBADV.consoleLogger('SFX played!');
			}
			//*/
			
			/*
			timer = setInterval(function() {
			}, reBADV.intervalPerFrame);
			//*/
		}
	}
};

reBADV.stopSFX = function(assignedId) {
	var SFXOutput = reBADV.SFXAssigned[assignedId];
	SFXOutput.stop(0);
	delete SFXOutput;
	delete reBADV.SFXAssigned[assignedId];
	delete reBADV.SFXVolumeAssigned[assignedId];
};

// Single track at a time (TODO: Option to Stop immediately or Continue until the next audio plays?)
reBADV.mainAudioOutput = null;

/**
 * 
 * @params audioData (Buffer from AudioContext.createBuffer())
 */
reBADV.playAudio = function(audioData) {
	
	if (reBADV.audioContext !== false) {
		delete reBADV.mainAudioOutput;
		reBADV.mainAudioOutput = reBADV.audioContext.createBufferSource();
		reBADV.mainAudioOutput.buffer = audioData;
		
		reBADV.mainAudioOutput.connect(reBADV.audioContext.destination);
		reBADV.mainAudioOutput.start(0); // TODO: noteOn() was renamed to start()
		
		// TODO: Another switch needed for playing? 
		
		/*
		var timer = null; // TODO: Global Timer Control using global variable?
		timer = setInterval(function() {
			if (reBADV.mainAudioOutput.playbackState === 3) {
				clearInterval(timer);
				reBADV.mainAudioOutput.stop(0);
			}
		}, reBADV.intervalPerFrame);
		//*/
		reBADV.mainAudioOutput.onended = function() {
			reBADV.mainAudioOutput.stop(0);
		};
	}
	
};

// Resource + Image Related Area //

// Store resources (apply stored resource in game)
reBADV.resourceList = new Array();
reBADV.resourceList['audio'] = new Array();
reBADV.resourceList['image'] = new Array();
reBADV.emptyResource = function() {
	for (var id in reBADV.resourceList['audio']) {
		delete reBADV.resourceList['audio'][id];
	}
	
	for (var id in reBADV.resourceList['image']) {
		delete reBADV.resourceList['audio'][id];
	}
	
	reBADV.resourceList['audio'] = new Array();
	reBADV.resourceList['image'] = new Array();
	
	reBADV.consoleLogger('Resourse List is Cleared');
};


reBADV.totalImageToLoad = 0; // Not Needed?
reBADV.totalImageLoaded = 0; // Not Needed?
reBADV.loadImage = function(imageFileUrl) {
	reBADV.totalImageToLoad++;
	$('<img />').error(function () {
		// Loader error handler
		reBADV.consoleLogger('error occurred while loading ' + imageFileUrl + ' .');
		reBADV.totalImageToLoad--;
	}).attr('src', imageFileUrl).load(function () {
		// Image loaded call back
		reBADV.totalImageLoaded++;
		reBADV.consoleLogger('image loaded:  ' + imageFileUrl + ' .');
		// delete this;
	});
};

// Referred : http://hi0a.com/demo/img-base64-datauri/
// Convert Image to Base64 (Rough)
reBADV.convertToBase64 = false;
reBADV.loadImageToBase64 = function(imageFileUrl, arrayKey) {
	var request = new XMLHttpRequest();
	request.open('GET', imageFileUrl, true);
	// request.responseType = 'text';
	request.overrideMimeType('text/plain; charset=x-user-defined');
	// request.send(null);
	request.onload = function() {
		var bytes = [];
		for (i = 0; i < request.responseText.length; i++){
			bytes[i] = request.responseText.charCodeAt(i) & 0xff;
		}
		var binary = String.fromCharCode.apply(String, bytes);
		var convert64 = window.btoa(binary);
		var fileHeader = binary.substring(0,9);
		
		function checkExtension(header) {
			if (header.match(/^\x89PNG/)) {
				return 'png';
			} else if (header.match(/^BM/)){
				return 'bmp';
			} else if (header.match(/^GIF87a/) || header.match(/^GIF89a/)) {
				return 'gif';
			} else if (header.match(/^\xff\xd8/)) {
				return 'jpeg';
			} else {
				return false;
			}
		}
		
		var ext = checkExtension(fileHeader);
		
		reBADV.resourceList['image'][arrayKey] = 'data:image/' + ext + ';base64,' + convert64;
	};
	
	request.onerror = function() {
		
	};
	
	request.send();
}

reBADV.rawBase64Image = false;
reBADV.getBase64Image = function(imageFileUrl, arrayKey) {
	var request = new XMLHttpRequest();
	request.open('GET', imageFileUrl, true);
	
	request.onload = function() {
		var content = request.responseText.spit(',');
		var ext = content[0];
		var rawBase64 = content[1];
		reBADV.resourceList['image'][arrayKey] = 'data:image/' + ext + ';base64,' + rawBase64;
	};
	
	request.send();
}

reBADV.totalAudioToLoad = 0; // Not Needed?
reBADV.totalAudioLoaded = 0; // Not Needed?
// TODO: HTML5Audio Fallback? (Audio Data API is Deprecated, how?)
reBADV.loadAudio = function(id, audioFileUrl, mixToMono) {
	if (reBADV.audioContext === null) {
		reBADV.audioContext = reBADV.createAudioContext();
		if (reBADV.audioContext !== false) {
			reBADV.masterVolumeControl = reBADV.audioContext.createGain();
			reBADV.masterVolumeControl.gain.value = reBADV.masterVolume;
			
			reBADV.bgmVolumeControl = reBADV.audioContext.createGain();
			reBADV.bgmVolumeControl.gain.value = reBADV.bgmVolume;
			reBADV.bgmVolumeControl.connect(reBADV.masterVolumeControl);
			
			reBADV.sfxVolumeControl = reBADV.audioContext.createGain();
			reBADV.sfxVolumeControl.gain.value = reBADV.sfxVolume;
			reBADV.sfxVolumeControl.connect(reBADV.masterVolumeControl);
			
			reBADV.audioVolumeControl = reBADV.audioContext.createGain();
			reBADV.audioVolumeControl.gain.value = reBADV.audioVolume;
			reBADV.audioVolumeControl.connect(reBADV.masterVolumeControl);
			
			reBADV.masterVolumeControl.connect(reBADV.audioContext.destination);
		}
	}
	
	var mono = (mixToMono !== undefined ? mixToMono : false);
	if (reBADV.audioContext !== false) {
		var request = new XMLHttpRequest();
		request.open('GET', audioFileUrl, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			// Place loaded audio into storage
			// reBADV.resourceList['audio'][id] = reBADV.audioContext.createBuffer(request.response, mono);
			// reBADV.consoleLogger(audioFileUrl + ' loaded!');
			// audioLoaded++;
			reBADV.audioContext.decodeAudioData(request.response, function(buffer) {
				reBADV.resourceList['audio'][id] = buffer;
				reBADV.consoleLogger(audioFileUrl + ' loaded!');
				reBADV.totalAudioLoaded++;
			}, function() {
				// Error Callback
				reBADV.totalAudioToLoad--;
				reBADV.consoleLogger(audioFileUrl + ' error!');
			});
		};
		
		request.onerror = function() {
			reBADV.totalAudioToLoad--;
			if (reBADV.priorityMode) {
				
			}
		};
		
		reBADV.totalAudioToLoad++;
		request.send();
	}
};

reBADV.createLoadingScreen = function() {
	// Default, Overwrite able
	// Referrer : http://blakek.us/labs/jquery/css3-pie-graph-timer/
	
	var newDiv = document.createElement('div');
	newDiv.id = 'loadContainer';
	newDiv.style.opacity = '0';
	$('div#main').append(newDiv);
	
	// Swinger
	var newDiv = document.createElement('div');
	newDiv.id = 'swinger';
	$('div#loadContainer').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'inner';
	$('div#loadContainer div#swinger').append(newDiv);
	
	$('div#swinger div#inner').css({
		'translate' : ['0px', '-124px']
	});
	
	// Indicator x 2
	var newDiv = document.createElement('div');
	newDiv.id = 'indicatorleft';
	$('div#loadContainer').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'indicatorright';
	newDiv.className = 'hidemode';
	$('div#loadContainer').append(newDiv);
	
	$('div#indicatorright').css({
		'rotate' : '180deg'
	});
	
	/* SAMPLE
	$('div#indicatorleft').animate({
		'rotate' : '180deg'
	}, 10000, 'linear', function() {
		$('div#indicatorright').removeAttr('class').css({
			'rotate' : '0deg'
		});
		
		$('div#indicatorright').animate({
			'rotate' : '180deg'
		}, 10000, 'linear', function() {
			
		});
		
	});
	//*/
	
	// Hider
	var newDiv = document.createElement('div');
	newDiv.id = 'hider';
	$('div#loadContainer').append(newDiv);
	
	// Info
	var newDiv = document.createElement('div');
	newDiv.id = 'info';
	newDiv.innerHTML = '000.00%';
	$('div#loadContainer').append(newDiv);
	
	$('div#loadContainer').animate({
		'opacity' : '1'
	}, 500, 'swing', function() {
		
	});
	
	// Renew Info
	var appendix = '00';
	var oldPercent = 0
	var percent = 0; // Demo
	var infoTimer = setInterval(function() {
		// oldPercent = percent;
		
		// Demo
		// percent += ((50 + reBADV.getRandom(951)) / 100);
		percent = ((reBADV.totalImageLoaded + reBADV.totalAudioLoaded) / (reBADV.totalImageToLoad + reBADV.totalAudioToLoad)) * 100;
		
		if (percent >= 10 && appendix == '00') {
			appendix =  '0';
		} else if (percent >= 100) {
			appendix = '';
			percent = 100;
			clearInterval(infoTimer);
			
			reBADV.loadComplete = true;
		}
		
		var jsSpeed = 400;
		var rightDelay = 0;
		if (oldPercent < 50 && percent > 50) {
			jsSpeed /= 2;
			rightDelay = jsSpeed + 25;
		}
		
		// Indicator Left
		var leftDeg = ((percent * 2) / 100) * 180;
		if (leftDeg >= 180) {
			leftDeg = 180;
		}
		
		// $('div#indicatorleft').css('rotate', leftDeg + 'deg');
		if (oldPercent < 50) {
			$('div#indicatorleft').animate({
				'rotate' : leftDeg + 'deg'
			}, jsSpeed, 'swing', function() {
				if ($('div#indicatorright').hasClass('hidemode') && rightDelay != 0) {
					$('div#indicatorright').removeClass('hidemode');
					$('div#indicatorright').css('rotate', '0deg');
				}
			});
		}
		
		if (percent >= 50) {
			/* Moved
			if ($('div#indicatorright').hasClass('hidemode')) {
				$('div#indicatorright').removeClass('hidemode');
				$('div#indicatorright').css('rotate', '0deg');
			}
			//*/
			
			var rightDeg = (((percent - 50) * 2) / 100) * 180;
			if (rightDeg >= 180) {
				rightDeg = 180;
			}
			
			// $('div#indicatorright').css('rotate', rightDeg + 'deg');
			setTimeout(function() {
				$('div#indicatorright').animate({
					'rotate' : rightDeg + 'deg'
				}, jsSpeed, 'swing', function() {
					
				});
			}, rightDelay);
		}
		
		$('div#info').html(appendix + percent.toFixed(2) + '%');
		oldPercent = percent;
	}, 500);
	
};

reBADV.ingameLoading = false;
reBADV.ingameLoadIncator = function() {
	// Default, Overwrite
};

reBADV.afterLoadComplete = function() {
	// Default, Overwrite
};

// List of Resources to Load (Associative Array)
reBADV.totalResourseToLoad = 0;
reBADV.totalResourseToLoad = 0;
reBADV.resourseToLoad = new Array();
reBADV.resourseLoader = function() {
	var imageList = reBADV.resourceList['images'];
	for (var arrayKey in imageList) {
		reBADV.loadImage(imageList[arrayKey]);
	}
	
	var audioList = reBADV.resourceList['audio'];
	reBADV.resourceList['audio'] = {};
	console.log(audioList);
	for (var arrayKey in audioList) {
		reBADV.loadAudio(arrayKey, audioList[arrayKey]);
	}
	
	reBADV.createLoadingScreen();
	
	var timer = setInterval(function() {
		if (reBADV.loadComplete) {
			clearInterval(timer);
			reBADV.loadComplete = false;
			reBADV.afterLoadComplete();
		}
	}, jQuery.fx.interval);
};

reBADV.priorityMode = false;
reBADV.priorityLoader = function() {
	var imageIdStorage = new Array();
	var imageList = reBADV.resourceList['images'];
	for (var arrayKey in imageList) {
		imageIdStorage.push(arrayKey);
	}
	
	var audioIdStorage = new Array();
	var audioList = reBADV.resourceList['audio'];
	for (var arrayKey in audioList) {
		audioIdStorage.push(arrayKey);
	}
};

// For Loading new Resources
reBADV.resetLoader = function() {
	
};


// Load Tracker (/w Timeout??)




// Debugging Tools //
reBADV.consoleLogger = function(input) {
	if (reBADV.debugMode && typeof(console) != 'undefined') {
		console.log(input);
	}
};

reBADV.debugPanel = false;
reBADV.stackData = new Array();
reBADV.emptyStackData = function() {
	delete reBADV.stackData;
	reBADV.stackData = new Array();
};
reBADV.stackLogger = function(inputString) {
	if (reBADV.debugMode && !reBADV.debugPanel) {
		// Create element(layer)
		reBADV.debugPanel = true;
		var newDiv = document.createElement('div');
		newDiv.id = 'debugger';
		newDiv.style.cssText = 'position: absolute; width: 100%; height: ' + (reBADV.isMobile() ? 10 : 50) + '%; left: 0px; top: 0; color: #FFFAFA; text-shadow: 1px 1px #000000; overflow-x: hidden; overflow-y: scroll; background-color: #000000; opacity: ' + (reBADV.isMobile() ? 0.45 : 0.75) + ';';
		$('div#container').append(newDiv);
		
		if (!reBADV.isMobile) {
			$('div#debugger').bind(eventHandler, function() {
				$('div#debugger').stop(false, true);
				
				var debuggerHeight = parseInt($('div#debugger').css('height'));
				var jsHeight = parseInt($('div#container').css('height'));
				if (jsHeight / debuggerHeight == 2) {
					$('div#debugger').animate({
						'height' : '10%',
						'opacity' : '0.45'
					}, 500);
				} else {
					$('div#debugger').animate({
						'height' : '50%',
						'opacity' : '0.9'
					}, 500);
				}
				
				return;
			});
		}
		
		// Stack data in.
		reBADV.stackData.push(inputString);
		
		// TODO: Limit data?
		
		var totalData = reBADV.stackData.length;
		var text = '';
		// Display reversed order data
		for (var i = (totalData - 1); i > -1; i--) {
			text += reBADV.stackData[i] + '<br />';
		}
		
		$('div#debugger').html(text);
	}
};

// jQuery Checker
reBADV.jQueryCheck = function() {
	if (typeof(jQuery) != 'undefined') {
		// alert('jQuery library is loaded!');
		return true;
	} else {
		// alert('jQuery is not available!');
		return false;
	}
};

// jQuery Animate Related //
reBADV.stackedAnimate = new Array();
reBADV.stackedAnimateSize = 0; // JavaScript unable to detect length of Associative Array
reBADV.registerAnimate = function(elementId) {
	var regID = elementId;
	reBADV.stackedAnimate[regID] = elementId;
	reBADV.stackedAnimateSize++;
};
reBADV.emptyAnimate = function(elementId, dequeue) {
	// Default value for clear animation queues
	var dequeueVal = false;
	if (dequeue === true) {
		dequeueVal = true;
	}
	
	if (elementId === undefined || elementId === null) {
		// Clear All
		for (var id in reBADV.stackedAnimate) {
			$(reBADV.stackedAnimate[id]).stop(dequeueVal, true);
		}
		delete reBADV.stackedAnimate;
		reBADV.stackedAnimate = Array();
		reBADV.stackedAnimateSize = 0;
	} else {
		// Clear Specified
		// var regID = specifiedElement.replace('.', '-');
		var regID = elementId;
		$(reBADV.stackedAnimate['"' + regID + '"']).stop(dequeueVal, true);
		delete reBADV.stackedAnimate['"' + regID + '"'];
		reBADV.stackedAnimateSize--;
	}
};

// Output UI Related //

reBADV.aRow = [
	'あ', 'ぁ', 'ア', 'ァ', 
	'か', 'が', 'カ', 'ガ', 
	'さ', 'ざ', 'サ', 'ザ', 
	'た', 'だ', 'タ', 'ダ', 
	'な', 'ナ', 
	'は', 'ば', 'ぱ', 'ハ', 'バ', 'パ', 
	'ま', 'マ', 
	'や', 'ゃ', 'ヤ', 'ャ', 
	'ら', 'ラ', 
	'わ', 'ワ' 
];

reBADV.iRow = [
	'い', 'ぃ', 'イ', 'ィ', 
	'き', 'ぎ', 'キ', 'ギ', 
	'し', 'じ', 'シ', 'ジ', 
	'ち', 'ぢ', 'チ', 'ヂ', 
	'に', 'ニ', 
	'ひ', 'び', 'ぴ', 'ヒ', 'ビ', 'ピ', 
	'み', 'ミ', 
	'り', 'リ', 
	'ゐ', 'ヰ' 
];

reBADV.uRow = [
	'う', 'ぅ', 'ウ', 'ゥ', 
	'く', 'ぐ', 'ク', 'グ', 
	'す', 'ず', 'ス', 'ズ', 
	'つ', 'づ', 'ツ', 'ヅ', 
	'ぬ', 'ヌ', 
	'ふ', 'ぶ', 'ぷ', 'フ', 'ブ', 'プ', 
	'む', 'ム', 
	'ゆ', 'ゅ', 'ユ', 'ュ', 
	'る', 'ル' 
];

reBADV.eRow = [
	'え', 'ぇ', 'エ', 'ェ', 
	'け', 'げ', 'ケ', 'ゲ', 
	'せ', 'ぜ', 'セ', 'ゼ', 
	'て', 'で', 'テ', 'デ', 
	'ね', 'ネ', 
	'へ', 'べ', 'ぺ', 'ヘ', 'ベ', 'ペ', 
	'め', 'メ', 
	'れ', 'レ', 
	'ゑ', 'ヱ' 
];

reBADV.oRow = [
	'お', 'ぉ', 'オ', 'ォ', 
	'こ', 'ご', 'コ', 'ゴ', 
	'そ', 'ぞ', 'ソ', 'ゾ', 
	'と', 'ど', 'ト', 'ド', 
	'の', 'ノ', 
	'ほ', 'ぼ', 'ぽ', 'ホ', 'ボ', 'ポ', 
	'も', 'モ', 
	'よ', 'ょ', 'ヨ', 'ョ', 
	'ろ', 'ロ', 
	'を', 'ヲ' 
];

reBADV.buttonActive = false;
reBADV.showButton = function() {
	if (!reBADV.buttonActive) {
		reBADV.buttonActive = true;
		
		$('div#textbutton').css('opacity', '1');
		function loop() {
			$('div#textbutton').animate({
				'opacity' : '0'
			}, 500, 'swing', function() {
				$('div#textbutton').animate({
					'opacity' : '1'
				}, 500, 'swing', function() {
					if (reBADV.buttonActive) {
						loop();
					}
				});
			});
		}
		loop();
	}
};

reBADV.hideButton = function() {
	if (reBADV.buttonActive) {
		reBADV.buttonActive = false;
		$('div#textbutton').stop(true);
		$('div#textbutton').css('opacity', '0');
	}
};

/* EXPERIMENTAL */
reBADV.stackedBackLog = new Array();
reBADV.backLogging = function(message, name) {
	if (message == undefined) {
		throw new Error('backlogging error!');
	}
	if (name == undefined) {
		name = '';
	} 
	reBADV.stackedBackLog.push({
		'name' : name, 
		'message' : message, 
		// Future plans
		// 'adv' : currentADV, 
		// 'script' : currentScript
	});
};

// Overwrite purpose
reBADV.createBacklogUI = function() {
	var newDiv = document.createElement('div');
	newDiv.id = 'backlogger';
	$('div#ingame').append(newDiv);
};

reBADV.backlogElement = 'div#backlogger';
reBADV.displayBacklog = function(e) {
	e.preventDefault();
	e.stopPropagation();
	
	reBADV.createBacklogUI();
	
	var count = 0;
	for (var id in reBADV.stackedBackLog) {
		var text = reBADV.stackedBackLog[id]['message'];
		var newDiv = document.createElement('div');
		newDiv.id = 'logid' + id;
		if (reBADV.stackedBackLog[id]['name'] != '') {
			text = ('【' + reBADV.stackedBackLog[id]['name'] + '】<br />' + text);
		}
		newDiv.innerHTML = text;
		$(reBADV.backlogElement).append(newDiv);
	}
	
	$(reBADV.backlogElement).scrollTop(9999999999);

	$(reBADV.backlogElement).one('contextmenu', function(e) {
		$('div#backlogger').remove();
		return false;
	});
	
	/* Hide
	$('div#backlogger').animate({
		scrollTop: '100%'
	}, 500, 'swing', function() {
	});
	//*/
};

reBADV.defaultOutputElement = 'div#textbox';
reBADV.typeWriting = false;
reBADV.endTypeWriter = false;
reBADV.typeWriter = function(inputString, lipElementId, lipHeightValue) {
	
	var totalInput = inputString.split('::::');
	var charaName = '';
	var input = '';
	var inputLength = 0;
	var textPosition = 0;
	var writerTimer = null;
	
	// TODO: Create a Global Variable and Set it in preInit
	var textboxId = reBADV.defaultOutputElement;
	
	if (totalInput[1] != undefined) {
		// With Character Name
		charaName = totalInput[0];
		input = totalInput[1];
		
		$('div#namebox').html(charaName);
		
	} else {
		// Normal Type Writer
		input = totalInput[0];
		$('div#namebox').html('');
	}
	
	reBADV.backLogging(input, charaName);
	
	inputLength = input.length;
	
	if (charaName !== '') {
		// Do Something
	}
	
	var doLipSync = false;
	var currentChar = '';
	var lipPos = 0;
	if (lipElementId !== undefined && lipHeightValue !== undefined) {
		doLipSync = true;
	}
	
	reBADV.typeWriting = true;
	writerTimer = setInterval(function() {
		// FIXME: Might hang if tag not closed
		switch(input.charAt(textPosition)) {
			case '<':
				// Tag Striper (example: <span>)
				while(input.charAt(textPosition) != '>') {
					textPosition++;
				}
				break;
			case '&':
				// HTML Symbol Skipper (example: &amp;)
				while(input.charAt(textPosition) != ';') {
					textPosition++;
				}
				break;
			default:
				// Add Position Value
				textPosition++;
				break;
		}
		
		currentChar = input.charAt(textPosition);
		$(textboxId).html(input.substring(0, textPosition));
		
		// Experimental Lip Sync
		if (doLipSync) {
			if (reBADV.aRow.indexOf(currentChar) !== -1) {
				lipPos = 1;
			} else if (reBADV.iRow.indexOf(currentChar) !== -1) {
				lipPos = 2;
			} else if (reBADV.uRow.indexOf(currentChar) !== -1) {
				lipPos = 3;
			} else if (reBADV.eRow.indexOf(currentChar) !== -1) {
				lipPos = 4;
			} else if (reBADV.oRow.indexOf(currentChar) !== -1) {
				lipPos = 5;
			} else {
				lipPos = 0;
			}
			$(lipElementId).css('background-position', '0px ' + (lipPos * -lipHeightValue) + 'px');
		}
		
		// Break Condition
		if (textPosition == inputLength || reBADV.typeWriting == false) { // TODO: Should I use another switch?
			clearInterval(writerTimer);
			$(textboxId).html(input.substring(0, inputLength)); // Complete text
			reBADV.typeWriting = false;
			
			// Show Button?
			reBADV.showButton();
			
			setTimeout(function() {
				$(lipElementId).css('background-position', '0px 0px');
			}, reBADV.intervalPerFrame);
			
			// Delete variable to lessen memory consumption
			delete totalInput;
			delete charaName;
			delete input;
			delete inputLength;
			delete textPosition;
			delete writerTimer;
		}
		
	}, reBADV.intervalPerFrame); // TODO: Adjustable speed?
	
};

// Character Related Area //

// Winker
// Text Lip Sync
// Audio Lip Sync ? Near Future?
// TypeWriter



// How to stop this?
reBADV.winkElementId = new Array();
reBADV.startEyeWinker = function(elementId, maxFrame, heightValue) {
	if (reBADV.winkElementId[elementId] === undefined) {
		reBADV.winkElementId[elementId] = elementId;
		
		function eyeWinker() { // elementId, maxFrame, heightValue) {
			var count = 0;
			var manipulator = 1;
			var timer = setInterval(function() {
				count += manipulator;
				$(elementId).css('background-position', '0px ' + (count * -heightValue) + 'px');
				if (count + 1 == maxFrame || count == 0) {
					manipulator *= -1;
					if (count == 0) {
						clearInterval(timer);
						if (reBADV.winkElementId[elementId] !== undefined) {
							setTimeout(function() {
								eyeWinker(elementId, maxFrame, heightValue);
							}, 500 + reBADV.getRandom(4501));
						} else {
							reBADV.consoleLogger('eyeWink for ' + elementId + ' stopped');
						}
					}
				}
			}, Math.floor((100 + reBADV.getRandom(401)) / maxFrame));
		}
		eyeWinker();
	} else {
		reBADV.consoleLogger('eyeWink for ' + elementId + ' already fired.');
	}
	

};

reBADV.stopEyeWinker = function(elementId) {
	// Stop eyewinking at the next wink... 
	reBADV.consoleLogger('stopping eyeWink for ' + elementId);
	delete reBADV.winkElementId[elementId];
};

// In Game Related Area //
reBADV.notInteractable = false;
reBADV.currentScript = -1;
reBADV.textList = new Array();
reBADV.eventScipts = new Array(); // Register Functions to Animate (Make execution delay later)
reBADV.delayExecution = 0;
reBADV.delayTimer = null;
reBADV.afterDelayed = null;

reBADV.nextScript = function() {
	reBADV.currentScript++;
	var eventScript = reBADV.eventScipts[reBADV.currentScript];
	if (typeof(eventScript) === 'function') {
		reBADV.delayExecution = eventScript(); // Always Return value
	} else {
		reBADV.delayExecution = 0;
	}
	
	reBADV.afterDelayed = function() {
		reBADV.delayTimer = null;
		reBADV.afterDelayed = null;
		if (reBADV.textList[reBADV.currentScript] != undefined) {
			reBADV.typeWriter(reBADV.textList[reBADV.currentScript]);
		}
	};
	
	reBADV.delayTimer = setTimeout(reBADV.afterDelayed, reBADV.delayExecution);
	
};

// TODO: Auto Mode / Skip Mode

// TODO: Use HTML5 localStorage

// Reserved Area (Override Purpose) //

// PreInit
reBADV.preInit = function() {
	throw new Error('PreInit is not Overrided!');
};
// Init
reBADV.init = function() {
	if (reBADV.jQueryCheck()) {
		reBADV.preInit();
		reBADV.start();
	} else {
		throw new Error('jQuery not Detected!');
	}
};
// Start, do I need this?
reBADV.start = function() {
	throw new Error('Start is not Overrided!');
};

// PLUG IN AREA //

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

/*
 * jQuery 2d Transform v0.9.3
 * http://wiki.github.com/heygrady/transform/
 *
 * Copyright 2010, Grady Kuhnline
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Date: Sat Dec 4 16:40:39 2010 -0800
 * (FIXED By Felix Huang, this version support jQuery >= 1.8.0)
 */
(function(f,g,j,b){var h=/progid:DXImageTransform\.Microsoft\.Matrix\(.*?\)/,c=/^([\+\-]=)?([\d+.\-]+)(.*)$/,q=/%/;var d=j.createElement("modernizr"),e=d.style;function n(s){return parseFloat(s)}function l(){var s={transformProperty:"",MozTransform:"-moz-",WebkitTransform:"-webkit-",OTransform:"-o-",msTransform:"-ms-"};for(var t in s){if(typeof e[t]!="undefined"){return s[t]}}return null}function r(){if(typeof(g.Modernizr)!=="undefined"){return Modernizr.csstransforms}var t=["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"];for(var s in t){if(e[t[s]]!==b){return true}}}var a=l(),i=a!==null?a+"transform":false,k=a!==null?a+"transform-origin":false;f.support.csstransforms=r();if(a=="-ms-"){i="msTransform";k="msTransformOrigin"}f.extend({transform:function(s){s.transform=this;this.$elem=f(s);this.applyingMatrix=false;this.matrix=null;this.height=null;this.width=null;this.outerHeight=null;this.outerWidth=null;this.boxSizingValue=null;this.boxSizingProperty=null;this.attr=null;this.transformProperty=i;this.transformOriginProperty=k}});f.extend(f.transform,{funcs:["matrix","origin","reflect","reflectX","reflectXY","reflectY","rotate","scale","scaleX","scaleY","skew","skewX","skewY","translate","translateX","translateY"]});f.fn.transform=function(s,t){return this.each(function(){var u=this.transform||new f.transform(this);if(s){u.exec(s,t)}})};f.transform.prototype={exec:function(s,t){t=f.extend(true,{forceMatrix:false,preserve:false},t);this.attr=null;if(t.preserve){s=f.extend(true,this.getAttrs(true,true),s)}else{s=f.extend(true,{},s)}this.setAttrs(s);if(f.support.csstransforms&&!t.forceMatrix){return this.execFuncs(s)}else{if(f.browser.msie||(f.support.csstransforms&&t.forceMatrix)){return this.execMatrix(s)}}return false},execFuncs:function(t){var s=[];for(var u in t){if(u=="origin"){this[u].apply(this,f.isArray(t[u])?t[u]:[t[u]])}else{if(f.inArray(u,f.transform.funcs)!==-1){s.push(this.createTransformFunc(u,t[u]))}}}this.$elem.css(i,s.join(" "));return true},execMatrix:function(z){var C,x,t;var F=this.$elem[0],B=this;function A(N,M){if(q.test(N)){return parseFloat(N)/100*B["safeOuter"+(M?"Height":"Width")]()}return o(F,N)}var s=/translate[X|Y]?/,u=[];for(var v in z){switch(f.type(z[v])){case"array":t=z[v];break;case"string":t=f.map(z[v].split(","),f.trim);break;default:t=[z[v]]}if(f.matrix[v]){if(f.cssAngle[v]){t=f.map(t,f.angle.toDegree)}else{if(!f.cssNumber[v]){t=f.map(t,A)}else{t=f.map(t,n)}}x=f.matrix[v].apply(this,t);if(s.test(v)){u.push(x)}else{C=C?C.x(x):x}}else{if(v=="origin"){this[v].apply(this,t)}}}C=C||f.matrix.identity();f.each(u,function(M,N){C=C.x(N)});var K=parseFloat(C.e(1,1).toFixed(6)),I=parseFloat(C.e(2,1).toFixed(6)),H=parseFloat(C.e(1,2).toFixed(6)),G=parseFloat(C.e(2,2).toFixed(6)),L=C.rows===3?parseFloat(C.e(1,3).toFixed(6)):0,J=C.rows===3?parseFloat(C.e(2,3).toFixed(6)):0;if(f.support.csstransforms&&a==="-moz-"){this.$elem.css(i,"matrix("+K+", "+I+", "+H+", "+G+", "+L+"px, "+J+"px)")}else{if(f.support.csstransforms){this.$elem.css(i,"matrix("+K+", "+I+", "+H+", "+G+", "+L+", "+J+")")}else{if(f.browser.msie){var w=", FilterType='nearest neighbor'";var D=this.$elem[0].style;var E="progid:DXImageTransform.Microsoft.Matrix(M11="+K+", M12="+H+", M21="+I+", M22="+G+", sizingMethod='auto expand'"+w+")";var y=D.filter||f.curCSS(this.$elem[0],"filter")||"";D.filter=h.test(y)?y.replace(h,E):y?y+" "+E:E;this.applyingMatrix=true;this.matrix=C;this.fixPosition(C,L,J);this.applyingMatrix=false;this.matrix=null}}}return true},origin:function(s,t){if(f.support.csstransforms){if(typeof t==="undefined"){this.$elem.css(k,s)}else{this.$elem.css(k,s+" "+t)}return true}switch(s){case"left":s="0";break;case"right":s="100%";break;case"center":case b:s="50%"}switch(t){case"top":t="0";break;case"bottom":t="100%";break;case"center":case b:t="50%"}this.setAttr("origin",[q.test(s)?s:o(this.$elem[0],s)+"px",q.test(t)?t:o(this.$elem[0],t)+"px"]);return true},createTransformFunc:function(t,u){if(t.substr(0,7)==="reflect"){var s=u?f.matrix[t]():f.matrix.identity();return"matrix("+s.e(1,1)+", "+s.e(2,1)+", "+s.e(1,2)+", "+s.e(2,2)+", 0, 0)"}if(t=="matrix"){if(a==="-moz-"){u[4]=u[4]?u[4]+"px":0;u[5]=u[5]?u[5]+"px":0}}return t+"("+(f.isArray(u)?u.join(", "):u)+")"},fixPosition:function(B,y,x,D,s){var w=new f.matrix.calc(B,this.safeOuterHeight(),this.safeOuterWidth()),C=this.getAttr("origin");var v=w.originOffset(new f.matrix.V2(q.test(C[0])?parseFloat(C[0])/100*w.outerWidth:parseFloat(C[0]),q.test(C[1])?parseFloat(C[1])/100*w.outerHeight:parseFloat(C[1])));var t=w.sides();var u=this.$elem.css("position");if(u=="static"){u="relative"}var A={top:0,left:0};var z={position:u,top:(v.top+x+t.top+A.top)+"px",left:(v.left+y+t.left+A.left)+"px",zoom:1};this.$elem.css(z)}};function o(s,u){var t=c.exec(f.trim(u));if(t[3]&&t[3]!=="px"){var w="paddingBottom",v=f.style(s,w);f.style(s,w,u);u=p(s,w);f.style(s,w,v);return u}return parseFloat(u)}function p(t,u){if(t[u]!=null&&(!t.style||t.style[u]==null)){return t[u]}var s=parseFloat(f.css(t,u));return s&&s>-10000?s:0}})(jQuery,this,this.document);(function(d,c,a,f){d.extend(d.transform.prototype,{safeOuterHeight:function(){return this.safeOuterLength("height")},safeOuterWidth:function(){return this.safeOuterLength("width")},safeOuterLength:function(l){var p="outer"+(l=="width"?"Width":"Height");if(!d.support.csstransforms&&d.browser.msie){l=l=="width"?"width":"height";if(this.applyingMatrix&&!this[p]&&this.matrix){var k=new d.matrix.calc(this.matrix,1,1),n=k.offset(),g=this.$elem[p]()/n[l];this[p]=g;return g}else{if(this.applyingMatrix&&this[p]){return this[p]}}var o={height:["top","bottom"],width:["left","right"]};var h=this.$elem[0],j=parseFloat(d.curCSS(h,l,true)),q=this.boxSizingProperty,i=this.boxSizingValue;if(!this.boxSizingProperty){q=this.boxSizingProperty=e()||"box-sizing";i=this.boxSizingValue=this.$elem.css(q)||"content-box"}if(this[p]&&this[l]==j){return this[p]}else{this[l]=j}if(q&&(i=="padding-box"||i=="content-box")){j+=parseFloat(d.curCSS(h,"padding-"+o[l][0],true))||0+parseFloat(d.curCSS(h,"padding-"+o[l][1],true))||0}if(q&&i=="content-box"){j+=parseFloat(d.curCSS(h,"border-"+o[l][0]+"-width",true))||0+parseFloat(d.curCSS(h,"border-"+o[l][1]+"-width",true))||0}this[p]=j;return j}return this.$elem[p]()}});var b=null;function e(){if(b){return b}var h={boxSizing:"box-sizing",MozBoxSizing:"-moz-box-sizing",WebkitBoxSizing:"-webkit-box-sizing",OBoxSizing:"-o-box-sizing"},g=a.body;for(var i in h){if(typeof g.style[i]!="undefined"){b=h[i];return b}}return null}})(jQuery,this,this.document);(function(g,f,b,h){var d=/([\w\-]*?)\((.*?)\)/g,a="data-transform",e=/\s/,c=/,\s?/;g.extend(g.transform.prototype,{setAttrs:function(i){var j="",l;for(var k in i){l=i[k];if(g.isArray(l)){l=l.join(", ")}j+=" "+k+"("+l+")"}this.attr=g.trim(j);this.$elem.attr(a,this.attr)},setAttr:function(k,l){if(g.isArray(l)){l=l.join(", ")}var j=this.attr||this.$elem.attr(a);if(!j||j.indexOf(k)==-1){this.attr=g.trim(j+" "+k+"("+l+")");this.$elem.attr(a,this.attr)}else{var i=[],n;d.lastIndex=0;while(n=d.exec(j)){if(k==n[1]){i.push(k+"("+l+")")}else{i.push(n[0])}}this.attr=i.join(" ");this.$elem.attr(a,this.attr)}},getAttrs:function(){var j=this.attr||this.$elem.attr(a);if(!j){return{}}var i={},l,k;d.lastIndex=0;while((l=d.exec(j))!==null){if(l){k=l[2].split(c);i[l[1]]=k.length==1?k[0]:k}}return i},getAttr:function(j){var i=this.getAttrs();if(typeof i[j]!=="undefined"){return i[j]}if(j==="origin"&&g.support.csstransforms){return this.$elem.css(this.transformOriginProperty).split(e)}else{if(j==="origin"){return["50%","50%"]}}return g.cssDefault[j]||0}});if(typeof(g.cssAngle)=="undefined"){g.cssAngle={}}g.extend(g.cssAngle,{rotate:true,skew:true,skewX:true,skewY:true});if(typeof(g.cssDefault)=="undefined"){g.cssDefault={}}g.extend(g.cssDefault,{scale:[1,1],scaleX:1,scaleY:1,matrix:[1,0,0,1,0,0],origin:["50%","50%"],reflect:[1,0,0,1,0,0],reflectX:[1,0,0,1,0,0],reflectXY:[1,0,0,1,0,0],reflectY:[1,0,0,1,0,0]});if(typeof(g.cssMultipleValues)=="undefined"){g.cssMultipleValues={}}g.extend(g.cssMultipleValues,{matrix:6,origin:{length:2,duplicate:true},reflect:6,reflectX:6,reflectXY:6,reflectY:6,scale:{length:2,duplicate:true},skew:2,translate:2});g.extend(g.cssNumber,{matrix:true,reflect:true,reflectX:true,reflectXY:true,reflectY:true,scale:true,scaleX:true,scaleY:true});g.each(g.transform.funcs,function(j,k){g.cssHooks[k]={set:function(n,o){var l=n.transform||new g.transform(n),i={};i[k]=o;l.exec(i,{preserve:true})},get:function(n,l){var i=n.transform||new g.transform(n);return i.getAttr(k)}}});g.each(["reflect","reflectX","reflectXY","reflectY"],function(j,k){g.cssHooks[k].get=function(n,l){var i=n.transform||new g.transform(n);return i.getAttr("matrix")||g.cssDefault[k]}})})(jQuery,this,this.document);(function(f,g,h,c){var d=/^([+\-]=)?([\d+.\-]+)(.*)$/;var a=f.fn.animate;f.fn.animate=function(p,l,o,n){var k=f.speed(l,o,n),j=f.cssMultipleValues;k.complete=k.old;if(!f.isEmptyObject(p)){if(typeof k.original==="undefined"){k.original={}}f.each(p,function(s,u){if(j[s]||f.cssAngle[s]||(!f.cssNumber[s]&&f.inArray(s,f.transform.funcs)!==-1)){var t=null;if(jQuery.isArray(p[s])){var r=1,q=u.length;if(j[s]){r=(typeof j[s].length==="undefined"?j[s]:j[s].length)}if(q>r||(q<r&&q==2)||(q==2&&r==2&&isNaN(parseFloat(u[q-1])))){t=u[q-1];u.splice(q-1,1)}}k.original[s]=u.toString();p[s]=parseFloat(u)}})}return a.apply(this,[arguments[0],k])};var b="paddingBottom";function i(k,l){if(k[l]!=null&&(!k.style||k.style[l]==null)){}var j=parseFloat(f.css(k,l));return j&&j>-10000?j:0}function e(u,v,w){var y=f.cssMultipleValues[this.prop],p=f.cssAngle[this.prop];if(y||(!f.cssNumber[this.prop]&&f.inArray(this.prop,f.transform.funcs)!==-1)){this.values=[];if(!y){y=1}var x=this.options.original[this.prop],t=f(this.elem).css(this.prop),j=f.cssDefault[this.prop]||0;if(!f.isArray(t)){t=[t]}if(!f.isArray(x)){if(f.type(x)==="string"){x=x.split(",")}else{x=[x]}}var l=y.length||y,s=0;while(x.length<l){x.push(y.duplicate?x[0]:j[s]||0);s++}var k,r,q,o=this,n=o.elem.transform;orig=f.style(o.elem,b);f.each(x,function(z,A){if(t[z]){k=t[z]}else{if(j[z]&&!y.duplicate){k=j[z]}else{if(y.duplicate){k=t[0]}else{k=0}}}if(p){k=f.angle.toDegree(k)}else{if(!f.cssNumber[o.prop]){r=d.exec(f.trim(k));if(r[3]&&r[3]!=="px"){if(r[3]==="%"){k=parseFloat(r[2])/100*n["safeOuter"+(z?"Height":"Width")]()}else{f.style(o.elem,b,k);k=i(o.elem,b);f.style(o.elem,b,orig)}}}}k=parseFloat(k);r=d.exec(f.trim(A));if(r){q=parseFloat(r[2]);w=r[3]||"px";if(p){q=f.angle.toDegree(q+w);w="deg"}else{if(!f.cssNumber[o.prop]&&w==="%"){k=(k/n["safeOuter"+(z?"Height":"Width")]())*100}else{if(!f.cssNumber[o.prop]&&w!=="px"){f.style(o.elem,b,(q||1)+w);k=((q||1)/i(o.elem,b))*k;f.style(o.elem,b,orig)}}}if(r[1]){q=((r[1]==="-="?-1:1)*q)+k}}else{q=A;w=""}o.values.push({start:k,end:q,unit:w})})}}if(f.fx.prototype.custom){(function(k){var j=k.custom;k.custom=function(o,n,l){e.apply(this,arguments);return j.apply(this,arguments)}}(f.fx.prototype))}if(f.Animation&&f.Animation.tweener){f.Animation.tweener(f.transform.funcs.join(" "),function(l,k){var j=this.createTween(l,k);e.apply(j,[j.start,j.end,j.unit]);return j})}f.fx.multipleValueStep={_default:function(j){f.each(j.values,function(k,l){j.values[k].now=l.start+((l.end-l.start)*j.pos)})}};f.each(["matrix","reflect","reflectX","reflectXY","reflectY"],function(j,k){f.fx.multipleValueStep[k]=function(n){var p=n.decomposed,l=f.matrix;m=l.identity();p.now={};f.each(p.start,function(q){p.now[q]=parseFloat(p.start[q])+((parseFloat(p.end[q])-parseFloat(p.start[q]))*n.pos);if(((q==="scaleX"||q==="scaleY")&&p.now[q]===1)||(q!=="scaleX"&&q!=="scaleY"&&p.now[q]===0)){return true}m=m.x(l[q](p.now[q]))});var o;f.each(n.values,function(q){switch(q){case 0:o=parseFloat(m.e(1,1).toFixed(6));break;case 1:o=parseFloat(m.e(2,1).toFixed(6));break;case 2:o=parseFloat(m.e(1,2).toFixed(6));break;case 3:o=parseFloat(m.e(2,2).toFixed(6));break;case 4:o=parseFloat(m.e(1,3).toFixed(6));break;case 5:o=parseFloat(m.e(2,3).toFixed(6));break}n.values[q].now=o})}});f.each(f.transform.funcs,function(k,l){function j(p){var o=p.elem.transform||new f.transform(p.elem),n={};if(f.cssMultipleValues[l]||(!f.cssNumber[l]&&f.inArray(l,f.transform.funcs)!==-1)){(f.fx.multipleValueStep[p.prop]||f.fx.multipleValueStep._default)(p);n[p.prop]=[];f.each(p.values,function(q,r){n[p.prop].push(r.now+(f.cssNumber[p.prop]?"":r.unit))})}else{n[p.prop]=p.now+(f.cssNumber[p.prop]?"":p.unit)}o.exec(n,{preserve:true})}if(f.Tween&&f.Tween.propHooks){f.Tween.propHooks[l]={set:j}}if(f.fx.step){f.fx.step[l]=j}});f.each(["matrix","reflect","reflectX","reflectXY","reflectY"],function(k,l){function j(r){var q=r.elem.transform||new f.transform(r.elem),p={};if(!r.initialized){r.initialized=true;if(l!=="matrix"){var o=f.matrix[l]().elements;var s;f.each(r.values,function(t){switch(t){case 0:s=o[0];break;case 1:s=o[2];break;case 2:s=o[1];break;case 3:s=o[3];break;default:s=0}r.values[t].end=s})}r.decomposed={};var n=r.values;r.decomposed.start=f.matrix.matrix(n[0].start,n[1].start,n[2].start,n[3].start,n[4].start,n[5].start).decompose();r.decomposed.end=f.matrix.matrix(n[0].end,n[1].end,n[2].end,n[3].end,n[4].end,n[5].end).decompose()}(f.fx.multipleValueStep[r.prop]||f.fx.multipleValueStep._default)(r);p.matrix=[];f.each(r.values,function(t,u){p.matrix.push(u.now)});q.exec(p,{preserve:true})}if(f.Tween&&f.Tween.propHooks){f.Tween.propHooks[l]={set:j}}if(f.fx.step){f.fx.step[l]=j}})})(jQuery,this,this.document);(function(g,h,j,c){var d=180/Math.PI;var k=200/Math.PI;var f=Math.PI/180;var e=2/1.8;var i=0.9;var a=Math.PI/200;var b=/^([+\-]=)?([\d+.\-]+)(.*)$/;g.extend({angle:{runit:/(deg|g?rad)/,radianToDegree:function(l){return l*d},radianToGrad:function(l){return l*k},degreeToRadian:function(l){return l*f},degreeToGrad:function(l){return l*e},gradToDegree:function(l){return l*i},gradToRadian:function(l){return l*a},toDegree:function(n){var l=b.exec(n);if(l){n=parseFloat(l[2]);switch(l[3]||"deg"){case"grad":n=g.angle.gradToDegree(n);break;case"rad":n=g.angle.radianToDegree(n);break}return n}return 0}}})})(jQuery,this,this.document);(function(f,e,b,g){if(typeof(f.matrix)=="undefined"){f.extend({matrix:{}})}var d=f.matrix;f.extend(d,{V2:function(h,i){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,2)}else{this.elements=[h,i]}this.length=2},V3:function(h,j,i){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,3)}else{this.elements=[h,j,i]}this.length=3},M2x2:function(i,h,k,j){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,4)}else{this.elements=Array.prototype.slice.call(arguments).slice(0,4)}this.rows=2;this.cols=2},M3x3:function(n,l,k,j,i,h,q,p,o){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,9)}else{this.elements=Array.prototype.slice.call(arguments).slice(0,9)}this.rows=3;this.cols=3}});var c={e:function(k,h){var i=this.rows,j=this.cols;if(k>i||h>i||k<1||h<1){return 0}return this.elements[(k-1)*j+h-1]},decompose:function(){var v=this.e(1,1),t=this.e(2,1),q=this.e(1,2),p=this.e(2,2),o=this.e(1,3),n=this.e(2,3);if(Math.abs(v*p-t*q)<0.01){return{rotate:0+"deg",skewX:0+"deg",scaleX:1,scaleY:1,translateX:0+"px",translateY:0+"px"}}var l=o,j=n;var u=Math.sqrt(v*v+t*t);v=v/u;t=t/u;var i=v*q+t*p;q-=v*i;p-=t*i;var s=Math.sqrt(q*q+p*p);q=q/s;p=p/s;i=i/s;if((v*p-t*q)<0){v=-v;t=-t;u=-u}var w=f.angle.radianToDegree;var h=w(Math.atan2(t,v));i=w(Math.atan(i));return{rotate:h+"deg",skewX:i+"deg",scaleX:u,scaleY:s,translateX:l+"px",translateY:j+"px"}}};f.extend(d.M2x2.prototype,c,{toM3x3:function(){var h=this.elements;return new d.M3x3(h[0],h[1],0,h[2],h[3],0,0,0,1)},x:function(j){var k=typeof(j.rows)==="undefined";if(!k&&j.rows==3){return this.toM3x3().x(j)}var i=this.elements,h=j.elements;if(k&&h.length==2){return new d.V2(i[0]*h[0]+i[1]*h[1],i[2]*h[0]+i[3]*h[1])}else{if(h.length==i.length){return new d.M2x2(i[0]*h[0]+i[1]*h[2],i[0]*h[1]+i[1]*h[3],i[2]*h[0]+i[3]*h[2],i[2]*h[1]+i[3]*h[3])}}return false},inverse:function(){var i=1/this.determinant(),h=this.elements;return new d.M2x2(i*h[3],i*-h[1],i*-h[2],i*h[0])},determinant:function(){var h=this.elements;return h[0]*h[3]-h[1]*h[2]}});f.extend(d.M3x3.prototype,c,{x:function(j){var k=typeof(j.rows)==="undefined";if(!k&&j.rows<3){j=j.toM3x3()}var i=this.elements,h=j.elements;if(k&&h.length==3){return new d.V3(i[0]*h[0]+i[1]*h[1]+i[2]*h[2],i[3]*h[0]+i[4]*h[1]+i[5]*h[2],i[6]*h[0]+i[7]*h[1]+i[8]*h[2])}else{if(h.length==i.length){return new d.M3x3(i[0]*h[0]+i[1]*h[3]+i[2]*h[6],i[0]*h[1]+i[1]*h[4]+i[2]*h[7],i[0]*h[2]+i[1]*h[5]+i[2]*h[8],i[3]*h[0]+i[4]*h[3]+i[5]*h[6],i[3]*h[1]+i[4]*h[4]+i[5]*h[7],i[3]*h[2]+i[4]*h[5]+i[5]*h[8],i[6]*h[0]+i[7]*h[3]+i[8]*h[6],i[6]*h[1]+i[7]*h[4]+i[8]*h[7],i[6]*h[2]+i[7]*h[5]+i[8]*h[8])}}return false},inverse:function(){var i=1/this.determinant(),h=this.elements;return new d.M3x3(i*(h[8]*h[4]-h[7]*h[5]),i*(-(h[8]*h[1]-h[7]*h[2])),i*(h[5]*h[1]-h[4]*h[2]),i*(-(h[8]*h[3]-h[6]*h[5])),i*(h[8]*h[0]-h[6]*h[2]),i*(-(h[5]*h[0]-h[3]*h[2])),i*(h[7]*h[3]-h[6]*h[4]),i*(-(h[7]*h[0]-h[6]*h[1])),i*(h[4]*h[0]-h[3]*h[1]))},determinant:function(){var h=this.elements;return h[0]*(h[8]*h[4]-h[7]*h[5])-h[3]*(h[8]*h[1]-h[7]*h[2])+h[6]*(h[5]*h[1]-h[4]*h[2])}});var a={e:function(h){return this.elements[h-1]}};f.extend(d.V2.prototype,a);f.extend(d.V3.prototype,a)})(jQuery,this,this.document);(function(c,b,a,d){if(typeof(c.matrix)=="undefined"){c.extend({matrix:{}})}c.extend(c.matrix,{calc:function(e,f,g){this.matrix=e;this.outerHeight=f;this.outerWidth=g}});c.matrix.calc.prototype={coord:function(e,i,h){h=typeof(h)!=="undefined"?h:0;var g=this.matrix,f;switch(g.rows){case 2:f=g.x(new c.matrix.V2(e,i));break;case 3:f=g.x(new c.matrix.V3(e,i,h));break}return f},corners:function(e,h){var f=!(typeof(e)!=="undefined"||typeof(h)!=="undefined"),g;if(!this.c||!f){h=h||this.outerHeight;e=e||this.outerWidth;g={tl:this.coord(0,0),bl:this.coord(0,h),tr:this.coord(e,0),br:this.coord(e,h)}}else{g=this.c}if(f){this.c=g}return g},sides:function(e){var f=e||this.corners();return{top:Math.min(f.tl.e(2),f.tr.e(2),f.br.e(2),f.bl.e(2)),bottom:Math.max(f.tl.e(2),f.tr.e(2),f.br.e(2),f.bl.e(2)),left:Math.min(f.tl.e(1),f.tr.e(1),f.br.e(1),f.bl.e(1)),right:Math.max(f.tl.e(1),f.tr.e(1),f.br.e(1),f.bl.e(1))}},offset:function(e){var f=this.sides(e);return{height:Math.abs(f.bottom-f.top),width:Math.abs(f.right-f.left)}},area:function(e){var h=e||this.corners();var g={x:h.tr.e(1)-h.tl.e(1)+h.br.e(1)-h.bl.e(1),y:h.tr.e(2)-h.tl.e(2)+h.br.e(2)-h.bl.e(2)},f={x:h.bl.e(1)-h.tl.e(1)+h.br.e(1)-h.tr.e(1),y:h.bl.e(2)-h.tl.e(2)+h.br.e(2)-h.tr.e(2)};return 0.25*Math.abs(g.e(1)*f.e(2)-g.e(2)*f.e(1))},nonAffinity:function(){var f=this.sides(),g=f.top-f.bottom,e=f.left-f.right;return parseFloat(parseFloat(Math.abs((Math.pow(g,2)+Math.pow(e,2))/(f.top*f.bottom+f.left*f.right))).toFixed(8))},originOffset:function(h,g){h=h?h:new c.matrix.V2(this.outerWidth*0.5,this.outerHeight*0.5);g=g?g:new c.matrix.V2(0,0);var e=this.coord(h.e(1),h.e(2));var f=this.coord(g.e(1),g.e(2));return{top:(f.e(2)-g.e(2))-(e.e(2)-h.e(2)),left:(f.e(1)-g.e(1))-(e.e(1)-h.e(1))}}}})(jQuery,this,this.document);(function(e,d,a,f){if(typeof(e.matrix)=="undefined"){e.extend({matrix:{}})}var c=e.matrix,g=c.M2x2,b=c.M3x3;e.extend(c,{identity:function(k){k=k||2;var l=k*k,n=new Array(l),j=k+1;for(var h=0;h<l;h++){n[h]=(h%j)===0?1:0}return new c["M"+k+"x"+k](n)},matrix:function(){var h=Array.prototype.slice.call(arguments);switch(arguments.length){case 4:return new g(h[0],h[2],h[1],h[3]);case 6:return new b(h[0],h[2],h[4],h[1],h[3],h[5],0,0,1)}},reflect:function(){return new g(-1,0,0,-1)},reflectX:function(){return new g(1,0,0,-1)},reflectXY:function(){return new g(0,1,1,0)},reflectY:function(){return new g(-1,0,0,1)},rotate:function(l){var i=e.angle.degreeToRadian(l),k=Math.cos(i),n=Math.sin(i);var j=k,h=n,p=-n,o=k;return new g(j,p,h,o)},scale:function(i,h){i=i||i===0?i:1;h=h||h===0?h:i;return new g(i,0,0,h)},scaleX:function(h){return c.scale(h,1)},scaleY:function(h){return c.scale(1,h)},skew:function(k,i){k=k||0;i=i||0;var l=e.angle.degreeToRadian(k),j=e.angle.degreeToRadian(i),h=Math.tan(l),n=Math.tan(j);return new g(1,h,n,1)},skewX:function(h){return c.skew(h)},skewY:function(h){return c.skew(0,h)},translate:function(i,h){i=i||0;h=h||0;return new b(1,0,i,0,1,h,0,0,1)},translateX:function(h){return c.translate(h)},translateY:function(h){return c.translate(0,h)}})})(jQuery,this,this.document);

/**
 * jQuery animate background-position
 * referred : http://stackoverflow.com/questions/5518834/jquery-animate-background-position-firefox
 * (FIXED By Prydie[http://stackoverflow.com/users/374052/prydie], this version support jQuery >= 1.8.0)
 */
(function(b){if(!document.defaultView||!document.defaultView.getComputedStyle){var d=jQuery.css;jQuery.css=function(g,e,h){if(e==="background-position"){e="backgroundPosition"}if(e!=="backgroundPosition"||!g.currentStyle||g.currentStyle[e]){return d.apply(this,arguments)}var f=g.style;if(!h&&f&&f[e]){return f[e]}return d(g,"backgroundPositionX",h)+" "+d(g,"backgroundPositionY",h)}}var c=b.fn.animate;b.fn.animate=function(e){if("background-position" in e){e.backgroundPosition=e["background-position"];delete e["background-position"]}if("backgroundPosition" in e){e.backgroundPosition="("+e.backgroundPosition+")"}return c.apply(this,arguments)};function a(f){f=f.replace(/left|top/g,"0px");f=f.replace(/right|bottom/g,"100%");f=f.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");var e=f.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);return[parseFloat(e[1],10),e[2],parseFloat(e[3],10),e[4]]}b.fx.step.backgroundPosition=function(f){if(!f.bgPosReady){var h=b.css(f.elem,"backgroundPosition");if(!h){h="0px 0px"}h=a(h);f.start=[h[0],h[2]];var e=a(f.end);f.end=[e[0],e[2]];f.unit=[e[1],e[3]];f.bgPosReady=true}var g=[];g[0]=((f.end[0]-f.start[0])*f.pos)+f.start[0]+f.unit[0];g[1]=((f.end[1]-f.start[1])*f.pos)+f.start[1]+f.unit[1];f.elem.style.backgroundPosition=g[0]+" "+g[1]}})(jQuery);
