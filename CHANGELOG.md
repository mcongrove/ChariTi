Change Log
========================

This document describes the high-level changes made for each version. For a complete list of changes, please refer to the [ChariTi GitHub repository](http://github.com/mcongrove/ChariTi/).

v 1.2.2 (11-??-2013)
--------------------
*	StatusBar styling now based on themes
*	Added menu header for Settings if menu headers used elsewhere
*	Better color determinations
*	Easier-to-use map settings
*	Fixed missing toolbar on web view
*	Fixed UI problems for PDF screen
*	Fixed UI inconsistencies for Settings screen
*	Fixed file misnaming, misreferences
*	Widgets are now self-contained

v 1.2.1 (11-18-2013)
--------------------
*	Using native toast notifications for Android
*	Fixed detail navigation for Android
*	Fixed podcast auto-play duplication
*	Fixed slide menu headers on Android
*	Fixed application update process
*	Fixed over-the-air updates
*	Improved framework version detection

v 1.2.0 (11-14-2013)
--------------------
*	Support for iOS 7
*	Brand new icons for iOS 7, custom-made for ChariTi!
*	Added Share tab
*	Added support for tab headers in slide menu
*	Added support for scroll-to-top
*	Added support for Asian characters
*	Updated pull-to-refresh widget
*	Android now supports pull-to-refresh
*	Updated social widget
*	Podcast now supports offline listening
*	Made slide menu faster
*	Smarter color selections based on configuration
*	Removed 'text' color setting (see above)
*	Removed global 'screenAdded' and 'tabletScreenAdded' events
*	Removed alerts in favor of toasts
*	Fixed handling of unavailable network situations
*	Fixed slide menu jitters
*	Fixed Flickr gesture collisions
*	Fixed Flickr album math problems
*	Fixed date edge-case calculations
*	Added URL scheme support for PEEK
*	Added URL normalization for PEEK
*	Fixed image downloading for PEEK
*	Removed desktop application
*	Removed command line scripts
*	Developer documentation

v 1.1 (02-26-2013)
------------------
*	Added initial Android support
*	Added tablet support (iPad + Android Tablet)
*	Added a preview application ("ChariTi PEEK")
*	Added support for ACS push notifications
*	Added a sliding menu that can optionally replace tabs
*	Added Podcast tab (follows iTunes Podcast format)
*	Added Vimeo tab
*	Removed Twitter tab due to API changes
*	Merged Blog and News tabs into one, now called RSS
*	Multiple tabs of the same type are now supported
*	Adding support for file manifests in JSON configuration file
*	Added more sharing options
*	Converted Facebook model to utilize JSON instead of XML
*	Fixed memory management for controller stacking
*	App now removes out-dated database tables
*	Adding support for links in articles
*	Added ChariTi version migration
*	Tabs now refresh more smarter (sic)

v 1.0.1 (01-22-2013)
--------------------
*	Implemented controller stacking
*	Added support for more than 5 tabs (via a '…' tab)
*	Adds pull-to-refresh for various tabs
*	Images are now supported in RSS feeds (via 'media:content')
*	Added in-article navigation for various controllers
*	Changed Donate tab to accept labels instead of a local HTML file
*	Updated UI design
*	Added a Desktop application for compiling

v 1.0 (01-12-2013)
------------------
*	Initial release
*	Supports iPhone, iPad (zoomed mode)