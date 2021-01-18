
/*----------------------------------------------------*/
/* Load json file, and sort
------------------------------------------------------ */
var G_j_blogs = null;
var G_j_blogs_filtered= null;
var G_j_blog_i = null;
var DEFAULT_BLOG_DIRECTORY = "#page-blog";
//Load json and sort json and generate pfo cards
function load_blogs(){
    if (G_j_blogs == null) {
        $.getJSON("sub_mod/obj_blogs.json",
            function (json) {
                G_j_blogs = json;
                if (G_j_blogs != null) {
                    G_j_blogs = sortResults(G_j_blogs, "index", false);
                    G_j_blogs_filtered = G_j_blogs;
                }
            });
    }
}
$(load_blogs);

function gen_blog_modal(i){
    if(G_j_blogs_filtered !==null)
    {
        if(i !== -1) {
            var md_name = G_j_blogs_filtered[i].md_file_name;
            var url_path = "Resources/Blogs/"+md_name;
            $.ajax({
                url : url_path,
                dataType: "text",
                success : function (data) {
                    const md = window.markdownit({
                        html: true,
                        linkify: true,
                        typographer: true,
                        highlight: function (str, lang) {
                            if (lang && hljs.getLanguage(lang)) {
                                try {
                                    return '<pre class="hljs"><code>' +
                                        hljs.highlight(lang, str, true).value +
                                        '</code></pre>';
                                } catch (__) {}
                            }

                            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
                        }
                    });

                    md.use(markdownitCheckbox,{
                        divWrap: true,
                        divClass: 'cb',
                        idPrefix: 'cbx_'
                    });

                    md.use(MermaidPlugin);
                    md.use(markdownitMark);

                    let html_content = md.render(data);

                    $("#modal-templ-blog-content").html(html_content);
                    MathJax.Hub.Config({
                        tex2jax: {
                            inlineMath: [['$','$']],
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
        }
    }else{
        console.error("Unable to load blogs!");
    }

}

function update_url(id) {
    var url      = window.location.href;
    window.location.href =  url.split(DEFAULT_BLOG_DIRECTORY)[0] + DEFAULT_BLOG_DIRECTORY + "/" + id;
}

$(document).on('click', '.blog-class.card', function () {
    var i = indexOfItemInJSON("id_name",this.id,G_j_blogs_filtered);
    update_url(this.id);

    //Display the modal
    $('#blogModalTemplate').modal('show');                
    gen_blog_modal(i);
    G_j_blog_i = i;
});

$(document).on('click', '.closeb', function () {
    update_url("");
    G_j_blog_i = null;
});
$(document).on('click', '.prevb', function () {
    var i = G_j_blog_i - 1;
    i = i <= -1 ? (G_j_blogs_filtered.length-1) : i; //-ve prev
    G_j_blog_i = i;
    var id = G_j_blogs_filtered[i]["id_name"];
    update_url(id);
    gen_blog_modal(i);
});
$(document).on('click', '.nextb', function () {
    var i = G_j_blog_i + 1;
    i = i >= G_j_blogs_filtered.length ? 0 : i; //next is 0
    G_j_blog_i = i;
    var id = G_j_blogs_filtered[i]["id_name"];
    update_url(id);
    gen_blog_modal(i);
});
