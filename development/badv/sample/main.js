/**
 * User's Codes/Functions here
 */
var currentMode = 'JP';
var textStorage = Array();
var eventStorage = Array();
function registerEventsJP() {
	textStorage['JP'] = Array();
	
	textStorage['JP'][-3] = 'このデモは Android や iOS デバイス上ではまだ試作段階です。<br />動作の保証はしかねます。<br />（Android ブラウザや MobileSafari の仕様上ではダイナミックな音声再生が対応していません。）';
	textStorage['JP'][-2] = 'このデモの物語はフィクションです。<br />実在の人物、団体、事件などには <span style="font-weight: bold;">ほとんど</span> 関係ありません。<br />どうぞご了承くださいませ。';
	
	textStorage['JP'][5] = ['ふーむ、次のコミケに当選はしたけど、<br />新刊以外何をだそう・・・', ''];
	textStorage['JP'][6] = ['「あ、あのぅ・・・　ご主人？」', '？？？'];
	textStorage['JP'][7] = ['・・・さあ、考えるんだ・・・', ''];
	textStorage['JP'][8] = ['「・・・・・・」', '？？？'];
	textStorage['JP'][9] = ['「・・・うー」', '？？？'];
	textStorage['JP'][10] = ['「うーん？ミアなのか・・・？」', ''];
	
	textStorage['JP'][13] = ['「うん、ミアです・・・　はい・・・」', 'ミア・フラットパディ'];
	textStorage['JP'][14] = ['「ごめん、ごめん。考え事だったんだ。・・・で、どうしたの？」', '主人公'];
	textStorage['JP'][15] = ['「うー、すみません。お部屋に来てもらえますか・・・？」', 'ミア・フラットパディ'];
	textStorage['JP'][16] = ['「うん？別に良いよ。どうしたの？」', '主人公'];
	textStorage['JP'][17] = ['「・・・見てもらいたいものがあります・・・」', 'ミア・フラットパディ'];
	textStorage['JP'][18] = ['「ふーん、分かった。部屋に入っていい？」', '主人公'];
	textStorage['JP'][19] = ['「・・・うん・・・どうぞ」', 'ミア・フラットパディ'];
	/*
	textStorage['JP'][23] = ['ガチャ・・・', ''];
	textStorage['JP'][25] = ['「で、見てもらい・・・たい・・・も・・・の・・・って・・・」', '主人公'];
	textStorage['JP'][27] = ['こ、これは・・・！', ''];
	textStorage['JP'][20] = ['「どう・・・です・・・か？」', 'ミア・フラットパディ'];
	textStorage['JP'][19] = ['「どうですか・・・って、何か？」', '主人公'];
	textStorage['JP'][20] = ['「その・・・服・・・」', 'ミア・フラットパディ'];
	textStorage['JP'][21] = ['「ふ、服・・・！？」', '主人公'];
	textStorage['JP'][22] = ['「///」', 'ミア・フラットパディ'];
	textStorage['JP'][23] = '残念ながら、本デモはここまでです。<br />ご試遊ありがとうございました。';
	//*/
}

function registerEventsEN() {
	textStorage['EN'] = Array();
	
	textStorage['EN'][-3] = 'This demo is not fully tested on iOS and Android Device.<br />It\'s buggy and not recommended to try.<br />Sound wont\'s able to play properly due to Android Browser and Mobile Safari\'s specification.';
	textStorage['EN'][-2] = 'This demo\'s story is FICTIONAL<br />It\'s <span style="font-weight: bold;">NOT REALLY RELATED</span> to the real world character, case, and organizations.<br />Thank you for your understanding.';
	
	textStorage['EN'][5] = ['Alright, I get myself a booth in the comic market,<br />what should I produce other than new doujin...', ''];
	textStorage['EN'][6] = ['"Erm, master?"', '???'];
	textStorage['EN'][7] = ['... Come on, think ...', ''];
	textStorage['EN'][8] = ['"......"', '???'];
	textStorage['EN'][9] = ['"... Sigh..."', '???'];
	textStorage['EN'][10] = ['"Hmm? You called, Mia...?"', ''];
	
	textStorage['EN'][13] = ['"Um, yes... It\'s Mia..."', 'Mia=Flatpadie'];
	textStorage['EN'][14] = ['"Sorry for the ignorance, I had something in mind. What\'s up, Mia?"', 'Protagonist'];
	textStorage['EN'][15] = ['"Well... Can you come over to my room right now?"', 'Mia=Flatpadie'];
	textStorage['EN'][16] = ['"...? Alright. But why?"', 'Protagonist'];
	textStorage['EN'][17] = ['"...I have something for you to look over to..."', 'Mia=Flatpadie'];
	textStorage['EN'][18] = ['"Well then. Can I enter the room now?"', 'Protagonist'];
	textStorage['EN'][19] = ['"Yes, please..."', 'Mia=Flatpadie'];
	/*
	textStorage['EN'][23] = ['*Protagonist enters the room*', ''];
	textStorage['EN'][25] = ['"So, what is the thing you wanted me to... look over... to..."', 'Protagonist'];
	textStorage['EN'][27] = ['...Oh ...My ...', ''];
	textStorage['EN'][20] = ['"...How is it?"', 'Mia=Flatpadie'];
	textStorage['EN'][19] = ['Huh!? On Wh... What?', 'Protagonist'];
	textStorage['EN'][20] = ['"Er... Dress..."', 'Mia=Flatpadie'];
	textStorage['EN'][21] = ['"Dr, Dress!?"', 'Protagonist'];
	textStorage['EN'][22] = ['"///"', 'Mia=Flatpadie'];
	textStorage['EN'][23] = 'The demo ends here.<br />Thank you for trying out.';
	//*/
}

