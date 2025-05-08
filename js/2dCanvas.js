initWidth = 690;
initHeight = 1800;

CS = 37;

var startX;
var startY;

var canvas2 = document.getElementById("canvas2D");
var context = canvas2.getContext("2d");

var lastPaths;

function getArcData2(points) {
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
  start =
    -Math.atan2(circX - points[0][0], circY - points[0][1]) -
    90 * (Math.PI / 180);
  end =
    -Math.atan2(circX - points[2][0], circY - points[2][1]) -
    90 * (Math.PI / 180);
  return {
    circX: circX,
    circY: circY,
    r: r,
    start: start,
    end: end,
    clock: points[1][1] > points[0][1],
  };
}

function drawCanvasPath(paths) {
  //console.log(JSON.stringify(paths));

  if (paths == undefined) {
    return false;
  }
  lastPaths = paths;

  offset = ringObj.ringDepth / 2;

  if (currentRingType == 11) {
    startX = Math.floor(initWidth / 2);
    startY =
      Math.floor(initHeight / 2) -
      Math.floor((ringObj.params.ringInnerWidth.val * CS) / 2);
    c = context;
    c.beginPath();
    c.arc(
      startX,
      startY,
      ringObj.params.ringRadius.val * CS,
      0,
      Math.PI * 2,
      true
    );
    c.closePath();
    c.lineWidth = 4;
    c.strokeStyle = "#ffffff";
    c.stroke();

    startY =
      Math.floor(initHeight / 2) +
      Math.floor((ringObj.params.ringInnerWidth.val * CS) / 2);
    c = context;
    c.beginPath();
    c.arc(
      startX,
      startY,
      ringObj.params.ringRadius.val * CS,
      0,
      Math.PI * 2,
      true
    );
    c.closePath();
    c.stroke();
    return false;
  }

  for (var x = 0; x < paths.length; x++) {
    path = paths[x];
    canvasWidth = $(".canvasContainer").width();
    canvasHeight = $(".canvasContainer").height();

    startX = Math.floor(initWidth / 2) - Math.floor((offset * 2 * CS) / 2);
    startY =
      Math.floor(initHeight / 2) -
      Math.floor((ringObj.params.ringInnerWidth.val * CS) / 2);

    c = context;
    c.strokeStyle = "#ffffff";

    if (sliderHoverName == "") {
      pathArr = [];
    } else {
      if (ringObj.params[sliderHoverName] == undefined) {
        return false;
      }
      pathArr = ringObj.params[sliderHoverName].pathArr;
    }

    //console.log("Here")

    if (sliderGroupActive == 1) {
      pathArr = ringObj.params[sliderHoverName].pathArr2;
    }
    if (sliderBGHover == 1 && pathArr) {
      //console.log($.inArray(x, pathArr));
      c.strokeStyle = "#999";
      if ($.inArray(x, pathArr) > -1) {
        c.strokeStyle = "#FFF";
      }
    }

    c.lineWidth = 4;
    c.beginPath();
    coords = path.coords;
    if (path.type == "curve") {
      c.moveTo(startX + coords[0][1] * CS, startY - coords[0][0] * CS);
      c.quadraticCurveTo(
        startX + coords[1][1] * CS,
        startY - coords[1][0] * CS,
        startX + coords[2][1] * CS,
        startY - coords[2][0] * CS
      );
    }
    if (path.type == "quart") {
      switch (path.position) {
        case "TL":
          start = 180 * (Math.PI / 180);
          end = 270 * (Math.PI / 180);
          break;
        case "TR":
          start = 270 * (Math.PI / 180);
          end = 360 * (Math.PI / 180);
          break;
        case "BR":
          start = 0 * (Math.PI / 180);
          end = 90 * (Math.PI / 180);
          break;
        case "BL":
          start = 90 * (Math.PI / 180);
          end = 180 * (Math.PI / 180);
          break;
      }
      c.arc(
        startX + coords[0][1] * CS,
        startY - coords[0][0] * CS,
        path.radius * CS,
        start,
        end,
        false
      );
    }
    if (path.type == "arc") {
      pc = [];
      arcOffset = 200;
      arcHeight = 0; //(coords[0][0]-coords[1][0])*2;

      pc.push([
        coords[2][1] * CS + arcOffset,
        (-coords[2][0] - arcHeight) * CS + arcOffset,
      ]);
      pc.push([coords[1][1] * CS + arcOffset, -coords[1][0] * CS + arcOffset]);
      pc.push([
        coords[0][1] * CS + arcOffset,
        (-coords[0][0] - arcHeight) * CS + arcOffset,
      ]);
      cd = getArcData2(pc);
      clock = true;
      if (currentRingType == 9 && x == 1) {
        clock = false;
      }
      c.arc(
        startX + cd.circX - arcOffset,
        startY + cd.circY - arcOffset,
        cd.r,
        cd.start,
        cd.end,
        clock
      );
    }
    if (path.type == "line") {
      c.moveTo(startX + coords[0][1] * CS, startY - coords[0][0] * CS);
      for (y = 1; y < coords.length; y++) {
        c.lineTo(startX + coords[y][1] * CS, startY - coords[y][0] * CS);
      }
    }
    if (path.type == "ellipse") {
      c.ellipse(
        (path.coords[2] / 2) * CS + startX,
        startY - path.coords[1] * 0.5 * CS,
        path.coords[2] * CS,
        path.coords[1] * CS,
        0,
        0,
        2 * Math.PI,
        false
      );
    }
    c.stroke();
    c.closePath();
    startX = Math.floor(initWidth / 2) - Math.floor((offset * 2 * CS) / 2);
    startY =
      Math.floor(initHeight / 2) +
      Math.floor((ringObj.params.ringInnerWidth.val * CS) / 2);

    c = context;
    c.lineWidth = 4;
    c.beginPath();
    coords = path.coords;
    if (path.type == "curve") {
      c.moveTo(startX + coords[0][1] * CS, startY + coords[0][0] * CS);
      c.quadraticCurveTo(
        startX + coords[1][1] * CS,
        startY + coords[1][0] * CS,
        startX + coords[2][1] * CS,
        startY + coords[2][0] * CS
      );
    }
    if (path.type == "quart") {
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
      c.arc(
        startX + coords[0][1] * CS,
        startY + coords[0][0] * CS,
        path.radius * CS,
        start,
        end,
        true
      );
    }
    if (path.type == "arc") {
      pc = [];
      arcOffset = 200;
      pc.push([coords[2][1] * CS + arcOffset, coords[2][0] * CS + arcOffset]);
      pc.push([coords[1][1] * CS + arcOffset, coords[1][0] * CS + arcOffset]);
      pc.push([coords[0][1] * CS + arcOffset, coords[0][0] * CS + arcOffset]);
      cd = getArcData2(pc);
      clock = false;
      if (currentRingType == 9 && x == 1) {
        clock = true;
      }
      c.arc(
        startX + cd.circX - arcOffset,
        startY + cd.circY - arcOffset,
        cd.r,
        cd.start,
        cd.end,
        clock
      );
    }
    if (path.type == "line") {
      c.moveTo(startX + coords[0][1] * CS, startY + coords[0][0] * CS);
      for (y = 1; y < coords.length; y++) {
        c.lineTo(startX + coords[y][1] * CS, startY + coords[y][0] * CS);
      }
    }
    if (path.type == "ellipse") {
      c.ellipse(
        (path.coords[2] / 2) * CS + startX,
        startY + path.coords[1] * 0.5 * CS,
        path.coords[2] * CS,
        path.coords[1] * CS,
        0,
        0,
        2 * Math.PI,
        false
      );
    }
    c.stroke();
    c.closePath();
  }

  addCanvasMarkers();
}

