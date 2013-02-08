!!OUTDATED!!
============

ChariTi Manual Test Plan
========================

This document describes the manual test plan for ChariTi applications.

Application Settings
--------------------

1.	SpringBoard
	* Verify application icon
	* Verify application name
	* Verify application splash screen
2.	Application
	* NavigationBar logo is correct and appropriately sized
	* Colors are correct (and visible on light backgrounds)
	* Tabs are correct, including icons and titles
	* Loading screen (when first selecting a tab) looks correct
3.	Settings
	* TOS/PP is visibile, if applicable
	* Verify copyright
4.	Tabs
	* Each tab loads appropriate content

Tab Configuration
-----------------

*	Blog, News, Events, Facebook
	1. Dates are properly being parsed/display
	2. Open an article
		1. All data is appropriately parsed
		2. ActionBar opens
			1. Verify Facebook sharing text is correct
			2. Verify Twitter sharing text is correct
			3. Verify e-mail sharing text is correct
		3. Close article
*	Donate
	1. Content is correct
	2. "Donate" button properly opens donate URL
*	Flickr
	1. Open an album
		1. Open a photo
			1. Photo properly loads
			2. Tap on photo, description is available (tap again to dismiss)
			3. Close photo
		2. Close album
*	Map
	1. Content is correct
	2. All pins are visible
*	PDF, Text
	1. Content is correct
*	Twitter
	1. Dates are properly being parsed/display
	2. Click on tweet
		1. Verify retweet text is correct
		2. Verify reply text is correct
*	Web
	1. Content is correct
	2. Click a link
		1. "Refresh" icon turns to "stop" icon
		2. Back button is available upon page load
		3. Press back button
		4. Forward button is available
		5. Press refresh button
		6. Open in Safari
*	Youtube
	1. Dates are properly being parsed/display
	2. Open a video
		1. Appropriate YouTube video page is displayed
		2. Close video