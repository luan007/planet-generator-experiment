function loadTextFile(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.addEventListener('load', function () {
        callback(request.responseText);
    });
    request.send();
}

function load() {
    var script = document.createElement('script');
    script.src = "/main.js";
    document.getElementsByTagName('body')[0].appendChild(script);
}

loadTextFile("/vertexShader.glsl", function (text1) {
    // use text...
    window.basicVertex = text1;
    loadTextFile("/pixelShader.glsl", function (text2) {
        window.pixelShader = text2;

        load();
        console.log("loading scr");
    });
});