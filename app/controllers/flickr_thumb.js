var DATA = arguments[0] || {};

$.Image.id		= DATA.id || 0;
$.Image.image	= DATA.image || "";
$.Image.top		= DATA.top || "0dp";
$.Image.left	= DATA.left || "0dp";

if(DATA.bottom) {
	$.Image.bottom	= "10dp";
}