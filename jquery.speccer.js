/**
 * Speccer.js
 * ------------------------------------------------------
 * Author: Jeroen Ransijn
 * Company: Aan Zee
 * Still contains a lot of bugs
 */
if (!($ = window.jQuery)) {
	script = document.createElement( 'script' );
	script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
	script.onload = releasetheKraken;
	document.body.appendChild(script);
} else {
	releasetheKraken();
}

function releasetheKraken() {
	// ;(function($) {

	var Speccer = window.Speccer = {};

	Speccer.settings = {
		'$el' : $('body')
	};

	Speccer.extend = function (options) {
		if (options) { $.extend(this.settings, options); }
		return $.extend({}, this);
	};

	Speccer.init = function () {
		var _this = this;

		this.map = this.settings.$el.children().map(function () {
			var obj = _this.specRecursive($(this));

			if (obj['className'] || obj['children']) {
				return obj;
			}
		}).get();

		return this;
	};

	Speccer.specRecursive = function ($el) {
		var _this = this;
		var className = $el.attr('class');
		var children;

		if ($el.children().length > 0) {
			children = $el.children().map(function () {
				return _this.specRecursive($(this));
			}).get();
		}

		return {
			classes: className,
			children: children
		};
	};

	Speccer.format = function () {
		var sortedUniques = [];

		$.each(this.builder, function (index, val) {
			if ($.inArray(val, sortedUniques) <= 1 && val !== undefined) {
				sortedUniques.push(val);
			}
		});

		return $.map(sortedUniques, function (val) {
			if (val[0] !== '/') {
				return '.' + val + ' {}';
			} else {
				return val;
			}
		}).join('\n');
	};

	// @return {Array} builder, complete list of all elements
	Speccer.render = function () {
		var _this = this;
		// this.builder = [];

		if (this.map) {
			this.builder = $.map(this.map, function (val, index) {
				var sections = [];
				if (val['classes'] !== undefined) {
					$.each(val['classes'].split(/\s+/), function (index, val) {
						sections.push(val);
					});
				}

				if (val['children']) {
					$.each(_this.renderRecursive(val['children']), function (index, val) {
						sections.push(val);
					});
				}

				sections.push("/* end: " +  val['classes'] + " */ \n");
				return sections;
			});

			return this;
		} else {
			// init for lazy people
			this.render(this.init());
		}
	};

	Speccer.renderRecursive = function (children) {
		var _this = this;
		return $.map(children, function (val, index) {
			var classes = [];

			if (val['classes']) {
				$.each(val['classes'].split(/\s+/), function (index, val) {
					classes.push(val);
				});
				// classes.push();
			}

			if (val['children']) {
				$.each(_this.renderRecursive(val['children']), function (index, val) {
					classes.push(val);
				});
			}

			return classes;
		});
	};
	// }(jQuery));

	var mySpeccer = window.Speccer.extend();

	console.log(mySpeccer.init().render().format());
}