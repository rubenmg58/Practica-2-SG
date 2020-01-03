//EXAMEN

class ObjetoExamen extends THREE.Object3D{
  constructor(renderer){
    super();

    this.subiendo = true;
/*
    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/sol.jpeg");
    var material = new THREE.MeshPhongMaterial({map: textura});
  */  
    this.esfera = this.crearObjetoExamen();


    this.add(this.esfera);
  }

  crearObjetoExamen(){
   // var objeto = new THREE.Mesh();

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/sol.jpeg");
    var material = new THREE.MeshPhongMaterial({map: textura});
    
    var esfera = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), material);

   // objeto.add(esfera);

    return esfera;
  }

  animate(){
    this.rotateY(THREE.Math.degToRad(360/(60)));
    if(this.subiendo){
      this.esfera.position.y+=0.1;
    }
    else{
      this.esfera.position.y -=0.1;
    }


    if(this.subiendo && this.esfera.position.y > 6*4){
      this.subiendo = false;
    }

    if(!this.subiendo && this.esfera.position.y < 0){
      this.subiendo = true;
    }   
  }
  
}
