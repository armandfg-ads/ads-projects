// ─────────────────────────────────────────────────────────────────────────────
// ─── GSAP PLUGINS ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
gsap.registerPlugin(Draggable) 
gsap.registerPlugin(InertiaPlugin) 

// ─────────────────────────────────────────────────────────────────────────────
// ─── Doubleclick Boilerplate ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
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
		creative.init();
	}
});

// ─────────────────────────────────────────────────────────────────────────────
// ─── Creative Initialization ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var creative = (function () {
	var _this = {};

	_this.init = function () {
		// ─── 1. Snippet Initialization ───────────────────────────────
		snippet.init();

		// ─── 2. Adtech Library Initialization ────────────────────────
		adTech.init();
		// ─── 2.2 Dog Params ───────────────────────────────────
		dogParams.init();
		// ─── 3. Data Mapping Initialization ──────────────────────────
		mapData.init();

		// ─── 4. Asset Preloading ─────────────────────────────────────
		var assets = [snippet.SF.a1_topLogo__img.Url, snippet.SF.a1_petSize_1__img.Url, snippet.SF.a1_petSize_2__img.Url, snippet.SF.a1_petSize_3__img.Url];

		// ─── 5. Creative Animation ───────────────────────────────────
		adTech.preloadImages(assets, animation.init);

		// animation.init();
		
		// ─── 5. Creative Slider ───────────────────────────────────
		dogSlider.init();
		// ─── 6. CLICK interactions ───────────────────────────────────

		userInteractions.init();
		// creativeTimer.init();
		// Uncomment this line to log all exit reporting labels to the console for review.
		// adTech.logReportingLabels();
	};

	return _this;
})();


// ─────────────────────────────────────────────────────────────────────────────
// ─── Creative Timer for non interaction ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var creativeTimer = (function () {
	var _this = {};

	

	_this.init = function () {
		_this.timer;
		_this.userInteracted = false;
		_this.autoPlayCounterChange = false;
		_this.currentFrame = 1;
		creativeTimer.startTimer();
	};

	// ─── PAUSE TIMER ───────────────────────────────────────────────
	
	_this.resetTimer = function () {
		console.log("ResetTimer");
		_this.userInteracted = false;
		_this.autoPlayCounterChange = true;
		clearTimeout(_this.timer);
		creativeTimer.startTimer();
		
	};

	_this.pauseTimer = function () {
		_this.userInteracted = true;
		_this.autoPlayCounterChange = true;
		clearTimeout(_this.timer);
		gsap.killTweensOf(".slider-knob");
		gsap.to(".slider-knob", { scale: 1, duration: 0.1 });

		console.log("pausedTimer");
	};

	// ─── START TIMER ───────────────────────────────────────────────
	_this.startTimer = function () {
		//switch to true for testing
			// _this.userInteracted = true;
		//
		_this.countdownDuration = snippet.SF.a0_waitingTime__number; 
		console.log("start timer");
		clearTimeout(_this.timer);
		// Set up the timer
		_this.timer = setTimeout(() => {
		  if (!_this.userInteracted) {
			// Call the function when the timer reaches 10 seconds without interaction
			onTimerEnd();
		  }
		}, _this.countdownDuration);

		function loadDefaultValues() {
			function getObjectByValue(objects, property, value) {
				return Object.values(objects).find(obj => obj[property] === value);
			  }
			let defaultPackageDetails= getObjectByValue(snippet.HF, "package_icon_text", "Taste")

			//ICON and Text
			dogParams.dog_user_choose.age = "age2"
			adTech.elem(".frame3 .package-label-icon").style.backgroundImage = `url(${defaultPackageDetails.package_icon.Url})`;
			adTech.elem(".frame3 .package-label-bottom p").innerHTML = defaultPackageDetails.package_icon_text;
			
			// Function to be called when the timer reaches 10 seconds without interaction;
			adTech.updClass(`.frame3 .package-image {background-image:url(${dogParams.package_image['medium']})}`);
			//update position for medium
			adTech.updClass(`.frame3 .promotion {top:58px;}`);
			adTech.updClass(`.frame3 .package-label {top: 178px; left: 125px;}`);

			//gender defaults
			var obj =  JSON.parse(snippet.SF.a0_petGender__json);
			adTech.elem(".frame3 .package-label-top p").innerHTML = obj['none-gender'].name;
			adTech.elem(".frame3 .headline p").innerHTML = (snippet.SF.a3_headline__text).replace("[gender]", obj['none-gender'].headlineText)
			

		}
		function onTimerEnd() {
			loadDefaultValues();
		
			// snippet.SF.package_icon_text
			animation.frame3(new gsap.timeline(), 2, 15);
			if (!_this.autoPlayCounterChange) {
				Enabler.counter("no_action_autoplay")
			} else {
				Enabler.counter("no_complete_autoplay")
			}
			console.log("Timer ended. No user interaction.");
		  } 
	};
	

	return _this;
})();


