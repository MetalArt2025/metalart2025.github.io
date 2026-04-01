function updateShapes() {
  pathV3 = [];
  for (var x = 0; x < ringObj.path.length; x++) {
    pathV3 = pathV3.concat(returnPath(ringObj.path[x]));
  }
  latheTesselation =
    mouseDown === 0
      ? ringObj.latheTesselation.max
      : ringObj.latheTesselation.min;
  //ring.tessellation = latheTesselation;
  //ring = BABYLON.Mesh.CreateLathe(null, pathV3, null, null, ring);
}

function dist(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function getArcData(points) {
  var a = points[0];
  var b = points[2];
  var c = points[1];
  var A = dist(b, c);
  var B = dist(c, a);
  var C = dist(a, b);
  var angle = Math.acos((A * A + B * B - C * C) / (2 * A * B));
  var K = 0.5 * A * B * Math.sin(angle);
  r = (A * B * C) / 4 / K;
  r = Math.round(r * 1000) / 1000;
  circX = points[1][0];
  circY = points[1][1] > points[0][1] ? points[1][1] - r : r + points[1][1];
  start = Math.atan2(points[0][0], circY - points[0][1]) - 90 * (Math.PI / 180);
  end =
    -Math.atan2(circX - points[2][0], circY - points[2][1]) -
    90 * (Math.PI / 180);
  return { circX: circX, circY: circY, r: r, start: start, end: end };
}

function returnPath(path) {
  //doRingChanged();
  pathArr = [];
  switch (path.type) {
    case "line":
      for (y = 0; y < path.coords.length; y++) {
        pathArr.push(
          new THREE.Vector3(
            path.coords[y][0] + ringObj.params.ringInnerWidth.val / 2,
            path.coords[y][1] - ringObj.ringDepth / 2,
            0
          )
        );
        //pathArr.push(new BABYLON.Vector3(path.coords[y][0]+(ringObj.params.ringInnerWidth.val/2), path.coords[y][1]-(ringObj.ringDepth/2), 0));
      }
      break;
    case "curve":
      detail = mouseDown === 0 ? path.detail.max : path.detail.min;
      bezier = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(
          path.coords[0][0] + ringObj.params.ringInnerWidth.val / 2,
          path.coords[0][1] - ringObj.ringDepth / 2,
          0
        ),
        new THREE.Vector3(
          path.coords[1][0] + ringObj.params.ringInnerWidth.val / 2,
          path.coords[1][1] - ringObj.ringDepth / 2,
          0
        ),
        new THREE.Vector3(
          path.coords[2][0] + ringObj.params.ringInnerWidth.val / 2,
          path.coords[2][1] - ringObj.ringDepth / 2,
          0
        ),
        detail
      );
      pathArr = bezier.getPoints();
      //console.log(pathArr)
      break;
    case "quart":
      detail = mouseDown === 0 ? path.detail.max : path.detail.min;
      switch (path.position) {
        case "TL":
          start = 180 * (Math.PI / 180);
          end = 90 * (Math.PI / 180);
          break;
        case "TR":
          start = 90 * (Math.PI / 180);
          end = 0 * (Math.PI / 180);
          break;
        case "BL":
          start = 270 * (Math.PI / 180);
          end = 180 * (Math.PI / 180);
          break;
        case "BR":
          start = 360 * (Math.PI / 180);
          end = 270 * (Math.PI / 180);
          break;
      }
      var curve = new THREE.EllipseCurve(
        path.coords[0][1] - ringObj.ringDepth / 2,
        path.coords[0][0] + ringObj.params.ringInnerWidth.val / 2,
        path.radius,
        path.radius,
        start,
        end,
        true
      );
      points = curve.getPoints(detail);
      geometry = new THREE.Geometry().setFromPoints(points);
      pathArr = [];
      for (var x = 0; x < points.length; x++) {
        pathArr.push(new THREE.Vector3(points[x].y, points[x].x, 0));
      }
      var material = new THREE.LineBasicMaterial({ color: 0xffffff });
      var line = new THREE.Line(geometry, material);
      //if(scene){scene.add(line);}
      //pathArr = [];
      break;
    case "arc":
      detail = mouseDown === 0 ? path.detail.max : path.detail.min;
      pc = [];
      pc.push([
        path.coords[0][1] - ringObj.ringDepth / 2,
        path.coords[0][0] + ringObj.params.ringInnerWidth.val / 2,
      ]);
      pc.push([
        path.coords[1][1] - ringObj.ringDepth / 2,
        path.coords[1][0] + ringObj.params.ringInnerWidth.val / 2,
      ]);
      pc.push([
        path.coords[2][1] - ringObj.ringDepth / 2,
        path.coords[2][0] + ringObj.params.ringInnerWidth.val / 2,
      ]);
      c = getArcData(pc);
      //drawPoints(pc)
      var curve = new THREE.EllipseCurve(
        c.circX,
        c.circY,
        c.r,
        c.r,
        c.start,
        c.end,
        path.clock
      );
      points = curve.getPoints(detail);
      geometry = new THREE.Geometry().setFromPoints(points);
      pathArr = [];

      for (var x = 0; x < points.length; x++) {
        pathArr.push(new THREE.Vector3(points[x].y, points[x].x, 0));
      }

      //console.log(path);
      //console.log(pathArr)
      var material = new THREE.LineBasicMaterial({ color: 0xffffff });
      var line = new THREE.Line(geometry, material);
      //if(scene){scene.add(line);}
      //pathArr = [];
      break;
    case "ellipse":
      detail = mouseDown === 0 ? path.detail.max : path.detail.min;
      //drawPoints(pc)
      var curve = new THREE.EllipseCurve(
        0,
        path.coords[0],
        path.coords[2],
        path.coords[1],
        0,
        2 * Math.PI,
        true,
        0
      );
      points = curve.getPoints(detail);
      geometry = new THREE.Geometry().setFromPoints(points);
      pathArr = [];

      for (var x = 0; x < points.length; x++) {
        pathArr.push(new THREE.Vector3(points[x].y, points[x].x, 0));
      }

      //console.log(path);
      //console.log(pathArr)
      var material = new THREE.LineBasicMaterial({ color: 0xffffff });
      var line = new THREE.Line(geometry, material);
      //if(scene){scene.add(line);}
      //pathArr = [];
      break;
  }
  return pathArr;
}

