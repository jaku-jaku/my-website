var generation=0;

function Node(data) {
  this.IDn=null;
  this.data = data;
  this.next = null;
}

function LinkedList() {
  this._length = 0;
  this.head = null;
}

LinkedList.prototype.add = function(value,isIdentity) {

  var node = new Node(value),
  currentNode = this.head;
  // 1st case: an empty list
  if (!currentNode) {
    this.head = node;
    this._length++;

    return node;
  }

  // 2nd case: a non-empty list
  while (currentNode.next) {
    currentNode = currentNode.next;
  }
  if(isIdentity&&this.isUnique(node.IDn)){
    currentNode.IDn=++generation;
    currentNode.next = node;
    this._length++;
  }
  if(!isIdentity){
    currentNode.next = node;
    this._length++;
  }
  return node;
};

LinkedList.prototype.isUnique = function(IDnum) {
  var answer = true;
  if(IDnum!=null){
    currentNode = this.head;
    while (currentNode!=null&&answer) {
      if(currentNode.IDn==IDnum){
        answer=false;
      }
      currentNode = currentNode.next;
    }
  }
  return answer;
};

LinkedList.prototype.getNodeByID = function(IDnum) {
  var answer =  this.head;
  if(IDnum!=null){
    answer=null;
    currentNode = this.head;
    while (currentNode!=null&&answer==null) {
      if(currentNode.IDn==IDnum){
        answer=currentNode;
      }
      currentNode = currentNode.next;
    }
  }
  return answer;
};

LinkedList.prototype.searchNodeAt = function(position) {
  var currentNode = this.head,
  length = this._length,
  count = 0,
  message = {failure: 'Failure: non-existent node in this list.'};

  // 1st use-case: an invalid position
  if (length == 0 || position < 0 || position > length) {
    throw new Error(message.failure);
  }

  // 2nd use-case: a valid position
  while (count < position) {
    currentNode = currentNode.next;
    count++;
  }

  return currentNode;
};

LinkedList.prototype.remove = function(position) {
  var currentNode = this.head,
  length = this._length,
  count = 0,
  message = {failure: 'Failure: non-existent node in this list.'},
  beforeNodeToDelete = null,
  nodeToDelete = null,
  deletedNode = null;

  // 1st use-case: an invalid position
  if (position < 0 || position > length) {
    throw new Error(message.failure);
  }

  // 2nd use-case: the first node is removed
  if (position === 0) {
    this.head = currentNode.next;
    deletedNode = currentNode;
    currentNode = null;
    this._length--;

    return deletedNode;
  }

  // 3rd use-case: any other node is removed
  while (count < position) {
    beforeNodeToDelete = currentNode;
    nodeToDelete = currentNode.next;
    count++;
  }

  beforeNodeToDelete.next = nodeToDelete.next;
  deletedNode = nodeToDelete;
  nodeToDelete = null;
  this._length--;

  return deletedNode;
};

LinkedList.prototype.removeByID = function(IDnum) {
  var curNode = this.head;
  var preNode = null;

  if(!this.isUnique(IDnum)){
    // 3rd use-case: any other node is removed
    while (curNode.IDn!=IDnum) {
      preNode=curNode;
      curNode=curNode.next;
    }
    if(preNode==null)
    {
      this.head=curNode.next;
      curNode=null;
    }else{
      preNode.next=curNode.next;
      curNode=null;
    }
    this._length--;
  }
};

function empty(LinkedList){
  // console.log("Empty");
  var length=  LinkedList._length;
  for(var j=0;j<length;j++)
  LinkedList.remove(0);
};
//////////////-------

