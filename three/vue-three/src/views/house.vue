<template>
  <div>
    <button class="fixed-btn" @click="changeHouse">切换</button>
    <div ref="houseRef"></div>
  </div>
</template>

<script lang="ts" name="House" setup>
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, watch, reactive, onMounted, computed } from 'vue'

const houseRef = ref()
const changeFlag = ref(true)

var scene = new THREE.Scene(); // 创建场景
var box = new THREE.SphereGeometry(25, 50, 50); // 创建几何体
var material = new THREE.MeshBasicMaterial({ // 创建材质对象
  color: 0xffffff,
  side: THREE.BackSide,
});
var mesh = new THREE.Mesh(box, material); // 创建网格模型对象Mesh
scene.add(mesh); // 添加到场景中

var textureLoader = new THREE.TextureLoader(); // 创建纹理
var listener = new THREE.AudioListener();
var audio = new THREE.Audio(listener);
var texture = textureLoader.load( // 纹理加载
  "00125.jpg",
  function (obj: any) {
    // console.log(vm.loading);
    // vm.loading.close();
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load("琵琶语.mp3", function (AudioBuffer: any) {
      audio.setBuffer(AudioBuffer);
      audio.setLoop(true);
      audio.setVolume(0.3);
      audio.play();
    });
    render();
  }
);
mesh.material.map = texture; // 修改模型纹理
var width = window.innerWidth;
var height = window.innerHeight;
var k = width / height;

// 创建相机
var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.zoom = 1;
camera.updateProjectionMatrix();
camera.position.set(-0.87, 0.03, 0.4);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
// document.body.appendChild(renderer.domElement);
var clock = new THREE.Clock();
var FPS = 30;
var refreshTime = 1 / FPS;
var timeS = 0;
function render() {
  requestAnimationFrame(render);
  var renderingInterval = clock.getDelta();
  timeS = timeS + renderingInterval;
  if (timeS > refreshTime) {
    renderer.render(scene, camera);
    // if (vm.rotateBoool) {
      mesh.rotateY(0.002);
    // }
    timeS = 0;
  }
}
render();

// 鼠标事件 移动，缩放
var controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render); // 监听鼠标、键盘事件
// controls.enablePan = false;
// var styleObjArr = path();

function changeHouse () {
  changeFlag.value = !changeFlag.value
  let url = changeFlag.value ? '00125.jpg' : '0011.jpg'
  texture = textureLoader.load(
    url,
    render()
  );
  mesh.material.map = texture;
  render()
}

onMounted(() => {
  houseRef.value.appendChild(renderer.domElement); // 元素中插入canvas对象
})
</script>

<style lang="scss" scoped>
.fixed-btn {
  position: fixed;
  top: 0;
  left: 0;
}
</style>