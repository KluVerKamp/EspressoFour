$(window).load(function() {
	
	var socket = io.connect(myIP);

	socket.on('good', function (data) {
		console.log(data);
		$("#messages").append("<b>" + data.username + "</b>: " + data.message + "<br />");
	});

	$("#message").keypress(function (e) {
  		if (e.which == 13) {
    		$("#myButton").click();
  		}
	});

	$("#myButton").click(function(event) {
		socket.emit('click', {
			username: $("#username").val(),
			message: $("#message").val()
		});
		$("#message").val("");
	});
});
