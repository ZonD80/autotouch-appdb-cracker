# autotouch-appdb-cracker
Autotouch script that utilises appdb's APIs to fulfil cracking requests on appdb. Developed under contract with allowance to publish it as GPLv3
Tested and works on iPad 6 with Jailbroken iPadOS 13.5
## Requirements

###On Jailbroken Device:

- [Autotouch](https://autotouch.net)
- [noappthinning](https://github.com/n3d1117/n3d1117.github.io) from this repository
- [Frida](https://build.frida.re) Frida for Jailbroken device
- **curl**, installed from Cydia (you need to set that you are developer in Cydia and install this package)

###On PC/Mac:

- A web server, running under the same user as CLI. PHP 7.3+ with CURL extension
- PHP CLL
- nodejs and npm - stable versions
- screen session manager


## Installation

### On Jailbroken device
1. Create similar folders in Autotouch dashboard, copy scripts from **autotouch_scripts** folder.
2. Set AppStore to require password every time you try to download app.
3. Visit appstore and record your password input during paid app installation (you should record how you input password and press "Sign in").
4. Copy&paste your recording contents (except "appActivate") to **fill_password** function inside worker.js of DownloadIPA.at
5. Check that IP address/port of your PC/Mac matches in run() function, edit it if necessary
6. Arrange icons on second springboard screen as following: Uncover, Appdb. You need 2 apps, to make Crackable app 3rd. No other apps must present on this screen.

### On PC/Mac

1. Place files in root of your web server
2. Go to web_root/bagbak and run "**npm install**" there
3. Edit **secrets.sample.php** and rename it to **secrets.php**
4. Start screen, go to web server root folder and cracking server: "**php server.cli.php**"
## Improvement

PRs welcome!
