/// The Robot class
/**
 * @author Alejandro Gallardo & Ruben Mogica
 */

class Robot extends THREE.Object3D{
  constructor(renderer){
    super();

    this.alargue = 6;
    this.rotacion = 0;
    this.balance = 0;

    this.cuerpoHombro = null;
    this.cabeza = null;
    this.cuerpoCabeza = null;
    this.barraVida = null;

    this.energia = 100;
    this.paused = false;

    this.camara = null;
    this.createCamera(renderer);

    this.robot = this.crearRobot();
    this.robot.position.y = -4.5;
    this.position.y = 4.5;

    this.add(this.robot);
  }

  crearBaseBrazo(){
    var baseBrazo = new THREE.Mesh();

    var baseCono = new THREE.Mesh (
      new THREE.CylinderGeometry(0.5, 1, 1, 32, 1), this.material);

    baseCono.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0.5,0));
    baseCono.castShadow = true;
    baseCono.autoUpdateMatrix = false;

    //baseCono.material= new THREE.MeshPhongMaterial ({color: 0x00008B, specular: 0xffffff, shininess: 170});

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/metal1.jpg");
    baseCono.material = new THREE.MeshPhongMaterial({map: textura});

    baseCono.updateMatrix();

    var cilindro = new THREE.Mesh (
      new THREE.CylinderGeometry(0.3, 0.3, 6, 32, 1), this.material);

    cilindro.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,3,0));
    cilindro.castShadow = true;
    cilindro.autoUpdateMatrix = false;

    //cilindro.material= new THREE.MeshPhongMaterial ({color: 0xF0FFFF, specular: 0xffffff, shininess: 170});

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/metal4.jpeg");
    cilindro.material = new THREE.MeshPhongMaterial({map: textura});

    cilindro.rotation.y = THREE.Math.degToRad(180);

    cilindro.updateMatrix();

    baseBrazo.add(baseCono);
    baseBrazo.add(cilindro);

    baseBrazo.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,20,0));

    return baseBrazo;

  }

  crearBrazoHombro(){
    var brazoHombro = new THREE.Mesh();

    var cubo = new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,1.5), this.material);
    cubo.castShadow = true;
    cubo.autoUpdateMatrix = false;

    //cubo.material= new THREE.MeshPhongMaterial ({color: 0x00008B, specular: 0xffffff, shininess: 170});

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/metal1.jpg");
    cubo.material = new THREE.MeshPhongMaterial({map: textura});

    cubo.updateMatrix();

    var cilindro = new THREE.Mesh (
      new THREE.CylinderGeometry(0.4, 0.4, 6, 32, 1), this.material);

    cilindro.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2.5,0));
    cilindro.castShadow = true;
    cilindro.autoUpdateMatrix = false;

    //cilindro.material= new THREE.MeshPhongMaterial ({color: 0xF0FFFF, specular: 0xffffff, shininess: 170});

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/metal4.jpeg");
    cilindro.material = new THREE.MeshPhongMaterial({map: textura});

    cilindro.rotation.y = THREE.Math.degToRad(180);

    cilindro.updateMatrix();

    brazoHombro.add(cubo);
    brazoHombro.add(cilindro);

    return brazoHombro;
  }

  crearCabeza(){
    var cabeza = new THREE.Mesh();

    var esfera = new THREE.Mesh(
      new THREE.SphereGeometry(3,32,32), this.material);

    esfera.castShadow = true;
    esfera.autoUpdateMatrix = false;

    //esfera.material= new THREE.MeshPhongMaterial ({color: 0x00008B, specular: 0xffffff, shininess: 170});

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/metal2.jpeg");
    esfera.material = new THREE.MeshPhongMaterial({map: textura});

    esfera.rotation.z = THREE.Math.degToRad(90);

    esfera.updateMatrix();

    var cilindro = new THREE.Mesh (
      new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32, 1), this.material);

    cilindro.position.y = 1.5;
    cilindro.position.z = 2.5;
    cilindro.rotation.x=THREE.Math.degToRad(90);
    cilindro.castShadow = true;
    cilindro.autoUpdateMatrix = false;

    cilindro.material= new THREE.MeshPhongMaterial ({color: 0xDC143C, specular: 0xffffff, shininess: 170});

    var loader1 = new THREE.TextureLoader();
    var textura1 = loader.load ("imgs/metal3.jpeg");
    cilindro.material = new THREE.MeshPhongMaterial({map: textura1});

    cilindro.updateMatrix();

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set(0, 10, 4);

    var objetivo = new THREE.Object3D();
    objetivo.position.set(0, 5, 10);
    spotLight.target=objetivo;
    spotLight.add(objetivo);

    cilindro.add(spotLight);

    cabeza.add(esfera);
    cabeza.add(cilindro);

    return cabeza;
  }

  crearCuerpoCabeza(){
    var cuerpoCabeza = new THREE.Mesh();

    this.cabeza = this.crearCabeza();

    this.cabeza.rotation.y = this.rotacion;

    this.cabeza.position.y = 3;

    var cilindro = new THREE.Mesh (
      new THREE.CylinderGeometry(3.1, 3.1, 6, 32, 1), this.material);

    cilindro.castShadow = true;
    cilindro.autoUpdateMatrix = false;

    cilindro.material= new THREE.MeshPhongMaterial ({color: 0xF0FFFF, specular: 0xffffff, shininess: 170});

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/metal4.jpeg");
    cilindro.material = new THREE.MeshPhongMaterial({map: textura});

    cilindro.rotation.y = THREE.Math.degToRad(180);

    cilindro.updateMatrix();

    cuerpoCabeza.add(this.cabeza);
    cuerpoCabeza.add(cilindro);

    return cuerpoCabeza;
  }

  crearCuerpoHombro(){
    var cuerpoHombro = new THREE.Mesh();

    this.cuerpoCabeza = this.crearCuerpoCabeza();
    this.cuerpoCabeza.position.y = -1;
    this.cuerpoCabeza.rotation.x = this.balance;

    var brazoHombro1 = this.crearBrazoHombro();
    var brazoHombro2 = this.crearBrazoHombro();
    brazoHombro1.position.x=-3.7;
    brazoHombro2.position.x=3.7;

    cuerpoHombro.add(this.cuerpoCabeza);
    cuerpoHombro.add(brazoHombro1);
    cuerpoHombro.add(brazoHombro2);

    return cuerpoHombro;
  }

  crearRobot(){
    var robot = new THREE.Mesh();

    var baseBrazo1 = this.crearBaseBrazo();
    var baseBrazo2 = this.crearBaseBrazo();
    baseBrazo1.position.x=-3.7;
    baseBrazo2.position.x=3.7;

    this.cuerpoHombro = this.crearCuerpoHombro();
    this.cuerpoHombro.position.y=this.alargue;

    var material= new THREE.MeshPhongMaterial ({color: 0x00FF00, specular: 0xffffff, shininess: 170});
    this.barraVida = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10), material);
    this.barraVida.position.y = 12;
    this.barraVida.rotation.z = THREE.Math.degToRad(90);

    robot.add(this.barraVida);
    robot.add(baseBrazo1);
    robot.add(baseBrazo2);
    robot.add(this.cuerpoHombro);

    return robot;
  }

  // Metodos para los grados de libertad
  asignarAlargue(alargue){
    this.cuerpoHombro.position.y = alargue;
  }

  asignarRotacion(rotacion){
    this.cabeza.rotation.y = THREE.Math.degToRad(rotacion);
  }

  asignarBalance(balance){
    this.cuerpoCabeza.rotation.x = THREE.Math.degToRad(balance);
  }

  colision(otro){
    //console.log(this.position.distanceTo(otro.position));
    return this.position.distanceTo(otro.position) <= 4.5;
  }

  posicion(){
    return this.position;
  }

  escalarVida(){
    this.barraVida.scale.y = 0.01*this.energia;

    if(this.energia > 50){
      var material= new THREE.MeshBasicMaterial ({color: 0x00FF00, specular: 0xffffff, shininess: 170});
      this.barraVida.material = material;
    }
    if(this.energia < 50 && this.energia > 20){
      var material= new THREE.MeshBasicMaterial ({color: 0xFFA500, specular: 0xffffff, shininess: 170});
      this.barraVida.material = material;
    }
    if(this.energia < 20){
      var material= new THREE.MeshBasicMaterial ({color: 0xFF0000, specular: 0xffffff, shininess: 170});
      this.barraVida.material = material;
    }

  }

  moveUp(){
    if(!this.paused){
      this.translateZ(3);
      this.energia-=0.5;
    }
  }

  moveDown(){
    if(!this.paused){
      this.translateZ(-3);
      this.energia-=0.5;
    }
  }

  moveLeft(){
    if(!this.paused){
      this.rotateY(THREE.Math.degToRad(10));
      this.energia-=0.5;
    }
  }

  moveRight(){
    if(!this.paused){
      this.rotateY(THREE.Math.degToRad(-10));
      this.energia-=0.5;
    }
  }

  createCamera (renderer) {
    this.camara = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camara.position.set (0, 7, 1);
    var look = new THREE.Vector3 (0, 7, 2);
    this.camara.lookAt(look);

    this.add(this.camara);
  }
}
