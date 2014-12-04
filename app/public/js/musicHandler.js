$("#play").submit(function(event) {
	event.preventDefault();
	$.get('http://localhost:1337/PiTube/api/' + $("#play").find('input[name="music"]').val());
	$("#nowPlaying").text($("#play").find('input[name="test"]').val());
});