function addCanvasMarkers() {
  offset = ringObj.ringDepth / 2;

  startX = Math.floor(initWidth / 2);
  startY = Math.floor(initHeight / 2);

  c = context;
  c.strokeStyle = "#666";
  c.lineWidth = 1;

  c.beginPath();
  c.moveTo(startX - 10, startY);
  c.lineTo(startX + 10, startY);
  c.stroke();

  c.beginPath();
  c.moveTo(startX, startY - 10);
  c.lineTo(startX, startY + 10);
  c.stroke();

  /*
	c.beginPath();
	c.moveTo(startX+(offset*CS),startY-10);
	c.lineTo(startX+(offset*CS),startY-(((ringObj.params.ringInnerWidth.val/4)*CS)-10));
	c.stroke();
	
	c.beginPath();
	c.moveTo(startX+(offset*CS),startY+10);
	c.lineTo(startX+(offset*CS),startY+(((ringObj.params.ringInnerWidth.val/4)*CS)-10));
	c.stroke();
	*/
}

clearCanvas2 = function () {
  //console.log("Clearing Canvas 2");
  context.clearRect(0, 0, canvas2.width, canvas2.height);
  //$(".canvasContainer").html('<canvas id="canvas2D" width="600" height="600"></canvas>');
  //canvas2 = document.getElementById('canvas2D');
  //context = canvas2.getContext('2d');
};

$(document).ready(function () {
  $(".canvasToPNG button").bind("click", function () {
    var img = canvas2.toDataURL("image/png");
    $(".canvasToPNG img").attr("src", img);
  });
});