// ─────────────────────────────────────────────────────────────────────────────
// ─── Start Slider ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var dogSlider = (function () {
	var _this = {};
	_this.init = function () {
		// --
		// CHANGE VALUE OF DOG SIZE/BREED Selection 
		_this.dogBreed = "small";

		let currentSelectedItem = 1; // Initialize with the default selected item
		let isAnimating = false; // Flag to track whether an animation is in progress
		let introRemove = false;
		var knobClicked = false;
		gsap.set('body .item .dog-scaler', { scale: 0, opacity: 0 });
		gsap.set('body .item-1 .dog-scaler', { scale: .8, opacity: 1, y: 19 });
		gsap.set('body .item .headline-dog-size', { opacity: 0 });
		gsap.set('body .item-1 .headline-dog-size', { opacity: 1 });

		// Frame 1 headline present - if dog changed via slider, it will hide and never show again
		adTech.addClass(adTech.elem('body .item-1 .headline-dog-size'), 'headline-dog-size-intro');
		
		function showDog(point) {
			if (isAnimating || point === currentSelectedItem) {
				// If an animation is already in progress or the requested item is already selected, do nothing
				return;
			}
		
			// Set the flag to true to indicate that an animation is starting
			isAnimating = true;
		
			// Choose the corresponding item and dog container
			const currentItem = document.querySelector(`.item.item-${point}`);
			const currentDogContainer = currentItem.querySelector('.dog-scaler');
			const currentHeadline = currentItem.querySelector('.headline-dog-size');
		
			// Remove the 'animated' class from all dog containers and headlines
			document.querySelectorAll('.dog-scaler').forEach(dog => dog.classList.remove('animated'));
			document.querySelectorAll('.headline-dog-size').forEach(headline => headline.classList.remove('animated'));
			// Animate out the current dog and headline
			if (!introRemove) {
				gsap.to('.headline-question-1', { opacity: 0, duration: 0.3, ease: 'power2.out', onComplete: function () {
					adTech.removeClass(adTech.elem('body .item-1 .headline-dog-size'), 'headline-dog-size-intro');
				} });
				introRemove = true;
			}

			gsap.to('body .dog-scaler', { scale: 0, opacity: 0, y: 0, duration: 0.3, ease: 'power2.out' });
			gsap.to('body .headline-dog-size', { opacity: 0, duration: 0.3, ease: 'power2.out' });
			// Animate in the selected item
			gsap.fromTo(
				currentDogContainer,
				{ scale: 0 },
				{ scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.2 }
			);
			gsap.fromTo(
				currentHeadline,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.2,
					onComplete: () => {
						// Update the current selected item
						currentSelectedItem = point;
						// Set the flag back to false once the animation is complete
						isAnimating = false;
						// Recheck the current point after the animation is complete
						updateOnPercentage();
					}
				}
			);
		}


		//SLIDER BAR
		const containerWidth = document.querySelector(".slider-parent").clientWidth;
		let progressBarWidth = 0;
		let percentage;
		let targetPoint;
		
		function updateProgressBar() {

			const knob = document.querySelector(".slider-knob");
			const knobPosition = gsap.getProperty(knob, "x");

			// Update progress bar width during the drag
			percentage = (knobPosition / containerWidth) * 100;
			progressBarWidth = percentage;
			gsap.to(".slider-progress", { width: `${progressBarWidth}%`, duration: 0.1 });
			// console.log("percent", percentage);
			updateOnPercentage();

		


		}
		
		function updateOnPercentage() {

			if (percentage >= 98) {
				console.log("point 5");
				targetPoint = 5;
				_this.dogBreed = "extraBig";
			
			}
		
			else if (percentage >= 75) {
				// console.log("point 4");
				targetPoint = 4;
				_this.dogBreed = "big";
			
			} else if (percentage >= 50) {
				// console.log("point 3");
				targetPoint = 3;
				_this.dogBreed = "medium";
				
			} else if (percentage >= 25) {
				// console.log("point 2");
				targetPoint = 2;
				_this.dogBreed = "small";
				
			} else if (percentage >= 0) {
				// console.log("point 1");
				targetPoint = 1;
				_this.dogBreed = "extraSmall";
				
			} else {
				// console.log("none");
				return;
			}

			// Animate based on the current target point
			showDog(targetPoint);
		}

		Draggable.create(".slider-knob", {
			type: "x",
			bounds: { minX: 0, maxX: containerWidth }, // Set bounds to avoid exceeding container width
			inertia: true,
			throwResistance: 1000,
			snap: function (value) {
				const percentage = (value / containerWidth) * 100;
				const snapPoints = [0, 25, 50, 75, 100];
				const closestSnapPoint = snapPoints.reduce((prev, curr) =>
					Math.abs(curr - percentage) < Math.abs(prev - percentage) ? curr : prev
				);
				return (closestSnapPoint / 100) * containerWidth;
			},
			onDrag: updateProgressBar,
			onDragStart: function() { creativeTimer.pauseTimer();  },
			onDragEnd: function() {  creativeTimer.resetTimer();  },
			onThrowUpdate: function () {
				updateProgressBar(); // Update progress bar during inertia
			},
			onThrowComplete: function () {
				// Additional callback after inertia is complete (if needed)
			},
			
		});
		// Initialize progress bar
		updateProgressBar();
		
		// ---
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── Dog Params Data ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var dogParams = (function () {
	var _this = {};

	_this.init = function () {

		//search function
		function getObjectByValue(objects, property, value) {
			return Object.values(objects).find(obj => obj[property] === value);
		}
		//
		//Separate params for copy - will not affect user selection but prevent rotations 
		_this.pet_age_1 = getObjectByValue(snippet.HF, "age_code", "age1");
		_this.pet_age_2 = getObjectByValue(snippet.HF, "age_code", "age2");
		_this.pet_age_3 = getObjectByValue(snippet.HF, "age_code", "age3");
		//
		_this.dog_size = JSON.parse(snippet.SF.a1_petSizeText__json);
		_this.dog_gender = JSON.parse(snippet.SF.a0_petGender__json); 
		
		_this.dog_size_text = [];
		_this.dog_size_text[1] = _this.dog_size.extraSmall;
		_this.dog_size_text[2] = _this.dog_size.small;
		_this.dog_size_text[3] = _this.dog_size.medium;
		_this.dog_size_text[4] = _this.dog_size.big;		
		_this.dog_size_text[5] = _this.dog_size.extraBig;		
		
		_this.dog_size_image = [];
		_this.dog_size_image[1] = snippet.SF.a1_petSize_1__img.Url;
		_this.dog_size_image[2] = snippet.SF.a1_petSize_2__img.Url;
		_this.dog_size_image[3] = snippet.SF.a1_petSize_3__img.Url;
		_this.dog_size_image[4] = snippet.SF.a1_petSize_4__img.Url;
		_this.dog_size_image[5] = snippet.SF.a1_petSize_5__img.Url;

		_this.dog_age_text = [];
		_this.dog_age_text[1] = _this.pet_age_1.pet_age;
		_this.dog_age_text[2] = _this.pet_age_2.pet_age;
		_this.dog_age_text[3] = _this.pet_age_3.pet_age;
	

		_this.dog_age_icon = [];
		_this.dog_age_icon['age1'] = _this.pet_age_1.package_icon.Url;
		_this.dog_age_icon['age2'] = _this.pet_age_2.package_icon.Url;
		_this.dog_age_icon['age3'] = _this.pet_age_3.package_icon.Url;
		
		//

		_this.dog_age_icon_text = [];
		_this.dog_age_icon_text['age1'] = _this.pet_age_1.package_icon_text;
		_this.dog_age_icon_text['age2'] = _this.pet_age_2.package_icon_text;
		_this.dog_age_icon_text['age3'] = _this.pet_age_3.package_icon_text;
		
		
		_this.dog_age_image = [];
		_this.dog_age_image[1] = snippet.SF.a2_petAge_1__img.Url;
		_this.dog_age_image[2] = snippet.SF.a2_petAge_2__img.Url;
		_this.dog_age_image[3] = snippet.SF.a2_petAge_3__img.Url;


		_this.package_image = [];
		_this.package_image['extraSmall'] = snippet.PF.product_image_xs.Url;
		_this.package_image['small'] = snippet.PF.product_image_s.Url;
		_this.package_image['medium'] = snippet.PF.product_image_m.Url;
		_this.package_image['big'] = snippet.PF.product_image_l.Url;
		_this.package_image['extraBig'] = snippet.PF.product_image_xl.Url;


		
		_this.dog_default_choose = [];	
		_this.dog_default_choose['size'] = "";
		_this.dog_default_choose['age'] = "";
		_this.dog_default_choose['gender'] = ""	;
		
		_this.dog_user_choose = [];	
		_this.dog_user_choose['size'] = "";
		_this.dog_user_choose['age'] = "";
		_this.dog_user_choose['gender'] = "";
		
	}
	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── Map Dynamic Data ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var mapData = (function () {
	var _this = {};

	_this.init = function () {
	
        // ─── Intro Frame - Preloader ─────────────────────────────────
		// adTech.elem('.preloader').src = snippet.SF.a0_preloader__img.Url;


		// ─── Frame 1 ─────────────────────────────────────────────────
		var frameLabel = '.frame1';

	
		//Mapping logo
		if (adTech.isValidImageUrl(snippet.SF.a1_topLogo__img.Url)) {
			adTech.updClass(`.logo-top {background-image:url(${snippet.SF.a1_topLogo__img.Url})}`);
		}		
		
		//Mapping headline
		adTech.elem(`${frameLabel} .headline p`).innerHTML = snippet.SF.a1_headline__text;
		adTech.updClass(`${frameLabel} .headline {${adTech.jsonToCss(snippet.SF.a1_headline__json)}}`);
		
		
		//Mapping top background
		adTech.updClass(`.bg-top {background-color:${snippet.SF.a1_topBackgroundColor__hex}}`);
				
		//Mapping bottom background
		adTech.updClass(`.bottom-container {background-color:${snippet.SF.a1_bottomBackgroundColor__hex}}`);

		
		//Mapping subline
		adTech.elem(`${frameLabel} .headline-question-1 p`).innerHTML = snippet.SF.a1_subline__text;
		adTech.updClass(`${frameLabel} .headline-question-1 {${adTech.jsonToCss(snippet.SF.a1_subline__json)}}`);
		
		//Mapping question (dog size)
		adTech.elem(`${frameLabel} .headline-question-2 p`).innerHTML =  snippet.SF.a1_question__text;
		adTech.updClass(`${frameLabel} .headline-question-2 {${adTech.jsonToCss(snippet.SF.a1_question__json)}}`);		

		//Mapping slide text (left/right)
		var obj = JSON.parse(snippet.SF.a1_sliderText__json);
		adTech.elem(`${frameLabel} .headline-slider-a p`).innerHTML =  obj.fromSize;
		adTech.elem(`${frameLabel} .headline-slider-b p`).innerHTML =  obj.toSize;
		adTech.updClass(`${frameLabel} .headline-slider-parent {${adTech.jsonToCss(snippet.SF.a1_slider__json)}}`);		

		//Mapping slide object
		var obj = JSON.parse(snippet.SF.a1_slider__json);
		adTech.updClass(`${frameLabel} .slider-bg {background-color: ${obj.slider['background-color']}}`);		
		adTech.updClass(`${frameLabel} .bg_3E4C60 {background-color: ${obj.slider['dragger-color']}}`);		
	

		//Mapping CTA
		adTech.elem(`${frameLabel} .cta-container-a p`).innerHTML =  snippet.SF.a1_cta__text;
		adTech.updClass(`${frameLabel} .cta-container-a {${adTech.jsonToCss(snippet.SF.a1_cta__json)}}`);		



		//Mapping Dog size HTML
		for(var i = 1; i <= 5; i++) {
			adTech.elem(`${frameLabel} .dog-container`).innerHTML += `<div class="item item-${i} abs full-w">
				<div class="headline-dog-size abs center-x">${dogParams.dog_size_text[i]}</div>
					<div class="dog-scaler abs full-w">
					<div class="dog-image abs center-x"><img src="${dogParams.dog_size_image[i]}"></div>
				</div>
			</div>`
		}
		adTech.updClass(`${frameLabel} .headline-dog-size {${adTech.jsonToCss(snippet.SF.a1_petSize__json)}}`);		
		

		// Set CTA data. Accepts 3 parameters: element, reporting label, exit URL, and UTM variables (if true).
		adTech.setCtaData(adTech.elem(`${frameLabel} > .logo-top .overlay`), 'Frame1_logo_clicked', snippet.SF.a1_exitURL__url.Url, true);


		// ─── Frame 2 ─────────────────────────────────────────────────
		var frameLabel = '.frame2';

		//Mapping headline
		adTech.elem(`${frameLabel} .headline p`).innerHTML = snippet.SF.a2_headline__text;
		adTech.updClass(`${frameLabel} .headline {${adTech.jsonToCss(snippet.SF.a2_headline__json)}}`);
		

		//Mapping questions (top/bottom)
		var obj = JSON.parse(snippet.SF.a2_questionText__json);
		adTech.elem(`${frameLabel} .headline-f2-a p`).innerHTML =  obj.q_top;
		adTech.elem(`${frameLabel} .headline-f2-b p`).innerHTML =  obj.q_bottom;
		adTech.updClass(`${frameLabel} .headline-f2 {${adTech.jsonToCss(snippet.SF.a2_question__json)}}`);		


	

		//Mapping Dog age HTML
		for(var i = 1; i <= 3; i++) {
			adTech.elem(`${frameLabel} .icon-images`).innerHTML += `
				<div class="f2-icon icon-item-${i} rel hover-icon hand" data-dog-age="age${i}">
					<div class="icon-img center-x-y"><img src="${dogParams.dog_age_image[i]}"></div>
						<div class="headline-icon abs">
							<p>${dogParams.dog_age_text[i]}</p>
						</div>					
				</div>`
		}
		adTech.updClass(`${frameLabel} .headline-icon {${adTech.jsonToCss(snippet.SF.a2_petAge__json)}}`);		


		//Mapping gender buttons (left/right)
		var obj = JSON.parse(snippet.SF.a2_genderButtonsText__json);
		adTech.elem(`${frameLabel} .gender-select-cta p`)[0].innerHTML =  obj.button_left;
		adTech.elem(`${frameLabel} .gender-select-cta p`)[1].innerHTML =  obj.button_right;
		adTech.updClass(`${frameLabel} .gender-select-cta {${adTech.jsonToCss(snippet.SF.a2_genderButtons__json)}}`);	
		adTech.updClass(`${frameLabel} .gender-select-cta {${adTech.jsonToCss(snippet.SF.a2_genderButtons__json)}}`);	

		//Mapping CTA
		adTech.elem(`${frameLabel} .cta-container-a p`).innerHTML =  snippet.SF.a2_cta__text;
		adTech.updClass(`${frameLabel} .cta-container-a {${adTech.jsonToCss(snippet.SF.a2_cta__json)}}`);	

		// Set CTA data. Accepts 3 parameters: element, reporting label, exit URL, and UTM variables (if true).
		adTech.setCtaData(adTech.elem(`${frameLabel} > .logo-top .overlay`), 'Frame2_logo_clicked', snippet.SF.a1_exitURL__url.Url, true);
	

		// ─── Frame 3 ─────────────────────────────────────────────────
		var frameLabel = '.frame3';

		//Mapping headline
		adTech.updClass(`${frameLabel} .headline {${adTech.jsonToCss(snippet.SF.a3_headline__json)}}`);
		
		
		//Mapping promotion
		if(snippet.PF.product_promo != "") {
			adTech.elem(`${frameLabel} .promotion p`).innerHTML = snippet.PF.product_promo;
			adTech.updClass(`${frameLabel} .promotion {${adTech.jsonToCss(snippet.SF.a3_promotion__json)}}`);
		}

	
		//Mapping package name
		adTech.updClass(`${frameLabel} .package-label-top {${adTech.jsonToCss(snippet.SF.a3_packageName__json)}}`);		
		
		//Mapping icon text
		adTech.updClass(`${frameLabel} .package-label-bottom {${adTech.jsonToCss(snippet.SF.a3_packageIconText__json)}}`);		
				
		//Mapping CTA
		adTech.elem(`${frameLabel} .cta-container-a p`).innerHTML =  snippet.SF.a3_cta__text;
		adTech.updClass(`${frameLabel} .cta-container-a {${adTech.jsonToCss(snippet.SF.a3_cta__json)}}`);	


		// Set CTA data. Accepts 3 parameters: element, reporting label, exit URL, and UTM variables (if true).
		adTech.setCtaData(adTech.elem(`${frameLabel} > .cta-container-a .overlay`), 'Frame3_CTA_clicked', snippet.PF.product_url.Url, true);
		adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame3_background_clicked', snippet.PF.product_url.Url, true);


		// ─── setup EXTRA Helper from feed (CSS and JavaScript) ─────────────────────────────────────────────────
		// Setup Extra Dynamic CSS
		if(snippet.SF.a0_ExtraCss__text) {
			var extraBgStyle = document.createElement('style');
			extraBgStyle.innerHTML = snippet.SF.a0_ExtraCss__text;
			document.head.appendChild(extraBgStyle);
		}	

		// Setup Extra Dynamic CSS
		if(snippet.SF.a0_ExtraJavacript__text) {
			new Function(snippet.SF.a0_ExtraJavacript__text)();
		}


		// KEEP AT THE BOTTOM OF FUNCTION
		// add event listener for all CTA clickable elements with class .overlay
		adTech.elem('body .overlay').forEach((element) => {
			element.addEventListener('click', adTech.exits, false);
		});

	
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── CLICK EVETS ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

var userInteractions = (function () {
	var _this = {};

	_this.init = function () {

		//frame 1 hover properties 
		_this.hoverColor = "#040E2B";
		_this.hoverColorOut = "#FFFFFF";
		
		_this.fontColor1 = JSON.parse(snippet.SF.a1_cta__json).css.color;
		_this.ctaBgColor1 = JSON.parse(snippet.SF.a1_cta__json).css['background-color'];
		_this.fontColor2 = JSON.parse(snippet.SF.a2_cta__json).css.color;
		_this.ctaBgColor2 = JSON.parse(snippet.SF.a2_cta__json).css['background-color'];


		//EVENT LISTENERS
		// have to create separate functions to be able to use removeeventlisteners
		function handleMouseOver() {
			gsap.to(this, { borderColor: _this.hoverColor, duration: 0.3 });
		}
		function handleMouseOut() {
			gsap.to(this, { borderColor: _this.hoverColorOut, duration: 0.3 });
		}

		//Age Icon Hover
		adTech.elem('.f2-icon').forEach(element => {
			// Add event listeners using the named functions
			element.addEventListener('mouseover', handleMouseOver);
			element.addEventListener('mouseout', handleMouseOut);
		});
		//Gender button Hover
		adTech.elem('.gender-select-cta').forEach(element => {
			// Add event listeners using the named functions
			element.addEventListener('mouseover', handleMouseOver);
			element.addEventListener('mouseout', handleMouseOut);
		});

		//Next button hover events
		adTech.addHover(adTech.elem('.cta-container-a')[0], _this.ctaBgColor1, _this.fontColor1);
		adTech.addHover(adTech.elem('.cta-container-a')[1], _this.ctaBgColor2, _this.fontColor2);
		
		

		// interaction for NEXT	 Frame 1
		 adTech.elem('.frame1 .cta-container-a').addEventListener("click", function() {
				dogParams.dog_user_choose["size"] = dogSlider.dogBreed;
				animation.frame2(new gsap.timeline(), 2, 12);
				
				Enabler.counter("frame1_next_clicked");
				Enabler.counter("pet_size_"+dogParams.dog_user_choose.size+"_selected");
				creativeTimer.resetTimer();
				
				console.log(dogParams.dog_user_choose)
		 })
		

		 //Interaction for AGE
		adTech.elem(`.f2-icon`).forEach(icon => {
			icon.addEventListener('click', function() {
				const dogAge = icon.getAttribute('data-dog-age');
			
				adTech.elem('.f2-icon').forEach(element => {
					gsap.to(element, { borderColor: _this.hoverColorOut, duration: 0.3 });
					// Add event listeners using the named functions
					element.addEventListener('mouseover', handleMouseOver);
					element.addEventListener('mouseout', handleMouseOut);
				});
				this.removeEventListener('mouseout', handleMouseOut);
				gsap.to(this, { borderColor: _this.hoverColor, duration: 0.3 });
				creativeTimer.resetTimer();
				switch (dogAge) {
				case 'age1':
					dogParams.dog_user_choose["age"] = "age1";
					console.log(dogParams.dog_user_choose);
					break;
				case 'age2':
					dogParams.dog_user_choose["age"] = "age2";
					console.log(dogParams.dog_user_choose);
					break;
				case 'age3':
					dogParams.dog_user_choose["age"] = "age3";
					console.log(dogParams.dog_user_choose);
					break;
				default:
					// 
				}
			});
		});
			 
		 //Gender Selection
		adTech.elem(`.gender-select-cta`).forEach(icon => {
			icon.addEventListener('click', function() {
				const genderSelect = icon.getAttribute('data-gender-select');

				adTech.elem('.gender-select-cta').forEach(element => {
					gsap.to(element, { borderColor: _this.hoverColorOut, duration: 0.3 });
					// Add event listeners using the named functions
					element.addEventListener('mouseover', handleMouseOver);
					element.addEventListener('mouseout', handleMouseOut);
				});

				gsap.to(this, { borderColor: _this.hoverColor, duration: 0.3 });
				this.removeEventListener('mouseout', handleMouseOut);
				creativeTimer.resetTimer();
				
				switch (genderSelect) {
				case 'male':
					dogParams.dog_user_choose["gender"] = "male";
					console.log(dogParams.dog_user_choose)
					console.log('Selected Male');
					break;
				case 'female':
					dogParams.dog_user_choose["gender"] = "female";
					console.log(dogParams.dog_user_choose)
					console.log('Selected Female');
					break;
				default:
					// Handle logic for other cases when clicked
				}
			});
		});

// interaction for NEXT	 Frame 2 - Going to end frame 
		 adTech.elem('.frame2 .cta-container-a').addEventListener("click", function() {

				if(dogParams.dog_user_choose.age != "" && dogParams.dog_user_choose.gender != "") {
					Enabler.counter("frame2_next_clicked");
					Enabler.counter("pet_"+dogParams.dog_user_choose.age+"_selected");
					Enabler.counter("pet_gender_"+dogParams.dog_user_choose.gender+"_selected");
					
					
					var obj =  JSON.parse(snippet.SF.a0_petGender__json);
					if(dogParams.dog_user_choose.gender != "") {
							adTech.elem(".frame3 .package-label-top p").innerHTML = obj[dogParams.dog_user_choose.gender].name;
							adTech.elem(".frame3 .headline p").innerHTML = (snippet.SF.a3_headline__text).replace("[gender]", obj[dogParams.dog_user_choose.gender].headlineText)
					}

					if(dogParams.dog_user_choose.age != "") {
							adTech.elem(".frame3 .package-label-icon").style.backgroundImage = `url(${dogParams.dog_age_icon[dogParams.dog_user_choose.age]})`;
							adTech.elem(".frame3 .package-label-bottom p").innerHTML = dogParams.dog_age_icon_text[dogParams.dog_user_choose.age]
					}				

					adTech.updClass(`.frame3 .package-image {background-image:url(${dogParams.package_image[dogParams.dog_user_choose.size]})}`);
					
					switch(dogParams.dog_user_choose.size) {
						case "extraSmall":
							adTech.updClass(`.frame3 .promotion {top:78px;}`);
							adTech.updClass(`.frame3 .package-label {top: 204px;}`);
							
							break;
						case "small":
							adTech.updClass(`.frame3 .promotion {top:78px;}`);
							adTech.updClass(`.frame3 .package-label {top: 204px;}`);
							
							break;
						case "medium":
							adTech.updClass(`.frame3 .promotion {top:58px;}`);
							adTech.updClass(`.frame3 .package-label {top: 177px; left: 125px;}`);
									
							break;
						case "big":
							adTech.updClass(`.frame3 .promotion {top:28px;}`);	
							adTech.updClass(`.frame3 .package-label {top: 166px; left: 125px;}`);
							
							break;	
						case "extraBig":
							adTech.updClass(`.frame3 .promotion {top:7px;}`);
							adTech.updClass(`.frame3 .package-label {top: 146px; left: 125px;}`);

							break;	
						default:
							break;
					}
					animation.frame3(new gsap.timeline(), 2, 13);
					console.log("selection complete");
					creativeTimer.pauseTimer();
					// package setup
				} else {
					// console.log("Selection incomplete");
					// console.debug("missing information about pet")
					promptMissingData();
				}
				
				console.log(dogParams.dog_user_choose)
		 })		 
		 
		 
		 function promptMissingData() {
				 
			 if (dogParams.dog_user_choose.age == "" && dogParams.dog_user_choose.gender == "") {
				 console.log("gender and age missing");
				
				 gsap.to('.f2-icon', { scale: 1.05, repeat:3,borderColor: "red", duration: 0.1, yoyo: true });
				 gsap.to('.gender-select-cta', { scale: 1.08,borderColor: "red", repeat:3, duration: 0.1, yoyo: true });
			 }
			 else if (dogParams.dog_user_choose.age == "") {
				 console.log(" age missing")
				 gsap.to('.f2-icon', { scale: 1.05, repeat:3,borderColor: "red", duration: 0.1, yoyo: true });
			 }
			 else if (dogParams.dog_user_choose.gender == "") {
				console.log(" gender missing")
				gsap.to('.gender-select-cta', { scale: 1.08,borderColor: "red", repeat:3, duration: 0.1, yoyo: true });
			 }
			 else {

			 }
			 
			 creativeTimer.resetTimer();


		 }

	};

	return _this;
})();


// ─────────────────────────────────────────────────────────────────────────────
// ─── Creative Animation ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var animation = (function () {
	var _this = {};
	
	_this.init = function () {
		// Configure animation timeline
		var tl = gsap.timeline(); // GSAP master timeline
		var displayTime = 2; // The the display time of each frame in seconds
		var zIndex = 10; // Ensures the animating frame is the top most frame
	
		/**
		 * The animation per frame is dynamic.
		 * Arrange them in the order you want them to play.
		 */
		 _this.frame0(tl, displayTime, zIndex++);
		 _this.frame1(tl, displayTime, zIndex++);
		// _this.frame2(tl, displayTime, zIndex++);
		// _this.frame3(tl, displayTime, zIndex++);
	};

	// ─── Frame 0 Animation ───────────────────────────────────────────────
	_this.frame0 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame0';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 1 Animation ───────────────────────────────────────────────
	_this.frame1 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame1';
		tl.set(frameLabel, { zIndex: zIndex });
		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });
		 tl.fromTo(frameLabel + ' .headline', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '-=0.3');
		 tl.fromTo(frameLabel + ' .bottom-container', { y: 500, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '-=0.3');
		 tl.fromTo(frameLabel + ' .headline-question-1', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '-=0.3');
		 tl.fromTo(frameLabel + ' .headline-question-2', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '-=0.3');
		
		tl.fromTo(frameLabel + ' .item-1 .headline-dog-size', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });
		tl.fromTo(frameLabel + ' .slider-parent', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '<');
		tl.fromTo(frameLabel + ' .headline-slider-a', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '<');
		tl.fromTo(frameLabel + ' .headline-slider-b', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '<');
		tl.fromTo(frameLabel + ' .slider-knob', { scale: 1}, { scale: 1.5, repeat: -1, yoyo: true }, '<');

		tl.fromTo(frameLabel + ' .cta-container-a', { y: 21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });
		// tl.fromTo(frameLabel + ' .cta-container-a', { y: 21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });
		tl.call(function() { 
			if (!creativeTimer.userInteracted) {
				creativeTimer.init(); 
			}
		});


		
	};

	// ─── Frame 2 Animation ───────────────────────────────────────────────
	_this.frame2 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame2';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });
		
		 tl.fromTo(frameLabel + ' .headline', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });		
		 tl.fromTo(frameLabel + ' .headline-f2-a', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '-=0.3');		
		 tl.fromTo(frameLabel + ' .f2-icon', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger:0.3 }, '-=0.3');		
		
		 tl.fromTo(frameLabel + ' .headline-f2-b', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });		
		 tl.fromTo(frameLabel + ' .gender-cta-container > div', { y: 21, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger:0.3});		
		
		tl.fromTo(frameLabel + ' .cta-container-a', { y: 21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });
		tl.call(function() { 
			if (!creativeTimer.userInteracted) {
				creativeTimer.resetTimer(); 
			}
		});
		creativeTimer.currentFrame = 2;
	};

	// ─── Frame 3 Animation ───────────────────────────────────────────────
	_this.frame3 = function (tl, displayTime, zIndex, size) {
		var frameLabel = '.frame3';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });
		tl.fromTo(frameLabel + ' .headline', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });		
		tl.fromTo(frameLabel + ' .promotion', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: "elastic.out(1, 0.5)", duration: 2 });		
		// tl.fromTo(adTech.elem('.package-image img'), { autoAlpha: 0 }, { autoAlpha: 0 });
		gsap.killTweensOf(".slider-knob");

		// Your frame animation goes here.
