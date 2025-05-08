const updateShopify = (obj) => {
  console.log("Sending postmessage");
  window.parent.postMessage(
    {
      type: "RING_UPDATE",
      payload: obj,
    },
    "*"
  );

  return;
};

ringCount = 0;
changeMaterial = function () {
  gradeIndex = ringObj.gradeIndex == undefined ? 0 : ringObj.gradeIndex;
  if (materialsArr[currentMaterial].material.length == 1) {
    gradeIndex = 0;
  }

  if (ringMat) {
    ringMat.color.setHex(
      materialsArr[currentMaterial].material[gradeIndex].color
    );
    ringMat.metalness =
      materialsArr[currentMaterial].material[gradeIndex].metalness;

    $(".btnFinish1, .btnFinish2").removeClass("btnOn");

    if (ringObj.usefinish == undefined) {
      ringObj.usefinish = 0;
      if ($(".finishTypeSelecter input").prop("checked")) {
        console.log("HERE");
        $(".finishTypeSelecter input").click();
      }
    }

    if (
      ringObj.finish == "Gloss" ||
      materialsArr[currentMaterial].material[gradeIndex].matte == -1
    ) {
      $(".btnFinish1").addClass("btnOn");
      ringMat.roughness =
        materialsArr[currentMaterial].material[gradeIndex].roughness;
    } else {
      $(".btnFinish2").addClass("btnOn");
      ringMat.roughness =
        materialsArr[currentMaterial].material[gradeIndex].matte;
    }
    if (materialsArr[currentMaterial].material[gradeIndex].matte == -1) {
      $(".finishTypeSelecter").hide();
    } else {
      $(".finishTypeSelecter").show();
    }
    ringMat.bumpScale =
      materialsArr[currentMaterial].material[gradeIndex].bumpScale;
  }
  $(".matTitleDiv").html(materialsArr[currentMaterial].title[langIndex]);
  $(".selectedMaterialDiv img").attr(
    "src",
    materialsArr[currentMaterial].material[gradeIndex].thumb
  );
  $(".matGradeDiv").html("");

  if (materialsArr[currentMaterial].grades.length > 1) {
    for (var x = 0; x < materialsArr[currentMaterial].grades.length; x++) {
      btnClass = "";
      if (gradeIndex == undefined) {
        if (x == 0) {
          btnClass = ' class="btnOn"';
        }
      } else {
        if (x == gradeIndex) {
          btnClass = ' class="btnOn"';
        }
      }
      $(".matGradeDiv").append(
        "<button" +
          btnClass +
          ">" +
          materialsArr[currentMaterial].grades[x].title[langIndex] +
          "</button>"
      );
    }
  }
  $(".materialListDiv div").removeClass("ringOn");
  $('.materialListDiv div[index="' + currentMaterial + '"]').addClass("ringOn");
  $(".matGradeDiv button").bind("click", function () {
    $(".matGradeDiv button").removeClass("btnOn");
    $(this).addClass("btnOn");
    ringObj.gradeIndex = getGradeIndex();
    changeMaterial();
  });
  $(".materialsPopupDv").hide();

  if (currentMaterial == 3 && ringObj.gradeIndex == 1) {
    $(".finishType").prop("checked", true);
    ringObj.usefinish = 1;
    //$('.titleButton .btnOn').click();
    $(".finishTypeSelecter .titleButton, .disclaimer").show();
    $(".finishType").prop("disabled", true);
  } else {
    $(".finishType").prop("disabled", false);
  }

  ringChanged = 0;
  doRingChanged();
};

