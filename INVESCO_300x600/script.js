var exitHotspot;
var addFrame;

function registerStudioEvents() {
	Enabler.exit('BACKGROUND_EXIT');
	Enabler.exit('INFORMATION_BACKGROUND_EXIT');
}
//
// ────────────────────────────────────────────────────────── I ──────────
//   :::::: U T I L I T I E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────
//

var Utils = (function () {
	function select(query) {
		var t = document.querySelectorAll(query);
		return t.length === 0 ? false : t.length === 1 ? t[0] : t;
	}

	function triggerEvent(element, eventName, data) {
		var event = new CustomEvent(eventName, { detail: data });
		element.dispatchEvent(event);
	}

	function preloadImages(images, cb) {
		var ctr = 0;
		var total = images.length;

		images.forEach(function (image) {
			preloadImage(image, function () {
				ctr++;
				if (ctr == total) {
					cb();
				}
				// console.log( 'Number of loaded images: ' + ctr );
			});
		});

		function preloadImage(image, cb) {
			var img = new Image();
			img.onload = cb;
			img.src = image;
		}
	}

	function fitText2(textElement) {
		let maxTextHeight = parseFloat(window.getComputedStyle(textElement, null).getPropertyValue('max-height'));
		let textHeight = textElement.scrollHeight;

		let fontSize = window.getComputedStyle(textElement, null).getPropertyValue('font-size');
		let fontSizeNum = parseFloat(fontSize);

		while (textHeight > maxTextHeight && fontSizeNum > 0) {
			fontSizeNum--;
			textElement.style.fontSize = fontSizeNum + 'px';
			textHeight = textElement.scrollHeight;
		}
	}

	/** Dynamically fit the text inside it's own width and height. */
	function fitText(textElement) {
		let containerWidth = textElement.clientWidth;
		let containerHeight = textElement.clientHeight;
		let textWidth = textElement.scrollWidth;
		let textHeight = textElement.scrollHeight;

		let fontSize = window.getComputedStyle(textElement, null).getPropertyValue('font-size');
		let fontSizeNum = parseFloat(fontSize);

		while ((textWidth > containerWidth || textHeight > containerHeight) && fontSizeNum > 0) {
			fontSizeNum--;
			textElement.style.fontSize = fontSizeNum + 'px';
			textWidth = textElement.scrollWidth;
			textHeight = textElement.scrollHeight;
		}
	}

	/**
	 * Dynamically update the exit url with utm variables from the studio snippet.
	 * If the exit url has utm variables already, replace it with the values from the snippet.
	 * If te exit url has no utm variables, add it to the url.
	 */
	function updateURL(exitURL, parameters) {
		// Split the URL into the base and the existing parameters.
		let urlParts = exitURL.split('?');
		let base = urlParts[0];
		let existingParams = urlParts[1] ? urlParts[1].split('&') : [];

		// Convert the existing parameters into a key-value object.
		let paramsObj = {};
		existingParams.forEach((param) => {
			let keyValue = param.split('=');
			paramsObj[keyValue[0]] = keyValue[1];
		});

		// Update the parameter values with the new values from 'parameters'
		Object.keys(parameters).forEach((key) => {
			paramsObj[key] = parameters[key];
		});

		// Convert the updated parameter object back into a URL parameter string
		let updatedParams = Object.keys(paramsObj)
			.map((key) => `${key}=${paramsObj[key]}`)
			.join('&');

		// console.log(Object.keys(paramsObj));

		// Return the updated URL
		return base + '?' + updatedParams;
	}

	function splitTextOnPipe(inputText) {
		addFrame = true; // Initialize addFrame to false
		if (inputText.includes('|')) {
			addFrame = true; // Set addFrame to true if | is found
			var textArray = inputText.split('|');
			var textBefore = textArray[0].trim();
			var textAfter = textArray[1].trim();
			return { textBefore, textAfter, addFrame };
		} else {
			return { text: inputText, addFrame }; // Return addFrame even if there's no |
		}
	}

	return {
		select: select,
		triggerEvent: triggerEvent,
		preloadImages: preloadImages,
		fitText: fitText,
		fitText2: fitText2,
		updateURL: updateURL,
		splitTextOnPipe: splitTextOnPipe,
	};
})();

/*

{borderColor : #ffffff, borderSize : 5px, scaleFrom: 5, transformOrigin: top right, backgroundPosition: top right}

*/

