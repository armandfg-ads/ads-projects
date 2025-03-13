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

		/**
		 * Parameters:
		 * orientation: 'horizontal' or 'vertical'
		 * itemWidth: width of each carousel item
		 * itemHeight: height of each carousel item
		 * imageWidth: width of each carousel image
		 * imageHeight: height of each carousel image
		 * itemSpace: space between each carousel item
		 * numDisplay: number of carousel items to display
		 */

		//check if promo
		if (snippet.HF.promo) {
			console.log('activate promo banner');
			parentW = 219;
			parentH = 381;
			imageH = 292;
		} else {
			parentW = 255;
			parentH = 481;
			imageH = 340.31;
		}

		carousel.init({
			element: '.carousel-wrapper',
			orientation: 'horizontal',
			itemWidth: parentW,
			itemHeight: parentH,
			imageWidth: 300,
			imageHeight: imageH,
			numDisplay: 1,
			itemSpace: 13,
			autoPlay: true,
		});
	

		// ─── 3. Data Mapping Initialization ──────────────────────────
		mapData.init();

		// ─── 4. Creative Events Initialization ───────────────────────
		addEvents.init();

		// ─── 5. Asset Preloading ─────────────────────────────────────
		// var assets = [
		// 	snippet.SF.a1_bgImage__img.Url,
		// 	snippet.SF.a2_bgImage__img.Url,
		// 	snippet.SF.a3_bgImage__img.Url
		// ];

		// ─── 6. Creative Animation ───────────────────────────────────
		animation.init();
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── Carousel Component ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var carousel = (function () {
	var _this = {};
	var ctr = 0;
	var interval;

	_this.init = function (options) {
		_this.mapCarouselData();
		_this.configureCarousel(options);
		_this.generateCarousel();
		_this.bindEvents();
		_this.checkOnSale();
		_this.checkPromo();
		_this.createTicker();
		// _this.autoPlay();
	};

	_this.mapCarouselData = function () {
		productArr = [];

		for (var i = 0; i < snippet.PF.length; i++) {
			productData = {};
			productData.id = i;
			productData.name = snippet.PF[i].productName;
			productData.image = snippet.PF[i].imageUrl.Url;
			productData.altImage = snippet.PF[i].altImageUrl.Url;
			productData.price = snippet.PF[i].price;
			productData.salePrice = snippet.PF[i].salePrice;
			productData.url = snippet.PF[i].link.Url;
			productArr.push(productData);
		}
	};

	// ─────────────────────────────────────────────────────────────────────
	// ─── Carousel Configuration ──────────────────────────────────────────
	// ─────────────────────────────────────────────────────────────────────
	_this.configureCarousel = function (options) {
		var imageH = snippet.HF.promo ? 292 : 340.31;

		carouselWrapper = options.element;
		carouselWrapperWidth = options.elementWidth || 300;
		carouselWrapperHeight = options.elementHeight || 600;
		carouselOrientation = options.orientation || 'horizontal';
		carouselItemWidth = options.itemWidth || 300;
		carouselItemHeight = options.itemHeight || 480;
		carouselImageWidth = options.imageWidth || 300;
		carouselImageHeight = options.imageHeight || imageH;
		carouselItemSpace = options.itemSpace || 0;
		carouselNumDisplay = options.numDisplay || 1;
		carouselAutoPlay = options.autoPlay || false;
		carouselContainerWidth = carouselItemWidth * carouselNumDisplay;
	};

	_this.generateCarousel = function () {
		carouselItemsArr = [];
		lockArrows = false;

		carouselItems = document.createElement('div');
		carouselItems.classList.add('carousel-items');
		carouselItems.style.width = carouselContainerWidth + 'px';

		adTech.elem(carouselWrapper).appendChild(carouselItems);
		adTech.elem(carouselWrapper).style.height = carouselItemHeight + 'px';

		for (var i = 0; i < productArr.length; i++) {
			var carouselItem = document.createElement('div');
			carouselItem.classList.add('carousel-item');
			carouselItem.classList.add('overlay');
			carouselItem.setAttribute('data-reporting', `PROD${i + 1}_BG_EXIT`);
			carouselItem.setAttribute('data-exit', `${snippet.PF[i].link.Url}`);
			carouselItem.setAttribute('data-utm', 'false');

			carouselItem.innerHTML = `
					<!-- Product Image -->
					<div class="carousel-image prod-alt-${i + 1} abs" style="background-image: url(${productArr[i].altImage}); width: ${carouselImageWidth}px; height: ${carouselImageHeight}px; position: absolute;"></div>
					<div class="carousel-image prod-main-${i + 1}" style="background-image: url(${productArr[i].image}); width: ${carouselImageWidth}px; height: ${carouselImageHeight}px;"></div>

					<!-- Product Info -->
					<div class="carousel-product-info-wrapper">
						<div class="carousel-product-name"><p>${productArr[i].name}</p></div>
						<div class="carousel-product-prices">
							<div class="carousel-product-price" >
								<div class="price">${productArr[i].price}</div>
							</div>
							<div class="carousel-product-sale-price">
								<div class="price">${productArr[i].salePrice}
							</div>
						</div>
						</div>

						<!-- CTA -->
						<div class="carousel-product-cta" style="color: ${snippet.HF.ctaFontColor}; background-color:${snippet.HF.ctaColour} ">SHOP NOW</div>
					</div>
				
			`;

			carouselItems.appendChild(carouselItem);
			carouselItemsArr.push(carouselItem);

			if (carouselOrientation == 'horizontal') {
				carouselItem.style.width = `${carouselItemWidth}px`;
				carouselItem.style.height = `${carouselItemHeight}px`;
				carouselItem.style.left = `${(carouselItemWidth + carouselItemSpace) * i}px`;
				carouselItem.style.top = '0';
			} else {
				carouselItem.style.width = `${carouselItemWidth}px`;
				carouselItem.style.height = `${carouselItemHeight}px`;
				carouselItem.style.top = `${(carouselItemHeight + carouselItemSpace) * i}px`;
			}

			// Hide the carousel arrows if there is only one product.
			if (productArr.length <= 1) {
				adTech.elem('#btn_left').style.display = 'none';
				adTech.elem('#btn_right').style.display = 'none';
			}

			//MOUSE OVER EVENTS
			const prodMainElement = adTech.elem(`.prod-main-${i + 1}`);
			const prodAltElement = adTech.elem(`.prod-alt-${i + 1}`);

			prodMainElement.addEventListener('mouseover', () => {
				if (prodAltElement.style.backgroundImage === 'url("")') {
					// console.log("empty")
				} else {
					gsap.to(prodMainElement, { opacity: 0, duration: 0.5 });
					// console.log("not empty")
				}
			});
			prodMainElement.addEventListener('mouseout', () => {
				gsap.to(prodMainElement, { opacity: 1, duration: 0.5 });
			});
		} //loop end
	};

	_this.checkOnSale = function () {
		for (let i = 0; i < carouselItemsArr.length; i++) {
			if (snippet.PF[i].onSale == true) {
				adTech.addClass(adTech.elem(`.carousel-product-price`)[i], 'sale-price');
			}
			if (snippet.PF[i].onSale == false) {
				adTech.elem('.carousel-product-price')[i].style.display = 'none';
			}
		}
	};

	_this.checkPromo = function () {
		if (snippet.HF.promo == true) {
			adTech.updClass(`.carousel-wrapper {top: 173px; transform: translateX(-50%) }; }`);

			adTech.updClass(`.carousel-product-name p {margin: 10px 16px 0 16px; font-size: 17px;}`);
			adTech.updClass(`.carousel-product-info-wrapper {height: 87px;}`);
			adTech.updClass(`.carousel-product-cta {height: 23px; width: 93px; bottom: 11px; right: 25px; font-size: 10px; }`);
			adTech.updClass(`.carousel-product-prices {left: 15px; top: 57px;}`);
			adTech.updClass(`.carousel-product-prices .price {font-size: 19px;}`);
			adTech.updClass(`.promo-banner {background-image:url(${snippet.HF.size300x600.Url})}`);

			adTech.updClass(`.nav {width: 28px; height: 391px; bottom: 41px; }`);
		}
	};
	_this.createTicker = function () {
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
	};

	_this.bindEvents = function () {
		adTech.elem('#btn_left').addEventListener('click', function (e) {
			_this.carouselPrev();
			window.clearInterval(interval);
		});

		adTech.elem('#btn_right').addEventListener('click', function (e) {
			_this.carouselNext();
			window.clearInterval(interval);
		});
	};

	_this.carouselPrev = function () {
		if (lockArrows) return;
		lockArrows = true;

		ctr = ctr > 0 ? --ctr : carouselItemsArr.length - 1;
		direction = 1;

		for (var i = 0; i < carouselItemsArr.length; i++) {
			if (carouselOrientation === 'horizontal' && carouselItemsArr[i].offsetLeft >= carouselItemWidth * (carouselItemsArr.length - 1)) {
				gsap.set(carouselItemsArr[i], {
					left: -(carouselItemWidth + carouselItemSpace) + 'px',
				});
			} else if (carouselOrientation === 'vertical' && carouselItemsArr[i].offsetTop >= carouselItemHeight * (carouselItemsArr.length - 1)) {
				gsap.set(carouselItemsArr[i], {
					top: -(carouselItemHeight + carouselItemSpace) + 'px',
				});
			}
		}
		Enabler.counter('LEFT_ARROW');
		_this.slideCarousel();
	};

	_this.carouselNext = function () {
		if (lockArrows) return;
		lockArrows = true;
		Enabler.counter('RIGHT_ARROW');
		ctr = ctr < carouselItemsArr.length - 1 ? ++ctr : 0;
		direction = -1;

		for (var i = 0; i < carouselItemsArr.length; i++) {
			if (carouselOrientation === 'horizontal' && carouselItemsArr[i].offsetLeft < 0) {
				gsap.set(carouselItemsArr[i], {
					left: (carouselItemWidth + carouselItemSpace) * (carouselItemsArr.length - 1) + 'px',
				});
			} else if (carouselOrientation === 'vertical' && carouselItemsArr[i].offsetTop < 0) {
				gsap.set(carouselItemsArr[i], {
					top: (carouselItemHeight + carouselItemSpace) * (carouselItemsArr.length - 1) + 'px',
				});
			}
		}

		_this.slideCarousel();
	};

	_this.slideCarousel = function () {
		gsap.to(carouselItemsArr, {
			duration: 0.5,
			[carouselOrientation === 'horizontal' ? 'left' : 'top']: '+=' + direction * (carouselOrientation === 'horizontal' ? carouselItemWidth + carouselItemSpace : carouselItemHeight + carouselItemSpace) + 'px',
			onComplete: function () {
				lockArrows = false;
			},
		});

		_this.updateExitUrl();
	};

	_this.autoPlay = function () {
		if (carouselAutoPlay) {
			interval = setInterval(function () {
				_this.carouselNext();

				if (ctr == 0) {
					window.clearInterval(interval);
				}
			}, 2000);
		}

		_this.updateExitUrl();
	};

	_this.updateExitUrl = function () {
		let overlays = document.querySelectorAll('.overlay');
		overlays.forEach((overlay) => {
			overlay.setAttribute('data-reporting', `PROD${ctr + 1}_BG_EXIT`);
			overlay.setAttribute('data-exit', `${snippet.PF[ctr].link.Url}`);
			overlay.setAttribute('data-utm', 'false');
		});
	};

	_this.getProductData = function (newVal) {
		return arguments.length ? (productArr = newVal) : productArr;
	};

	_this.getActiveProduct = function (newVal) {
		return arguments.length ? (ctr = newVal) : ctr;
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── Map Dynamic Data ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var mapData = (function () {
	var _this = {};

	_this.init = function () {
		// ─── Frame 1 ─────────────────────────────────────────────────
		// ─── Frame 1 ─────────────────────────────────────────────────
		var frameLabel = '.frame-1';
		// productArr.length
		// adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame1_Main_Background_Exit', 'https://www.google.com', false);
		// adTech.setCtaData(adTech.elem(`${frameLabel} .carousel-items > .overlay`), 'Frame1_Main_Background_Exit', 'https://www.google.com', false);
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
		adTech.elem('body .overlay').forEach((element) => {
			element.addEventListener('click', adTech.exits, false);
		});
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
		gsap.config({ force3D: true })
		carousel.autoPlay();
		var frameLabel = '.frame-1';
		// tl.set(frameLabel, { zIndex: zIndex });
		tl.set('.frame0', { autoAlpha: 0 });
		// // Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });

		//Ticker animation
		gsap.set(adTech.elem('.ticker'), { x: 310 });
		var totalTickerWidth = adTech.elem('.ticker').offsetWidth - adTech.elem('.ticker').offsetWidth / 3 + 10;
		gsap.to(adTech.elem('.ticker'), { duration: 15, x: '-' + totalTickerWidth, z: '00000.1' });

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── For Studio Setup Onplay. Do Not Run! ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
