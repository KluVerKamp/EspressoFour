var focus = 1;
var audio = new Audio('/audio/hangout_dingtone.m4a')
audio.volume = 0.3

$(window).load(function() {
	
	var socket = io.connect(myIP);

	socket.on('good', function (data) {
		console.log(data);
		$("#messages").append("<b>" + data.username + "</b>: " + data.message + "<br />");
		if(!focus)
			audio.play()
	});

	$("#message").keypress(function (e) {
  		if (e.which == 13 ) {
    		$("#myButton").click();
  		}
	});

	$("#myButton").click(function(event) {
		
		if($("#username").val()&&$("#message").val()){
			socket.emit('click', {
				username: $("#username").val(),
				message: $("#message").val()
			});

			$("#message").val("");
			
			$("#username").prop('disabled', true);

			$("#messages").scrollTop($("#messages")[0].scrollHeight);
		}
	});
});


$(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");
    if (prevType != e.type) {   //  reduce double fire issues
        switch (e.type) {
            case "blur":
               focus = 0;
                break;
            case "focus":
                focus = 1;
                break;
        }
    }

    $(this).data("prevType", e.type);
})
