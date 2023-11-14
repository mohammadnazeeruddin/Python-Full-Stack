Template.blogArticleView.onRendered(function() {

    // Chosen select
    if ($.fn.chosen)
        $('.chosen-select').chosen();

    // Wysiwyg editor
    if ($.fn.wysiwyg)
        $('.wysiwyg').wysiwyg();

})
