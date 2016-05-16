
var socket = io(':7777');
var dt = [];
var cur = [];




// distort_iterations: { type: "f", value: 3.3 },
// time_scale: { type: "f", value: 0.5 },
// firstOctave: { type: "i", value: 0 },
// octaves: { type: "i", value: 10 },
// persistence: { type: "f", value: 0.1 },
// perlinMagnitude: { type: "f", value: 0.5 },
// perlinOffset: { type: "f", value: 113 },
// strX: { type: "f", value: 0.3 },
// strY: { type: "f", value: 2.2 },
// movX: { type: "f", value: 0.0 },
// movY: { type: "f", value: 0.0 },
// Roff: { type: "f", value: 4.5 },
// Rmut: { type: "f", value: 15.4 },
// Goff: { type: "f", value: 4.233 },
// Gmut: { type: "f", value: 8.4 },
// Boff: { type: "f", value: 0.1 },
// Bmut: { type: "f", value: 3.0 },
// Tmut: { type: "f", value: 0.5 },
// camRot: { type: "f", value: 1.33 },
// Staralike: { type: "f", value: 0 },
// thunderR: { type: "f", value: 0 },
// thunderG: { type: "f", value: 0 },
// thunderB: { type: "f", value: 0 },
// thunderInterval: { type: "f", value: 0 },
// thunderStrength: { type: "f", value: 0 },
// thunderSize: { type: "f", value: 0 },
// darkSpots: { type: "f", value: 0 },
// perlinDepth: { type: "f", value: 1.0 },

function colorOffset(v) {
    if (v == undefined) return 0;
    return v / 3;
}

function tMAG(v) {
    if (v == undefined) return 1;
    return Math.sqrt(v) / 20;
}

var formulas = {
    Roff: colorOffset,
    Goff: colorOffset,
    Boff: colorOffset,
    Rmut: colorOffset,
    Gmut: colorOffset,
    Bmut: colorOffset,
    Tmut: tMAG,
    distort_iterations: function (v) {
        v = v || 1;
        return v / 10.0;
    },
    time_scale: function (v) {
        if (!v) return 0;
        return Math.sqrt(v) / 10;
    },
    perlinMagnitude: function (v) {
        if (!v) return 0;
        return Math.sqrt(v) / 2;
    },
    movX: function (v) {
        v = v || 0;
        return v / 50;
    },
    strX: function (v) {
        v = v || 0;
        return 2.3 - Math.sqrt(v) / 5;
    },
    strY: function (v) {
        v = v || 0;
        return 10.3 - Math.sqrt(v);
    },
    perlinDepth: function (v) {
        v = v || 0;
        return Math.sqrt(v);
    },
    Staralike: function (v) {
        v = v || 0;
        return (v / 50);
    },
    darkSpots: function (v) {
        v = v || 0;
        return v;
    },
    thunderStrength: function (v) {
        v = v || 0;
        return v / 1;
    },
    thunderSize: function (v) {
        v = v || 0;
        return v / 50;
    },
    thunderInterval: function (v) {
        v = v || 0;
        return v * 3;
    },
    camRot: function (v) {
        v = v || 0;
        return v / 30;
    }
};
var indexes = [
    "Roff",
    "Goff",
    "Boff",
    "Tmut",
    "Rmut",
    "Gmut",
    "Bmut",
    "distort_iterations",
    ["time_scale", "movX"],
    ["perlinMagnitude"],
    "strX",
    ["strY", "perlinDepth"],
    ["Staralike", "darkSpots"],
    ["thunderStrength", "thunderSize", "thunderInterval"],
    "camRot",
];


var timeout = 0;
function lease() {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        socket.disconnect();
        socket.connect();
    }, 3000);
}


socket.on('cc', function (data) {
    // console.log(data);"
    dt[data.k] = data.v;
    lease();
});

socket.on('data', function (data) {
    // console.log(data);
    // console.log(data);
    for (var i = 0; i < data.length; i++) {
        if (data[i] !== undefined) {
            dt[i] = data[i];
        }
    }
    lease();
});


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
var shrink = 0.8;
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
            iResolution: { type: "v2", value: new THREE.Vector2(w * devicePixelRatio * shrink, h * devicePixelRatio * shrink) },
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

            distort_iterations: { type: "f", value: 1.3 },
            time_scale: { type: "f", value: 0 },
            firstOctave: { type: "i", value: 2 },
            octaves: { type: "i", value: 10 },
            persistence: { type: "f", value: 0.5 },
            perlinMagnitude: { type: "f", value: 0. },
            perlinOffset: { type: "f", value: 113 },
            strX: { type: "f", value: 0.3 },
            strY: { type: "f", value: 3.2 },
            movX: { type: "f", value: 0.0 },
            movY: { type: "f", value: 0.0 },
            Roff: { type: "f", value: 4.5 },
            Rmut: { type: "f", value: 15.4 },
            Goff: { type: "f", value: 4.233 },
            Gmut: { type: "f", value: 8.4 },
            Boff: { type: "f", value: 0.1 },
            Bmut: { type: "f", value: 3.0 },
            Tmut: { type: "f", value: 0.5 },
            camRot: { type: "f", value: 0.5 },
            Staralike: { type: "f", value: 0 },
            thunderR: { type: "f", value: 1 },
            thunderG: { type: "f", value: 1 },
            thunderB: { type: "f", value: 1 },
            thunderInterval: { type: "f", value: 100 },
            thunderStrength: { type: "f", value: 1 },
            thunderSize: { type: "f", value: 1 },
            darkSpots: { type: "f", value: 0 },
            perlinDepth: { type: "f", value: 5.0 },
        },
        vertexShader: basicVertex,
        fragmentShader: pixelShader,
        // depthWrite: false,
    });

    quad = new THREE.Mesh(new THREE.PlaneGeometry(w, h), shader);
    quad.position.z = 200;
    scene.add(quad);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w * shrink, h * shrink);
    container.appendChild(renderer.domElement);

    renderer.domElement.style.display = "block";
    renderer.domElement.style["margin-left"] = "auto";
    renderer.domElement.style["margin-right"] = "auto";
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
var prev = {};
function render() {


    shader.uniforms['iGlobalTime'].value = .00025 * (Date.now() - start);
    //easing
    for (var i = 0; i < Math.max(cur.length, dt.length); i++) {
        if (cur[i] == undefined) { cur[i] = 0; }
        if (dt[i] == undefined) continue;
        if (Math.abs(cur[i] - dt[i]) < 0.01) {
            cur[i] = dt[i];
        } else {
            cur[i] += (dt[i] - cur[i]) * 0.5;
        }
        var id = indexes[i];
        if (!id) continue;
        if (!Array.isArray(id)) {
            if (prev[id] !== formulas[id](cur[i])) {
                prev[id] = shader.uniforms[id].value = formulas[id](cur[i]);
            }
        } else {
            for (var j in id) {
                if (prev[id[j]] !== formulas[id[j]](cur[i])) {
                    prev[id[j]] = shader.uniforms[id[j]].value = formulas[id[j]](cur[i]);
                }
            }
        }
    }


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