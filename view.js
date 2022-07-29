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

async function getRenderContext(_mode, _ctx, _page) {
  // let viewport = scaledViewport && getScaledViewport(_page);
  let viewport = getScaledViewport(_page, _mode);

  log("getRenderContext: viewport", viewport);

  setCanvasSize(_mode, viewport);

  return { canvasContext: _ctx, viewport: viewport };

  if (_mode == "page1") {
    return { canvasContext: _ctx, viewport: viewport };
  } else if (_mode == "page2") {
    return { canvasContext: _ctx, viewport: scaledViewport };
  }

  log("getRenderContexrt -> wrong param mode: ", _mode);
  return [];
}

async function renderPage(_curNumPage, _totalNumPage, _mode) {
  let renderContextLeft;
  let renderContextBg;
  let page = await getPage(_curNumPage);
  let nextpage;

  if (_mode == "+") {
    nextpage = await getPage(varifyPageNum(_curNumPage + 1));
  } else if (_mode == "-") {
    nextpage = await getPage(varifyPageNum(_curNumPage - 1));
  } else {
    nextpage = await getPage(varifyPageNum(_curNumPage + 1));
  }

  renderContextBg = await getRenderContext(
    "page2",
    $canvasBg[0].getContext("2d"),
    nextpage
  );

  if (_curNumPage == 1 || _curNumPage == _totalNumPage) {
    log("render case 1: page one");
    $pageRight.hide();
    renderContextLeft = await getRenderContext(
      "page1",
      $canvasLeft[0].getContext("2d"),
      page
    );
    log("renderPage -> renderContext", renderContextLeft);

    await page.render(renderContextLeft);
  } else {
    log("render case 2: page two");
    $pageRight.show();

    // render Left page
    renderContextLeft = await getRenderContext(
      "page2",
      $canvasLeft[0].getContext("2d"),
      page
    );

    // render Right page
    renderContextRight = await getRenderContext(
      "page2",
      $canvasRight[0].getContext("2d"),
      page
    );

    await page.render(renderContextLeft);
    await page.render(renderContextRight);
  }

  if (curNumPage != 1 && curNumPage != 41) {
    // $(".background").width($(".content-inner").width());
    // $(".background").height($(".content-inner").height());
    await nextpage.render(renderContextBg);
  } else if (curNumPage == 1 || curNumPage == 41) {
    // $(".background").width($canvasLeft.width());
    // $(".background").height($canvasLeft.height());
    await page.render(renderContextBg);
  }
  log("finish render");
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}