function loadRingFromJSON() {
  //return false;
  //console.log(userRings);
  //console.log('loadRingFromJSON currentUserRing = ' + currentUserRing);
  ringObj = ringsObj[userRings[currentUserRing].id];

  ringObj.id = userRings[currentUserRing].id;
  ringObj.finish = userRings[currentUserRing].finish;
  ringObj.usefinish = userRings[currentUserRing].usefinish;
  ringObj.gradeIndex = userRings[currentUserRing].gradeIndex;
  ringObj.glossMatteIndex = userRings[currentUserRing].glossMatteIndex;
  ringObj.currentMaterial = userRings[currentUserRing].currentMaterial;
  //log('loadRingFromJSON - changing ringObj mat to id ' + ringObj.currentMaterial);
  //currentRingType = ringObj.id;

  //log('Load from JSON ' + currentRingType);

  $(".ringThumb").removeClass("ringOn");
  $(".ringThumb").eq(ringObj.id).addClass("ringOn");

  params = Object.keys(ringObj.params);
  for (var y = 0; y < params.length; y++) {
    if (typeof ringObj.params[params[y]].val != "undefined") {
      ringObj.params[params[y]].val =
        userRings[currentUserRing].params[params[y]];
    } else {
      ringObj.params[params[y]].values =
        userRings[currentUserRing].params[params[y]];
    }
  }

  currentMaterial = userRings[currentUserRing].currentMaterial;
  //log('var currentMaterialset to id ' + currentMaterial);

  //clearCanvas2();
  //ringObj.updateRingPath();

  slidersObj = Object.keys(ringObj.params);
  $(".controls").html("");
  for (x = 0; x < slidersObj.length; x++) {
    $(".controls").append(
      '<div class="sliderDiv" slidername="' + slidersObj[x] + '">1</div>'
    );
    createSlider(slidersObj[x]);
  }
  changeMaterial();
  $(".ringThumb").eq(ringObj.id).click();
}

function doRingChanged() {
  if (ringChanged == 1 || mouseDown == 1) {
    return false;
  }
  //log('doRingChanged');
  ringChanged = 1;
  userRings[currentUserRing] = getRingData();
  updatePrice();
}

function getRingData() {
  //log('getRingData');
  obj = ringObj;
  cartDescription = "";
  let cartData = {};

  if (obj.usefinish == undefined) {
    obj.usefinish = 0;
  }
  console.log("HHERE");
  $(".finishTypeSelecter input").prop(
    "checked",
    obj.usefinish == 0 ? false : true
  );
  if (obj.glossMatteIndex == undefined) {
    obj.glossMatteIndex = 0;
  }
  if (obj.gradeIndex == undefined) {
    obj.gradeIndex = 0;
  }
  if (obj.currentMaterial == undefined) {
    //log('Material undefined - setting to 0');
    obj.currentMaterial = 0;
  }

  cartData[$(".ringTypeSelecter h2").html()] = obj.id + 1;

  cartData["Materiaal"] = materialsArr[obj.currentMaterial].title[langIndex];
  try {
    if (obj.currentMaterial != 1 && obj.gradeIndex != -1) {
      cartData["Materiaal"] =
        cartData["Materiaal"] +
        " (" +
        materialsArr[obj.currentMaterial].grades[obj.gradeIndex].title[
          langIndex
        ] +
        ")";
    }
  } catch (e) {
    console.error(e);
  }

  jrp = {};
  params = Object.keys(obj.params);
  for (var y = 0; y < params.length; y++) {
    if (typeof obj.params[params[y]].val != "undefined") {
      jrp[params[y]] = obj.params[params[y]].val;
      cartData[obj.params[params[y]].label[langIndex]] =
        obj.params[params[y]].val + "mm";
    } else {
      jrp[params[y]] = obj.params[params[y]].values;

      cartData[obj.params[params[y]].label[langIndex]] =
        obj.params[params[y]].values[0] +
        "mm , " +
        obj.params[params[y]].values[1] +
        "mm";
    }
  }
  cartData[getFinish("title")] = getFinish("value");

  var rn = "Ring";
  if (obj.price == undefined) {
    ("price is undefined again");
  }
  //log('Returning ring object with material id ' + obj.currentMaterial);
  obj = {
    price: obj.price,
    id: obj.id,
    currentMaterial: obj.currentMaterial,
    glossMatteIndex: obj.glossMatteIndex,
    finish: obj.finish,
    usefinish: obj.usefinish,
    gradeIndex: obj.gradeIndex,
    params: jrp,
    ringName: rn,
    cartData,
  };
  return obj;
}

function saveRingToSession() {
  for (x = 0; x < userRings.length; x++) {
    if (loggedInUserType < 2) {
      userRings[x].tax = 1;
    } else {
      userRings[x].tax = 0;
    }
  }

  console.log(userRings[currentUserRing]);
  updateShopify(userRings[currentUserRing]);
  return;

  $.ajax({
    data: { action: "saveRingData", userRings: JSON.stringify(userRings) },
    url: "webservice.php?" + Math.random() * Math.random(),
    success: function (response) {
      //log(response);
    },
    error: function (e) {
      //log(e)
    },
  });
}

