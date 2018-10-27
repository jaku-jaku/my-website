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
                disp_section.load("sub_mod/Experience.html");
                break;
            case "#page-blog":
                break;
            case "#page-projects":
                disp_section.load("sub_mod/Projects.html",
                    function(responseTxt, statusTxt, xhr){
                        if(statusTxt === "success")
                        {
                            disp_pfo_by(G_sidebar_selected_tags.proj);
                        }
                    });
                break;
            case "#page-photography":
                break;
            case "#page-contact":
                disp_section.load("sub_mod/ContactForm.html");
                break;
            default:
                disp_section.load("sub_mod/UnderConstruction.html");
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
        $.getJSON("sub_mod/pfo_projects.json",
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

/*----------------------------------------------------*/
/* pfo filter selection
------------------------------------------------------ */
// $(document).on('click', '.filter_tag', function () {
//     var $this = $(this);
//     if(!$this.hasClass('activeL')) {
//         $(".activeL").removeClass("activeL");
//         $this.addClass('activeL');
//         tag = $this.attr("datalist");
//         disp_pfo_by(tag);
//     }
// });

function disp_pfo_by(tag_){
    // console.log(tag_);
    if(!G_j_pfo_projs)
        return false;
    if(!tag_.includes("All"))
    {
        G_j_pfo_projs_filtered = G_j_pfo_projs.filter(function (item,n){
            return (item.tags.indexOf(tag_) > -1);
        });
    }else
        G_j_pfo_projs_filtered = G_j_pfo_projs;
    //regen cards
    gen_pfo_cards(G_j_pfo_projs_filtered);
    return true;
}

/*----------------------------------------------------*/
/* AUTO portfolio card gen
------------------------------------------------------ */
function gen_pfo_cards(_G_j_pfo_projs_filtered){
    var pfo_elem;
    pfo_elem = "";
    var $pfo_bundle = $('#pfo-bundle');
    $pfo_bundle.slideUp(300);
    for (var i = 0; i < _G_j_pfo_projs_filtered.length; i++) {
        pfo_elem += " <li class=\"pfo-item\">\n" +
            "<div class=\"card col-lg-4 col-md-4 col-xs-6 col-sm-6\" id=\"" + _G_j_pfo_projs_filtered[i].id_name + "\">" +
            "    <span class=\"card-pic\">\n" +
            "      <div class = \"card-pic-crop\" >\n" +
            "      <img src=\""+ _G_j_pfo_projs_filtered[i].img_directory + _G_j_pfo_projs_filtered[i].img_cover + "\"/>\n" +
            "      </div> \n" +
            "      <div class=\"card-description\">\n" +
            "      <div class=\"card-des-title\">\n" +
            _G_j_pfo_projs_filtered[i].title+
            "      </div>\n" +
            "      <div class=\"card-des-explain\">\n" +
            _G_j_pfo_projs_filtered[i].description+
            "      </div>\n" +
            "      </div>\n" +
            "    </span>\n" +
            "</div>\n" +
            "</li>";
    }
    $pfo_bundle.html(pfo_elem).slideDown(200).css({top: -20, opacity: 0}).
    animate({top: 0, opacity: 1}, 200);
}





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
$(document).on('click', '.card', function () {
    var id = this.id;
    gen_pfo_modal(id, 0);
});
$(document).on('click', '.prevp', function () {
    gen_pfo_modal(G_cur_pfo_id_name, -1);
});
$(document).on('click', '.nextp', function () {
    gen_pfo_modal(G_cur_pfo_id_name, +1);
});