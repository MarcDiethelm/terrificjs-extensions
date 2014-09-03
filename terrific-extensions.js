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
	 * @param {string} selector
	 * @returns {object} - jQuery collection
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
	* @param {string} selector
	* @returns {object} - jQuery collection
	*/
	Tc.Module.prototype.$$ = Tc.Module.prototype.$;

	/**
	 * Bind methods to Terrific module context.  Usage: this.bindAll(funcName [,funcName...])
	 * Inspired by Underscore's bindAll. http://underscorejs.org/#bindAll
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...string} methods - Names of methods each as a param.
	 * @return {module} - Returns the module instance for chaining.
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
	 * @returns {string} - Module name
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
	 * Simplify connector channel subscription
	 *
	 * Because the second parameter to sandbox.subscribe `this` is often forgotten.
	 * Additionally this method allows connecting to multiple channels at once.
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...string} channels - Connector channels to subscribe to
	 * @return {module} - Returns the module instance for chaining.
	 */
	Tc.Module.prototype.subscribe = function subscribe(channels) {
		var i = 0,
			args = arguments,
			argLen = args.length
		;

		for (i; i < argLen; i++) {
			this.sandbox.subscribe(args[i], this);
		}

		return this;
	};

	/**
	 * Get all channels the module is currently subscribed to
	 *
	 * @author Simon Harte <simon.harte@namics.com>
	 * @return {object, string} channels - Returns the array of connected channels
	 */
	Tc.Module.prototype.getConnectors = function getConnectors() {
		var channels = [],
			chan,
			curr;

		for (chan in this.connectors) {
			if (this.connectors.hasOwnProperty(chan)) {
				curr = this.connectors[chan];
				channels.push(curr.connectorId);
			}
		}
		
		return channels;
	};

	/**
	 * Fire on all channels the current module is subscribed to
	 *
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {string} method - Function to execute in connected modules
	 * @param {object} [data] - The data to provide to your connected modules (optional)
	 * @return {object} this - Returns the module instance for chaining
	 */
	Tc.Module.prototype.fireAll = function fireAll(method, data) {
		var channels = this.getConnectors();

		this.fire(method, data || {}, channels);

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
	 * @param {string} str - Template
	 * @param {object} [data] - Optional, renders template immediately if present. Data to use as the template context for variable extrapolation.
	 * @returns {function|string} - Template function, to render template with data, or if data was supplied already the rendered template.
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

})($ || jQuery);
