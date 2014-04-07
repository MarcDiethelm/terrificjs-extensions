/*
 * terrificjs-extensions
 * https://github.com/MarcDiethelm/terrificjs-extensions
 *
 * Copyright (c) 2014 Marc Diethelm
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			}
			,all: [
				 'Gruntfile.js'
				,'terrific-extensions.js'
			]
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('test', ['jshint']);

	grunt.registerTask('default', ['test']);

};
