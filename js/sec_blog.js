/*----------------------------------------------------*/
/* Load json file, and sort
------------------------------------------------------ */
var G_j_blogs = null;
var G_j_blogs_filtered= null;
//Load json and sort json and generate pfo cards
function load_blogs(){
    if (G_j_blogs == null) {
        $.getJSON("sub_mod/obj_blogs.json",
            function (json) {
                G_j_blogs = json;
                if (G_j_blogs != null) {
                    G_j_blogs = sortResults(G_j_blogs, "id_name", true);
                    G_j_blogs_filtered = G_j_blogs;
                }
            });
    }
}
$(load_blogs);

function gen_blog(id_){
    if(G_j_blogs_filtered !==null)
    {
        var i = indexOfItemInJSON("id_name",id_,G_j_blogs_filtered);
        if(i !== -1) {
            var md_name = G_j_blogs_filtered[i].md_file_name;
            // console.log(md_name);
            var url_path = "Resources/Blogs/"+md_name;
            $.ajax({
                url : url_path,
                dataType: "text",
                success : function (data) {
                    const md = window.markdownit({
                        html: true,
                        linkify: true,
                        typographer: true,
                    });

                    md.use(markdownitCheckbox,{
                        divWrap: true,
                        divClass: 'cb',
                        idPrefix: 'cbx_'
                    });

                    md.use(MermaidPlugin);
                    md.use(markdownitMark);

                    html_content = md.render(data);

                    $("#display-section").html(html_content);
                    G_sidebar_selected_tags.blog = id_;
                    G_sidebar_selected_tags.current = id_;
                    MathJax.Hub.Config({
                        tex2jax: {
                            inlineMath: [['$$','$$'], ['$','$']],
                            processEscapes: true,
                            TeX: { equationNumbers: { autoNumber: "AMS" } },
                            typographer: true
                        }
                    });

                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);  // renders mathjax if 'typeset' is true (or undefined)
                    //theme
                    let theme_ = G_j_blogs_filtered[i].theme;
                    if(!theme_)
                        theme_ = 'forest';//default
                    if (window.mermaid) {
                        mermaid.initialize({theme: theme_});//{theme: 'forest'}
                    }
                    mermaid.init({noteMargin: 10}, ".mermaid");
                }
            });
        }else{
            console.warn("Blog doesn't exsit!");
            G_sidebar_selected_tags.current = "#page-blog_All_Blogs";
            G_sidebar_selected_tags.blog = "#page-blog_All_Blogs";
            updateItemTarget();
        }
    }else{
        console.error("Unable to load blogs!");
        G_sidebar_selected_tags.current = "#page-blog_All_Blogs";
        G_sidebar_selected_tags.blog = "#page-blog_All_Blogs";
        updateItemTarget();
    }

}


$(document).on('click', '.blog-class.card', function () {
    var id = this.id;
    var def_cat = this.getAttribute("default-cat");
    var url      = window.location.href;
    window.location.href = url +"_"+ def_cat + "/"+id;//update href
    gen_blog(id);
});