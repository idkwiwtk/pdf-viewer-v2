/**
 * pdf 파일 로드 후 초기화 작업 수행
 */
pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
  initViewer(pdfDoc_);
  initComponent(curNumPage, totalNumPage);
  renderPage(curNumPage, totalNumPage);
});

/**
 * PDF 뷰어를 위한 초기화 작업 수행
 * 1. pdf 객체 등록
 * 2. pdf 전체 페이지 등록 및 표시
 * 3. 페이지 전환 버튼에 이벤트 리스너 등록
 * 4. viewport 초기화
 */
function initViewer(_pdfDoc) {
  log("start init Viewer");
  pdfDoc = _pdfDoc;
  totalNumPage = pdfDoc.numPages;

  log("start init viewport");
  initViewport();
  log("finish init viewport");

  $(".prev-btn").click(onPrevBtn);
  $(".next-btn").click(onNextBtn);

  log("finish init Viewer");
}

// 첫번째 페이지를 기준으로 뷰포트를 초기화
async function initViewport() {
  let firstPage = await getPage(1);
  let tempViewport = firstPage.getViewport({ scale: 1 });
  let scale = canvas.height / tempViewport.height;

  log("getScaledViewport -> firstPage: ", firstPage);
  log("getScaledViewport -> tempViewport: ", tempViewport);
  log("getScaledViewport -> tempViewport.height: ", tempViewport.height);
  log("getScaledViewport -> scale: ", scale);

  scaledViewport = scale;
}

/**
 * 페이지 전환을 위한 현재 페이지 수 변경 함수
 * 범위 내로 움직임을 보장
 * 유효한 변경일 때 현재 페이지 수 표시 업데이트
 */
function calCurNumPage(mode) {
  if (mode == "+") {
    if (curNumPage + 1 <= totalNumPage) {
      curNumPage++;
      log("page up: ", curNumPage);
      updateCurNumPage(curNumPage);
      renderPage(curNumPage, totalNumPage);
    }
  } else if (mode == "-") {
    if (curNumPage - 1 > 0) {
      curNumPage--;
      log("page down: ", curNumPage);
      updateCurNumPage(curNumPage);
      renderPage(curNumPage, totalNumPage);
    }
  }
}

/**
 * 이전 버튼에 등록할 이벤트 리스너
 */
function onPrevBtn() {
  log("prev btn");
  calCurNumPage("-");
}

/**
 * 다음 버튼에 등록할 이벤트 리스너
 */
function onNextBtn() {
  log("next btn");
  calCurNumPage("+");
}

function varifyPageNum(num) {
  let res = parseInt(num);

  if (res != NaN) {
    if (res < 1 || res > totalNumPage) {
      return 1;
    }
    return res;
  }

  return 1;
}

/**
 * 페이지 변경 이벤트 함수
 */
function onChangePageNum(thiz) {
  let value = $(thiz).val();

  log("user input val: ", value);

  curNumPage = varifyPageNum(value);

  updateCurNumPage(curNumPage);
  renderPage(curNumPage, totalNumPage);
}
