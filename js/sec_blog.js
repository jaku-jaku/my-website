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
                    html_content = G_md_converter.makeHtml(data);
                    $("#display-section").html(html_content);
                    G_sidebar_selected_tags.blog = id_;
                }
            });
        }else{
            console.warn("Blog doesn't exsit!");
        }
    }else{
        console.error("Unable to load blogs!");
    }

}


$(document).on('click', '.blog-class.card', function () {
    var id = this.id;
    gen_blog(id);
});