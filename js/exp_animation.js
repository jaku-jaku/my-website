
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
window.addEventListener('resize', function ()
{
    if ($(window).width() < 768) {
        // console.log('Less than 960');
        document.getElementById('exp-img').src='Resources/myExp_portrait.png';
        G_portrait_mode = true;
    }
    else {
        // console.log('More than 960');
        document.getElementById('exp-img').src='Resources/myExp.png';
        G_portrait_mode = false;
    }

    updateWH();
});
// - compute at load
$(window).on('load', startEngine);

// ----- Objects
var _DEFAULT_FCLR_ = '#80ced6';
var _HVR_FCLR_ = '#2c7e87';
var _FONT_FCLR_ = '#3987a6';
var G_CVS = null;
var G_BKG = null;
var G_WH = null;
var G_ctx = null;
var ENUM_NODE_MODE = {"idle":1, "hover":2, "click":3};
var G_nodeList = [];
var G_portrait_mode = false;
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
    this.bkg_rect = [0, 0, 0, 0];
    this.mx_lines = 0;
    this.str_span = 0;
    this.text_font = "15px Comic Sans MS";
    this.text2_font =  "12px Comic Sans MS";
    this.text_height = 15;//px
    // data at update or scrn change
    this.updateStaticData = function (_isPortrait) {
        var m_data = this.data;
        if(_isPortrait)
        {
            this.x = G_WH[0]*m_data['position_v'][0]/100;
            this.y = G_WH[1]*m_data['position_v'][1]/100;
            this.r = G_WH[0]*m_data['position_v'][2]/100;
            this.quadrant = m_data['position_v'][3]%5;
            this.text_font = "13px Comic Sans MS";
            this.text2_font =  "10px Comic Sans MS";
            this.text_height = 10;
        }else
        {
            this.x = G_WH[0]*m_data['position'][0]/100;
            this.y = G_WH[1]*m_data['position'][1]/100;
            this.r = G_WH[0]*m_data['position'][2]/100;
            this.quadrant = m_data['position'][3]%5;
            this.text_font = "15px Comic Sans MS";
            this.text2_font =  "12px Comic Sans MS";
            this.text_height = 15;
        }

        this.anim_r = this.r;
        G_ctx.font = this.text_font;
        this.title_w[0] = G_ctx.measureText(m_data['title']).width;
        this.title_w[1] = G_ctx.measureText(m_data['company']).width;
        if(!_isPortrait) // single lines
            this.title_w[2] = this.title_w[0]+this.title_w[1];
        else    // two lines
            this.title_w[2] = this.title_w[0]>this.title_w[1]?this.title_w[0]:this.title_w[1];
        G_ctx.font = this.text2_font;
        var str = m_data['Description'];
        var tw = G_ctx.measureText(str).width;
        this.mx_lines = Math.round(tw/this.title_w[2]);
        this.str_span = Math.ceil(str.length/this.mx_lines);
        // console.log(this.x, this.y);
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
        this.line_pos[4] = x+(this.title_w[2]*1.2)*this.orient[0];
        this.line_pos[5] = y-30*this.orient[1];

        this.text_pos[1] = this.orient[1]===1? y-40*this.orient[1]: y-47*this.orient[1];
        // if(!_isPortrait)
            this.text_pos[3] = this.text_pos[1];
        // else
        //     this.text_pos[3] = this.text_pos[1] + 20;
        if(this.orient[0]===1)
        {
            this.text_pos[0] = x+40*this.orient[0];
            if(_isPortrait)
                this.text_pos[2] = this.text_pos[0];
            else
                this.text_pos[2] = x+(50+this.title_w[0])*this.orient[0];
            this.bkg_rect[0] = this.text_pos[0];
        }else
        {
            this.text_pos[2] = x+(40)*this.orient[0];
            if(_isPortrait)
                this.text_pos[0] = this.text_pos[2];
            else
                this.text_pos[0] = x+(30+this.title_w[1])*this.orient[0];
            this.bkg_rect[0] = x+(30+this.title_w[2])*this.orient[0];
        }
        this.bkg_rect[2] = this.title_w[2];

        if(_isPortrait) this.bkg_rect[3] = (this.mx_lines+5)*this.text_height;
        else            this.bkg_rect[3] = (this.mx_lines+3)*this.text_height;

        if(this.orient[1] === 1)
        {
            if(_isPortrait)     this.text_pos[1] = this.text_pos[1] - this.text_height*1.5;
            this.bkg_rect[1] = this.text_pos[1] - this.text_height;
        }else {
            if(_isPortrait)     this.text_pos[1] = this.text_pos[1] + this.text_height*1.5;
            this.bkg_rect[1] = this.text_pos[1] - this.bkg_rect[3];
        }
        this.bkg_rect[0] -= 10;
        this.bkg_rect[1] -= 10;
        this.bkg_rect[3] += 20;
        this.bkg_rect[2] += 20;
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
            G_ctx.fillStyle= _HVR_FCLR_;
            G_ctx.strokeStyle = _HVR_FCLR_;
            G_ctx.globalAlpha = 1;
            G_ctx.fill();
            G_ctx.lineWidth = 1;
            G_ctx.stroke();
            G_ctx.fillStyle= "white";

            //TODO: backgrounds!!
            G_ctx.fillRect(this.bkg_rect[0], this.bkg_rect[1], this.bkg_rect[2], this.bkg_rect[3]);
            // TODO : hover show shortened info
            // TODO : mode 3 show detailed info

        }
        else{
            G_ctx.fillStyle= _DEFAULT_FCLR_;
            G_ctx.strokeStyle = _DEFAULT_FCLR_;
            G_ctx.globalAlpha = 0.5;
            G_ctx.fill();
            G_ctx.lineWidth = 1;
            G_ctx.stroke();

            G_ctx.beginPath();
            // G_ctx.fillStyle = _DEFAULT_FCLR_;
            G_ctx.strokeStyle = _DEFAULT_FCLR_;
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
            G_ctx.font = this.text_font;
            G_ctx.fillStyle = _FONT_FCLR_;
            if(this.orient[0]===1)
                G_ctx.textAlign = "left";
            else
                G_ctx.textAlign = "right";

            G_ctx.fillText(this.data['title'],this.text_pos[0], this.text_pos[1]);

            G_ctx.font = this.text2_font;
            G_ctx.fillText(("["+this.data['company']+"]"), this.text_pos[2], this.text_pos[3]);

            //content
            G_ctx.font = this.text2_font;
            var str = this.data['Description'];
            var cur_str_i = 0;
            for (var i = 0; i< this.mx_lines + 1; i++)
            {
                if(i==0)//print date
                {
                    G_ctx.fillText(('(' + this.data['start_date']+' ~ ' +this.data['end_date'] + ')'), this.x+40*this.orient[0],this.y-(40 -i*this.text_height -25)*this.orient[1]);
                }
                else
                {
                    if(this.orient[1]>0)
                        G_ctx.fillText(str.substring(cur_str_i, cur_str_i+this.str_span),this.x+40*this.orient[0],this.y-(40 -i*this.text_height -25));
                    else
                        G_ctx.fillText(str.substring(cur_str_i, cur_str_i+this.str_span),this.x+40*this.orient[0],this.y-(40 -(this.mx_lines+1-i)*this.text_height -25)*this.orient[1]);
                    cur_str_i += this.str_span;
                }
            }

        }

        if((Date.now() - this.startTIme)%60)
        {
            this.tick +=1;
            this.tick %= 1000000000; //Reset per these amount of tiks
        }

    };

    this.isOverlap = function (_mX, _mY) {
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

// ----- Core Animation Code
function startEngine() {
    if ($(window).width() < 768) {
        document.getElementById('exp-img').src='Resources/myExp_portrait.png';
        G_portrait_mode = true;
    }
    //config
    G_CVS = document.getElementById('exp-canvas');
    G_BKG = document.getElementById('exp-img');
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
        G_CVS.style.marginTop = -G_WH[1].toString() +'px';

        for (var ni= 0; ni< G_nodeList.length; ni++)
        {
            G_nodeList[ni].updateStaticData(G_portrait_mode);
        }
        // console.log(G_WH);
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
        //TODO: add rendering rules
        // Render/update only if the page is scrolling closer towards experience content
        // if(($('#page-about').offset().top <($(window).scrollTop()))
        //     && ($('#page-projects').offset().top >($(window).scrollTop())))
        {
            G_ctx.clearRect(0,0,G_WH[0],G_WH[1]);
            for (var ni= 0; ni< G_nodeList.length; ni++)
            {
                G_nodeList[ni].Draw();
            }
        }
    }else
    {
        console.error("Null WH");
    }
}

