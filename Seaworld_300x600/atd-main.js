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
				// ─── 1. Snippet Initialization ───────────────────────────────
				snippet.init();

				// ─── 2. Adtech Library Initialization ────────────────────────
				adTech.init();
		
				// ─── 3. Data Mapping Initialization ──────────────────────────
				generateThumb.init();
				mapData.init();
				
				addEvents.init();
				
				// ─── 4. Asset Preloading ─────────────────────────────────────
				var assets = [
					snippet.SF.a1_logo__img.Url,
					snippet.SF.a1_background__img.Url,
					snippet.HF[0].image.Url,
					snippet.HF[1].image.Url,
					snippet.HF[2].image.Url,
					snippet.HF[3].image.Url,
					snippet.HF[4].image.Url,
					snippet.PF[0].image.Url,
					snippet.PF[1].image.Url,
					snippet.PF[2].image.Url,
					snippet.PF[3].image.Url,
					snippet.PF[4].image.Url,
				];
			
				// ─── 5. Creative Animation ───────────────────────────────────
				// adTech.preloadImages(assets, animation.init);
				adTech.preloadImages(assets, () => {
					animation.init({ displayTime: 1.5 });
		
					// Hide preloader
					gsap.fromTo('.frame0', { autoAlpha: 1 }, { autoAlpha: 0 });
				});
				// ─── 6. User Interactions ───────────────────────────────────

		
				// Uncomment this line to log all exit reporting labels to the console for review.
				// adTech.logReportingLabels();
	};

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
		// Map data to dynamic elements - Frame 1
		var frameLabel = '.frame1';

		//Mapping image
		adTech.updClass(`${frameLabel} .bg-image {background-image:url(${snippet.SF.a1_background__img.Url})}`);
		adTech.elem(`${frameLabel} .logo img`).src = snippet.SF.a1_logo__img.Url;
	
		adTech.elem(`${frameLabel} .headline-1`).innerHTML = snippet.SF.a1_headline__text;
		adTech.elem(`${frameLabel} .headline-1`).style.cssText = adTech.jsonToCss(snippet.SF.a1_headline__json);

		adTech.elem(`${frameLabel} .headline-2`).innerHTML = snippet.SF.a1_subline__text;
		adTech.elem(`${frameLabel} .headline-2`).style.cssText = adTech.jsonToCss(snippet.SF.a1_subline__json);

		// ─── Set Cta Data ────────────────────────────────────────────
		// Accepts 1 parameters: element, reporting label, exit URL, and UTM variables (if true).
		adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame1_background_clicked', snippet.SF.a1_mainExit__url.Url, true);
		



		// ─────────────────────────────────────────────────────────────
		// Map data to dynamic elements - Frame 2
		// Category done in generateTHumb function
		var frameLabel = '.frame2';

		adTech.elem(`${frameLabel} .logo img`).src = snippet.SF.a1_logo__img.Url;

		adTech.elem(`${frameLabel} .headline`).innerHTML = snippet.SF.a2_headline__text;
		adTech.elem(`${frameLabel} .headline`).style.cssText = adTech.jsonToCss(snippet.SF.a2_headline__json);

		adTech.elem('.thumb-headline').forEach(function (element) {
			element.style.cssText = adTech.jsonToCss(snippet.SF.a2_categoryTitle__json);
		});

		adTech.setCtaData(adTech.elem(`${frameLabel} .logo-parent > .overlay`), 'Frame2_logo_clicked', snippet.SF.a1_mainExit__url.Url, true);
		adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame2_background_clicked', snippet.SF.a1_mainExit__url.Url, true);
		adTech.setCtaData(adTech.elem(`${frameLabel} .thumbnail-container > .overlay`), 'Frame2_background_clicked', snippet.SF.a1_mainExit__url.Url, true);


		// ─────────────────────────────────────────────────────────────
		// Map data to dynamic elements - Frame 3
		// End frame done in showProductPage function

		var frameLabel = '.frame3';

		adTech.elem(`${frameLabel} .logo img`).src = snippet.SF.a1_logo__img.Url;

		
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── Generate Category THUMBS ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var generateThumb = (function () {
	var _this = {};
  

	_this.init = function (options) {
		_this.mapCategoryData();
		_this.createCategoryThumbnails();
		addEvents.categoryEvents();
	};

	_this.mapCategoryData = function () {
		productArr = [];
		for (var i = 0; i < snippet.HF.length; i++) {
			categoryData = {};
			categoryData.category = snippet.HF[i].category;
			categoryData.title = snippet.HF[i].title;
			categoryData.image = snippet.HF[i].image.Url;
			productArr.push(categoryData);
		}
	};

	_this.createCategoryThumbnails = function () {

	  var container = adTech.elem('.thumbnail-container'); // Select existing container
	 
	  for (var i = 0; i < productArr.length; i++) {
		var thumbItem = document.createElement('div');
		thumbItem.classList.add('thumbnail');
		thumbItem.setAttribute('data-cat', `${productArr[i].category}`);
		
		thumbItem.innerHTML = `

				<div class="thumb-image-container full-h">
					<img src="${snippet.HF[i].image.Url}">
				</div>
				<div class="thumb-headline full-h poppins-regular">
					${snippet.HF[i].title} 
				</div>
		
		`;
		container.appendChild(thumbItem);
	  }
	 

	};

	_this.getProductsByCat = function (category) {
		return snippet.PF.filter(function (product) {
			return product.category.includes(category);
		});
	};

	_this.showProductPage = function (category) {
		var frameLabel = '.frame3';
		gsap.set(frameLabel, { autoAlpha: 1, zIndex: 999 });

		var selectedProduct = _this.getProductsByCat(category);
		/*
		 * Here are the properties of the returned product based on the category:
		 *
		 * - selectedProduct[0].attraction_description
		 * - selectedProduct[0].attraction_logo.Url
		 * - selectedProduct[0].attraction_name
		 * - selectedProduct[0].category
		 * - selectedProduct[0].click_url
		 * - selectedProduct[0].headline
		 * - selectedProduct[0].image.Url
		 * - selectedProduct[0].panel_icon.Url
		 * - selectedProduct[0].panel_message
		 */

		// Map data to dynamic elements - Frame 3
		adTech.elem(`${frameLabel} .attraction-image img`).src = selectedProduct[0].image.Url;
		adTech.elem(`${frameLabel} .end-card-headline`).innerHTML = selectedProduct[0].headline;
		adTech.elem(`${frameLabel} .end-card-headline`).style.cssText = adTech.jsonToCss(snippet.SF.a3_headline__json);

		// ─────────────────────────────────────────────────────────────
		adTech.elem(`${frameLabel} .panel-details img`).src = selectedProduct[0].panel_icon.Url;
		adTech.elem(`${frameLabel} .panel-bar .headline`).innerHTML = selectedProduct[0].panel_message;
		adTech.elem(`${frameLabel} .panel-bar`).style.cssText = adTech.jsonToCss(snippet.SF.a3_attrImagePanel__json);
		// ─────────────────────────────────────────────────────────────
		adTech.elem(`${frameLabel} .headline-2`).innerHTML = selectedProduct[0].attraction_name;
		adTech.elem(`${frameLabel} .headline-2`).style.cssText = adTech.jsonToCss(snippet.SF.a3_attrName__json);
		
		adTech.elem(`${frameLabel} .headline-3`).innerHTML = selectedProduct[0].attraction_description;
		adTech.elem(`${frameLabel} .headline-3`).style.cssText = adTech.jsonToCss(snippet.SF.a3_attrDescription__json);

		adTech.elem(`${frameLabel} .cta-container p`).innerHTML = snippet.SF.a3_cta__text;
		adTech.elem(`${frameLabel} .cta-container`).style.cssText = adTech.jsonToCss(snippet.SF.a3_cta__json);

		adTech.elem(`${frameLabel} .logo-container-end-card img`).src = selectedProduct[0].attraction_logo.Url;
		
		// ─────────────────────────────────────────────────────────────
		//exits frame 3
		adTech.setCtaData(adTech.elem(`${frameLabel} .logo-parent > .overlay`), 'Frame3_logo_clicked', selectedProduct[0].click_url.Url, true);
		adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame3_background_clicked', selectedProduct[0].click_url.Url, true);
		adTech.setCtaData(adTech.elem(`${frameLabel} .attraction-container > .overlay`), 'Frame3_background_clicked', selectedProduct[0].click_url.Url, true);
		adTech.setCtaData(adTech.elem(`${frameLabel} .attraction-details-container .cta-container > .overlay`), 'Frame3_cta_clicked', selectedProduct[0].click_url.Url, true);
		adTech.setCtaData(adTech.elem(`${frameLabel} .attraction-details-container > .overlay`), 'Frame3_background_clicked', selectedProduct[0].click_url.Url, true);

		_this.animate();
		

		// console.log(selectedProduct[0]);
	};

	_this.animate = function () {
		var frameLabel = '.frame3';
		var tl = gsap.timeline();
		tl.from(`${frameLabel} .end-card-headline`, { autoAlpha: 0, y: 10, ease: 'power2.inOut' });
		tl.from(`${frameLabel} .attraction-container`, { autoAlpha: 0, scale: 0.97, ease: 'power2.inOut' });
		tl.from(`${frameLabel} .headline-2`, { autoAlpha: 0, y: 10, ease: 'power2.inOut' });
		tl.from(`${frameLabel} .headline-3`, { autoAlpha: 0, y: 10, ease: 'power2.inOut' }, '-=0.3');
		tl.from(`${frameLabel} .cta-container`, { autoAlpha: 0, y: 10, ease: 'power2.inOut' }, '-=0.3');
	};

	return _this;
  })();





