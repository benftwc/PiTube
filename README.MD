PiTube
===================


Casting youtube musics to your **Raspberry pi since 1952**

----------

> **Howto:**
> - I wrote the api with nodejs so you betta make sure its installed
> - You'll need those modules to make the app work: express, youtube-feeds.
> - Make sure that youtube-dl and mplayer are installed and up to date
> - Simply launch app/app.js


### Endpoints
> - **http://0.0.0.0:1337/PiTube/player/:music** replace **:music** with an artist, a song name or a video id
> - **http://0.0.0.0:1337/PiTube/Killall** to kill all mplayer running processes
> - **http://0.0.0.0:1337/PiTube/clearcache** to clear PiTube's cache