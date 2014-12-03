PiTube
===================


Casting youtube musics to your **Raspberry pi since 1952**

----------

> **Howto:**
> - install latest youtube-dl from <a href="http://rg3.github.io/youtube-dl/download.html">here</a>
> - install express, exec, youtube-feeds and ejs from npm
> - chmod a+x ytb-player.sh clearcache.sh app.js
> - launch the app with nodejs
> - enjoy some music !


### Endpoints
> - **http://0.0.0.0:1337/PiTube/api/:music** replace **:music** with an artist, a song name or a video id
> - **http://0.0.0.0:1337/Killall** to kill all mplayer running processes
> - **http://0.0.0.0:1337/clearcache** to clear PiTube's cache
> - **http://0.0.0.0:1337/** web interface
