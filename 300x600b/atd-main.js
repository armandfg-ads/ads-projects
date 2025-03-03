// ─────────────────────────────────────────────────────────────────────────────
// ─── Doubleclick Boilerplate ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    if (typeof creative !== 'undefined' && typeof creative.init === 'function') {
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

		// ─── 3.1 Carousel slider & Data Mapping Initialization ──────────────────────────
		// ─── 3.2 Data Mapping Initialization ──────────────────────────
		carousel.init();
		mapData.init();

		// ─── 4. Asset Preloading ─────────────────────────────────────
		// var assets = [snippet.SF.a1_bgImage__img.Url, snippet.SF.a2_bgImage__img.Url, snippet.SF.a3_bgImage__img.Url];

		// ─── 5. Creative Animation ───────────────────────────────────
		// adTech.preloadImages(assets, animation.init);
		animation.init();
		// Uncomment this line to log all exit reporting labels to the console for review.
		// adTech.logReportingLabels();
	};

	return _this;
})();


	// ─────────────────────────────────────────────────────────────────────────────
	// ─── CAROUSEL ──────────────────────────────────────────────────────
	// ────────────────────────────────────────────────────────────────────────────
	var carousel = (function () {
		var _this = {};
	
		_this.init = function () {
		// ─── CAROUSEL start code -  ─────────────────────────────────

		// Container to hold the carousel items - Mapdata
		const carouselContainer = adTech.elem('.carousel-container');    
		const totalItems = snippet.PF.length;
		const productValues = snippet.PF; // Product feed array of images, headlines, prices 
		let itemPerContainer = 1; // Number of product containers per product item - switch to 2 for 970x250
		// let carouselContainerWidth = adTech.elem('.carousel-parent').offsetWidth; // you can manually change the width
		let carouselContainerWidth = 255; // you can manually change the width
		// adTech.updClass(`.carousel-container { width:${carouselContainerWidth * (totalItems + 2) + "px"}}`); // update the slider container long width

		// Loop through the products and create carousel items
		for (let i = 0; i < totalItems; i += itemPerContainer) {
				// Create a carousel item
				const carouselItem = document.createElement('div');
				carouselItem.classList.add(`product-item-${i + 1}`, 'product-item', 'full-h', 'rel', 'overlay');
				adTech.updClass(`.product-item { width:${carouselContainerWidth + "px"}}`);

				// Loop through product containers within the carousel item
				for (let j = 0; j < itemPerContainer && i + j < totalItems; j++) {
					const product = productValues[i + j];
					const productContainer = document.createElement('div');
					productContainer.classList.add(`product-container-${i + j + 1}`, 'abs', 'product-container',  'center-x');
					productContainer.innerHTML = `
					<div class="product-img-parent product-img-parent-${i + j + 1} abs">
						<div class="product-img prod-alt-${i + j + 1} full-wh abs" style="background-image: url('${product.altImageUrl.Url}');"></div>
						<div class="product-img prod-main-${i + j + 1} full-wh abs" style="background-image: url('${product.imageUrl.Url}');"></div>
					</div>	
					<div class="product-details abs">
						<div class="headline abs vln2"> <p>${product.productName}</p> </div>
						<div class="sub-price-container abs">
							<div class="sub-price-child center-y abs">
								<span class="sub-price orig-price rel">${product.price}</span>	
								<span class="sub-price sale-price rel">${product.salePrice}</span>	
							</div>
						</div>

						<div class="cta-container abs z2">
							<p class="center-y full-w">SHOP NOW</p>
							<div class="overlay abs-xy hand"></div>
						</div>
						
					</div>
					`;
					carouselItem.appendChild(productContainer);

					//MOUSE OVER animations
					const prodMainElement = productContainer.querySelector(`.prod-main-${i + j + 1}`);
					const prodAltElement = productContainer.querySelector(`.prod-alt-${i + j + 1}`);

					prodMainElement.addEventListener('mouseover', () => {	
						if (prodAltElement.style.backgroundImage=== 'url("")') {
							// console.log("empty")
							} else {
							gsap.to(prodMainElement, { opacity: 0, duration: 0.5 });
							// console.log("not empty")
							}
					});
					prodMainElement.addEventListener('mouseout', () => {
						gsap.to(prodMainElement, { opacity: 1, duration: 0.5 });
					});

					
	
				}
				//END Loop 1
				// Append the carousel item to the container
				carouselContainer.appendChild(carouselItem);
						
			} //END LOOp 2


			// Initialize slides array dynamically based on the length of product items
			let productItemsArray = [];
			for (let i = 0; i < totalItems; i += itemPerContainer) {
				const productItemClass = `.product-item-${i + 1}`;
				const productItem = adTech.elem(productItemClass);
				if (productItem) {
					productItemsArray.push(productItem);
				}
			}

			//Check if price is on sale
			for (let i = 0; i < totalItems; i++) {
				// console.log(productValues[i].onSale)
				if (productValues[i].onSale == false) {
					adTech.addClass(adTech.elem('.sale-price')[i], 'no-sale');
					adTech.addClass(adTech.elem('.orig-price')[i], 'sale-price-only');
				}
			}

		


			// ─── CAROUSEL end code -  ─────────────────────────────────

			
			// ─── CAROUSEL NAVIGATION code -  ─────────────────────────────────
 
			var carouselParent = adTech.elem('.carousel-parent'),
			carouselCont = adTech.elem('.carousel-container'),
			prev = adTech.elem('#btn_left'),
			next = adTech.elem('#btn_right');


			function slide(wrapper, items, prev, next) {
				var posInitial,
					slides = items.getElementsByClassName('product-item'),
					slidesLength = slides.length,
					slideSize = items.getElementsByClassName('product-item')[0].offsetWidth + 11,
					firstSlide = slides[0],
					lastSlide = slides[slidesLength - 1],
					cloneFirst = firstSlide.cloneNode(true),
					cloneLast = lastSlide.cloneNode(true),
					index = 0,
					allowShift = true;
				
				// Clone first and last slide
				items.appendChild(cloneFirst);
				items.insertBefore(cloneLast, firstSlide);
				wrapper.classList.add('loaded');
			
				
				
				// Transition events
				items.addEventListener('transitionend', checkIndex);
				
				//update container widths
				
			

				function shiftSlide(dir) {
						items.classList.add('shifting');
						
						if (allowShift) {

							// if (!action) { posInitial = items.offsetLeft;  }
							// posInitial = items.offsetLeft; 

							posInitial = gsap.getProperty(items, 'x');

							console.log("posInitial", posInitial);
							if (dir == 1) {
								// items.style.left = (posInitial - slideSize) + "px";
								
								gsap.to(items, { x: (posInitial - slideSize) + "px", duration: 0.3, onComplete: checkIndex });
								console.log("X",  gsap.getProperty(items, 'x') )

								index++;      
							} else if (dir == -1) {
								// items.style.left = (posInitial + slideSize) + "px";
								gsap.to(items, { x: (posInitial + slideSize) + "px", duration: 0.3, onComplete: checkIndex });

								index--;      
							}
						};
						
						allowShift = false;
					}
						
					function checkIndex (){
						items.classList.remove('shifting');

						if (index == -1) {
						// items.style.left = -(slidesLength * slideSize) + "px";
						gsap.set(items, { x: -(slidesLength * slideSize) + 11 + "px", duration: 0 });
						index = slidesLength - 1;
						
						}

						if (index == slidesLength) {
						// items.style.left = -(1 * slideSize) + "px";

						gsap.set(items, { x: -(1 * slideSize) + 11  + "px", duration: 0 });

						

						index = 0;
						}
						
						allowShift = true;
					}

					var slideIdx = 0;
					function startAutoSlide() {
						autoSlideInterval = setInterval(function () {
							slideIdx++;
							
							shiftSlide(1);					
							console.log("slideIdx", slideIdx, totalItems)
							if (slideIdx == totalItems) {
								stopAutoSlide();
							}
						}, 2000); 
					}
					function stopAutoSlide() {
						clearInterval(autoSlideInterval);
					}
					
					// startAutoSlide();

					// Click events
				prev.addEventListener('click', function () { shiftSlide(-1);  });
				next.addEventListener('click', function () { shiftSlide(1); });

			}
			  
			slide(carouselParent, carouselCont, prev, next);
			
		
			
		
			// ─── CAROUSEL FUNCTIONALITY code -  ─────────────────────────────────



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

			// ─── Frame 1 ─────────────────────────────────────────────────
			var frameLabel = '.frame1';

			//Update container classes if promo
			
			if (snippet.HF.promo) {
				var productTotal = adTech.elem(`.product-container`).length;
				for (var i=0; i < productTotal; i++) {
					adTech.addClass(adTech.elem(`.product-img-parent`)[i], 'promo-product-img');
					adTech.addClass(adTech.elem(`.product-container`)[i], 'promo-product-container');
					adTech.addClass(adTech.elem(`.product-container .product-details`)[i], 'promo-product-details');
					adTech.addClass(adTech.elem(`.product-container .product-details .headline`)[i], 'promo-product-headline');
					adTech.addClass(adTech.elem(`.product-container .cta-container`)[i], 'promo-cta-container');
					adTech.addClass(adTech.elem(`.product-container .sub-price-container`)[i], 'promo-sub-price-container');
					// console.log(adTech.elem(`.product-container`)[i])
				}
				// //Mapping image
				if (adTech.isValidImageUrl(snippet.HF.size300x600.Url)) {
					adTech.updClass(`${frameLabel} .promo-banner {background-image:url(${snippet.HF.size300x600.Url})}`);
				}
				// Navigation height
				adTech.updClass(`.nav { height: 390px}}`);
			}
			
				//POPULATE TICKER
				const tickerContainer = adTech.elem('.ticker');
				const numberOfItems = 3;
				const textContent = snippet.HF.tickerText;
				// Generate ticker text items
				for (let i = 0; i < numberOfItems; i++) {
					const tickerText = document.createElement('div');
					tickerText.classList.add('ticker-text');
					tickerText.textContent = textContent;
					tickerContainer.appendChild(tickerText);
				}
				var mainExitURL = snippet.PF[0].link.Url;

			// adTech.setCtaData(adTech.elem(`.frame1 > .carousel-container .overlay`), 'Frame1_Main_Background_Exit', snippet.PF[0].link.Url, true);
			// adTech.setCtaData(adTech.elem(`.frame1 .carousel-container > .overlay`)[1], 'Frame1_Main_Background_Exit', mainExitURL, false);
			// ─── Frame 2 ─────────────────────────────────────────────────
			var frameLabel = '.frame2';

			
			// ─── Frame 3 ─────────────────────────────────────────────────
			var frameLabel = '.frame3';

		
			

			// adTech.exits(adTech.elem(`.frame1 .carousel-container > .overlay`)[0])
			
		
			// KEEP AT THE BOTTOM OF FUNCTION
			// add event listener for all CTA clickable elements with class .overlay
			// adTech.elem(`.frame1 .carousel-container > .overlay`).forEach((element) => {
			// 	element.addEventListener('click', adTech.exits, false);
			// });

			// adTech.elemAll('body > .overlay').forEach((element) => {
			// 	element.addEventListener('click', adTech.exits, false)
			// })
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
		// _this.frame0(tl, displayTime, zIndex++);
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
	
		//Ticker animation
		gsap.set(adTech.elem('.ticker'), { x: 310 });
		var totalTickerWidth = adTech.elem('.ticker').offsetWidth - (adTech.elem('.ticker').offsetWidth / 3) + 10;
		gsap.to(adTech.elem('.ticker'), {duration: 15, x: '-' + totalTickerWidth, ease: "linear"});


		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 2 Animation ───────────────────────────────────────────────
	_this.frame2 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame2';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });
	

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 3 Animation ───────────────────────────────────────────────
	_this.frame3 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame3';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });
	
		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── For Studio Setup Onplay. Do Not Run! ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function studioExitsTmp() {
	Enabler.exit("Frame1_Main_Background_Exit");
	Enabler.exit("Frame1_Cta_Exit");
	Enabler.exit("Frame2_Main_Background_Exit");
	Enabler.exit("Frame2_Cta_Exit");
	Enabler.exit("Frame3_Main_Background_Exit");
	Enabler.exit("Frame3_Cta_Exit");
}