function updatePrice() {
  //log('updating price');
  if (!ringObj) {
    return false;
  }
  if (stopRendering == 1) {
    render();
  }
  if (userRings.length < 1) {
    userRings[currentUserRing] = getRingData();
  }
  $(".ringPriceDiv h1").html("");
  gradeIndex =
    userRings[currentUserRing].gradeIndex == undefined
      ? 0
      : userRings[currentUserRing].gradeIndex;

  if (currentMaterial >= 4) {
    rodSizeIndex = 0;
    volume = calculateVolume(ring)[0];
    //log('V = ' + volume);
    goldGrams =
      (volume / 1000) *
      materialsArr[currentMaterial].grades[gradeIndex].purity *
      materialsArr[currentMaterial].grades[gradeIndex].SM;

    //log('GP = ' + goldPrice);
    //log('GG = ' + goldGrams);

    ringPrice = goldGrams * goldPrice + 40;
    //log('RP = ' + ringPrice);
    ringPrice *=
      materialsArr[currentMaterial].grades[gradeIndex].margin[loggedInUserType];

    //log('RP = ' + ringPrice);
    if (userRings[currentUserRing].usefinish > 0) {
      finishPrice =
        materialsArr[currentMaterial].grades[gradeIndex].finishPrice[
          userRings[currentUserRing].glossMatteIndex
        ];
      glossMatteIndex = userRings[currentUserRing].glossMatteIndex;
      ringPrice += finishPrice;
      //log('1.) Adding finish price', finishPrice, glossMatteIndex);
    }
  } else {
    //log('Getting price for ring index' + currentUserRing);

    if (gradeIndex < 0 || gradeIndex == undefined) {
      gradeIndex = userRings[currentUserRing].gradeIndex = 0;
    }
    rodSizeIndex = 0;
    if (
      materialsArr[currentMaterial].grades[gradeIndex].ppmm[rodSizeIndex] == 0
    ) {
      ringPrice = 1;
    } else {
      if (
        ringObj.totalHeight >
        materialsArr[currentMaterial].grades[gradeIndex].maxDiameter[0] / 2
      ) {
        rodSizeIndex = 1;
      }
      ringPrice =
        (ringObj.ringDepth +
          materialsArr[currentMaterial].grades[gradeIndex].cutWidth[
            rodSizeIndex
          ]) *
        materialsArr[currentMaterial].grades[gradeIndex].ppmm[rodSizeIndex];
    }

    shapeCost = 0;
    if (materialsArr[currentMaterial].grades[gradeIndex].shapeTest) {
      shapeCost =
        materialsArr[currentMaterial].grades[gradeIndex].shapeTest[
          rodSizeIndex
        ];
    }

    ringPrice = ringPrice.toFixed(3);
    ringPrice /= 1;
    ringPrice =
      (ringPrice *
        materialsArr[currentMaterial].grades[gradeIndex].customerFactor[
          rodSizeIndex
        ] +
        materialsArr[currentMaterial].grades[gradeIndex].startCost[
          rodSizeIndex
        ]) *
        materialsArr[currentMaterial].grades[gradeIndex].margin[rodSizeIndex][
          loggedInUserType
        ] +
      ringObj.shapePrice;
    if (userRings[currentUserRing].usefinish > 0) {
      finishPrice =
        materialsArr[currentMaterial].grades[gradeIndex].finishPrice[
          userRings[currentUserRing].glossMatteIndex
        ];
      glossMatteIndex = userRings[currentUserRing].glossMatteIndex;
      ringPrice += finishPrice;
      //log('2.) Adding finish price', finishPrice, glossMatteIndex);
    }

    if (currentMaterial == 2) {
      ringPrice = 10;
    }
  }

  ringPrice = ringPrice.toFixed(2);
  userRings[currentUserRing].price = ringPrice;
  ringObj.price = ringPrice;

  $(".ringPriceSpan").eq(currentUserRing).attr("price", ringPrice);
  $(".ringPriceSpan")
    .eq(currentUserRing)
    .html("&euro; " + formatPrice(ringPrice));

  totalPrice = 0;
  for (var a = 0; a < userRings.length; a++) {
    rp = Number(userRings[a].price / 1).toFixed(2);
    totalPrice = Number(totalPrice).toFixed(2);
    totalPrice = (Number(totalPrice) + Number(rp)).toFixed(2);
    //totalPrice = (totalPrice.toFixed(2)/1) + (.toFixed(2)/1);
    //totalPrice = totalPrice.toFixed(2);
  }

  //log('Price changed to ' + ringPrice + ' New total price = ' + totalPrice + ' Current ring = ' + currentUserRing);

  $(".ringPriceDiv h1").attr("totalPrice", totalPrice);
  $(".ringPriceDiv h1").html("&euro; " + formatPrice(totalPrice));

  if (loggedInUserType < 2) {
    $(".ringPriceDiv h1").html("&euro; " + formatPrice(totalPrice * 1.21));
    $(".ringPriceDiv h1")
      .eq(currentUserRing)
      .append("<br><span> (incl. 21% btw) </span>");
  }
  saveRingToSession();
}

