jQuery(document).ready(function( $ ) {
	
    var collapseItem = localStorage.getItem('collapseItem'); 
    if (collapseItem) {
       $(collapseItem).collapse('show')
    }
	
  // Smooth scroll for the menu and links with .scrollto classes
  $('.smoothscroll').on('click', function(e) {
    e.preventDefault();
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {

        $('html, body').animate({
          scrollTop: target.offset().top - 48
        }, 1500, 'easeInOutExpo');
      }
    }
  });
  
  //toggle side nav
  $(".navbar-collapse a").on('click', function() {
    $(".navbar-collapse.collapse").removeClass('in');
  });
  
  $('a.pb-menu-click').click(function(event) {
	  	
/*
	  	//close any open menus
	  	var arrOpenedDivs= document.querySelectorAll(".show");
	  	for (i = 0; i < arrOpenedDivs.length; i++) {
	  		arrOpenedDivs[i].classList.remove('show');
		}	
*/
	
	  
       let selectedMenu = $(this).data('prebidclickid');
       let thisMenuDiv = document.getElementById(selectedMenu);
       $(thisMenuDiv).addClass('show')
       
       localStorage.setItem('collapseItem', $(thisMenuDiv));
       
  });

 
});
