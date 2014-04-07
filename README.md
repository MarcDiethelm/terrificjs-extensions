terrificjs-extensions
=====================

Adds some sugar and enhancements to @brunschgi's excellent Terrificjs frontend framework.

## Tc.Module extensions

### Tc.Module.prototype.subscribe
 Simplify connector channel subscription

 Because the second parameter to sandbox.subscribe() (this) often is forgotten.
 Plus, connecting to multiple channels requires you to call subscribe for every channel.
 * @author Simon Harte <simon.harte@namics.com>
 * @param {...string} channels - connector channels to subscribe to

```js
this.subscribe(chanName [,chanName...])
```

### Tc.Module.prototype.$$
 Select elements in the module context. Usage: this.$$(selector)
 * @author Marc Diethelm <marc.diethelm@namics.com>
 * @param {string} selector
 * @returns {jQuery} – jQuery collection

```js
this.$$(selector)
```
### Tc.Module.prototype.bindAll
 Bind methods to Terrific module context.  Usage: this.bindAll(funcName [,funcName...])
 * @author Marc Diethelm <marc.diethelm@namics.com>
 * @param {...string} methods - Names of methods each as a param.
 * @return {boolean|undefined} - Returns true if binding succeeds, throws an exception otherwise.

```js
this.bindAll(funcName [,funcName...])
```

### Tc.Module.prototype.getName
Get the name of the Terrific module
 * @author Remo Brunschwiler <remo.brunschwiler@namics.com>
 * @returns {string} – Module name

```js
this.getName()
```

### Tc.Module.prototype.template
Micro-templating for modules. Extrapolates {{= foo }} variables in strings from data. Can be used instead of string concatenation.

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
