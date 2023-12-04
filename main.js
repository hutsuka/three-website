import './style.css'
import *as THREE from 'three'
import bg from "./public/bg.jpeg"
//canvas
const canvas = document.querySelector("#webgl");

//シーン★
const scene = new THREE.Scene();


//背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load(bg);
scene.background = bgTexture;  //背景の場合はaddではなくbackgroundに入れる

//サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//カメラ★
const camera = new THREE.PerspectiveCamera(
  75, //視野角度
  sizes.width / sizes.height, //アスペクト比
  0.1, //ニア
  1000 //ファー
);

//レンダラー★
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height); //画面いっぱいに
renderer.setPixelRatio(window.devicePixelRatio); // ピクセル比率を設定粗さを低減








//オブジェクトの作成

const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0,0.5,-15); //中心座標 この記述がないとカメラと物体が重なってしまい、見えなくなる
box.rotation.set(1,1,0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0,1,10);

scene.add(box, torus);


//線形補間でなめらかに移動させる
function lerp(x,y,a){
  return (1 - a) * x + a * y;
}
//線形補間 aによって変化する
function scalePercent(start,end){
  return (scrollParcent - start) / (end - start);

}




//スクロールアニメーション
const animationScripts = []; //アニメーションを格納する空の配列

animationScripts.push({
  start:0,
  end:40,
  //０～４０の間では次の関数を実行
  function(){
    camera.lookAt(box.position);  // カメラがボックスの位置を見るように設定
    camera.position.set(0,1,10);  // カメラの位置を設定
    box.position.z =lerp(-15,2,scalePercent(0,40));
    torus.position.z =lerp(10,-20,scalePercent(0,40));
    box.rotation.x += 0.002;
    box.rotation.y += 0.01;
  },
});

animationScripts.push({
  start:40,
  end:60,
  //０～４０の間では次の関数を実行
  function(){
    camera.lookAt(box.position);  // カメラがボックスの位置を見るように設定
    camera.position.set(0,1,10);  // カメラの位置を設定
    box.rotation.z = lerp(1,Math.PI,scalePercent(40,60));

  },
});

animationScripts.push({
  start:60,
  end:80,
  //０～４０の間では次の関数を実行
  function(){
    camera.lookAt(box.position);  // カメラがボックスの位置を見るように設定
    camera.position.x = lerp(0,-15,scalePercent(60,80));
    camera.position.y = lerp(1,15,scalePercent(60,80));
    camera.position.z = lerp(10,25,scalePercent(60,80));
  },
});

animationScripts.push({
  start:80,
  end:100,
  //０～４０の間では次の関数を実行
  function(){
    camera.lookAt(box.position);  // カメラがボックスの位置を見るように設定
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
  },
});




//アニメーションを開始
function playScrollAnimation(){ //animationScripts配列の中身を一つづつ取り出して繰り返す
animationScripts.forEach((animation) => {
  if(scrollParcent >= animation.start && scrollParcent <= animation.end)//スクロール率がアニメーションの開始と終了の間(０～４０)であれば実行する
  animation.function();
});
}
//ブラウザのスクロール率を取得
let scrollParcent =0;


document.body.onscroll = () =>{ //スクロール率を取得
scrollParcent =
(document.documentElement.scrollTop /
(document.documentElement.scrollHeight -
document.documentElement.clientHeight)*100);
console.log(scrollParcent);

}


//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick); //フレーム単位で実行
  playScrollAnimation(); // スクロールアニメーションを実行
  renderer.render(scene, camera);//レンダー関数を何度も実行
};

tick(); // チック関数を呼び出し、アニメーションを開始

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;//変更したサイズを代入
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height; //アスペクト比を変更
  camera.updateProjectionMatrix(); //プロジェクション行列を更新

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});