var pointCount = 0;

function drawPoints(arr) {
  for (dp = 0; dp < 3; dp++) {
    if (scene) {
      var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var cube = new THREE.Mesh(geometry, material);
      cube.position.x = arr[dp][0];
      cube.position.y = arr[dp][1];
      scene.add(cube);
      pointCount++;
    }
  }
}

function returnShapes(high) {
  //console.log(123)
  clearCanvas2();
  ringObj.updateRingPath();
  pathV3 = [];

  for (var x = 0; x < ringObj.path.length; x++) {
    if (ringObj.path[x].type == "line") {
      //console.log(returnPath(ringObj.path[x]))
    }
    pathV3 = pathV3.concat(returnPath(ringObj.path[x]));
  }

  latheTesselation =
    mouseDown === 0
      ? ringObj.latheTesselation.max
      : ringObj.latheTesselation.min;
  if (high != undefined) {
    latheTesselation = 512;
  }
  //prompt("", JSON.stringify(pathV3))
  //scene.remove(ring);
  if (ring && spinRing == 1) {
    rry = ring.rotation.y;
    visible = ring.visible;
    scene.remove(ring);
  }

  if (scene) {
    ring = new THREE.Mesh(
      new THREE.LatheGeometry(pathV3, latheTesselation),
      ringMat
    );
    ring.castShadow = true;
    //ring.overdraw = true;
    //ring.doubleSided = true;
    //ring.geometry.translate(0, 0+(ringObj.ringDepth/2), 0 );

    scene.add(ring);
    ring.visible = visible;
    ring.rotateZ(Math.PI / 2);
    ring.rotation.y = rry;
    if (ringObj.type == "curved") {
      ring.geometry.computeVertexNormals();
      //ring.geometry.mergeVertices();
      //ring.geometry.computeVertexNormals();
    }
  }
  //prompt("", JSON.stringify(pathV3))

  if (plane1) {
    plane1.position.y = 0 - ringObj.totalHeight;
  }

  canvasPaths = [];
  for (x = 0; x < ringObj.path.length; x++) {
    canvasPaths.push(ringObj.path[x]);
  }
  drawCanvasPath(canvasPaths);
}

