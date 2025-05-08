var tabindex = 100;
var sliderBGHover = 0;
var sliderHoverName = "";
var sliderDown = 0;
var sliderGroupActive = 0;
var currentRingValid = 1;
var mouseDown = 0;

$(document).bind("mousedown", function () {
  mouseDown = 1;
});
$(document).bind("mouseup", function () {
  mouseDown = 0;
});

function resetSliderBG() {
  if (mouseDown == 0) {
    $(".sliderDiv").css("background-color", "#0a0a0a");
  }
}

function createSlider(sliderObj) {
  if (ringObj.params[sliderObj].exclude) {
    return false;
  }
  ringVal = ringObj.params[sliderObj].val;

  if (ringVal > ringObj.params[sliderObj].max[getMaterialIndex()]) {
    ringVal = ringObj.params[sliderObj].val =
      ringObj.params[sliderObj].max[getMaterialIndex()];
  }
  if (ringVal < ringObj.params[sliderObj].min[getMaterialIndex()]) {
    ringVal = ringObj.params[sliderObj].val =
      ringObj.params[sliderObj].min[getMaterialIndex()];
  }
  sliderInput =
    '<input class="sliderInput sliderInput1" tabindex="' +
    tabindex +
    '" value="' +
    ringVal +
    '">';
  tabindex++;
  if (ringObj.params[sliderObj].range) {
    ringVal1 = ringObj.params[sliderObj].values[1];
    ringVal2 = ringObj.params[sliderObj].values[0];
    sliderInput =
      '<input class="sliderInput sliderInput1" tabindex="' +
      (tabindex + 1) +
      '" value="' +
      ringVal1 +
      '"><input class="sliderInput sliderInput2" tabindex="' +
      tabindex +
      '" value="' +
      ringVal2 +
      '">';
    tabindex += 2;
  }

  $("[slidername=" + sliderObj + "]").html(
    sliderInput +
      "<h2>" +
      ringObj.params[sliderObj].label[langIndex] +
      '</h2><div class="sliderContainer"><div class="markersDiv">' +
      returnSliderMarkers(
        ringObj.params[sliderObj].min[getMaterialIndex()] * 10,
        ringObj.params[sliderObj].max[getMaterialIndex()] * 10,
        ringObj.params[sliderObj].step
      ) +
      '</div><input type="text" id="' +
      sliderObj +
      'Slider" readonly style="border:0; color:#f6931f; font-weight:bold;"><div class="' +
      sliderObj +
      'Slider slider" style="width:100%;" param="' +
      sliderObj +
      '" steps="' +
      (ringObj.params[sliderObj].max[getMaterialIndex()] -
        ringObj.params[sliderObj].min[getMaterialIndex()] * 10) +
      '"></div></div></div>'
  );

  $(".sliderDiv")
    .unbind("mouseenter")
    .bind("mouseenter", function () {
      if (mouseDown == 1) {
        return false;
      }
      sliderBGHover = 1;
      sliderHoverName = $(this).attr("sliderName");
      drawCanvasPath(lastPaths);
      //$(this).css("background-color","#333");
    });
  $(".sliderDiv")
    .unbind("mouseleave")
    .bind("mouseleave", function () {
      if (mouseDown == 1) {
        return false;
      }
      sliderBGHover = 0;
      drawCanvasPath(lastPaths);
      //resetSliderBG();
    });

  if (ringObj.params[sliderObj].groupName) {
    groupClass = "";
    if (ringObj[ringObj.params[sliderObj].groupName].grouped == 1) {
      groupClass = "glyphicon-link-on";
    }
    groupButton = $(
      '<div class="glyphicon glyphicon-link ' +
        groupClass +
        '" group="' +
        ringObj.params[sliderObj].groupName +
        '" slider="' +
        sliderObj +
        '"></div>'
    );
    $("#" + sliderObj + "Slider")
      .parent()
      .parent()
      .prepend(groupButton);
    groupButton.bind("click", function () {
      groupName = $(this).attr("group");
      if ($(this).hasClass("glyphicon-link-on")) {
        $('div[group="' + groupName + '"]').removeClass("glyphicon-link-on");
        ringObj[groupName].grouped = 0;
        sliderGroupActive = 0;
        drawCanvasPath(lastPaths);
      } else {
        $('div[group="' + groupName + '"]').addClass("glyphicon-link-on");
        ringObj[groupName].grouped = 1;
        updateGroupValues(ringObj[groupName].group, $(this).attr("slider"));
        sliderGroupActive = 1;
      }
    });
  }
  if (ringObj.params[sliderObj].range) {
    range = false;
    if (ringObj.params[sliderObj].range != undefined) {
      range = true;
    }
    $("." + sliderObj + "Slider").slider({
      range: range,
      orientation: "horizontal",
      range: true,
      min: ringObj.params[sliderObj].min[getMaterialIndex()] * 10,
      max: ringObj.params[sliderObj].max[getMaterialIndex()] * 10,
      step: ringObj.params[sliderObj].step,
      values: [ringVal2 * 10, ringVal1 * 10],
      start: function () {
        mouseDown = 1;
        sliderDown = 1;
      },
      stop: function (event, ui) {
        mouseDown = 0;
        sliderBGHover = 0;
        sliderActionRange(
          $(this),
          ui.values,
          ui.value,
          "sliderInput" + (ui.handleIndex + 1)
        );
        returnShapes();
        ringChanged = 0;
        doRingChanged();
      },
      slide: function (event, ui) {
        if (ui.values[0] + ringObj.params[sliderObj].spacing > ui.values[1]) {
          return false;
        }
        sliderActionRange(
          $(this),
          ui.values,
          ui.value,
          "sliderInput" + (ui.handleIndex + 1)
        );
        //returnShapes();
      },
    });
  } else {
    $("." + sliderObj + "Slider").slider({
      range: range,
      orientation: "horizontal",
      range: "min",
      min: ringObj.params[sliderObj].min[getMaterialIndex()] * 10,
      max: ringObj.params[sliderObj].max[getMaterialIndex()] * 10,
      step: ringObj.params[sliderObj].step,
      value: ringVal * 10,
      start: function () {
        mouseDown = 1;
        //returnShapesInterval = setInterval(returnShapes, 50);
      },
      stop: function (event, ui) {
        mouseDown = 0;
        sliderBGHover = 0;
        slideActionNoRange($(this), ui.value);
        //clearInterval(returnShapesInterval);
        returnShapes();
        ringChanged = 0;
        doRingChanged();
      },
      slide: function (event, ui) {
        slideActionNoRange($(this), ui.value);
        //returnShapes();
      },
    });
  }
  $(".sliderInput").unbind("keyup").bind("keyup", updateSliderInput);
}

