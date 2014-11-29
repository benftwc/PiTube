var express = require('express'),
	http = require('http');
	port = 1337,
	exec = require('exec');

var app = express();
var server = http.createServer(app);

app.get('/PiTube/player/:id', function(req, res){
	var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	console.log("GET "+fullUrl)
	res.setHeader('Content-Type', 'text/plain');
	res.end('Playing ' + req.params.id + ' on your raspberry Pi');
	console.log("Now playing "+ req.params.id);
	exec(['./ytb-player.sh', req.params.id], function(err, out, code) {
		if(err instanceof Error)
			throw err;
		process.stderr.write(err);
		process.stdout.write(out);
	});
});

app.get('/PiTube/Killall', function(req, res){
	var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	console.log("GET "+fullUrl)
	res.setHeader('Content-type', 'text/plain');
	res.end('Killed all mplayer processes');
	exec(['killall', 'mplayer']);
});

app.listen(port);