# autotouch-appdb-cracker
Autotouch script that utilises appdb's APIs to fulfil cracking requests on appdb. Developed under contract with allowance to publish it as GPLv3
Tested and works on iPad 6 with Jailbroken iPadOS 13.5
## Requirements

Jailbroken Device

[Autotouch](https://autotouch.net) with paid subscription

[noappthinning](https://github.com/n3d1117/n3d1117.github.io) from this repository

[CrackerXI+](https://cydia.iphonecake.com) from this repository

**curl**, installed from Cydia (you need to set that you are developer in Cydia and install this package)

## Installation

1. Prepare your link token and staff token and change worker.js accordingly.
2. Create similar folder in Autotouch dashboard and upload files to it.
3. Set appstore to require password every time you try to download app.
4. Visit appstore and record your password input during paid app installation (you should record how you input password and press "Sign in").
5. Copy&paste your recording contents (except "appActivate") to **fill_password** function inside worker.js
6. Remove any 3rd party apps from device (including Uncover if you have any), launch CrackerXI+ to check that app list is blank. **It must be blank**
7. Arrange icons on second springboard screen as following: Filza, CrackerXI+. No other apps must present on this screen
8. Visit Filza and add CrackerXI folder to favorites and disable usage of Trash in settings.
9. Good to go - no tap Play near AppStore.at script in Autotouch

## Improvement

PRs welcome, it's time to improve:

1. App detection in CrackerXI with text or image recognition
2. App detection during removal on Springboard with text or image recognition