function logfullurl(req){
	var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	console.log("GET "+fullUrl);
}

exports.webApp = function(nowPlaying, musics, apiPath, ip, port){
	return function(req, res){
		logfullurl(req);
		res.render('pages/index', {
			nowPlaying: nowPlaying,
			musics: musics,
			apiPath: apiPath,
			ip: ip,
			port: port
		});
	}
}

exports.pause = function(player, paused){
	return function(req, res){
		logfullurl(req);
		res.set('content-type', 'plain/text');
		if(paused){
			player.pause();
			res.end('Player unpaused\n');
			paused = 0;
		}else{
			player.pause();
			res.end('Player paused\n');
			paused = 1;
		}
	}
}

exports.stop = function(player){
	return function(req, res){
		logfullurl(req);
		res.set('content-type', 'plain/text');
		res.end('Player stopped\n');
		player.stop();
	}
}

exports.mute = function(player, muted){
	return function(req, res){
		logfullurl(req);
		res.set('content-type', 'plain/text');
		if(muted){
			player.mute();
			res.end('Player unmuted\n');
			muted = 0;
		}else{
			player.mute();
			res.end('Player muted\n');
			muted = 1;
		}
	}
}