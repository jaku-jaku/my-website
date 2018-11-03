/*----------------------------------------------------*/
/* Load json file, and sort
------------------------------------------------------ */
var G_j_photos = null;
var G_j_photos_filtered= null;
//Load json and sort json and generate pfo cards
$(function () {
    if (G_j_photos == null) {
        $.getJSON("sub_mod/gallery_objects.json",
            function (json) {
                G_j_photos = json;
                if (G_j_photos != null) {
                    G_j_photos = sortResults(G_j_photos, "id_name", true);
                    G_j_photos_filtered = G_j_photos;
                }
            });
    }
});

$(document).on('click', '.gallery-class.card', function () {
    var img_src=$(this).children().children().children().attr('src');
    $('#imagepreview').attr('src', img_src); // here asign the image to the modal when the user click the enlarge link
    $('#image-modal').modal('show');
});

function setModalMaxHeight(element) {
    this.$element     = $(element);
    this.$content     = this.$element.find('.modal-content');
    var borderWidth   = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin  = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight  = this.$element.find('.modal-header').outerHeight() || 0;
    var footerHeight  = this.$element.find('.modal-footer').outerHeight() || 0;
    var maxHeight     = contentHeight - (headerHeight + footerHeight);

    this.$content.css({
        'overflow': 'hidden'
    });

    this.$element
        .find('.modal-body').css({
        'max-height': maxHeight,
        'overflow-y': 'auto'
    });
}

$('.modal').on('show.bs.modal', function() {
    $(this).show();
    setModalMaxHeight(this);
});

$(window).resize(function() {
    if ($('#image-modal.modal.in').length != 0) {
        setModalMaxHeight($('#image-modal.modal.in'));
    }
});