var express = require('express'),
	http = require('http'),
	port = 1337, 
	exec = require('exec'),
	fs = require('fs'),
	ip = require('ip'),
	youtube = require('youtube-feeds'),
	youtubedl = require('youtube-dl'),
	Mplayer = require('node-mplayer');

var app = express();
var server = http.createServer(app);
var playing = 0; // U PLAYIN OR NOT BRUH
var nowPlaying; // WOT R U PLAYIN M9 
var musics = getMusics();
var apiPath = '/PiTube/api/';
var video;
var player = new Mplayer();

youtube.httpProtocol = 'https';
app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs');

function getMusics(){
	var musics = fs.readdirSync('./cache/');
	for(var i=0; i<musics.length; i++){
		musics[i] = replaceAll(".mp4", "", musics[i]);
		musics[i] = replaceAll(",", " ", musics[i]);
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
		apiPath: apiPath,
		ip: ip.address()
	});
});

app.get(apiPath+':id', function(req, res){
	logfullurl(req);
	youtube.feeds.videos({q:req.params.id, 'max-results': 1}, function(err, data) {
		if( err instanceof Error){
			console.log(err);
		} else{
			nowPlaying = data.items[0].title;
			console.log(data.items[0].title);
			nowPlaying = nowPlaying.toLowerCase();
			fs.exists(__dirname+'/cache/'+nowPlaying+'.mp4', function(exists){
				if(exists){
					console.log('Playing ' + nowPlaying);
					player.stop();
					player.setFile(__dirname+'/cache/'+nowPlaying+'.mp4');
					player.play();
				}else{
					video = youtubedl('https://www.youtube.com/watch?v='+data.items[0].id,
						['--max-quality=18'],
						{cwd: __dirname});
					video.on('info', function(info){
						console.log('Download started');
					});
					var f = fs.createWriteStream(__dirname+'/cache/'+nowPlaying+'.mp4');
					f.on('finish', function(){
						player.stop();
						player.setFile(__dirname+'/cache/'+nowPlaying+'.mp4');
						player.play();
					});
					video.pipe(f);
				}
			});
		}
		res.setHeader('Content-type', 'text/plain');
		res.end('Playing ' + nowPlaying + ' on your raspberry Pi');
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
	fs.readdirSync(__dirname+'/cache').forEach(function(filename) {
		fs.unlinkSync(__dirname+'/cache/'+filename);
	});
	res.setHeader('Content-type', 'text/plain');
	res.end("Cache cleared");
});

app.listen(port);
console.log("App running on port " + port);