terrificjs-extensions
=====================

Adds some sugar and enhancements to @brunschgi's excellent Terrificjs frontend framework.

## Getting started

Load the file [terrific-extensions.js](https://github.com/MarcDiethelm/terrificjs-extensions/blob/master/terrific-extensions.js) someplace after the Terrific library and before the application bootstrap.

## Tc.Module extensions

### Tc.Module.prototype.$
 Select elements in the module context.
 * `@param {string} selector`
 * `@returns {jQuery}` – jQuery collection

```js
this.$(selector)
```
### Tc.Module.prototype.$$
deprecated, alias of Tc.Module.prototype.$

### Tc.Module.prototype.bindAll
 Bind methods to Terrific module context. Commonly used on event handler functions.
 Inspired by Underscore's [bindAll](http://underscorejs.org/#bindAll).
 * `@param {...string} methods` – Names of methods each as a param.
 * `@return {module}` – Returns the module instance for chaining.

```js
this.bindAll(funcName [,funcName...])
```

### Tc.Module.prototype.getName
Get the name of the Terrific module
 * `@returns {string}` – Module name

```js
this.getName()
```

### Tc.Module.prototype.subscribe
 Simplify connector channel subscription

 Simpler subscribe without need for the second parameter to sandbox.subscribe `this` which is often forgotten. Additionally this method allows connecting to multiple channels at once.
 * `@param {...string} channels` – Connector channels to subscribe to
 * `@return {module}` – Returns the module instance for chaining.

```js
this.subscribe(chanName [,chanName...])
```

### Tc.Module.prototype.template
Micro-templating for modules. Extrapolates {{= foo }} variables in strings from data. Much smarter than string concatenation and massively smaller and faster than using a full-blown template engine.

This function is a remix of
- [Simple JavaScript Templating](http://ejohn.org/blog/javascript-micro-templating/) by John Resig
- https://gist.github.com/topliceanu/1537847
- http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery

This code incorporates a fix for single-quote usage.
* `@param {string} str` – Template
* `@param {object} [data]` – Optional, renders template immediately if present. Data to use as the template context for variable extrapolation.
* `@returns {function|string}` – Template function, to render template with data, or if data was supplied already the rendered template.

```js
this.template(str, data)
```

## Contributing
- Install Node.js
- `npm install` Installs test dependencies
- `npm test` Run JSHint

[And follow these general rules](https://github.com/MarcDiethelm/contributing/blob/master/README.md).
