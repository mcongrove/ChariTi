ChariTi Release Plan
====================

This document describes the process for creating a new ChariTi release.

1.	Update ChariTi version number in `core.js`
2.	Add release information to `CHANGELOG.md`
3.	Commit all changes
4.	Run Simian (`java -jar ../package/simian-2.3.33.jar -threshold=25 -language=javascript -formatter=plain "**/*.js"`), remove duplicate code
5.	Test release (if applicable, commit any fixes)
6.	Push changes to `Master`
7.	Tag new version from `Master` commit
8.	Delete development branch
9.	Pull from `Master` to `Peek`, update Peek in App Store