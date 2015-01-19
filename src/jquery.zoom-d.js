/*
 * zoom-d
 * https://github.com/danielvaughn/zoom-d
 *
 * Copyright (c) 2015 Daniel Vaughn
 * Licensed under the MIT license.
 */

(function($) {

// Collection method.
$.fn.zoomd = function(options) {
	var styles = window.getComputedStyle(document.documentElement, '');

	var x = $.zoomd(options);

	var prefix = (Array.prototype.slice
					.call(styles)
					.join('')
					.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
				)[1];

	return this.each(function (i) {
		var img = this;

		if (!img.src) {
			console.error('error: selected element must be an image and must have an src attribute declared');
			return false;
		}

		img.onload = function() {
		    var graph = {
		        scale: 1,
		        speed: 1.02,
		        maxScale: 1.5,
		        translate: {
		            x: 0,
		            y: 0
		        },
		        elem: this.parentElement,
		        image: this,
		        baseSize: {
		            w: container.offsetWidth,
		            h: container.offsetHeight
		        },
		        baseOffset: {
		            x: container.offsetLeft,
		            y: container.offsetTop
		        }
		    };

			var allowedScale = (graph.image.naturalWidth / graph.baseSize.w) * options.max;

			var scrollEvent = function(e) {
		        /***
		          STEP 1: Determine the scroll direction
		        ***/ 
		        var zoomDirection;
		        if ('wheelDelta' in e) {
		            if (e.wheelDelta < 0) {
		                zoomDirection = 'out';
		            } else if (e.wheelDelta > 0) {
		                zoomDirection = 'in';
		            }
		        } else if (('detail' in e) && !('wheelDelta' in e)) {
		            if (e.detail > 0) {
		                zoomDirection = 'out';
		            } else if (e.detail < 0) {
		                zoomDirection = 'in';
		            }
		        }

		        /***
		          STEP 2: Preemptively grab the new scale to measure against
		        ***/    
		        var newScale = (zoomDirection && zoomDirection == 'in') ? (graph.scale * graph.speed) : (graph.scale / graph.speed);

		        /***
		          STEP 3: Get current image size
		        ***/
		        var currentGraphSize = {
		            w: graph.baseSize.w * graph.scale,
		            h: graph.baseSize.h * graph.scale
		        }

		        /***
		          STEP 4: Get current image coordinates
		        ***/
		        var currentGraphOffset = {
		            x: graph.baseOffset.x + graph.translate.x,
		            y: graph.baseOffset.y + graph.translate.y
		        }

		        /**
		          STEP 5: Get current mouse coordinates on the image
		        **/
		        var currentMouseCoords = {
		            x: e.pageX - currentGraphOffset.x,
		            y: e.pageY - currentGraphOffset.y
		        };

		        /***
		          STEP 6: Convert mouse coordinates to percentage values
		        ***/
		        var percent = {
		            x: (currentMouseCoords.x / currentGraphSize.w) * 100,
		            y: (currentMouseCoords.y / currentGraphSize.h) * 100
		        }

		        /***
		          STEP 7: Determine the new size of the image after transformation
		        ***/
		        var newGraphSize = {
		            w: graph.baseSize.w * newScale,
		            h: graph.baseSize.h * newScale
		        }

		        /***
		          STEP 8: Get pixel value of transformation change
		        ***/
		        var diff = {
		            x: newGraphSize.w - currentGraphSize.w,
		            y: newGraphSize.h - currentGraphSize.h
		        };

		        /***
		          STEP 9: Determine the level of shift that has occurred
		        ***/
		        var translate = {
		            x: graph.translate.x + -((percent.x / 100) * diff.x),
		            y: graph.translate.y + -((percent.y / 100) * diff.y)
		        }

		        /***
		          STEP 10: Determine whether zooming should be dis-allowed at current scale
		        ***/
		        var allowZoom;
		        if (zoomDirection == 'in') {
		            if (graph.scale > allowedScale) {
		                allowZoom = false;
		            } else {
		                allowZoom = true;
		            }
		        }
		        if (zoomDirection == 'out') {
		            if (graph.scale < 1) {
		                allowZoom = false;
		            } else {
		                allowZoom = true;
		            }
		        }

		        /***
		          STEP 11: Perform transformation
		        ***/
		        if (!allowZoom) { return false; }
	        	var res = 'matrix(' + newScale + ', 0, 0,' + newScale + ',' + translate.x + ',' + translate.y + ')';
	            graph.elem.style[prefix + 'Transform'] = res;
	            graph.elem.style.transform = res;

		        /***
		          STEP 12: Increment translation values
		        ***/
		        graph.translate.x = translate.x;
		        graph.translate.y = translate.y;

		        /***
		          STEP 13: Increment scale values
		        ***/
		        graph.scale = newScale;
		    };

			graph.elem.addEventListener('mousewheel', scrollEvent, false);
			graph.elem.addEventListener('DOMMouseScroll', scrollEvent, false);
		} // end img onload event
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