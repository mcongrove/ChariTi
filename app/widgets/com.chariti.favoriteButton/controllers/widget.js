var CONFIG = arguments[0] || {};

if(CONFIG.setFavorite && typeof CONFIG.setFavorite == "function") {
	$.toggleFavorite.addEventListener("click", CONFIG.setFavorite);
} else {
	$.toggleFavorite.opacity = 0.4;
}
