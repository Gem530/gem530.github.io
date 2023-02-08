<template>
  <div ref="houseRef"></div>
</template>

<script lang="ts" name="House" setup>
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, watch, reactive, onMounted, computed } from 'vue'
console.log(THREE)

const houseRef = ref()

onMounted(() => {
  var scene = new THREE.Scene();
  var box = new THREE.SphereGeometry(25, 50, 50);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.BackSide,
  });
  var mesh = new THREE.Mesh(box, material);
  scene.add(mesh);

  var textureLoader = new THREE.TextureLoader();
  var listener = new THREE.AudioListener();
  var audio = new THREE.Audio(listener);
  var texture = textureLoader.load(
    "../../public/00125.jpg",
    function (obj: any) {
      // console.log(vm.loading);
      // vm.loading.close();
      var audioLoader = new THREE.AudioLoader();
      audioLoader.load("../../public/琵琶语.mp3", function (AudioBuffer: any) {
        audio.setBuffer(AudioBuffer);
        audio.setLoop(true);
        audio.setVolume(0.3);
        audio.play();
      });
      render();
    }
  );
  mesh.material.map = texture;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var k = width / height;

  var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  camera.position.set(-0.87, 0.03, 0.4);
  camera.lookAt(scene.position);

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  // document.body.appendChild(renderer.domElement);
  houseRef.value.appendChild(renderer.domElement); // 元素中插入canvas对象
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
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // 监听鼠标、键盘事件
  // controls.enablePan = false;
  // var styleObjArr = path();
})
</script>