doRingTypeClick = function () {
  currentRingType = $(this).attr("index") / 1;
  //log('HERE!!!!!!', currentRingType);
  $(".ringThumb").attr("style", "").removeClass("ringOn");
  $(this).addClass("ringOn");
  setupRing(currentRingType);
  return false;
  $(".ringTypeSelecter .ringThumb")
    .unbind("click")
    .bind("click", doRingTypeClick);
};

function setupRing(id) {
  if (ringObj != undefined) {
    currentRingInnerWidth = ringObj.params.ringInnerWidth.val;
    try {
      currentRingHeight = ringObj.params.ringHeightVal.val;
      currentRingDepth = ringObj.params.ringDepth.val;
    } catch (e) {}
  }

  ringObj = jQuery.extend({}, ringsObj[id]);
  ringObj.id = id;
  /*
	ringObj.finish = 'Gloss';
	ringObj.gradIndex = 0;
	ringObj.glossMatteIndex = 0;
    */
  ringObj.currentMaterial = currentMaterial;
  if (ringObj.usefinish == 0) {
    $(".finishTypeSelecter .titleButton, .disclaimer").hide();
  }

  if (currentRingInnerWidth != undefined) {
    ringObj.params.ringInnerWidth.val = currentRingInnerWidth;
    try {
      ringObj.params.ringHeightVal.val = currentRingHeight;
      ringObj.params.ringDepth.val = currentRingDepth;
    } catch (e) {}
  }

  if (ringFromSession == 1) {
    ringFromSession = 0;
    loadRingFromJSON();
  } else {
    userRings[currentUserRing] = getRingData();
  }

  clearCanvas2();
  ringObj.updateRingPath();
  slidersObj = Object.keys(ringObj.params);
  $(".controls").html("");
  for (x = 0; x < slidersObj.length; x++) {
    $(".controls").append(
      '<div class="sliderDiv" slidername="' + slidersObj[x] + '">1</div>'
    );
    createSlider(slidersObj[x]);
  }

  updateAffected();
  for (x = 0; x < slidersObj.length; x++) {
    if (ringObj.params[slidersObj[x]].val != undefined) {
      val = $("." + slidersObj[x] + "Slider").slider("value");
      slideActionNoRange($("." + slidersObj[x] + "Slider"), val);
    } else {
      val = $("." + slidersObj[x] + "Slider").slider("value");
      vals = $("." + slidersObj[x] + "Slider").slider("values");
      sliderActionRange($("." + slidersObj[x] + "Slider"), vals, val);
    }
  }
  changeMaterial();
}

