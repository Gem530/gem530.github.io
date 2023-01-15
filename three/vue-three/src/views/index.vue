<template>
  <div class="tab">
    <h3>简易3d模型切换</h3>
    <button @click="changeTab(1)">柜子</button>
    <button @click="changeTab(2)">椅子</button>
  </div>
  <div ref="box"></div>
</template>

<script lang="ts" name="Three" setup>
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, watch, reactive, onMounted, computed } from 'vue'
const box = ref();

const glbType = ref(1)
  
let scene: any = '', // 创建场景对象
geometry: any = '', // 创建一个立方体几何对象Geometry
material: any = '', // 材质对象Material
mesh: any = '', // 网格模型对象Mesh
point: any = '', // 点光源
ambient: any = '', // 环境光
camera: any ='', // 相机对象
cabinet: any = '../../public/glb/cabinet.glb',
chair: any = '../../public/glb/Chair.glb',
renderer: any = ''; // 创建渲染器对象

const loadGlbModel = (url: string) => {
  return new Promise((reslove, reject) => {
    const loader = new GLTFLoader()
    loader.load(url, (gltf: any) => {
      gltf.scene.scale.set(100,100,100)  //  设置模型大小缩放
      gltf.scene.position.set(0,0,0)
      let axis = new THREE.Vector3(0,1,0);//向量axis
      gltf.scene.rotateOnAxis(axis,Math.PI/2);
      //绕axis轴逆旋转π/16
      gltf.scene.rotateOnAxis(axis,Math.PI/-20);
      gltf.scene.rotateOnAxis(axis,Math.PI/50);
      gltf.scene.name = 'glbModule'
      scene.add(gltf.scene)
      reslove(true) // 放这里，可以保证loader完后，3d模型展示出来
    }, (xhr: any) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        // if ((xhr.loaded / xhr.total) == 1) {
        //   reslove(true)
        // }
    }, (error: Error) => {
        reject(error)
    })
  })
}

const render = () => {
  // let T1 = new Date(); // 本次事件
  // let t = T1 - T0; // 时间差
  // T0 = T1; // 把本次时间赋值给上次时间
  // requestAnimationFrame(render);
  renderer.render(scene, camera); // 执行渲染操作
  // mesh.rotateZ(0.001 * t); // 旋转角速度0.001弧度每毫秒
}

const init = async () => {
  // 创建场景对象
  scene = new THREE.Scene()

  // // 创建几何对象
  // geometry = new THREE.BoxGeometry(100, 150, 150); // 创建一个立方体几何对象Geometry
  // material = new THREE.MeshLambertMaterial({ color: 0x00ffff, wireframe: true }) // 材质对象Material
  // mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
  // scene.add(mesh); // 网格模型添加到场景中

  // 点光源
  point = new THREE.PointLight(0xffffff);
  point.position.set(400, 200, 300); // 点光源位置
  scene.add(point); // 点光源添加到场景中

  // 环境光
  ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient); // 环境光添加到场景中

  // 相机设置
  let width = window.innerWidth; // 窗口宽度
  let height = window.innerHeight; // 窗口高度
  // let width = 1000; // 窗口宽度
  // let height = 700; // 窗口高度
  let k = width / height; // 窗口宽高比
  let s = 200; // 三维场景显示范围控制系数，系数越大，显示的范围越大
  // 创建相机对象
  camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
  camera.position.set(200, 300, 200); // 设置相机位置
  camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）

  // 导入glb模型
  await loadGlbModel(cabinet)
  
  // 创建渲染器对象
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height); // 设置渲染区域尺寸
  renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
  box.value.appendChild(renderer.domElement); // body元素中插入canvas对象
  // 执行渲染操作 指定场景、相机作为参数
  // let T0 = new Date(); // 上次时间
  render();
  let controls = new OrbitControls(camera, renderer.domElement); // 创建控件对象
  controls.addEventListener('change', render); // 监听鼠标、键盘事件
}

const changeTab = async (type: number) => {
  if (glbType.value == type) return
  glbType.value = type

  let list = scene.children
  for (let i = 1; i < list.length; i++) {
    let item = list[i]
    if (item.name == 'glbModule') {
      scene.remove(item) // 删除模型
    }
  }

  let glb = type === 1 ? cabinet : chair
  await loadGlbModel(glb)
  render();
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.tab {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
