ChariTi Release Plan
====================

This document describes the process for creating a new ChariTi release.

1.	Update ChariTi version number in `core.js`
2.	Add release information to `CHANGELOG.md`
3.  Update documentation, if necessary
4.  Update build script, if necessary
5.	Commit all changes
6.	Run Simian (`java -jar ../package/simian-2.3.33.jar -threshold=25 -language=javascript -formatter=plain "**/*.js"`), remove duplicate code
7.	Test release (if applicable, commit any fixes)
8.	Push changes to `Master`
9.	Tag new version from `Master` commit
10.	Delete development branch
11.	Pull from `Master` to `Peek`, update Peek in App Store
