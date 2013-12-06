Tabs Widget
-------------------
A custom TabGroup widget for Titanium Alloy.

Example Usage
-------------

###### Alloy View (XML)

	<Require type="widget" src="com.mcongrove.tabs" id="Tabs" />

###### Alloy Controller (JS)

	// Create our tab items
	var tabs = [
		{ id: 0, title: "Home", image: "/images/home.png" },
		{ id: 1, title: "Contact", image: "/images/phone.png" },
		{ id: 2, title: "Settings", image: "/images/gear.png" }
	];

	// Initialize the tab bar
	$.Tabs.init({
		nodes: tabs,
		more: "/images/dotDotDot.png",
		color: {
			background: "#000",
			active: "#222",
			text: "#FFF"
		}
	});
	
	// Set the first tab as active
	$.Tabs.setIndex(0);
	
	// Add an event listener on the tabs
	$.Tabs.Wrapper.addEventListener("click", handleTabClick);
	
	// Handle the click event on a tab
	function handleTabClick(_event) {
		if(typeof _event.source.id !== "undefined") {
			openScreen(_event.source.id);
		}
	}

Options
-------
Parameter        | Type     | Default |
-----------------|----------|---------|
nodes            | `Array`  |         |
more             | `String` |         |
color            | `Object` |         |
color.background | `String` |         |
color.active     | `String` |         |
color.text       | `String` |         |

###### Node Parameters:

Parameter | Type     | Description      |
----------|----------|------------------|
id        | `Number` | Node ID (unique) |
title     | `String` | Node title       |
image     | `String` | Icon path        |

Methods
-------
Function | Parameters | Description                               |
---------|------------|-------------------------------------------|
clear    |            | Removes all nodes                         |
setIndex | `index`    | The index of the item to mark as selected |

Changelog
---------
* 1.2
	* Initial commit as separate module; see [ChariTi](https://github.com/mcongrove/ChariTi/tree/master/app/widgets) for previous versions

License
-------

Copyright 2013 Matthew Congrove

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.