/*! Zoom-d - v0.1.0 - 2015-01-18
* https://github.com/danielvaughn/zoom-d
* Copyright (c) 2015 Daniel Vaughn; Licensed MIT */
(function($) {

  // Collection method.
  $.fn.zoomd = function() {
    return this.each(function(i) {
      // Return an initial log for each selected element.
      window.console.log('test: ' + i);
      window.console.log(this);
    });
  };

  // Static method.
  $.zoomd = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.zoomd.options, options);
    // Return something awesome.
    return 'test: ' + options.max;
  };

  // Static method default options.
  $.zoomd.options = {
    max: 5 // X times greater than native image resolution
  };

}(jQuery));
