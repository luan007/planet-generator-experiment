function addLight(h, s, l, x, y, z) {
    var light = new THREE.PointLight(0xffffff, 1, 10000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    light.castShadow = true;
    light.shadowDarkness = 1.0;
    scene2.add(light);
}

var container, renderer, scene, camera, mesh;
var start = Date.now(), stats;
var texture;
function init() {

    container = document.getElementById('container');

    scene = new THREE.Scene();

    var w = window.innerWidth;
    var h = window.innerHeight;

    // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    camera = new THREE.OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, -10000, 10000);
    camera.position.z = 300;
    // camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    // camera.position.z = 100;
    // camera.target = new THREE.Vector3( 0, 0, 0 );
    scene.add(camera);

    shader = new THREE.ShaderMaterial({
        uniforms: {
            iGlobalTime: { type: "f", value: 0.0 },
            iResolution: { type: "v2", value: new THREE.Vector2(w * devicePixelRatio, h * devicePixelRatio) },
            // distort_iterations : { type: "f", value: 3.3 },
            // time_scale : { type: "f", value: 0. },
            // firstOctave : { type: "i", value: 0 },
            // octaves : { type: "i", value: 15 },
            // persistence : { type: "f", value: 0.1 },
            // perlinMagnitude : { type: "f", value: 0.0 },
            // perlinOffset : { type: "f", value: 113 },
            // strX : { type: "f", value: 2.2 },
            // strY : { type: "f", value: 2.2 },
            // movX : { type: "f", value: 0.0 },
            // movY : { type: "f", value: 0.0 },
            // Roff : { type: "f", value: 0.5 },
            // Rmut : { type: "f", value: 15.4 },
            // Goff : { type: "f", value: 1.233 },
            // Gmut : { type: "f", value: 8.4 },
            // Boff : { type: "f", value: 3.1 },
            // Bmut : { type: "f", value: 3.9 },
            // Tmut : { type: "f", value: 0.5 },
            // camRot : { type: "f", value: 0.33 },
            // perlinDepth : { type: "f", value: 3.0 },
            
            
            distort_iterations : { type: "f", value: 3.3 },
            time_scale : { type: "f", value: 0.5 },
            firstOctave : { type: "i", value: 0 },
            octaves : { type: "i", value: 10 },
            persistence : { type: "f", value: 0.1 },
            perlinMagnitude : { type: "f", value: 0.5 },
            perlinOffset : { type: "f", value: 113 },
            strX : { type: "f", value: 0.3 },
            strY : { type: "f", value: 2.2 },
            movX : { type: "f", value: 0.0 },
            movY : { type: "f", value: 0.0 },
            Roff : { type: "f", value: 4.5 },
            Rmut : { type: "f", value: 15.4 },
            Goff : { type: "f", value: 4.233 },
            Gmut : { type: "f", value: 8.4 },
            Boff : { type: "f", value: 0.1 },
            Bmut : { type: "f", value: 3.0 },
            Tmut : { type: "f", value: 0.5 },
            camRot : { type: "f", value: 0.33 },
            perlinDepth : { type: "f", value: 1.0 },
             
        },
        vertexShader: basicVertex,
        fragmentShader: pixelShader,
        // depthWrite: false,
    });




    quad = new THREE.Mesh(new THREE.PlaneGeometry(w, h), shader);
    quad.position.z = 200;
    scene.add(quad);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    
    // renderer.domElement.style.display = "none";

    // scene2 = new THREE.Scene();

    // camera2 = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    // camera2.position.z = 100;
    // camera2.target = new THREE.Vector3(0, 0, 0);
    // scene2.add(camera2);



    // texture = new THREE.Texture(renderer.domElement);
    // var sphMat = new THREE.MeshPhongMaterial({
    //     map: texture,
    //     // displacementMap : texture,
    //     // displacementScale: 31,
    //     // bumpMap : texture,
    //     // bumpScale: 0.3,
    //     specularMap: texture,
    // });
    // sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 50, 50), sphMat);
    // sphere.position.z = -100; addLight(1, 1, 1, 500, 0, 500);

    // sphere.castShadow = true;
    // sphere.receiveShadow = false;
    // scene2.shadowMapEnabled = true;
    // scene2.add(sphere);


    // // mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 5 ), testMaterial );
    // // scene.add( mesh );

    // renderer2 = new THREE.WebGLRenderer({antialias : true});
    // renderer2.setSize(window.innerWidth, window.innerHeight);
    // // renderer.autoClear = true;

    // container.appendChild(renderer2.domElement);
    // // window.addEventListener( 'resize', onWindowResize, false );

    render();

}

// function onWindowResize() {
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
// }

var scale = 0;

function render() {

    shader.uniforms['iGlobalTime'].value = .00025 * (Date.now() - start);
    // shader.uniforms['perlinOffset'].value = .0015 * (Date.now() - start);

    // camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
    // camera.position.y = 100 * Math.cos( phi );
    // camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );

    //mesh.rotation.x += .012;
    //mesh.rotation.y += .01;
    // camera.lookAt( scene.position );
    //renderer.render( bkgScene, bkgCamera );
    renderer.render(scene, camera);
    // texture.needsUpdate = true;
    // renderer2.render(scene2, camera2);
    requestAnimationFrame(render);
}

init();