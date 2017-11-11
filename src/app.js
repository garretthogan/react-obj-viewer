import React from 'react';
import DDSLoader from './utils/DDSLoader';
import MTLLoader from './utils/MTLLoader';
import OBJLoader from './utils/OBJLoader';

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onError = this.onError.bind(this);
    this.onProgress = this.onProgress.bind(this);
  }
  componentDidMount() {
    this.init(this.root);
    this.animate();
  }
  init(parent) {
    const onProgress = this.onProgress;
    const onError = this.onError;
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    const scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );
    THREE.Loader.Handlers.add( /\.dds$/i, new DDSLoader() );

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath( 'assets/' );
    mtlLoader.load( 'materials/spirit.mtl', function( materials ) {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.setPath( 'assets/' );
      objLoader.load( 'meshes/spirit.obj', function ( object ) {
        object.position.y = 0;
        scene.add( object );
      }, onProgress, onError );
    });
    //
    const renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    this.setState({camera, scene, renderer});
    window.addEventListener( 'resize', this.onWindowResize, false );
  }
  renderObj() {
    const {camera, scene, renderer} = this.state;
    if (camera && scene && renderer) {
      camera.position.x += ( mouseX - camera.position.x ) * .05;
      camera.position.y += ( - mouseY - camera.position.y ) * .05;
      camera.lookAt( scene.position );
      renderer.render( scene, camera );
    }
  }  
  animate() {
    requestAnimationFrame( this.animate );
    this.renderObj();
  }
  onError(xhr) {

  }
  onProgress(xhr) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  }
  onWindowResize() {
    const {camera, renderer} = this.state;
    if (camera && renderer) {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
  }
  onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
  }  
  render () {
    return ( 
      <div className="jumbotron" ref={(el) => this.root = el} id="container">
        <canvas style={{padding: '12px'}} ref={(el) => this.canvas = el}></canvas>
      </div>
    );
  }
}

export default App;
