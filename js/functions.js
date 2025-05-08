/*
biezen	mki9
rixel	poi6
tessa	reij7
*/

var rrx,
  rry,
  rrz,
  camera,
  ring,
  line,
  light1,
  light2,
  light3,
  light4,
  light5,
  metalMaterial,
  pathV3,
  svgScale,
  ringObj,
  svgHeight,
  currentRingInnerWidth,
  currentRingHeightVal,
  currentRingDepth,
  ringMaterial,
  skyboxMaterial,
  skybox,
  plane1,
  plane2,
  shadowGenerator,
  box,
  easingFunction,
  animation1,
  animation2,
  shadowGenerator,
  currentSliderParam,
  materialPlane,
  doCartUpdate,
  ringData;

if (typeof userRings == "undefined") {
  userRings = [];
  currentUserRing = 0;
}

var loggedIn;
var loggedInUserName;

debug = 1;
ringChanged = 0;
fpsRatio = 1;
fpsCount = 0;
fps = 0;
langIndex = 1;
mouseDown = 0;
currentRingType = 0;
currentMaterial = 0;
curveBLChecked = 1;
curveBRChecked = 1;
curveTRChecked = 1;
curveTLChecked = 1;
goldIndex = 4;

spinRing = 1;
autoSpin = 1;

pageLabels = [
  { container: ".ringTypeSelecter h2", text: ["Ring shape", "Ringvorm"] },
  { container: ".materialTypeSelecter h2", text: ["Material", "Materiaal"] },
  {
    container: ".autoSpinDiv span",
    text: ["Auto rotate", "Automatisch draaien"],
  },
  { container: ".langSelect span", text: ["Language", "Taal"] },
  { container: ".btnAddToCart", text: ["Add to cart", "Winkelmandje"] },
  {
    container: ".ringNameToolTip",
    text: [
      "Enter the name of your ring here",
      "Verander de naam van deze ring",
    ],
  },
  { container: ".ringNameDiv button", text: ["+ New ring", "+ Nieuwe ring"] },
  {
    container: ".loginDiv table td:eq(0)",
    text: ["Login&nbsp;&nbsp;", "Inloggen&nbsp;&nbsp;"],
  },
  { container: ".username", text: ["Username", "Gebruikersnaam"] },
  { container: ".password", text: ["Password", "Wachtword"] },
  { container: ".loggedInDiv td:eq(0)", text: [" : Logout", " : Uitloggen"] },
  { container: ".ringPriceDiv h2", text: ["Total price", "Totale prijs"] },
  { container: ".ringNameDiv h2", text: ["Your rings", "Jouw ringen"] },
  { container: ".finishTypeSelecter h2", text: ["Finish", "Afwerking"] },
  { container: ".btnFinish1", text: ["Gloss", "Glans"] },
  { container: ".btnFinish2", text: ["Matte", "Mat"] },
  {
    container: ".disclaimer",
    text: [
      "(All sharp edges are rounded)",
      "(Alle scherpe kanten worden afgerond)",
    ],
  },
];

