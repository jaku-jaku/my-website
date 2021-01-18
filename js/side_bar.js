/*----------------------------------------------------*/
/* Global Vars
------------------------------------------------------ */
var G_j_sidebar_Obj = null;
var G_target = null;
/*----------------------------------------------------*/
/* Detecting. .....
------------------------------------------------------ */
$(document).on('click', '.nav-bar-click', function (e) {
    var $this = $(this);
    var click_target = $this.attr('href');
    if(click_target !== G_target)
    {
        G_target = click_target;
        loadSideBarRemappedBy(G_target);
    }
    reloadPage($this, false);
});

/*----------------------------------------------------*/
/* Side Sidebar
------------------------------------------------------ */
function renderBarItem(){
    bar_items = $(".side-bar-click");
    if (bar_items)
    {
        bar_items.each(function(index, element) {
            if ($(this).attr("href").includes(G_sidebar_selected_tags.current))
            {
                if(!$(this).hasClass("active"))
                {
                    // console.log("active:", element)
                    $(this).addClass("active")
                }
            }
            else
            {
                if($(this).hasClass("active"))
                {
                    // console.log("deactive:", element)
                    $(this).removeClass("active")
                }
            }
        });
    }
    drop_items = $(".dropdown-toggle");
    if (drop_items)
    {
        // console.log(G_sidebar_selected_filters)
        drop_items.each(function(index, element) {
            if ($(this).attr("href").includes(G_sidebar_selected_filters.current))
            {
                if(!$(this).hasClass("active"))
                {
                    // console.log("active:", element)
                    $(this).delay(1000).addClass("active")
                }
            }
            else
            {
                if($(this).hasClass("active"))
                {
                    // console.log("deactive:", element)
                    $(this).removeClass("active")
                }
            }
        });
    }
}
/*----------------------------------------------------*/
/* sidebar Category Collapse
------------------------------------------------------ */
$(document).on('click', '#sidebarCollapse', function () {
    var $sidebar = $('#sidebar');
    $sidebar.toggleClass('active');
    $(this).toggleClass('active');
    if(G_context_status.side_bar_visible)
    {
        if(!G_target)
        {
            G_target = $(".nav-bar-click.active").attr('href');
        }
        if(G_target)
        {
            loadSideBarRemappedBy(G_target);
        }
        renderBarItem();
    }
});
/*----------------------------------------------------*/
/* Load json file, and sort
------------------------------------------------------ */
//Load json and sort json and generate pfo cards
function loadJsonFileSideBar() {
    if(G_j_sidebar_Obj==null)
    {
        $.getJSON("sub_mod/obj_side_bar_selections.json",
            function (json) {
                G_j_sidebar_Obj = json;
                if(G_j_sidebar_Obj != null)
                {
                    G_j_sidebar_Obj = sortResults(G_j_sidebar_Obj, "title", true);
                }
            });
    }
}

function loadSideBarBy(title_, hash_topic){
    if(!G_j_sidebar_Obj)
    {
        return;
    }
    var obj_index = indexOfItemInJSON("title", title_, G_j_sidebar_Obj);
    var html_block = "";
    if(obj_index>=0)
    {
        var main_categories =  G_j_sidebar_Obj[obj_index].children;
        var main_heading = G_j_sidebar_Obj[obj_index].heading;
        html_block += "<p>"+ main_heading +"</p>";

        for (var i=0; i<main_categories.length; i++)
        {
            var main_cat_obj = main_categories[i];
            var main_cat_name = main_cat_obj.cat_name;
            var hashLink = hash_topic +"/"+ main_cat_name;
            var sub_categories = main_cat_obj.children;
            hashLink = c_S(hashLink);
            if(sub_categories)//Exist
            {
                var li_id = hash_topic +"-"+ main_cat_name;
                li_id = c_S(li_id);//replace space with '_'
                html_block += "<li>";
                html_block += "<a href=\"#"+li_id+"\" data-toggle=\"collapse\" aria-expanded=\"false\" class=\"dropdown-toggle\">"
                    + main_cat_name
                    +"</a>\n";
                html_block += "<ul class=\"collapse list-unstyled\" id=\""+li_id+"\"> \n";
                for (var j=0; j<sub_categories.length; j++)
                {
                    var sub_cat_name = sub_categories[j].cat_name;
                    var sub_hash_link = hashLink + "/" + sub_cat_name;
                    sub_hash_link = c_S(sub_hash_link);
                    html_block += "<li> \n"
                        + "<a href=\"#"+sub_hash_link+"\" class=\"side-bar-click\">"+ sub_cat_name+"</a> \n"
                        + "</li> \n";
                }
                html_block += "</ul> \n";
            }else{
                html_block += "<li>";
                html_block += "<a href=\"#"+hashLink+"\" class=\"side-bar-click\">"
                    + main_cat_name
                    +"</a>\n";
            }
            html_block += "</li> \n";
        }
    }

    $('#sidebar-dynamic-selections').html(html_block);
}

function loadSideBarRemappedBy(selected_topic_){
    var title = "";
    switch(selected_topic_)
    {
        case "#page-about":
            title = "About";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.about;
            G_sidebar_selected_filters.current = G_sidebar_selected_filters.about;
            break;
        case "#page-blog":
            title = "Blog";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.blog;
            G_sidebar_selected_filters.current = G_sidebar_selected_filters.blog;
            break;
        case "#page-projects":
            title = "Project";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.proj;
            G_sidebar_selected_filters.current = G_sidebar_selected_filters.proj;
            break;
        case "#page-photography":
            title = "Photos";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.photo;
            G_sidebar_selected_filters.current = G_sidebar_selected_filters.photo;
            break;
        case "#page-contact":
            title = "Contact";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.contact;
            G_sidebar_selected_filters.current = G_sidebar_selected_filters.contact;
            break;
    }
    loadSideBarBy(title, selected_topic_.split("#").pop());
}

function refreshItemsBasedOnCurrentTag()
{
    //Based on current target, call different action callback
    switch(G_target)
    {
        case "#page-about":
            G_sidebar_selected_tags.about = G_sidebar_selected_tags.current;
            G_sidebar_selected_filters.about = G_sidebar_selected_filters.current;
            break;
        case "#page-blog":
            G_sidebar_selected_tags.blog = G_sidebar_selected_tags.current;
            G_sidebar_selected_filters.blog = G_sidebar_selected_filters.current;
            G_j_blogs_filtered = disp_cards_by(G_j_blogs, G_j_blogs_filtered, G_sidebar_selected_tags.blog, '#blog-bundle', 'blog-class');
            break;
        case "#page-projects":
            G_sidebar_selected_tags.proj = G_sidebar_selected_tags.current;
            G_sidebar_selected_filters.proj = G_sidebar_selected_filters.current;
            G_j_pfo_projs_filtered = disp_cards_by(G_j_pfo_projs, G_j_pfo_projs_filtered, G_sidebar_selected_tags.proj, '#pfo-bundle', 'pfo-class');
            break;
        case "#page-photography":
            G_sidebar_selected_tags.photo = G_sidebar_selected_tags.current;
            G_sidebar_selected_filters.photo = G_sidebar_selected_filters.current;
            G_j_photos_filtered = disp_cards_by(G_j_photos, G_j_photos_filtered, G_sidebar_selected_tags.photo, '#photo-gallery', 'gallery-class');
            break;
        case "#page-contact":
            G_sidebar_selected_tags.contact = G_sidebar_selected_tags.current;
            G_sidebar_selected_filters.contact = G_sidebar_selected_filters.current;
            break;
    }
}

