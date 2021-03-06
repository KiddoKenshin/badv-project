/**
 * The BADV-TRE Project System Core
 * BADV-TRE Project is a short term of Browser ADVenture Third REvision Project.
 * The purpose of this project is to allow creators to simply able to make Novel/Text based game easily with this.
 * This is the third version of BADV. The previous RE:BADV was discontinued because it was not developer friendly at all.
 * BADV-TRE is aiming for simple development. (Developer/Provider will just need to provide script text / JSON content to run.)
 * 
 * Requirements:
 * jQuery >= 2.0.3
 * Webkit / Gecko based browsers with HTML5 Support. (Example: Chrome, Firefox)
 * (Optional) Web Audio API supported browser
 * 
 * Not Supported:
 * Non Webkit / Gecko based browsers. (Example: Internet Explorer, -Classic- Opera)
 * 
 * Visions:
 * Firefox OS port
 * HTML5 Canvas Only version
 * 
 * @author KiddoKenshin at K2-R&D.com
 * @since 2012/04/01, RE: 2013/01/17, TRE: 2013/12/13
 * @version WORK IN PROGRESS
 */

// GENERAL AREA //
var BADV = new Object();

// GENERAL SWITCHES //
// Even though you can, it's advised not to directly access to the switches
BADV.switches = {
	_debugMode : false,
	_loadComplete : false,
	
	_autoRescale : false, // Set window size changed listener when activated.
};

// BADV Configuration //
// Overwrite it before running init.
BADV.config = {
	_windowName : 'BADV Default',
	_applicationUrl : location.href,
	_intervalPerFrame : jQuery.fx.interval, // Always check on jQuery's interval (Not needed?)
	
	_forceWidth : null,
	_forceHeight : null,
	
	_loadingMethod : 'default', // default(all in once), precise(one by one)
	_useBase64 : false, // Use Base64 images (DataUri)
};

// TODO: Combine switch and config into one option?

/**
 * The infamous RNG.
 * @param int range
 * @return int
 */
BADV.getRandom = function(range) {
	return Math.floor(Math.random() * range);
};

/**
 * Check whether the current window is a new one.
 * (For window.resizeTo to work)
 * @return boolean
 */
BADV.newWindowCheck = function() {
	var ret = false;
	if (window.name == BADV.config._windowName) {
		ret = true;
	}
	return ret;
};

/**
 * The rescale function
 * (Used upon screen size changed and during init)
 * @param int mainWidth
 * @param int mainHeight
 * @param int targetWidth
 * @param int targetHeight
 * @return void
 */
