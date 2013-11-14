ChariTi Release Plan
====================

This document describes the process for creating a new ChariTi release.

1.	Update ChariTi version number in `core.js`
2.	Add release information to `CHANGELOG.md`
3.  Update documentation, if necessary
4.	Commit all changes
5.	Run Simian (`java -jar ../package/simian-2.3.33.jar -threshold=25 -language=javascript -formatter=plain "**/*.js"`), remove duplicate code
6.	Test release (if applicable, commit any fixes)
7.	Push changes to `Master`
8.	Tag new version from `Master` commit
9.	Delete development branch
10.	Pull from `Master` to `Peek`, update PEEK in App Store