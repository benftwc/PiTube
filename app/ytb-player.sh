#!/bin/bash
title=$@
title=${title,,} #lowercase
title=${title// /,} #replace " " with "_"
if [ -f ./cache/$title.m4a ];
then
	mplayer -fs ./cache/$title.m4a
else
	youtube-dl -o "./cache/$title.%(ext)s" --extract-audio --exec 'mplayer -fs {}' ytsearch:"$@"
fi