materialsArr = [
  {
    title: ["Titanium", "Titanium"],
    material: [
      {
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.35,
        matte: 0,
        bumpScale: 0.001,
        thumb: "images/colour-tit-1.png",
      },
      {
        color: 0x888888,
        metalness: 0.99,
        roughness: 0.1,
        matte: 0.3,
        bumpScale: 0.001,
        thumb: "images/colour-tit-2.png",
      },
    ],
    grades: [
      {
        title: ["Grade 2", "Grade 2"],
        maxDiameter: [25, 31.75],
        cutWidth: [2, 2],
        finishPrice: [20, 15],
        ppmm: [0.275, 0.42],
        startCost: [15, 19],
        customerFactor: [7, 7],
        margin: [
          [0.75, 1, 4.8],
          [0.9, 1, 5.4],
        ],
      },
      {
        title: ["Grade 5", "Grade 5"],
        maxDiameter: [25, 38],
        cutWidth: [2, 2],
        finishPrice: [20, 15],
        ppmm: [0.38, 0.805],
        startCost: [19, 19],
        customerFactor: [7, 7],
        margin: [
          [0.87, 1, 5.3],
          [0.82, 1, 4.2],
        ],
      },
    ],
  },
  {
    title: ["Steel", "Edelstaal"],
    material: [
      {
        color: 0xaaaaaa,
        metalness: 0.975,
        roughness: 0.2,
        matte: 0.4,
        bumpScale: 0.001,
        thumb: "images/colour-steel-1.png",
      },
    ],
    grades: [
      {
        title: ["Grade 2", "Grade 2"],
        maxDiameter: [29],
        cutWidth: [2],
        finishPrice: [20, 15],
        ppmm: [0.0103, 0.0103],
        startCost: [18, 18],
        customerFactor: [67],
        margin: [
          [0.75, 1.1, 2],
          [0.75, 1.1, 2],
        ],
      },
    ],
  },
  {
    title: ["Aluminium", "Aluminium"],
    material: [
      {
        color: 0xcccccc,
        metalness: 0.95,
        roughness: 0.4,
        matte: -1,
        bumpScale: 0.0005,
        thumb: "images/colour-alum-1.png",
      },
    ],
    grades: [
      {
        title: ["Standard", "Standard"],
        maxDiameter: [30, 38],
        cutWidth: [0, 0],
        finishPrice: [10, 5],
        ppmm: [0, 0],
        startCost: [0, 0],
        customerFactor: [10, 10],
        margin: [
          [1, 1, 1],
          [1, 1, 1],
        ],
      },
    ],
  },
  {
    title: ["Zirconium", "Zirkonium"],
    material: [
      {
        color: 0x888888,
        metalness: 0.99,
        roughness: 0.3,
        matte: 0.2,
        bumpScale: 0.003,
        thumb: "images/colour-zirc-1.png",
      },
      {
        color: 0x222222,
        metalness: 1,
        roughness: 0.25,
        matte: 0.45,
        bumpScale: 0.003,
        thumb: "images/colour-zirc-2.png",
      },
    ],
    grades: [
      {
        title: ["Grey", "Grijs"],
        maxDiameter: [25, 38],
        cutWidth: [2, 2],
        finishPrice: [20, 15],
        ppmm: [0.74, 1.6],
        startCost: [20, 10],
        customerFactor: [9.2, 8],
        margin: [
          [0.82, 1.05, 3],
          [0.85, 1, 3.2],
        ],
      },
      {
        title: ["Black", "Zwart"],
        maxDiameter: [25, 38],
        cutWidth: [2, 2],
        finishPrice: [30, 25],
        ppmm: [0.93, 1.8],
        startCost: [20, 10],
        customerFactor: [9.2, 8],
        margin: [
          [0.8, 1, 3],
          [0.86, 1, 3.2],
        ],
      },
    ],
  },
  {
    title: ["Yellow Gold", "Geel Goud"],
    material: [
      {
        color: 0x867047,
        metalness: 1,
        roughness: 0.15,
        matte: 0.4,
        bumpScale: 0.002,
        thumb: "images/colour-goldYellow-1.png",
      },
      {
        color: 0x816838,
        metalness: 1,
        roughness: 0.15,
        matte: 0.3,
        bumpScale: 0.002,
        thumb: "images/colour-goldYellow-2.png",
      },
    ],
    grades: [
      {
        title: ["14Kt", "14Kt"],
        purity: 0.585,
        SM: 13.8,
        finishPrice: [0, 0],
        shapeCost: 40,
        margin: [1.2, 1.3, 3.3],
      },
      {
        title: ["18Kt", "18Kt"],
        purity: 0.75,
        SM: 15.6,
        finishPrice: [0, 0],
        shapeCost: 40,
        margin: [1.2, 1.3, 3.3],
      },
    ],
  },
  {
    title: ["Red Gold", "Rood Goud"],
    material: [
      {
        color: 0xb18062,
        metalness: 1,
        roughness: 0.24,
        matte: 0.4,
        bumpScale: 0.002,
        thumb: "images/colour-goldRed-1.png",
      },
      {
        color: 0xb18062,
        metalness: 1,
        roughness: 0.14,
        matte: 0.3,
        bumpScale: 0.002,
        thumb: "images/colour-goldRed-2.png",
      },
    ],
    grades: [
      {
        title: ["14Kt", "14Kt"],
        purity: 0.585,
        SM: 13,
        finishPrice: [0, 0],
        shapeCost: 40,
        margin: [1.2, 1.3, 3.3],
      },
      {
        title: ["18Kt", "18Kt"],
        purity: 0.75,
        SM: 14.9,
        finishPrice: [0, 0],
        shapeCost: 40,
        margin: [1.3, 1.4, 3.5],
      },
    ],
  },
  {
    title: ["White Gold", "Wit Goud"],
    material: [
      {
        color: 0xcdc9b3,
        metalness: 1,
        roughness: 0.2,
        matte: 0.3,
        bumpScale: 0.002,
        thumb: "images/colour-goldWhite-1.png",
      },
      {
        color: 0xcfccbc,
        metalness: 1,
        roughness: 0.2,
        matte: 0.3,
        bumpScale: 0.002,
        thumb: "images/colour-goldWhite-2.png",
      },
    ],
    grades: [
      {
        title: ["14Kt", "14Kt"],
        purity: 0.585,
        SM: 14.5,
        finishPrice: [0, 0],
        shapeCost: 40,
        margin: [1.6, 1.7, 3.84],
      },
      {
        title: ["18Kt", "18Kt"],
        purity: 0.75,
        SM: 16,
        finishPrice: [0, 0],
        shapeCost: 40,
        margin: [1.5, 1.6, 3.75],
      },
    ],
  },
];

