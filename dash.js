//track the navigation via localstorage?
function initJs(){
	jQuery.fn.center = function(parent) {
		if (parent) {
			parent = this.parent();
		} else {
			parent = window;
		}
		this.css({
			"position": "absolute",
			// "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
			"top": 100+$(parent).scrollTop()+"px",
			"left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
		});
		return this;
	}
	
	$(function(){

		var url = document.URL;
		urlArr = url.split("/");
		page = urlArr[urlArr.length-1];


		chrome.storage.local.set({'currentLocation': page}, function() {
		// Notify that we saved.
			console.log('file name: '+page);
		});

		if($.trim($.cookie('user')) != '' && $.trim($.cookie('password')) != ''){
			$.ajax({
				url: 'http://beta.linknect.com/api.php',
				data: {type: 'getList', user: $.cookie('user'), password: $.cookie('password')},
				type: 'GET',
				dataType: 'json',
				success: function(data){
					$('#sidebarUsername').html($.cookie('username'));
					$.each(data, function(i, v){
						$('#content').append('<div class="listsWrapper">'
												+'<div style="min-width:31px;background-color:#1B2224;float:left; padding:7px; border-right:1px solid #E7DDDD">'
													+'<i class="fa fa-list-ul"></i> '+v.totalBookmark
												+'</div>'
												+'<div style="float:left;padding: 5px;">'
														+'<span class="iconBtn deleteList" data-id="'+v.id+'"><i class="iconBg fa fa-trash-o"></i></span>'
														+'<span class="iconBtn editList" data-id="'+v.id+'"><i class="iconBg fa fa-pencil-square-o"></i></span>'
												+'</div>'
												+'<div style="padding:7px; float:left">'
													+'<div class="listBody">'
														+'<a href="list.html?lid='+v.id+'"><span>'+v.name+'</span></a>'
													+'</div>'
													+'<div style="clear:both"></div>'
												+'</div>'
												+'<div style="clear:both"></div>'
												+'</div>');
					});
				},
				error: function(){
					console.log('error');
				}
			});
		}else{
			window.location.href = "login.html";
		}
	});

	$('.toggleSidebarBtn').on('click', function(){
		if($('.appSidebar').css('left') != '0px'){
			$('.appSidebar').css('left', '0px');
		}else{
			$('.appSidebar').css('left', '-240px');
		}
	});

	$('#logoutBtn').on('click', function(){
		$.removeCookie('user');
		$.removeCookie('username');
		$.removeCookie('email');
		$.removeCookie('password');
		window.location.href = 'dash.html';
	});

	$('#newListBtn').on('click', function(){
		$('#listname').val('');
		$('#listdescription').val('');
		$('#listprivacy').val('');
		$('.addBookmarkFormHead').html('New List');
		$('#dashAddBookmarkButonSpan').html('<button class="button" id="saveList">Save</button>');
		$('.overlayBg').css({'display':'block'});
		$('.addBookmarkDiv').css({
									'display':'block',
									'top':'35px',
									'opacity':'1'
								});
	});

	$('.overlayBg, #cancelBookmark').on('click', function(){
		$('.overlayBg, .confirmBox').css({'display':'none'});
		$('.addBookmarkDiv').css({
									'display':'none',
									'top':'0px',
									'opacity':'0'
								});
		return false;
	});

	$('body').on('click', '#saveList', function(){
		console.log('cliked');
			$.ajax({
				url: 'http://beta.linknect.com/api.php',
				data: { 
						type: 'saveList',
						user: $.cookie('user'),
						password: $.cookie('password'),
						name: $('#listname').val(),
						description: $('#listdescription').val(),
						privacy: $('#listprivacy').val(),
						agent: 'chrome extension'
					},
				type: 'POST',
				dataType: 'json',
				success: function(data){
					console.log(data);
					if(data.status == 'success'){
						window.location.href = 'dash.html';
						//console.log(data);
					}
				},
				error: function(data){
					console.log('failed: '+data);
				}
			});
		return false;
	});

	$('body').on('click', '#editListBtn', function(){
		console.log($(this));
		$.ajax({
			url: 'http://beta.linknect.com/api.php',
			data: { 
					type: 'editList',
					user: $.cookie('user'),
					password: $.cookie('password'),
					name: $('#listname').val(),
					description: $('#listdescription').val(),
					privacy: $('#listprivacy').val(),
					lid:$('#lidEdit').val(),
					agent: 'chrome extension'
				},
			type: 'POST',
			dataType: 'json',
			success: function(data){
				console.log(data);
				if(data.status == 'success'){
					window.location.href = 'dash.html';
				}
			},
			error: function(data){
				console.log('failed: '+data);
			}
		});
		return false;
	});

	$('body').on('click', '.editList', function(){
		lidPreserve = $(this).data('id');
		console.log(lidPreserve);
		$.ajax({
			url: 'http://beta.linknect.com/api.php',
			data: { 
					type: 'getEditList',
					user: $.cookie('user'),
					password: $.cookie('password'),
					lid: $(this).data('id')
				},
			type: 'GET',
			dataType: 'json',
			success: function(data){
				console.log(data);
				$('#listname').val(data.name);
				$('#listdescription').val(data.description);
				$('#listprivacy').val(data.privacy);
				$('.addBookmarkFormHead').html('Edit List');
				
				$('#lidEdit').val(lidPreserve);
				$('.overlayBg').css({'display':'block'});

				$('#dashAddBookmarkButonSpan').html('<button class="button" id="editListBtn">Edit</button>');
				$('.addBookmarkDiv').css({
											'display':'block',
											'top':'35px',
											'opacity':'1'
										});
				$('.addBookmarkDiv').center(true);
			},
			error: function(data){
				console.log('failed: '+data);
			}
		});
	});

	$('body').on('click', '.deleteList', function(){
		console.log($(this).data('id'));
		$('.confirmBox,.overlayBg').css('display','block');
		$('.confirmbtn').attr('data-id', $(this).data('id'));
		$('.confirmBox').center(true);
	});

	$('.closetooltip').click(function(){
		$('.confirmBox').css('display', 'none');
		if($('.overlayBg').css('display') == 'block'){
			$('.overlayBg').css('display','none');
		}
	});

	$('.confirmbtn').click(function(){
		var lid = $(this).data('id');

		$.ajax({
			url: 'http://beta.linknect.com/api.php',
			data: { 
					type: 'deleteList',
					user: $.cookie('user'),
					password: $.cookie('password'),
					lid: lid,
					agent: 'chrome extension'
				},
			type: 'POST',
			dataType: 'json',
			success: function(data){
				console.log(data);
				if(data.status == 'success'){
					window.location.href = 'dash.html';
				}
			},
			error: function(data){
				console.log('failed: '+data);
			}
		});
	});

	// $.cookie('user', 'test@test.com', { expires: -7 });
	// $.cookie('password', '123', { expires: -7 });
}

document.addEventListener('DOMContentLoaded', function () {
	initJs();
});

