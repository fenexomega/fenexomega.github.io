var scene, camera, renderer;
var SPEED = 0.01;
i = 0;

var size   = 196;
var WIDTH  = size;
var HEIGHT = size;

function init() {
  scene = new THREE.Scene();
   initCamera();
   initRenderer();
  initCube();
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
    camera.position.set(0, 3.5, 2);
    camera.lookAt(scene.position);
}

function initRenderer() {
    canvas = document.getElementsByTagName('canvas')[0];
    console.log(canvas);
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setClearColor( 0x151515 , 1);
    // renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}

function initCube() {
    mesh = new THREE.CubeGeometry(2, 2, 2);
    geo =  new THREE.WireframeGeometry(mesh);
    mat = new THREE.LineBasicMaterial({ color: 0x53b9e8, linewidth: 2 });
    wireframe = new THREE.LineSegments( geo, mat );
    scene.add(wireframe);
}



function rotateCube() {
    i++;
    if(i > 10)
      i = 0;
    wireframe.rotation.x -= SPEED * i;
    wireframe.rotation.y -= SPEED;
    wireframe.rotation.z -= SPEED * i/2;
}

function render() {
  requestAnimationFrame(render);
   rotateCube();
   renderer.render(scene, camera);
}

init();
render();
