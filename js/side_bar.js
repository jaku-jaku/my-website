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
        if(G_target === "#page-blog")
        {
            //this will make sure it always goes to the main page
            G_sidebar_selected_tags.current = "#page-blog_All_Blogs";
            G_sidebar_selected_tags.blog = "#page-blog_All_Blogs";
        }
        loadSideBarRemappedBy(G_target);
        updateItemTarget();
    }
    reloadPage($this, false);
});

/*----------------------------------------------------*/
/* Side Sidebar
------------------------------------------------------ */
$(document).on('click', '.side-bar-click', function (e) {
    var $this = $(this);
    if(!$this.hasClass('active'))
    {
        var attr_selected = $this.attr("href");
        var tag_in_attr = attr_selected.substr(attr_selected.lastIndexOf('/')+1, attr_selected.length);
        G_sidebar_selected_tags.current = tag_in_attr;
        //Based on current target, call different action callback
        switch(G_target)
        {
            case "#page-about":
                G_sidebar_selected_tags.about = G_sidebar_selected_tags.current;
                break;
            case "#page-blog":
                G_sidebar_selected_tags.blog = G_sidebar_selected_tags.current;
                break;
            case "#page-projects":
                disp_cards_by(G_j_pfo_projs, G_j_pfo_projs_filtered, tag_in_attr, '#pfo-bundle', 'pfo-class');
                G_sidebar_selected_tags.proj = G_sidebar_selected_tags.current;
                break;
            case "#page-photography":
                G_sidebar_selected_tags.photo = G_sidebar_selected_tags.current;
                disp_cards_by(G_j_photos, G_j_photos_filtered, tag_in_attr, '#photo-gallery', 'gallery-class');
                break;
            case "#page-contact":
                G_sidebar_selected_tags.contact = G_sidebar_selected_tags.current;
                break;
        }
        updateItemTarget();
    }
});

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
        updateItemTarget();
    }
});

function updateItemTarget(){
    $(".side-bar-click").each(function(){
        var $this = $(this);
        var ul_parent = $this.closest('ul');
        var $attr_href = $this.attr("href");
        if(G_target === "#page-blog")//blog has to be exact
        {
            var temp = $attr_href.substr($attr_href.lastIndexOf('/')+1,$attr_href.length);
            if( temp === (G_sidebar_selected_tags.current))
            {
                $this.addClass("active");
                ul_parent.addClass("in");

            }else if($this.hasClass("active")){
                $this.removeClass("active");
            }
        }else{
            if($attr_href.includes(G_sidebar_selected_tags.current))
            {
                $this.addClass("active");
                ul_parent.addClass("in");

            }else if($this.hasClass("active")){
                $this.removeClass("active");
            }
        }
    });
    if(G_target === "#page-blog"){
        // console.log(G_sidebar_selected_tags.blog);
        if(G_sidebar_selected_tags.blog === "#page-blog_All_Blogs")
        {
            var url      = window.location.href;
            window.location.href = url.split("#")[0] + "#page-blog_All_Blogs";//Override
            $("#display-section").load("sub_mod/sec_blog.html",
                function(responseTxt, statusTxt, xhr){
                    if(statusTxt === "success")
                    {
                        disp_cards_by(G_j_blogs, G_j_blogs_filtered, G_sidebar_selected_tags.blog, '#blog-bundle', 'blog-class');
                    }
                });
        }else{
            gen_blog(G_sidebar_selected_tags.blog);
        }
    }
}

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

                var i = indexOfItemInJSON("title", "Blog", G_j_sidebar_Obj);
                var child_list = G_j_sidebar_Obj[i].children;
                if(!G_j_blogs)
                {
                    load_blogs();
                }

                for(i = 1; i < child_list.length; i++){
                    var collector= [];
                    for(var k =0; G_j_blogs && k<G_j_blogs.length;k++)
                    {
                        if(G_j_blogs[k].tags.indexOf(child_list[i].cat_name) > -1)
                            collector.push({"cat_name":G_j_blogs[k].id_name});
                    }
                    child_list[i].children = collector;
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
            var hashLink = hash_topic +"_"+ main_cat_name;
            var sub_categories = main_cat_obj.children;
            hashLink = c_S(hashLink);
            if(sub_categories)//Exist
            {
                var li_id = hash_topic +"_"+ main_cat_name;
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
            break;
        case "#page-blog":
            title = "Blog";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.blog;
            break;
        case "#page-projects":
            title = "Project";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.proj;
            break;
        case "#page-photography":
            title = "Photos";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.photo;
            break;
        case "#page-contact":
            title = "Contact";
            G_sidebar_selected_tags.current = G_sidebar_selected_tags.contact;
            break;
    }
    loadSideBarBy(title, selected_topic_.split("#").pop());
}



