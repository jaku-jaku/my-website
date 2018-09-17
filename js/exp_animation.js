

// $(document).on('mouseover','#exp-canvas', function () {
//     var C = document.getElementById('exp-canvas');
//     var WH = [C.scrollWidth, C.scrollHeight];
//     console.log(WH);
// });

// ----- RUN Scrips @ Statup & resizing
$.getJSON("sub_mod/exp_objects.json",
    function (json) {
        for (var i = 0; i < json.length; i++)
        {
            var node1 = new Node(json[i]);
            G_nodeList.push(node1);
        }
    });
// - when resize => recompute the dots
window.addEventListener('resize', function () {
    updateWH();
});
// - compute at load
$(window).on('load', startEngine);

// ----- Objects
var __DEFAULT_FCLR__ = '#42DCA3';
var __HVR_FCLR__ = '#337AB7';
var G_CVS = null;
var G_BKG = null;
var G_WH = null;
var G_ctx = null;
var ENUM_NODE_MODE = {"idle":1, "hover":2, "click":3};
var G_nodeList = [];
function Node(_data) {
    this.IDn = null;
    this.data = _data;
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.MODE = ENUM_NODE_MODE.idle;
    this.quadrant = 1;
    this.startTIme = Date.now();
    this.title_w = [0,0,0];
    this.mx_lines = 0;
    this.str_span = 0;
    // TODO: add silent state animation
    // TODO: add init function, only calc static
    // data at update or scrn change
    this.updateStaticData = function () {
        var m_data = this.data;
        this.x = G_WH[0]*m_data['position'][0]/100;
        this.y = G_WH[1]*m_data['position'][1]/100;
        this.r = G_WH[0]*m_data['position'][2]/100;
        this.anim_r = this.r;
        this.quadrant = m_data['position'][3]%5;
        G_ctx.font = "15px Comic Sans MS";
        this.title_w[0] = G_ctx.measureText(m_data['title']).width;
        this.title_w[1] = G_ctx.measureText(m_data['start_date'] + m_data['end_date']).width;
        this.title_w[2] = this.title_w[0]+this.title_w[1];
        G_ctx.font = "10px Comic Sans MS";
        var str = m_data['Description'];
        var tw = G_ctx.measureText(str).width;
        this.mx_lines = Math.ceil(tw/this.title_w[2]);
        this.str_span = Math.ceil(str.length/this.mx_lines);
        console.log(this.x, this.y);
        //update drawing positions
        x = this.x;
        y = this.y;
        r = this.r;
        this.orient = [1,1];
        switch(this.quadrant)
        {
            case 1:
                this.orient = [1,1];
                break;
            case 2:
                this.orient = [-1,1];
                break;
            case 3:
                this.orient = [-1, -1];
                break;
            case 4:
                this.orient = [1, -1];
                break;
        }
        this.line_pos[0] = x+(r+2)*this.orient[0];
        this.line_pos[1] = y-(r+2)*this.orient[1];
        this.line_pos[2] = x+30*this.orient[0];
        this.line_pos[3] = y-30*this.orient[1];
        this.line_pos[4] = x+(30+this.title_w[2])*this.orient[0];
        this.line_pos[5] = y-30*this.orient[1];

        this.text_pos[1] = this.orient[1]===1? y-40*this.orient[1]: y-47*this.orient[1];
        this.text_pos[3] = this.text_pos[1];
        if(this.orient[0]===1)
        {
            this.text_pos[0] = x+40*this.orient[0];
            this.text_pos[2] = x+(50+this.title_w[0])*this.orient[0];
        }else
        {
            this.text_pos[0] = x+(30+this.title_w[1])*this.orient[0];
            this.text_pos[2] = x+(40)*this.orient[0];
        }

    };

    this.tick = 0;
    this.anim_r = 0;
    this.text_pos=[0,0,0,0,0,0];
    this.line_pos = [0,0,0,0,0,0];
    this.orient = [1,1];

    this.Draw = function (){
        G_ctx.beginPath();
        G_ctx.arc(this.x,this.y,this.r, 0, 2*Math.PI, false);
        if(this.MODE === ENUM_NODE_MODE.hover || this.MODE === ENUM_NODE_MODE.click) {
            // HOVER
            G_ctx.fillStyle= __HVR_FCLR__;
            G_ctx.strokeStyle = __HVR_FCLR__;
            G_ctx.globalAlpha = 0.5;
            G_ctx.fill();
            G_ctx.lineWidth = 1;
            G_ctx.stroke();

            // TODO : hover show shortened info
            // TODO : mode 3 show detailed info

        }
        else{
            G_ctx.fillStyle= __DEFAULT_FCLR__;
            G_ctx.strokeStyle = __DEFAULT_FCLR__;
            G_ctx.globalAlpha = 0.5;
            G_ctx.fill();
            G_ctx.lineWidth = 1;
            G_ctx.stroke();

            G_ctx.beginPath();
            // G_ctx.fillStyle = __DEFAULT_FCLR__;
            G_ctx.strokeStyle = __DEFAULT_FCLR__;
            G_ctx.lineWidth = 3;
            if(this.tick%1 === 0)
            {
                this.anim_r +=0.2;

                if(this.anim_r >= 3*r)
                {
                    this.anim_r = r;
                }
            }
            G_ctx.arc(this.x,this.y,this.anim_r, 0, 2*Math.PI, false);
            // G_ctx.fill();
            G_ctx.stroke();
        }

        if(this.MODE === ENUM_NODE_MODE.click || this.MODE === ENUM_NODE_MODE.hover) {
            G_ctx.beginPath();
            G_ctx.moveTo(this.line_pos[0], this.line_pos[1]);
            G_ctx.lineTo(this.line_pos[2], this.line_pos[3]);
            G_ctx.lineTo(this.line_pos[4], this.line_pos[5]);
            G_ctx.stroke();
            G_ctx.closePath();

            //title
            G_ctx.font = "15px Comic Sans MS";
            G_ctx.fillStyle = "blue";
            if(this.orient[0]===1)
                G_ctx.textAlign = "left";
            else
                G_ctx.textAlign = "right";

            G_ctx.fillText(this.data['title'],this.text_pos[0], this.text_pos[1]);

            G_ctx.font = "10px Comic Sans MS";
            G_ctx.fillText(('(' + this.data['start_date']+' ~ ' +this.data['end_date'] + ')'), this.text_pos[2], this.text_pos[3]);
            //content
            G_ctx.font = "10px Comic Sans MS";
            var str = this.data['Description'];
            var cur_str_i = 0;
            for (var i = 0; i< this.mx_lines; i++)
            {
                G_ctx.fillText(str.substring(cur_str_i, cur_str_i+this.str_span),this.x+40*this.orient[0],this.y-(40 -i*15 -25)*this.orient[1]);
                cur_str_i += this.str_span;
            }

        }

        if((Date.now() - this.startTIme)%60)
        {
            this.tick +=1;
            this.tick %= 1000000000; //Reset per these amount of tiks
        }

    };

    this.isOverlap = function (_mX, _mY) {
        G_ctx.beginPath();
        G_ctx.arc(_mX,_mY,10, 0, 2*Math.PI, false);
        G_ctx.fillStyle= 'red';
        G_ctx.strokeStyle = 'red';
        G_ctx.globalAlpha = 0.5;
        G_ctx.fill();
        G_ctx.lineWidth = 1;
        G_ctx.stroke();
        //Assumption: BND included
        if (this.x >= (_mX-this.r) && this.x <= (_mX+this.r) && this.y >= (_mY-this.r) && this.y <= (_mY+this.r))
        {
            return true;
        }
        return false;
    };
    this.switchMODE = function (_inRange, _clicked) {
        if((!_clicked && this.MODE===ENUM_NODE_MODE.click) || (_inRange && _clicked && this.MODE !== ENUM_NODE_MODE.click))
            this.MODE = ENUM_NODE_MODE.click;
        else if(_inRange)
            this.MODE = ENUM_NODE_MODE.hover;
        else
            this.MODE = ENUM_NODE_MODE.idle;
    };
}

