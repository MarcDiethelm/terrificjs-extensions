terrificjs-extensions
=====================

Adds some sugar and enhancements to @brunschgi's excellent Terrificjs frontend framework.

## Getting started

Load the file [terrific-extensions.js](https://github.com/MarcDiethelm/terrificjs-extensions/blob/master/terrific-extensions.js) someplace after the Terrific library and before the application bootstrap.

## Tc.Module extensions

### Tc.Module.prototype.$$
 Select elements in the module context.
 * @author Marc Diethelm <marc.diethelm@namics.com>
 * @param {string} selector
 * @returns {jQuery} – jQuery collection

```js
this.$$(selector)
```
### Tc.Module.prototype.bindAll
 Bind methods to Terrific module context. Commonly used on event handler functions.
 Inspired by Underscore's [bindAll](http://underscorejs.org/#bindAll).
 * @author Marc Diethelm <marc.diethelm@namics.com>
 * @author Simon Harte <simon.harte@namics.com>
 * @param {...string} methods - Names of methods each as a param.
 * @return {boolean} - Returns true if binding succeeds, throws an exception otherwise.

```js
this.bindAll(funcName [,funcName...])
```

### Tc.Module.prototype.getName
Get the name of the Terrific module
 * @author Remo Brunschwiler <remo.brunschwiler@namics.com>
 * @author Mathias Hayoz <mathias.hayoz@namics.com>
 * @returns {string} – Module name

```js
this.getName()
```

### Tc.Module.prototype.subscribe
 Simplify connector channel subscription

 Simpler subscribe without need for the second parameter to sandbox.subscribe `this` which is often forgotten. Additionally this method allows connecting to multiple channels at once.
 * @author Simon Harte <simon.harte@namics.com>
 * @param {...string} channels - Connector channels to subscribe to

```js
this.subscribe(chanName [,chanName...])
```

### Tc.Module.prototype.template
Micro-templating for modules. Extrapolates {{= foo }} variables in strings from data. Much smarter than string concatenation and massively smaller and faster than using a full-blown template engine.

This function is a remix of
- Simple JavaScript Templating – John Resig - http://ejohn.org/ - MIT Licensed
- https://gist.github.com/topliceanu/1537847
- http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery

This code incorporates a fix for single-quote usage.
* @author Marc Diethelm <marc.diethelm@namics.com>
* @param {string} str - Template
* @param {object} [data] – Optional, renders template immediately if present. Data to use as the template context for variable extrapolation.
* @returns {function|string} - Template function, to render template with data, or if data was supplied already the rendered template.

```js
this.template(str, data)
```

## Contributing
- Install Node.js
- `npm install` Installs test dependencies
- `npm test` Run JSHint

[And follow these general rules](https://github.com/MarcDiethelm/contributing/blob/master/README.md)
