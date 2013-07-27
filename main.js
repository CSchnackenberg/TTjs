require.config({
    baseUrl: "src",
    paths: {
        glMatrix: "lib/gl-matrix",
        requestAnimationFrame: "lib/requestAnimationFrame",
        text: "lib/text",
        assets: "../assets",
        env: "ttjs/util/Env"
    },
    urlArgs: "bust=" +  (new Date()).getTime(),     //this is usefull for debugging... remove this on productive!
    waitSeconds: 15
});


//// TODO: Handle require errors here - if you want
//requirejs.onError = function (err) {
//    console.log(err.requireType);
//    if (err.requireType === 'timeout') {
//        console.log('modules: ' + err.requireModules);
//    }
//
//    throw err;
//};

require(["examples/joh/JTilesRenderExample"], function(RenderExample) {

    RenderExample.run();

});