//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: C R E A T I V E   D O M : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
// Setup your creative's DOM access here.
// Use "DOM.get().selectorName" to access the value.
// ie: DOM.get().wrapper;

var DOM = (function () {
	var el = {};

	function init() {
		el.wrapper = Utils.select('.main-wrapper');
		el.bgExit = Utils.select('.background-exit');
		el.disclaimerBtn = Utils.select('.disclaimer-btn-parent');
		el.disclaimerCopyContainer = Utils.select('.disclaimer-copy-container');
		el.disclaimerBtnClose = Utils.select('.disclaimer-close');
		el.frame1Copy = Utils.select('.f1-copy');
		el.frame1CopyParent = Utils.select('.intro-container');
		el.frame1DisclaimerCopy = Utils.select('.disclaimer-1-copy');
		el.frame2DisclaimerCopy = Utils.select('.disclaimer-2-copy');
		el.frame2CopyParent = Utils.select('.mask-div');
		el.frame2Copy = Utils.select('.f2-copy');
		el.frame3Copy = Utils.select('.f3-copy');
		el.frame3Copy2 = Utils.select('.f3-copy-2');

		el.frame3DisclaimerCopy = Utils.select('.disclaimer-3-copy');

		el.frame4Copy1 = Utils.select('.f4-copy-1');
		el.frame4Copy2 = Utils.select('.f4-copy-2');
		el.frame4Copy3 = Utils.select('.f4-copy-3');
		el.frame4DisclaimerCopy = Utils.select('.disclaimer-btn-copy');
		el.frame4DisclaimerOverlayCopy = Utils.select('.disclaimer-copy');

		el.frame1Container = Utils.select('.f1-parent');
		el.frame3Container = Utils.select('.f3-parent');
		el.frame4Container = Utils.select('.f4-parent');
		el.introCrossair = Utils.select('#square-svg');
		el.introImage = Utils.select('.intro-img');
		el.f2Image = Utils.select('.f2-img');
		exitHotspot = Utils.select('.hotspot');
	}

	function get() {
		init();

		return el;
	}

	return {
		get: get,
	};
})();

//
// ──────────────────────────────────────────────────────── I ──────────
//   :::::: C R E A T I V E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
// This is the main entry point of your creative.
// Creative logic, animation, events, and everything to make your creative work.

