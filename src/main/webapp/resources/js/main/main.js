document.addEventListener("DOMContentLoaded", initSurveyApp);
let currentSurveyId = null;

function initSurveyApp() {
	bindSearch();			// 검색 호출
	downloadDropdown();		// 다운로드 아이콘 드롭다운 호출
	bindDownload();			// PDF, 엑셀 다운로드 호출
}


// 설문조사 작성 버튼 클릭
document.getElementById("createFormBtn").addEventListener("click", function () {
	location.href = contextPath + "/form/create.do";
});


function bindSearch() {
	const searchBtn = document.getElementById("searchBtn");
	const searchInput = document.getElementById("searchText");

	if (!searchBtn || !searchInput) return;

	searchBtn.addEventListener("click", function () {
		const query = searchInput.value.trim();
		if (query !== "") {
			window.location.href = contextPath +`/main.do?search=${encodeURIComponent(query)}`;
		}
	});

	searchInput.addEventListener("keypress", function (e) {
		if (e.key === "Enter") {
			searchBtn.click();
		}
	});
};




function downloadDropdown(){
	const dropdown = document.getElementById("downloadDropdown");
	
	document.querySelectorAll(".download-icon").forEach(icon => {
		icon.addEventListener("click", (e) => {
			currentSurveyId = e.target.dataset.id; // ← 설문 ID 저장

			const rect = e.target.getBoundingClientRect();
			dropdown.style.left = `${rect.right + window.scrollX}px`;
			dropdown.style.top = `${rect.top + window.scrollY}px`;
			dropdown.classList.remove("d-none");
		});
	});
  
  	// 드롭다운 이외 화면 클릭 시 종료
	document.addEventListener("click", (e) => {
	    if (!e.target.closest(".download-icon") && !dropdown.contains(e.target)) {
	  		dropdown.classList.add("d-none");
		}
	});
	
  	// 드롭다운 내부 요소 클릭 시 종료
	dropdown.querySelectorAll(".dropdown-item").forEach(item => {
		item.addEventListener("click", () => {
			dropdown.classList.add("d-none");
		});
	});
	

	
};

function bindDownload(){
	// pdf 다운로드 버튼 클릭 시
	document.getElementById("pdfDownBtn").addEventListener("click", function () {
		Swal.fire({
			title: "PDF 다운로드 버튼 클릭 확인",
			icon: "success"
		});
		return;
	});

	// 엑셀 다운로드 버튼 클릭 시
	document.getElementById("excelDownBtn").addEventListener("click", function () {
	if (!currentSurveyId) {
		Swal.fire("설문 ID를 찾을 수 없습니다.", "", "error");
		return;
	}

	// 다운로드 링크 이동 (GET 요청)
	window.location.href = `${contextPath}/survey/${currentSurveyId}/responses/excel`;
	});	

	
	// URL 공유
	document.getElementById("shareUrlBtn").addEventListener("click", function () {
	if (!currentSurveyId) {
		Swal.fire("설문 ID를 찾을 수 없습니다.", "", "error");
		return;
	}
	const shareUrl = `${window.location.origin}${contextPath}/response.do?id=${currentSurveyId}`;

	// 클립보드 API 사용 가능 여부 확인
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(shareUrl)
			.then(() => {
				Swal.fire("URL이 클립보드에 복사되었습니다!", shareUrl, "success");
			})
			.catch(err => {
				console.error("클립보드 복사 실패:", err);
				Swal.fire("클립보드 복사에 실패했습니다.", "", "error");
			});
	} else {
		// fallback 방식
		const textarea = document.createElement("textarea");
		textarea.value = shareUrl;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);

		Swal.fire("URL이 클립보드에 복사되었습니다!", shareUrl, "success (fallback)");
	}
	});
};

