// Users Function //

// Creates In-game UI (TODO: Reserved for Override?)
// Create Dynamically to prevent non-developers from understanding how it works
function createUI() {
	// IN-GAME UI //
	// Background + Foreground
	var newDiv = document.createElement('div');
	newDiv.id = 'back';
	$('div#background').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'front';
	$('div#background').append(newDiv);
	
	// Character Area (For Dynamically create character parts)
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'characterArea';
	$('div#background').append(newDiv);
	//*/
	
	// Menu Bar (Save / Load)
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'menubar';
	$('div#contents').append(newDiv);
	//*/
	
	// Text Box Area
	var newDiv = document.createElement('div');
	newDiv.id = 'textboxArea';
	$('div#contents').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'textbox';
	$('div#contents div#textboxArea').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'blacktint';
	$('div#contents div#textboxArea div#textbox').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'namebox';
	$('div#contents div#textboxArea div#textbox').append(newDiv);
	
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'hidebutton';
	$('div#contents div#textboxArea div#textbox').append(newDiv);
	//*/
	
	var newDiv = document.createElement('div');
	newDiv.id = 'charaWindow';
	$('div#contents div#textboxArea').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'text';
	$('div#contents div#textboxArea').append(newDiv);
	
	var newDiv = document.createElement('div');
	newDiv.id = 'textbutton'; // Text Complete, Auto, Skip
	$('div#contents div#textboxArea').append(newDiv);
	
	
	
	// Intro Area (Logo and Disclaimer?) + Menu Screen
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'intronmenu';
	$('div#mainWindow div#main').append(newDiv);
	//*/
	
		// Continue(Load latest save), NewGame, Load, CG / SCENE / MUSIC, exit(redirect?)
	
	
	// Save / Load Screen
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'saveload';
	$('div#mainWindow div#main').append(newDiv);
	//*/
	
		// Get data from DB
		// Image?, Chapter (Root + Numbering?) + Current Text, TimeStamp
	
	// Settings Screen
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'setting';
	$('div#mainWindow div#main').append(newDiv);
	//*/
	
		// Volume, Opacity, Size, Font?, Audio?
	
	// CG / Scene / Music Mode Screen
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'cgscenemusic';
	$('div#mainWindow div#main').append(newDiv);
	//*/
	
		// Get Data from DB
		// CG (Load viewed CG)
		// SCENE (Load experienced scene)
		// MUSIC (Load played BGM?)
	
	
	// Ending
	/*
	var newDiv = document.createElement('div');
	newDiv.id = 'ending';
	$('div#mainWindow div#main').append(newDiv);
	//*/
	
		// ???
}

