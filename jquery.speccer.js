if (!($ = window.jQuery)) {
	script = document.createElement( 'script' );
	script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
	script.onload = releasetheKraken;
	document.body.appendChild(script);
} else {
	releasetheKraken();
}

function releasetheKraken() {
	/**
	 * Speccer.js
	 * ------------------------------------------------------
	 * Author: Jeroen Ransijn
	 * Company: Aan Zee
	 */
	// ;(function($) {

	var Speccer = window.Speccer = {};

	Speccer.settings = {
		'$el' : $('body')
	};

	Speccer.extend = function (options) {
		if (options) { $.extend(settings, options); }
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

	Speccer.format = function (builder) {
		var uniques = $.unique(builder);

		return $.map(uniques, function (val) {
			if (val[0] !== '/') {
				return '.' + val + ' {}';
			} else {
				return val;
			}
		}).join('\n');
	};

	Speccer.render = function () {
		var _this = this;
		var builder = [];

		if (this.map) {
			builder = $.map(this.map, function (val, index) {
				var sections = [];
				sections.push(val['classes']);

				if (val['children']) {
					$.each(_this.renderRecursive(val['children']), function (index, val) {
						$.merge(sections, val);
					});
				}

				sections.push("/* end: " +  val['classes'] + " */ \n");
				return sections;
			});

			return this.format(builder);
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
				classes.push(val['classes'].split(/\s+/));
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

	console.log(window.Speccer.render());
}