/* 		if(dogParams.dog_user_choose.size == "small") {
			tl.to(adTech.elem('.package-image .img-1'), { autoAlpha: 1 });
			tl.fromTo(adTech.elem('.promotion'), { top:'78px', autoAlpha: 0, y: -30 }, {top:'78px', autoAlpha: 1 , y:0});
		} */
		//tl.fromTo(frameLabel+" img", { autoAlpha: 0 }, { autoAlpha: 0 });
	

	};

	

	

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── For Studio Setup Onplay. Do Not Run! ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function studioExitsTmp() {
	Enabler.exit("Frame1_logo_clicked");
	Enabler.exit("Frame2_logo_clicked");
	Enabler.exit("Frame3_background_clicked");
	Enabler.exit("Frame3_CTA_clicked");

	Enabler.counter("pet_size_extraSmall_selected");
	Enabler.counter("pet_size_small_selected");
	Enabler.counter("pet_size_medium_selected");
	Enabler.counter("pet_size_big_selected");
	Enabler.counter("pet_size_extraBig_selected");

	Enabler.counter("pet_age1_selected");
	Enabler.counter("pet_age2_selected");
	Enabler.counter("pet_age3_selected");

	Enabler.counter("pet_gender_male_selected");
	Enabler.counter("pet_gender_female_selected");

	Enabler.counter("no_action_autoplay");
	Enabler.counter("no_complete_autoplay");

}



