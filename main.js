import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';

if ( WebGL.isWebGL2Available() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}

const scene = new THREE.Scene();
const camera =  new THREE.PerspectiveCamera( 75, window.innerWidth/innerHeight, 0.1, 1000);

const renderer =new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({ color:0x00ff00 })
const cube = new THREE.Mesh( geometry, material);
scene. add ( cube ) ;

camera. position.z = 5;

function animate() {
    cube.rotate.x += 0.01;
    cube.rotate.y += 0.01;
    renderer.render (scene, camera) ;
    }

renderer .setAnimationLoop( animate );