var returnShapesInterval;

sliderActionRange = function (slider, vals, val, from) {
  slider
    .parent()
    .parent()
    .find(".sliderInput")
    .css("background-color", "#0a0a0a")
    .css("color", "#FFF");
  if (vals[1] - vals[0] <= 0) {
    to = "sliderInput2";
    if (from == "sliderInput2") {
      to = "sliderInput1";
    }
    slider
      .parent()
      .parent()
      .find("." + to)
      .css("background-color", "#510000")
      .css("color", "#FFF");
    return false;
  }

  slider
    .parent()
    .parent()
    .find(".sliderInput1")
    .val(vals[1] / 10);
  slider
    .parent()
    .parent()
    .find(".sliderInput2")
    .val(vals[0] / 10);

  slider.slider("values", vals);
  ringObj.params[slider.attr("param")].values = [vals[0] / 10, vals[1] / 10];
  updateAffected();
  returnShapes();
};

slideActionNoRange = function (slider, val, from) {
  slider
    .parent()
    .parent()
    .find(".sliderInput")
    .css("background-color", "#0a0a0a")
    .css("color", "#FFF");
  if (from != "input") {
    slider
      .parent()
      .parent()
      .find(".sliderInput1")
      .val(val / 10);
  }
  currentSliderParam = val;
  ringObj.params[slider.attr("param")].val = val / 10;

  if (ringObj.params[slider.attr("param")].affects) {
    updateDependencies(val, ringObj.params[slider.attr("param")].affects);
  }
  if (ringObj.params[slider.attr("param")].groupName) {
    updateSliderGroup(slider.attr("param"), val);
  }
  updateAffected();
  returnShapes();
};