// var data_ = "{\n" +
//     "    \"title\" : \"Baanto Inc\",\n" +
//     "    \"position\" : [10, 20], \n"+
//     "    \"start_date\": \"2017-May\",\n" +
//     "    \"end_date\": \"2017-Aug\",\n" +
//     "    \"Duration\": \"4 mons.\",\n" +
//     "    \"Description\": \"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\",\n" +
//     "    \"URL\": \"http://baanto.com/\" \n" +
//     "}";
// console.log(JSON.parse(data_));
// var node_ = new Node(JSON.parse(data_), 10);


// ----- Core Animation Code
function startEngine() {
    //config
    G_CVS = document.getElementById('exp-canvas');
    G_BKG = document.getElementById('exp-bkg-img');
    G_ctx = G_CVS.getContext('2d');
    updateWH();

    if (G_CVS.getContext) {
        var FrameTimer = setInterval(function(){Callback_Calculate(); Callback_Render();},10);
        G_ctx.canvas.addEventListener("mousemove",function(event){
            var rect = G_ctx.canvas.getBoundingClientRect();
            mouseX=event.clientX-rect.left;
            mouseY=event.clientY-rect.top;
            // console.log(rect);
            Callback_mouse(mouseX, mouseY, false);
        });
        G_ctx.canvas.addEventListener("click", function (evt) {
            var rect = G_ctx.canvas.getBoundingClientRect();
            mouseX=event.clientX-rect.left;
            mouseY=event.clientY-rect.top;
            // console.log(rect);
            Callback_mouse(mouseX, mouseY, true);
        })
    }
}
function updateWH() {
    G_WH = null;
    if(G_CVS != null && G_BKG != null)
    {
        //make same resolution as screen
        G_WH = [G_BKG.scrollWidth, G_BKG.scrollHeight];
        G_CVS.width = G_WH[0];
        G_CVS.height = G_WH[1];
        G_CVS.scrollWidth = G_WH[0];
        G_CVS.scrollHeight = G_WH[1];
        for (var ni= 0; ni< G_nodeList.length; ni++)
        {
            G_nodeList[ni].updateStaticData();
        }
        console.log(G_WH);
    }else
    {
        console.error("No cvs or bkg loaded!");
    }
}

function Callback_mouse(_mouseX, _mouseY, _clicked) {
    for (var ni= 0; ni< G_nodeList.length; ni++)
    {
        G_nodeList[ni].switchMODE(G_nodeList[ni].isOverlap(_mouseX, _mouseY), _clicked);
    }
}

function Callback_Calculate() {

}

function Callback_Render() {
    if(G_WH != null)
    {
        G_ctx.clearRect(0,0,G_WH[0],G_WH[1]);
        for (var ni= 0; ni< G_nodeList.length; ni++)
        {
            G_nodeList[ni].Draw();
        }
    }else
    {
        console.error("Null WH");
    }
}

// function Callback_Mouse(event){
//     var rect =  G_CVS.getContext('2d').canvas.getBoundingClientRect();
//     mouseX=event.clientX-rect.left;
//     mouseY=event.clientY-rect.top;
//     Callback_mouse(mouseX, mouseY);
//     console.log(rect);
// }