BADV.rescale = function(mainWidth, mainHeight, targetWidth, targetHeight) {
	var scale = targetWidth / mainWidth;
	
	if (scale !== 1.0) {
		// Fit inside window (no scroll bars)
		var scaledHeight = Math.floor(mainHeight * scale);
		if (scaledHeight > targetHeight) {
			scale = targetHeight / mainHeight;
		}
		
		// Do not allow scaling below 0.5. (Quality issue)
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
};

/**
 * Screen Re-scaler 
 * (Make sure this passes .newWindowCheck before execute)
 * @return void
 */
BADV.startRescaler = function() {
	
	// Set Default size
	var mainWidth = parseInt($('div#main').css('width'));
	var mainHeight = parseInt($('div#main').css('height'));
	$('body').css({
		'width' : mainWidth + 'px',
		'height' : mainHeight + 'px'
	});
	
	// The auto rescaler (Disabled by default)
	if (BADV._autoRescale) {
		$(window).resize(function() {
			var targetWidth = $(window).width();
			var targetHeight = $(window).height();
			
			BADV.rescale(mainWidth, mainHeight, targetWidth, targetHeight);
		});
	}
	
	var targetWidth = $(window).width();
	var targetHeight = $(window).height();
	if (BADV.config._forceWidth !== null && BADV.config._forceHeight !== null) {
		targetWidth = BADV.config._forceWidth;
		targetHeight = BADV.config._forceHeight;
	}
	
	BADV.rescale(mainWidth, mainHeight, targetWidth, targetHeight);
	
};

// Android detector
BADV.androidVer = -1;
BADV.getAndroidVersion = function() {
	if (BADV.androidVer === -1) {
		var ua = navigator.userAgent;
		var strings = ua.split('; ');
		var totalStrings = strings.length;
		BADV.androidVer = 0;
		for (var i = 0; i < totalStrings; i++) {
			if (strings[i].match(/(android)|(Android)/i)) {
				var temp = strings[i].split(' ');
				BADV.androidVer = parseFloat(temp[1]);
				break;
			}
		}
	}
	
	return BADV.androidVer;
};

// iOS detector
BADV.iOSVersion = -1;
BADV.getiOSVersion = function() {
	if (BADV.iOSVersion === -1) {
		var agent = window.navigator.userAgent,
		start = agent.indexOf('OS ');
		
		BADV.iOSVersion = 0;
		if ((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) && start > -1) {
			BADV.iOSVersion = parseFloat(agent.substr(start + 3, 3).replace('_', '.'));
		}
	}
	
	return BADV.iOSVersion;
};

BADV.isWebkit = function() {
	return window.navigator.userAgent.match(/(webkit)|(Webkit)|(WebKit)/i);
};

// Mobile Device Detector
BADV.clientDevice = null;
BADV.isMobile = function() {
	if (BADV.clientDevice === null) {
		if (BADV.getAndroidVersion() === 0 && BADV.getiOSVersion() === 0) {
			BADV.clientDevice = 'pc';
		} else {
			BADV.clientDevice = 'mobile';
		}
	}
	
	return BADV.clientDevice === 'mobile';
};

BADV.consoleLogger = function(input) {
	if (this.switches._debugMode && typeof(console) != 'undefined') {
		console.log(input);
	}
};

// AUDIO RELATED //
BADV.audio = {
	_audioContext : null,
	_masterVolume : 1,
	_masterVolumeControl : null,
	_bgmVolume : 1,
	_bgmVolumeControl : null,
	_sfxVolume : 1,
	_sfxVolumeControl : null,
	_voiceVolume : 1,
	_voiceVolumeControl : null,
	
	_createAudioContext : function() {
		if (typeof(AudioContext) != 'undefined') {
			return new AudioContext();
		} else if (typeof(webkitAudioContext) != 'undefined') {
			return new webkitAudioContext();
		} else if (typeof(mozAudioContext) != 'undefined') {
			return new mozAudioContext();
		} else {
			// Web Audio API is not available
			BADV.consoleLogger('Web Audio API is not available');
			return false;
		}
	},
	
	// BGM
	_bgmOutput : null, // To detect playing state
	_bgmOutputVolume : null, // For Crossfade FX
	
	// SFX (Not needed due to single playback)
	
	// VOICE
	_voicePlaystateChecker : null, // For setInterval...
	_voiceOutput : null, // To detect playing state
	
	_initAudio : function() {
		this._audioContext = this._createAudioContext();
		if (this._audioContext !== false) {
			var aContext = this._audioContext;
			this._masterVolumeControl = aContext.createGain();
			this._masterVolumeControl.gain.value = this._masterVolume;
			
			this._bgmVolumeControl = aContext.createGain();
			this._bgmVolumeControl.gain.value = this._bgmVolume;
			this._bgmVolumeControl.connect(this._masterVolumeControl);
			
			this._sfxVolumeControl = aContext.createGain();
			this._sfxVolumeControl.gain.value = this._sfxVolume;
			this._sfxVolumeControl.connect(this._masterVolumeControl);
			
			this._voiceVolumeControl = aContext.createGain();
			this._voiceVolumeControl.gain.value = this._voiceVolume;
			this._voiceVolumeControl.connect(this._masterVolumeControl);
			
			this._masterVolumeControl.connect(aContext.destination);
		}
	},
	
	_list : {},
	_queues : [], // For precise mode only
	_currentQueue : -1, // For precise mode only
	
	_totalAudio : 0,
	_audioLoaded : 0,
	_preloadedAudios : {},
	_loadNext : function() {
		if ((++this._currentQueue) == this._queues.length) {
			// All loaded.
			BADV.consoleLogger('All audio loaded.');
			return;
		}
		var audioId = this._queues[this._currentQueue];
		var audioUrl = this._list[audioId];
		this._loadAudio(audioId, audioUrl);
	},
	_loadAudio : function(audioId, audioUrl, toMono) {
		
		if (this._audioContext === false) {
			// No Web Audio API. No audio support :(
			this._totalAudio--;
			return;
		}
		
		if (audioUrl == undefined) {
			throw new Error('AudioUrl not defined.');
		}
		
		if (toMono == undefined) {
			toMono = false;
		}
		
		var aContext = this._audioContext;
		var preciseLoad = (BADV.config._loadingMethod == 'precise');
		
		var request = new XMLHttpRequest();
		request.open('GET', audioUrl, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			
			aContext.decodeAudioData(request.response, function(buffer) {
				this._preloadedAudios[audioId] = buffer;
				BADV.consoleLogger(audioFileUrl + ' loaded!');
				this._audioLoaded++;
				
				if (preciseLoad) {
					this._loadNext();
				}
				
			}, function() {
				// Error Callback
				this._totalAudio--;
				BADV.consoleLogger(audioFileUrl + ' error! (Decode)');
				
				if (preciseLoad) {
					this._loadNext();
				}
				
			});
		};
		
		request.onerror = function() {
			this._totalAudio--;
			BADV.consoleLogger(audioFileUrl + ' error! (Request)');
			if (preciseLoad) {
				this._loadNext();
			}
		};
		
		request.send();
	},
	
};

BADV.audioLoader = function() {
	var audio = BADV.audio;
	if (audio._audioContext == null) {
		audio._initAudio();
	}
	
	if (audio._audioContext === false) {
		// No Web Audio API. No audio support :(
		BADV.consoleLogger('Web Audio API not available.');
		return;
	}
	
	var preciseLoad = (BADV.config._loadingMethod == 'precise');
	if (preciseLoad) {
		// Reset and populate queues from list
		delete audio._queues;
		audio._queues = [];
		audio._currentQueue = -1;
		for (objectKey in audio._list) {
			audio._totalAudio++;
			audio._queues.push(objectKey);
		}
		audio._loadNext();
	} else {
		for (objectKey in audio._list) {
			audio._totalAudio++;
			audio._loadAudio(objectKey, audio._list[objectKey]);
		}
	}
};

BADV.playBGM = function(audioData, forcePlay) {
	var audio = BADV.audio;
	if (audio._audioContext == false) {
		// No audio, no life.
		return;
	}
	
	if (audioData == undefined) {
		throw new Error('No Audio data');
	}
	
	if (forcePlay == undefined) {
		forcePlay = false;
	}
	
	var startVolume = 1;
	if (audio._bgmOutput != null && !forcePlay) {
		startVolume = 0;
	}
	
	var BGMOutput = audio._audioContext.createBufferSource();
	BGMOutput.buffer = audioData;
	BGMOutput.loop = true;
	
	var thisVolume = audio._audioContext.createGain();
	thisVolume.gain.value = startVolume;
	thisVolume.connect(audio._bgmVolumeControl);
	
	// BGMOutput.connect(audio._bgmVolumeControl);
	BGMOutput.connect(thisVolume);
	BGMOutput.start(0);
	
	if (audio._bgmOutput != null && forcePlay) {
		// Stop previous track. No crossfade
		audio._bgmOutput.stop();
		delete audio._bgmOutput, audio._bgmOutput;
		audio._bgmOutput = null;
		audio._bgmOutputVolume = null;
		
		audio._bgmOutput = BGMOutput;
		audio._bgmOutputVolume = thisVolume;
	} else if (audio._bgmOutput != null && !forcePlay) {
		// 1 second Crossfade
		// TODO: What happened if skipped?
		var amount = (1 / Math.round(1000 / BADV.config._intervalPerFrame)).toFixed(5);
		var crossFade = setInterval(function() {
			audio._bgmOutputVolume -= amount;
			thisVolume.gain.value += amount;
			
			if (thisVolume.gain.value >= 1.0) {
				clearInterval(crossFade);
				
				audio._bgmOutputVolume = 0;
				audio._bgmOutput.stop();
				delete audio._bgmOutput, audio._bgmOutput;
				audio._bgmOutput = null;
				audio._bgmOutputVolume = null;
				
				thisVolume.gain.value = 1;
				
				audio._bgmOutput = BGMOutput;
				audio._bgmOutputVolume = thisVolume;
			}
		}, BADV.config._intervalPerFrame);
		
	} else {
		audio._bgmOutput = BGMOutput;
		audio._bgmOutputVolume = thisVolume;
	}
};

BADV.stopBGM = function(noFade) {
	var audio = BADV.audio;
	if (audio._audioContext == false) {
		// No audio, no life.
		return;
	}
	
	if (noFade == undefined) {
		noFade = false;
	}
	
	if (!noFade) {
		// 1 second fade
		var amount = (1 / Math.round(1000 / BADV.config._intervalPerFrame)).toFixed(5);
		var fade = setInterval(function() {
			audio._bgmOutputVolume -= amount;
			
			if (audio._bgmOutputVolume <= 0) {
				clearInterval(crossFade);
				
				audio._bgmOutputVolume = 0;
				audio._bgmOutput.stop();
				
				delete audio._bgmOutput, audio._bgmOutput;
				audio._bgmOutput = null;
				audio._bgmOutputVolume = null;
			}
		}, BADV.config._intervalPerFrame);
	} else {
		audio._bgmOutput.stop();
		delete audio._bgmOutput, audio._bgmOutput;
		audio._bgmOutput = null;
		audio._bgmOutputVolume = null;
	}
};

BADV.playVoice = function(audioData) {
	var audio = BADV.audio;
	if (audio._audioContext == false) {
		// No audio, no life.
		return;
	}
	
	if (audioData == undefined) {
		throw new Error('No Audio data');
	}
	
	if (audio._voiceOutput != null) {
		clearInterval(audio._voicePlaystateChecker);
		audio._voiceOutput.stop(0);
		delete audio._voiceOutput;
		audio._voiceOutput = null;
	}
	
	var voiceOutput = audio._audioContext.createBufferSource();
	voiceOutput.buffer = audioData;
	
	voiceOutput.connect(audio._bgmVolumeControl);
	voiceOutput.start(0);
	
	audio._voiceOutput = voiceOutput;
	
	// Observe playstate...
	if (typeof(audio._voiceOutput.onended) === 'object' && !BADV.isWebkit()) {
		// Use onended for browser that support it.
		// Current support : Firefox works fine, Chrome (even Canary) is still buggy
		audio._voiceOutput.onended = function() {
			try {
				audio._voiceOutput.stop(0);
			} catch (Exception) {
				console.log('Voice completed or not exits. (Onended)');
			}
			delete audio._voiceOutput;
			audio._voiceOutput = null;
		};
	} else {
		// The legacy support for browsers that do not have onended feature
		// Reference : UNSCHEDULED_STATE (0), SCHEDULED_STATE (1), PLAYING_STATE (2), or FINISHED_STATE (3)
		audio._voicePlaystateChecker = setInterval(function() {
			if (audio._voiceOutput.playbackState === audio._voiceOutput.FINISHED_STATE) {
				clearInterval(audio._voicePlaystateChecker);
				try {
					audio._voiceOutput.stop(0);
				} catch (Exception) {
					console.log('Voice completed or not exits. (Interval)');
				}
				delete audio._voiceOutput;
				audio._voiceOutput = null;
			}
		}, BADV.config._intervalPerFrame);
	}
	
};

BADV.playSFX = function(audioData) {
	var audio = BADV.audio;
	if (audio._audioContext == false) {
		// No audio, no life.
		return;
	}
	
	if (audioData == undefined) {
		throw new Error('No Audio data');
	}
	
	var sfxOutput = audio._audioContext.createBufferSource();
	sfxOutput.buffer = audioData;
	
	sfxOutput.connect(audio._bgmVolumeControl);
	sfxOutput.start(0);
	
	// Observe playstate...
	if (typeof(sfxOutput.onended) === 'object' && !BADV.isWebkit()) {
		// Use onended for browser that support it.
		// Current support : Firefox works fine, Chrome (even Canary) is still buggy
		sfxOutput.onended = function() {
			try {
				sfxOutput.stop(0);
			} catch (Exception) {
				console.log('SFX completed or not exits. (Onended)');
			}
			delete sfxOutput;
		};
	} else {
		// The legacy support for browsers that do not have onended feature
		// Reference : UNSCHEDULED_STATE (0), SCHEDULED_STATE (1), PLAYING_STATE (2), or FINISHED_STATE (3)
		var sfxCheck = setInterval(function() {
			if (sfxOutput.playbackState === sfxOutput.FINISHED_STATE) {
				clearInterval(sfxCheck);
				try {
					sfxOutput.stop(0);
				} catch (Exception) {
					console.log('SFX completed or not exits. (Interval)');
				}
				delete sfxOutput;
			}
		}, BADV.config._intervalPerFrame);
	}
	
};

// IMAGE RELATED //
BADV.image = {
	_list : {},
	_queues : [], // For precise mode only
	_currentQueue : -1, // For precise mode only
	
	_totalImage : 0,
	_imageLoaded : 0,
	_preloadedImages : {},
	_loadNext : function() {
		
	},
	_loadImage : function(imageId, imageUrl) {
		var preciseLoad = (BADV.config._loadingMethod == 'precise');
		$('<img />').error(function () {
			// Loader error handler
			BADV.consoleLogger('error occurred while loading ' + imageUrl + ' .');
			this._totalImage--;
			if (preciseLoad) {
				this._loadNext();
			}
		}).attr('src', imageUrl).load(function () {
			// Image loaded call back
			this._imageLoaded++;
			BADV.consoleLogger('image loaded:  ' + imageUrl + ' .');
			this._preloadedImages[imageId] = imageUrl;
			if (preciseLoad) {
				this._loadNext();
			}
		});
	},
	_loadImageToBase64 : function(imageId, imageUrl) {
		// Referred : http://hi0a.com/demo/img-base64-datauri/
		
		var preciseLoad = (BADV.config._loadingMethod == 'precise');
		var request = new XMLHttpRequest();
		request.open('GET', imageUrl, true);
		// request.responseType = 'text';
		request.overrideMimeType('text/plain; charset=x-user-defined');
		
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
			this._preloadedImages[imageId] = ('data:image/' + ext + ';base64,' + convert64);
			if (preciseLoad) {
				this._loadNext();
			}
		};
		
		request.onerror = function() {
			BADV.consoleLogger('error occurred while loading ' + imageUrl + ' . (B64)');
			if (preciseLoad) {
				this._loadNext();
			}
		};
		
		request.send();
	}
};

BADV.imageLoader = function() {
	var image = BADV.image;
	var preciseLoad = (BADV.config._loadingMethod == 'precise');
	var useBase64 = BADV.config._useBase64;
	if (preciseLoad) {
		// Reset and populate queues from list
		delete image._queues;
		image._queues = [];
		image._currentQueue = -1;
		for (objectKey in image._list) {
			image._totalImage++;
			image._queues.push(objectKey);
		}
		image._loadNext();
	} else {
		for (objectKey in image._list) {
			image._totalImage++;
			if (useBase64) {
				image._loadImageToBase64(objectKey, image._list[objectKey]);
			} else {
				image._loadImage(objectKey, image._list[objectKey]);
			}
		}
	}
};