// ─────────────────────────────────────────────────────────────────────────────
// ─── Creative Events ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var addEvents = (function () {
	var _this = {};

	_this.init = function () {

		// Add exit to all clickable elements with class .overlay
		let elements = adTech.elem('body .overlay');
		if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
			elements.forEach((element) => {
				element.addEventListener('click', adTech.exits, false);
			});
		} else if (elements) {
			elements.addEventListener('click', adTech.exits, false);
		}


		

	};

	_this.categoryEvents = function () {


		// Create separate functions to be able to use removeEventListeners
		function handleMouseOver() { const img = this.querySelector('img'); if (img) { gsap.to(img, { scale: 1.1, duration: 0.3 }); } }
		function handleMouseOut() { const img = this.querySelector('img'); if (img) { gsap.to(img, { scale: 1, duration: 0.3 }); } }
		//SCALE THUMB IMAGES
		adTech.elem('.thumbnail').forEach(element => { element.addEventListener('mouseover', handleMouseOver); element.addEventListener('mouseout', handleMouseOut); });
		
		//SELECT THUMBNAILS
		adTech.elem('.thumbnail').forEach(element => {
			element.addEventListener('click', function() {
				var category = element.getAttribute('data-cat');
				generateThumb.showProductPage(category)

				var counter = `Frame2_${category.replace('_', '')}_clicked`;
				Enabler.counter(counter);


			});
			
		});
		
	};


	return _this;
})();


