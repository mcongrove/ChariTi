![](https://github.com/mcongrove/CharitTi/raw/master/Chariti.png)

### An open-source Titanium project that allows charities to quickly build mobile applications.
###### Created and maintained by Matthew Congrove
###### NOTICE: In order to ensure your application is easily updated to the latest version of the ChariTi framework, please keep all edits to the `/app/lib/data/` folder.





# Overview
The ChariTi framework is built to allow the often-times small team of staffers at charities around the world to build a mobile application. This is achieved by removing the requirement for a highly-knowledgeable technical staff or costly app development firm and instead allowing app creation and management by anyone from a marketing director to an intern.





# Technical Information
**Currently supports:**

- iPhone
- iPad (zoomed)

**Coming soon:**

- Android
- iPad (split-screen)

**Requirements:**
##### _We are actively working to remove the necessity for you to download or install any software. This should be available in the 1.1 or 1.2 release of ChariTi._

- [Appcelerator Titanium Studio](http://www.appcelerator.com/platform/titanium-studio)
- [Appcelerator Titanium Mobile SDK](http://www.appcelerator.com/platform/titanium-sdk) v2.1+
- [Titanium Alloy](https://github.com/appcelerator/alloy)





# Getting Started
- Replace the `/app/lib/data/logo@2x.png` file with your logo (must be 52px tall)
- Replace the `/app/lib/data/logo.png` file with your logo (must be 26px tall and the same aspect ratio as `logo@2x.png`)
- Open `/app/lib/data/app.json` (this file is what your application is built on)
- Edit the `app.json` file using the _Configuration Options_ below to create your application





# Configuration Options
Each `tabs` item requires a `title`, an `image` and a component `type`. Some components type also have their own required values (noted below).

The `image` can be any one of the pre-bundled images located in `/app/assets/icons/`, or a custom location.

### Component Types
- Blog
 + feed - RSS feed URL
- Donate
 + file - A local HTML file stored in `/app/lib/data/`, e.g. `/data/donate.html`
- Facebook
 + feed - RSS feed URL, e.g. `http://www.facebook.com/feeds/page.php?id=FACEBOOK_PAGE_ID&format=rss20`
- Flickr
 + username - Flickr username
 + apiKey - [Flickr API key](http://www.flickr.com/services/api/keys/apply/)
- Map
 + points - An array of map locations (see example below)
- News
 + feed - RSS feed URL
- PDF
 + url - URL to a PDF
- Text
 + heading - The heading to display
 + text - The text to display
- Web
 + url - Website URL _or_
 + html - HTML code
- YouTube
 + username - YouTube username

### Map Points Example
	"points": [
		{
			"latitude": "28.24560022171899",
			"longitude": "-80.72571516036987",
			"pinColor": "Ti.Map.ANNOTATION_RED",
			"title": "Place A",
			"subTitle": "This is a subtitle"
		},
		{
			"latitude": "28.24704626421908",
			"longitude": "-80.73882579803467",
			"pinColor": "Ti.Map.ANNOTATION_RED",
			"title": "Place B",
			"subTitle": ""
		}
	]





# Help
At this time, we highly suggest that anyone using ChariTi be knowledgeable in Titanium, or employ the assistance of a certified Appcelerator partner.

We're actively working on removing the requirement for downloading or installing any software, allowing charities to easily create and update applications without _any_ assistance. This is targeted for the 1.1 or 1.2 release of ChariTi.

Any bugs should be reported using the [ChariTi GitHub Issues](https://github.com/mcongrove/CharitTi/issues) page.





# Helping
If you'd like to help develop or maintain ChariTi, please fork the code and submit a pull request when you're done.

We highly appreciate any generic, high-level components that we can add to our existing set. Please be sure to maintain the code standards we've set using existing components as an example.

Bug testing and fixing is **HIGH** priority, and assistance will be rewarded with a huge "Thank you!".

If you have bigger plans in mind (or want to help us with the ones we're thinking of), please send an e-mail to <mcongrove@appcelerator.com>.





# Acknowledgements
### ChariTi thanks the following for their help and inspiration throughout this project:
Rick Blalock, Tony Lukasavage, Dennis Ashby, Elyse Phillips, Gregory DiPaolo, Mark Aronica, Sandeep Johri, Jeff Haynie, Maria Lu and the rest of the team at Appcelerator, Ray Miranda, Ivan Mathy, Oleg Polyakov, Mads Moller, and the entire crowd of developers at Appcelerator's 2012 Hack-to-Help.