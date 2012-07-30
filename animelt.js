/*	Animelt, The JavaScript Framework for complex animations
	Beta version, by Gabriel Rubens and Judson B.

	github.com/grsabreu
	gabrielrubensjs.wordpress.com
	gabrielrubensjs.blogspot.com
	
	github.com/
	blog.judsonbsilva.com
	Copyright (C) 2012 - POGLabz

 	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
   
	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($, undefined){
var rCssValue = /([0-9.]+)([a-z%]+)/ig,
	digits = /[0-9.]+/g,
	dTest = /[0-9]/g;
	specials = {},
	quickJ = $( [1] ); 

if( $.browser.webkit ){
	specials.transform = "-webkit-transform";
}
else if( $.browser.moz ){
	specials.transform = "MozTransform";
}
else if( $.browser.opera ){
	specials.transform = "OTransform";
}
else if( $.browser.ie ){
	specials.transform = "-ms-transform";
}

$.fn.animelt = function(props,a,b,c){
	var opts = $.speed( a,b,c ),
		//No-conflict form
		$this = this;

	//Shorcut for custom animations
	if( $.isFunction(props) ){
		$({ p:0 }).animate({ p:1 },{

			step: props,

			duration: opts.duration,

			easing: opts.easing,

			complete: opts.complete

		});
		return this;
	};

	//@nodecss keeps the props of els
	var nodecss = [];

	this.each(function( el ){
		var node = this,
			//@prop keeps the old and new value of prop
			prop = { };
		$.each(props,function( key,val ){
			//Makes the cross-browser
			if( key in specials )
				key = specials[key];
			//Store the origin value
			var oldvalue = "";
			//Tries find the @oldValue in @el.style propertie
			if ( node.style[key] )
				oldvalue = node.style[key];
			//If not tries find the @oldValue in computedStyle of el
			else if ( dTest.test( $(node).css(key) ) )
				oldvalue = $(node).css(key);
			//If it does not find in either the @oldValue takes value 0
			else oldvalue = "0";
			prop[ key ] = [ oldvalue,val ];
		});
		nodecss[ el ] = prop;
	});

	//Run the animation
	$( { p:0 } ).animate({ p:1 },{

		step: function( p ){
			$this.each(function( i,el ){
				//@props gets the props of respective el
				quickJ[0] = el;
			 	var props = nodecss[ i ];
			 	//Makes the 'magic' animation
			 	//Hey man, look at me rockin' now!
				$.each(props,function( prop,val ){
					var ind = 0,
						//@old store the olds values in an array
						old = val[0].match( digits );
					//Uses the jQuery CSS method as Wrapper Pattern
					quickJ.css( 
						prop, 
						val[1].replace(rCssValue,function(exp,num,unit){
							old[ind] = old[ind] || "0";
							Number(num) == Number(old[ind]) ?
								old[ind] = 0 : void 0;							
							var finalvalue = Number(old[ind]) + ( Number(num) - Number(old[ind]) ) * p;							
							ind++;
							return finalvalue + unit;
						}) 
					);
				});
			});
		},

		duration: opts.duration,

		easing: opts.easing,

		complete: opts.complete

	});

	return this;
};
})(jQuery);