function anim(){
  var C = document.getElementById('myCanvas');
  var factor=2;
  var W=window.innerWidth*factor-30;
  var H=window.innerHeight*factor-30;
  var MAXR=20;
  var MAXQUAN=40;
  var MINQUAN=20;
  var RANGE=300;
  var SHOWRANGEBOUND=false;
  var RANGEMOUSE=200;
  var TOL_Dodgingfact=3;
  var itr=0;
  var mouseX=0;
  var mouseY=0;
  C.width = W;
  C.height = H;
  if (C.getContext){
    var ctx = C.getContext('2d');
    var FrameTimer = setInterval(function(){Calculate(); Render();},10);
    var sll = new LinkedList();
    ctx.canvas.addEventListener("mousemove",function(event){
      var rect = ctx.canvas.getBoundingClientRect();
      mouseX=event.clientX*factor;
      mouseY=event.clientY*factor-rect.top*factor;
    });
    //*1*
    //203
    //*4*
    // for(var i=0;i<MAXQUAN;i++){
    //   var coor = {x:Math.random()*W,y:Math.random()*H,r:Math.random()*10+MAXR-10,dir:Math.floor(Math.random()*5),spd:Math.random()*3+2, surrounding:new LinkedList()};
    //   sll.add(coor);
    // }


    function Box (type){
      this.Draw = function (){
        var current = sll.head;
        while(current!=null){
          if(current.data.r<1){
            sll.removeByID(current.IDn);
          }
          current=current.next;
        }

        current = sll.head;
        while(current!=null){
          ctx.strokeStyle = "#000000";
          switch(current.data.health){
            case 1:{
              ctx.fillStyle = "red";
              break;
            }
            case 2:{
              ctx.fillStyle = "orange";
              break;
            }
            default:{
              ctx.fillStyle = "black";
              break;
            }
          }
          if(current.data.inField){
            ctx.fillStyle = "green";
          }
          // if(current.data.lifeT>=longestT){
          //   ctx.fillStyle = "blue";
          // }
          // ctx.beginPath();
          // ctx.arc(mouseX,mouseY, RANGEMOUSE,0, 2*Math.PI, true);
          // ctx.stroke();
          // ctx.closePath();
          //
          // var widd=1000;
          // var heii=500;
          // ctx.beginPath();
          // ctx.rect((W-widd)/2,(H-heii)/2,widd,heii);
          // ctx.stroke();
          // ctx.closePath();

          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.arc(current.data.x,current.data.y, current.data.r,0, 2*Math.PI, true);
          ctx.fill();
          ctx.closePath();
          if(SHOWRANGEBOUND){
            ctx.beginPath();
            ctx.arc(current.data.x,current.data.y, RANGE,0, 2*Math.PI, true);
            ctx.stroke();
            ctx.closePath();
          }
          Line3D(ctx,current);
          current=current.next;
        }
        // ctx.fillStyle = "black";
        // ctx.font = "30px Arial";
        // ctx.fillText("Cells: "+sll._length,10,50);
        // ctx.fillText("Iteration: "+itr,10,90);
        // ctx.fillText("top-ID: "+longestID,10,140);
        // ctx.fillText("longestT: "+longestT,10,180);
        // ctx.fillText("Highest Record: "+RecordT,10,220);
        // ctx.fillText("Generation: "+generation,10,260);
      }
    }

    function Line3D(ctx, obj){
      var neighbour=  obj.data.surrounding.head;
      var x=obj.data.x;
      var y=obj.data.y;
      // console.log(obj.data.surrounding._length);
      while(neighbour!=null){
        var nx=neighbour.data.x;
        var ny=neighbour.data.y;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(nx,ny);
        ctx.stroke();
        ctx.closePath();
        neighbour=  neighbour.next;
      }
    }

    function clearDeadCell(){
      var temp=sll.head;

      while(temp!=null){
        if(temp.data.health<=0){
          var IDnum=temp.IDn;
          console.log(IDnum+" is dead!");
          temp=temp.next;
          sll.removeByID(IDnum);
        }else
        {
          temp=temp.next;
        }
      }
    }
    //calc
    var rand=0.0;
    var possDisappear=0.6;
    var possSLOW=0.7;
    var possLarge=0.6;
    var possAppear=0.7;
    var longestT=0;
    var longestID=null;
    var RecordT=0;
    var speed=10;
    function Calculate(){
      itr++;
      // death and alive control


      if(itr%speed==0){
        rand=Math.random();
        if(rand > (1-possDisappear)&&sll._length>MINQUAN){
          var ii=Math.floor(Math.random()*sll._length);
          longestT=0;
          sll.searchNodeAt(ii).data.r--;
        }
        rand=Math.random();
        if(rand > (1-possSLOW)&&sll._length>10){
          var ii=Math.floor(Math.random()*sll._length);
          sll.searchNodeAt(ii).data.spd-=sll.searchNodeAt(ii).data.spd/2.0;
          if(sll.searchNodeAt(ii).data.spd<=0)
          sll.searchNodeAt(ii).data.spd=0;
        }
        if(rand > (1-possLarge)&&sll._length>2){
          var ii=Math.floor(Math.random()*sll._length);
          if(sll.searchNodeAt(ii).data.r<=(MAXR+1))
          sll.searchNodeAt(ii).data.r++;
        }
        rand=Math.random();
        if(sll._length<MAXQUAN&&rand > (1-possAppear)){
          var coor = {inBlock:false,inField:false,x:Math.random()*W,y:Math.random()*H,r:Math.random()*10+MAXR-10,dir:(Math.random()-0.5)*2*Math.PI,spd:Math.random()*3,lifeT:0, surrounding:new LinkedList()};
          sll.add(coor,true);
        }
      }


      //collision motion
      var obj = sll.head;
      while(obj!=null){
        if(obj.data.r<1){
          sll.removeByID(obj.IDn);
        }

        var IDnum=obj.IDn;
        var spd=obj.data.spd;
        var x=obj.data.x;
        var y=obj.data.y;
        var r=obj.data.r;
        var dir=obj.data.dir;
        //motion with bouncing effects
        var mdx=x-mouseX;
        var mdy=y-mouseY;
        if(Math.abs(mdx)+Math.abs(mdy)<RANGEMOUSE){
          if(!obj.data.inField){
            spd=5;
            obj.data.spd=spd;
            obj.data.inField=true;
            dir=Math.atan(mdx/mdy);
            if(mdx<0)
            dir+=Math.PI;
          }
        }
        else
        {obj.data.inField=false;}
        if((y-r)<0||(y+r)>H){
          dir=-dir;
        }
        if((x-r)<0||(x+r)>W){
          dir=(Math.PI-dir);
        }

        var widd=1000;
        var heii=500;
        if((x+r)>(W-widd)/2 && (x-r)<(W+widd)/2 && (y+r)>(H-heii)/2&&(y-r)<(H+heii)/2){
          if(!obj.data.inBlock){
            spd=5;
            obj.data.spd=spd;
            obj.data.inBlock=true;
            dir=Math.atan((x-W/2)/(y-H/2));
            if((x-W/2)<0)
            dir+=Math.PI;
            obj.data.dir=dir;
          }
        }else{
          obj.data.inBlock=false;
        }


        x+=spd*Math.cos(dir);
        y+=spd*Math.sin(dir);

        obj.data.x=x;
        obj.data.y=y;
        obj.data.dir=dir;

        //life time calc && longest
        if(longestT<=obj.data.lifeT){
          longestID=obj.IDn;
          longestT=obj.data.lifeT;
        }
        if(RecordT<=obj.data.lifeT){
          RecordT=obj.data.lifeT;
        }
        obj.data.lifeT++;
        //Testing - surrounding detection
        //++ Adding: Obj and Obj collision
        var objc=sll.head;

        empty(obj.data.surrounding);
        while(objc!=null){
          var IDnumc=objc.IDn;
          var rc=objc.data.r;
          var dx=(x-objc.data.x);
          var dy=(y-objc.data.y);
          var temp=sll.getNodeByID(IDnumc).data.surrounding.head;
          var isDataLinked=false;
          if(temp!=null){
            while(temp!=null){
              if(temp.data.IDserial==IDnum)
              isDataLinked=false;
              temp=temp.next;
            }
          }
          //bounce
          if((dx*dx+dy*dy)<RANGE*RANGE&&!isDataLinked){
            var coor={x:objc.data.x,y:objc.data.y,IDserial:IDnumc};
            obj.data.surrounding.add(coor,false);
            if((dx*dx+dy*dy)<(r+rc)*(r+rc)){
              var tempDir=obj.data.dir;
              obj.data.dir=objc.data.dir;
              sll.getNodeByID(objc.IDn).data.dir=tempDir;
            }
          }
          objc=objc.next;
        };
        //next one

        obj=obj.next;
      }

    }

    function Render(){
      // console.log("Render called");
      var BoxTest = new Box();
      ctx.clearRect(0,0,W,H);
      BoxTest.Draw();
    }

  }
}
