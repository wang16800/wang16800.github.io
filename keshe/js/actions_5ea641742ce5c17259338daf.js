Mugeda.script.push(function (mugeda) {
  (function(mugeda){
  var mugeda = Mugeda.getMugedaObject();
  mugeda.addEventListener('renderReady', function () {
       var scene = mugeda.scene;
       var GNanniu = scene.getObjectByName('功能按钮');
       var GNanniuIMG = [];
       var SCanniu = scene.getObjectByName('删除按钮');
       var GDanniu = scene.getObjectByName('更多按钮');
       var GNI = 1;//1缩放 2旋转 3置顶 4置底 5左右翻转 6上下翻转
       var UIkuang = scene.getObjectByName('UI框');
       var UIquan = scene.getObjectByName('UI圈');
       var quanR = 155;
       var mouseR = 0;
       var img = new Image();
       var tpi = -1;//当前选择图片对象ID
       var smi = 0;
       var tupianMode = scene.getObjectByName('图片模版');
       var tupian = [];
  
       var tupianTotal = 0;
       var kuangW = 0;
       var kuangH = 0;
       var kuangX = 1000;
       var kuangY = mugeda.height/2;
       var kuangOldR = 0;
       var kuangRotate = 0;
       var kuangSize = 15;
       var kuangSizeCha = -8;
       var kuangJiao = 0;
       var mouseState = 0;
       var mouseChaX = 0;
       var mouseChaY = 0;
       var mouseChaA = 0;
       var selectStyle = 0;
       var BGcolor = scene.getObjectByName('背景');
       var upimgDIV = scene.getObjectByName('上传图片按钮');
       var upimgUI = scene.getObjectByName('图片上传面板');
       var GDanniuUI = scene.getObjectByName('更多功能面板');
       var tupianZone = scene.getObjectByName('点击区域');
       var UIrule = '#tubian {border:'+kuangSize+'px solid transparent;'+ 
                      'border-image:url(https://www.mugeda.com/c/user/data/57831537a3664e4735000300/5ab0e538aeece177df7db859.png) 30 30 round};';
           addCss(UIrule);
           GNanniu.dom.style.zIndex = SCanniu.dom.style.zIndex = GDanniu.dom.style.zIndex = 100000;
           UIkuang.dom.style.zIndex = UIquan.dom.style.zIndex = 99999;
       function addCss(rule) {
          var css = document.createElement('style');
          css.type = 'text/css';
          if (css.styleSheet) 
              css.styleSheet.cssText = rule;
          else 
              css.appendChild(document.createTextNode(rule));
          document.getElementsByTagName("head")[0].appendChild(css);
      }
       var updateTime = function () {
           if(img.width != 0){
               addtupian();
               img = new Image();
           }
       }
       scene.addEventListener('enterframe', function () {
            updateTime();
       });
       tupianZone.addEventListener('inputstart', function (e) {
            mouseState = 1;
            mouseR = Math.sqrt((e.inputX-kuangX)*(e.inputX-kuangX)+(e.inputY-kuangY)*(e.inputY-kuangY));
            
            if(e.inputX > SCanniu.left && e.inputX < SCanniu.right && e.inputY > SCanniu.top && e.inputY < SCanniu.bottom){ 
                deletetupian();
                kuangX = 1000;
                selectStyle = 2;
            }else
            if(e.inputX > GDanniu.left && e.inputX < GDanniu.right && e.inputY > GDanniu.top && e.inputY < GDanniu.bottom){
                GDanniuUI.left = 0;
                lockingTPI = true;
                selectStyle = 2;
            }else
            if(e.inputX > GNanniu.left && e.inputX < GNanniu.right && e.inputY > GNanniu.top && e.inputY < GNanniu.bottom && GNI == 1){
                mouseChaX = getCenterX(GNanniu) - e.inputX;
                mouseChaY = getCenterY(GNanniu) - e.inputY;
                selectStyle = 1;
                kuangJiao = Math.atan(kuangH/kuangW);
                kuangOldR = Math.sqrt(Math.pow(kuangW,2)+Math.pow(kuangH,2))/2;
            }else
            if( mouseR > quanR/2 - 30 && mouseR < quanR/2 + 20  && GNI == 2){
                mouseChaA = tupian[tpi].rotate - Math.atan2(e.inputX-kuangX,kuangY-e.inputY);
                selectStyle = 1;
            }else
            {
                tpi = -1;
                for(var smi = 0;smi<tupianTotal;smi++){
                    if( rotateDianX(e.inputX-getCenterX(tupian[smi]),e.inputY-getCenterY(tupian[smi]),tupian[smi].rotate) > -tupian[smi].width/2 && rotateDianX(e.inputX-getCenterX(tupian[smi]),e.inputY-getCenterY(tupian[smi]),tupian[smi].rotate) < tupian[smi].width/2 && rotateDianY(e.inputX-getCenterX(tupian[smi]),e.inputY-getCenterY(tupian[smi]),tupian[smi].rotate) > -tupian[smi].height/2 && rotateDianY(e.inputX-getCenterX(tupian[smi]),e.inputY-getCenterY(tupian[smi]),tupian[smi].rotate) < tupian[smi].height/2){
                        tpi = smi;
                        mouseChaX = tupian[tpi].left - e.inputX;
                        mouseChaY = tupian[tpi].top - e.inputY;
                        if(GNI == 1){
                            kuangW = getTrueW(tupian[tpi]);
                            kuangH = getTrueH(tupian[tpi]);
                        }
                        kuangX = getCenterX(tupian[tpi]);
                        kuangY = getCenterY(tupian[tpi]);
                        selectStyle = -1;
                    }
                }
            }
            if(tpi == -1){
                kuangX = 1000;
            }else{
                  kuangRotate = tupian[tpi].rotate;
            }
            CenterGo(GNanniu,kuangX+kuangW/2,kuangY-kuangH/2);
            CenterGo(SCanniu,kuangX-kuangW/2,kuangY+kuangH/2);
            CenterGo(GDanniu,kuangX+kuangW/2,kuangY+kuangH/2);
            updateUIkuang();
       });
       tupianZone.addEventListener('inputmove', function (e) {
            if(mouseState == 1){
                  if(selectStyle == 1){
                      if(GNI == 1){
                          var suofangR = Math.sqrt(Math.pow((e.inputX + mouseChaX - kuangX),2)+Math.pow((e.inputY + mouseChaY - kuangY),2));
                          if(suofangR < 20)
                              suofangR = 20;
                          CenterGo(GNanniu,kuangX + Math.cos(kuangJiao)*suofangR,kuangY - Math.sin(kuangJiao)*suofangR)
                          kuangW = (getCenterX(GNanniu)-kuangX)*2;
                          kuangH = -(getCenterY(GNanniu)-kuangY)*2;
                          tupian[tpi].width *= suofangR/kuangOldR;
                          tupian[tpi].height *= suofangR/kuangOldR;
                          tupian[tpi].left = kuangX-tupian[tpi].width/2;
                          tupian[tpi].top  = kuangY-tupian[tpi].height/2;
                          tupian[tpi].rotateCenterX = tupian[tpi].width/2;
                          tupian[tpi].rotateCenterY = tupian[tpi].height/2;
                          updateUIkuang();
                          CenterGo(SCanniu,kuangX-kuangW/2,kuangY+kuangH/2);
                          CenterGo(GDanniu,kuangX+kuangW/2,kuangY+kuangH/2);
                          kuangOldR = suofangR;
                      }else if(GNI == 2){
                          tupian[tpi].rotate = Math.atan2(e.inputX-kuangX,kuangY-e.inputY) + mouseChaA;
                          tupian[tpi].rotateCenterX = tupian[tpi].width/2;
                          tupian[tpi].rotateCenterY = tupian[tpi].height/2;
                          UIquan.rotate = tupian[tpi].rotate;
                      }
                  }else if(selectStyle == -1){
                      if(tpi != -1){
                            tupian[tpi].left = e.inputX + mouseChaX;
                            tupian[tpi].top = e.inputY + mouseChaY;
                            kuangX = getCenterX(tupian[tpi]);
                            kuangY = getCenterY(tupian[tpi]);
                            CenterGo(GNanniu,kuangX+kuangW/2,kuangY-kuangH/2);
                            CenterGo(SCanniu,kuangX-kuangW/2,kuangY+kuangH/2);
                            CenterGo(GDanniu,kuangX+kuangW/2,kuangY+kuangH/2);
                            updateUIkuang();
                      }
                  }
            }
       });
       tupianZone.addEventListener('inputend', function (e) {
            mouseState = 0;
            selectStyle = 0;
            CenterGo(GNanniu,kuangX+kuangW/2,kuangY-kuangH/2);
            CenterGo(SCanniu,kuangX-kuangW/2,kuangY+kuangH/2);
            CenterGo(GDanniu,kuangX+kuangW/2,kuangY+kuangH/2);
       });
       var getCenterX = function (object) {
           return object.left+object.width/2;
       }
       var getCenterY = function (object) {
           return object.top+object.height/2;
       }
       var CenterGo = function(object,ctX,ctY){
           if(ctX)
              object.left = ctX-object.width/2;
           if(ctY)
              object.top = ctY-object.height/2;
       }
       var updateUIkuang = function () {
           if(GNI == 1){
               UIquan.left = 400;
               UIkuang.left = kuangX-kuangW/2 - kuangSize - kuangSizeCha;
               UIkuang.top = kuangY-kuangH/2 - kuangSize - kuangSizeCha;
               UIkuang.dom.innerHTML='<div id="tubian" style="width:'+(kuangW+kuangSizeCha*2)+'px;height:'+(kuangH+kuangSizeCha*2)+'px;"></div>';
           }else if(GNI == 2){
               UIkuang.left = 400;
               CenterGo(UIquan,kuangX,kuangY);
           }
       }
       var rotateDianX = function (oldX,doldY,angle){
           return  oldX*Math.cos(angle) + doldY*Math.sin(angle);
           
       }
       var rotateDianY = function (oldX,doldY,angle){
           return  oldX*Math.sin(angle) - doldY*Math.cos(angle);
       }
       var getTrueW = function(object){
           var newW = 0;
           newW = Math.abs(rotateDianX(object.width/2,object.height/2,object.rotate))*2;
           if(newW < Math.abs(rotateDianX(-object.width/2,object.height/2,object.rotate))*2)
              newW = Math.abs(rotateDianX(-object.width/2,object.height/2,object.rotate))*2;
           return newW;
       }
       var getTrueH = function(object){
           var newH = 0;
           newH = Math.abs(rotateDianY(object.width/2,object.height/2,object.rotate))*2;
           if(newH < Math.abs(rotateDianY(-object.width/2,object.height/2,object.rotate))*2)
              newH = Math.abs(rotateDianY(-object.width/2,object.height/2,object.rotate))*2;
           return newH;
       }
       var getFileUrl = function(sourceId) { 
          var url; 
          if (navigator.userAgent.indexOf("MSIE")>=1) { // IE 
          url = document.getElementById(sourceId).value; 
          } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox 
          url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
          } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome 
          url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
          } 
          return url; 
       }
       window.preImg = function(sourceId) { //获取本地图片
              var url = getFileUrl(sourceId); 
              img.src = url;
       } 
       var addtupian = function(){
          tupian[tupianTotal] = tupianMode.clone();
          scene.appendChild(tupian[tupianTotal]);
          tupian[tupianTotal].src = img.src;
          tupian[tupianTotal].width = 150;
          tupian[tupianTotal].height = 150/img.width*img.height;
          tupian[tupianTotal].dom.style.zIndex = tupianTotal;
          CenterGo(tupian[tupianTotal],mugeda.width/2,mugeda.height/2);
          tpi = tupianTotal;
          if(GNI == 1){
            kuangW = getTrueW(tupian[tpi]);
            kuangH = getTrueH(tupian[tpi]);
            kuangX = getCenterX(tupian[tpi]);
            kuangY = getCenterY(tupian[tpi]);
          }
          tupianTotal++;
          upimgUI.left = 400;
          updateUIkuang();
          CenterGo(GNanniu,kuangX+kuangW/2,kuangY-kuangH/2);
          CenterGo(SCanniu,kuangX-kuangW/2,kuangY+kuangH/2);
          CenterGo(GDanniu,kuangX+kuangW/2,kuangY+kuangH/2);
       }
       var deletetupian = function(){
           scene.removeChild(tupian[tpi]);
           tupianTotal--;
           for(smi = tpi;smi<tupianTotal;smi++){
              tupian[smi] = tupian[smi+1];
              tupian[smi].dom.style.zIndex = smi;
           }
           tpi = -1;
       }
       var toptupian = function(){
           tupian[tupianTotal] = tupian[tpi];
           for(smi = tpi;smi<tupianTotal-1;smi++){
               tupian[smi] = tupian[smi+1];
               tupian[smi].dom.style.zIndex = smi;
           }
           tupian[tupianTotal-1] = tupian[tupianTotal];
           tupian[tupianTotal-1].dom.style.zIndex = tupianTotal-1;
           tpi = tupianTotal-1;
       }
       var bottomtupian = function(){
           tupian[tupianTotal] = tupian[tpi];
           for(smi = tpi;smi>0;smi--){
               tupian[smi] = tupian[smi-1];
               tupian[smi].dom.style.zIndex = smi;
           }
           tupian[0] = tupian[tupianTotal];
           tupian[0].dom.style.zIndex = 0;
           tpi = 0;
       }
       mugeda.defineCallback('层级变更', function(object,cengji){
           if(cengji)
              object.dom.style.zIndex = cengji;
       }); 
       mugeda.defineCallback('录入图片', function(object,textname){
           if(scene.getObjectByName(textname)){
               img.src = scene.getObjectByName(textname).text;
               scene.getObjectByName(textname).text = " ";
           }
       }); 
       mugeda.defineCallback('录入功能按钮图片', function(object,ID){
           GNanniuIMG[ID] = object;
       }); 
       mugeda.defineCallback('添加元件', function(object,mingcheng){
           if(mingcheng)
              var SZ = scene.getObjectByName('位置判断').text;
              SZ = parseFloat(SZ);//文本转为数字
              var Xinyj = mugeda.createInstanceOfSymbol(mingcheng);
              scene.appendChild(Xinyj,'',1);
              CenterGo(Xinyj,mugeda.width/2+SZ,mugeda.height/2+SZ);
              tupian[tupianTotal] = Xinyj;
              tpi = tupianTotal;
              if(GNI == 1){
                kuangW = getTrueW(tupian[tpi]);
                kuangH = getTrueH(tupian[tpi]);
                kuangX = getCenterX(tupian[tpi]);
                kuangY = getCenterY(tupian[tpi]);
           }
           tupianTotal++;
           updateUIkuang();
           CenterGo(GNanniu,kuangX+kuangW/2,kuangY-kuangH/2);
           CenterGo(SCanniu,kuangX-kuangW/2,kuangY+kuangH/2);
           CenterGo(GDanniu,kuangX+kuangW/2,kuangY+kuangH/2);
       });
       mugeda.defineCallback('选择功能', function(object,ID){
           GDanniuUI.left = 400;
           if(ID == 1 || ID == 2){
               GNI = ID;
               GNanniu.dom.src = GNanniuIMG[GNI].dom.src;
               if(ID == 1){
                   kuangW = getTrueW(tupian[tpi]);
                   kuangH = getTrueH(tupian[tpi]);
               }
               else if(ID == 2){
                   kuangW = kuangH = quanR/1.5;
               }
               updateUIkuang();
               CenterGo(GNanniu,kuangX+kuangW/2,kuangY-kuangH/2);
               CenterGo(SCanniu,kuangX-kuangW/2,kuangY+kuangH/2);
               CenterGo(GDanniu,kuangX+kuangW/2,kuangY+kuangH/2);
           }else if(ID == 3){
               toptupian();
           }else if(ID == 4){
               bottomtupian();
           }else if(ID == 5){
               tupian[tpi].rotateY += Math.PI;
               tupian[tpi].rotateCenterX = tupian[tpi].width/2;
               tupian[tpi].rotate *= -1;
           }else if(ID == 6){
               tupian[tpi].rotateX += Math.PI;
               tupian[tpi].rotateCenterY = tupian[tpi].height/2;
               tupian[tpi].rotate *= -1;
           }
       }); 
  });
  //屏蔽拖动
  document.ontouchmove = function(e){
      e.preventDefault();
  }
  }).call(mugeda, mugeda);
  
  });