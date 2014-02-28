/*!
 * Heeere.js 0.1
 * MIT licensed
 *
 * Copyright (C) 2013 Vincent De Oliveira, http://iamvdo.me
 */
(function () {

	'use strict';

	var heeere;

	function refresh () {

		requestAnimFrame(refresh);
		heeere.update();

	}

	function goHeeere (elem, method, options) {

		var target = document.querySelector(elem);
		if ( target !== null ) {
			method.call(null, target, options);
		}

	}

	function add (target, options) {

		heeere = new Heeere(target, options);
		heeere.init();

	}

	function remove (target) {

		heeere.destroy();

	}

	function scrollTopY () {

		return window.pageYOffset || document.documentElement.scrollTop;

	}

	function Heeere (el, options) {

		this.element = el;

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

					if ( item._state !== 'past' ) {
						item._state = 'past';
						item.classList.add( 'past' );
						item.classList.add( 'show' );
						item.classList.remove( 'future' );
					}
				}
				// Below the viewport
				else if( item._offsetTop + (item._offsetHeight * this.options.viewportFactor) > scrollBottom ) {

					if ( item._state !== 'future' ) {
						item._state = 'future';
						item.classList.add( 'future' );
						item.classList.remove( 'past' );
						item.classList.remove( 'show' );
					}
				}
				// Inside the viewport
				else {
					if ( item._state === 'past' ) item.classList.remove( 'past' );
					if ( item._state === 'future' ) item.classList.remove( 'future' );
					item._state = '';
				}

			}

		}
	}

	// add to global namespace
	window.heeere = {
		bind: function (elem, options) {
			goHeeere(elem, add, options);
		},
		unbind: function (elem) {
			goHeeere(elem, remove);
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
