$(document).on('click', '.nav-bar-click', function (e) {
    var $this = $(this);
    reloadPage($this, false);
});

function reloadPage($this, force)
{
    if(!$this.hasClass('active') || force)
    {
        $(".nav-bar-click.active").removeClass("active");
        var tag = $this.attr("href");
        $this.addClass('active');

        var disp_section = $("#display-section");
        disp_section.attr("content_tag", tag);
        disp_section.empty();
        switch ($this.attr('href')) {
            case "#page-about":
                disp_section.load("sub_mod/sec_experience.html");
                break;
            case "#page-blog":
                disp_section.load("sub_mod/sec_blog.html",
                    function(responseTxt, statusTxt, xhr){
                        if(statusTxt === "success")
                        {
                            disp_cards_by(G_j_blogs, G_j_blogs_filtered, G_sidebar_selected_tags.blog, '#blog-bundle', 'blog-class');
                        }
                    });
                break;
            case "#page-projects":
                disp_section.load("sub_mod/sec_projects.html",
                    function(responseTxt, statusTxt, xhr){
                        if(statusTxt === "success")
                        {
                            disp_cards_by(G_j_pfo_projs, G_j_pfo_projs_filtered, G_sidebar_selected_tags.proj, '#pfo-bundle', 'pfo-class');
                        }
                    });
                break;
            case "#page-photography":
                disp_section.load("sub_mod/sec_photography.html",
                    function(responseTxt, statusTxt, xhr){
                        if(statusTxt === "success")
                        {
                            disp_cards_by(G_j_photos, G_j_photos_filtered, G_sidebar_selected_tags.photo, '#photo-gallery', 'gallery-class');
                        }
                    });
                break;
            case "#page-contact":
                disp_section.load("sub_mod/sec_contact.html");
                break;
            default:
                console.error("Oops, something is wrong.");
                break;
        }
    }
}

/*----------------------------------------------------*/
/* Load json file, and sort
------------------------------------------------------ */
var G_j_pfo_projs = null;
var G_j_pfo_projs_filtered= null;
//Load json and sort json and generate pfo cards
$(function () {
    if(G_j_pfo_projs==null)
    {
        $.getJSON("sub_mod/obj_projects.json",
            function (json) {
                G_j_pfo_projs = json;
                if(G_j_pfo_projs != null)
                {
                    G_j_pfo_projs = sortResults(G_j_pfo_projs, "id_name", true);
                    G_j_pfo_projs_filtered = G_j_pfo_projs;
                }
            });
    }
});

/*---------------------------------------------------------------*/
/*******************************************************************
/*****************AUTO portfolio modal real-time gen****************
/*******************************************************************
----------------------------------------------------------------- */
var G_cur_pfo_id_name = "";

function gen_pfo_modal(_id_name, offset)
{
    // Use preloaded json to construct page dynamically
    if(G_j_pfo_projs_filtered != null) {
        var i = indexOfItemInJSON("id_name",_id_name,G_j_pfo_projs_filtered);
        if(i !== -1) {
            i = i + offset; //offsetting the selection for prev/next
            i = i <= -1 ? (G_j_pfo_projs_filtered.length-1) : i; //-ve prev
            i = i >= G_j_pfo_projs_filtered.length ? 0 : i; //next is 0

            G_cur_pfo_id_name = G_j_pfo_projs_filtered[i].id_name; //save id_name globally
            var modal_html_buffer;

            modal_html_buffer = "<h1>" + G_j_pfo_projs_filtered[i].title + "<h1>";
            $('#modal-templ-title').html(modal_html_buffer);

            modal_html_buffer = "<div class=\"carouselCard\">\n" +
                "                            <div class=\"owl-demo owl-carousel img-comment\" >";
            //load demo images
            // <!--TODO : Also need for youtube videos embedding support -->
            var j_items = G_j_pfo_projs_filtered[i].more_imgs;
            var j = 0;
            for (j = 0; j < j_items.length; j++) {
                modal_html_buffer += "<div><img src=\"" + G_j_pfo_projs_filtered[i].img_directory
                    + j_items[j] + "\"><p>" + G_j_pfo_projs_filtered[i].more_imgs_title[j] + "</p></div>\n";
            }

            modal_html_buffer += " </div>\n" +
                "                        </div>";
            // console.log(modal_html_buffer);
            $('#modal-templ-imgs').html(modal_html_buffer);

            //load details
            // <!--TODO : Add more type of referral links & their icons -->
            j_terms = G_j_pfo_projs_filtered[i].tags;
            modal_html_buffer = "<p><strong>Position: </strong>" + G_j_pfo_projs_filtered[i].position + "</p>\n" +
                "                            <p><strong>Category: </strong>";
            for (j = 0; j < j_terms.length - 1; j++) {
                modal_html_buffer += j_terms[j] + ", ";
            }
            modal_html_buffer += j_terms[j];
            modal_html_buffer += "</p>\n" +
                " <p><strong>View Code: </strong> <i class=\"fa fa-github\" style=\"padding-right:2px;\"></i><a href=\"" +
                G_j_pfo_projs_filtered[i].code_link + "\" target=\"_blank\">"
                + G_j_pfo_projs_filtered[i].code_link + "</a></p>\n";
            $('#modal-templ-details').html(modal_html_buffer);

            //load descriptions Paragraphs
            modal_html_buffer = "<h5 class=\"info-font\">Project Description</h5>\n";
            j_terms = G_j_pfo_projs_filtered[i].paras_title;
            for (j = 0; j < j_terms.length; j++) {
                modal_html_buffer += "<div  class=\"project-head4\"><h4>" + j_terms[j] + "</h4></div>\n";
                modal_html_buffer += "<p class=\"project-para\">\n" + G_j_pfo_projs_filtered[i].paras[j] + "</p>\n";
            }
            $('#modal-templ-description').html(modal_html_buffer);

            //Update owl image
            $(".owl-demo").owlCarousel({
                navigation: true,
                navigationText: ["<span class='angle'></span>", "<span class='angle'></span>"],
                singleItem: true,
                autoHeight: true,
                transitionStyle: "fade"
            });

            //Display the modal
            $('#portfolioModalTemplate').modal('show');
        }
    }
}
$(document).on('click', '.pfo-class.card', function () {
    var id = this.id;
    gen_pfo_modal(id, 0);
});
$(document).on('click', '.prevp', function () {
    gen_pfo_modal(G_cur_pfo_id_name, -1);
});
$(document).on('click', '.nextp', function () {
    gen_pfo_modal(G_cur_pfo_id_name, +1);
});