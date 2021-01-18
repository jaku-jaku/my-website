// memorize last choice:
var G_sidebar_selected_tags =
    {
        about: "All",
        blog: "All",
        proj: "All",
        photo: "All",
        contact: "All",
        current: "All"
    };//by default to show all projects

var G_sidebar_selected_filters =
    {
        about: null,
        blog: null,
        proj: null,
        photo: null,
        contact: null,
        current: null
    };//by default to show all projects

var G_context_status =
    {
        side_bar_visible: true
    };

var G_PAGE_REFERENCE = ["#page-about", "#page-blog", "#page-projects", "#page-photography", "#page-contact"];

/*----------------------------------------------------*/
/* Json helper functions
------------------------------------------------------ */
//find item index in json list
function indexOfItemInJSON (_item_name, _item_val, _json_list){
    return _json_list.findIndex(function(__item, _i){
        return __item[_item_name]===_item_val;
    });
}

// sorting
function sortResults(j_arr, prop, asc) {
    return j_arr.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]);
        else return (b[prop] > a[prop]);
    });
}


//convert space to '_'
function c_S(content){
    return content.replace(/ /g, "_");
}

//convert '/' to '-'
function c_D(content){
    return content.replace(/\//g, "-");
}

/*----------------------------------------------------*/
/* cards filter selection
------------------------------------------------------ */
function disp_cards_by(list_, list_filtered_, tag_, div_id_, cards_category_){
    if(!list_)
    return false;
    if(!tag_.includes("All"))
    {
        list_filtered_ = list_.filter(function (item,n){
            return (item.tags.indexOf(tag_) > -1);
        });
    }
    else
    {
        list_filtered_ = list_;
    }
    //regen cards
    gen_cards(list_filtered_, div_id_, cards_category_);
    return list_filtered_;
}

/*----------------------------------------------------*/
/* AUTO card gen
------------------------------------------------------ */
function gen_cards(list_filered_, id_name_, cards_category_){
    var html_gened;
    html_gened = "";
    var $pfo_bundle = $(id_name_);
    $pfo_bundle.slideUp(300);
    for (var i = 0; i < list_filered_.length; i++) {
        html_gened += " <li class=\"pfo-item\">\n" +
            "<div class=\""+
            cards_category_+
            " card col-lg-4 col-md-4 col-xs-6 col-sm-6\" id=\"" + list_filered_[i].id_name + "\" default-cat=\""+c_S(list_filered_[i].tags[0])+"\">" +
            "    <span class=\"card-pic\">\n" +
            "      <div class = \"card-pic-crop\" >\n" +
            "      <img src=\""+ list_filered_[i].img_directory + list_filered_[i].img_cover + "\" alt=\""+list_filered_[i].img_cover+"\"/>\n" +
            "      </div> \n" +
            "      <div class=\"card-description\">\n" +
            "      <div class=\"card-des-title\">\n" +
            list_filered_[i].title+
            "      </div>\n" +
            "      <div class=\"card-des-explain\">\n" +
            list_filered_[i].description+
            "      </div>\n" +
            "      </div>\n" +
            "    </span>\n" +
            "</div>\n" +
            "</li>";
    }
    $pfo_bundle.html(html_gened).slideDown(200).css({top: -20, opacity: 0}).
    animate({top: 0, opacity: 1}, 200);
}

//   --------------------------------   --------------------------------    --------------------------------
/*----------------------------------------------------*/
/* Const Intv Thread
------------------------------------------------------ */
// - compute at load
$(window).on('load', startEngine);
// ----- Core Animation Code
function startEngine() {
    // alert("Done");
    var FrameTimer = setInterval(function(){
        // About me experience rendering
        Callback_Calculate(); Callback_Render();
        Callback_url_supervisor();
        // side_bar
        // Callback_Sidebar();
    },10);
}

var G_prev_url = "";
function Callback_url_supervisor(){
    var url      = window.location.href;     // Returns full URL
    if(G_prev_url !== url)
    {
        G_prev_url = url;
        var urls = url.split("#");
        var len = 0;
        var new_dir = [];
        var tags = null;
        var page_target = null;
        var modal_selection = null;
        var tag = null;
        // console.log(urls);
        // console.log(urls.length);
        if (urls.length == 2)
        {
            tags = ("#"+urls[1]).split("/");
            page_target = tags[0];
            new_dir.push(page_target);
            len = tags.length;
            // console.log(tags);
            if (G_PAGE_REFERENCE.indexOf(page_target) < 0)
            {
                page_target = null;// invalid
            }
            // console.log("[Update Urls]")
        }
        if (page_target == null)
        {
            // default page for invalid page target
            page_target = "#page-about";
            new_dir.push("#page-about");
        }
        if (len > 1)
        {
            if (tags[1].includes("All"))
            {
                // console.log("[ All ]")
                tag = "All";
                filter = null;
            }
            else if (len == 2)
            {
                // console.log("")
                // load popup
                modal_selection = tags[1];
            }
            else if (len >= 3)
            {
                filter = tags[1];
                tag = tags[2];
                if (len == 4)
                {
                    // load popup
                    modal_selection = tags[3];
                }
            }
            else
            {
                // invalid entry
            }
        }
        

        // console.log("tags: ", tags);
        // console.log("page_target: ",page_target);
        // console.log("new-url: ", new_dir);
        // console.log("modal_selection: ", modal_selection);
        
        //For page refreshing
        if(G_target != page_target)
        {
            // console.log("Re-direct to: ", page_target);
            // update
            {
                G_target = page_target;
                {
                    // load side bar
                    loadSideBarRemappedBy(G_target);
                    // load page and contents
                    $(".nav-bar-click").each(function() {
                        var $this = $(this);
                        var href_str = $this.attr("href");
                        if(href_str === page_target){
                            reloadPage($this, false);
                        }
                    });
                    // open modal
                }
            }
        }
        // update content based on filters
        if ( tag && filter )
        {
            G_sidebar_selected_tags.current = tag;
            G_sidebar_selected_filters.current = filter;
            new_dir.push(filter);
            new_dir.push(tag);
            refreshItemsBasedOnCurrentTag();
        }
        else if (tag && !filter) // for all entries
        {
            G_sidebar_selected_tags.current = tag;
            G_sidebar_selected_filters.current = filter;
            refreshItemsBasedOnCurrentTag();
        }
        
        renderBarItem();

        if (G_item && (modal_selection == G_item))
        {
            new_dir.push(modal_selection);
        }
        else if (modal_selection != G_item)
        {
            if (modal_selection == null)
            {
                // console.log("[Entry not valid]");
                $('#blogModalTemplate').modal('hide');
                $('#portfolioModalTemplate').modal('hide');
                G_item = modal_selection;
            }
            else
            {
                // console.log("[Load new entry]");
                blog_id = indexOfItemInJSON("id_name",modal_selection,G_j_blogs_filtered);
                proj_id = indexOfItemInJSON("id_name",modal_selection,G_j_pfo_projs_filtered);
                if (blog_id >= 0)
                {
                    // console.log("[Load new entry: blog]", blog_id);
                    gen_blog_modal(blog_id);
                    new_dir.push(modal_selection);
                    $('#blogModalTemplate').modal('show');
                    $('#portfolioModalTemplate').modal('hide');
                    G_item = modal_selection;
                }
                else if (proj_id >= 0)
                {
                    // console.log("[Load new entry: proj]", proj_id);
                    gen_pfo_modal(proj_id);
                    new_dir.push(modal_selection);
                    $('#blogModalTemplate').modal('hide');
                    $('#portfolioModalTemplate').modal('show');
                    G_item = modal_selection;
                }
            }
        }
        
        // update href:
        window.location.href = urls[0] + new_dir.join("/");
    }
}

var G_item = null;
function htmlReplace(new_item)
{
    var urls = window.location.href.split("/");
    if (G_item == null)
    {
        urls.push(new_item); // add
    }
    else 
    {
        if (new_item == null)
        {
            urls.pop(); // remove
        }
        else if (urls[urls.length - 1].includes(G_item))
        {
            urls[urls.length - 1] = new_item; // replace
        }
    }
    G_item = new_item;
    window.location.href = urls.join("/");
}