$(document).ready(function () {
  $(".btnShowHideRing").bind("click", function () {
    ring.visible = !ring.visible;
  });
  $(".ringThumb").bind("mouseenter", function () {
    $(this).css("background-color", "#303030");
  });
  $(".ringThumb").bind("mouseleave", function () {
    $(this).css("background-color", "#000");
  });
  $(".autoSpin").bind("change", function () {
    if ($(this).prop("checked")) {
      controls.autoRotate = true;
    } else {
      controls.autoRotate = false;
    }
  });
  $(".btnAddToCart").bind("click", function () {
    if (currentRingValid == 0) {
      showRingSizeError();
      return false;
    }
    ringJSON = JSON.stringify(userRings);
    $(".cartForm .userRings").val(ringJSON);
    setTimeout(function () {
      $(".cartForm").submit();
    }, 500);
  });

  if ($(".materialDesigner").css("display") == "block") {
    $(".materialDesigner input").bind("keyup", doMaterialDesignerUpdate);
    doMaterialDesignerUpdate();
  }
  $(".langSelect div").bind("click", function () {
    $(".langSelect div").removeClass("langOn");
    $(this).addClass("langOn");
    langIndex = $(this).index(".langSelect div") == 0 ? 1 : 0;
    sliders = [];
    for (var k in ringObj.params) sliders.push(k);
    replaceSliders(sliders);
    switchLanguage();
  });

  $(".ringTypeSelecter .ringThumb").each(function () {
    $(this).attr("index", ringCount);
    ringCount++;
  });

  $(".ringTypeSelecter .ringThumb").bind("click", doRingTypeClick);

  $(".materialListDiv div").bind("click", function () {
    $(".btnFinish2").removeClass("btnOn");
    $(".btnFinish1").addClass("btnOn");
    if ($(this).hasClass("matGradeDiv")) {
      return false;
    }
    currentMaterial = $(this).attr("index") / 1;
    //log('currentMaterial = ' + currentMaterial);
    userRings[currentUserRing].gradeIndex = 0;
    userRings[currentUserRing].glossMatteIndex = 0;
    userRings[currentUserRing].finish = "Gloss";
    ringObj.currentMaterial = currentMaterial;
    //log('ringObj.currentMaterial = ' + currentMaterial);
    userRings[currentUserRing].currentMaterial = currentMaterial;
    //log('userRings[currentUserRing].currentMaterial = ' + userRings[currentUserRing].currentMaterial);
    $(".selectedMaterialDiv img").attr(
      "src",
      materialsArr[currentMaterial].material[0].thumb
    );
    changeMaterial();
  });

  $(".btnScreenShot").bind("click", function () {
    BABYLON.Tools.CreateScreenshot(
      engine,
      camera,
      { width: 2048, height: 2048 },
      function (data) {
        window.open(data, "_blank");
      }
    );
  });

  $(".bgToggle").bind("click", function () {
    if ($("html, body").css("background-color") == "rgb(0, 0, 0)") {
      $("html, body").css("background-color", "rgb(255, 255, 255)");
      scene.clearColor = new BABYLON.Color3(255, 255, 255);
      materialPlane.specularColor = new BABYLON.Color3(255, 255, 255);
      materialPlane.diffuseTexture = null; //new BABYLON.Texture("textures/planeW.jpg", scene);
    } else {
      $("html, body").css("background-color", "rgb(0, 0, 0)");
      scene.clearColor = new BABYLON.Color3(255, 255, 255);
      materialPlane.specularColor = new BABYLON.Color3(255, 255, 255);
      materialPlane.diffuseTexture = new BABYLON.Texture(
        "textures/plane.jpg",
        scene
      );
    }
    plane1.material = materialPlane;
  });
  for (x = 0; x < ringsObj.length; x++) {
    selected = "";
    if (x == 7) {
      selected = ' selected="selected"';
    }
    $(".ringType").append(
      '<option value="' + x + '" ' + selected + ">Ring " + (x + 1) + "</option>"
    );
  }
  //$(".ringType option:eq(1)").attr("selected", "selected");
  $(".ringType").change(function () {
    animOut();
  });
  //updatePrice();

  $(".btnChangeMaterial").bind("click", function () {
    $(".materialsPopupDv").show();
    resizeCanvas();
  });
  $(".btnMaterialPopupClose").bind("click", function () {
    $(".materialsPopupDv").hide();
  });
  $(".btnFinish1, .btnFinish2").bind("click", function () {
    $(".btnFinish1, .btnFinish2").removeClass("btnOn");
    $(this).addClass("btnOn");
    if ($(this).hasClass("btnFinish1")) {
      ringObj.finish = "Gloss";
      ringObj.glossMatteIndex = 0;
    } else {
      ringObj.finish = "Matte";
      ringObj.glossMatteIndex = 1;
    }
    changeMaterial();
  });
  $(".materialListDiv span").hide().eq(langIndex).show();
  //loadRingFromJSON();
  setupRing(0);
  $(".finishTypeSelecter input").bind("change", function () {
    if ($(this).prop("checked")) {
      ringObj.usefinish = 1;
      $(".titleButton .btnOn").click();
      $(".finishTypeSelecter .titleButton, .disclaimer").show();
    } else {
      ringObj.usefinish = 0;
      ringObj.finish = "None";
      $(".finishTypeSelecter .titleButton, .disclaimer").hide();
    }
    changeMaterial();
  });
});
