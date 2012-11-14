var DATA = arguments[0] || {};

Ti.API.debug("flickr_thumb");
Ti.API.trace(JSON.stringify(DATA));

$.Image.id		= DATA.id || 0;
$.Image.image	= DATA.image || "";
$.Image.top		= DATA.top || "0dp";
$.Image.left	= DATA.left || "0dp";

if(DATA.bottom) {
	$.Image.bottom	= "10dp";
}