var Creative = (function () {
	function init() {
		setup();
		addListeners();
	}

	//
	var tl;

	//
	//
	// ───────────────────────────────────────────────────── SETUP DYNAMIC VALUES ─────
	// This is where you assign the dynamic values to your DOM elements.

	//
	// ────────────────────────────────────────────────────── I ──────────
	//   :::::: D Y N A M I C : :  :   :    :     :        :          :
	// ────────────────────────────────────────────────────────────────
	// Dynamic invocation code.
	// Use "Dynamic.get().key" to access the value.
	// ie: var foo = Dynamic.get().ID;

	var Dynamic = (function () {
		var devDynamicContent = {};

		function init() {
			// UK
			//			Enabler.setProfileId(10862231);
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed = [{}];
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0]._id = 0;
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].ID = '1';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Reporting_Label = 'Content_Switzerland_300x250_alternative_ch_en_flower_1';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Template_option = 'flower';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Country = 'Switzerland';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Language = 'ch-en';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Headline1_Copy = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].H1_config = '{"config": {"fontColour": "default", "fontSize": "default", "yPos": "-85", "xPos": "74"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Headline2_Copy = '.';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].H2_config = '{"config": {"fontColour": "default", "fontSize": "32", "yPos": "-3", "xPos": "56"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Headline3_Copy = 'Discover<br> possibilities<br> in global equities';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Headline3_LogoCopy = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].H3_config = '{"config": {"fontColour": "default", "fontSize": "25", "yPos": "-64", "xPos": "32"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Headline4_Copy1 = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].H4_config1 = '{"config": {"fontColour": "default", "fontSize": "25", "yPos": "-83", "xPos": "25"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Headline4_Copy2 = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].H4_config2 = '{"config": {"fontColour": "default", "fontSize": "18", "yPos": "-6", "xPos": "-31"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Headline4_Copy3 = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].H4_config3 = '{"config": {"fontColour": "default", "fontSize": "21", "yPos": "61", "xPos": "-9"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Disclaimer_Heading1 = '<span>For Professional Clients only</span><br>Important information  >';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Disclaimer_Heading2 = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Disclaimer_Heading3 = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Disclaimer_Heading4 = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Disclaimer_Heading_config = '{"config": {"fontColour": "default", "fontSize": "xx", "yPos": "0", "xPos": "0"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Disclaimer_Overlay = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Disclaimer_Overlay_config = '{"config": {"fontColour": "default", "fontSize": "13", "yPos": "0", "xPos": "30"}}';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Exit_URL = {};
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Exit_URL.Url = '';
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Active = true;
			devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0].Default = false;
			//			Enabler.setDevDynamicContent(devDynamicContent);
		}

		function invesConfig() {
			let invesConfig = devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0];

			for (let key in invesConfig) {
				// Check if the value is a JSON string
				try {
					invesConfig[key] = JSON.parse(invesConfig[key]);
				} catch (e) {
					// The value was not a JSON string, so we ignore the error and continue
				}
			}
			return invesConfig;
		}

		function get() {
			return devDynamicContent.Invesco_Valuation_Feed_2023_mainFeed[0];
		}

		return {
			init: init,
			get: get,
			invesConfig: invesConfig,
		};
	})();

	function addListeners() {
		DOM.get().disclaimerBtn.addEventListener('click', function () {
			gsap.set(DOM.get().disclaimerCopyContainer, { autoAlpha: 1 });
			Enabler.counter('information-opened-counter');
		});

		DOM.get().disclaimerBtnClose.addEventListener('click', function () {
			gsap.set(DOM.get().disclaimerCopyContainer, { autoAlpha: 0 });
			Enabler.counter('information-closed-counter');
		});
	}

	// ────────────────────────────────────────────────────────────────────────────────────── I ──────────
	//   :::::: D O U B L E C L I C K   B O I L E R P L A T E : :  :   :    :     :        :          :
	// ────────────────────────────────────────────────────────────────────────────────────────────────
	//

	document.addEventListener('DOMContentLoaded', function () {
		if (Enabler.isInitialized()) {
			enablerInitHandler();
		} else {
			Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
		}

		function enablerInitHandler() {
			if (Enabler.isPageLoaded()) {
				pageLoadedHandler();
			} else {
				Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, pageLoadedHandler);
			}
		}

		function pageLoadedHandler() {
			if (Enabler.isVisible()) {
				adVisibilityHandler();
			} else {
				Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisibilityHandler);
			}
		}

		function adVisibilityHandler() {
			Dynamic.init();
			Creative.init();
			bindEvents();
		}
	});

	var bgScaleUp, bgXpos, bgYpos, f2bgScaleFrom, f2bgXpos, f2BgInitPosX, f2BgInitPosY;

	function setup() {
		//setup values for changing animation settings
		crossHairPositionTop = 287;
		crossHairPositionLeft = 97;
		crossHairScale = 1;
		//bg image scaling up
		bgScaleUp = 16;
		bgXpos = 600;
		bgYpos = 0;
		//f2 bg values
		f2bgScaleFrom = 1.3;
		f2bgFinalPosX = 0;
		f2bgFinalPosY = 0;
		f2BgInitPosX = 0;
		f2BgInitPosY = 0;
		f2bgXpos = 0;
		//image location

		//set position of crossair

		//change intro values
		//fixed values
		introImg = 'images/rocks_lg.jpg';
		//		introImg = "images/intro-valuation.jpg";
		f2Img = 'images/f2-valuation-bg.jpg';

		// DOM.get().frame1CopyParent.style.height = 545 + "px";
		// DOM.get().frame1Copy.style.paddingBottom = 233 + "px";

		//change properties
		gsap.set(DOM.get().introCrossair, { top: crossHairPositionTop + 'px', left: crossHairPositionLeft + 'px', scale: crossHairScale });
		gsap.set(DOM.get().f2Image, { x: f2BgInitPosX, y: f2BgInitPosY });
		gsap.set(['.f4-parent', '.f3-parent'], { autoAlpha: 0 });
		gsap.set(DOM.get().disclaimerCopyContainer, { autoAlpha: 0 });
		DOM.get().introImage.src = introImg;
		DOM.get().f2Image.src = f2Img;

		//dynamic copy and settings
		// frame 1
		//copy
		// DOM.get().frame1Copy.innerHTML = Dynamic.get().Headline1_Copy;
		// DOM.get().frame1DisclaimerCopy.innerHTML = Dynamic.get().Disclaimer_Heading1;
		//config
		DOM.get().frame1Copy.style.color = Dynamic.invesConfig().H1_config.config.fontColour;
		DOM.get().frame1Copy.style.fontSize = Dynamic.invesConfig().H1_config.config.fontSize + 'px';

		gsap.set(DOM.get().frame1Copy, { x: Dynamic.invesConfig().H1_config.config.xPos, y: Dynamic.invesConfig().H1_config.config.yPos });

		DOM.get().frame1DisclaimerCopy.style.color = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontColour1;
		DOM.get().frame1DisclaimerCopy.style.fontSize = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontSize + 'px';
		gsap.set(DOM.get().frame1DisclaimerCopy, { x: Dynamic.invesConfig().Disclaimer_Heading_config.config.xPos, y: Dynamic.invesConfig().Disclaimer_Heading_config.config.yPos });

		//frame 2
		// //copy
		// DOM.get().frame2Copy.innerHTML = Dynamic.get().Headline2_Copy;
		// DOM.get().frame2DisclaimerCopy.innerHTML = Dynamic.get().Disclaimer_Heading2;

		//config
		DOM.get().frame2Copy.style.color = Dynamic.invesConfig().H2_config.config.fontColour;
		DOM.get().frame2Copy.style.fontSize = Dynamic.invesConfig().H2_config.config.fontSize + 'px';
		DOM.get().frame2Copy.style.backgroundColor = Dynamic.invesConfig().H2_config.config.backgroundColor;
		gsap.set(DOM.get().frame2CopyParent, { x: Dynamic.invesConfig().H2_config.config.xPos, y: Dynamic.invesConfig().H2_config.config.yPos });

		DOM.get().frame2DisclaimerCopy.style.color = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontColour2;
		DOM.get().frame2DisclaimerCopy.style.fontSize = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontSize + 'px';
		gsap.set(DOM.get().frame2DisclaimerCopy, { x: Dynamic.invesConfig().Disclaimer_Heading_config.config.xPos, y: Dynamic.invesConfig().Disclaimer_Heading_config.config.yPos });

		// frame 3
		//copy
		// DOM.get().frame3Copy.innerHTML = Dynamic.get().Headline3_Copy;
		//		DOM.get().frame3LogoCopy.innerHTML = Dynamic.get().Headline3_LogoCopy;
		// DOM.get().frame3DisclaimerCopy.innerHTML = Dynamic.get().Disclaimer_Heading3;
		//config
		DOM.get().frame3Copy.style.color = Dynamic.invesConfig().H3_config.config.fontColour;
		// DOM.get().frame3Copy.style.fontSize = Dynamic.invesConfig().H3_config.config.fontSize + "px";
		// DOM.get().frame3Copy2.style.fontSize = Dynamic.invesConfig().H3_config.config.fontSize + "px";
		// gsap.set(DOM.get().frame3Copy, { x: Dynamic.invesConfig().H3_config.config.xPos, y: Dynamic.invesConfig().H3_config.config.yPos });
		// gsap.set(DOM.get().frame3Copy2, { x: Dynamic.invesConfig().H3_config.config.xPos, y: Dynamic.invesConfig().H3_config.config.yPos });
		//disclaimer config
		DOM.get().frame3DisclaimerCopy.style.color = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontColour3;
		DOM.get().frame3DisclaimerCopy.style.fontSize = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontSize + 'px';
		gsap.set(DOM.get().frame3DisclaimerCopy, { x: Dynamic.invesConfig().Disclaimer_Heading_config.config.xPos, y: Dynamic.invesConfig().Disclaimer_Heading_config.config.yPos });

		//check if there is open pipe
		// var inputText = Dynamic.get().Headline3_Copy;
		// var result = Utils.splitTextOnPipe(inputText);

		// if (result.addFrame) {
		// 	// Check if addFrame is true
		// 	console.log('Text before: ' + result.textBefore);
		// 	console.log('Text after: ' + result.textAfter);
		// 	DOM.get().frame3Copy.innerHTML = result.textBefore;
		// 	DOM.get().frame3Copy2.innerHTML = result.textAfter;
		// 	addFrame = true;
		// } else {
		// 	//			console.log("No | found in the input text.");
		// 	addFrame = false;
		// }

		//frame 4
		//copy
		// DOM.get().frame4Copy1.innerHTML =  Dynamic.get().Headline4_Copy1;
		// DOM.get().frame4Copy2.innerHTML = Dynamic.get().Headline4_Copy2;
		// DOM.get().frame4Copy3.innerHTML = Dynamic.get().Headline4_Copy3;
		// DOM.get().frame4DisclaimerCopy.innerHTML = Dynamic.get().Disclaimer_Heading4;

		//frame 4 copy1 config
		DOM.get().frame4Copy1.style.color = Dynamic.invesConfig().H4_config1.config.fontColour;
		DOM.get().frame4Copy1.style.fontSize = Dynamic.invesConfig().H4_config1.config.fontSize + 'px';
		// gsap.set(DOM.get().frame4Copy1, { x: Dynamic.invesConfig().H4_config1.config.xPos, y: Dynamic.invesConfig().H4_config1.config.yPos });
		//frame 4 copy2 cofnig
		DOM.get().frame4Copy2.style.color = Dynamic.invesConfig().H4_config2.config.fontColour;
		DOM.get().frame4Copy2.style.fontSize = Dynamic.invesConfig().H4_config2.config.fontSize + 'px';
		DOM.get().frame4Copy2.style.backgroundColor = Dynamic.invesConfig().H4_config2.config.backgroundColor;
		gsap.set(DOM.get().frame4Copy2, { x: Dynamic.invesConfig().H4_config2.config.xPos, y: Dynamic.invesConfig().H4_config2.config.yPos });
		//frame 4 copy3 config
		DOM.get().frame4Copy3.style.color = Dynamic.invesConfig().H4_config3.config.fontColour;
		DOM.get().frame4Copy3.style.fontSize = Dynamic.invesConfig().H4_config3.config.fontSize + 'px';
		gsap.set(DOM.get().frame4Copy3, { x: Dynamic.invesConfig().H4_config3.config.xPos, y: Dynamic.invesConfig().H4_config3.config.yPos });
		//frame 4 disclaimer config
		DOM.get().frame4DisclaimerCopy.style.color = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontColour4;
		DOM.get().frame4DisclaimerCopy.style.fontSize = Dynamic.invesConfig().Disclaimer_Heading_config.config.fontSize + 'px';
		gsap.set(DOM.get().frame4DisclaimerCopy, { x: Dynamic.invesConfig().Disclaimer_Heading_config.config.xPos3, y: Dynamic.invesConfig().Disclaimer_Heading_config.config.yPos3 });

		//Frame overlay
		// DOM.get().frame4DisclaimerOverlayCopy.innerHTML = Dynamic.get().Disclaimer_Overlay;
		DOM.get().frame4DisclaimerOverlayCopy.style.color = Dynamic.invesConfig().Disclaimer_Overlay_config.config.fontColour;
		DOM.get().frame4DisclaimerOverlayCopy.style.fontSize = Dynamic.invesConfig().Disclaimer_Overlay_config.config.fontSize + 'px';
		gsap.set(DOM.get().frame4DisclaimerOverlayCopy, { x: Dynamic.invesConfig().Disclaimer_Overlay_config.config.xPos, y: Dynamic.invesConfig().Disclaimer_Overlay_config.config.yPos });
		/*
		// Autofit Copy
		Utils.fitText(DOM.get().frame4Copy3);
		Utils.fitText(DOM.get().frame4Copy2);
		Utils.fitText(DOM.get().frame3Copy2);
		Utils.fitText(DOM.get().frame3Copy);
		Utils.fitText(DOM.get().frame2Copy);
		Utils.fitText2(DOM.get().frame1Copy);//height based auto resizing
		Utils.fitText(DOM.get().frame4DisclaimerOverlayCopy);
		*/

		/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** */

		// SET TEXT POSITIONS
		setTimeout(function () {
			animate();
		}, 600);
	}

	//
	// ──────────────────────────────────────────────────────────────── ANIMATION ─────
	// This is where you'll place all animation related code.

	function animate() {
		//
		gsap.set(DOM.get().wrapper, { opacity: 1 });

		//select element for zooming image
		const bgImage = document.querySelector('.f1-parent');
		const f1Copy = document.querySelector('.f1-copy');
		const maskDiv = document.querySelector('.mask-div');
		const f2Bg = document.querySelector('.f2-bg');
		const f2CTA = document.querySelector('.f4-copy-2');
		const f1Disclaimer = document.querySelector('.disclaimer-1-copy');
		const f2Disclaimer = document.querySelector('.disclaimer-2-copy');

		// mask div values
		const initialWidth = 0;
		const finalWidth = maskDiv.offsetWidth + 0;
		gsap.set(maskDiv, { width: 0 });

		// animated line
		// Define the square outline and fill elements
		const squareOutline = document.querySelector('#Rectangle_1 rect');
		const squareFill = document.querySelector('#Rectangle_1 rect + rect');
		const groupLines = document.querySelectorAll('#Line_2, #Line_1');
		gsap.set(groupLines, { drawSVG: '0%' });

		// Set initial values for elements
		gsap.set([squareOutline, squareFill], { drawSVG: '0%' });
		gsap.set(DOM.get().frame3Copy2, { autoAlpha: 0, display: 'none' });

		// Create the animation timeline
		const tl = gsap.timeline({ repeat: 0 });

		// Animate square outline and fill to reveal the square
		tl.set([f2Bg, f2Disclaimer], { opacity: 0, filter: 'blur(3px)' });
		tl.to([squareOutline, squareFill], { duration: 2, drawSVG: '100%', ease: 'power1.inOut' })
			.to(f1Disclaimer, { opacity: 0, ease: 'power1.inOut' })
			.to(groupLines, { duration: 0.2, drawSVG: '100%', stagger: 0.2 })
			.to(groupLines, { duration: 1 })
			.to([f1Copy], { duration: 0.5, opacity: 0, ease: 'power1.inOut' })
			.to(bgImage, { scale: bgScaleUp, x: bgXpos, y: bgYpos, duration: 0.7, filter: 'blur(3px)', ease: 'Power3.easeInOut' })
			.to([f2Bg], { opacity: 1, duration: 0.7, filter: 'blur(0px)', ease: 'Power3.easeInOut' }, '-=.3')
			.from(f2Bg, 5, { scale: f2bgScaleFrom, x: f2bgXpos, ease: 'Power1.easeIn' }, '<')
			.from('.copy-bottom-left', { opacity: 0, duration: 1 }, '<')
			.to(maskDiv, { width: finalWidth, duration: 1, ease: 'Power3.easeInOut', delay: 0.7 }, '<')
			//Frame3
			.to(DOM.get().frame3Container, { autoAlpha: 1, duration: 1, ease: 'Power3.easeOut' })
			.from(DOM.get().frame3Copy, { autoAlpha: 0, duration: 1 }, '-=.5');
			// tl.to(DOM.get().frame3Copy, { autoAlpha: 0, display: 'none', duration: 1 }, '+=2');
			tl.to(DOM.get().frame4Container, { autoAlpha: 1, duration: 1, ease: 'Power3.easeOut' }, '+=2' )
			.to(f2CTA, { duration: 0.5 })
			.to(f2CTA, { duration: 0.8, color: '#000AD2', backgroundColor: '#cffaff', borderColor: '#cffaff', ease: 'Power1.easeOut' });
		// Play the animation
		tl.play();
		// tl.seek(15)
	}
	/* - -- - - - - -- -- - - - - -- -- - - - - -- -- - - - - -- -- - - - - -- -- - - - - -- -- - - - - -- -- - - - - -*/

	function bindEvents() {
		exitHotspot.forEach((hotspot) => {
			hotspot.addEventListener('click', (e) => {
				let label = e.currentTarget.getAttribute('data-reporting-label');

				switch (label) {
					case 'BACKGROUND_EXIT':
						// console.log("1")
						// Enabler.exitOverride(label, Dynamic.SF().a1_Exit.Url);
						Enabler.exit(label);
						// Enabler.exitOverride(label, Dynamic.get().Exit_URL.Url);
						break;
					case 'INFORMATION_BACKGROUND_EXIT':
						// console.log("2")
						// Enabler.exitOverride(label, Dynamic.SF().a1_Exit.Url);
						Enabler.exitOverride(label);
						// Enabler.exitOverride(label, Dynamic.get().Exit_URL.Url);
						break;
				}
			});
		});
	}

	//
	return {
		init: init,
	};
})();

//
// ────────────────────────────────────────────────────────── I ──────────
//   :::::: U T I L I T I E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────
//
