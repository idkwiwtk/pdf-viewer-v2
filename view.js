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

function getScaledViewport(_page) {
  let tempViewport = _page.getViewport({ scale: 1 });
  let scale = canvas.height / tempViewport.height;

  log("getScaledViewport -> _page: ", _page);
  log("getScaledViewport -> tempViewport: ", tempViewport);
  log("getScaledViewport -> tempViewport.height: ", tempViewport.height);
  log("getScaledViewport -> scale: ", scale);

  return _page.getViewport({ scale: scale });
}

function setCanvasSize(_mode, _viewport) {
  if (_mode == "page1") {
    $canvasLeft[0].width = _viewport.width;
    $canvasLeft[0].height = _viewport.height;
  } else if (_mode == "page2") {
  } else {
    log("setCanvasSize -> wrong mode: ", _mode);
  }
}

async function getRenderContext(_mode, _ctx, _page) {
  let viewport = getScaledViewport(_page);

  setCanvasSize(_mode, viewport);

  if (_mode == "page1") {
    return { canvasContext: _ctx, viewport: viewport };
  } else if (_mode == "page2") {
    return [];
  }

  log("getRenderContexrt -> wrong param mode: ", _mode);
  return [];
}

async function renderPage(_curNumPage, _totalNumPage) {
  let renderContext;
  let page = await getPage(curNumPage);

  if (_curNumPage == 1 || _curNumPage == _totalNumPage) {
    log("render case 1: page one");
    $canvasRight.hide();

    renderContext = await getRenderContext(
      "page1",
      $canvasLeft[0].getContext("2d"),
      page
    );
    log("renderPage -> renderContext", renderContext);

    await page.render(renderContext);

    log("finish render");
  } else {
    log("render case 2: page two");
    $canvasRight.show();
    renderContext = await getRenderContext(
      "page2",
      $canvasLeft[0].getContext("2d"),
      page
    );
  }
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}
