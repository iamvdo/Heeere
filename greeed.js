/*!
 * Greeed.js 1.1.0
 * MIT licensed
 *
 * Copyright (C) 2014 Vincent De Oliveira, http://iamvdo.me
 */
(function () {

	"use strict";

	var greeed;

	function goGreeed (grid, method, options) {

		var target = document.querySelector(grid);
		if (target !== null) {
			method.call(null, target, options);
		}
	}

	function add (grid, options) {

		greeed = new Greeed(grid, options);
		greeed.init();

	}

	function remove (grid) {

		greeed.destroy();

	}

	function Greeed (elem, options) {

		this.grid = elem;
		this.nbColumns = 0;
		this.childs = this.columns = this.options = [];

		this.rootFontSize = getComputedStyle(document.documentElement).getPropertyValue('font-size').replace('px','');

		for(var key in options){
			if(options.hasOwnProperty(key)){
				this.defaults[key] = options[key];
			}
		}
		this.options = this.defaults;

	}

	Greeed.prototype = {

		defaults: {
			elementColumn: 'li',
			elementColumnInner: 'ul',
			classColumn: 'Greeed-column',
			classColumnInner: 'Greeed-column-inner',
			classItem: 'Greeed-item',
			classFakeItem: 'Greeed-item--fake',
			layout: 'table',
			units: 'fluid'
		},

		init: function () {

			// Get elements
			this.childs = Array.prototype.slice.call(this.grid.children);
			// DOM columns
			this.columnsDOM = [];

			this.checkMQ();

			var scope = this;
			this.startCheckMQ = function(event) { scope.checkMQ(event); };

			window.addEventListener('resize', this.startCheckMQ, false);

			if ( this.options.afterInit ) {
				this.options.afterInit();
			}

		},

		destroy: function () {
			window.removeEventListener('resize', this.startCheckMQ, false);
		},

		createColumns: function ( greeedWidth ) {

			// create an Array of columns
			this.columns = new Array(this.nbColumns);
			for (var i = 0; i < this.nbColumns; i++) {
				this.columns[i] = [];
				// set height
				this.columns[i]._offsetHeight = 0;
			}

			for (var i = 0; i < this.childs.length; i++) {

				var smallestColumnHeight = 0;
				var smallestColumnIndex = 0;
				// find the smallest column to place the next child
				for (var j = 0; j < this.columns.length; j++) {
					var columnHeight = this.columns[j]._offsetHeight;
					if(j === 0){
						smallestColumnHeight = columnHeight;
					}
					if(columnHeight === 0){
						smallestColumnIndex = j;
						break;
					}
					if(columnHeight < smallestColumnHeight){
						smallestColumnIndex = j;
					}
				}

				// add child to the smallest height column
				this.columns[smallestColumnIndex].push(this.childs[i]);

				// add an id (keep the old position)
				this.childs[i]._id = i;

				// update column height
				this.columns[smallestColumnIndex]._offsetHeight += this.childs[i].offsetHeight;

			}

			// find the max-height column
			var maxHeightColumn = 0;
			for (var i = 0; i < this.columns.length; i++) {

				var height = this.columns[i]._offsetHeight;

				if( height >= maxHeightColumn){
					maxHeightColumn = height;
				}

			}

			var grid = document.createDocumentFragment();

			for (var i = 0; i < this.columns.length; i++) {

				var column = document.createElement(this.options.elementColumn);
					column.className = this.options.classColumn;

					if (this.options.layout === 'table') {
						column.style.display = 'table-cell';
						column.style.verticalAlign = 'top';
					} else {
						column.style.styleFloat = column.style.cssFloat = 'left';
						column.style.display = 'block';
						if (this.options.units === 'fixed') {
							column.style.width = Math.floor( greeedWidth / this.nbColumns ) + 'px';
						} else {
							column.style.width = (100 / this.nbColumns ) + '%';
						}
					}


				if (this.options.elementColumnInner) {
					var columnElement = document.createElement(this.options.elementColumnInner);
						columnElement.className = this.options.classColumnInner;
				} else {
					var columnElement = column;
				}


				for (var j = 0; j < this.columns[i].length; j++) {
					this.columns[i][j].classList.add(this.options.classItem);
					columnElement.appendChild(this.columns[i][j]);
				}

				if( this.columns[i]._offsetHeight < maxHeightColumn && this.options.classFakeItem){

					var fake_elem = document.createElement(this.options.elementColumn);
						fake_elem.className = this.options.classItem + ' ' + this.options.classFakeItem;
						fake_elem.style.height = maxHeightColumn - this.columns[i]._offsetHeight + 'px';

						columnElement.appendChild(fake_elem);
				}

				if (this.options.elementColumnInner) {
					column.appendChild(columnElement);
				}

				// add the column to the DOM columns array
				this.columnsDOM[i] = column;

				grid.appendChild(column);

			}

			this.grid.innerHTML = '';
			this.grid.appendChild(grid);

			if (this.options.layout === 'table') {
				this.grid.style.display = 'table';
				this.grid.style.tableLayout = 'fixed';
			}

			if( this.options.afterLayout ){
				this.options.afterLayout();
			}

		},

		setColumnsWidth: function ( greeedWidth ) {

			// update width to match parent width
			var newColumnWidth = Math.floor( greeedWidth / this.nbColumns );
			var greeedWidthCalc = newColumnWidth * this.nbColumns;
			var pixelsLeft = greeedWidth - greeedWidthCalc;

			for (var i = 0; i < this.columnsDOM.length; i++) {
				var colWidth = (pixelsLeft > 0) ? newColumnWidth + 1 : newColumnWidth;
				pixelsLeft--;
				this.columnsDOM[i].style.width = colWidth + 'px';
			}

		},

		checkMQ: function (event) {

			var lastNbColumns = this.nbColumns;

			this.windowWidth = window.innerWidth;

			// for each breakpoints
			for (var i = 0; i < this.options.breakpoints.length; i++) {
				var point = this.options.breakpoints[i],
					size = point * this.rootFontSize;

				// set how many columns to create
				if( window.innerWidth < size ) {
					this.nbColumns = i + 1;
					break;
				} else {
					this.nbColumns = i + 2;
				}

			}

			if (this.options.units === 'fixed') {

				// Get the width of the greeed, every time
				var greeedWidth = Math.floor(getComputedStyle(this.grid).getPropertyValue('width').replace('px',''));

				// create columns
				this.createColumns( greeedWidth );

				// set columns width, every time
				this.setColumnsWidth( greeedWidth );

			} else {

				// create columns
				this.createColumns();

			}

		}
	};

	window.greeed = {
		bind: function (elem, options) {
			goGreeed(elem, add, options);
		},
		unbind: function (elem) {
			goGreeed(elem, remove);
		}
	};

})();
