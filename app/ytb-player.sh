#!/bin/sh

/usr/local/bin/youtube-dl -t --extract-audio --exec 'mplayer -fs {} && rm {}' $@