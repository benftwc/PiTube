var express = require('express'),
	http = require('http'),
	port = 1337,
	exec = require('exec');

var app = express();
var server = http.createServer(app);
var playing = 0; // U PLAYIN OR NOT BRUH
var nowPlaying; // WOT R U PLAYIN M9 

function killMplayer(){
	console.log("Killing all mplayer processes...");
	exec(['killall', 'mplayer'], function(err, out, code) {
		if(err instanceof Error)
			throw err;
		process.stderr.write(err);
		process.stdout.write(out);
	});
}

app.get('/PiTube/player/:id', function(req, res){
	var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	console.log("GET "+fullUrl)
	res.setHeader('Content-Type', 'text/plain');
	res.end('Playing ' + req.params.id + ' on your raspberry Pi');
	console.log("Now playing "+ req.params.id);
	if(playing){
		killMplayer();
	}else{
		playing = 1;
	}
	exec(['./ytb-player.sh', req.params.id], function(err, out, code) {
		if(err instanceof Error)
			throw err;
		process.stderr.write(err);
		process.stdout.write(out);
	});
	nowPlaying = req.params.id;
});

app.get('/PiTube/Killall', function(req, res){
	var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	console.log("GET "+fullUrl)
	res.setHeader('Content-type', 'text/plain');
	if(playing){
		killMplayer();
		res.end('Killed all mplayer processes');
		playing = 0;
	}
});

app.get('/PiTube/Nowplaying', function(req, res) {
	res.setHeader('Content-type', 'text/plain');
	if(nowPlaying.length > 0 ){
		res.end(nowPlaying);
	}else{
		res.end("null");
	}
});

app.listen(port);
console.log("App running on port " + port);