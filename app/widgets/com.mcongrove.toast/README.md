Toast-style Notification Widget
-------------------
A toast-style notification widget for Titanium Alloy.

Example Usage
-------------

	Alloy.createWidget("com.mcongrove.toast", null, {
		text: "This is a notification",
		duration: 2000,
		view: $.Wrapper
	});

Options
-------
Parameter | Type     | Default |
----------|----------|---------|
text      | `String` |         |
duration  | `Number` | 3000    |
view      | `View`   |         |

Changelog
---------
* 1.1
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