function updateSliderInput() {
  val = $(this).val();
  if (val[val.length - 1] == ".") {
    return false;
  }
  val = val / 1;
  slider = $(this).parent().find(".slider");
  $(this).css("background-color", "#0a0a0a").css("color", "#FFF");
  if (isNaN(val)) {
    $(this).css("background-color", "#510000").css("color", "#FFF");
    return false;
  }

  if (
    val > ringObj.params[slider.attr("param")].max[getMaterialIndex()] ||
    val < ringObj.params[slider.attr("param")].min[getMaterialIndex()]
  ) {
    $(this).css("background-color", "#510000").css("color", "#FFF");
    return false;
  }

  if (ringObj.params[slider.attr("param")].values == undefined) {
    slider.slider("value", val * 10);
    slideActionNoRange(slider, val * 10, "input");
  } else {
    vals = slider.slider("values");
    newVals = [vals[0], vals[1]];
    if ($(this).hasClass("sliderInput2")) {
      input = "sliderInput1";
      sVals = slider.slider("values");

      if (val * 10 + ringObj.params[slider.attr("param")].spacing >= sVals[1]) {
        newVals = [
          sVals[1] - ringObj.params[slider.attr("param")].spacing,
          sVals[1],
        ];
        $(this).val(
          (sVals[1] - ringObj.params[slider.attr("param")].spacing) / 10
        );
        $(this).css("background-color", "#510000").css("color", "#FFF");
        slider.slider("values", newVals);
        sliderActionRange(slider, newVals, val, input);
        val = newVals[0];
        return false;
      }
      if (val * 10 >= vals[1]) {
        $(this).css("background-color", "#510000").css("color", "#FFF");
      }
      newVals[0] = val * 10;
    } else {
      input = "sliderInput2";
      sVals = slider.slider("values");

      if (val * 10 - ringObj.params[slider.attr("param")].spacing <= sVals[0]) {
        newVals = [
          sVals[0],
          sVals[0] + ringObj.params[slider.attr("param")].spacing,
        ];
        $(this).val(
          (sVals[1] - ringObj.params[slider.attr("param")].spacing) / 10
        );
        $(this).css("background-color", "#510000").css("color", "#FFF");
        slider.slider("values", newVals);
        sliderActionRange(slider, newVals, val, input);
        val = newVals[0];
        return false;
      }
      if (val * 10 <= vals[0]) {
        $(this).css("background-color", "#510000").css("color", "#FFF");
        return false;
      }
      newVals[1] = val * 10;
    }
    if (newVals[0] == vals[0] && newVals[1] == vals[1]) {
      return false;
    }
    slider.slider("values", newVals);
    sliderActionRange(slider, newVals, val, input);
  }
  checkRingChanged();
}

function updateGroupValues(groupArr, master) {
  for (b = 0; b < groupArr.length; b++) {
    if (groupArr[b] != master) {
      ringObj.params[groupArr[b]].val = ringObj.params[master].val;
      ringObj.params[groupArr[b]].value = master.value;
    }
  }
  replaceSliders(groupArr);
  returnShapes();
}

updateSliderGroup = function (sliderName, val) {
  obj = ringObj[ringObj.params[sliderName].groupName];
  if (obj.grouped == 0) {
    return false;
  }
  for (z = 0; z < obj.group.length; z++) {
    if (sliderName != obj.group[z]) {
      $("." + obj.group[z] + "Slider").slider("value", val);
      ringObj.params[obj.group[z]].val = val / 10;
      $("." + obj.group[z] + "Slider")
        .parent()
        .parent()
        .find(".sliderInput1")
        .val(val / 10);
    }
  }
};

