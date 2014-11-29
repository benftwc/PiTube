var express = require('express'),
	http = require('http');
	port = 1337,
	exec = require('exec');

var app = express();
var server = http.createServer(app);

app.get('/PiTube/play/:id', function(req, res){
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

app.listen(port);