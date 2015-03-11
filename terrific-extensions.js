/**
 * https://github.com/MarcDiethelm/terrificjs-extensions
 * Adds some sugar and enhancements to @brunschgi's excellent Terrificjs frontend framework.
 * @file terrificjs-extensions.js
 * @license MIT
 * @copyright 2014 Marc Diethelm
 */

(function ($) {

	'use strict';


	/**
	 * Select elements in the module context. Usage: this.$(selector)
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} selector
	 * @returns {Object} - jQuery collection
	 */
	Tc.Module.prototype.$ = function $$(selector) {
		return this.$ctx.find(selector);
	};


	/**
	 * Deprecated. Use Tc.Module.prototype.$
	 * Select elements in the module context. Usage: this.$$(selector)
	 * @deprecated Use Tc.Module.prototype.$
	 * @see Tc.Module.prototype.$
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} selector
	 * @returns {Object} - jQuery collection
	 */
	Tc.Module.prototype.$$ = Tc.Module.prototype.$;

	/**
	 * Bind methods to Terrific module context. Usage: this.bindAll(funcName [,funcName...])
	 * Inspired by Underscore's bindAll. http://underscorejs.org/#bindAll
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...String} methods - Names of methods each as a param.
	 * @returns {Module} - Returns the module instance for chaining.
	 */
	Tc.Module.prototype.bindAll = function bindAll(methods) {
		var i = 0,
			args = arguments,
			argLen = args.length,
			methodName
		;

		for (i; i < argLen; i++) {
			methodName = args[i];
			if (typeof this[methodName] === 'function') {
				this[methodName] = $.proxy(this, methodName);
			} else if (typeof methodName === 'string') {
				throw new TypeError('bindAll: Tc.Module.' + this.getName() + '.' + methodName + ' is not a function');
			} else {
				throw new TypeError('Arguments to bindAll must be strings');
			}
		}

		return this;
	};

	/**
	 * Get the name of the Terrific module
	 * @author Remo Brunschwiler <remo.brunschwiler@namics.com>
	 * @author Mathias Hayoz <mathias.hayoz@namics.com>
	 * @returns {String} - Module name
	 */
	Tc.Module.prototype.getName = function getName() {
		var property;
		if (!this._modName) {
			for (property in Tc.Module) {
				if (Tc.Module.hasOwnProperty(property) && property !== 'constructor' && this instanceof Tc.Module[property]) {
					this._modName = property;
					break;
				}
			}
		}

		return this._modName;
	};

	/**
	 * Simplify connector channel subscription. Usage: this.subscribe(channelName [,channelName...])
	 *
	 * Because the second parameter to sandbox.subscribe (this) is often forgotten.
	 * Additionally this method allows connecting to multiple channels at once.
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...String} channels - Connector channels to subscribe to
	 * @returns {Module} - Returns the module instance for chaining
	 */
	Tc.Module.prototype.subscribe = function subscribe(channels) {
		var i = 0,
			args = arguments,
			argLen = args.length,
			channelName
		;

		for (i; i < argLen; i++) {
			channelName = args[i];
			this.sandbox.subscribe(channelName, this);
		}

		return this;
	};

	var tplCache = {};
	/**
	 * Micro-templating for modules. Extrapolates {{= foo }} variables in strings from data.
	 * This function is a remix of
	 * - Simple JavaScript Templating – John Resig - http://ejohn.org/ - MIT Licensed
	 * - https://gist.github.com/topliceanu/1537847
	 * - http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery
	 * This code incorporates a fix for single-quote usage.
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} str - Template
	 * @param {Object} [data] - Optional, renders template immediately if present. Data to use as the template context for variable extrapolation.
	 * @returns {Function|String} - Template function, to render template with data, or if data was supplied already the rendered template.
	 */
	Tc.Module.prototype.template = function template(str, data) {

		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			tplCache[str] = tplCache[str] ||
				template(document.getElementById(str).innerHTML) :
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			/*jshint -W054, -W014 */
			new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +
					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +
					// Convert the template into pure JavaScript
					str.replace(/[\r\t\n]/g, " ")
						.replace(/'(?=[^%]*\}\}>)/g, "\t")
						.split("'").join("\\'")
						.split("\t").join("'")
						.replace(/\{\{=(.+?)\}\}/g, "',$1,'")
						.split("{{").join("');")
						.split("}}").join("p.push('")
					+ "');}return p.join('');");
		/*jshint +W054, +W014 */
		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};

	/**
	 * Save template functions on the module instance using the Tc.Module.prototype.template method.
	 * Either pass in an object with templates or rely on predefined templates in code (default) and/or markup (inline).
	 * If no parameter is passed it will try to get a "templates" object defined on the module.
	 *
	 * Inline templates should be marked up as follows:
	 *
	 * <script type="text/x-dot-template" class="js-template" data-template="templateName"></script>
	 *
	 * Where "templateName" will be the property name on the returned object.
	 * Note that the class name "js-template" is default but can be overwritten using a "selectors" object defined on the module:
	 *
	 * selectors: {
	 *   template: '.your-custom-template-selector'
	 * }
	 *
	 * @author Simon Harte <s.harte@namics.com>
	 * @param {String|Object} [getTemplates] - 'all' | 'inline' | {}
	 * @returns {{}}
	 */
	Tc.Module.prototype.registerTemplates = function registerTemplates(getTemplates) {
		var templateFuncs = {},
			isTemplatesObject = typeof getTemplates === 'object';

		// if no valid parameter is passed
		if (getTemplates != 'inline' && getTemplates != 'all' && !isTemplatesObject && getTemplates !== undefined) {
			throw new TypeError('setupTemplates: optional parameter "getTemplates" must be either "inline", "all" or an object');
		}

		if (getTemplates == 'inline' || getTemplates == 'all') {
			var _this = this,
				selectors = this.selectors;

			// take the template selector defined on module if present
			this.$((selectors && selectors.template) || '.js-template').each(function (i, item) {
				var $target = $(item),
					templateName = $target.data('template'),
					template = $target.html();

				// use Tc.Module.Prototype.template
				templateFuncs[templateName] = _this.template(template);
			});
		}
		if (!getTemplates || getTemplates == 'all' || isTemplatesObject) {
			var templates = isTemplatesObject ? getTemplates : this.templates;

			if (templates) {
				if (typeof templates !== 'object') {
					throw new TypeError('setupTemplates: template collection for module ' + this.getName() + ' must be an object');
				} else {
					var templateName;

					for (templateName in templates) {
						if (templates.hasOwnProperty(templateName)) {
							// use Tc.Module.Prototype.template
							templateFuncs[templateName] = this.template(templates[templateName]);
						}
					}
				}
			} else {
				throw new ReferenceError('setupTemplates: module ' + this.getName() + ' has no templates');
			}
		}

		return templateFuncs;
	}

})(Tc.$);