function replaceSliders(sliders) {
  for (z = 0; z < sliders.length; z++) {
    $('div[slidername="' + sliders[z] + '"]').html("");
    createSlider(sliders[z]);
  }
}

updateAffected = function () {
  currentRingValid = 1;
  max = ringObj.params["ringInnerWidth"].max[getMaterialIndex()] / 2;
  if (ringObj.totalHeight > max) {
    currentRingValid = 0;
    for (y = 0; y < ringObj.heightSliders.length; y++) {
      $("." + ringObj.heightSliders[y] + "Slider")
        .parent()
        .parent()
        .addClass("sliderRedBG");
    }
  } else {
    for (y = 0; y < ringObj.heightSliders.length; y++) {
      $("." + ringObj.heightSliders[y] + "Slider")
        .parent()
        .parent()
        .removeClass("sliderRedBG");
    }
  }
};

updateDependencies = function (val, sliders) {
  val = val / 10;
  for (var y = 0; y < sliders.length; y++) {
    //console.log(sliders[y])
    if (ringObj.params[sliders[y]].newMax) {
      ringObj.params[sliders[y]].max[getMaterialIndex()] =
        ringObj.params[sliders[y]].newMax();
      if (
        ringObj.params[sliders[y]].val >=
        ringObj.params[sliders[y]].max[getMaterialIndex()]
      ) {
        ringObj.params[sliders[y]].val =
          ringObj.params[sliders[y]].max[getMaterialIndex()] / 1;
      }
    }

    if (ringObj.params[sliders[y]].range) {
      newMax = ringObj.params[sliders[y]].newMax();
      values = ringObj.params[sliders[y]].values;
      originalValues = [values[0], values[1]];
      if (
        values[1] / 1 >=
        ringObj.params[sliders[y]].max[getMaterialIndex()] / 1
      ) {
        values[1] = newMax;
      }

      if (values[0] >= newMax) {
        if (values[0] >= values[1]) {
          values[0] = (
            values[1] -
            ringObj.params[sliders[y]].spacing / 10
          ).toFixed(1);
        }
      }
      if (originalValues[0] != values[0]) {
      }
      if (originalValues[1] != values[1]) {
        values[0] = (
          values[1] -
          ringObj.params[sliders[y]].spacing / 10
        ).toFixed(1);
      }
      ringObj.params[sliders[y]].values = values;
    }
  }
  replaceSliders(sliders);
};

function returnSliderMarkers(min, max, step) {
  min /= 10;
  max /= 10;
  range = max - min;
  amt = 100 / range;
  markersString = "";
  markerCount = 0;
  finalSet = 0;
  for (y = min; y <= max; y++) {
    markersString +=
      '<div class="marker" style="width:' +
      amt +
      "%;left:" +
      amt * markerCount +
      "%; margin-left:-" +
      amt / 2 +
      '%">' +
      y +
      '<span class="markerDevider"></span></div>';
    if (amt * markerCount == 100) {
      finalSet = 1;
    }
    markerCount++;
  }
  if (finalSet == 0) {
    markersString +=
      '<div class="marker" style="width:' +
      amt +
      "%;left:100%; margin-left:-" +
      amt / 2 +
      '%">' +
      max +
      '<span class="markerDevider"></span></div>';
  }

  if (step != undefined) {
    min /= step;
    max /= step;
    range = max - min;
    amt = 100 / range;
    markerCount = 0;
    for (y = min; y <= max; y++) {
      markersString +=
        '<div class="marker" style="width:' +
        amt +
        "%;left:" +
        amt * markerCount +
        "%; margin-left:-" +
        amt / 2 +
        '%"><span class="markerSubDevider"></span></div>';
      markerCount++;
    }
  }
  return markersString;
}
