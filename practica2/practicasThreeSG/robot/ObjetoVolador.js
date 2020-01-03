/// Clase objeto volador
/**
 * @author Alejandro Gallardo & Ruben Mogica
 */

 var Tipo  = {
   BUENO: 1,
   MALO: 2,
 };

class ObjetoVolador extends THREE.Object3D{
  constructor(parameters){
    super();

    this.haChocado = false;
    this.tipo = parameters;

    this.enemigo = this.crearEnemigo();

    this.mesh = null;

    this.position.z = 175;
    this.position.x = this.getRandomArbitrary(-100,100);
    this.position.y = 5;

    this.speed = this.getRandomArbitrary(0.2, 1);
    this.aceleracion = 0;

    this.add(this.enemigo);
  }

  crearEnemigo(){
    var enemigo = new THREE.Mesh();
    var material = null;  

    if(this.tipo === Tipo.BUENO){

      var loader = new THREE.TextureLoader();
      var textura = loader.load ("imgs/verde.jpeg");
      material = new THREE.MeshPhongMaterial({map: textura});

    }
    else {

      var loader = new THREE.TextureLoader();
      var textura = loader.load ("imgs/sol.jpeg");
      material = new THREE.MeshPhongMaterial({map: textura});
    }

    var esfera = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), material);

    esfera.autoUpdateMatrix = false;

    esfera.updateMatrix();

    enemigo.add(esfera);

    return enemigo;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  animate(){
    if(this.position.z < -100*3.5/2){
      this.position.x =  this.getRandomArbitrary(-100,100);
      this.position.z = 100*3.5/2;
      this.aceleracion += 0.3;
    }
    this.position.z -= this.speed + this.aceleracion;
  }

  getZ(){
    return this.position.z;
  }

  getHaChocado(){
    return this.haChocado;
  }

  Choque(){
    this.haChocado=true;
  }
}