function log(str) {
  if (debug == 1) {
    console.log(str);
  }
}

function getMaterialIndex() {
  return currentMaterial == 5 || currentMaterial == 6
    ? goldIndex
    : currentMaterial;
}

function getFinish(type) {
  console.log("getFinish", type);
  finishIndex = -1;
  for (var x = 0; x < pageLabels.length; x++) {
    if (pageLabels[x].text[0] == "Finish") {
      finishIndex = x;
      break;
    }
  }
  if (type == "title") {
    return pageLabels[finishIndex].text[langIndex];
  } else {
    if (!$(".finishTypeSelecter input").prop("checked")) {
      return langIndex == 0 ? "None" : "Geen";
    } else {
      return $(".finishTypeSelecter .btnOn").html();
    }
  }
}

function getGradeIndex() {
  gi = $(".matGradeDiv button").index($(".matGradeDiv .btnOn"));
  if (gi < 0) {
    gi = 0;
  }
  return gi;
}

function formatPrice(price) {
  price = price / 1;
  price = price.toFixed(2);
  if (langIndex == 1) {
    price = price.replace(".", ",");
  }
  if (price == "NaN") {
    price = "";
  }
  return price;
}

function parseDecimalRoundAndFixed(num, dec) {
  var d = Math.pow(10, dec);
  return (Math.round(num * d) / d).toFixed(dec);
}

function switchLanguage() {
  for (var x = 0; x < pageLabels.length; x++) {
    if (
      pageLabels[x].container == ".username" ||
      pageLabels[x].container == ".password"
    ) {
      $(pageLabels[x].container).attr(
        "placeholder",
        pageLabels[x].text[langIndex]
      );
    } else if (pageLabels[x].container == ".loggedInDiv td:eq(0)") {
      $(pageLabels[x].container).html(
        loggedInUserName + pageLabels[x].text[langIndex]
      );
    } else {
      console.log(pageLabels[x].container, pageLabels[x].text[langIndex]);
      $(pageLabels[x].container).html(pageLabels[x].text[langIndex]);
    }
  }
  $(".matTitleDiv").html(materialsArr[currentMaterial].title[langIndex]);
  $(".materialListDiv span").hide().eq(langIndex).show();
}

switchLanguage();

function showRingSizeError() {
  alert("Please change the current ring details. It is too tall!");
}

function doLogin() {
  $.ajax({
    data: {
      action: "login",
      username: $(".username").val(),
      password: $(".password").val(),
    },
    url: "./webservice.php",
    success: function (response) {
      response = $.parseJSON(response);
      if (response.status == "OK") {
        loggedIn = 1;
        loggedInUserName = $(".username").val();
        loggedInUserType = response.type;
        updatePrice();
        $(".username, .password").val("");
        $(".loginDiv").fadeTo(300, 0, showLogin);
      } else {
        $(".username, .password").css("background-color", "#9f0000");
        setTimeout(function () {
          $(".username, .password").css("background-color", "#111");
        }, 2000);
      }
    },
  });
}

