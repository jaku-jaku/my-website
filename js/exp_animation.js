

// $(document).on('mouseover','#exp-canvas', function () {
//     var C = document.getElementById('exp-canvas');
//     var WH = [C.scrollWidth, C.scrollHeight];
//     console.log(WH);
// });

// ----- RUN Scrips @ Statup & resizing
// - when resize => recompute the dots
window.addEventListener('resize', function () {
    main_anim_exp();
});
// - compute at load
$(window).on('load', main_anim_exp);

// ----- Objects
var __DEFAULT_FCLR__ = '#42DCA3';
var __HVR_FCLR__ = '#337AB7';

function Node(_data, _x, _y, _r) {
    this.IDn = null;
    this.data = _data;
    this.x = _x;
    this.y = _y;
    this.r = _r;
    this.MODE = 0;
    this.quadrant = 1;
    this.Draw = function (_ctx){
        x = this.x;
        y = this.y;
        r = this.r;
        mdata = this.data;
        switch(this.quadrant)
        {
            case 1:
                orientx = 1;
                orienty = 1;
                break;
            case 2:
                orientx = -1;
                orienty = 1;
                break;
            case 3:
                orientx = -1;
                orienty = -1;
                break;
            case 4:
                orientx = 1;
                orienty = -1;
                break;
        }
        _ctx.beginPath();
        _ctx.arc(x,y,r, 0, 2*Math.PI, false);
        if(this.MODE === 1) {
            // HOVER
            _ctx.fillStyle= __HVR_FCLR__;
            _ctx.strokeStyle = __HVR_FCLR__;
            // TODO : hover show shortened info
            // TODO : mode 3 show detailed info
        }
        else{
            _ctx.fillStyle = __DEFAULT_FCLR__;
            _ctx.strokeStyle = __DEFAULT_FCLR__;
        }
        _ctx.globalAlpha = 0.5;
        _ctx.fill();
        _ctx.lineWidth = 1;
        _ctx.stroke();
        if(this.MODE === 1) {
            _ctx.beginPath();
            _ctx.moveTo(x+(r+2)*orientx,y-(r+2)*orienty);
            _ctx.lineTo(x+30*orientx,y-30*orienty);
            _ctx.lineTo(x+(30+100)*orientx,y-30*orienty);
            _ctx.stroke();
            _ctx.closePath();

            //title
            _ctx.font = "15px Comic Sans MS";
            _ctx.fillStyle = "blue";
            _ctx.textAlign = "left";
            _ctx.fillText(mdata['title'],x+40*orientx,y-40*orienty);

            //content
            _ctx.font = "10px Comic Sans MS";
            var str = mdata['Description'];
            var tw = _ctx.measureText(str).width;
            var max_itr = Math.ceil(tw/100);
            var str_span = Math.ceil(str.length/max_itr);
            var cur_str_i = 0;
            for (var i = 0; i< max_itr; i++)
            {
                _ctx.fillText(str.substring(cur_str_i, cur_str_i+str_span),x+40*orientx,y-(40 -i*15 -25)*orienty);
                cur_str_i += str_span;
            }



        }
    }
    this.isOverlap = function (_mX, _mY) {
        //Assumption: BND included
        if (this.x >= (_mX-this.r) && this.x <= (_mX+this.r) && this.y >= (_mY-this.r) && this.y <= (_mY+this.r))
        {
            return true;
        }
        return false;
    }
    this.switchMODE = function (_inRange) {
        if(_inRange)
            this.MODE = 1;
        else
            this. MODE = 0;
    }
}

var data_ = "{\n" +
    "    \"title\" : \"Baanto Inc\",\n" +
    "    \"start_date\": \"2017-May\",\n" +
    "    \"end_date\": \"2017-Aug\",\n" +
    "    \"Duration\": \"4 mons.\",\n" +
    "    \"Description\": \"do some touch scree tech [To be edited] In grade 12 computer engineering course, I learned a fakfdsafsdafds afds af d af \",\n" +
    "    \"URL\": \"http://baanto.com/\" \n" +
    "}";

var node_ = new Node(JSON.parse(data_), 100, 100, 10);


// ----- Core Animation Code
function main_anim_exp() {
    var C = document.getElementById('exp-canvas');
    var Bkg = document.getElementById('exp-bkg-img');
    var WH = [Bkg.scrollWidth, Bkg.scrollHeight];
    //make same resolution as screen
    C.width = WH[0];
    C.height = WH[1];
    C.scrollWidth = WH[0];
    C.scrollHeight = WH[1];
    console.log(WH);
    if (C.getContext) {
        var ctx = C.getContext('2d');
        var FrameTimer = setInterval(function(){Callback_Calculate(); Callback_Render(WH, ctx);},10);
        ctx.canvas.addEventListener("mousemove",function(event){
            var rect = ctx.canvas.getBoundingClientRect();
            mouseX=event.clientX-rect.left;
            mouseY=event.clientY-rect.top;
            Callback_mouse(mouseX, mouseY);
        });
    }
}

function Callback_mouse(_mouseX, _mouseY) {
    node_.switchMODE(node_.isOverlap(_mouseX, _mouseY));
}

function Callback_Calculate() {

}

function Callback_Render(_WH, _ctx) {
    _ctx.clearRect(0,0,_WH[0],_WH[1]);
    node_.Draw(_ctx);
}