// 뷰어 하위 컴포넌트 초기화 함수
function initComponent(_curNumPage, _totalNumPage) {
  $(".page-total").text(_totalNumPage);
  updateCurNumPage(_curNumPage);
}

// 현재 페이지 번호 표기 업데이트
function updateCurNumPage(_curNumPage) {
  $(".page-cur").val(_curNumPage);
}

// pdf 파일의 페이지 반환
async function getPage(_num) {
  log("get page: ", _num);
  return await pdfDoc.getPage(_num);
}

// 첫번째 페이지를 기준으로 퓨포트 크기를 조정함
function getScaledViewport(_page, _mode) {
  let tempViewport = _page.getViewport({ scale: 1, offsetX: 700 });
  let scale = canvas.height / tempViewport.height;

  if ($(window).width() <= 1024) {
    if (_mode == "page1") {
      scale = canvas.width / tempViewport.width;
    } else if (_mode == "page2") {
      scale = (canvas.width * 2) / tempViewport.width;
    }
  }

  log("getScaledViewport -> _page: ", _page);
  log("getScaledViewport -> tempViewport: ", tempViewport);
  log("getScaledViewport -> tempViewport.width: ", tempViewport.width);
  log("getScaledViewport -> tempViewport.height: ", tempViewport.height);
  log("getScaledViewport -> scale: ", scale);

  scaledViewport = scale;

  return _page.getViewport({ scale: scale });
}

function setCanvasSize(_mode, _viewport) {
  if (_mode == "page1") {
    $canvasLeft[0].width = _viewport.width;
    $canvasLeft[0].height = _viewport.height;
    $canvasRight[0].width = _viewport.width;
    $canvasRight[0].height = _viewport.height;

    // $canvasBg.width(_viewport.width);
    // $canvasBg.height(_viewport.height);
    $canvasBg[0].width = _viewport.width;
    $canvasBg[0].height = _viewport.height;
  } else if (_mode == "page2") {
    $canvasLeft[0].width = _viewport.width / 2;
    $canvasLeft[0].height = _viewport.height;
    $canvasRight[0].width = _viewport.width;
    $canvasRight[0].height = _viewport.height;

    // $canvasBg.width(_viewport.width);
    // $canvasBg.height(_viewport.height);
    $canvasBg[0].width = _viewport.width;
    $canvasBg[0].height = _viewport.height;
  } else {
    log("setCanvasSize -> wrong mode: ", _mode);
  }
}

async function getRenderContext(_mode, $_canvas, _page) {
  // let viewport = scaledViewport && getScaledViewport(_page);
  // let viewport = getScaledViewport(_page, _mode);
  let viewport = _page.getViewport({ scale: 2 });
  log("getRenderContext: viewport", viewport);
  log("context:", $_canvas);

  $_canvas.width = viewport.width;
  $_canvas.height = viewport.height;

  // setCanvasSize(_mode, viewport);

  return { canvasContext: $_canvas.getContext("2d"), viewport: viewport };

  if (_mode == "page1") {
    return { canvasContext: _ctx, viewport: viewport };
  } else if (_mode == "page2") {
    return { canvasContext: _ctx, viewport: scaledViewport };
  }

  log("getRenderContexrt -> wrong param mode: ", _mode);
  return [];
}

async function renderCanvas($_canvas, _page) {
  let renderContext = await getRenderContext("canvas", $_canvas[0], _page);

  await _page.render(renderContext);
}

function convertCanvasToDataURL($_canvas) {
  return $_canvas[0].toDataURL("image/png");
}

function chagneImageSrc(_dataURL, $_img) {
  $_img[0].src = _dataURL;
}

async function renderPage(_pageNum, $_renderCanvas) {
  let page = await getPage(_pageNum);

  renderCanvas($_renderCanvas, page);

  setTimeout(function () {
    let urlData = convertCanvasToDataURL($_renderCanvas);

    chagneImageSrc(urlData, $imgLeft);

    // log("url", urlData);
  }, 1000);

  log("finish render");
}

function test() {
  let dataURL = $canvasBg[0].toDataURL("image/png");

  $(".test-img img")[0].src = dataURL;
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    // renderPage(num);
  }
}
