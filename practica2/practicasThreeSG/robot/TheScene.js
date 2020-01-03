
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends THREE.Scene {

  constructor (renderer) {
    super();

    // Attributes
    this.checkLight = null;
    this.ambientLight = null;
    this.spotLight = null;
    this.camera = null;
    this.trackballControls = null;
    this.robot = null
    this.ground = null;

    this.renderer = renderer;



    this.objetoExamen = null    //EXAMEN

    this.pause = false;
    this.gameOver = true;       //EXAMEN: para que no molesten los elementos del juego

    this.subjetiva = false;

    this.ballLimit = 25;

    this.numEnemigos = 0;

    this.createLights ();
    this.createCamera (renderer);
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();
    this.add (this.model);

    console.log(this.ground.width);

    this.ultimaCreacion = (new Date()).getTime();

    this.coolDown = 1500;
    this.puntos = 0;
  }

  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (50, 50, 50);    //EXAMEN
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add(this.camera);
  }

  /// It creates lights and adds them to the graph
  createLights () {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.add (this.ambientLight);

    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 200, 70, 40 );
    this.spotLight.castShadow = true;
    this.add (this.spotLight);
  }

  /// It creates the geometric model: crane and ground
  /**
   * @return The model
   */
  createModel () {
    var model = new THREE.Object3D();
    this.robot = new Robot(this.renderer);
    model.add(this.robot);
    this.robot.visible = false;   //EXAMEN

    this.objetoExamen = new ObjetoExamen();   //EXAMEN
    model.add(this.objetoExamen);       //EXAMEN

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/grass.jpg");
    this.ground = new Ground (100, 400, new THREE.MeshPhongMaterial ({map: textura}), 5);
    model.add (this.ground);
    return model;
  }

  // Public methods

  /// It adds a new box, or finish the action
  /**
   * @param event - Mouse information
   * @param action - Which action is requested to be processed: start adding or finish.
   */
  addBox (event, action) {
    this.ground.addBox(event, action);
  }

  /// It moves or rotates a box on the ground
  /**
   * @param event - Mouse information
   * @param action - Which action is requested to be processed: select a box, move it, rotate it or finish the action.
   */
  moveBox (event, action) {
    this.ground.moveBox (event, action);
  }

  /// It deletes a box on the ground
  /**
   * @param event - Mouse information
   * @param action - Which action is requested to be processed: select a box, move it, rotate it or finish the action.
   */
  deleteBox (event, action) {
    this.ground.deleteBox (event, action);
  }

  /// It sets the crane position according to the GUI
  /**
   * @controls - The GUI information
   */
  animate (controls) {
    this.objetoExamen.esfera.position.x = controls.radioEsfera;   //EXAMEN
    this.objetoExamen.animate();      //EXAMEN

    if(!this.pause && !this.gameOver){
      this.robot.paused = false;

      this.checkLimits();

      this.axis.visible = controls.axis;
    //  this.spotLight.intensity = controls.lightIntensity;
    //  this.checkLight.visible = controls.turnLight;
      this.robot.asignarAlargue (controls.alargue);
      this.robot.asignarRotacion(controls.rotacion);
      this.robot.asignarBalance(controls.balance);


      if(this.numEnemigos == 0){
        var objetoVolador = new ObjetoVolador(this.getRandomArbitrary(0,100));
        this.objetoVolador = [objetoVolador];
        this.numEnemigos++;
        this.ultimaCreacion = (new Date()).getTime();
        this.add(this.objetoVolador[0]);
      }
      var d = new Date();
      this.tiempoActual = d.getTime();

      if(((this.tiempoActual - this.ultimaCreacion) > this.coolDown) && this.numEnemigos < this.ballLimit){
        var model = new THREE.Object3D();

        // crea bola
        var objetoVolador = new ObjetoVolador(this.getRandomArbitrary(0,100));
        this.objetoVolador.push(objetoVolador);
        this.numEnemigos++;
        this.add(objetoVolador);

        // actualiza tiempo
        this.ultimaCreacion = d.getTime();
      }

      for(var i = 0; i < this.numEnemigos; i++){
        this.objetoVolador[i].animate();
        if(this.robot.colision(this.objetoVolador[i]) && !this.objetoVolador[i].getHaChocado()){
          this.objetoVolador[i].Choque();
          if(this.objetoVolador[i].tipo == 2){
            this.robot.energia-=10;
          }
          else {
            var puntosGanados = this.getRandomInt(0,5);
            this.puntos += puntosGanados;
            this.robot.energia += 5 - puntosGanados;

            if(this.robot.energia >=100)
              this.robot.energia = 100;
          }
        }
      }
      this.mensaje(this.energia);
    }
    else{
      this.robot.paused = true;
    }


  }

  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    return this.camera;
  }

  /// It returns the camera controls
  /**
   * @return The camera controls
   */
  getCameraControls () {
    return this.trackballControls;
  }

  /// It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomArbitrary(min, max) {
    var n = Math.random() * (max - min) + min;
    if(n <= 20)
      n = 1;
    else
      n = 2;
    return n;
  }

  mensaje(vida){
    if(this.robot.energia <= 0){
      this.robot.energia = 0;
      this.gameOver = true;
      setMessage ("GAME OVER" + "\tPuntos: " + this.puntos);
    }
    else{
      setMessage ("Energía: " + this.robot.energia + "\tPuntos: " + this.puntos);
    }

    this.robot.escalarVida();
  }

  checkLimits(){
    //console.log(this.robot.position.x);

    if(this.robot.position.x > this.ground.deep/4      ||
       this.robot.position.x < -this.ground.deep/4     ||
       this.robot.position.z > this.ground.width*3.5/2 ||
       this.robot.position.z < -this.ground.width*3.5/2)

      this.robot.energia = 0;
  }
}

  // class variables

  // Application modes
  TheScene.NO_ACTION = 0;
  TheScene.ADDING_BOXES = 1;
  TheScene.MOVING_BOXES = 2;
  TheScene.DELETING_BOXES = 3;

  // Actions
  TheScene.NEW_BOX = 0;
  TheScene.MOVE_BOX = 1;
  TheScene.SELECT_BOX = 2;
  TheScene.ROTATE_BOX = 3;
  TheScene.DELETE_BOX = 4;
  TheScene.END_ACTION = 10;