// TEXT / VISUAL OUTPUT RELATED //
BADV.textvisual = {
	_outputElement : 'div#text',
	_nameOutputElement : 'div#name',
	_outputingText : false,
	
	_aLip : [
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
	],
	_iLip : [
		'い', 'ぃ', 'イ', 'ィ', 
		'き', 'ぎ', 'キ', 'ギ', 
		'し', 'じ', 'シ', 'ジ', 
		'ち', 'ぢ', 'チ', 'ヂ', 
		'に', 'ニ', 
		'ひ', 'び', 'ぴ', 'ヒ', 'ビ', 'ピ', 
		'み', 'ミ', 
		'り', 'リ', 
		'ゐ', 'ヰ' 
	],
	_uLip : [
		'う', 'ぅ', 'ウ', 'ゥ', 
		'く', 'ぐ', 'ク', 'グ', 
		'す', 'ず', 'ス', 'ズ', 
		'つ', 'づ', 'ツ', 'ヅ', 
		'ぬ', 'ヌ', 
		'ふ', 'ぶ', 'ぷ', 'フ', 'ブ', 'プ', 
		'む', 'ム', 
		'ゆ', 'ゅ', 'ユ', 'ュ', 
		'る', 'ル' 
	],
	_eLip : [
		'え', 'ぇ', 'エ', 'ェ', 
		'け', 'げ', 'ケ', 'ゲ', 
		'せ', 'ぜ', 'セ', 'ゼ', 
		'て', 'で', 'テ', 'デ', 
		'ね', 'ネ', 
		'へ', 'べ', 'ぺ', 'ヘ', 'ベ', 'ペ', 
		'め', 'メ', 
		'れ', 'レ', 
		'ゑ', 'ヱ' 
	],
	_oLip : [
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
	],
};
BADV.typeWriter = function(inputString, lipElement) {
	
	var textvisual = BADV.textvisual;
	var outputElement = textvisual._outputElement;
	var inputLength = inputString.length;
	var textPosition = 0;
	var writerTimer = null;
	
	// BADV.backLogging(inputString); // Need to redesign
	
	var doLipSync = false;
	if (lipElement !== undefined) {
		doLipSync = true;
	}
	
	textvisual._outputingText = true;
	writerTimer = setInterval(function() {
		// FIXME: Might hang if tag not closed
		switch(inputLength.charAt(textPosition)) {
			case '<':
				// Tag Striper (example: <span>)
				while(inputLength.charAt(textPosition) != '>') {
					textPosition++;
				}
				break;
			case '&':
				// HTML Symbol Skipper (example: &amp;)
				while(inputLength.charAt(textPosition) != ';') {
					textPosition++;
				}
				break;
			default:
				// Add Position Value
				textPosition++;
				break;
		}
		
		$(outputElement).html(inputString.substring(0, textPosition));
		
		// Experimental Lip Sync
		if (doLipSync) {
			var currentChar = inputString.charAt(textPosition);
			var lipPos = 0;
			var lipHeight = parseInt($(lipElement).css('height') / 6); // Auto Detect
			if (textvisual._aLip.indexOf(currentChar) !== -1) {
				lipPos = 1;
			} else if (textvisual._iLip.indexOf(currentChar) !== -1) {
				lipPos = 2;
			} else if (textvisual._uLip.indexOf(currentChar) !== -1) {
				lipPos = 3;
			} else if (textvisual._eLip.indexOf(currentChar) !== -1) {
				lipPos = 4;
			} else if (textvisual._oLip.indexOf(currentChar) !== -1) {
				lipPos = 5;
			}
			$(lipElement).css('background-position', '0px ' + (lipPos * -lipHeight) + 'px');
		}
		
		// Break Condition
		if (textPosition == inputLength || textvisual._outputingText == false) {
			clearInterval(writerTimer);
			$(outputElement).html(inputString.substring(0, inputLength)); // Complete text
			textvisual._outputingText = false;
			
			// Show Button?
			//showButton();
			
			setTimeout(function() {
				$(lipElement).css('background-position', '0px 0px');
			}, BADV.config._intervalPerFrame);
			
			// Delete variable to lessen memory consumption
			// FIXME: (Not helping at all?, Remove?)
			delete inputLength;
			delete textPosition;
			delete writerTimer;
		}
		
	}, BADV.config._intervalPerFrame); // TODO: Adjustable speed?
	
};

// ANIMATE RELATED //
BADV.animation = {
	_idleTimers : {},
	_positionSwitchTimers : {},
	_eyeFrames : 3, // Make sure ALL characters have the same frames.
	_eyeTimers : {}
};

BADV.startEye = function (eyeElement) {
	var convertedIdForTimer = (eyeElement.replace(/\./g, '-')).replace(/\s/g, '_');
	if (BADV.animation._eyeTimers[convertedIdForTimer] === undefined) {
		BADV.animation._eyeTimers[convertedIdForTimer] = eyeElement; // Dummy
		
		function eyeWinker() { // elementId, maxFrame, heightValue) {
			var count = 0;
			var manipulator = 1;
			var maxFrame = BADV.animation._eyeFrames;
			var heightValue = parseInt($(eyeElement).css('height')) / 3;
			var timer = setInterval(function() {
				count += manipulator;
				$(elementId).css('background-position', '0px ' + (count * -heightValue) + 'px');
				if (count + 1 == maxFrame || count == 0) {
					manipulator *= -1;
					if (count == 0) {
						clearInterval(timer);
						if (BADV.animation._eyeTimers[convertedIdForTimer] !== undefined) {
							BADV.animation._eyeTimers[convertedIdForTimer] = setTimeout(function() {
								eyeWinker();
							}, 500 + BADV.getRandom(4501));
						} else {
							BADV.consoleLogger('Eye animation for ' + elementId + ' stopped');
						}
					}
				}
			}, Math.floor((100 + BADV.getRandom(401)) / maxFrame));
		}
		eyeWinker();
	} else {
		BADV.consoleLogger('Eye animation for ' + eyeElement + ' already fired.');
	}
};

BADV.stopEye = function(eyeElement) {
	BADV.consoleLogger('stopping eyeWink for ' + elementId);
	var convertedIdForTimer = (eyeElement.replace(/\./g, '-')).replace(/\s/g, '_');
	clearTimeout(BADV.animation._eyeTimers[convertedIdForTimer]);
	delete BADV.animation._eyeTimers[convertedIdForTimer];
};

// Work In Progress
// BADV.startIdleAnimation = function(eyeElement, bodyElement, bodyFrames) {};

// ADV SYSTEM RELATED //
BADV.adv = {
	_imagePath : 'images/',
	_audioPath : 'audios/',
	_saveEnv : 'html5storage', // Local HTML5 storage or Server side(AJAX-like)
	 
};

BADV.generateHTML = function() {
	// Override-able HTML generator (Simple ADV Screen)
	
	var body = $('body');
	
	var newDiv = document.createElement('div');
	newDiv.id = 'container';
	body.append(newDiv);
	
	var container = $('div#container');
	var newDiv = document.createElement('div');
	newDiv.id = 'contents';
	container.append(newDiv);
	
	var contents = $('div#contents');
	var newDiv = document.createElement('div');
	newDiv.id = 'backgrounds';
	contents.append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'foregrounds';
	contents.append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'characters';
	contents.append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'vfxs';
	contents.append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'textlayer';
	contents.append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'system';
	contents.append(newDiv);
	
};

/**
 * Emulate KAG's script.
 * KiriKiri2 / KAG3, all rights reserved to W.DEE.
 * Copyright (C) 1997-2008 W.Dee
 * http://kikyou.info/
 */
