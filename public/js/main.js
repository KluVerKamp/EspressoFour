var focus = 1;
var audio = new Audio('/audio/hangout_dingtone.m4a')
	audio.volume = 0.3

var socket = io.connect(myIP);
var Typers = {names:[]};
var message=""

$(window).load(function() {

	Typers.push = function (data){
		var me = this.names
		if( $.inArray(data,me) && data != $("#username").val()){
			var i = me.push(data) - 1
			$(Typers).trigger('add')
			setTimeout(function(){
				me.splice(i);
				$(Typers).trigger('del')
			}, 5000);
		}
		return this;
	}

	Typers.del = function(data){
		var me = this.names
		if ((i = $.inArray(data, me)) > -1){
			me.splice(i);
			$(Typers).trigger('del')
		}
	}
	
	$(Typers).on('del add', function() {
		if(Typers.names.length){
			message+= Typers.names[0]
			console.log(Typers.names.length);
			if(Typers.names.length == 1){
				message += " is typing..."
			}
			else {
				for (var i = 1; i < Typers.names.length; i++) {
					message += ", " + Typers.names[i]
				};
				message += "are typing..."
			}
		}
		$("#whoistyping").html(message)
		message=""
	});

	var clicking = 0;
	$("#message").keydown(function(event) {
		if(clicking==0){
			socket.emit("startTyping",{
				username: $("#username").val()
			})
			clicking=1;
			setInterval(function(){clicking=0},2000);
		}
	});

	$("#message").focusout(function(event) {
		socket.emit("endTyping",{
			username: $("#username").val()
		});
	});
	

	$("#message").keypress(function (e) {
  		if (e.which == 13 ) {
    		$("#myButton").click();
  		}
	});

	$("#myButton").click(function(event) {
		
		if($("#username").val() && $("#message").val()){
			socket.emit('click', {
				username: $("#username").val(),
				message: $("#message").val()
			});

			$("#message").val("");
			
			$("#username").prop('disabled', true);

			$("#messages").scrollTop($("#messages")[0].scrollHeight);
		}
	});

	socket.on('good', function (data) {
		$("#messages").append("<b>" + data.username + "</b>: " + data.message + "<br />");
		if(!focus) audio.play()
		Typers.del(data.username)
	});

	socket.on('isTyping', function (data) {
		Typers.push(data.username)
	});

	socket.on('doneTyping', function (data) {
		Typers.del(data.username)
	});
});

$(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");
    if (prevType != e.type) {//  reduce double fire issues
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
