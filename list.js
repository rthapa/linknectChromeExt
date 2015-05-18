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
	

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}

	var url = document.URL;
	urlArr = url.split("/");
	page = urlArr[urlArr.length-1];

	chrome.storage.local.set({'currentLocation': page}, function() {
	// Notify that we saved.
		console.log('file name: '+page);
	});
	
	var lid = getURLParameter('lid');
	//$('#content').append(getURLParameter('lid'));

	//fetch bookmarks from listid
	if(lid != ''){
		$('#content').append('<div id="loadingStatus"><img src="images/load.gif"><h5>loading</h5></div>');
		$.ajax({
			url: 'http://beta.linknect.com/api.php',
			data: {type: 'getBookmarks', user: $.cookie('user'), password: $.cookie('password'), lid: lid},
			type: 'GET',
			dataType: 'json',
			success: function(data){
				$('#sidebarUsername').html($.cookie('username'));
				//console.log(data.status);
				if(data.status != undefined && data.status == 'no bookmarks'){
					$('#content').append('<h5 class="noBookmarkStatus">You have no bookmarks</h5>');
					$('#content').prepend('<h5 class="listTitle"><i class="fa fa-list-ul"></i> '+data.listName+'<h5>');
				}else{
					$.each(data, function(i, v){
						var content = '<div class="bookmarkWrapper">'
												+'<div class="bookmarkHeader">'
													+'<a href="'+v.link+'" target="_blank">'
														+'<span class="headerIcon"><img height="16" width="16" src="'+v.icon+'"></span>'

														+'<div style="float:left; padding:5px" class="bookmarkHeaderTitle"><h4 style="overflow: hidden;text-overflow: ellipsis;white-space:nowrap;width:397px;">'+v.title+'</h4></div>'
													+'</a>'
														+'<div class="bookmarkHeaderRightOptions">'
															+'<span class="iconBtn deleteBookmark" data-id="'+v.id+'"><i class="iconBg fa fa-trash-o"></i></span>'
															+'<span class="iconBtn editBookmark"  data-id="'+v.id+'"><i class="iconBg fa fa-pencil-square-o"></i></span>'
														+'</div>'
													+'<div class="bookmarkHeaderRight">'
														+'<span><i class="fa fa-calendar"></i> '+v.date+'</span>'
													+'</div>'
													+'<div style="clear:both"></div>'
												+'</div>'
												+'<div class="bookmarkBody">'
													+'<a href="'+v.link+'" target="_blank"><p class="wrapText"><i class="fa fa-paperclip"></i> '+v.link+'</p></a>';
													if($.trim(v.description) != ''){
														content += '<p class="bookmarknote">'+v.description+'</p>';
													}

									content += '</div>'
											+'</div>';
						$('#content').append(content);
					});
					$('#content').prepend('<h5 class="listTitle"><i class="fa fa-list-ul"></i> '+data[0].listName+'<h5>');
				}
				$('#loadingStatus').remove();
			},
			error: function(){
				console.log('error');
			}
		});
	}else{
		//error page
	}

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

	$('#addBookmark').on('click', function(){
		$('#bookmarklink').val('');
		$('#bookmarkDescription').val('');
		$('#bidEdit').val('');
		$('.addBookmarkFormHead').html('Add Bookmark');

		$('.overlayBg').css({'display':'block'});
		$('.addBookmarkDiv').css({
									'display':'block',
									'top':'35px',
									'opacity':'1'
								});
		//$('.addBookmarkDiv').fadeIn("slow");
		chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

			// since only one tab should be active and in the current window at once
			// the return variable should only have one entry
			var activeTab = arrayOfTabs[0];
			console.log(activeTab);
			console.log(activeTab.favIconUrl);
			$('#bookmarklink').val(activeTab.url);
		});
	});

	$('.overlayBg, #cancelBookmark').on('click', function(){
		$('.overlayBg').css({'display':'none'});
		$('.addBookmarkDiv').css({
									'display':'none',
									'top':'0px',
									'opacity':'0'
								});
		//$('.addBookmarkDiv').fadeOut("slow");
		return false;
	});

	$('#saveBookmark').on('click', function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

			// since only one tab should be active and in the current window at once
			// the return variable should only have one entry
			var activeTab = arrayOfTabs[0];
			console.log(activeTab);
			console.log(activeTab.url);

			$.ajax({
				url: 'http://beta.linknect.com/api.php',
				data: { 
						type: 'saveBookmark',
						user: $.cookie('user'),
						password: $.cookie('password'),
						lid: lid,
						url: activeTab.url,
						favicon: activeTab.favIconUrl,
						title: activeTab.title,
						description: $('#bookmarkDescription').val(),
						agent: 'chrome extension'
					},
				type: 'POST',
				dataType: 'json',
				success: function(data){
					console.log(data);
					if(data.status == 'success'){
						window.location.href = 'list.html?lid='+lid;
					}
				},
				error: function(data){
					console.log('failed: '+data);
				}
			});
		});
		return false;
	});

	$('#shareBookmark').on('click', function(){
		$('#shareListLink').html('<a href="http://linknect.com/list.php?lid='+lid+'" target="_blank">http://linknect.com/list.php?lid='+lid+'</a>');
		if($('.shareLinkDiv').css('display') == 'none'){
			$('.shareLinkDiv').slideDown();
		}else{
			$('.shareLinkDiv').slideUp();
		}
	});

	$('body').on('click', '.deleteBookmark', function(){
		var bid = $(this).data('id');
		//console.log(bid);
		$.ajax({
			url: 'http://beta.linknect.com/api.php',
			data: { 
					type: 'deleteBookmark',
					user: $.cookie('user'),
					password: $.cookie('password'),
					lid: lid,
					bid: bid,
					agent: 'chrome extension'
				},
			type: 'POST',
			dataType: 'json',
			success: function(data){
				console.log(data);
				if(data.status == 'success'){
					window.location.href = 'list.html?lid='+lid;
				}
			},
			error: function(data){
				console.log('failed: '+data);
			}
		});
	});

	$('body').on('click', '.editBookmark', function(){
		bidPreserve = $(this).data('id');
		$.ajax({
			url: 'http://beta.linknect.com/api.php',
			data: { 
					type: 'getEditBookmark',
					user: $.cookie('user'),
					password: $.cookie('password'),
					bid: bidPreserve
				},
			type: 'GET',
			dataType: 'json',
			success: function(data){
				console.log(data);
				$('#bookmarklink').val(data.link);
				$('#bookmarkDescription').val(data.description);
				// $('#listprivacy').val(data.privacy);
				$('.addBookmarkFormHead').html('Edit Bookmark');
				
				$('#bidEdit').val(bidPreserve);
				
				$('.overlayBg').css({'display':'block'});

				$('#listAddBookmarkButonSpan').html('<button class="button" id="editBookmarkBtn">Edit</button>');
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

	$('body').on('click', '#editBookmarkBtn', function(){
		$.ajax({
			url: 'http://beta.linknect.com/api.php',
			data: { 
					type: 'editBookmark',
					user: $.cookie('user'),
					password: $.cookie('password'),
					link: $('#bookmarklink').val(),
					description: $('#bookmarkDescription').val(),
					bid:$('#bidEdit').val(),
					agent: 'chrome extension'
				},
			type: 'POST',
			dataType: 'json',
			success: function(data){
				console.log(data);
				if(data.status == 'success'){
					window.location.href = 'list.html?lid='+lid;
				}
			},
			error: function(data){
				console.log('failed: '+data);
			}
		});
		return false;
	});


}

document.addEventListener('DOMContentLoaded', function () {
	initJs();
});
