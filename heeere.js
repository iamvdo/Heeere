/*!
 * Heeere.js 1.1.0
 * MIT licensed
 *
 * Copyright (C) 2014 Vincent De Oliveira, http://iamvdo.me
 */
(function () {

	'use strict';

	var heeere;

	function refresh () {

		requestAnimFrame(refresh);
		heeere.update();

	}

	function goHeeere (method, options) {

		method.call(null, options);

	}

	function add (options) {

		heeere = new Heeere(options);
		heeere.init();

	}

	function remove () {

		heeere.destroy();

	}

	function scrollTopY () {

		return window.pageYOffset || document.documentElement.scrollTop;

	}

	function Heeere (options) {

		for ( var key in options ) {
			if ( options.hasOwnProperty(key) ) {
				this.defaults[key] = options[key];
			}
		}

		this.options = this.defaults;

	}

	Heeere.prototype = {

		defaults: {
			elems: '.heeere-item',
			viewportFactor: 0.15,
			smooth: false,
			smoothLimit: 2,
			smoothSpeed: 250
		},

		init: function () {
			// list of items
			this.items = [];
			var elems = document.querySelectorAll(this.options.elems);

			// set DOM properties for each items
			for ( var i = 0, len = elems.length; i < len; i++ ) {
				var item = elems[i];
				item._offsetHeight = item.offsetHeight;
				if ( item.offsetParent !== null ) {
					item._offsetTop = item.offsetTop + (item.offsetParent.offsetTop);
				} else {
					item._offsetTop = item.offsetTop;
				}
				item._offsetBottom = item._offsetTop + item._offsetHeight;
				// add this item to this.items
				this.items.push(elems[i]);
			}

			refresh();

		},

		destroy: function () {
			// nothing for now
		},

		update: function () {

			// get the scrollTop and scrollBottom
			var scrollTop = scrollTopY(),
				innerH = window.innerHeight,
				scrollBottom = scrollTop + innerH;

			// Update each item classes
			for ( var i = 0, len = this.items.length; i < len; i++ ) {
				var item = this.items[i];

				// Above the viewport
				if ( item._offsetBottom - (item._offsetHeight * this.options.viewportFactor) < scrollTop ) {

					item._state = 'past';
					item.classList.add( 'past' );
					item.classList.add( 'seen' );
					item.classList.remove( 'inside' );
					item.classList.remove( 'future' );

				}
				// Below the viewport
				else if ( item._offsetTop + (item._offsetHeight * this.options.viewportFactor) > scrollBottom ) {

					item._state = 'future';
					item.classList.add( 'future' );
					item.classList.remove( 'inside' );
					item.classList.remove( 'past' );
					item.classList.remove( 'seen' );

				}
				// Inside the viewport
				else {

					if ( this.options.smooth ) {

						var time = 0;

						if (item._state === 'future') {

							time = item._offsetTop + (item._offsetHeight * this.options.viewportFactor);
							time -= scrollTop; // 0 -> innerH

						} else if (item._state === 'past') {

							time = item._offsetBottom - (item._offsetHeight * this.options.viewportFactor);
							time -= scrollTop;
							time = innerH - time; // innerH -> 0

						}

						if (item._state === 'future' || item._state === 'past') {

							time = Math.max(innerH / this.options.smoothLimit, time);
							time -= innerH / this.options.smoothLimit;
							time = (time * (this.options.smoothLimit / (this.options.smoothLimit - 1)) );
							time /= innerH; // 0 -> 1 or 1 -> 0
							time *= this.options.smoothSpeed;

							item._time = Math.floor(time);

							this.goSmooth(item);

						}

					} else {

						item._state = 'inside';
						item.classList.add( 'inside' );
						item.classList.remove( 'past' );
						item.classList.remove( 'future' );

					}
				}

			}

		},
		goSmooth: function (item) {

			(function (item) {

				// not so smooth with setTimeout
				setTimeout(function () {

					item._state = 'inside';
					item.classList.add( 'inside' );
					item.classList.remove( 'past' );
					item.classList.remove( 'future' );

				}, item._time);

			})(item);

		}

	};

	// add to global namespace
	window.heeere = {
		bind: function (options) {
			goHeeere(add, options);
		},
		unbind: function (elem) {
			goHeeere(remove);
		}
	};


	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
	})();

})();