// ─────────────────────────────────────────────────────────────────────────────
// ─── Creative Animation ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var animation = (function () {
	var _this = {};

	_this.init = function (options = {}) {
		var frames = [];
		var loopCount = options.loopCount || 0; // Default to play only once
		var skipFrameIndex = options.skipFrame !== undefined ? [options.skipFrame] : []; // Default to no skipped frames
		var endFrameIndex = options.endFrame !== undefined ? options.endFrame : frames.length - 1; // Default to no end frame
		var displayTime = options.displayTime || 1; // The display time of each frame in seconds
		var zIndex = 10; // Ensures the animating frame is on top
		var currentRepeat = 0; // Initialize a counter for loop count

		// Animation variation example.
		// ie: version-a or version-b will have a different animation sequence.
		var variation = 'version-a';

		switch (variation) {
			case 'version-a':
				frames = [_this.frame1, _this.frame2];
				break;

			case 'version-b':
				frames = [_this.frame3, _this.frame2, _this.frame1];
				break;
		}

		// Remove skipped frames based on the array of indices
		frames = frames.filter(function (_, index) {
			return !skipFrameIndex.includes(index);
		});

		var tl = gsap.timeline({
			repeat: loopCount,
			onRepeat: function () {
				currentRepeat++;
			},
		});

		// Add each frame to the timeline
		frames.forEach(function (frameFunction, index) {
			frameFunction(tl, displayTime, zIndex++);
		});
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
		tl.from('.logo-parent', {duration: 1, height: "600px", ease: "power3.inOut" }, "+=1")
		tl.from('.headline-1', {duration: .5, y: 10, opacity:0, ease: 'power3.inOut' })
		tl.from('.headline-2', {duration: .5, y: 10, opacity: 0, ease: 'power3.inOut' }, "-=.3");

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 2 Animation ───────────────────────────────────────────────
	_this.frame2 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame2';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });
		tl.to('.white-bg', {duration: 1, height: "600px", ease: "power2.inOut" })
		tl.from(`${frameLabel} .headline`, { duration:.5, y: 10, opacity: 0, ease:"power2.out" });
		tl.from('.thumbnail', { duration:1, x: "150%", stagger: 0.2, ease:"power2.out" });
	
		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 3 Animation ───────────────────────────────────────────────
	_this.frame3 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame3';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel,1, { autoAlpha: 0 }, { autoAlpha: 1 });
		

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	return _this;
})();


// ─────────────────────────────────────────────────────────────────────────────
// ─── For Studio Setup Onplay. Do Not Run! ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function studioExitsTmp() {
	// Exits
	Enabler.exit('Frame1_logo_clicked');
	Enabler.exit('Frame1_background_clicked');
	Enabler.exit('Frame2_logo_clicked');
	Enabler.exit('Frame2_background_clicked');
	Enabler.exit('Frame3_logo_clicked');
	Enabler.exit('Frame3_background_clicked');
	Enabler.exit('Frame3_cta_clicked');

	// Counters
	Enabler.counter('Frame2_cat1_clicked');
	Enabler.counter('Frame2_cat2_clicked');
	Enabler.counter('Frame2_cat3_clicked');
	Enabler.counter('Frame2_cat4_clicked');
	Enabler.counter('Frame2_cat5_clicked');
}
