// ─────────────────────────────────────────────────────────────────────────────
// ─── Incubeta Ad Tech Library ────────────────────────────────────────────────
// ─── V 04.30.2024 ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

var adTech = (function () {
	var _this = {};

	_this.init = function () {
		// ─────────────────────────────────────────────────────────────
		// ─── Utility Functions ───────────────────────────────────────
		// ─────────────────────────────────────────────────────────────

		// Element selector
		_this.elem = function (query) {
			var t = document.querySelectorAll(query);
			return t.length === 0 ? false : t.length === 1 ? t[0] : t;
		};

		// Update class
		_this.updClass = function (txt) {
			var extraBgStyle = document.createElement('style');
			extraBgStyle.innerHTML = txt;
			document.head.appendChild(extraBgStyle);
		};

		// Return true if element contains class
		_this.hasClass = function (el, className) {
			return el.classList.contains(className);
		};

		// Add classname to element
		_this.addClass = function (el, className) {
			el.classList.add(className);
		};

		// Remove classname from element
		_this.removeClass = function (el, className) {
			el.classList.remove(className);
		};

		// Check string case
		_this.checkCase = function (str) {
			if (str === str.toUpperCase()) {
				return 'uppercase';
			} else if (str === str.toLowerCase()) {
				return 'lowercase';
			} else {
				return 'mixed case';
			}
		};

		// Parse from JSON into Class Styles (required css object in JSON)
		_this.jsonToCss = function (obj) {
			let css = '';
			try {
				const parsedObj = JSON.parse(obj);
				if (parsedObj.css) {
					Object.keys(parsedObj.css).forEach(function (key) {
						const value = parsedObj.css[key];
						css += `${key}:${value};`;
					});
				}
			} catch (error) {
				console.error('Error parsing JSON:', error);
			}
			return css;
		};

		_this.addExtraCss = function (cssText) {
			if (cssText) {
				var extraBgStyle = document.createElement('style');
				extraBgStyle.innerHTML = cssText;
				document.head.appendChild(extraBgStyle);
			}
		};

		_this.addExtraJs = function (jsCode) {
			if (jsCode) {
				new Function(jsCode)(); // Executes the provided JavaScript code
			}
		};

		// Image preloader
		// Pass in an array of image urls and a callback function to execute when all images are loaded
		_this.preloadImages = function (imgArray, callbackFunction) {
			var totalImages = imgArray.length,
				loadedImages = 0,
				img = null,
				i;
			for (i = 0; i < totalImages; i++) {
				// Checks if the URL is a valid image URL.
				if (_this.isValidImageUrl(imgArray[i])) {
					img = document.createElement('img');
					img.src = imgArray[i];
					img.onload = function () {
						loadedImages++;
						if (loadedImages === totalImages) {
							callbackFunction();
						}
					};
					img.onerror = function () {
						loadedImages++;
						if (loadedImages === totalImages) {
							callbackFunction();
						}
					};
				} else {
					loadedImages++;
					if (loadedImages === totalImages) {
						callbackFunction();
					}
				}
			}
		};

		// Add hover effect to element.
		// Accepts 3 parameters: the element, the background color, and the font color.
		_this.addHover = function (el, bgColor, fontColor) {
			el.addEventListener('mouseover', function () {
				gsap.to(el, { backgroundColor: fontColor, color: bgColor, duration: 0.3 });
			});
			el.addEventListener('mouseout', function () {
				gsap.to(el, { backgroundColor: bgColor, color: fontColor, duration: 0.3 });
			});
		};

		// Checks if the URL is a valid image (jpg, png, gif, svg).
		_this.isValidImageUrl = function (url) {
			if (url != '') {
				return true;
			} else {
				console.error(`Invalid image URL: ${url}`);
				return false;
			}
		};

		/** Dynamically fit the text inside it's own width and height. */
		_this.fitText = function (element) {
			let containerWidth = element.clientWidth;
			let containerHeight = element.clientHeight;
			let textWidth = element.scrollWidth;
			let textHeight = element.scrollHeight;

			let fontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
			let fontSizeNum = parseFloat(fontSize);

			while ((textWidth > containerWidth || textHeight > containerHeight) && fontSizeNum > 0) {
				fontSizeNum--;
				element.style.fontSize = fontSizeNum + 'px';
				textWidth = element.scrollWidth;
				textHeight = element.scrollHeight;
			}
		};

		/** Trim the text if the text is greater than the max number of lines. */
		_this.trimText = function (element, lineCount) {
			var els;

			if (typeof element === 'string') {
				els = document.querySelectorAll(element);
			} else if (element instanceof HTMLElement) {
				els = [element];
			} else {
				console.error('Invalid argument for element:', element);
				return;
			}

			if (!els.length) {
				console.error('No elements found for selector:', element);
				return;
			}

			els.forEach(function (el) {
				var lineHeight = parseInt(window.getComputedStyle(el)['line-height']);
				var maxHeight = lineHeight * lineCount;

				el.style.overflow = 'hidden';
				el.style.display = '-webkit-box';
				el.style.webkitBoxOrient = 'vertical';
				el.style.webkitLineClamp = lineCount;
				el.style.maxHeight = maxHeight + 'px';
			});
		};

		/** Dispatch custom event. */
		_this.triggerEvent = function (element, eventName) {
			var event = new Event(eventName);
			element.dispatchEvent(event);
		};

		// ─────────────────────────────────────────────────────────────
		// ─── Studio Based Functions ──────────────────────────────────
		// ─────────────────────────────────────────────────────────────

		// Add exit suffix to url. Modernized and optimized.
		_this.addSuff = function (url) {
			var urlSuffix = Enabler.getParameter('exit_suffix') || '';

			if (urlSuffix) {
				urlSuffix = urlSuffix.replace(/^\?+|&+/g, '');
				urlSuffix = urlSuffix.replace(/\?/g, '&');
			}

			var symbol = url.includes('?') ? '&' : '?';
			var _url = url + (urlSuffix ? symbol + urlSuffix : '');
			return _url;
		};

		// Get UTM params. Modernized and optimized.
		// Accepts two parameters: the exit url and the snippet utm object.
		_this.getUtmParams = function (exitUrl, obj) {
			var utmarr = [];
			if (obj.utm_source) utmarr.push('utm_source=' + obj.utm_source);
			if (obj.utm_medium) utmarr.push('utm_medium=' + obj.utm_medium);
			if (obj.utm_campaign) utmarr.push('utm_campaign=' + obj.utm_campaign);
			if (obj.utm_term) utmarr.push('utm_term=' + obj.utm_term);
			if (obj.utm_content) utmarr.push('utm_content=' + obj.utm_content);
			var temp_url = exitUrl + (utmarr.length ? '?' + utmarr.join('&') : '');
			return temp_url;
		};

		/**
		 * Dynamically update the exit url with utm variables from the studio snippet.
		 * If the exit url has utm variables already, replace it with the values from the snippet.
		 * If the exit url has no utm variables, add it to the url.
		 */
		_this.addUtmParams = function (exitURL, parameters) {
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

			// Return the updated URL
			return base + '?' + updatedParams;
		};

		// CTA data install
		_this.reportArray = [];
		_this.setCtaData = function (el, report = '', url = '', utm = '') {
			if (!el) {
				return;
			}
			el.dataset.reporting = report;
			el.dataset.exit = url;
			el.dataset.utm = utm;
			if (report) {
				_this.reportArray.push(report);
			}
		};
	};

	// CTA exit global function
	_this.exits = function (e) {
		if (e.target.dataset.utm === 'true') {
			Enabler.exitOverride(e.target.dataset.reporting, _this.addSuff(_this.getUtmParams(e.target.dataset.exit, snippet.SF)));
		} else {
			Enabler.exitOverride(e.target.dataset.reporting, _this.addSuff(e.target.dataset.exit));
		}

		// Tracking
		Enabler.reportCustomVariableCount1(e.target.dataset.exit);


	};

	// ─────────────────────────────────────────────────────────────────────
	// ─── Debug Functions ─────────────────────────────────────────────────
	// ─────────────────────────────────────────────────────────────────────

	// Debug HTML DOM by generating outlines.
	_this.generateDomOutlines = function () {
		var container = document.querySelector('.container-dc');
		var parents = container.querySelectorAll(':not(.container-dc)');

		parents.forEach((parent) => {
			var randomColor;
			do {
				randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
			} while (randomColor === '#000000' || randomColor === '#FFFFFF');
			parent.style.outline = `1px dashed ${randomColor}`;
		});
	};

	// Log reporting labels to console.
	// Useful for extracting exit reporting label to be used inside the dummy function studioExitsTmp in atd-main.js.
	_this.logReportingLabels = function () {
		for (var i = 0; i < adTech.reportArray.length; i++) {
			console.warn('COPY THE FOLLOWING INSIDE studioExitsTmp in atd-main.js:\n' + `Enabler.exit("${adTech.reportArray.join('");\nEnabler.exit("')}");\n`);
		}
	};

	// Log styling feed properties to console.
	// Useful for easy copy pasting of values to the styling feed.
	_this.logStyleFeedProps = function () {
		var stylingFeed = snippet.SF;

		for (var property in stylingFeed) {
			if (stylingFeed.hasOwnProperty(property) && property.includes('__json')) {
				var value = JSON.stringify(stylingFeed[property]);
				value = value
					.replace(/\\n/g, '\n') // Replaces escaped newlines with real newlines
					.replace(/\\'/g, "'") // Replaces escaped single quotes with real single quotes
					.replace(/\\"/g, '"') // Replaces escaped double quotes with real double quotes
					.replace(/\\\\/g, '\\'); // Replaces escaped backslashes with real backslashes

				// Remove outermost quotes if they exist
				if (value.startsWith('"') && value.endsWith('"')) {
					value = value.substring(1, value.length - 1);
				}

				console.log(property + ':\n' + value);
				// console.log('%c%s', 'color: cyan;', '\n ' + value);
			}
		}
	};

	return _this;
})();