BADV.emulateKAG = function() {
	BADV.kag = {
		// - System Related - //
		_autowc : function() {
			// Auto Wait?
		},
		_clearsysvar : function() {
			// Clear System's Variable (Not Used in BADV?)
		},
		_clickskip : function() {
			// Click Skip
		},
		_close : function() {
			// Close Window (Not used)
		},
		_cursor : function() {
			// Change Cursor
		},
		_hidemessage : function() {
			// Hide Message
		},
		_loadplugin : function() {
			// Not supported?
		},
		_mappfont : function() {
			// Map a font?
		},
		_nextskip : function() {
			// Skip till next selection
		},
		_quake : function() {
			// Shake the screen
		},
		_rclick : function() {
			// Right Click settings
		},
		_resetwait : function() {
			// Reset wait time
		},
		_s : function() {
			// Stop?
		},
		_stopQuake : function() {
			// Stop screen shake
		},
		_title : function(name) {
			// Set title
			$('title').html(name);
		},
		_wait : function() {
			// Wait for N seconds?
		},
		_waitclick : function() {
			// Wait for click
		},
		_wc : function() {
			//  Wait for N count of string characters?
		},
		_wq : function() {
			// Wait till Shake is over?
		},
		
		
		// - Form Interaction - //
		_checkbox : function() {
			// Create Checkbox
		},
		_commit : function() {
			// Commit(POST)?
		},
		_edit : function() {
			// Edit something?
		},
		
		
		// - Macro Related - //
		_endmacro : function() {
			// End of Macro
		},
		_erasemacro : function() {
			// Erase / Delete Macro
		},
		_macro : function() {
			// Create Macro
		},
		
		
		// - Message Window Related - //
		_cancelautomode : function() {
			// Stop Auto Mode
		},
		_cancelskip : function() {
			// Stop Skip Mode
		},
		_ch : function() {
			// Show Message?
		},
		_cm : function() {
			// Clear Message
		},
		_ct : function() {
			// Clear Message Layers
		},
		_current : function() {
			// Set current message layer
		},
		_deffont : function() {
			// Default Font
		},
		_defstyle : function() {
			// Default Style
		},
		_delay : function() {
			// Text Speed?
		},
		_endindent : function() {
			// End of Text Indent?
		},
		_endnowait : function() {
			// End of No Wait?
		},
		_er : function() {
			// Erase Message layer text
		},
		_font : function() {
			// Set Font?
		},
		_glyph : function() {
			// Set the character for the key wait indicator
		},
		_graph : function() {
			// Display inline image
		},
		_hch : function() {
			// Normal text in Vertical Text mode(Not use)
		},
		_indent : function() {
			// Indent
		},
		_l : function() {
			// The Key wait
		},
		_locate : function() {
			// Set the position to display text
		},
		_locklink : function() {
			// Lock link?
		},
		_nowait : function() {
			// No wait
		},
		_p : function() {
			// Page change
		},
		_position : function() {
			// Message layer attribute?
		},
		_r : function() {
			// Return
		},
		_resetfont : function() {
			// Reset font to default
		},
		_resetstyle : function() {
			// Reset style to default
		},
		_ruby : function() {
			// Set ruby to text
		},
		_style : function() {
			// Set Style
		},
		_unlocklink : function() {
			// Unlock Link?
		},
		
		
		// - Message History Related - //
		_endhact : function() {
			// End Message History Action?
		},
		_hact : function() {
			// Message History Action?
		},
		_history : function() {
			// Message History Setting?
		},
		_hr : function() {
			// History's Message new line
		},
		_showhistory : function() {
			// Show Message History
		},
		
		
		// - Label/Scene Jump Related - //
		_button : function() {
			// Create graphical button?
		},
		_call : function() {
			// Call Sub Routine?
		},
		_cclick : function() {
			// Cancel 'Click Wait'
		},
		_click : function() {
			// Click Jump?
		},
		_ctimeout : function() {
			// Cancel Timeout
		},
		_cwheel : function() {
			// Cancel wheel wait
		},
		_endlink : function() {
			// End Hyperlink(</a> tag?)
		},
		_jump : function() {
			// Scenario Jump
		},
		_link : function() {
			// Hyperlink (<a> tag?)
		},
		_return : function() {
			// Return from Sub Routine
		},
		_timeout : function() {
			// Timeout Jump?
		},
		_wheel : function() {
			// Wheel Jump?
		},
		
		
		// - Layer Related - //
		_animstart : function() {
			// Start Animation
		},
		_animstop : function() {
			// Stop Animation
		},
		_backlay : function() {
			// Backup Layer?
		},
		_copylay : function() {
			// Copy Layer?
		},
		_freeimage : function() {
			// Delete image from layer
		},
		_image : function() {
			// Load Image
		},
		_img : function() {
			// Same as Above
		},
		_laycount : function() {
			// Edit total number of layers?
		},
		_layopt : function() {
			// Apply layer option
		},
		_mapaction : function() {
			// Mapping action (Not Supported ><)
		},
		_mapdisable : function() {
			// Disable clickable map
		},
		_mapimage : function() {
			// Mapping image?
		},
		_move : function() {
			// Move Layer?
		},
		_pimage : function() {
			// Partial Image load?
		},
		_ptext : function() {
			// Paste text to layer?
		},
		_stopmove : function() {
			// Stop Move Layer
		},
		_stoptrans : function() {
			// Stop Layer Transition
		},
		_trans : function() {
			// Start Layer Transition
		},
		_wa : function() {
			// Wait Animation ends
		},
		_wm : function() {
			// Wait Move ends
		},
		_wt : function() {
			// Wait transition end
		},
		
		
		// - Audio/Video Related - //
		_bgmopt : function() {
			// Set BGM Options
		},
		_cancelvideoevent : function() {
			// Cancel Video?
		},
		_cancelvideosegloop : function() {
			// Cancel Video loop?
		},
		_clearbgmlabel : function() {
			// Clear BGM label?
		},
		_clearbgmstop : function() {
			// Clear BGM stop?
		},
		_clearvideolayer : function() {
			// Clear video layer
		},
		_fadebgm : function() {
			// BGM Fade
		},
		_fadeinbgm : function() {
			// Fade In BGM
		},
		_fadeinse : function() {
			// Fade In SE
		},
		_fadeoutbgm : function() {
			// Fade Out BGM
		},
		_fadeoutse : function() {
			// Fade Out SE
		},
		_fadepausebgm : function() {
			// Fade and pause BGM
		},
		_fadese : function() {
			// Fade SE
		},
		_openvideo : function() {
			// Open Video / SWF
		},
		_pausebgm : function() {
			// Pause BGM
		},
		_playbgm : function() {
			// Play BGM
		},
		_playse : function() {
			// Play SE
		},
		_playvideo : function() {
			// Play Video
		},
		_preparevideo : function() {
			// Prepare Video?
		},
		_resumebgm : function() {
			// Resume BGM
		},
		_resumevideo : function() {
			// Resume Video
		},
		_rewindvideo : function() {
			// Set Video playtime to 0?
		},
		_seopt : function() {
			// Set SE Option
		},
		_setbgmlabel : function() {
			// Set BGM Label
		},
		_setbgmstop : function() {
			// Set Stop BGM Event?
		},
		_stopbgm : function() {
			// Stop BGM
		},
		_stopse : function() {
			// Stop SE
		},
		_stopvideo : function() {
			// Stop Video
		},
		_video : function() {
			// Set Video Options
		},
		_videoevent : function() {
			// Video Event?
		},
		_videolayer : function() {
			// Video Layer Settings
		},
		_videosegloop : function() {
			// Set Video Loop
		},
		_wb : function() {
			// Wait for BGM Fade
		},
		_wf : function() {
			// Wait for SE Fade
		},
		_wl : function () {
			// Wait for BGM ends
		},
		_wp : function() {
			// Wait for Video Period? ends
		},
		_ws : function() {
			// Wait for SE ends
		},
		_wv : function() {
			// Wait for Video ends
		},
		xchgbgm : function() {
			// Crossfade BGMs
		},
		
		
		// - Variable/Misc System Related - //
		_clearvar : function() {
			// Clear game variables
		},
		_else : function() {
			// that ELSE
		},
		_elsif : function() {
			// That ELSE IF
		},
		_emb : function() {
			// ?????
		},
		_endif : function() {
			// That END IF
		},
		_endignore : function() {
			// End of IGNORE
		},
		_endscript : function() {
			// End of Script
		},
		_if : function() {
			// That IF
		},
		_ignore : function() {
			// IF That operates opposite way (Execute on FALSE Statement)
		},
		_input : function() {
			// Input String
		},
		_iscript : function() {
			// Begin Script
		},
		_trace : function() {
			// Do Console.log
		},
		_waiting : function() {
			// Wait for Trigger
		},
		
		
		// - Savepoint/Savestate Related - //
		_copybookmark : function() {
			// Copy savestate
		},
		_disablestore : function() {
			// Temporary Disable Save feature
		},
		_erasebookmark : function() {
			// Delete savestate
		},
		_goback : function() {
			// Go back???
		},
		_gotostart : function() {
			// Back to start???
		},
		_load : function() {
			// Load savestate
		},
		_locksnapshot : function() {
			// Lock Snapshot?
		},
		_record : function() {
			// Save read-ed scripts
		},
		_save : function() {
			// Save savestate
		},
		_startanchor : function() {
			// Option for return to start?
		},
		_store : function() {
			// Settings for savestate
		},
		_tempload : function() {
			// Load data from memory (Quick Load)
		},
		_tempsave : function() {
			// Save data to memory (Quick Save)
		},
		_unlocksnapshot : function() {
			// Unlock Snapshot
		}
	};
	
	BADV.kag.labelPositions = {};
	
	BADV.kag.examineScript = function(string, lineOfString) {
		var firstLetter = string.indexOf(0);
		var lastLetter = string.indexOf(-1);
		
		if ((firstLetter == '[' && lastLetter == ']') || firstLetter == '@') {
			// Check function
		} else if (firstLetter == ';') {
			// It just comment, skip
		} else if (firstLetter == '*') {
			// Label (For chapter jump purpose)
		} else {
			// Normal Text script
		}
	}
	
	// Just for checking out if the scripts are runnable.
	BADV.kag.checkAvailability = function(dataChunk) {
		// dataChunk = dataChunk.replace(/^;.*/g, ''); // Remove the comment line out
		dataChunk = dataChunk.replace(/\t/g, ''); // Remove tabs out
		dataChunk = dataChunk.replace(/;.*/mg, ''); // Remove the comment line out
		dataChunk = dataChunk.replace(/\r/g, ''); // Make it a unix format (Remove Carriage return, Line feed only!)
		dataChunk = dataChunk.replace(/\[\[/g, '&#91;'); // Convert [[ to html entity (prevent it to act like a code)
		
		dataChunk = dataChunk.replace(/\]\[/g, '\]\n\['); // Separate ][ with line breaks (to act as command code)
		dataChunk = dataChunk.replace(/\[([^\[]*)$$/g, '\n\[\$1'); // Only line break [ if [*] matches at the end of string (Separate from normal text)
		
		dataChunk = dataChunk.replace(/\n\n\n\n/g, '\n'); // Convert 4 new lines to 1 (Most probably blank lines)
		dataChunk = dataChunk.replace(/\n\n\n/g, '\n'); // Convert 3 new lines to 1 (Most probably blank lines)
		dataChunk = dataChunk.replace(/\n\n/g, '\n'); // Convert 2 new lines to 1 (Most probably blank lines)
		
		// Just a small manner, remove the 1st line if its a blank line
		if (dataChunk.charAt(0) == '\n') {
			dataChunk = dataChunk.slice(1);
		}
		
		BADV.consoleLogger(dataChunk);
		
		var strings = dataChunk.split('\n'); // Split it by line break (line feed)
		var totalLines = strings.length;
		
		for (var i = 0; i < totalLines; i++) {
			var firstLetter = strings[i].charAt(0);
			var lastLetter = strings[i].charAt(strings[i].length - 1);
			if ((firstLetter == '[' && lastLetter == ']') || firstLetter == '@') {
				
				// Check function
				var code = '';
				if ((firstLetter == '[' && lastLetter == ']')) {
					code = strings[i].substring(1, strings[i].length - 1);
				} else if (firstLetter == '@') {
					code = strings[i].slice(1);
				}
				
				var cwitharg = code.split(' ');
				if (eval('typeof(BADV.kag._' + cwitharg[0] + ')') == 'undefined') {
					// Throw Error, no command available
					BADV.consoleLogger(cwitharg[0] + ' is Not Available.');
					throw new Error(cwitharg[0] + ' is Not Available.');
				} else {
					BADV.consoleLogger(cwitharg[0] + ' is Available.');
				}
				
			} else if (firstLetter == '*') {
				// Label (For chapter jump purpose)
				BADV.consoleLogger('Labeling: ' + strings[i]);
			} else {
				// Normal Text script
				if (strings[i] == '') {
					BADV.consoleLogger('Blank line. Skip.');
				} else {
					BADV.consoleLogger('Normal Text Script: ' + strings[i]);
				}
			}
		}
	};
	
};

// PLUGIN AREA //

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
 * Date: Sat Dec 4 15:46:09 2010 -0800
 * (This version conflicts on jQuery >= 1.8.0)
 */
// (function(f,g,j,b){var h=/progid:DXImageTransform\.Microsoft\.Matrix\(.*?\)/,c=/^([\+\-]=)?([\d+.\-]+)(.*)$/,q=/%/;var d=j.createElement("modernizr"),e=d.style;function n(s){return parseFloat(s)}function l(){var s={transformProperty:"",MozTransform:"-moz-",WebkitTransform:"-webkit-",OTransform:"-o-",msTransform:"-ms-"};for(var t in s){if(typeof e[t]!="undefined"){return s[t]}}return null}function r(){if(typeof(g.Modernizr)!=="undefined"){return Modernizr.csstransforms}var t=["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"];for(var s in t){if(e[t[s]]!==b){return true}}}var a=l(),i=a!==null?a+"transform":false,k=a!==null?a+"transform-origin":false;f.support.csstransforms=r();if(a=="-ms-"){i="msTransform";k="msTransformOrigin"}f.extend({transform:function(s){s.transform=this;this.$elem=f(s);this.applyingMatrix=false;this.matrix=null;this.height=null;this.width=null;this.outerHeight=null;this.outerWidth=null;this.boxSizingValue=null;this.boxSizingProperty=null;this.attr=null;this.transformProperty=i;this.transformOriginProperty=k}});f.extend(f.transform,{funcs:["matrix","origin","reflect","reflectX","reflectXY","reflectY","rotate","scale","scaleX","scaleY","skew","skewX","skewY","translate","translateX","translateY"]});f.fn.transform=function(s,t){return this.each(function(){var u=this.transform||new f.transform(this);if(s){u.exec(s,t)}})};f.transform.prototype={exec:function(s,t){t=f.extend(true,{forceMatrix:false,preserve:false},t);this.attr=null;if(t.preserve){s=f.extend(true,this.getAttrs(true,true),s)}else{s=f.extend(true,{},s)}this.setAttrs(s);if(f.support.csstransforms&&!t.forceMatrix){return this.execFuncs(s)}else{if(f.browser.msie||(f.support.csstransforms&&t.forceMatrix)){return this.execMatrix(s)}}return false},execFuncs:function(t){var s=[];for(var u in t){if(u=="origin"){this[u].apply(this,f.isArray(t[u])?t[u]:[t[u]])}else{if(f.inArray(u,f.transform.funcs)!==-1){s.push(this.createTransformFunc(u,t[u]))}}}this.$elem.css(i,s.join(" "));return true},execMatrix:function(z){var C,x,t;var F=this.$elem[0],B=this;function A(N,M){if(q.test(N)){return parseFloat(N)/100*B["safeOuter"+(M?"Height":"Width")]()}return o(F,N)}var s=/translate[X|Y]?/,u=[];for(var v in z){switch(f.type(z[v])){case"array":t=z[v];break;case"string":t=f.map(z[v].split(","),f.trim);break;default:t=[z[v]]}if(f.matrix[v]){if(f.cssAngle[v]){t=f.map(t,f.angle.toDegree)}else{if(!f.cssNumber[v]){t=f.map(t,A)}else{t=f.map(t,n)}}x=f.matrix[v].apply(this,t);if(s.test(v)){u.push(x)}else{C=C?C.x(x):x}}else{if(v=="origin"){this[v].apply(this,t)}}}C=C||f.matrix.identity();f.each(u,function(M,N){C=C.x(N)});var K=parseFloat(C.e(1,1).toFixed(6)),I=parseFloat(C.e(2,1).toFixed(6)),H=parseFloat(C.e(1,2).toFixed(6)),G=parseFloat(C.e(2,2).toFixed(6)),L=C.rows===3?parseFloat(C.e(1,3).toFixed(6)):0,J=C.rows===3?parseFloat(C.e(2,3).toFixed(6)):0;if(f.support.csstransforms&&a==="-moz-"){this.$elem.css(i,"matrix("+K+", "+I+", "+H+", "+G+", "+L+"px, "+J+"px)")}else{if(f.support.csstransforms){this.$elem.css(i,"matrix("+K+", "+I+", "+H+", "+G+", "+L+", "+J+")")}else{if(f.browser.msie){var w=", FilterType='nearest neighbor'";var D=this.$elem[0].style;var E="progid:DXImageTransform.Microsoft.Matrix(M11="+K+", M12="+H+", M21="+I+", M22="+G+", sizingMethod='auto expand'"+w+")";var y=D.filter||f.css(this.$elem[0],"filter")||"";D.filter=h.test(y)?y.replace(h,E):y?y+" "+E:E;this.applyingMatrix=true;this.matrix=C;this.fixPosition(C,L,J);this.applyingMatrix=false;this.matrix=null}}}return true},origin:function(s,t){if(f.support.csstransforms){if(typeof t==="undefined"){this.$elem.css(k,s)}else{this.$elem.css(k,s+" "+t)}return true}switch(s){case"left":s="0";break;case"right":s="100%";break;case"center":case b:s="50%"}switch(t){case"top":t="0";break;case"bottom":t="100%";break;case"center":case b:t="50%"}this.setAttr("origin",[q.test(s)?s:o(this.$elem[0],s)+"px",q.test(t)?t:o(this.$elem[0],t)+"px"]);return true},createTransformFunc:function(t,u){if(t.substr(0,7)==="reflect"){var s=u?f.matrix[t]():f.matrix.identity();return"matrix("+s.e(1,1)+", "+s.e(2,1)+", "+s.e(1,2)+", "+s.e(2,2)+", 0, 0)"}if(t=="matrix"){if(a==="-moz-"){u[4]=u[4]?u[4]+"px":0;u[5]=u[5]?u[5]+"px":0}}return t+"("+(f.isArray(u)?u.join(", "):u)+")"},fixPosition:function(B,y,x,D,s){var w=new f.matrix.calc(B,this.safeOuterHeight(),this.safeOuterWidth()),C=this.getAttr("origin");var v=w.originOffset(new f.matrix.V2(q.test(C[0])?parseFloat(C[0])/100*w.outerWidth:parseFloat(C[0]),q.test(C[1])?parseFloat(C[1])/100*w.outerHeight:parseFloat(C[1])));var t=w.sides();var u=this.$elem.css("position");if(u=="static"){u="relative"}var A={top:0,left:0};var z={position:u,top:(v.top+x+t.top+A.top)+"px",left:(v.left+y+t.left+A.left)+"px",zoom:1};this.$elem.css(z)}};function o(s,u){var t=c.exec(f.trim(u));if(t[3]&&t[3]!=="px"){var w="paddingBottom",v=f.style(s,w);f.style(s,w,u);u=p(s,w);f.style(s,w,v);return u}return parseFloat(u)}function p(t,u){if(t[u]!=null&&(!t.style||t.style[u]==null)){return t[u]}var s=parseFloat(f.css(t,u));return s&&s>-10000?s:0}})(jQuery,this,this.document);(function(d,c,a,f){d.extend(d.transform.prototype,{safeOuterHeight:function(){return this.safeOuterLength("height")},safeOuterWidth:function(){return this.safeOuterLength("width")},safeOuterLength:function(l){var p="outer"+(l=="width"?"Width":"Height");if(!d.support.csstransforms&&d.browser.msie){l=l=="width"?"width":"height";if(this.applyingMatrix&&!this[p]&&this.matrix){var k=new d.matrix.calc(this.matrix,1,1),n=k.offset(),g=this.$elem[p]()/n[l];this[p]=g;return g}else{if(this.applyingMatrix&&this[p]){return this[p]}}var o={height:["top","bottom"],width:["left","right"]};var h=this.$elem[0],j=parseFloat(d.css(h,l,true)),q=this.boxSizingProperty,i=this.boxSizingValue;if(!this.boxSizingProperty){q=this.boxSizingProperty=e()||"box-sizing";i=this.boxSizingValue=this.$elem.css(q)||"content-box"}if(this[p]&&this[l]==j){return this[p]}else{this[l]=j}if(q&&(i=="padding-box"||i=="content-box")){j+=parseFloat(d.css(h,"padding-"+o[l][0],true))||0+parseFloat(d.css(h,"padding-"+o[l][1],true))||0}if(q&&i=="content-box"){j+=parseFloat(d.css(h,"border-"+o[l][0]+"-width",true))||0+parseFloat(d.css(h,"border-"+o[l][1]+"-width",true))||0}this[p]=j;return j}return this.$elem[p]()}});var b=null;function e(){if(b){return b}var h={boxSizing:"box-sizing",MozBoxSizing:"-moz-box-sizing",WebkitBoxSizing:"-webkit-box-sizing",OBoxSizing:"-o-box-sizing"},g=a.body;for(var i in h){if(typeof g.style[i]!="undefined"){b=h[i];return b}}return null}})(jQuery,this,this.document);(function(g,f,b,h){var d=/([\w\-]*?)\((.*?)\)/g,a="data-transform",e=/\s/,c=/,\s?/;g.extend(g.transform.prototype,{setAttrs:function(i){var j="",l;for(var k in i){l=i[k];if(g.isArray(l)){l=l.join(", ")}j+=" "+k+"("+l+")"}this.attr=g.trim(j);this.$elem.attr(a,this.attr)},setAttr:function(k,l){if(g.isArray(l)){l=l.join(", ")}var j=this.attr||this.$elem.attr(a);if(!j||j.indexOf(k)==-1){this.attr=g.trim(j+" "+k+"("+l+")");this.$elem.attr(a,this.attr)}else{var i=[],n;d.lastIndex=0;while(n=d.exec(j)){if(k==n[1]){i.push(k+"("+l+")")}else{i.push(n[0])}}this.attr=i.join(" ");this.$elem.attr(a,this.attr)}},getAttrs:function(){var j=this.attr||this.$elem.attr(a);if(!j){return{}}var i={},l,k;d.lastIndex=0;while((l=d.exec(j))!==null){if(l){k=l[2].split(c);i[l[1]]=k.length==1?k[0]:k}}return i},getAttr:function(j){var i=this.getAttrs();if(typeof i[j]!=="undefined"){return i[j]}if(j==="origin"&&g.support.csstransforms){return this.$elem.css(this.transformOriginProperty).split(e)}else{if(j==="origin"){return["50%","50%"]}}return g.cssDefault[j]||0}});if(typeof(g.cssAngle)=="undefined"){g.cssAngle={}}g.extend(g.cssAngle,{rotate:true,skew:true,skewX:true,skewY:true});if(typeof(g.cssDefault)=="undefined"){g.cssDefault={}}g.extend(g.cssDefault,{scale:[1,1],scaleX:1,scaleY:1,matrix:[1,0,0,1,0,0],origin:["50%","50%"],reflect:[1,0,0,1,0,0],reflectX:[1,0,0,1,0,0],reflectXY:[1,0,0,1,0,0],reflectY:[1,0,0,1,0,0]});if(typeof(g.cssMultipleValues)=="undefined"){g.cssMultipleValues={}}g.extend(g.cssMultipleValues,{matrix:6,origin:{length:2,duplicate:true},reflect:6,reflectX:6,reflectXY:6,reflectY:6,scale:{length:2,duplicate:true},skew:2,translate:2});g.extend(g.cssNumber,{matrix:true,reflect:true,reflectX:true,reflectXY:true,reflectY:true,scale:true,scaleX:true,scaleY:true});g.each(g.transform.funcs,function(j,k){g.cssHooks[k]={set:function(n,o){var l=n.transform||new g.transform(n),i={};i[k]=o;l.exec(i,{preserve:true})},get:function(n,l){var i=n.transform||new g.transform(n);return i.getAttr(k)}}});g.each(["reflect","reflectX","reflectXY","reflectY"],function(j,k){g.cssHooks[k].get=function(n,l){var i=n.transform||new g.transform(n);return i.getAttr("matrix")||g.cssDefault[k]}})})(jQuery,this,this.document);(function(e,g,h,c){var d=/^([+\-]=)?([\d+.\-]+)(.*)$/;var a=e.fn.animate;e.fn.animate=function(p,l,o,n){var k=e.speed(l,o,n),j=e.cssMultipleValues;k.complete=k.old;if(!e.isEmptyObject(p)){if(typeof k.original==="undefined"){k.original={}}e.each(p,function(s,u){if(j[s]||e.cssAngle[s]||(!e.cssNumber[s]&&e.inArray(s,e.transform.funcs)!==-1)){var t=null;if(jQuery.isArray(p[s])){var r=1,q=u.length;if(j[s]){r=(typeof j[s].length==="undefined"?j[s]:j[s].length)}if(q>r||(q<r&&q==2)||(q==2&&r==2&&isNaN(parseFloat(u[q-1])))){t=u[q-1];u.splice(q-1,1)}}k.original[s]=u.toString();p[s]=parseFloat(u)}})}return a.apply(this,[arguments[0],k])};var b="paddingBottom";function i(k,l){if(k[l]!=null&&(!k.style||k.style[l]==null)){}var j=parseFloat(e.css(k,l));return j&&j>-10000?j:0}var f=e.fx.prototype.custom;e.fx.prototype.custom=function(u,v,w){var y=e.cssMultipleValues[this.prop],p=e.cssAngle[this.prop];if(y||(!e.cssNumber[this.prop]&&e.inArray(this.prop,e.transform.funcs)!==-1)){this.values=[];if(!y){y=1}var x=this.options.original[this.prop],t=e(this.elem).css(this.prop),j=e.cssDefault[this.prop]||0;if(!e.isArray(t)){t=[t]}if(!e.isArray(x)){if(e.type(x)==="string"){x=x.split(",")}else{x=[x]}}var l=y.length||y,s=0;while(x.length<l){x.push(y.duplicate?x[0]:j[s]||0);s++}var k,r,q,o=this,n=o.elem.transform;orig=e.style(o.elem,b);e.each(x,function(z,A){if(t[z]){k=t[z]}else{if(j[z]&&!y.duplicate){k=j[z]}else{if(y.duplicate){k=t[0]}else{k=0}}}if(p){k=e.angle.toDegree(k)}else{if(!e.cssNumber[o.prop]){r=d.exec(e.trim(k));if(r[3]&&r[3]!=="px"){if(r[3]==="%"){k=parseFloat(r[2])/100*n["safeOuter"+(z?"Height":"Width")]()}else{e.style(o.elem,b,k);k=i(o.elem,b);e.style(o.elem,b,orig)}}}}k=parseFloat(k);r=d.exec(e.trim(A));if(r){q=parseFloat(r[2]);w=r[3]||"px";if(p){q=e.angle.toDegree(q+w);w="deg"}else{if(!e.cssNumber[o.prop]&&w==="%"){k=(k/n["safeOuter"+(z?"Height":"Width")]())*100}else{if(!e.cssNumber[o.prop]&&w!=="px"){e.style(o.elem,b,(q||1)+w);k=((q||1)/i(o.elem,b))*k;e.style(o.elem,b,orig)}}}if(r[1]){q=((r[1]==="-="?-1:1)*q)+k}}else{q=A;w=""}o.values.push({start:k,end:q,unit:w})})}return f.apply(this,arguments)};e.fx.multipleValueStep={_default:function(j){e.each(j.values,function(k,l){j.values[k].now=l.start+((l.end-l.start)*j.pos)})}};e.each(["matrix","reflect","reflectX","reflectXY","reflectY"],function(j,k){e.fx.multipleValueStep[k]=function(n){var p=n.decomposed,l=e.matrix;m=l.identity();p.now={};e.each(p.start,function(q){p.now[q]=parseFloat(p.start[q])+((parseFloat(p.end[q])-parseFloat(p.start[q]))*n.pos);if(((q==="scaleX"||q==="scaleY")&&p.now[q]===1)||(q!=="scaleX"&&q!=="scaleY"&&p.now[q]===0)){return true}m=m.x(l[q](p.now[q]))});var o;e.each(n.values,function(q){switch(q){case 0:o=parseFloat(m.e(1,1).toFixed(6));break;case 1:o=parseFloat(m.e(2,1).toFixed(6));break;case 2:o=parseFloat(m.e(1,2).toFixed(6));break;case 3:o=parseFloat(m.e(2,2).toFixed(6));break;case 4:o=parseFloat(m.e(1,3).toFixed(6));break;case 5:o=parseFloat(m.e(2,3).toFixed(6));break}n.values[q].now=o})}});e.each(e.transform.funcs,function(j,k){e.fx.step[k]=function(o){var n=o.elem.transform||new e.transform(o.elem),l={};if(e.cssMultipleValues[k]||(!e.cssNumber[k]&&e.inArray(k,e.transform.funcs)!==-1)){(e.fx.multipleValueStep[o.prop]||e.fx.multipleValueStep._default)(o);l[o.prop]=[];e.each(o.values,function(p,q){l[o.prop].push(q.now+(e.cssNumber[o.prop]?"":q.unit))})}else{l[o.prop]=o.now+(e.cssNumber[o.prop]?"":o.unit)}n.exec(l,{preserve:true})}});e.each(["matrix","reflect","reflectX","reflectXY","reflectY"],function(j,k){e.fx.step[k]=function(q){var p=q.elem.transform||new e.transform(q.elem),o={};if(!q.initialized){q.initialized=true;if(k!=="matrix"){var n=e.matrix[k]().elements;var r;e.each(q.values,function(s){switch(s){case 0:r=n[0];break;case 1:r=n[2];break;case 2:r=n[1];break;case 3:r=n[3];break;default:r=0}q.values[s].end=r})}q.decomposed={};var l=q.values;q.decomposed.start=e.matrix.matrix(l[0].start,l[1].start,l[2].start,l[3].start,l[4].start,l[5].start).decompose();q.decomposed.end=e.matrix.matrix(l[0].end,l[1].end,l[2].end,l[3].end,l[4].end,l[5].end).decompose()}(e.fx.multipleValueStep[q.prop]||e.fx.multipleValueStep._default)(q);o.matrix=[];e.each(q.values,function(s,t){o.matrix.push(t.now)});p.exec(o,{preserve:true})}})})(jQuery,this,this.document);(function(g,h,j,c){var d=180/Math.PI;var k=200/Math.PI;var f=Math.PI/180;var e=2/1.8;var i=0.9;var a=Math.PI/200;var b=/^([+\-]=)?([\d+.\-]+)(.*)$/;g.extend({angle:{runit:/(deg|g?rad)/,radianToDegree:function(l){return l*d},radianToGrad:function(l){return l*k},degreeToRadian:function(l){return l*f},degreeToGrad:function(l){return l*e},gradToDegree:function(l){return l*i},gradToRadian:function(l){return l*a},toDegree:function(n){var l=b.exec(n);if(l){n=parseFloat(l[2]);switch(l[3]||"deg"){case"grad":n=g.angle.gradToDegree(n);break;case"rad":n=g.angle.radianToDegree(n);break}return n}return 0}}})})(jQuery,this,this.document);(function(f,e,b,g){if(typeof(f.matrix)=="undefined"){f.extend({matrix:{}})}var d=f.matrix;f.extend(d,{V2:function(h,i){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,2)}else{this.elements=[h,i]}this.length=2},V3:function(h,j,i){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,3)}else{this.elements=[h,j,i]}this.length=3},M2x2:function(i,h,k,j){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,4)}else{this.elements=Array.prototype.slice.call(arguments).slice(0,4)}this.rows=2;this.cols=2},M3x3:function(n,l,k,j,i,h,q,p,o){if(f.isArray(arguments[0])){this.elements=arguments[0].slice(0,9)}else{this.elements=Array.prototype.slice.call(arguments).slice(0,9)}this.rows=3;this.cols=3}});var c={e:function(k,h){var i=this.rows,j=this.cols;if(k>i||h>i||k<1||h<1){return 0}return this.elements[(k-1)*j+h-1]},decompose:function(){var v=this.e(1,1),t=this.e(2,1),q=this.e(1,2),p=this.e(2,2),o=this.e(1,3),n=this.e(2,3);if(Math.abs(v*p-t*q)<0.01){return{rotate:0+"deg",skewX:0+"deg",scaleX:1,scaleY:1,translateX:0+"px",translateY:0+"px"}}var l=o,j=n;var u=Math.sqrt(v*v+t*t);v=v/u;t=t/u;var i=v*q+t*p;q-=v*i;p-=t*i;var s=Math.sqrt(q*q+p*p);q=q/s;p=p/s;i=i/s;if((v*p-t*q)<0){v=-v;t=-t;u=-u}var w=f.angle.radianToDegree;var h=w(Math.atan2(t,v));i=w(Math.atan(i));return{rotate:h+"deg",skewX:i+"deg",scaleX:u,scaleY:s,translateX:l+"px",translateY:j+"px"}}};f.extend(d.M2x2.prototype,c,{toM3x3:function(){var h=this.elements;return new d.M3x3(h[0],h[1],0,h[2],h[3],0,0,0,1)},x:function(j){var k=typeof(j.rows)==="undefined";if(!k&&j.rows==3){return this.toM3x3().x(j)}var i=this.elements,h=j.elements;if(k&&h.length==2){return new d.V2(i[0]*h[0]+i[1]*h[1],i[2]*h[0]+i[3]*h[1])}else{if(h.length==i.length){return new d.M2x2(i[0]*h[0]+i[1]*h[2],i[0]*h[1]+i[1]*h[3],i[2]*h[0]+i[3]*h[2],i[2]*h[1]+i[3]*h[3])}}return false},inverse:function(){var i=1/this.determinant(),h=this.elements;return new d.M2x2(i*h[3],i*-h[1],i*-h[2],i*h[0])},determinant:function(){var h=this.elements;return h[0]*h[3]-h[1]*h[2]}});f.extend(d.M3x3.prototype,c,{x:function(j){var k=typeof(j.rows)==="undefined";if(!k&&j.rows<3){j=j.toM3x3()}var i=this.elements,h=j.elements;if(k&&h.length==3){return new d.V3(i[0]*h[0]+i[1]*h[1]+i[2]*h[2],i[3]*h[0]+i[4]*h[1]+i[5]*h[2],i[6]*h[0]+i[7]*h[1]+i[8]*h[2])}else{if(h.length==i.length){return new d.M3x3(i[0]*h[0]+i[1]*h[3]+i[2]*h[6],i[0]*h[1]+i[1]*h[4]+i[2]*h[7],i[0]*h[2]+i[1]*h[5]+i[2]*h[8],i[3]*h[0]+i[4]*h[3]+i[5]*h[6],i[3]*h[1]+i[4]*h[4]+i[5]*h[7],i[3]*h[2]+i[4]*h[5]+i[5]*h[8],i[6]*h[0]+i[7]*h[3]+i[8]*h[6],i[6]*h[1]+i[7]*h[4]+i[8]*h[7],i[6]*h[2]+i[7]*h[5]+i[8]*h[8])}}return false},inverse:function(){var i=1/this.determinant(),h=this.elements;return new d.M3x3(i*(h[8]*h[4]-h[7]*h[5]),i*(-(h[8]*h[1]-h[7]*h[2])),i*(h[5]*h[1]-h[4]*h[2]),i*(-(h[8]*h[3]-h[6]*h[5])),i*(h[8]*h[0]-h[6]*h[2]),i*(-(h[5]*h[0]-h[3]*h[2])),i*(h[7]*h[3]-h[6]*h[4]),i*(-(h[7]*h[0]-h[6]*h[1])),i*(h[4]*h[0]-h[3]*h[1]))},determinant:function(){var h=this.elements;return h[0]*(h[8]*h[4]-h[7]*h[5])-h[3]*(h[8]*h[1]-h[7]*h[2])+h[6]*(h[5]*h[1]-h[4]*h[2])}});var a={e:function(h){return this.elements[h-1]}};f.extend(d.V2.prototype,a);f.extend(d.V3.prototype,a)})(jQuery,this,this.document);(function(c,b,a,d){if(typeof(c.matrix)=="undefined"){c.extend({matrix:{}})}c.extend(c.matrix,{calc:function(e,f,g){this.matrix=e;this.outerHeight=f;this.outerWidth=g}});c.matrix.calc.prototype={coord:function(e,i,h){h=typeof(h)!=="undefined"?h:0;var g=this.matrix,f;switch(g.rows){case 2:f=g.x(new c.matrix.V2(e,i));break;case 3:f=g.x(new c.matrix.V3(e,i,h));break}return f},corners:function(e,h){var f=!(typeof(e)!=="undefined"||typeof(h)!=="undefined"),g;if(!this.c||!f){h=h||this.outerHeight;e=e||this.outerWidth;g={tl:this.coord(0,0),bl:this.coord(0,h),tr:this.coord(e,0),br:this.coord(e,h)}}else{g=this.c}if(f){this.c=g}return g},sides:function(e){var f=e||this.corners();return{top:Math.min(f.tl.e(2),f.tr.e(2),f.br.e(2),f.bl.e(2)),bottom:Math.max(f.tl.e(2),f.tr.e(2),f.br.e(2),f.bl.e(2)),left:Math.min(f.tl.e(1),f.tr.e(1),f.br.e(1),f.bl.e(1)),right:Math.max(f.tl.e(1),f.tr.e(1),f.br.e(1),f.bl.e(1))}},offset:function(e){var f=this.sides(e);return{height:Math.abs(f.bottom-f.top),width:Math.abs(f.right-f.left)}},area:function(e){var h=e||this.corners();var g={x:h.tr.e(1)-h.tl.e(1)+h.br.e(1)-h.bl.e(1),y:h.tr.e(2)-h.tl.e(2)+h.br.e(2)-h.bl.e(2)},f={x:h.bl.e(1)-h.tl.e(1)+h.br.e(1)-h.tr.e(1),y:h.bl.e(2)-h.tl.e(2)+h.br.e(2)-h.tr.e(2)};return 0.25*Math.abs(g.e(1)*f.e(2)-g.e(2)*f.e(1))},nonAffinity:function(){var f=this.sides(),g=f.top-f.bottom,e=f.left-f.right;return parseFloat(parseFloat(Math.abs((Math.pow(g,2)+Math.pow(e,2))/(f.top*f.bottom+f.left*f.right))).toFixed(8))},originOffset:function(h,g){h=h?h:new c.matrix.V2(this.outerWidth*0.5,this.outerHeight*0.5);g=g?g:new c.matrix.V2(0,0);var e=this.coord(h.e(1),h.e(2));var f=this.coord(g.e(1),g.e(2));return{top:(f.e(2)-g.e(2))-(e.e(2)-h.e(2)),left:(f.e(1)-g.e(1))-(e.e(1)-h.e(1))}}}})(jQuery,this,this.document);(function(e,d,a,f){if(typeof(e.matrix)=="undefined"){e.extend({matrix:{}})}var c=e.matrix,g=c.M2x2,b=c.M3x3;e.extend(c,{identity:function(k){k=k||2;var l=k*k,n=new Array(l),j=k+1;for(var h=0;h<l;h++){n[h]=(h%j)===0?1:0}return new c["M"+k+"x"+k](n)},matrix:function(){var h=Array.prototype.slice.call(arguments);switch(arguments.length){case 4:return new g(h[0],h[2],h[1],h[3]);case 6:return new b(h[0],h[2],h[4],h[1],h[3],h[5],0,0,1)}},reflect:function(){return new g(-1,0,0,-1)},reflectX:function(){return new g(1,0,0,-1)},reflectXY:function(){return new g(0,1,1,0)},reflectY:function(){return new g(-1,0,0,1)},rotate:function(l){var i=e.angle.degreeToRadian(l),k=Math.cos(i),n=Math.sin(i);var j=k,h=n,p=-n,o=k;return new g(j,p,h,o)},scale:function(i,h){i=i||i===0?i:1;h=h||h===0?h:i;return new g(i,0,0,h)},scaleX:function(h){return c.scale(h,1)},scaleY:function(h){return c.scale(1,h)},skew:function(k,i){k=k||0;i=i||0;var l=e.angle.degreeToRadian(k),j=e.angle.degreeToRadian(i),h=Math.tan(l),n=Math.tan(j);return new g(1,h,n,1)},skewX:function(h){return c.skew(h)},skewY:function(h){return c.skew(0,h)},translate:function(i,h){i=i||0;h=h||0;return new b(1,0,i,0,1,h,0,0,1)},translateX:function(h){return c.translate(h)},translateY:function(h){return c.translate(0,h)}})})(jQuery,this,this.document);

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
 * referred : http://nelsonwells.net/2012/08/using-bgpos-js-with-jquery-18/
 */
(function(a){a.extend(a.fx.step,{backgroundPosition:function(d){if(d.pos===0&&typeof d.end=="string"){var f=a.css(d.elem,"backgroundPosition");f=c(f);d.start=[f[0],f[2]];var b=c(d.end);d.end=[b[0],b[2]];d.unit=[b[1],b[3]]}var e=[];e[0]=((d.end[0]-d.start[0])*d.pos)+d.start[0]+d.unit[0];e[1]=((d.end[1]-d.start[1])*d.pos)+d.start[1]+d.unit[1];d.elem.style.backgroundPosition=e[0]+" "+e[1];function c(h){h=h.replace(/left|top/g,"0px");h=h.replace(/right|bottom/g,"100%");h=h.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");var g=h.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);return[parseFloat(g[1],10),g[2],parseFloat(g[3],10),g[4]]}}})})(jQuery);

/**
 * Color animation 1.6.0
 * http://www.bitstorm.org/jquery/color-animation/
 * Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
 * Released under the MIT and GPL licenses.
 */
'use strict';(function(d){function h(a,b,e){var c="rgb"+(d.support.rgba?"a":"")+"("+parseInt(a[0]+e*(b[0]-a[0]),10)+","+parseInt(a[1]+e*(b[1]-a[1]),10)+","+parseInt(a[2]+e*(b[2]-a[2]),10);d.support.rgba&&(c+=","+(a&&b?parseFloat(a[3]+e*(b[3]-a[3])):1));return c+")"}function f(a){var b;return(b=/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(a))?[parseInt(b[1],16),parseInt(b[2],16),parseInt(b[3],16),1]:(b=/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(a))?[17*parseInt(b[1],16),17*parseInt(b[2],16),17*parseInt(b[3],16),1]:(b=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(a))?[parseInt(b[1]),parseInt(b[2]),parseInt(b[3]),1]:(b=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(a))?[parseInt(b[1],10),parseInt(b[2],10),parseInt(b[3],10),parseFloat(b[4])]:l[a]}d.extend(!0,d,{support:{rgba:function(){var a=d("script:first"),b=a.css("color"),e=!1;if(/^rgba/.test(b))e=!0;else try{e=b!=a.css("color","rgba(0, 0, 0, 0.5)").css("color"),a.css("color",b)}catch(c){}return e}()}});var k="color backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor outlineColor".split(" ");d.each(k,function(a,b){d.Tween.propHooks[b]={get:function(a){return d(a.elem).css(b)},set:function(a){var c=a.elem.style,g=f(d(a.elem).css(b)),m=f(a.end);a.run=function(a){c[b]=h(g,m,a)}}}});d.Tween.propHooks.borderColor={set:function(a){var b=a.elem.style,e=[],c=k.slice(2,6);d.each(c,function(b,c){e[c]=f(d(a.elem).css(c))});var g=f(a.end);a.run=function(a){d.each(c,function(d,c){b[c]=h(e[c],g,a)})}}};var l={aqua:[0,255,255,1],azure:[240,255,255,1],beige:[245,245,220,1],black:[0,0,0,1],blue:[0,0,255,1],brown:[165,42,42,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgrey:[169,169,169,1],darkgreen:[0,100,0,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkviolet:[148,0,211,1],fuchsia:[255,0,255,1],gold:[255,215,0,1],green:[0,128,0,1],indigo:[75,0,130,1],khaki:[240,230,140,1],lightblue:[173,216,230,1],lightcyan:[224,255,255,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],magenta:[255,0,255,1],maroon:[128,0,0,1],navy:[0,0,128,1],olive:[128,128,0,1],orange:[255,165,0,1],pink:[255,192,203,1],purple:[128,0,128,1],violet:[128,0,128,1],red:[255,0,0,1],silver:[192,192,192,1],white:[255,255,255,1],yellow:[255,255,0,1],transparent:[255,255,255,0]}})(jQuery);

/**
 * Shadow animation 1.11
 * http://www.bitstorm.org/jquery/shadow-animation/
 * Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
 * Contributors: Mark Carver, Xavier Lepretre and Jason Redding
 * Released under the MIT and GPL licenses.
 */
'use strict';jQuery(function(h){function r(b,m,d){var l=[];h.each(b,function(f){var g=[],e=b[f];f=m[f];e.b&&g.push("inset");"undefined"!==typeof f.left&&g.push(parseFloat(e.left+d*(f.left-e.left))+"px "+parseFloat(e.top+d*(f.top-e.top))+"px");"undefined"!==typeof f.blur&&g.push(parseFloat(e.blur+d*(f.blur-e.blur))+"px");"undefined"!==typeof f.a&&g.push(parseFloat(e.a+d*(f.a-e.a))+"px");if("undefined"!==typeof f.color){var p="rgb"+(h.support.rgba?"a":"")+"("+parseInt(e.color[0]+d*(f.color[0]-e.color[0]),10)+","+parseInt(e.color[1]+d*(f.color[1]-e.color[1]),10)+","+parseInt(e.color[2]+d*(f.color[2]-e.color[2]),10);h.support.rgba&&(p+=","+parseFloat(e.color[3]+d*(f.color[3]-e.color[3])));g.push(p+")")}l.push(g.join(" "))});return l.join(", ")}function q(b){function m(){var a=/^inset\b/.exec(b.substring(c));return null!==a&&0<a.length?(k.b=!0,c+=a[0].length,!0):!1}function d(){var a=/^(-?[0-9\.]+)(?:px)?\s+(-?[0-9\.]+)(?:px)?(?:\s+(-?[0-9\.]+)(?:px)?)?(?:\s+(-?[0-9\.]+)(?:px)?)?/.exec(b.substring(c));return null!==a&&0<a.length?(k.left=parseInt(a[1],10),k.top=parseInt(a[2],10),k.blur=a[3]?parseInt(a[3],10):0,k.a=a[4]?parseInt(a[4],10):0,c+=a[0].length,!0):!1}function l(){var a=/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b.substring(c));if(null!==a&&0<a.length)return k.color=[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16),1],c+=a[0].length,!0;a=/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b.substring(c));if(null!==a&&0<a.length)return k.color=[17*parseInt(a[1],16),17*parseInt(a[2],16),17*parseInt(a[3],16),1],c+=a[0].length,!0;a=/^rgb\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(b.substring(c));if(null!==a&&0<a.length)return k.color=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),1],c+=a[0].length,!0;a=/^rgba\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(b.substring(c));return null!==a&&0<a.length?(k.color=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseFloat(a[4])],c+=a[0].length,!0):!1}function f(){var a=/^\s+/.exec(b.substring(c));null!==a&&0<a.length&&(c+=a[0].length)}function g(){var a=/^\s*,\s*/.exec(b.substring(c));return null!==a&&0<a.length?(c+=a[0].length,!0):!1}function e(a){if(h.isPlainObject(a)){var b,e,c=0,d=[];h.isArray(a.color)&&(e=a.color,c=e.length);for(b=0;4>b;b++)b<c?d.push(e[b]):3===b?d.push(1):d.push(0)}return h.extend({left:0,top:0,blur:0,spread:0},a)}for(var p=[],c=0,n=b.length,k=e();c<n;)if(m())f();else if(d())f();else if(l())f();else if(g())p.push(e(k)),k={};else break;p.push(e(k));return p}h.extend(!0,h,{support:{rgba:function(){var b=h("script:first"),m=b.css("color"),d=!1;if(/^rgba/.test(m))d=!0;else try{d=m!==b.css("color","rgba(0, 0, 0, 0.5)").css("color"),b.css("color",m)}catch(l){}b.removeAttr("style");return d}()}});var s=h("html").prop("style"),n;h.each(["boxShadow","MozBoxShadow","WebkitBoxShadow"],function(b,h){if("undefined"!==typeof s[h])return n=h,!1});n&&(h.Tween.propHooks.boxShadow={get:function(b){return h(b.elem).css(n)},set:function(b){var m=b.elem.style,d=q(h(b.elem)[0].style[n]||h(b.elem).css(n)),l=q(b.end),f=Math.max(d.length,l.length),g;for(g=0;g<f;g++)l[g]=h.extend({},d[g],l[g]),d[g]?"color"in d[g]&&!1!==h.isArray(d[g].color)||(d[g].color=l[g].color||[0,0,0,0]):d[g]=q("0 0 0 0 rgba(0,0,0,0)")[0];b.run=function(b){b=r(d,l,b);m[n]=b}}})});

/*!
* screenfull
* v1.1.1 - 2013-11-20
* https://github.com/sindresorhus/screenfull.js
* (c) Sindre Sorhus; MIT License
*/
!function(a,b){"use strict";var c="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,d=function(){for(var a,c,d=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],e=0,f=d.length,g={};f>e;e++)if(a=d[e],a&&a[1]in b){for(e=0,c=a.length;c>e;e++)g[d[0][e]]=a[e];return g}return!1}(),e={request:function(a){var e=d.requestFullscreen;a=a||b.documentElement,/5\.1[\.\d]* Safari/.test(navigator.userAgent)?a[e]():a[e](c&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){b[d.exitFullscreen]()},toggle:function(a){this.isFullscreen?this.exit():this.request(a)},onchange:function(){},onerror:function(){},raw:d};return d?(Object.defineProperties(e,{isFullscreen:{get:function(){return!!b[d.fullscreenElement]}},element:{enumerable:!0,get:function(){return b[d.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return!!b[d.fullscreenEnabled]}}}),b.addEventListener(d.fullscreenchange,function(a){e.onchange.call(e,a)}),b.addEventListener(d.fullscreenerror,function(a){e.onerror.call(e,a)}),a.screenfull=e,void 0):(a.screenfull=!1,void 0)}(window,document);
