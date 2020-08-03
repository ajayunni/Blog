$(window).scroll(function(e) {
    $('.navbar')[$(window).scrollTop() <= 10 ? 'addClass' : 'removeClass']('navbar-hide');
});
