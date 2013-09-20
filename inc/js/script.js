jQuery(document).ready(function( $ ){

    // $('#default_add_comment_form textarea').textareaAutoExpand();

    /**
     * Default ajax setup
     */
    $.ajaxSetup({
        type: "POST",
        url: _inline_comments.ajaxurl,
        dataType: "html"
    });


    window.inline_comments_ajax_load_template = function( params, my_global ) {

        var my_global;
        var request_in_process = false;

        params.action = "inline_comments_load_template";

        $.ajax({
            data: params,
            global: my_global,
            success: function( msg ){
                $( params.target_div ).fadeIn().html( msg );
                request_in_process = false;
                if (typeof params.callback === "function") {
                    params.callback();
                }
				return false;
            }
        });
		return false;
    }

    /**
     * Submit new comment, note comments are loaded via ajax
     */
     $( document ).on('submit','.default-add-comment-form',function( e ) {
        event.preventDefault();

        var $this = $(this);
        $this.css('opacity','0.5');
		var full_id = this.id;
		var explode_post_id = full_id.split("-",2);
		var post_id = explode_post_id[1];
		console.log ("posting a comment for post id: #"+post_id);

        data = {
            action: "inline_comments_add_comment",
            post_id: post_id,
            user_name: $('#inline_comments_user_name_'+post_id).val(),
            user_email: $('#inline_comments_user_email_'+post_id).val(),
            user_url: $('#inline_comments_user_url_'+post_id).val(),
            comment: $( '#comment_'+post_id ).val(),
            security: $('#inline_comments_nonce_'+post_id).val()
        };
		console.log ("data stream(var array data):");
		console.log ("* action: "+data.action);
		console.log ("* post_id: "+data.post_id);
		console.log ("* user_name: "+data.user_name);
		console.log ("* user_url: "+data.user_url);
		console.log ("* comment: "+data.comment);
		console.log ("* security: "+data.security);
		console.log ("---end");

		console.log ("target_div: "+"#inline_comments_ajax_target_"+post_id);
		console.log ("template: " + $( '#inline_comments_ajax_handle' ).attr( 'data-template' ));
		console.log ("post_id: " + post_id);
		console.log ("security: " + $( '#inline_comments_nonce_'+post_id ).val());
        $.ajax({
            data: data,
            global: false,
            success: function( msg ){
                inline_comments_ajax_load_template({
                    "target_div": "#inline_comments_ajax_target_"+post_id,
                    "template": $( '#inline_comments_ajax_handle' ).attr( 'data-template' ),
                    "post_id": post_id,
                    "security": $( 'inline_comments_nonce_' +post_id).val()
                } );
                $('textarea').val('');
                $this.css('opacity','1');
				return false;
            },
			fail: function(){
				console.log("ajax failed");
			},
				always: function(){
				console.log(msg);
			}
        });

    });

    /**
     * Allow Comment form to be submitted when the user
     * presses the "enter" key.
     */
	$(document).on('keypress', '.default-add-comment-form',function (e) {
	  if (e.which == 13) {
		console.log ("Enter Key Pressed - Submitting form");
		console.log (this);
		console.log ($(this));
		$(this).submit();
		return false;
	  }
	});

	$(window).on('scroll.inline-ajax-comments', function (e) {
		var elem = isScrolledIntoView('.inline-comments-ajax-start')
		
		if (elem)
		{
			var $elem = jQuery(String(elem));
			
			if ($elem.hasClass('inline-comments-loaded')) {
				//console.log($elem+'already loaded');
				return false;
				} 
			else {
				$elem.addClass('inline-comments-loaded');
				console.log('Load comments for '+$elem);
				console.log('post id: '+$elem.attr('data-id'));
				inline_comments_ajax_load($elem.attr('data-id'))
				}
				
		}
		
	});

	

    window.inline_comments_ajax_load = function(post_id){
		console.log (window.scrollY);
		
		//console.log("load comments for post "+post_id+"...");
        if ( $( '#inline_comments_ajax_handle_'+post_id ).length ) {
            $( '.inline-comments-loading-icon').show();

            data = {
                "action": "inline_comments_load_template",
                "target_div": '#inline_comments_ajax_target_'+post_id,
                "template": $( '#inline_comments_ajax_handle').attr( 'data-template' ),
                "post_id": post_id,
                "security": $('#inline_comments_nonce_'+post_id).val()
            };
			console.log("loading comments for post: "+data.post_id);
            $.ajax({
                data: data,
                success: function( msg ){
					console.log (window.scrollY);
					var position = (window.scrollY);
                    $( '#inline-comments-loading-icon-'+post_id).fadeTo( 1000, 0 );
					
					$( "#inline_comments_ajax_target_"+post_id).fadeIn().html( msg ); // Give a smooth fade in effect
					$('html, body').animate({
						scrollTop: position
					},0);
                    if ( location.hash ){
						debugger;
                        $('html, body').animate({
							scrollTop: $( location.hash ).offset().top
                        });
                        $( location.hash ).addClass( 'inline-comments-highlight' );
                    }
					console.log (window.scrollY);
					return false;
                }
            });

            $( document ).on('click', '.inline-comments-time-handle', function( e ){
				event.preventDefault();
                $( '.inline-comments-content' ).removeClass('inline-comments-highlight')
                comment_id = '#comment-' + $( this ).attr('data-comment_id');
                $( comment_id ).addClass('inline-comments-highlight');
            });
        }
		return false;
    }

	$( document ).on('click','.inline-comments-more-handle', function( e ){
		event.preventDefault();
		//Get the post id
		var full_id = this.id;
		var explode_post_id = full_id.split("_",2);
		var post_id = explode_post_id[1];
		console.log (post_id);

		if ( $( this ).hasClass('inline-comments-more-open_'+post_id) ){
            	$( 'a', this ).html( _inline_comments.custom_more.more );
           		 $('#comment_'+post_id).animate({height: '32'},250);
       			 } else {
            $( 'a', this ).html( _inline_comments.custom_more.less );
             $('#comment_'+post_id).animate({height: '100'},250);
        }
			$( this ).toggleClass('inline-comments-more-open_'+post_id);
			$('#inline-comments-more-container_'+post_id).toggle();
	});


	/*
    window.inline-comments-more-toggle = function(post_id){

        if ( $( this ).hasClass('inline-comments-more-open_'+post_id) ){
            $( 'a', this ).html('●●●');
            $('#comment').css('height', '32');
        } else {
            $( 'a', this ).html('↑↑↑');
            $('#comment').css('height', '150');
        }
        $( this ).toggleClass('inline-comments-more-open_'+post_id);
        $('#inline-comments-more-container_'+post_id).toggle();
    }
	*/
	
	window.isScrolledIntoView = function(elem) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();
		var elemInView = false;
		$( elem ).each(function() {
			$this = $(this);
			
			elemTop = $this.offset().top-600;
			elemBottom = elemTop + $this.height();
			if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
				
				elemInView = $this.attr('data-id');
			}
		});
		//if (elemInView) console.log(elemInView+ " is in view!!!!");
		if (elemInView)	return elem+'[data-id="'+elemInView+'"]';
	
	}
	
	
});
