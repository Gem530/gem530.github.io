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
  "./img/00125.jpg",
  function (obj) {
    console.log(vm.loading);
    vm.loading.close();
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load("./music/琵琶语.mp3", function (AudioBuffer) {
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
document.body.appendChild(renderer.domElement);
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
    if (vm.rotateBoool) {
      mesh.rotateY(0.002);
    }
    timeS = 0;
  }
}
render();
var controls = new THREE.OrbitControls(camera);
controls.enablePan = false;
var styleObjArr = path();
var vm = new Vue({
  el: "#app",
  data: {
    loading: null,
    styleArr: styleObjArr,
    styleChoose: null,
    posArr: null,
    posChoose: null,
    width: window.innerWidth,
    height: window.innerHeight,
    classPath: "img",
    path: "",
    audioBoool: true,
    ScreenBoool: true,
    rotateBoool: true,
    N: styleObjArr[0].children[0].jpgNameArr.length,
    num: 1,
  },
  methods: {
    audioClick: function () {
      if (this.audioBoool) {
        this.audioBoool = false;
        audio.pause();
      } else {
        this.audioBoool = true;
        audio.play();
      }
    },
    ScreenClick: function () {
      if (this.ScreenBoool) {
        this.ScreenBoool = false;
        requestFullScreen();
      } else {
        this.ScreenBoool = true;
        exitFullscreen();
      }
    },
    questionClick: function () {
      this.$alert("按住左键不放上下左右拖动，可以旋转整个场景", "旋转操作", {});
    },
    rotateClick: function () {
      if (this.rotateBoool) {
        this.rotateBoool = false;
      } else {
        this.rotateBoool = true;
      }
    },
    nextClick: function () {
      if (this.num < this.N) {
        this.num += 1;
      } else {
        this.num = 1;
      }
    },
    upClick: function () {
      if (this.num > 1) {
        this.num -= 1;
      } else {
        this.num = this.N;
      }
    },
    styleClick: function (styleObj) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.num = 1;
      this.styleChoose.styleObj.background = null;
      this.posChoose.styleObj.background = null;
      this.styleChoose = styleObj;
      this.styleChoose.styleObj.background = "#409EFF";
      this.posArr = this.styleChoose.children;
      this.posChoose = this.posArr[0];
      this.posArr[0].styleObj.background = "#409EFF";
      this.N = this.posChoose.jpgNameArr.length;
      this.classPath = this.styleChoose.name + "/" + this.posChoose.name;
      this.path =
        this.classPath + "/" + this.posChoose.jpgNameArr[this.num - 1];
      var texture = textureLoader.load("./风格/" + this.path, function (obj) {
        vm.loading.close();
        render();
      });
      mesh.material.map = texture;
    },
    posClick: function (posObj) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.num = 1;
      this.posChoose.styleObj.background = null;
      this.posChoose = posObj;
      this.N = this.posChoose.jpgNameArr.length;
      this.posChoose.styleObj.background = "#409EFF";
      this.classPath = this.styleChoose.name + "/" + this.posChoose.name;
      this.path =
        this.classPath + "/" + this.posChoose.jpgNameArr[this.num - 1];
      var texture = textureLoader.load("./风格/" + this.path, function (obj) {
        vm.loading.close();
        render();
      });
      mesh.material.map = texture;
    },
    update: function () {},
  },
  watch: {
    num: function (value) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.path =
        this.classPath + "/" + this.posChoose.jpgNameArr[this.num - 1];
      console.log(this.path);
      var texture = textureLoader.load("./风格/" + this.path, function (obj) {
        vm.loading.close();
        render();
      });
      mesh.material.map = texture;
      render();
    },
  },
  created() {
    this.posArr = styleObjArr[0].children;
    this.styleChoose = this.styleArr[0];
    this.posChoose = styleObjArr[0].children[0];
    this.loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  },
});
window.onresize = onresizeFun;
function onresizeFun() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  vm.width = window.innerWidth;
  vm.height = window.innerHeight;
}
function requestFullScreen() {
  console.log("fdsfdf");
  var de = document.documentElement;
  if (de.requestFullscreen) {
    de.requestFullscreen();
  } else if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen();
  } else if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen();
  }
}
function exitFullscreen() {
  var de = document;
  if (de.exitFullscreen) {
    de.exitFullscreen();
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen();
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen();
  }
}
