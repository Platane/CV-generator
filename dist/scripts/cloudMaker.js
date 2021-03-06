var cloudMaker = (function(jQuery){


var ruler = document.createElement('span')
ruler.id = "ruler"
ruler.style.display = "none"
ruler.style.whiteSpace = "nowrap"

jQuery(function(){
	document.getElementsByTagName('body')[0].appendChild(ruler)
})

var size = function( w , css ){
	var $ruler = $( ruler )
	.text( w )
	.css( css )

	return {
		w : $ruler.innerWidth(),
		h : $ruler.innerHeight()
	}
}


/**
 * @param n | int : the generation of the point 
 *                  0 is the center of the spiral. 
 *                  When n grows, the point take distance from the center
 * @param pas | number : the greater pas is, the greater the distance between two points is.
 *                       The pas var produce a different spiral shape (  the greater the pas is, the greater the distance between two branches is)
 * @return a point of the spiral
 **/
var spiraloidePoint = function( n , pas  ){
	var b = Math.sqrt( pas ) * 0.3
	var r = Math.sqrt( n * pas ) * 1.1
	var theta =  r / b
	return {
		x : Math.cos( theta ) * r * 10,
		y : Math.sin( theta ) * r * 10,
	}
}

// just for debugging purpose ..
var drawSpiral = function(){
	
	var l = 500

	var $canvas = $('<canvas>')
	.attr( 'width' , l )
	.attr( 'height' , l )

	var ctx = $canvas[0].getContext('2d')

	ctx.fillStyle = '#12AE34'

	var n = 200,
		pas = 1;
	for(var i=0;i<n;i+=pas){
		var p = spiraloidePoint( i , pas )

		ctx.beginPath()
		ctx.arc( p.x + l/2 , p.y + l/2 , 1 ,  0 , Math.PI*2 , false )
		ctx.fill()
	}

	return $canvas
}

/** 
 * @param r1, r2 are rect as define in compute positions
 *               have the attributes x,y  , x,h
 * @return true if the two rectangle intersect, false else
 * 
 * use separate axis algorithm
 */ 
var intersection = function( r1 , r2 ){

	return r2.x < r1.x + r1.w != r2.x + r2.w < r1.x
	&& r2.y < r1.y + r1.h != r2.y + r2.h < r1.y
	   
}

/** 
 * @param words | arrays of words
 * @param weights | array of number
 * @param css | object of css property, related to font
 * @return array of rect with attributes x,y,size,word,w,h
 *                       the returned array contains the compiled property for each word, not necessary in the same order as words
 *
 * step of the algo 
 *     - compute the size of each word
 *     - sort them by decreasing size
 *     - for each
 *           find the perfect spot
 *                start from the center, then iterate throught a spiral until it does not intersect with another already placed rect
 *           fix it
 **/ 
var computePositions = function compute ( words , weights , css ){

	var rects = []

	for(var i=words.length;i--;){

		var c = Math.log( weights[i] * 3 )
		c = 0.1+weights[i]*weights[i] /20
		css['font-size'] = ( c * 10 ) + 'px'

		var	s = size( words[i] , css )
		rects.push({
			word : words[i],
			w : s.w*1.02,
			h : s.h,
			x : null,
			y : null,
			size : c * 10
		})
	}

	rects = rects.sort( function(a,b){
		return a.w * a.h < b.w * b.h ? 1 : -1
	})


	var close = []

	while( rects.length ){
		// for each rect
		// search a position

		var r = rects.shift();

		// compute the pas of the spiral, based on the size on the rect
		var pas = Math.sqrt( r.w * r.h ) / 1000

		var admissible = false
		for(var n=0; !admissible ; n+=pas ){
			var p = spiraloidePoint( n , pas )

			r.x = p.x - r.w/2
			r.y = p.y - r.h/2
			
			for(var i=close.length;i--;)
				if( intersection( close[i] , r ) )
					break

			admissible = !( i >= 0 )
		}

		close.unshift( r )

	}
	return close
}

/**
 * @param rects | array of rect, as specified in computePositions
 * @return boundary box
 **/
var computeBB = function( rects ){
	var bb = {
		left :  rects[0].x,
		right : rects[0].x + rects[0].w,
		bottom :rects[0].h + rects[0].y,
		top:    rects[0].y,
	}
	for( var i=rects.length-1;i--;){
		if(rects[i].x < bb.left )
			bb.left = rects[i].x
		if(rects[i].y < bb.top )
			bb.top = rects[i].y
		if(rects[i].x + rects[i].w > bb.right )
			bb.right = rects[i].x + rects[i].w
		if(rects[i].y + rects[i].h > bb.bottom )
			bb.bottom = rects[i].y + rects[i].h
	}
	return bb
}

/** 
 * @param rects | array of rect, as specified in computePositions
 * @param css | object of css property, related to font
 * @param dim | object x,y , the dimension of the container
 * @return the cloud element
 **/
var makeElement = function( rects , css , dim ){
	

	var bb = computeBB( rects )


	var r = Math.min( dim.x / ( bb.right - bb.left ) , dim.y / ( bb.bottom - bb.top ) )

	var $container = $('<div>')
	.css({
		'position' : 'relative',
		'width' : ( ( bb.right - bb.left ) * r )+'px',
		'height' : ( ( bb.bottom - bb.top ) * r )+'px',
	})
	.addClass('tag-cloud')

	for( var i=rects.length;i--;){
		$('<span>')
		.text( rects[i].word )
		.css( css )
		.css({
			'left' : ((rects[i].x - bb.left)*r)+'px',
			'top' : ((rects[i].y - bb.top)*r)+'px',
			'position' : 'absolute',
			'font-size' : (rects[i].size*r)+'px',
			'white-space' : 'nowrap'
		})
		.attr( 'data-weight' , rects[i].size*r )
		.appendTo( $container )
	}

	return $container
}

var make = function cloudMaker( words , weights , css , dim ){

	var rects = computePositions( words , weights , css )

	return makeElement( rects , css , dim )
}

return make

})($)