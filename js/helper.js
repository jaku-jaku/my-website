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

var G_context_status =
    {
        side_bar_visible: true
    };
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
/* Const Intv Thread
------------------------------------------------------ */
// - compute at load
$(window).on('load', startEngine);
// ----- Core Animation Code
function startEngine() {
    var FrameTimer = setInterval(function(){
        // About me experience rendering
        Callback_Calculate(); Callback_Render();
        // side_bar
        // Callback_Sidebar();
    },10);
}
