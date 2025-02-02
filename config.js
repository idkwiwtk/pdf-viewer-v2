var log = console.log; // 로그메시지 출력
var pdfPath = "./test.pdf"; // 테스트 파일 경로
var url = pdfPath; // pdf.js 에서 사용하는 변수
var pdfDoc; // pdf.js 의 객체
var scaledViewport; // 기준 뷰포트 객체 page 1 을 기준으로 사용한다.

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window["pdfjs-dist/build/pdf"]; // 라이브러리 객체 로드

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//mozilla.github.io/pdf.js/build/pdf.worker.js";

// scaledViewport를 구하기 위한 기준이 되는 캔버스 크기
// height만 사용한다.
// 한 화면에 한번에 보일 수 있도록 함
var canvas = {
  width: $(".left-content").width(),
  height: $(".left-content").height(),
};
var canvasBg = {
  width: $(".background").width(),
  height: $(".background").height(),
};

var curNumPage = 1; // 현재 페이지 번호
var totalNumPage; // 총 페이지 수

// 캔버스 객체
var $canvasLeft = $(".left-content");
var $canvasRight = $(".right-content");
var $canvasBg = $(".background");

var $pageLeft = $(".page-left");
var $pageRight = $(".page-right");