function doLogout() {
  $.ajax({
    data: { action: "logout" },
    url: "./webservice.php",
    success: function (response) {
      $(".loginDiv").fadeTo(300, 0, hideLogin);
      loggedInUserType = 2;
      updatePrice();
    },
  });
}

function hideLogin() {
  $(".loggedInDiv").hide();
  $(".loginDiv").fadeTo(300, 1);
}

function showLogin() {
  $(".loginDiv").hide();
  $(".loggedInDiv").fadeTo(300, 1);
  switchLanguage();
  log("User type : " + loggedInUserType);
}

createScene = function () {
  log("createScene called");
  setupRing(currentRingType);
};

var rotationInterval;
var clicked = false;
cameraBeta = 0;
ringRotation = 0;
var fpsInterval;

resizeCanvas = function () {
  $(".materialsPopupDv").css(
    "margin-top",
    0 - Math.round($(".materialsPopupDv").height() / 2) + "px"
  );

  /* 3D Canvas... */
  windowWidth = $(".appContainer").width();
  windowHeight = $(".appContainer").height();
  canvasWidth = Math.floor(windowWidth * 0.8 - 310);
  canvasOffsetX = 0;
  canvasOffsetY = 0;

  if (windowHeight < canvasWidth) {
    canvasOffsetX = Math.floor((canvasWidth - windowHeight) / 2);
    canvasWidth = windowHeight;
  } else {
    canvasOffsetY = Math.floor((windowHeight - canvasWidth) / 2);
  }

  $("#renderCanvas")
    .width(canvasWidth)
    .height(canvasWidth)
    .css("margin-left", canvasOffsetX + "px")
    .css("margin-top", canvasOffsetY + "px");

  try {
    camera.aspect = canvasWidth / canvasWidth;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth, canvasWidth);
  } catch (e) {}

  /* 2D Canvas */

  //$(".canvasContainer").height(canvasWidth);
  $(".canvasContainer").width(Math.floor(canvasWidth * 0.383)); //.css("margin-top", canvasOffsetY+"px");;
  //$(".loginDiv, .langSelect").css("right", ($(".canvasContainer").width()+14)+"px");
  /*
    canvasWidth = Math.floor(windowWidth*0.18);
    canvasHeight = canvasWidth*4;
    if(canvasHeight > windowHeight){
    	canvasHeight = Math.floor(windowHeight*0.9);
    	canvasWidth = Math.floor(canvasHeight/3);
    }
    $(".canvasContainer").width(canvasWidth);
    $(".canvasContainer").height(canvasHeight);
    */

  canvas2.style.width = Math.floor($(".canvasContainer").width()); //$(".canvasContainer").width();
  canvas2.style.height = canvasWidth; //$(".canvasContainer").height();
};

$(window).bind("resize", resizeCanvas);

mbArr = new Array(
  "Android",
  "BlackBerry",
  "iPhone",
  "iPod",
  "iPad",
  "Opera Mini",
  "IEMobile"
);

function checkMobile() {
  for (x = 0; x < mbArr.length; x++) {
    if (navigator.userAgent.indexOf(mbArr[x]) > -1) {
      return true;
    }
  }
  return false;
}

var holesArr;

function makeHoles() {
  if (holesArr != undefined) {
    for (x = 0; x < holesArr.length; x++) {
      scene.remove(holesArr[x]);
    }
  }
  holesArr = [];
  holeCount = 11;
  for (x = 0; x < holeCount; x++) {
    var coin1_geo = new THREE.CylinderGeometry(
      1,
      1,
      ringObj.params.ringHeightVal.val + 0.2,
      16,
      20,
      false
    );
    coinMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9,
    });
    holesArr.push(new THREE.Mesh(coin1_geo, coinMat));
    holesArr[x].position.y =
      (ringObj.params.ringHeightVal.val + ringObj.params.ringInnerWidth.val) /
      2;
    rotation = THREE.Math.degToRad(Math.round(360 / holeCount) * x);
    rotateAboutPoint(
      holesArr[x],
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0),
      rotation
    );
    scene.add(holesArr[x]);
  }
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