var ringObj;
getMax = function (statement) {
  //console.log(statement);
  return 1;
};
ringsObj = [
  {
    //RING 1
    params: {
      ringInnerWidth: {
        val: 20,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal"],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringEdgeCurve"],
        pathArr: [0, 1, 3, 4, 5, 7],
      },
      ringDepth: {
        val: 5,
        min: [1, 1, 1, 1, 1],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        pathArr: [1, 2, 3, 5, 6, 7],
      },
      ringEdgeCurve: {
        val: 0.5,
        min: [0, 0, 0, 0, 0],
        max: [2, 0.5, 0.5, 0.5, 0.5],
        maxOriginal: [2, 0.5, 0.5, 0.5, 0.5],
        step: 0.5,
        newMax: function () {
          return ringObj.params.ringHeightVal.val / 2 <
            ringObj.params.ringEdgeCurve.maxOriginal[getMaterialIndex()]
            ? (ringObj.params.ringHeightVal.val / 2).toFixed(2)
            : ringObj.params.ringEdgeCurve.maxOriginal[
                getMaterialIndex()
              ].toFixed(1);
        },
        label: ["Edge Curve", "Afronding"],
        range: false,
        pathArr: [1, 3, 5, 7],
      },
    },
    latheTesselation: { min: 64, max: 128 },
    newMax: function (val) {
      return val / 2;
    },
    flattenMesh: true,
    updateRingPath: function () {
      ringEdgeCurve = ringObj.params.ringEdgeCurve.val + 0.1;
      ringObj.path = [
        {
          type: "line",
          coords: [
            [0 + ringEdgeCurve, 0],
            [ringObj.params.ringHeightVal.val - ringEdgeCurve, 0],
          ],
        },
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringEdgeCurve,
              0 + ringEdgeCurve,
            ],
          ],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "TL",
        },
        {
          type: "line",
          coords: [
            [ringObj.params.ringHeightVal.val, 0 + ringEdgeCurve],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepth.val - ringEdgeCurve,
            ],
          ],
        },
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringEdgeCurve,
              ringObj.params.ringDepth.val - ringEdgeCurve,
            ],
          ],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "TR",
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringEdgeCurve,
              ringObj.params.ringDepth.val,
            ],
            [0 + ringEdgeCurve, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "quart",
          coords: [
            [0 + ringEdgeCurve, ringObj.params.ringDepth.val - ringEdgeCurve],
          ],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "BR",
        },
        {
          type: "line",
          coords: [
            [0, ringObj.params.ringDepth.val - ringEdgeCurve],
            [0, 0 + ringEdgeCurve],
          ],
        },
        {
          type: "quart",
          coords: [[0 + ringEdgeCurve, 0 + ringEdgeCurve]],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "BL",
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight = Math.floor(ringObj.params.ringHeightVal.val * svgScale) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "curved";
      //ringObj.shapePrice = 5;
      ringObj.shapePrice = pricesObj.shapes[0] / 1;
    },
  },

  {
    //RING 2
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal", "ringInnerCurveHeight"],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringInnerCurveHeight", "ringEdgeCurve"],
        pathArr: [0, 1, 3, 4, 5],
      },
      ringDepth: {
        val: 5,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        affects: ["ringInnerCurveHeight", "ringEdgeCurve"],
        pathArr: [1, 2, 3, 5, 6],
      },
      ringInnerCurveHeight: {
        val: 1,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [1.5, 1.5, 1.5, 1.5, 1.5],
        maxOriginal: [1.5, 1.5, 1.5, 1.5, 1.5],
        affects: ["ringEdgeCurve"],
        newMax: function () {
          max1 =
            ringObj.params.ringHeightVal.val -
            ringObj.params.ringEdgeCurve.val -
            0.1;
          max2 = ringObj.params.ringDepth.val / 2;
          return max2 > max1 ? max1.toFixed(2) : max2.toFixed(2);
        },
        label: ["Inner Curve", "Binnen Bolling"],
        pathArr: [5, 6],
      },
      ringEdgeCurve: {
        val: 0.1,
        min: [0, 0, 0, 0, 0],
        max: [0.5, 0.5, 0.5, 0.5, 0.5],
        label: ["Edge Curve", "Afronding"],
        affects: ["ringInnerCurveHeight"],
        maxOriginal: [0.5, 0.5, 0.5, 0.5, 0.5],
        newMax: function () {
          max =
            ringObj.params.ringHeightVal.val -
            ringObj.params.ringInnerCurveHeight.val;
          max -= 0.1;
          //console.log(max)
          if (
            max < ringObj.params.ringEdgeCurve.maxOriginal[getMaterialIndex()]
          ) {
            return max.toFixed(2);
          } else {
            return ringObj.params.ringEdgeCurve.maxOriginal[getMaterialIndex()];
          }
        },
        pathArr: [1, 3],
      },
    },
    latheTesselation: { min: 64, max: 128 },
    flattenMesh: true,
    updateRingPath: function () {
      ringEdgeCurve = ringObj.params.ringEdgeCurve.val + 0.1;
      if (
        ringObj.params.ringHeightVal.val -
          ringObj.params.ringInnerCurveHeight.val ==
        0
      ) {
        ringEdgeCurve = 0;
      }
      ringObj.path = [
        {
          type: "line",
          coords: [
            [ringObj.params.ringInnerCurveHeight.val, 0],
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val) -
                ringEdgeCurve,
              0,
            ],
          ],
        },
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val) -
                ringEdgeCurve,
              0 + ringEdgeCurve,
            ],
          ],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "TL",
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val),
              ringEdgeCurve,
            ],
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val),
              ringObj.params.ringDepth.val - ringEdgeCurve,
            ],
          ],
        },
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val) -
                ringEdgeCurve,
              ringObj.params.ringDepth.val - ringEdgeCurve,
            ],
          ],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "TR",
        },

        {
          type: "line",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val) -
                ringEdgeCurve,
              ringObj.params.ringDepth.val,
            ],
            [
              ringObj.params.ringInnerCurveHeight.val,
              ringObj.params.ringDepth.val,
            ],
          ],
        },
        {
          type: "arc",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val,
              ringObj.params.ringDepth.val,
            ],
            [0, ringObj.params.ringDepth.val / 2],
            [ringObj.params.ringInnerCurveHeight.val, 0],
          ],
          detail: { min: 4, max: 8 },
          clock: true,
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.floor(
          (ringObj.params.ringInnerCurveHeight.val +
            ringObj.params.ringHeightVal.val) *
            svgScale
        ) + 4;
      //ringObj.totalHeight = (ringObj.params.ringInnerWidth.val/2)+ringObj.params.ringHeightVal.val+ringObj.params.ringInnerCurveHeight.val;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringInnerCurveHeight.val +
        (ringObj.params.ringHeightVal.val -
          ringObj.params.ringInnerCurveHeight.val);
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = [
        "ringInnerWidth",
        "ringHeightVal",
        "ringInnerCurveHeight",
      ];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 15;
      ringObj.shapePrice = pricesObj.shapes[1] / 1;
    },
  },
  {
    //RING 3
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: [
          "ringHeightVal",
          "ringInnerCurveHeight",
          "ringOuterCurveHeight",
        ],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringInnerCurveHeight", "ringOuterCurveHeight"],
        pathArr: [0, 1, 2, 3],
      },
      ringDepth: {
        val: 5,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        pathArr: [1, 3],
      },
      ringInnerCurveHeight: {
        val: 0.5,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [1, 1, 1, 1, 1],
        maxOriginal: [1, 1, 1, 1, 1],
        affects: ["ringOuterCurveHeight"],
        newMax: function () {
          ringCurveMax1 =
            ringObj.params.ringHeightVal.val -
            ringObj.params.ringOuterCurveHeight.val;
          if (ringCurveMax1 < 0.1) {
            ringCurveMax1 = 0.1;
          }
          return ringCurveMax1 <
            ringObj.params.ringInnerCurveHeight.maxOriginal[getMaterialIndex()]
            ? ringCurveMax1
            : ringObj.params.ringInnerCurveHeight.maxOriginal[
                getMaterialIndex()
              ];
        },
        label: ["Inner Curve", "Binnen Bolling"],
        parentDepend: "ringHeightVal",
        pathArr: [3],
      },
      ringOuterCurveHeight: {
        val: 0.5,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [1, 1, 1, 1, 1],
        maxOriginal: [1, 1, 1, 1, 1],
        affects: ["ringInnerCurveHeight"],
        newMax: function () {
          ringCurveMax2 =
            ringObj.params.ringHeightVal.val -
            ringObj.params.ringInnerCurveHeight.val;
          if (ringCurveMax2 < 0.1) {
            ringCurveMax2 = 0.1;
          }
          return ringCurveMax2 <
            ringObj.params.ringOuterCurveHeight.maxOriginal[getMaterialIndex()]
            ? ringCurveMax2
            : ringObj.params.ringOuterCurveHeight.maxOriginal[
                getMaterialIndex()
              ];
        },
        label: ["Outer Curve", "Buiten Bolling"],
        parentDepend: "ringHeightVal",
        pathArr: [1],
      },
    },
    latheTesselation: { min: 64, max: 256 },
    flattenMesh: true,
    updateRingPath: function () {
      ringObj.path = [
        {
          type: "line",
          coords: [
            [ringObj.params.ringInnerCurveHeight.val, 0],
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val -
                  ringObj.params.ringOuterCurveHeight.val),
              0,
            ],
          ],
        },
        {
          type: "arc",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val -
                  ringObj.params.ringOuterCurveHeight.val),
              0,
            ],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepth.val / 2,
            ],
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val -
                  ringObj.params.ringOuterCurveHeight.val),
              ringObj.params.ringDepth.val,
            ],
          ],
          detail: { min: 4, max: 16 },
          clock: true,
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringInnerCurveHeight.val -
                  ringObj.params.ringOuterCurveHeight.val),
              ringObj.params.ringDepth.val,
            ],
            [
              ringObj.params.ringInnerCurveHeight.val,
              ringObj.params.ringDepth.val,
            ],
          ],
        },
        {
          type: "arc",
          coords: [
            [
              ringObj.params.ringInnerCurveHeight.val,
              ringObj.params.ringDepth.val,
            ],
            [0, ringObj.params.ringDepth.val / 2],
            [ringObj.params.ringInnerCurveHeight.val, 0],
          ],
          detail: { min: 4, max: 16 },
          clock: true,
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.floor(
          (ringObj.params.ringInnerCurveHeight.val +
            ringObj.params.ringHeightVal.val +
            ringObj.params.ringOuterCurveHeight.val) *
            svgScale
        ) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = [
        "ringInnerWidth",
        "ringHeightVal",
        "ringInnerCurveHeight",
        "ringOuterCurveHeight",
      ];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 10;
      ringObj.shapePrice = pricesObj.shapes[2] / 1;
    },
  },
  {
    //RING 4
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal", "ringInnerCurveHeight"],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringInnerCurveHeight", "ringEdgeCurve"],
        pathArr: [0, 1, 3, 4, 5],
      },
      ringDepth: {
        val: 5,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        affects: ["ringInnerCurveHeight", "ringEdgeCurve"],
        pathArr: [1, 2, 3, 5, 6],
      },
      ringInnerCurveHeight: {
        val: 1,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [1.5, 1.5, 1.5, 1.5, 1.5],
        maxOriginal: [1.5, 1.5, 1.5, 1.5, 1.5],
        affects: ["ringEdgeCurve"],
        newMax: function () {
          max1 =
            ringObj.params.ringHeightVal.val -
            ringObj.params.ringEdgeCurve.val -
            0.1;
          max2 = ringObj.params.ringDepth.val / 2;
          return max2 > max1 ? max1.toFixed(2) : max2.toFixed(2);
        },
        label: ["Outer Curve", "Buiten Bolling"],
        pathArr: [5, 6],
      },
      ringEdgeCurve: {
        val: 0.1,
        min: [0, 0, 0, 0, 0],
        max: [0.5, 0.5, 0.5, 0.5, 0.5],
        label: ["Edge Curve", "Afronding"],
        affects: ["ringInnerCurveHeight"],
        maxOriginal: [0.5, 0.5, 0.5, 0.5, 0.5],
        newMax: function () {
          max =
            ringObj.params.ringHeightVal.val -
            ringObj.params.ringInnerCurveHeight.val;
          max -= 0.1;
          //console.log(max)
          if (
            max < ringObj.params.ringEdgeCurve.maxOriginal[getMaterialIndex()]
          ) {
            return max.toFixed(2);
          } else {
            return ringObj.params.ringEdgeCurve.maxOriginal[getMaterialIndex()];
          }
        },
        pathArr: [1, 3],
      },
    },
    latheTesselation: { min: 64, max: 128 },
    flattenMesh: true,
    updateRingPath: function () {
      ringEdgeCurve = ringObj.params.ringEdgeCurve.val + 0.1;
      if (
        ringObj.params.ringHeightVal.val -
          ringObj.params.ringInnerCurveHeight.val ==
        0
      ) {
        ringEdgeCurve = 0;
      }
      ringObj.path = [
        {
          type: "line",
          coords: [
            [0 + ringEdgeCurve, 0],
            [
              ringObj.params.ringHeightVal.val -
                ringObj.params.ringInnerCurveHeight.val,
              0,
            ],
          ],
        },
        {
          type: "arc",
          coords: [
            [
              ringObj.params.ringHeightVal.val -
                ringObj.params.ringInnerCurveHeight.val,
              0,
            ],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepth.val / 2,
            ],
            [
              ringObj.params.ringHeightVal.val -
                ringObj.params.ringInnerCurveHeight.val,
              ringObj.params.ringDepth.val,
            ],
          ],
          detail: { min: 4, max: 8 },
          clock: true,
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val -
                ringObj.params.ringInnerCurveHeight.val,
              ringObj.params.ringDepth.val,
            ],
            [0 + ringEdgeCurve, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "quart",
          coords: [
            [0 + ringEdgeCurve, ringObj.params.ringDepth.val - ringEdgeCurve],
          ],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "BR",
        },
        {
          type: "line",
          coords: [
            [0, ringObj.params.ringDepth.val - ringEdgeCurve],
            [0, 0 + ringEdgeCurve],
          ],
        },
        {
          type: "quart",
          coords: [[0 + ringEdgeCurve, 0 + ringEdgeCurve]],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "BL",
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.floor(
          (ringObj.params.ringInnerCurveHeight.val +
            ringObj.params.ringHeightVal.val) *
            svgScale
        ) + 4;
      //ringObj.totalHeight = (ringObj.params.ringInnerWidth.val/2)+ringObj.params.ringHeightVal.val+ringObj.params.ringInnerCurveHeight.val;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringInnerCurveHeight.val +
        (ringObj.params.ringHeightVal.val -
          ringObj.params.ringInnerCurveHeight.val);
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = [
        "ringInnerWidth",
        "ringHeightVal",
        "ringInnerCurveHeight",
      ];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 15;
      ringObj.shapePrice = pricesObj.shapes[3] / 1;
    },
  },
  {
    //RING  5
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal"],
      },
      ringHeightVal: {
        val: 1,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [2.5, 2.5, 2.5, 2.5, 2.5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        pathArr: [0, 1, 6],
      },
      ringDepth: {
        val: 3,
        min: [2, 2, 2, 2, 2],
        max: [12, 12, 12, 12, 12],
        label: ["Depth", "Breedte"],
        pathArr: [1, 2, 4, 5, 6],
      },
    },
    latheTesselation: { min: 64, max: 128 },
    newMax: function (val) {
      return val;
    },
    flattenMesh: true,
    updateRingPath: function () {
      ringObj.path = [
        {
          type: "ellipse",
          coords: [
            ringObj.params.ringInnerWidth.val / 2,
            ringObj.params.ringHeightVal.val / 2,
            ringObj.params.ringDepth.val / 2,
          ],
          detail: { min: 65, max: 128 },
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight = Math.floor(ringObj.params.ringHeightVal.val * svgScale) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "curved";
      //ringObj.shapePrice = 15+5;
      ringObj.shapePrice = pricesObj.shapes[4] / 1;
    },
  },
  {
    //RING  6
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal", "ringOuter"],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringOuter", "ringEdgeCurve"],
        pathArr: [0, 1, 6],
      },
      ringDepth: {
        val: 5,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        pathArr: [1, 2, 4, 5, 6],
      },
      ringOuter: {
        val: 1,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [2, 2, 2, 2],
        maxOriginal: [4, 4, 4, 4, 4],
        newMax: function () {
          return ringObj.params.ringHeightVal.val <
            ringObj.params.ringOuter.maxOriginal[getMaterialIndex()]
            ? (ringObj.params.ringHeightVal.val - 0.2).toFixed(1)
            : ringObj.params.ringOuter.maxOriginal[getMaterialIndex()].toFixed(
                1
              );
        },
        label: ["Outer Curve", "Diepte van de hoeken"],
        affects: ["ringEdgeCurve"],
        range: false,
        pathArr: [1, 2],
      },
      ringEdgeCurve: {
        val: 0.5,
        min: [0, 0, 0, 0, 0],
        max: [0.5, 0.5, 0.5, 0.5, 0.5],
        maxOriginal: [0.5, 0.5, 0.5, 0.5, 0.5],
        newMax: function () {
          return ringObj.params.ringHeightVal.val -
            ringObj.params.ringOuter.val <
            ringObj.params.ringEdgeCurve.maxOriginal[getMaterialIndex()]
            ? (
                ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val
              ).toFixed(1)
            : ringObj.params.ringEdgeCurve.maxOriginal[
                getMaterialIndex()
              ].toFixed(1);
        },
        label: ["Edge Curve", "Afronding"],
        range: false,
        pathArr: [4, 6],
      },
    },
    latheTesselation: { min: 64, max: 128 },
    newMax: function (val) {
      return val;
    },
    flattenMesh: true,
    updateRingPath: function () {
      ringEdgeCurve = ringObj.params.ringEdgeCurve.val + 0.1;
      ringObj.path = [
        {
          type: "line",
          coords: [
            [0 + ringEdgeCurve, 0],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              0,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              0,
            ],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepth.val / 2,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepth.val / 2,
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepth.val,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepth.val,
            ],
            [0 + ringEdgeCurve, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "quart",
          coords: [
            [0 + ringEdgeCurve, ringObj.params.ringDepth.val - ringEdgeCurve],
          ],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "BR",
        },
        {
          type: "line",
          coords: [
            [0, ringObj.params.ringDepth.val - ringEdgeCurve],
            [0, 0 + ringEdgeCurve],
          ],
        },
        {
          type: "quart",
          coords: [[0 + ringEdgeCurve, 0 + ringEdgeCurve]],
          detail: { min: 4, max: 8 },
          radius: ringEdgeCurve,
          position: "BL",
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.round(
          (ringObj.params.ringHeightVal.val + ringObj.params.ringOuter.val) *
            svgScale
        ) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 15;
      ringObj.shapePrice = pricesObj.shapes[5] / 1;
    },
  },
  {
    //RING 7
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal", "ringOuter"],
      },
      ringHeightVal: {
        val: 2.5,
        min: [1, 1, 1, 1, 1],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringOuter"],
        pathArr: [0],
      },
      ringDepth: {
        val: 6,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        affects: ["ringDepthPosition"],
        pathArr: [1, 3, 5],
      },
      ringDepthPosition: {
        val: 3,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [14.9, 14.9, 14.9, 14.9, 9.9],
        maxOriginal: [14.9, 14.9, 14.9, 14.9, 9.9],
        label: ["Depths", "Plaatsing van de rand"],
        newMax: function () {
          return (ringObj.params.ringDepth.val - 0.5).toFixed(1);
        },
        range: false,
        spacing: 1,
        pathArr: [1],
      },
      ringOuter: {
        val: 1,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [2.1, 2.1, 2.1, 2.1, 2.1],
        maxOriginal: [2.1, 2.1, 2.1, 2.1, 2.1],
        label: ["Outer", "Diepte van de trap"],
        newMax: function () {
          max = (ringObj.params.ringHeightVal.val - 0.5).toFixed(1);
          //ringObj.params.ringOuter.maxOriginal[getMaterialIndex()]).toFixed(1);
          return max;
        },
        parentDepend: "ringInnerWidth",
        pathArr: [2],
      },
    },
    //newMax:function(val){return val;},
    latheTesselation: { min: 256, max: 512 },
    flattenMesh: true,
    updateRingPath: function () {
      ringObj.path = [
        {
          type: "line",
          coords: [
            [0, 0],
            [ringObj.params.ringHeightVal.val, 0],
          ],
        },
        {
          type: "line",
          coords: [
            [ringObj.params.ringHeightVal.val, 0],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepthPosition.val,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepthPosition.val,
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepthPosition.val,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepthPosition.val,
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepth.val,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepth.val,
            ],
            [0, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "line",
          coords: [
            [0, ringObj.params.ringDepth.val],
            [0, 0],
          ],
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.floor(
          (ringObj.params.ringHeightVal.val +
            ringObj.params.ringHeightVal.val) *
            svgScale
        ) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 15;
      ringObj.shapePrice = pricesObj.shapes[6] / 1;
    },
  },
  {
    //RING 8
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal", "ringOuter"],
      },
      ringHeightVal: {
        val: 2,
        min: [1, 1, 1, 1, 1],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringOuter"],
        pathArr: [0, 6],
      },
      ringDepth: {
        val: 6,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        affects: ["ringDepths"],
        pathArr: [1, 3, 5, 7],
      },
      ringDepths: {
        values: [2, 4],
        min: [0.4, 0.4, 0.4, 0.4, 0.4],
        max: [14.9, 14.9, 14.9, 14.9, 9.9],
        maxOriginal: [14.9, 14.9, 14.9, 14.9, 9.9],
        label: ["Depths", "Plaatsing van de randen"],
        newMax: function () {
          return (ringObj.params.ringDepth.val - 0.5).toFixed(1);
        },
        range: true,
        spacing: 5,
        pathArr: [1, 5],
      },
      ringOuter: {
        val: 1,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [2, 2, 2, 2, 2],
        maxOriginal: [2, 2, 2, 2, 2],
        label: ["Outer", "Diepte van de groef"],
        newMax: function () {
          if (
            ringObj.params.ringOuter.maxOriginal[getMaterialIndex()] <
            ringObj.params.ringHeightVal.val - 0.5
          ) {
            return ringObj.params.ringOuter.maxOriginal[getMaterialIndex()];
          } else {
            return ringObj.params.ringHeightVal.val - 0.5;
          } // ? ringObj.params.ringDepths.maxOriginal.toFixed(1) : (ringObj.params.ringHeightVal.val-0.5).toFixed(1);
        },
        parentDepend: "ringInnerWidth",
        pathArr: [2, 4],
      },
    },
    //newMax:function(val){return val;},
    latheTesselation: { min: 256, max: 512 },
    flattenMesh: true,
    updateRingPath: function () {
      ringObj.path = [
        {
          type: "line",
          coords: [
            [0, 0],
            [ringObj.params.ringHeightVal.val, 0],
          ],
        },
        {
          type: "line",
          coords: [
            [ringObj.params.ringHeightVal.val, 0],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[0],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[0],
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[0],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[0],
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[1],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[1],
            ],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[1],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[1],
            ],
            [ringObj.params.ringHeightVal.val, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "line",
          coords: [
            [ringObj.params.ringHeightVal.val, ringObj.params.ringDepth.val],
            [0, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "line",
          coords: [
            [0, ringObj.params.ringDepth.val],
            [0, 0],
          ],
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.floor(
          (ringObj.params.ringHeightVal.val +
            ringObj.params.ringHeightVal.val) *
            svgScale
        ) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 15;
      ringObj.shapePrice = pricesObj.shapes[7] / 1;
    },
  },
  {
    //RING 9
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal", "ringOuter"],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringOuter"],
        pathArr: [0, 2, 4, 6],
      },
      ringDepth: {
        val: 6,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        affects: ["ringDepths"],
        pathArr: [1, 3, 5, 7],
      },
      ringDepths: {
        values: [2, 4],
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [14.9, 14.9, 14.9, 14.9, 9.9],
        maxOriginal: [14.9, 14.9, 14.9, 14.9, 9.9],
        label: ["Depths", "Plaatsing van de verlaging"],
        newMax: function () {
          return (ringObj.params.ringDepth.val - 0.5).toFixed(1);
        },
        range: true,
        spacing: 5,
        pathArr: [1, 5],
      },
      ringOuter: {
        val: 1,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [1.9, 1.9, 1.9, 1.9, 1.9],
        maxOriginal: [4, 4, 4, 4, 4],
        label: ["Outer", "Diepte van de trap"],
        newMax: function () {
          max = ringObj.params.ringHeightVal.val - 0.5;
          return max.toFixed(1);
          //(ringObj.params.ringOuter.maxOriginal[getMaterialIndex()]).toFixed(1);
        },
        parentDepend: "ringInnerWidth",
        pathArr: [2, 4],
      },
    },
    newMax: function (val) {
      return val;
    },
    latheTesselation: { min: 256, max: 512 },
    flattenMesh: true,
    updateRingPath: function () {
      fullRingHeight =
        ringObj.params.ringHeightVal.val + ringObj.params.ringOuter.val;
      //if(ringObj.params.ringDepths.values[0] == 0){fullRingHeight = ringObj.params.ringHeightVal.val;}
      ringObj.path = [
        {
          type: "line",
          coords: [
            [0, 0],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              0,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              0,
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[0],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[0],
            ],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[0],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[0],
            ],
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[1],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val,
              ringObj.params.ringDepths.values[1],
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[1],
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepths.values[1],
            ],
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepth.val,
            ],
          ],
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringObj.params.ringOuter.val,
              ringObj.params.ringDepth.val,
            ],
            [0, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "line",
          coords: [
            [0, ringObj.params.ringDepth.val],
            [0, 0],
          ],
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.floor(
          (ringObj.params.ringHeightVal.val +
            ringObj.params.ringHeightVal.val +
            ringObj.params.ringOuter.val) *
            svgScale
        ) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 15;
      ringObj.shapePrice = pricesObj.shapes[8] / 1;
    },
  },
  {
    //RING 10
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal", "ringCurve"],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        parentDepend: "ringInnerWidth",
        affects: ["ringCurve"],
        pathArr: [0, 3, 4, 5],
      },
      ringDepth: {
        val: 6,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        pathArr: [1, 3],
      },
      ringCurve: {
        val: 0.3,
        min: [0.1, 0.1, 0.1, 0.1, 0.1],
        max: [1, 1, 1, 1, 1],
        maxOriginal: [1, 1, 1, 1, 1],
        newMax: function () {
          max = (ringObj.params.ringHeightVal.val / 2).toFixed(2);
          if (max < 0.1) {
            max = 0.1;
          }
          if (max > ringObj.params.ringCurve.max[getMaterialIndex()]) {
            max = ringObj.params.ringCurve.maxOriginal[getMaterialIndex()];
          }
          return max;
        },
        label: ["Curve", "Ring Curve"],
        parentDepend: "ringInnerWidth",
        pathArr: [1, 3],
      },
    },
    latheTesselation: { min: 64, max: 256 },
    flattenMesh: false,
    updateRingPath: function () {
      ringObj.path = [
        {
          type: "line",
          coords: [
            [ringObj.params.ringCurve.val, 0],
            [
              ringObj.params.ringCurve.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringCurve.val),
              0,
            ],
          ],
        },
        {
          type: "arc",
          coords: [
            [
              ringObj.params.ringCurve.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringCurve.val),
              0,
            ],
            [
              ringObj.params.ringCurve.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringCurve.val) -
                ringObj.params.ringCurve.val,
              ringObj.params.ringDepth.val / 2,
            ],
            [
              ringObj.params.ringCurve.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringCurve.val),
              ringObj.params.ringDepth.val,
            ],
          ],
          detail: { min: 8, max: 32 },
          clock: false,
        },
        {
          type: "line",
          coords: [
            [
              ringObj.params.ringCurve.val +
                (ringObj.params.ringHeightVal.val -
                  ringObj.params.ringCurve.val),
              ringObj.params.ringDepth.val,
            ],
            [ringObj.params.ringCurve.val, ringObj.params.ringDepth.val],
          ],
        },
        {
          type: "arc",
          coords: [
            [ringObj.params.ringCurve.val, ringObj.params.ringDepth.val],
            [
              ringObj.params.ringCurve.val - ringObj.params.ringCurve.val,
              ringObj.params.ringDepth.val / 2,
            ],
            [ringObj.params.ringCurve.val, 0],
          ],
          detail: { min: 8, max: 32 },
          clock: true,
        },
      ];
      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight =
        Math.floor(
          (ringObj.params.ringHeightVal.val + ringObj.params.ringCurve.val) *
            svgScale
        ) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal", "ringCurve"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "flat";
      //ringObj.shapePrice = 20+5;
      ringObj.shapePrice = pricesObj.shapes[9] / 1;
    },
  },
  {
    //RING 11
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringHeightVal"],
      },
      ringHeightVal: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [5, 5, 5, 5, 5],
        label: ["Height", "Dikte"],
        affects: ["ringCurveBL", "ringCurveBR", "ringCurveTR", "ringCurveTL"],
        parentDepend: "ringInnerWidth",
        pathArr: [0, 1, 3, 4, 5, 7],
      },
      ringDepth: {
        val: 6,
        min: [2, 2, 2, 2, 2],
        max: [15, 15, 15, 15, 10],
        label: ["Depth", "Breedte"],
        pathArr: [1, 2, 3, 5, 6, 7],
      },
      ringCurveBL: {
        val: 1.0,
        min: [0, 0, 0, 0, 0],
        max: [2, 2, 2, 2, 2],
        maxOriginal: [2, 2, 2, 2, 2],
        step: 0.5,
        label: ["Curve BL", "Ronding Links Buiten"],
        groupName: "ringCurve",
        parentDepend: "ringHeightVal",
        newMax: function () {
          max = ringObj.params.ringHeightVal.val / 2;
          if (
            max > ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()]
          ) {
            max = ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()];
          }
          return max;
        },
        pathArr: [1],
        pathArr2: [1, 3, 5, 7],
      },
      ringCurveBR: {
        val: 1.0,
        min: [0, 0, 0, 0, 0],
        max: [2, 2, 2, 2, 2],
        maxOriginal: [2, 2, 2, 2, 2],
        step: 0.5,
        label: ["Curve BR", "Ronding Rechts Buiten"],
        groupName: "ringCurve",
        parentDepend: "ringHeightVal",
        newMax: function () {
          max = ringObj.params.ringHeightVal.val / 2;
          if (
            max > ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()]
          ) {
            max = ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()];
          }
          return max;
        },
        pathArr: [3],
        pathArr2: [1, 3, 5, 7],
      },
      ringCurveTL: {
        val: 1.0,
        min: [0, 0, 0, 0, 0],
        max: [2, 2, 2, 2, 2],
        maxOriginal: [2, 2, 2, 2, 2],
        step: 0.5,
        label: ["Curve TL", "Ronding Rechts Binnen"],
        groupName: "ringCurve",
        parentDepend: "ringHeightVal",
        newMax: function () {
          max = ringObj.params.ringHeightVal.val / 2;
          if (
            max > ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()]
          ) {
            max = ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()];
          }
          return max;
        },
        pathArr: [5],
        pathArr2: [1, 3, 5, 7],
      },
      ringCurveTR: {
        val: 1.0,
        min: [0, 0, 0, 0, 0],
        max: [2, 2, 2, 2, 2],
        maxOriginal: [2, 2, 2, 2, 2],
        step: 0.5,
        label: ["Curve TR", "Ronding Links Binnen"],
        groupName: "ringCurve",
        parentDepend: "ringHeightVal",
        newMax: function () {
          max = ringObj.params.ringHeightVal.val / 2;
          if (
            max > ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()]
          ) {
            max = ringObj.params.ringCurveBL.maxOriginal[getMaterialIndex()];
          }
          return max;
        },
        pathArr: [7],
        pathArr2: [1, 3, 5, 7],
      },
    },
    newMax: function (val) {
      return val / 2;
    },
    ringCurve: {
      group: ["ringCurveBL", "ringCurveBR", "ringCurveTR", "ringCurveTL"],
      grouped: 0,
    },
    latheTesselation: { min: 64, max: 256 },
    flattenMesh: true,
    updateRingPath: function () {
      ringCurveBL = ringObj.params.ringCurveBL.val + 0.1;
      ringCurveBR = ringObj.params.ringCurveBR.val + 0.1;
      ringCurveTR = ringObj.params.ringCurveTR.val + 0.1;
      ringCurveTL = ringObj.params.ringCurveTL.val + 0.1;
      detail = { min: 32, max: 256 };
      ringObj.path = [];
      ringObj.path.push({
        type: "line",
        coords: [
          [0 + ringCurveTL, 0],
          [ringObj.params.ringHeightVal.val - ringCurveBL, 0],
        ],
      });
      type = "line";
      if (curveBLChecked == 1) {
        ringObj.path.push({
          type: "quart",
          coords: [
            [ringObj.params.ringHeightVal.val - ringCurveBL, 0 + ringCurveBL],
          ],
          detail: { min: 4, max: 16 },
          radius: ringCurveBL,
          position: "TL",
        });
      }
      ringObj.path.push({
        type: "line",
        coords: [
          [ringObj.params.ringHeightVal.val, 0 + ringCurveBL],
          [
            ringObj.params.ringHeightVal.val,
            ringObj.params.ringDepth.val - ringCurveBR,
          ],
        ],
      });
      type = "line";
      if (curveBRChecked == 1) {
        ringObj.path.push({
          type: "quart",
          coords: [
            [
              ringObj.params.ringHeightVal.val - ringCurveBR,
              ringObj.params.ringDepth.val - ringCurveBR,
            ],
          ],
          detail: { min: 4, max: 16 },
          radius: ringCurveBR,
          position: "TR",
        });
      }
      ringObj.path.push({
        type: "line",
        coords: [
          [
            ringObj.params.ringHeightVal.val - ringCurveBR,
            ringObj.params.ringDepth.val,
          ],
          [0 + ringCurveTR, ringObj.params.ringDepth.val],
        ],
      });
      type = "line";
      if (curveTRChecked == 1) {
        ringObj.path.push({
          type: "quart",
          coords: [
            [0 + ringCurveTR, ringObj.params.ringDepth.val - ringCurveTR],
          ],
          detail: { min: 4, max: 16 },
          radius: ringCurveTR,
          position: "BR",
        });
      }
      ringObj.path.push({
        type: "line",
        coords: [
          [0, ringObj.params.ringDepth.val - ringCurveTR],
          [0, 0 + ringCurveTL],
        ],
      });
      type = "line";
      if (curveTRChecked == 1) {
        ringObj.path.push({
          type: "quart",
          coords: [[0 + ringCurveTL, 0 + ringCurveTL]],
          detail: { min: 4, max: 16 },
          radius: ringCurveTL,
          position: "BL",
        });
      }

      svgScale = 200 / ringObj.params.ringDepth.val;
      svgHeight = Math.floor(ringObj.params.ringHeightVal.val * svgScale) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 +
        ringObj.params.ringHeightVal.val;
      //ringObj.totalHeight = ringObj.totalHeight.toFixed(1)
      ringObj.heightSliders = ["ringInnerWidth", "ringHeightVal"];
      ringObj.ringDepth = ringObj.params.ringDepth.val;
      ringObj.type = "curved";
      //ringObj.shapePrice = 20+5;
      ringObj.shapePrice = pricesObj.shapes[10] / 1;
    },
  },
  {
    //RING 12
    params: {
      ringInnerWidth: {
        val: 15,
        min: [15, 15, 15, 15, 15],
        max: [31, 37, 29, 29, 32],
        label: ["Inner Width", "Ringmaat"],
        depends: ["ringRadius"],
      },
      ringRadius: {
        val: 2,
        min: [0.5, 0.5, 0.5, 0.5, 0.5],
        max: [3, 3, 3, 3, 3],
        label: ["Raduis", "Radius"],
        parentDepend: "ringInnerWidth",
      },
    },
    latheTesselation: { min: 64, max: 256 },
    flattenMesh: true,
    updateRingPath: function () {
      ringObj.path = [
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringRadius.val / 2,
              ringObj.params.ringRadius.val / 2,
            ],
          ],
          detail: { min: 4, max: 16 },
          radius: ringObj.params.ringRadius.val / 2,
          position: "TL",
        },
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringRadius.val / 2,
              ringObj.params.ringRadius.val / 2,
            ],
          ],
          detail: { min: 4, max: 16 },
          radius: ringObj.params.ringRadius.val / 2,
          position: "TR",
        },
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringRadius.val / 2,
              ringObj.params.ringRadius.val / 2,
            ],
          ],
          detail: { min: 4, max: 16 },
          radius: ringObj.params.ringRadius.val / 2,
          position: "BR",
        },
        {
          type: "quart",
          coords: [
            [
              ringObj.params.ringRadius.val / 2,
              ringObj.params.ringRadius.val / 2,
            ],
          ],
          detail: { min: 4, max: 16 },
          radius: ringObj.params.ringRadius.val / 2,
          position: "BL",
        },
      ];
      svgScale = 200 / ringObj.params.ringRadius.val;
      svgHeight = Math.floor(ringObj.params.ringRadius.val * svgScale) + 4;
      ringObj.totalHeight =
        ringObj.params.ringInnerWidth.val / 2 + ringObj.params.ringRadius.val;
      ringObj.heightSliders = ["ringInnerWidth", "ringRadius"];
      ringObj.ringDepth = ringObj.params.ringRadius.val;
      ringObj.type = "curved";
      //ringObj.shapePrice = 20+5;
      ringObj.shapePrice = pricesObj.shapes[11] / 1;
    },
  },
];