// Experiment
function createUI2(whichUI) {
	
	switch(whichUI) {
		case 'Intro':
			// Intro Area (Logo and Disclaimer?) + Menu Screen
			var newDiv = document.createElement('div');
			newDiv.id = 'intronmenu';
			$('div#mainWindow div#main').append(newDiv);
			
				// Continue(Load latest save), NewGame, Load, CG / SCENE / MUSIC, exit(redirect?)
			break;
		case 'Saveload':
			// Save / Load Screen
			var newDiv = document.createElement('div');
			newDiv.id = 'saveload';
			$('div#mainWindow div#main').append(newDiv);
			
				// Get data from DB
				// Image?, Chapter (Root + Numbering?) + Current Text, TimeStamp
			break;
		case 'Setting':
			// Settings Screen
			var newDiv = document.createElement('div');
			newDiv.id = 'setting';
			$('div#mainWindow div#main').append(newDiv);
			
				// Volume, Opacity, Size, Font?, Audio?
			break;
		case 'Extra':
			// CG / Scene / Music Mode Screen
			var newDiv = document.createElement('div');
			newDiv.id = 'cgscenemusic';
			$('div#mainWindow div#main').append(newDiv);
			
				// Get Data from DB
				// CG (Load viewed CG)
				// SCENE (Load experienced scene)
				// MUSIC (Load played BGM?)
			break;
		case 'Ending':
			// Ending
			var newDiv = document.createElement('div');
			newDiv.id = 'ending';
			$('div#mainWindow div#main').append(newDiv);
			
			break;
		case 'Ingame':
			// IN-GAME UI //
			// Background + Foreground
			var newDiv = document.createElement('div');
			newDiv.id = 'back';
			$('div#background').append(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.id = 'front';
			$('div#background').append(newDiv);
			
			// Character Area (For Dynamically create character parts)
			var newDiv = document.createElement('div');
			newDiv.id = 'characterArea';
			$('div#background').append(newDiv);
			
			// Menu Bar (Save / Load)
			var newDiv = document.createElement('div');
			newDiv.id = 'menubar';
			$('div#contents').append(newDiv);
			
			// Text Box Area
			var newDiv = document.createElement('div');
			newDiv.id = 'textboxArea';
			$('div#contents').append(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.id = 'textbox';
			$('div#contents div#textboxArea').append(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.id = 'namebox';
			$('div#contents div#textboxArea div#textbox').append(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.id = 'hidebutton';
			$('div#contents div#textboxArea div#textbox').append(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.id = 'charaWindow';
			$('div#contents div#textboxArea').append(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.id = 'text';
			$('div#contents div#textboxArea').append(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.id = 'textbutton'; // Text Complete, Auto, Skip
			$('div#contents div#textboxArea').append(newDiv);
			break;
		default:
			// ???
			throw new Error('Invalid UI Type');
			break;
	}
	
}

function loadSettings() {
	// Get data from DB and apply to reBADV
}

// Override preInit (Initialize Resources)
reBADV.preInit = function() {
	reBADV.debugMode = true;
	reBADV.defaultOutputElement = 'div#textboxArea div#text';
	
	// List Up Resources
	reBADV.resourceList['images'] = {
		'bg001' : '../../commonresource/images/bg02_resized.jpg',
		// 'chara' : '../../commonresource/images/mia_base_resized.png',
		// 'eye' : '../../commonresource/images/mia_eye_resized.jpg',
		// 'chara' : '../../commonresource/images/mia_base.png',
		// 'eye' : '../../commonresource/images/mia_eye.jpg',
		'chara' : '../../commonresource/images/mia_base2_opt.png',
		'cg001' : '../../commonresource/images/cg01.jpg'
	};
	
	reBADV.resourceList['audio'] = {
		'door' : '../../commonresource/sounds/door.ogg',
		'bgm1' : '../../commonresource/sounds/bgm01.ogg',
		'bgm2' : '../../commonresource/sounds/bgm02.ogg'
	};
	
	if (reBADV.getiOSVersion() != 0 || reBADV.getAndroidVersion() != 0) {
		reBADV.resourceList['audio'] = {
			'door' : '../../commonresource/sounds/door.mp3',
			'bgm1' : '../../commonresource/sounds/bgm01.mp3',
			'bgm2' : '../../commonresource/sounds/bgm02.mp3'
		};
	}
	/*
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
	
	//*/
	// reBADV.start();
	
	createUI();
};

reBADV.textList = [
	'このデモはまだ試作段階です。<br />動作の保証はしかねます。<br />端末ブラウザでの閲覧はお勧めいたしません。',
	'このデモの物語はフィクションです。<br />実在の人物、団体、事件などには <span style="font-weight: bold;">ほとんど</span> 関係ありません。<br />どうぞご了承くださいませ。',
	''
];

reBADV.eventScipts = {
	0 : function() {
		var newDiv = document.createElement('div');
		newDiv.id = 'copyright';
		newDiv.innerHTML = 'Powered By jQuery. &copy;K2-R&amp;D 2012, 2013.';
		$('div#main').append(newDiv);	
		
		$('div#textboxArea').css('bottom', '-=400px');
		// $('div#textboxArea').css('background-color', '#FF0000');
		reBADV.registerAnimate('div#textboxArea');
		$('div#textboxArea').animate({
			'bottom' : '+=400px'
		}, 1000, 'swing', function() {
			reBADV.emptyAnimate('div#textboxArea');
		});
		
		return 1100;
	},
	2 : function() {
		reBADV.registerAnimate('div#textboxArea');
		$('div#textboxArea').animate({
			'bottom' : '-=400px'
		}, 1000, 'swing', function() {
			reBADV.emptyAnimate('div#textboxArea');
			reBADV.notInteractable = true;
			
			reBADV.currentScript = -1;
			// reBADV.textList = tempText;
			
			reBADV.resourseLoader();
		});
		
		return 1100;
	}
};

reBADV.afterLoadComplete = function() {
	$('div#loadContainer').animate({
		'opacity' : '0'
	}, 500, 'swing', function() {
		$('div#loadContainer').remove();
		reBADV.notInteractable = false;
		reBADV.nextScript();
	});
	
	reBADV.textList = [
		'ふーむ、次のコミケに当選はしたけど、<br />新刊以外何をだそう・・・',
		'？？？::::「あ、あのぅ・・・　ご主人？」',
		'・・・さあ、考えるんだ・・・',
		'？？？::::「・・・・・・」',
		'？？？::::「・・・うー」',
		'「うーん？ミアなのか・・・？」',
		'ミア・フラットパディ::::「うん、ミアです・・・　はい・・・」',
		'主人公::::「ごめん、ごめん。考え事だったんだ。・・・で、どうしたの？」',
		'ミア・フラットパディ::::「うー、すみません。お部屋に来てもらえますか・・・？」',
		'主人公::::「うん？別に良いよ。どうしたの？」',
		'ミア・フラットパディ::::「・・・見てもらいたいものがあります・・・」',
		'主人公::::「ふーん、分かった。部屋に入っていい？」',
		'ミア・フラットパディ::::「・・・うん・・・どうぞ」',
		'ガチャ・・・',
		'主人公::::「で、見てもらい・・・たい・・・も・・・の・・・って・・・」',
		'こ、これは・・・！',
		'ミア・フラットパディ::::「どう・・・です・・・か？」',
		'主人公::::「どうですか・・・って、何か？」',
		'ミア・フラットパディ::::「その・・・服・・・」',
		'主人公::::「ふ、服・・・！？」',
		'ミア・フラットパディ::::「「///」」',
		'残念ながら、本デモはここまでです。<br />ご試遊ありがとうございました。',
		'残念ながら、ここから先は進めません。<br />'
	];
	
	reBADV.eventScipts = {
		0 : function() {
			reBADV.playBGM(0, reBADV.resourceList['audio']['bgm1']);
			$('div#background div#back').css({
				'opacity' : '0',
				'background-image' : 'url(' + reBADV.resourceList['images']['bg001'] + ')'
			});
			
			reBADV.registerAnimate('div#background div#back');
			$('div#background div#back').animate({
				'opacity' : '1'
			}, 500, 'swing', function() {
				reBADV.emptyAnimate('div#background div#back');
			});
			
			$('div#copyright').animate({
				'opacity' : '0'
			}, 500, function() {
				var originText = $(this).html();
				var newText = originText + ' <a href="http://churimenoneko.blog29.fc2.com/" target="_blank">&copy;Syroh.</a> <a href="http://www.pixiv.net/member.php?id=1200567" target="_blank">&copy;ゆんてぃ.</a> <a href="http://soundarbour.sakura.ne.jp/" target="_blank">&copy;音々亭.</a> <a href="http://www.hmix.net/" target="_blank">&copy;秋山裕和.</a>'
				$(this).html(newText);
				$(this).animate({
					'opacity' : '1'
				}, 500, function() {
					
				});
			});
			
			reBADV.registerAnimate('div#textboxArea');
			$('div#textboxArea').animate({
				'bottom' : '+=400px'
			}, 1000, 'swing', function() {
				reBADV.emptyAnimate('div#textboxArea');
			});
			
			
			return 1100;
		},
		
		6 : function() {
			$('div#charaWindow').css({
				'width' : '-=200px',
				'background-color' : '#FFF'
			});
			
			var miaBase = document.createElement('div');
			miaBase.id = 'mia';
			miaBase.style.opacity = '0';
			miaBase.style.backgroundImage = 'url(' + reBADV.resourceList['images']['chara'] + ')';
			$('div#charaWindow').append(miaBase);
			
			/*
			var miaEye = document.createElement('div');
			miaEye.id = 'eye';
			miaEye.style.backgroundImage = 'url(' + reBADV.resourceList['images']['eye'] + ')';
			$('div#mia').append(miaEye);
			//*/
			
			reBADV.startEyeWinker('div#mia', 3, 200);
			
			reBADV.registerAnimate('div#charaWindow');
			$('div#charaWindow').animate({
				'width' : '+=200px'
			}, 500, 'swing', function() {
				reBADV.emptyAnimate('div#charaWindow');
				
				reBADV.registerAnimate('div#mia');
				$('div#mia').animate({
					'opacity' : '1'
				}, 1000, 'swing', function() {
					reBADV.emptyAnimate('div#mia');
				});
			});
			
			return 1600;
		},
		
		13 : function() {
			reBADV.stopEyeWinker('div#mia');
			
			reBADV.registerAnimate('div#mia');
			$('div#mia').animate({
				'opacity' : '0'
			}, 1000, 'swing', function() {
				reBADV.emptyAnimate('div#mia');
				$('div#mia').remove();
				
				reBADV.registerAnimate('div#charaWindow');
				$('div#charaWindow').animate({
					'width' : '-=200px'
				}, 500, 'swing', function() {
					reBADV.emptyAnimate('div#charaWindow');
					$('div#charaWindow').removeAttr('style');
				});
			});
			
			reBADV.registerAnimate('div#background div#back');
			$('div#background div#back').animate({
				'opacity' : '0'
			}, 1500, 'swing', function() {
				reBADV.emptyAnimate('div#background div#back');
				$('div#background div#back').css({
					'background-size' : '200%',
					'background-position' : '50% 100%',
					'background-image' : 'url(' + reBADV.resourceList['images']['cg001'] + ')'
				});
				reBADV.playSFX(0, reBADV.resourceList['audio']['door']);
			});
			
			reBADV.stopBGM(0, true);
			
			return 1600;
		},
		
		14 : function() {
			reBADV.registerAnimate('div#background div#back');
			$('div#background div#back').animate({
				'opacity' : '1'
			}, 3000, 'swing', function() {
				reBADV.emptyAnimate('div#background div#back');
				$('div#background div#front').css({
					'background-image' : $('div#background div#back').css('background-image'),
					'background-position' : '100% 25%',
					'width' : '100%',
					'height' : '100%',
					'opacity': '0'
				});
				
			});
			
			reBADV.playBGM(0, reBADV.resourceList['audio']['bgm2']);
			
			return 3100;
		},
		
		15 : function() {
			$('div#background div#back').animate({
				'background-position' : '70% 25%'
			}, 10000, function() {
				$('div#background div#front').animate({
					'opacity': '1'
				}, 2000, function() {
					$('div#background div#back').css({
						'background-position' : '100% 25%',
						'background-size' : '100%'
					});
					$('div#background div#front').removeAttr('style');
				});
			});
		},
		
		23 : function() {
			reBADV.currentScript = 21;
			return 100;
		}
	};
};

reBADV.start = function() {
	
	reBADV.nextScript();
	
	function userInteraction(e) {
		e.preventDefault();
		if (!reBADV.notInteractable) {
			if (false) { // Ingame Loading Not Complete + Script Blockade
				// Darken screen
			} else if (reBADV.stackedAnimateSize != 0) {
				// Clear Animate
				reBADV.emptyAnimate();
			} else if (reBADV.delayTimer != null && reBADV.afterDelayed != null) {
				clearTimeout(reBADV.delayTimer);
				reBADV.afterDelayed();
			} else if (reBADV.typeWriting) {
				reBADV.typeWriting = false;
			} else if (parseInt($('div#textboxArea').css('opacity')) == 0) {
				$('div#textboxArea').css('opacity', '1');
			} else {
				// Clear Text
				$('div#namebox').html('');
				$('div#text').html('');
				reBADV.hideButton();
				reBADV.nextScript();
			}
		}
	}
	
	// Initialize Input (Prototype)
	$('div#main').bind('mousedown', function(e) {
		if (e.which == 1) {
			// Left Click
			userInteraction(e);
		} else if (e.which == 2) {
			// Right Click?
		}
		return false;
	});
	
	$(document).keydown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		var thisKey = e.which;
		switch (thisKey) {
			case 13: // Enter Key (Next)
				userInteraction(e);
				break;
			case 17: // Control Key (Skip Mode)
				break;
			case 27: // Escape (Menu)
				break;
			case 32: // Space (Hide)
				var opacity = parseInt($('div#textboxArea').css('opacity'));
				opacity++;
				opacity %= 2;
				$('div#textboxArea').css('opacity', opacity);
				break;
			default:
				// consoleLogger(thisKey);
				break;
		}
		return;
	});
	
	var scrollEvent = 'mousewheel';
	if (navigator.userAgent.match(/(Firefox)|(firefox)/i)) {
		scrollEvent = 'DOMMouseScroll';
	}
	$('div#ingame').bind(scrollEvent, function(e) {
		var delta;
		if (scrollEvent == 'mousewheel') {
			delta = e.originalEvent.wheelDelta;
		} else {
			delta = e.originalEvent.detail;
		}
		
		var target = $('div#backlogger');
		if (target.length > 0) {
			// do nothing
		} else {
			reBADV.backlogElement = 'div#backlogger div#messages'
			reBADV.createBacklogUI = function() {
				var newDiv = document.createElement('div');
				newDiv.id = 'backlogger';
				$('div#ingame').append(newDiv);
				
				var newDiv = document.createElement('div');
				newDiv.id = 'blacktint';
				$('div#backlogger').append(newDiv);
				
				var newDiv = document.createElement('div');
				newDiv.id = 'messages';
				$('div#backlogger').append(newDiv);
			};
			
			reBADV.displayBacklog(e);
		}
	});
};
