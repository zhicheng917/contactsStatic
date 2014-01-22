/**
 * --------------------------------------------------------
 * 人脉动画
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-14 下午5:22
 * --------------------------------------------------------
 */


var SpaceTree=function() {
    var _self=this;

    var json={
        "id": "node02",
        "name": "0.2",
        "data": {},
        "children":[{
            "id": "node101",
            "name": "1.01",
            "data": {}
        },
            {
                "id": "node1.02",
                "name": "1.02",
                "data": {}
            },
            {
                "id": "node1.02",
                "name": "1.02",
                "data": {}
            },
            {
                "id": "node103",
                "name": "1.03",
                "data": {}
            },
            {
                "id": "node104",
                "name": "1.04",
                "data": {}
            },
            {
                "id": "node105",
                "name": "1.05",
                "data": {}
            }
        ]
    };

    var elemJson={'c':'c'};
    var lineColor='#aaaaaa';
    var rectWidth=77;
    var rectHeight=77;
    var space=50;//元素间距
    var st1,st2;
    //初始化函数
    _self.init=function() {

        var win=$(window);
        var windowWith=win.width();
        var windowHeight=win.height();
        var paper = Raphael('holder', windowWith, windowHeight);//初始化画图对象
        st1=paper.set();
        st2=paper.set();
        paper.rect(0, 100, rectWidth, rectHeight, 4).attr({'stroke': '#fff', 'fill': 'url(/images/1.jpg)', 'font': '20px Georgia', 'title': 'asd'}).animate({x:windowWith / 2}, 500);//定义起始节点


        $('#holder').bind('mousedown',function(event) {

            $('#holder').removeData('drag').data('drag',{'drag': 'true','x': event.pageX,'y': event.pageY});

        }).bind('mouseup',function(event) {
                var drag=$("#holder").data('drag');
                var point=$('#holder').data('point');
                if(point==undefined) {
                    point={
                        'x': 0,
                        'y': 0
                    };
                }
                $('#holder').data('drag',{'drag': 'false'}).data('point',{'x': (point.x - (event.pageX - drag.x)),'y': (point.y - (event.pageY - drag.y))});
        }).bind('mousemove',function(event) {
                var drag=$('#holder').data('drag');
                var point=$('#holder').data('point');
                if(point==undefined) {
                    point={
                      'x': 0,
                      'y': 0
                    };
                }
                if( drag && drag.drag == 'true') {
                    paper.setViewBox((point.x - (event.pageX - drag.x)),(point.y - (event.pageY - drag.y)),windowWith,windowHeight,true);
                }
            });
        setTimeout(function(){addNode(paper,windowWith / 2,100)},800);
    }

    /* 私有方法 */
    function addNode(paper,x,y,item) {
        if(item===undefined) {
            item={};
            item.i='0';
        }
        var children=json.children;
        var itemi=item.i.split(',');
        var tempChildren=children;
        if(item.i !='0') {
            for(var j= 1,l=itemi.length; j<l; j++) {
                tempChildren=children[itemi[j]].children;
                if(tempChildren) {
                    children=tempChildren;
                }
                else {
                    break;
                }
            }
        }
        if(tempChildren) {
            addNodeInPaper(paper,children,x,y,item);
        }
        else {
            $.ajax({
                type: "post",
                url: "/ajax/",
                data: "name="+children[0].name,
                dataType: 'json',
                success: function(msg) {
                    msg.pop();
                    children[itemi[itemi.length-1]].children=msg;
                    addNodeInPaper(paper,msg,x,y,item);
                }
            })
        }
    }
    //添加节点到画布上
    function addNodeInPaper(paper,children,x,y,item) {
        var l=children.length;//第一级元素个数
        var widthSpace=space + rectWidth;
        var startX=x-(l/2)*widthSpace+space;
        var startY=y+rectHeight+space;

        var pointStart=getPoint(x,y,'bottom');
        var pointEnd;
        for(var i= 0; i<l; i++) {
            var c=paper.rect(startX+i*widthSpace, startY, rectWidth, rectHeight, 4)
                .attr({'opacity':0,'stroke': '#fff', 'fill': 'url(/images/'+Math.floor(Math.random()*10+1)+'.jpg)', 'font': '20px Georgia', 'title': children[i].name,'cursor': 'pointer'})
                .data('data',{'id': children[i].id, 'name': children[i].name,'children': children[i],'i': item.i + ',' + i})
                .click(function() {
                    if(this.data('selected')!='true') {
                        removeElement(this.data('data'));
                        this.data('selected','true');
                        addNode(paper,this.attr('x'),this.attr('y'),this.data('data'));
                    }
                })
                .mouseover(function() {
                    showTip(this.attr('x'),this.attr('y'),this.data('data'));
                })
                .mouseout(function() {
                    $('#tip').empty().remove();
                }).animate({'opacity': 1},400);

            pointEnd=getPoint((startX+i*widthSpace),startY,'top');
            var line= paper.path("M"+pointStart.x+" "+pointStart.y+"L"+pointEnd.x+" "+startY).attr({'stroke': lineColor,'opacity':0}).animate({'opacity': 1},200);
            children[i].line=line;
            children[i].c=c;
        }
    }
    //获取点坐标
    function getPoint(x,y,type) {
        var point={};
        switch(type) {
            case 'bottom':
                point.x=x + rectWidth / 2;
                point.y=y + rectHeight;
                break;
            case 'top':
                point.x=x + rectWidth / 2;
                point.y=y;
                break;
        }
        return point;
    }
    //移除一枝上的所有元素
    function removeElement(item) {
        var children=json.children;
        //alert(item.i);
        var itemi=item.i.split(',');
        for (var j = 1, l = itemi.length - 1; j < l; j++) {
            children = children[itemi[j]].children;
        }
        //console.log(json);
        if(children) {

            st1.clear();
            removeElementChild(children);
            //st1.transform('s0.1');
            st1.animate({'x': 0,'y': 0,'width': 0,'height': 0},800,'>',function() {
                st1.remove();
            });
            st2.remove();
        }
    }
    //递归清楚所有子元素
    function removeElementChild(children) {
        var ll=children.length;
        for(var i=0; i<ll; i++){
            var c=children[i].c;
            if(c && c.data('selected') == 'true') {
                c.data('selected','false');
                removeElementChild(children[i].children);
                children=children[i].children;
                if(children) {
                    var l=children.length;
                    for (var k = 0; k < l; k++) {
                        //children[k].c.remove();
                       // children[k].line.remove();
                        if(k % 10 != 0){
                            children[k].c.remove();
                            children[k].line.remove();
                        }
                        else {
                            st1.push(
                                children[k].c
                            );
                            st2.push(
                                children[k].line
                            );
                        }

                    }
                }
                break;
            }
        }
    }
    //打印tip
    function showTip(x,y,data) {
        var point=$('#holder').data('point');
        if(!point){
            point={
              x: 0,
              y: 0
            };
        }
        var div='<div id="tip" style="display:block;left:'+(x + rectWidth + 10 - point.x)+'px;top:'+(y + 50 - point.y)+'px">'+data.name+'</div>';
        $('body').append(div);
        $("#tip").corner("10px");
    }

}