function volumeOfT(p1, p2, p3) {
  var v321 = p3.x * p2.y * p1.z;
  var v231 = p2.x * p3.y * p1.z;
  var v312 = p3.x * p1.y * p2.z;
  var v132 = p1.x * p3.y * p2.z;
  var v213 = p2.x * p1.y * p3.z;
  var v123 = p1.x * p2.y * p3.z;
  return (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
}

function calculateVolume(object) {
  var volumes = 0.0;

  for (var i = 0; i < object.geometry.faces.length; i++) {
    var Pi = object.geometry.faces[i].a;
    var Qi = object.geometry.faces[i].b;
    var Ri = object.geometry.faces[i].c;

    var P = new THREE.Vector3(
      object.geometry.vertices[Pi].x,
      object.geometry.vertices[Pi].y,
      object.geometry.vertices[Pi].z
    );
    var Q = new THREE.Vector3(
      object.geometry.vertices[Qi].x,
      object.geometry.vertices[Qi].y,
      object.geometry.vertices[Qi].z
    );
    var R = new THREE.Vector3(
      object.geometry.vertices[Ri].x,
      object.geometry.vertices[Ri].y,
      object.geometry.vertices[Ri].z
    );
    volumes += volumeOfT(P, Q, R);
  }

  return Math.abs(volumes);
}

function calculateVolume(object) {
  geo = object.geometry;
  var x1, x2, x3, y1, y2, y3, z1, z2, z3, i;
  var len = geo.faces.length;
  var totalVolume = 0;
  var totalArea = 0;
  var a, b, c, s;

  for (i = 0; i < len; i++) {
    x1 = geo.vertices[geo.faces[i].a].x;
    y1 = geo.vertices[geo.faces[i].a].y;
    z1 = geo.vertices[geo.faces[i].a].z;
    x2 = geo.vertices[geo.faces[i].b].x;
    y2 = geo.vertices[geo.faces[i].b].y;
    z2 = geo.vertices[geo.faces[i].b].z;
    x3 = geo.vertices[geo.faces[i].c].x;
    y3 = geo.vertices[geo.faces[i].c].y;
    z3 = geo.vertices[geo.faces[i].c].z;

    totalVolume +=
      -x3 * y2 * z1 +
      x2 * y3 * z1 +
      x3 * y1 * z2 -
      x1 * y3 * z2 -
      x2 * y1 * z3 +
      x1 * y2 * z3;

    a = geo.vertices[geo.faces[i].a].distanceTo(geo.vertices[geo.faces[i].b]);
    b = geo.vertices[geo.faces[i].b].distanceTo(geo.vertices[geo.faces[i].c]);
    c = geo.vertices[geo.faces[i].c].distanceTo(geo.vertices[geo.faces[i].a]);
    s = (a + b + c) / 2;
    totalArea += Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  return [Math.abs(totalVolume / 6), totalArea];
}

var link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

if (!Detector.webgl) {
  log("WEB GL NOT AVAILABLE");
}

var scene;
var ringMat;
var container;

var camera, scene, renderer;

var mesh, lightMesh, geometry;
var spheres = [];

var directionalLight, pointLight;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var lastMouseX = 0;
var lastMouseY = 0;

var settings = {
  metalness: 1.0,
  roughness: 0.4,
  ambientIntensity: 1,
  aoMapIntensity: 0.2,
  envMapIntensity: 1.0,
  displacementScale: 2.436143, // from original model
  normalScale: 1.0,
};

document.addEventListener("mousemove", onDocumentMouseMove, false);

var onRenderFcts = [];

init();
animate();

function init() {
  canvas = $("#renderCanvas")[0];

  scene = new THREE.Scene();
  sceneBackground = new THREE.CubeTextureLoader()
    .setPath("textures/skybox5/")
    .load([
      "skybox_px.jpg",
      "skybox_nx.jpg",
      "skybox_py.jpg",
      "skybox_ny.jpg",
      "skybox_pz.jpg",
      "skybox_nz.jpg",
    ]);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(2);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var radius = 20;
  var aspect = 2;
  camera = new THREE.PerspectiveCamera(40, aspect, 1, 1000);
  camera.position.set(-64, 10, 20);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 1.5;
  controls.screenSpacePanning = false;
  controls.minDistance = 68;
  controls.maxDistance = 68;
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;
  controls.enableZoom = false;
  controls.enablePan = false;

  $("#renderCanvas").on("contextmenu", function (e) {
    e.preventDefault();
    return false;
  });

  var textureLoader = new THREE.TextureLoader();
  var normalMap = textureLoader.load("textures/brushed.jpg");

  // lights
  light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.multiplyScalar(1.3);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048 * 2;
  light.shadow.mapSize.height = 2048 * 2;

  var d = 200;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 120;
  light.shadow.camera.near = 1;

  scene.add(light);
  light.position.set(0, 0, 1);

  ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.x = -3000;
  pointLight.position.y = 30;
  pointLight.position.z = -1000;
  scene.add(pointLight);

  pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  pointLight2.position.x = 3000;
  pointLight2.position.y = 30;
  pointLight2.position.z = 1000;
  scene.add(pointLight2);

  // env map

  var path = "textures/skybox4/skybox_";
  var format = ".jpg";
  var urls = [
    path + "px" + format,
    path + "nx" + format,
    path + "py" + format,
    path + "ny" + format,
    path + "pz" + format,
    path + "nz" + format,
  ];

  var reflectionCube = new THREE.CubeTextureLoader().load(urls);

  //log("HERE PLANE");
  plane = new THREE.CylinderGeometry(30, 30, 0.001, 64, 20, false);

  var textureLoader = new THREE.TextureLoader();
  textureLoader.load("textures/plane.png", function (tex) {
    planeMat = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      map: tex,
      transparent: true,
    });
    plane1.material = planeMat;
    scene.add(plane1);
    plane1.receiveShadow = true;
  });
  // material
  var normalLoader = new THREE.TextureLoader();
  ringMat = new THREE.MeshStandardMaterial({
    color: 0xbfbfbf,
    roughness: 0.2,
    metalness: 0.99,
    envMap: reflectionCube,
    envMapIntensity: 1,
    side: THREE.DoubleSide,
    //flatShading: true,
    bumpMap: normalLoader.load("textures/brushed.jpg"),
    bumpScale: 0.005,
  });

  ringMat.bumpMap.rotation = Math.PI / 2;

  var pts = [
    new THREE.Vector3(150, 50, 0), //top left
    new THREE.Vector3(200, 50, 0), //top right
    new THREE.Vector3(200, -50, 0), //bottom right
    new THREE.Vector3(150, -50, 0), //bottom left
    new THREE.Vector3(150, 50, 0), //back to top left - close square path
  ];

  ring = new THREE.Mesh(new THREE.LatheGeometry(pts, 512), ringMat);
  ring.castShadow = true;

  //scene.add(ring);
  //setupRing(currentRingType);
  plane1 = new THREE.Mesh(plane);
  try {
    plane1.position.y = 0 - ringObj.totalHeight;
  } catch (e) {}
  //makeHoles();
}

var tooSlow = 0;
var stopRendering = 0;

function animate() {
  if (stopRendering == 1) {
    return false;
  }
  render();
  requestAnimationFrame(animate);
}

function render() {
  if (stopRendering == 1) {
    log("Rendering...");
  }
  var timer = 0.0001 * Date.now();
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  light.position.copy(camera.position);
  if (stopRendering == 1) {
    log("Rendered...");
  }
}

var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  if (stopRendering == 1) {
    return false;
  }
  //log("requestAnimationFrame")
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  fps = 1000 / deltaMsec;

  //log("fps = "+fps)
  if (fps <= 6) {
    log("Poor performance!");
    tooSlow++;
    if (tooSlow > 1) {
      stopRendering = 1;
      render();
      return false;
    }
  }
  if (fps >= 20) {
    tooSlow--;
  }
  requestAnimationFrame(animate);

  // call each update function
  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000);
  });
  controls.update();
  rotateAboutPoint(
    light,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    0.1 - controls.getPolarAngle()
  );
  //rotateAboutPoint(plane1, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 0-controls.getPolarAngle());
  light.position.y = 50;
  light.target.position.set(0, 0, 0);
});

resizeCanvas();

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

//stats = new Stats();
