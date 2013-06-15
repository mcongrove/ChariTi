var CONFIG = arguments[0] || {};

if(CONFIG.up && typeof CONFIG.up == "function") {
	$.arrowUp.addEventListener("click", CONFIG.up);
} else {
	$.arrowUp.opacity = 0.4;
}

if(CONFIG.down && typeof CONFIG.down == "function") {
	$.arrowDown.addEventListener("click", CONFIG.down);
} else {
	$.arrowDown.opacity = 0.4;
}

// if(CONFIG.favIcon && typeof CONFIG.favIcon == "function") {	
	// $.favButton.addEventListener("load", CONFIG.favIcon);	
// }

if(CONFIG.favorite && typeof CONFIG.favorite == "function") {	
	$.favButton.addEventListener("click", CONFIG.favorite);	
} else {
	$.favButton.opacity = 0.4;
}
