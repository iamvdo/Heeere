/*!
 * Heeere.js 1.0.0
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
			viewportFactor: .15
		},

		init: function () {
			// list of items
			this.items = [];
			var elems = document.querySelectorAll(this.options.elems);

			for ( var i = elems.length - 1; i >= 0; i-- ) {
				this.items.push(elems[i]);
			}

			// set DOM properties for each items
			for ( var i = 0, len = this.items.length; i < len; i++ ) {
				var item = this.items[i];
				item._offsetHeight = item.offsetHeight;
				if ( item.offsetParent !== null ) {
				item._offsetTop = item.offsetTop + (item.offsetParent.offsetTop);
			} else {
				item._offsetTop = item.offsetTop;
			}
				item._offsetBottom = item._offsetTop + item._offsetHeight;
				//item._state = '';
			}

			refresh();

		},

		destroy: function () {
			// nothing for now
		},

		update: function () {

			// get the scrollTop and scrollBottom
			var scrollTop = scrollTopY(),
				scrollBottom = scrollTop + window.innerHeight;

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

					item._state = 'inside';
					item.classList.add( 'inside' );
					item.classList.remove( 'past' );
					item.classList.remove( 'future' );

				}

			}

		}
	}

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
