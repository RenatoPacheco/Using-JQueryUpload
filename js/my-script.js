// JavaScript Document
jQuery(document).ready(function ($) {
    $(window).bind('resize', function (eventData) {
        $('.arquivo').each(function (index, value) {
            var valor = $(this).find('input').width() - parseInt($(this).find('label span').css('padding-left').replace('px', ''));
            $(this).find('label').width(valor);
        })
    }).resize();
    $('input:radio').bind('change', function (eventData) {
        $('form').attr('action', $(this).val());
    });
    $('.arquivo input').bind('change', function (eventData) {
		$(this).parent().find('label').addClass('on');
		if($(this).val()) {
		    $(this).parent().find('label span').text($(this).val());
		}
	});
	$('form').bind('reset', function (eventData) {
	    $(this).find('.arquivo label')
            .removeClass('on')
            .find('span').text('Selecione um arquivo...');
	});
});