var APP = require("core");

var CONFIG = arguments[0] || {};

$.PreviewWrapper.id = CONFIG.id || 0;
$.text.text = CONFIG.text.replace(/\s*<br[^>]*>\s*/ig, "\n").replace(/<[^>]*>/g, "") || "";