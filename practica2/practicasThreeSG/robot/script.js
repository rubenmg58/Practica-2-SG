
/// Several functions, including the main

/// The scene graph
scene = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

/// The current mode of the application
applicationMode = TheScene.NO_ACTION;

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
    setMessage ("Vida: 100 \tPuntos: 0");

    this.axis = true;
    this.lightIntensity = 0.5;
    this.turnLight = true;
    this.alargue   = 6;
    this.rotacion  = 0;
    this.balance   = 0;
    this.radioEsfera = 5;

    this.addBox   = function () {
      setMessage ("Añadir cajas clicando en el suelo");
      applicationMode = TheScene.ADDING_BOXES;
    };
    this.moveBox  = function () {
      setMessage ("Mover y rotar cajas clicando en ellas");
      applicationMode = TheScene.MOVING_BOXES;
    };
    this.deleteBox = function () {
      setMessage ("Borrar cajas clickando en ellas");
      applicationMode = TheScene.DELETING_BOXES;
    }

    this.restartPosition = function () {
      setMessage ("Posicion restablecida");

      GUIcontrols.alargue = 6;
      GUIcontrols.rotacion = 0;
      GUIcontrols.balance = 0;
    };
  }

  var gui = new dat.GUI();

  var robotControls = gui.addFolder ('Robot Controls');
    robotControls.add (GUIcontrols, 'alargue', 6, 6+(6*20/100), 0.001).name('Alargue :').listen();
    robotControls.add (GUIcontrols, 'rotacion', -80, 80, 0.001).name('Rotacion :').listen();
    robotControls.add (GUIcontrols, 'balance', -45, 30, 0.001).name('Balance :').listen();
    robotControls.add (GUIcontrols, 'radioEsfera', 0, 10, 0.001).name('Radio Esfera :').listen();
    // The method  listen()  allows the height attribute to be written, not only read
    var restartPos = robotControls.add (GUIcontrols, 'restartPosition').name('Restart Robot :');

  if (withStats)
    stats = initStats();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {

  var stats = new Stats();

  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  $("#Stats-output").append( stats.domElement );

  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}


/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  return renderer;
}

/// It renders every frame
function render() {
  requestAnimationFrame(render);

  stats.update();
  //scene.getCameraControls().update ();
  scene.animate(GUIcontrols);

  renderer.render(scene, scene.getCamera());
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 38) {
      scene.robot.moveUp();
      scene.mensaje(scene.robot.energia);
    } else if (keyCode == 40) {
      scene.robot.moveDown();
      scene.mensaje(scene.robot.energia);
    } else if (keyCode == 37) {
      scene.robot.moveLeft();
      scene.mensaje(scene.robot.energia);
    } else if (keyCode == 39) {
      scene.robot.moveRight();
      scene.mensaje(scene.robot.energia);
    } else if (keyCode == 32) {
      scene.pause = !scene.pause;
    } else if (keyCode == 86) {
      if(!scene.subjetiva){
        scene.camera = scene.robot.camara;
        scene.robot.barraVida.position.z = 10;
        scene.robot.barraVida.position.y = 14;
        scene.subjetiva = true;
      }
      else {
        scene.createCamera();
        scene.robot.barraVida.position.z = 0;
        scene.robot.barraVida.position.y = 12;
        scene.subjetiva = false;
      }
    }

}

/// The main function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // listeners
  window.addEventListener ("resize", onWindowResize);

  document.addEventListener("keydown", onDocumentKeyDown, false);

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement);

  createGUI(true);

  render();
});
