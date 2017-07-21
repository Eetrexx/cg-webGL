/*
Projeto Pratico 2016 - Fase Final
Eduardo Romao da Rocha - RA: 408468
Julio Cesar Nohara - RA: 408158
Matheus Gomes Barbieri - RA: 408344
*/

var container, scene, cam, renderer, controls, stats;
//var kb = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var vel = 0.01;

var caster;

var cone, cube, sphere;
var curvaBezier = new THREE.CubicBezierCurve3(
		new THREE.Vector3(80, 50, -15), //-10 0 0
		new THREE.Vector3(80, 90, -15), //-5 15 0
		new THREE.Vector3(80, 130, 15), //20 15 0
		new THREE.Vector3(80, 170, 30) //10, 0, 0
);
var contador = 0;

init();
animate();

function init(){
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
	var NEAR = 0.1, FAR = 20000;

	scene = new THREE.Scene();

	cam = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(cam);

	cam.position.set(0, 150, 400);
	cam.lookAt(scene.position);

	if(Detector.webgl) renderer = new THREE.WebGLRenderer({antialias: true});
	else renderer = new THREE.CanvasRenderer();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById('ThreeJS');
	container.appendChild(renderer.domElement);

	//THREEx.WindowResize(renderer, cam);
	//THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});

	controls = new THREE.OrbitControls(cam, renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	var ambientLight = new THREE.AmbientLight(0x111111);

	//Criando o Phong Shader
	/*var uniforms = {};
	var attributes = {};
	var phongMat = new THREE.ShaderMaterial({
		uniforms: uniforms,
		attributes: attributes,
		vertexShader: document.getElementById('vertex-shader').textContent,
		fragmentShader: document.getElementById('fragment-shader').textContent
	});*/

	//Criando os objetos
	
	//esfera
	var sphereTexture = new THREE.TextureLoader().load('basketball_texture.jpg');
	var sphereGeo = new THREE.SphereGeometry(50, 32, 16);
	var sphereMat = new THREE.MeshLambertMaterial(/*{color: 0x8888ff}*/{map: sphereTexture});
	sphere = new THREE.Mesh(sphereGeo, sphereMat);
	sphere.position.set(80, 30, -15); //100 50 -50
	scene.add(sphere);

	//cubo
	var cubeMaterialArray = [];
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
	var cubeTexture = new THREE.TextureLoader().load('crate_texture.jpg');
	var cubeMat = new THREE.MeshBasicMaterial(/*cubeMaterialArray*/{map: cubeTexture});
	var cubeGeo = new THREE.BoxGeometry(100, 100, 100, 1, 1, 1);
	cube = new THREE.Mesh(cubeGeo, cubeMat);
	cube.position.set(-150, 150, -50); //-100 50 -50
	scene.add(cube);

	//cone
	var coneTexture = new THREE.TextureLoader().load('casquinha_textura.jpg');
	var coneGeo = new THREE.ConeGeometry(50, 100, 100);
	var coneMat = new THREE.MeshPhongMaterial(/*{color: 0xffff00}*/{map: coneTexture});
	/*var coneShaders = new THREE.ShaderMaterial({
		uniforms: uniforms,
		attributes: attributes,
		vertexShader: document.getElementById('vertex-shader').textContent;
		fragmentShader: document.getElementById('fragment-shader').textContent;
	});*/
	cone = new THREE.Mesh(coneGeo, coneMat);
	cone.position.set(210, 150, -50);
	scene.add(cone);

	//chao
	var floorTexture = new THREE.TextureLoader().load('grass texture.png');
	floorTexture.wrapS = THREE.RepeatWrapping; 
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 10, 10 );
	var floorMat = new THREE.MeshBasicMaterial({map: floorTexture, side:THREE.DoubleSide});
	var floorGeo = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var floor = new THREE.Mesh(floorGeo, floorMat);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);

	//ceu
	var skyTexture = new THREE.TextureLoader().load('sky_texture.png');
	var skyGeo = new THREE.BoxGeometry(10000, 10000, 10000);
	var skyMat = new THREE.MeshBasicMaterial(/*{color: 0x9999ff*/{map: skyTexture, side: THREE.BackSide});
	var sky = new THREE.Mesh(skyGeo, skyMat);
	scene.add(sky);
	
	caster = new THREE.Raycaster();
	var objetos = [cube, cone, sphere];
	caster.set(floor.position, floor.rotation);
	var colisao = caster.intersectObjects(objetos, true);
	
	if(colisao == true){
		console.log("Colisao Detectada !!");
	}
}

/*
 * Essa função é responsável pela rotação do objeto cone
 * nos 3 eixos (X, Y, Z)
 * */
function giraCone(){
	cone.rotation.x -= vel * 2;
	cone.rotation.y -= vel;
	cone.rotation.z -= vel * 3;
}

/*
 * Essa função é responsável pela rotação do objeto cubo
 * nos 3 eixos (X, Y, Z)
 * */
function giraCubo(){
	cube.rotation.x += vel * 0.5;
	cube.rotation.y += vel * 0.9;
	cube.rotation.z += vel * 1.5;
}

/*
 * Essa função é responsável por movimentar o objeto esfera,
 * respeitando uma Curva de Bézier
 * */
function moveEsfera(){
	/*var curvaBezier = new THREE.CubicBezierCurve3(
		new THREE.Vector3(100, 50, -50), //-10 0 0
		new THREE.Vector3(100, 60, -50), //-5 15 0
		new THREE.Vector3(100, 70, -50), //20 15 0
		new THREE.Vector3(100, 80, -50) //10, 0, 0
	);*/
	
	//sphere.position = curvaBezier.getPoint();
	sphere.rotation.x += vel * 0.9;
	
	if(contador <= 1){
		sphere.position.copy(curvaBezier.getPointAt(contador));
		
		contador += 0.005;
	}else contador = 0;
	
	//sphere.rotation += curvaBezier.getTangent(10);
}

function animate(){
	requestAnimationFrame( animate );
	giraCone();
	giraCubo();
	moveEsfera();
	render();		
	//update();
}

function update(){
	var delta = clock.getDelta(); 

	// functionality provided by THREEx.KeyboardState.js
	if ( kb.pressed("1") )
		document.getElementById('message').innerHTML = ' Have a nice day! - 1';	
	if ( kb.pressed("2") )
		document.getElementById('message').innerHTML = ' Have a nice day! - 2 ';	
		
	controls.update();
	stats.update();
}

function render(){
	renderer.render(scene, cam);
}
