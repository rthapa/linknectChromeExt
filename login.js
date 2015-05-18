function initJs(){
	if($.trim($.cookie('user')) != '' && $.trim($.cookie('password')) != ''){
		window.location.href = "dash.html";
	}

	$('#loginform').on('submit', function(){
		//console.log('clicked');
		if($.trim($('#email').val()) == '' || $.trim($('#password').val()) == '' ){
			$('#status')
			.html("<i class='fa fa-exclamation'></i> Please fill all the forms")
			.css('display', 'block');
			return false;
		}else{
			var user = $('#email').val();
			var password = $('#password').val();

			$.ajax({
				url: 'http://beta.linknect.com/api.php',
				data: {user: user, password: password, type: 'login'},
				type: "POST",
				dataType: "json",
				success: function(data){
					console.log(data);
					if(data.status == 'success'){
						$.cookie('user', user, { expires: 7 });
						$.cookie('username', data.username, { expires: 7 });
						$.cookie('email', data.email, { expires: 7 });
						$.cookie('password', password, { expires: 7 });
						window.location.href = "dash.html";
					}else if(data.status == 'failed'){
						$('#status').css('display', 'block').html('The email/username or password is incorrect.');
					}
				},
				error: function(){
					//bad request
					console.log('ajax error');
				}
			});
		}
		return false;
	});

	$('#register').on('click', function(){
		console.log('register');
		chrome.tabs.create({url: 'http://linknect.com/signup.php'});
	});

	$('#linknectLink').on('click', function(){
		chrome.tabs.create({url: 'http://linknect.com'});
	});
}

document.addEventListener('DOMContentLoaded', function () {
	initJs();
});
