var express = require('express'),
	http = require('http'),
	port = 1337, 
	exec = require('exec'),
	fs = require('fs');

var app = express();
var server = http.createServer(app);
var playing = 0; // U PLAYIN OR NOT BRUH
var nowPlaying; // WOT R U PLAYIN M9 
var musics = getMusics();
var apiPath = '/PiTube/api/';

app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs');

function getMusics(){
	var musics = fs.readdirSync('./cache/');
	for(var i=0; i<musics.length; i++){
		musics[i] = replaceAll(".m4a", "", musics[i]);
		musics[i] = replaceAll("_", " ", musics[i]);
	}
	return musics
}

function replaceAll(find, replace, str){
	return str.replace(new RegExp(find, 'g'), replace);
}

function killMplayer(){
	console.log("Killing all mplayer processes...");
	exec(['killall', 'mplayer'], function(err, out, code) {
		if(err instanceof Error)
			throw err;
		process.stderr.write(err);
		process.stdout.write(out);
	});
}

function logfullurl(req){
	var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	console.log("GET "+fullUrl);
}

app.get('/', function(req, res){
	logfullurl(req);
	musics = getMusics();
	res.render('pages/index', {
		nowPlaying: nowPlaying,
		musics: musics,
		apiPath: apiPath
	});
});

app.get(apiPath,function(req, res){
	console.log(req.query.music);
});

app.get(apiPath+':id', function(req, res){
	logfullurl(req);
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

app.get('/Killall', function(req, res){
	logfullurl(req);
	res.setHeader('Content-type', 'text/plain');
	if(playing){
		killMplayer();
		res.end('Killed all mplayer processes');
		playing = 0;
	}
});

app.get('/Nowplaying', function(req, res) {
	logfullurl(req);
	res.setHeader('Content-type', 'text/plain');
	if(nowPlaying.length > 0 ){
		res.end(nowPlaying);
	}else{
		res.end("null");
	}
});

app.get('/clearcache', function(req, res) {
	logfullurl(req);
	console.log("Clearing cache...");
	exec(['./clearcache.sh'], function(err, out, code) {
		if(err instanceof Error)
			throw err;
		process.stderr.write(err);
		process.stdout.write(out);
	});
	res.setHeader('Content-type', 'text/plain');
	res.end("Cache cleared");
});

app.listen(port);
console.log("App running on port " + port);