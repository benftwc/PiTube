#!/bin/sh

youtube-dl -t --extract-audio --exec 'mplayer -fs {} && rm {}' ytsearch:$@