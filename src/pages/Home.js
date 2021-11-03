import { useEffect, useState } from "react";

export const Home = () => {
  const [color, setColor] = useState('black')
  const [fontSize, setFontSize] = useState(1)
  const [clickFlg, setClickFlg] = useState(0) // クリック中の判定 1:クリック開始 2:クリック中

  // 変数宣言
  const cnvWidth = 500;
  const cnvHeight = 500;
  var cnvColor = "255, 0, 0, 1";  // 線の色
  var cnvBold = 5;  // 線の太さ
  var bgColor = "rgb(255,255,255)";
  var cnvs = document.getElementById('canvas');
  var ctx = cnvs && cnvs.getContext('2d');


  const onDownload = () => {
    const canvas = document.getElementById('canvas');
    var base64 = canvas.toDataURL("image/jpeg");
    document.getElementById("download").href = base64;
  }

  const draw =  (x, y) => {
    ctx.lineWidth = cnvBold;
    ctx.strokeStyle = 'rgba('+cnvColor+')';
    // 初回処理の判定
    if (clickFlg === 1) {
      setClickFlg(2)
      ctx.beginPath();
      ctx.lineCap = "round";  //　線を角丸にする
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // canvasの背景色を設定(指定がない場合にjpeg保存すると背景が黒になる)
  const onmousedown = () => {
    setClickFlg(1)
  }
  const onMouseUp = () => {
    setClickFlg(0)
  }

  const onMouseMove = (e) => {
    if(!clickFlg) return false;
    draw(e.offsetX, e.offsetY);
  }

  // canvas上でのイベント
  // $("#canvas").mousedown(function(){
  //   clickFlg = 1; // マウス押下開始
  // }).mouseup(function(){
  //   clickFlg = 0; // マウス押下終了
  // }).mousemove(function(e){
  //   // マウス移動処理
  //   if(!clickFlg) return false;
  //   draw(e.offsetX, e.offsetY);
  // });


  const setBgColor = () => {
    // canvasの背景色を設定(指定がない場合にjpeg保存すると背景が黒になる)
    if (ctx) {
      ctx.fillStyle = bgColor;
    ctx.fillRect(0,0,cnvWidth,cnvHeight);
    }
  }

  useEffect(() => {
    setBgColor();
  })

  return (
    <div>
    <canvas id="canvas" width="500" height="300" css="border: solid 1px #000;box-sizing: border-box;" onmousedown={onmousedown} onmouseup={onMouseUp} onMouseMove={onMouseMove}></canvas>
    <div class="option">
      <div class="color">
        色：
        <button onClick={() => setColor("black")} color="black" />
        <button onClick={() => setColor("red")} color="red" />
        <button onClick={() => setColor("blue")} color="blue" />
      </div>
      <div class="bold">
        太さ：
        <button onClick={() => setFontSize(1)}>小</button>
        <button onClick={() => setFontSize(5)}>中</button>
        <button onClick={() => setFontSize(10)}>大</button>
      </div>
    </div>
    <input type="button" value="clear" id="clear" />
    <button onClick={onDownload}>ダウンロード</button>
    <div id="result"><img src="" alt="sign" /></div>
    </div>
  )
}