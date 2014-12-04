$("#play").submit(function(event) {
	event.preventDefault();
	$.get('http://localhost:1337/PiTube/api/' + $("#play").find('input[name="music"]').val());
	$("#nowPlaying").text($("#play").find('input[name="test"]').val());
});

$('.musicLinks').click(function(event) {
	event.preventDefault();
	var url = $(this).attr('href');
	console.log($(this).attr('href'));
	$.get(url);
	console.log($(this).attr('name'));
	$("#nowPlaying").text($(this).attr('name'));
})