function registerSceneEvents() {
	eventStorage[-5] = function() {
		$('div#copyRight').css('font-size', '-=2px');
		$('div#copyRight').css('color', '#FFFFFF');
		startDecelarator('div#copyRight');
		proceedToNextScene();
	};
	
	eventStorage[-4] = function() {
		setTimeout(function () {
			elementsOnAnimation.push('div#textAreaContainer');
			$('div#textAreaContainer').animate({
				'bottom': '30px'
			}, oneSecond, function() {
				endsAnimation();
				setTimeout(proceedToNextScene, 10);
			});
		}, oneSecond);
	};
	
	eventStorage[-3] = function() {
		if (isMobileDevice()) {
			// displayTextTypeWriterStyle('div.textDisplay', 'このデモは Android や iOS デバイス上ではまだ試作段階です。<br />動作の保証はしかねます。<br />（Android ブラウザや MobileSafari の仕様上ではダイナミックな音声再生が対応していません。）');
		} else {
			skipTextDisplay = true;
			proceedToNextScene();
		}
	};
	
	eventStorage[-2] = function() {
		if (isMobileDevice()) {
			textStorage['JP'][-2] = 'なお、' + textStorage['JP'][-2];
			textStorage['EN'][-2] = 'Thus. ' + textStorage['EN'][-2];
		}
		// displayTextTypeWriterStyle('div.textDisplay', exText + 'このデモの物語はフィクションです。<br />実在の人物、団体、事件などには <span style="font-weight: bold;">ほとんど</span> 関係ありません。<br />どうぞご了承くださいませ。');
	};
	
	eventStorage[-1] = function() {
		elementsOnAnimation.push('div#textAreaContainer');
		$('div#textAreaContainer').animate({
			'bottom': '-300px'
		}, oneSecond, function() {
			endsAnimation();
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[0] = function() {
		$('div#main').append(buildLoadingImage());
		$('div#loader').css('opacity', '0');
		elementsOnAnimation.push('div#loader');
		$('div#loader').animate({
			'opacity' : '1'
		}, oneSecond, function() {
			endsAnimation();
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[1] = function() {
		var ResourcesUrl = Array();
		ResourcesUrl.push('../../commonresource/images/cg01.jpg');
		ResourcesUrl.push('../../commonresource/images/mia_base_resized.png');
		ResourcesUrl.push('../../commonresource/images/mia_eye_resized.jpg');
		ResourcesUrl.push('../../commonresource/images/bg02_resized.jpg');

		ResourcesUrl.push('../../commonresource/sounds/door.mp3');
		ResourcesUrl.push('../../commonresource/sounds/door.ogg');
		
		// Not Available yet
		ResourcesUrl.push('../../commonresource/sounds/bgm01.mp3');
		ResourcesUrl.push('../../commonresource/sounds/bgm01.ogg');
		ResourcesUrl.push('../../commonresource/sounds/bgm02.mp3');
		ResourcesUrl.push('../../commonresource/sounds/bgm02.ogg');
		
		loadResources(ResourcesUrl, oneSecond * 10);
		
		var temp = setInterval(function() {
			if (isResourceReady == true) {
				clearInterval(temp);
				var newDiv = document.createElement('div');
				newDiv.className = 'layer0';
				$('div#background').append(newDiv);
				
				$('div#background div.layer0').css({
					'background-image' : 'url(' + ResourcesUrl[3] + ')',
					'width' : '100%',
					'height' : '100%',
					'opacity': '0'
				});
				
				var newDiv = document.createElement('div');
				newDiv.className = 'layer1';
				$('div#background').append(newDiv);
				
				$('div#background div.layer1').css({
					'background-image' : 'url(' + ResourcesUrl[0] + ')',
					'width' : '100%',
					'height' : '100%',
					'opacity': '0'
				});
				elementsOnAnimation.push('div#loader');
				$('div#loader').animate({
					'opacity' : '0'
				}, oneSecond, function() {
					endsAnimation();
					$(this).remove();
					setTimeout(proceedToNextScene, 10);
				});
				isResourceReady = false;
			}
		}, 1);
	};
	
	eventStorage[2] = function() {
		elementsOnAnimation.push('div#copyRight');
		$('div#copyRight').animate({
			'opacity' : '0'
		}, oneSecond, function() {
			var originText = $(this).html();
			var newText = originText + '. &copy;Syroh. &copy;ゆんてぃ. &copy;音々亭. &copy;秋山裕和.'
			$(this).html(newText);
			$(this).animate({
				'opacity' : '1'
			}, oneSecond, function() {
				endsAnimation();
				setTimeout(proceedToNextScene, 10);
			});
		});
	};
	
	eventStorage[3] = function() {
		// Play BGM01
		var audioSource = '../../commonresource/sounds/bgm01.ogg';
		if (isMobileDevice() && isAppleDevice()) {
			audioSource = '../../commonresource/sounds/bgm01.mp3'; // Won't play, thanks to the specification of mobile browsers
		}
		var BGM01 = audioResource[audioSource];
		
		var playTimes = 0;
		BGM01.volume = 0;
		BGM01.addEventListener('ended', function() {
			playTimes++;
			BGM01.pause();
			BGM01.currentTime = 0;
			BGM01.play();
		});
		
		BGM01.addEventListener('play', function() {
			//alert('started!');
			debugLog('started!');
			var date = new Date;
			debugLog(date.getTime());
			if (playTimes == 0) {
				var baseVolume = BGM01.volume;
				var volumeSpeed = (250 / (oneSecond * 5));
				var temp = setInterval(function() {
					baseVolume += volumeSpeed;
					if (baseVolume >= 1) {
						baseVolume = 1;
						clearInterval(temp);
					}
					BGM01.volume = baseVolume;
				}, 250);
			}
		});
		
		BGM01.play();
		
		elementsOnAnimation.push('div#background div.layer0');
		$('div#background div.layer0').animate({
			'opacity': '1'
		}, oneSecond * 2, function() {
			endsAnimation();
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[4] = function() {
		elementsOnAnimation.push('div#textAreaContainer');
		$('div#textAreaContainer').animate({
			'bottom': '30px'
		}, oneSecond, function() {
			endsAnimation();
			// displayTextTypeWriterStyleWithCharacterName('div.textDisplay', 'ふーむ、次のコミケに当選はしたけど、<br />新刊以外何をだそう・・・', '');
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[11] = function() {
		elementsOnAnimation.push('div.characterIcon');
		$('div.characterIcon').animate({
			'width' : '+=200px'
		}, oneSecond * 1.5, function() {
			//debugLog(21);
		});
		elementsOnAnimation.push('div.textDisplay');
		$('div.textDisplay').animate({
			'width' : '-=210px',
			'margin-left' : '+=10px'
		}, oneSecond * 1.5, function() {
			endsAnimation();
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[12] = function() {
		var miaBase = document.createElement('div');
		miaBase.id = 'mia';
		miaBase.style.opacity = '0';
		$('div.characterIcon').append(miaBase);
		
		var miaEye = document.createElement('div');
		miaEye.id = 'eye';
		miaEye.className = 'pos1';
		$('div#mia').append(miaEye);
		
		setWink('div#eye', 'pos', 3, 5);
		startWink('div#eye');
		
		$('div#mia').css({
			'-moz-transform-origin' : 'top left',
			'-webkit-transform-origin' : 'top left'
		});
		
		// Will not registered if Being skipped? Might need to register event separately.
		elementsOnAnimation.push('div#mia');
		$('div#mia').animate({
			'opacity' : '1'
		}, oneSecond * 2, function() {
			// debugLog(31);
			endsAnimation();
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[20] = function() {
		elementsOnAnimation.push('div#mia');
		$('div#mia').animate({
			'opacity' : '0'
		}, oneSecond, function() {
			elementsOnAnimation.push('div.characterIcon');
			$('div.characterIcon').animate({
				'width' : '-=200px',
				'background-color' : '#000000' // Not Working? TTATT
			}, oneSecond);
			elementsOnAnimation.push('div.textDisplay');
			$('div.textDisplay').animate({
				'width' : '+=210px',
				'margin-left' : '-=10px'
			}, oneSecond, function() {
				$('div.characterIcon').css({
					'width' : '0%',
					'background-color' : '#F0F0F0'
				});
				$('div.textDisplay').css({
					'width' : '100%',
					'margin-left' : ''
				});
				endsAnimation();
				setTimeout(proceedToNextScene, 10);
			});
		});
	};
	
	eventStorage[21] = function() {
		// Fade BGM 01
		var audioSource = '../../commonresource/sounds/bgm01.ogg';
		if (isMobileDevice() && isAppleDevice()) {
			audioSource = '../../commonresource/sounds/bgm01.mp3'; // Won't play, thanks to the specification of mobile browsers
		}
		var BGM01 = audioResource[audioSource];
		var baseVolume = BGM01.volume;
		var volumeSpeed = (250 / (oneSecond * 2.5));
		var temp = setInterval(function() {
			baseVolume -= volumeSpeed;
			if (baseVolume <= 0) {
				clearInterval(temp);
				BGM01.pause();
				BGM01.currentTime = 0;
				delete audioResource[audioSource];
			} else {
				BGM01.volume = baseVolume;
			}
		}, 250);
		
		elementsOnAnimation.push('div#background div.layer0');
		$('div#background div.layer0').animate({
			'opacity': '0'
		}, oneSecond * 2, function() {
			endsAnimation();
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[22] = function() {
		$('div#background div.layer0').remove();
			
		var audioSource = '../../commonresource/sounds/door.ogg';
		if (isMobileDevice() && isAppleDevice()) {
			audioSource = '../../commonresource/sounds/door.mp3'; // Won't play, thanks to the specification of mobile browsers
		}
		var newAudio = audioResource[audioSource];
		
		newAudio.addEventListener('ended', function() {
			//alert('played!');
			debugLog('played!');
			var date = new Date;
			debugLog(date.getTime());
			debugLog(newAudio.currentTime);
			newAudio = null;
			delete newAudio;
		});
		
		newAudio.addEventListener('play', function() {
			//alert('started!');
			debugLog('started!');
			var date = new Date;
			debugLog(date.getTime());
			// displayTextTypeWriterStyleWithCharacterName('div.textDisplay', 'ガチャ・・・', '');
			setTimeout(proceedToNextScene, 10);
		});
		
		newAudio.play();
	};
	
	eventStorage[24] = function() {
		//Play BGM 02
		var audioSource = '../../commonresource/sounds/bgm02.ogg';
		if (isMobileDevice() && isAppleDevice()) {
			audioSource = '../../commonresource/sounds/bgm02.mp3'; // Won't play, thanks to the specification of mobile browsers
		}
		var BGM02 = audioResource[audioSource];
		
		var playTimes = 0;
		BGM02.volume = 0;
		BGM02.addEventListener('ended', function() {
			playTimes++;
			BGM02.pause();
			BGM02.currentTime = 0;
			BGM02.play();
		});
		
		BGM02.addEventListener('play', function() {
			//alert('started!');
			debugLog('started!');
			var date = new Date;
			debugLog(date.getTime());
			if (playTimes == 0) {
				var baseVolume = BGM02.volume;
				var volumeSpeed = (1 / (oneSecond * 5));
				var temp = setInterval(function() {
					baseVolume += volumeSpeed;
					if (baseVolume >= 1) {
						baseVolume = 1;
						clearInterval(temp);
					}
					BGM02.volume = baseVolume;
				}, 1);
			}
		});
		
		BGM02.play();
		
		$('div#background div.layer1').css({
			'background-size' : '200%',
			'background-position' : '50% 100%'
		});
		elementsOnAnimation.push('div#background div.layer1');
		$('div#background div.layer1').animate({
			'opacity': '1'
		}, oneSecond * 3, function() {
			endsAnimation();
			setTimeout(proceedToNextScene, 10);
		});
	};
	
	eventStorage[26] = function() {
		var newDiv = document.createElement('div');
		newDiv.className = 'layer2';
		$('div#background').append(newDiv);
		
		$('div#background div.layer2').css({
			'background-image' : $('div#background div.layer1').css('background-image'),
			'background-position' : '100% 25%',
			'width' : '100%',
			'height' : '100%',
			'opacity': '0'
		});
		
		$('div#background div.layer1').animate({
			'background-position' : '70% 25%'
		}, oneSecond * 10, function() {
			elementsOnAnimation.push('div#background div.layer2');
			$('div#background div.layer2').animate({
				'opacity': '1'
			}, oneSecond * 2, function() {
				endsAnimation();
				$('div#background div.layer1').remove();
				$('div#background div.layer2').attr('class', 'layer1');
			});
		});
		setTimeout(proceedToNextScene, 10);
	};
	//*/
	/* Text Display do not need to be stored.
	//*/
	
}

var sceneCount = -6;
var skipTextDisplay = false;
function proceedToNextScene() {
	// Manipulate value here to prevent recursion.
	var executeEvent = eventStorage[++sceneCount];
	if (typeof(executeEvent) === 'function') {
		executeEvent();
	}
	
	if (!skipTextDisplay) {
		var currentText = textStorage[currentMode][sceneCount];
		if (Object.prototype.toString.call(currentText) === '[object Array]') {
			// Array data
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', currentText[0], currentText[1]);
		} else if (typeof(currentText) === 'string') {
			displayTextTypeWriterStyle('div.textDisplay', currentText);
		}
	}
	skipTextDisplay = false;
	
	// Recursion occurred when value manipulated here. 
	// sceneCount++;
}

function switchLanguage(mode) {
	$('div.textDisplay').animate({
		'opacity' : '0'
	}, 500, function() {
		currentMode = mode;
		clearTextDisplay();
		$('div.textDisplay').css('opacity', '1');
		var currentText = textStorage[sceneCount][currentMode];
		if (currentText[0] !== undefined) {
			// Array data
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', currentText[1], currentText[0]);
		} else {
			displayTextTypeWriterStyle('div.textDisplay', currentText);
		}
	});
}

var clickDisabled = false;


/**
 * When DOM was completely loaded
 */
$(document).ready(function () {
	//jQuery.noConflict();
	initInterface();
	
	var _main = $('div#main');
	_main.next = function(){setTimeout(function(){_main.dequeue();},0);};
	
	setDecelarator('div#copyRight', 1.1, 960, 12, 'right');
	$('div#textAreaContainer').css('bottom', '-300px');
	_main.css('background-color', '#000000');
	_main.css('border', '1px solid #333333');
	
	runExperimentalMobileDeviceScaling();
	
	// New Experiment (Semi-static?)
	if (true) {
		registerEventsJP();
		registerEventsEN();
		registerSceneEvents();
		
		proceedToNextScene();
		
		$('div#contents').bind('click', function() {
			if (resourceLoading) {
				// Do nothing. Wait.
				alert('loading');
			} else if (typeWriterExecuting) {
				forceEndTyper = true;
			} else if (elementsOnAnimation.length != 0) {
				endsAnimation();
			} else {
				clearTextDisplay();
				proceedToNextScene();
			}
			debugLog(elementsOnAnimation);
			return false;
		});
		
		var temp = setInterval(function() {
			debugLog(elementsOnAnimation);
		}, 250);
	}
	
	// Old Experiment. (Very static)
	if (false) {
		_main
		.queue(function() {
			$('div#copyRight').css('font-size', '-=2px');
			$('div#copyRight').css('color', '#FFFFFF');
			startDecelarator('div#copyRight');
			_main.next();
		})
		.delay(oneSecond)
		.queue(function() {
			elementsOnAnimation.push('div#textAreaContainer');
			$('div#textAreaContainer').animate({
				'bottom': '30px'
			}, oneSecond, function() {
				endsAnimation();
				_main.next();
			});
			
		})
		.queue(function() {
			if (isMobileDevice()) {
				displayTextTypeWriterStyle('div.textDisplay', 'このデモは Android や iOS デバイス上ではまだ試作段階です。<br />動作の保証はしかねます。<br />（Android ブラウザや MobileSafari の仕様上ではダイナミックな音声再生が対応していません。）');
			} else {
				_main.next();
			}
		})
		.queue(function() {
			var exText = '';
			if (isMobileDevice()) {
				exText = 'なお、';
			}
			displayTextTypeWriterStyle('div.textDisplay', exText + 'このデモの物語はフィクションです。<br />実在の人物、団体、事件などには <span style="font-weight: bold;">ほとんど</span> 関係ありません。<br />どうぞご了承くださいませ。');
		})
		.queue(function() {
			elementsOnAnimation.push('div#textAreaContainer');
			$('div#textAreaContainer').animate({
				'bottom': '-300px'
			}, oneSecond, function() {
				endsAnimation();
				_main.next();
			});
		})
		.queue(function() {
			_main.append(buildLoadingImage());
			$('div#loader').css('opacity', '0');
			elementsOnAnimation.push('div#loader');
			$('div#loader').animate({
				'opacity' : '1'
			}, oneSecond, function() {
				endsAnimation();
				_main.next();
			});
			
		})
		.queue(function() {
			
			var ResourcesUrl = Array();
			ResourcesUrl.push('images/cg01.jpg');
			ResourcesUrl.push('images/mia_base_resized.png');
			ResourcesUrl.push('images/mia_eye_resized.jpg');
			ResourcesUrl.push('images/bg02_resized.jpg');
	
			ResourcesUrl.push('sounds/door.mp3');
			ResourcesUrl.push('sounds/door.ogg');
			
			// Not Available yet
			ResourcesUrl.push('sounds/bgm01.mp3');
			ResourcesUrl.push('sounds/bgm01.ogg');
			ResourcesUrl.push('sounds/bgm02.mp3');
			ResourcesUrl.push('sounds/bgm02.ogg');
			
			loadResources(ResourcesUrl, oneSecond * 10);
			
			var temp = setInterval(function() {
				if (isResourceReady == true) {
					clearInterval(temp);
					var newDiv = document.createElement('div');
					newDiv.className = 'layer0';
					$('div#background').append(newDiv);
					
					$('div#background div.layer0').css({
						'background-image' : 'url(' + ResourcesUrl[3] + ')',
						'width' : '100%',
						'height' : '100%',
						'opacity': '0'
					});
					
					var newDiv = document.createElement('div');
					newDiv.className = 'layer1';
					$('div#background').append(newDiv);
					
					$('div#background div.layer1').css({
						'background-image' : 'url(' + ResourcesUrl[0] + ')',
						'width' : '100%',
						'height' : '100%',
						'opacity': '0'
					});
					elementsOnAnimation.push('div#loader');
					$('div#loader').animate({
						'opacity' : '0'
					}, oneSecond, function() {
						endsAnimation();
						$(this).remove();
						_main.next();
					});
					isResourceReady = false;
				}
			}, 1);
			
		})
		.queue(function() {
			
			elementsOnAnimation.push('div#copyRight');
			$('div#copyRight').animate({
				'opacity' : '0'
			}, oneSecond, function() {
				var originText = $(this).html();
				var newText = originText + '. &copy;Syroh. &copy;ゆんてぃ. &copy;音々亭. &copy;秋山裕和.'
				$(this).html(newText);
				$(this).animate({
					'opacity' : '1'
				}, oneSecond, function() {
					endsAnimation();
					_main.next();
				});
			});
			
		})
		.queue(function() {
			// Play BGM01
			var audioSource = 'sounds/bgm01.ogg';
			if (isMobileDevice() && isAppleDevice()) {
				audioSource = 'sounds/bgm01.mp3'; // Won't play, thanks to the specification of mobile browsers
			}
			var BGM01 = audioResource[audioSource];
			
			var playTimes = 0;
			BGM01.volume = 0;
			BGM01.addEventListener('ended', function() {
				playTimes++;
				BGM01.pause();
				BGM01.currentTime = 0;
				BGM01.play();
			});
			
			BGM01.addEventListener('play', function() {
				//alert('started!');
				debugLog('started!');
				var date = new Date;
				debugLog(date.getTime());
				if (playTimes == 0) {
					var baseVolume = BGM01.volume;
					var volumeSpeed = (250 / (oneSecond * 5));
					var temp = setInterval(function() {
						baseVolume += volumeSpeed;
						if (baseVolume >= 1) {
							baseVolume = 1;
							clearInterval(temp);
						}
						BGM01.volume = baseVolume;
					}, 250);
				}
			});
			
			BGM01.play();
			
			elementsOnAnimation.push('div#background div.layer0');
			$('div#background div.layer0').animate({
				'opacity': '1'
			}, oneSecond * 2, function() {
				endsAnimation();
				_main.next();
			});
			
		})
		.queue(function() {
			
			elementsOnAnimation.push('div#textAreaContainer');
			$('div#textAreaContainer').animate({
				'bottom': '30px'
			}, oneSecond, function() {
				displayTextTypeWriterStyleWithCharacterName('div.textDisplay', 'ふーむ、次のコミケに当選はしたけど、<br />新刊以外何をだそう・・・', '');
				endsAnimation();
			});
			
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「あ、あのぅ・・・　ご主人？」', '？？？');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '・・・さあ、考えるんだ・・・', '');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「・・・・・・」', '？？？');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「・・・うー」', '？？？');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「うーん？ミアなのか・・・？」', '');
		})
		.queue(function() {
			_main.next();
		})
		.queue(function() {
			elementsOnAnimation.push('div.characterIcon');
			$('div.characterIcon').animate({
				'width' : '+=200px'
			}, oneSecond * 1.5);
			elementsOnAnimation.push('div.textDisplay');
			$('div.textDisplay').animate({
				'width' : '-=210px',
				'margin-left' : '+=10px'
			}, oneSecond * 1.5, function() {
				endsAnimation();
				_main.next();
			});
		})
		.queue(function() {
			
			var miaBase = document.createElement('div');
			miaBase.id = 'mia';
			miaBase.style.opacity = '0';
			$('div.characterIcon').append(miaBase);
			
			var miaEye = document.createElement('div');
			miaEye.id = 'eye';
			miaEye.className = 'pos1';
			$('div#mia').append(miaEye);
			
			setWink('div#eye', 'pos', 3, 5);
			startWink('div#eye');
			
			$('div#mia').css({
				'-moz-transform-origin' : 'top left',
				'-webkit-transform-origin' : 'top left'
			});
			_main.next();
			
		})
		.queue(function() {
			elementsOnAnimation.push('div#mia');
			$('div#mia').animate({
				'opacity' : '1'
			}, oneSecond * 2, function() {
				endsAnimation();
				_main.next();
			});
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「うん、ミアです・・・　はい・・・」', 'ミア・フラットパディ');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「ごめん、ごめん。考え事だったんだ。・・・で、どうしたの？」', '主人公');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「うー、すみません。お部屋に来てもらえますか・・・？」', 'ミア・フラットパディ');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「うん？別に良いよ。どうしたの？」', '主人公');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「・・・見てもらいたいものがあります・・・」', 'ミア・フラットパディ');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「ふーん、分かった。部屋に入っていい？」', '主人公');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「・・・うん・・・どうぞ」', 'ミア・フラットパディ');
		})
		.queue(function() {
			elementsOnAnimation.push('div#mia');
			$('div#mia').animate({
				'opacity' : '0'
			}, oneSecond, function() {
				_main.next();
			});
		})
		.queue(function() {
			elementsOnAnimation.push('div.characterIcon');
			$('div.characterIcon').animate({
				'width' : '-=200px',
				'background-color' : '#000000' // Not Working? TTATT
			}, oneSecond);
			elementsOnAnimation.push('div.textDisplay');
			$('div.textDisplay').animate({
				'width' : '+=210px',
				'margin-left' : '-=10px'
			}, oneSecond, function() {
				$('div.characterIcon').css({
					'width' : '0%',
					'background-color' : '#F0F0F0'
				});
				$('div.textDisplay').css({
					'width' : '100%',
					'margin-left' : ''
				});
				endsAnimation();
				_main.next();
			});
		})
		.queue(function() {
			// Fade BGM 01
			var audioSource = 'sounds/bgm01.ogg';
			if (isMobileDevice() && isAppleDevice()) {
				audioSource = 'sounds/bgm01.mp3'; // Won't play, thanks to the specification of mobile browsers
			}
			var BGM01 = audioResource[audioSource];
			var baseVolume = BGM01.volume;
			var volumeSpeed = (250 / (oneSecond * 2.5));
			var temp = setInterval(function() {
				baseVolume -= volumeSpeed;
				if (baseVolume <= 0) {
					clearInterval(temp);
					BGM01.pause();
					BGM01.currentTime = 0;
					delete audioResource[audioSource];
				} else {
					BGM01.volume = baseVolume;
				}
			}, 250);
			
			elementsOnAnimation.push('div#background div.layer0');
			$('div#background div.layer0').animate({
				'opacity': '0'
			}, oneSecond * 2, function() {
				endsAnimation();
				$('div#background div.layer0').remove();
				_main.next();
			});
		})
		.queue(function() {
			
			var audioSource = 'sounds/door.ogg';
			if (isMobileDevice() && isAppleDevice()) {
				audioSource = 'sounds/door.mp3'; // Won't play, thanks to the specification of mobile browsers
			}
			var newAudio = audioResource[audioSource];
			
			newAudio.addEventListener('ended', function() {
				//alert('played!');
				debugLog('played!');
				var date = new Date;
				debugLog(date.getTime());
				debugLog(newAudio.currentTime);
				newAudio = null;
				delete newAudio;
			});
			
			newAudio.addEventListener('play', function() {
				//alert('started!');
				debugLog('started!');
				var date = new Date;
				debugLog(date.getTime());
				displayTextTypeWriterStyleWithCharacterName('div.textDisplay', 'ガチャ・・・', '');
			});
			
			newAudio.play();
			
		})
		.queue(function() {
			//Play BGM 02
			var audioSource = 'sounds/bgm02.ogg';
			if (isMobileDevice() && isAppleDevice()) {
				audioSource = 'sounds/bgm02.mp3'; // Won't play, thanks to the specification of mobile browsers
			}
			var BGM02 = audioResource[audioSource];
			
			var playTimes = 0;
			BGM02.volume = 0;
			BGM02.addEventListener('ended', function() {
				playTimes++;
				BGM02.pause();
				BGM02.currentTime = 0;
				BGM02.play();
			});
			
			BGM02.addEventListener('play', function() {
				//alert('started!');
				debugLog('started!');
				var date = new Date;
				debugLog(date.getTime());
				if (playTimes == 0) {
					var baseVolume = BGM02.volume;
					var volumeSpeed = (1 / (oneSecond * 5));
					var temp = setInterval(function() {
						baseVolume += volumeSpeed;
						if (baseVolume >= 1) {
							baseVolume = 1;
							clearInterval(temp);
						}
						BGM02.volume = baseVolume;
					}, 1);
				}
			});
			
			BGM02.play();
			
			$('div#background div.layer1').css({
				'background-size' : '200%',
				'background-position' : '50% 100%'
			});
			elementsOnAnimation.push('div#background div.layer1');
			$('div#background div.layer1').animate({
				'opacity': '1'
			}, oneSecond * 3, function() {
				endsAnimation();
				_main.next();
			});
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「で、見てもらい・・・たい・・・も・・・の・・・って・・・」', '主人公');
		})
		.queue(function() {
			var newDiv = document.createElement('div');
			newDiv.className = 'layer2';
			$('div#background').append(newDiv);
			
			$('div#background div.layer2').css({
				'background-image' : $('div#background div.layer1').css('background-image'),
				'background-position' : '100% 25%',
				'width' : '100%',
				'height' : '100%',
				'opacity': '0'
			});
			
			$('div#background div.layer1').animate({
				'background-position' : '70% 25%'
			}, oneSecond * 10, function() {
				elementsOnAnimation.push('div#background div.layer2');
				$('div#background div.layer2').animate({
					'opacity': '1'
				}, oneSecond * 2, function() {
					endsAnimation();
					$('div#background div.layer1').remove();
					$('div#background div.layer2').attr('class', 'layer1');
				});
			});
			_main.next();
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', 'こ、これは・・・！', '');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「どう・・・です・・・か？」', 'ミア・フラットパディ');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「どうですか・・・って、何か？」', '主人公');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「その・・・服・・・」', 'ミア・フラットパディ');
		})
		.queue(function() {
			elementsOnAnimation.push('div#background div.layer1');
			endsAnimation();
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「ふ、服・・・！？」', '主人公');
		})
		.queue(function() {
			displayTextTypeWriterStyleWithCharacterName('div.textDisplay', '「///」', 'ミア・フラットパディ');
		})
		.queue(function() {
			displayTextTypeWriterStyle('div.textDisplay', '残念ながら、本デモはここまでです。<br />ご試遊ありがとうございました。');
		})
		.queue(function() {
			displayTextTypeWriterStyle('div.textDisplay', '残念ながら、ここから先は進めません。<br />');
			$('div#contents').unbind('click');
			$('div#contents').bind('click', function() {
				if (typeWriterExecuting) {
					forceEndTyper = true;
				} else {
					clearTextDisplay();
					displayTextTypeWriterStyle('div.textDisplay', '残念ながら、ここから先は進めません。<br />');
				}
			});
		});
	}
	
	//_main.append(buildLoadingImage());
	// Old key binding
	if (false) {
		$('div#contents').bind('click', function() {
			if (resourceLoading) {
				// Do nothing. Wait.
			} else if (typeWriterExecuting) {
				forceEndTyper = true;
			} else if (elementsOnAnimation.length != 0) {
				endsAnimation();
			} else {
				clearTextDisplay();
				_main.next();
			}
			return false;
		});
	}
	
	var screenSize = 'Screen Size: ' + screen.width + 'x' + screen.height + "\nInner Size: " + window.innerWidth + 'x' + window.innerHeight + "\nClient Size: " + document.body.clientWidth + 'x' + document.body.clientHeight;
	if (isMobileDevice()) {
		screenSize += '\nUA: ' + navigator.userAgent + '\nOrientation: ' + window.orientation;
		$('body').attr('onorientationchange', 'alert(\'Orientation Changed: \' + window.orientation);');
	}
	//alert(screenSize);
	debugLog(screenSize);
});

/* Known issue list (or TODO/FIXME LIST)
- elementsOnAnimation will unable to register new values after ending animation through clicking. (Too fast? endAnimation is executing while registering? Or maybe Collision?) 
  - Current fix : delay execution of value register. (Do not execute while executing? Prevent over-execution?)
- Mobile Device will not play audio/bgm properly due to browser specification. (refer to: http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW1) 
  - No fix (Not on our end, will need to wait for the developers to remove limitations... And iOS6 just make things worst.)
- It's still hard for developer to use.
  - Sigh. I need skilled comrade/partner to assist my project. Anyone please help~ 

- Maybe "setDecelarator" is not needed? (can be replaced with jQuery + easing plug-in.)
//*/
