/**
 * The loading overlay widget
 * 
 * @class Widgets.com.mcongrove.loading
 */
if(Ti.Platform.osname === "mobileweb") {
	$.Loading.duration = 100;
}

$.Loading.start();