var express = require('express'),
	http = require('http'),
	port = 1337, 
	exec = require('exec'),
	fs = require('fs'),
	ip = require('ip'),
	youtube = require('youtube-feeds'),
	youtubedl = require('youtube-dl'),
	Mplayer = require('node-mplayer'),
	routes = require('./routes.js');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var nowPlaying = ""; // WOT R U PLAYIN M8
var musics = getMusics(); // GIMME THOSE CACHED FILES
var apiPath = '/PiTube/api/'; // dat path doe 
var cachePath = __dirname+'/cache/';
var player = new Mplayer();
var paused = 0; // IS DA PLAYER PAUSED
var muted = 0; // IS DA PLAYER MUTED

youtube.httpProtocol = 'https';
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');


function getMusics(){
	var musics = fs.readdirSync('./cache/');
	for(var i=0; i<musics.length; i++){
		musics[i] = replaceAll(".mp4", "", musics[i]);
	}
	return musics;
}

function replaceAll(find, replace, str){
	return str.replace(new RegExp(find, 'g'), replace);
}

function logfullurl(req){
	var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	console.log("GET "+fullUrl);
}

io.sockets.on('connection', function(socket){
    console.log('New client connected');
});

/**
Web app routes
**/

app.get('/', routes.webApp(nowPlaying, musics, apiPath, ip.address()));
app.get('/PiTube', routes.webApp(nowPlaying, musics, apiPath, ip.address()));

/**
Controls
**/

app.get('/PiTube/pause', routes.pause(player, paused));

app.get('/PiTube/stop', routes.stop(player));

app.get('/PiTube/mute', routes.mute(player, muted));

app.get(apiPath+':id', function(req, res){
	logfullurl(req);
	fs.exists(cachePath+req.params.id+'.mp4', function(exists){
		if(exists){
			nowPlaying = req.params.id;
			player.stop();
			player.setFile(cachePath+nowPlaying+'.mp4');
			player.play();
			io.sockets.emit('nowPlaying', nowPlaying);
		}else{
			youtube.feeds.videos({q:req.params.id, 'max-results': 1}, function(err, data) {
				if( err instanceof Error){
					console.log(err);
				} else{
					nowPlaying = data.items[0].title;
					console.log(data.items[0].title);
					nowPlaying = nowPlaying.toLowerCase();
					fs.exists(cachePath+nowPlaying+'.mp4', function(exists){
						if(exists){
							console.log('Playing ' + nowPlaying);
							player.stop();
							player.setFile(cachePath+nowPlaying+'.mp4');
							player.play();
							io.sockets.emit('nowPlaying', nowPlaying);
						}else{
							video = youtubedl('https://www.youtube.com/watch?v='+data.items[0].id,
								['--max-quality=18'],
								{cwd: __dirname});
							video.on('info', function(info){
								console.log('Download started');
							});
							var f = fs.createWriteStream(cachePath+nowPlaying+'.mp4');
							f.on('finish', function(){
								player.stop();
								player.setFile(cachePath+nowPlaying+'.mp4');
								player.play();
								io.sockets.emit('nowPlaying', nowPlaying);
								io.sockets.emit('newFile', nowPlaying);
							});
							f.on("error", function(error){
								console.log(error);
							});
							video.pipe(f);
						}
					});
				}
				res.setHeader('Content-type', 'text/plain');
				res.end('Playing ' + nowPlaying + ' on your raspberry Pi');
			});
		}
	});
});

/**
Stuffs
**/
app.get('/NowPlaying', function(req, res){
	res.set('content-type', 'plain/text');
		if(nowPlaying.length > 0){
			res.end(nowPlaying);
		}else{
			res.end('nothing\n');
		}
});

app.get('/clearcache', function(req, res) {
	logfullurl(req);
	console.log("Clearing cache...");
	fs.readdirSync(__dirname+'/cache').forEach(function(filename) {
		fs.unlinkSync(cachePath+filename);
	});
	res.setHeader('Content-type', 'text/plain');
	res.end("Cache cleared");
});

server.listen(port);
console.log("App running on port " + port);