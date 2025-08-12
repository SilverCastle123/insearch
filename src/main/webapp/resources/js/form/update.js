document.addEventListener("DOMContentLoaded", initSurveyApp);

let questionNum = 0; // 문항번호

function initSurveyApp() {
  const surveyId = document.getElementById("surveyId")?.value;
  if (!surveyId) {
    alert("surveyId를 찾을 수 없습니다.");
    return;
  }

	bindTopNav(); 				// 상단 네비 호출
	bindCreateQuestion(); 		// 문항 추가 호출
	deleteQuestion();			// 문항 삭제 호출
	bindDragEvent();			// 드래그 이벤트 호출
	bindRadioChoice();			// 객관식 관련 호출
	bindGridQuestion();			// 그리드 레이아웃 호출
	getGridQuestionHtml();		// 그리드 문항상세 호출
	bindCtrlPanelFollowScroll();// 스크롤 따라라오는 우측패널 호출
	bindPreviewBtn();			// 미리보기 모달

	
   loadSurveyData(surveyId);

  document.querySelectorAll(".saveBtn").forEach(btn => {
    btn.addEventListener("click", handleUpdateClick);
  });

}

function bindTopNav() {
  // 공통 섹션 전환 함수
  function showSection(targetClass) {
    // 모든 섹션 숨김
    document.querySelectorAll(".basicInf, .question, .closing, .complete").forEach(sec =>
      sec.classList.add("d-none")
    );

    // 대상 섹션 표시
    const targetSection = document.querySelector(targetClass);
    if (targetSection) {
      targetSection.classList.remove("d-none");
    }

    // 네비게이션 상태 반영
    document.querySelectorAll(".init-nav a").forEach(a => {
      if (a.getAttribute("data-target") === targetClass) {
        a.classList.add("fw-bold", "text-primary");
      } else {
        a.classList.remove("fw-bold", "text-primary");
      }
    });

    // 컨트롤러 표시/숨김
    const questionCtrl = document.getElementById("questionCtrl");
    const respInfoCtrl = document.getElementById("respInfoCtrl");

    if (targetClass === ".question") {
      questionCtrl.classList.remove("d-none");
      respInfoCtrl.classList.add("d-none");
    } else if (targetClass === ".respInfo") {
      questionCtrl.classList.add("d-none");
      respInfoCtrl.classList.remove("d-none");
    } else {
      questionCtrl.classList.add("d-none");
      respInfoCtrl.classList.add("d-none");
    }

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 네비게이션 클릭 시
  document.querySelectorAll(".init-nav a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSelector = this.getAttribute("data-target");
      showSection(targetSelector);
    });
  });

  // 다음 버튼 클릭 시
  document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const targetClass = btn.getAttribute("data-target");
      showSection(targetClass);
    });
  });

  // 이전 버튼 클릭 시
  document.querySelectorAll(".prev-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const targetClass = btn.getAttribute("data-target");
      showSection(targetClass);
    });
  });
}

function bindCtrlPanelFollowScroll() {
	const panel = document.querySelector('.ctrl-panel');
	if (!panel) return;

	let lastScrollY = window.scrollY;
	let currentY = lastScrollY;

	function animateFollowScroll() {
		const diff = lastScrollY - currentY;
		currentY += diff * 0.1;

		panel.style.transform = `translateY(${currentY}px)`;
		requestAnimationFrame(animateFollowScroll);
	}

	window.addEventListener('scroll', () => {
		lastScrollY = window.scrollY;
	});

	animateFollowScroll();
}

function bindCreateQuestion(){
	document.querySelectorAll(".addQuestionBtn").forEach(btn => {
		 btn.addEventListener("click", function () {
	    const questionNum = getNextQuestionNumber();
	    const type = this.id;
	    let questionHtml = "";
	
	    if (type === "objectV") {
	      	// 객관식 '세로' 문항 --------------------------------------------------------------------
	      	questionHtml =`
			<div class="p-2 mt-3 draggable" data-question="${questionNum}" data-type="objectV">

				<!-- 문항 헤더 -->
				<div class="d-flex justify-content-between align-items-center mb-2">
					<div class="fw-bold">문항 ${questionNum}</div>
					<div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
				</div>
				
				<!-- 문항 제목 영역 -->
				<input type="text" name="question_${questionNum}" class="form-control mb-2" placeholder="질문 내용을 입력하세요">
				
				<!-- 보기 영역 -->
			    <div class="choice-list mb-2">
			    	${[1,2].map(() => `
					    <div class="d-flex align-items-center mb-1 choice-item">
					    	<input type="radio" name="question_${questionNum}" class="me-2">
					    	<input type="text" class="form-control me-2" placeholder="보기 내용을 입력하세요">
					    	<button type="button" class="btn btn-sm btn-outline-danger delete-choice-btn">✕</button>
					    </div>
					`).join('')}
			    </div>
			    
				<!-- 버튼 영역 -->
				<div class="d-flex justify-content-between align-items-center mt-2">
					<button type="button" class="btn btn-sm btn-outline-secondary add-choice-btn">+ 보기 추가</button>
					<button type="button" class="btn btn-sm btn-danger delete-btn">문항 삭제</button>
				</div>
			</div>
	      	`;
	    } else if (type === "objectH") {
	      	// 객관식 '가로' 문항 ---------------------------------------------------------------------
	      	questionHtml =`
			<div class="p-2 mt-3 draggable" data-question="${questionNum}" data-type="objectH">
				
				<!-- 문항 헤더 -->
				<div class="d-flex justify-content-between align-items-center mb-2">
					<div class="fw-bold">문항 ${questionNum}</div>
					<div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
				</div>
				
				<!-- 문항 제목 영역 -->
				<input type="text" name="question_${questionNum}" class="form-control mb-2" placeholder="질문 내용을 입력하세요">
				
				<!-- 보기 영역 -->
			    <div class="choice-list d-flex flex-wrap gap-2 mb-2">
			    	${[1,2].map(() => `
					    <div class="d-flex align-items-center choice-item">
					    	<input type="radio" name="question_${questionNum}" class="me-2">
					    	<input type="text" class="form-control me-2" placeholder="보기 내용을 입력하세요">
					    	<button type="button" class="btn btn-sm btn-outline-danger delete-choice-btn">✕</button>
					    </div>
					`).join('')}
			    </div>
			    
				<!-- 버튼 영역 -->
				<div class="d-flex justify-content-between align-items-center mt-2">
					<button type="button" class="btn btn-sm btn-outline-secondary add-choice-btn">+ 보기 추가</button>
					<button type="button" class="btn btn-sm btn-danger delete-btn">문항 삭제</button>
				</div>
			</div>
	      	`;
	    } else if (type === "subject") {
	      	// 주관식 문항 ---------------------------------------------------------------------------
	      	questionHtml = `
			<div class="p-2 mt-3 draggable" data-question="${questionNum}" data-type="subject">
				
				<!-- 문항 헤더 -->
				<div class="d-flex justify-content-between align-items-center mb-2">
	        		<div class="mb-2 fw-bold">문항 ${questionNum}</div>
	        		<div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
	        	</div>
	        	
	        	<!-- 문항 제목 영역 -->
	          	<input type="text" name="question_${questionNum}" class="form-control mb-2" placeholder="질문 내용을 입력하세요">
	          	
	          	<!-- 응답 영역 -->
          		<textarea class="form-control" placeholder="답변 입력란" disabled></textarea>
				
				<!-- 버튼 영역 -->
				<div class="choice-btn text-end">
	          		<button type="button" class="btn btn-sm btn-danger mt-2 delete-btn")">문항 삭제</button>
	          	</div>	
	        </div>
	      	`;

	    } else if (type === "grid") {
	      	// 그리드 문항 ----------------------------------------------------------------------------
	      	questionHtml = getGridQuestionHtml(questionNum, "agree", 5,); // "satisfy", "truth" // "5", "7"
	    } else if (type === "section") {
			  // 중제목(섹션 타이틀)
			  questionHtml = `
			    <div class="p-2 mt-3 draggable bg-light border rounded" data-question="${questionNum}" data-type="section">
			      <div class="d-flex justify-content-between align-items-center mb-2">
			        <div class="fw-bold">중제목 ${questionNum}</div>
			        <div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
			      </div>
			      <input type="text" name="section_${questionNum}" class="form-control" placeholder="중제목 내용을 입력하세요">
			      <div class="text-end mt-2">
			        <button type="button" class="btn btn-sm btn-danger delete-btn">중제목 삭제</button>
			      </div>
			    </div>
			  `;
		}

	    document.getElementById("questionArea").insertAdjacentHTML("beforeend", questionHtml);
	    updateSaveButtonVisibility();
	  });
	});
}
	

function deleteQuestion(){
	document.getElementById("questionArea").addEventListener("click", function (e) {
		if (e.target.classList.contains("delete-btn")) {
			const card = e.target.closest(".draggable");
			if (!card) return;
	
			const num = parseInt(card.getAttribute("data-question"));
			if (isNaN(num)) return;
	
			Swal.fire({
				title: '문항을 삭제하시겠습니까?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#aaa',
				confirmButtonText: '삭제',
				cancelButtonText: '취소'
			}).then((result) => {
				if (result.isConfirmed) {
					card.remove();
					renumberQuestions();
					updateSaveButtonVisibility();
				}
			});
		}
	});
}
	

// 문항이 하나도 없을 때 '설문저장' 버튼 숨김
function updateSaveButtonVisibility() {
  const hasQuestions = document.querySelectorAll("#questionArea .draggable").length > 0;
  const notice = document.getElementById("questionNotice");
  const saveWrap = document.getElementById("saveSurveyWrap");

  if (hasQuestions) {
    notice.classList.add("d-none");
    saveWrap.classList.remove("d-none");
  } else {
    notice.classList.remove("d-none");
    saveWrap.classList.add("d-none");
  }
}	
	
	
function bindDragEvent(){
	document.addEventListener("dragstart", function (e) {
		const handle = e.target.closest(".drag-handle");
		if (!handle) return;
		
		const card = handle.closest(".draggable");
		if (card) {
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/plain", "");
			card.classList.add("dragging");
		}
	});
	
	document.addEventListener("dragend", function () {
		const card = document.querySelector(".dragging");
		if (card) {
			card.classList.remove("dragging");
			renumberQuestions();
		}
	});

	document.getElementById("questionArea").addEventListener("dragover", function (e) {
		e.preventDefault();
		const container = e.currentTarget;
		const dragging = document.querySelector(".dragging");
		const afterElement = getDragAfterElement(container, e.clientY);
		
		if (!afterElement) {
			container.appendChild(dragging);
		} else {
			container.insertBefore(dragging, afterElement);
		}
	});

	function getDragAfterElement(container, y) {
		const elements = [...container.querySelectorAll(".draggable:not(.dragging)")];
			return elements.reduce((closest, el) => {
			const box = el.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			return offset < 0 && offset > closest.offset ? { offset, element: el } : closest;
		}, { offset: Number.NEGATIVE_INFINITY }).element;
	}
}


function getNextQuestionNumber() {
	const cards = document.querySelectorAll("#questionArea .draggable");
	let max = 0;
	cards.forEach(card => {
		const n = parseInt(card.getAttribute("data-question"), 10);
		if (!isNaN(n) && n > max) max = n;
	});
	return max + 1;
}

function renumberQuestions() {
  const items = document.querySelectorAll("#questionArea .draggable");
  items.forEach((el, idx) => {
    const num = idx + 1;
    el.setAttribute("data-question", num);

    // input name 갱신 (주관식)
    const input = el.querySelector("input[name^='question_']");
    if (input) input.name = `question_${num}`;

    // 텍스트 라벨 갱신
    const type = el.getAttribute("data-type");
    const label = el.querySelector(".fw-bold");
    if (label) {
      if (type === "subject") label.textContent = `문항 ${num}`;
      else if (type === "objectV") label.textContent = `문항 ${num}`;
      else if (type === "objectH") label.textContent = `문항 ${num}`;
      else if (type === "grid") label.textContent = `문항 ${num}`;
      else if (type === "section") label.textContent = `중제목 ${num}`;
    }
  });
}


function bindRadioChoice(){
	// 보기추가 코드 
	document.getElementById("questionArea").addEventListener("click", function (e) {
	  if (e.target.classList.contains("add-choice-btn")) {
	    const wrapper = e.target.closest(".draggable");
	    const choiceList = wrapper.querySelector(".choice-list");
	    const questionNum = wrapper.getAttribute("data-question");
	
	    const choiceItem = document.createElement("div");
	    choiceItem.className = "d-flex align-items-center mb-1 choice-item";
	    choiceItem.innerHTML = `
  		<input type="radio" name="question_${questionNum}" class="me-2">
  		<input type="text" class="form-control me-2" placeholder="보기 내용을 입력하세요">
		<button type="button" class="btn btn-sm btn-outline-danger delete-choice-btn">✕</button>
	    `;
	    choiceList.appendChild(choiceItem);
	  }
	});
	
	// 보기삭제 코드
	document.getElementById("questionArea").addEventListener("click", function (e) {
		if (e.target.classList.contains("delete-choice-btn")) {
			const wrapper = e.target.closest(".draggable");
			const items = wrapper.querySelectorAll(".choice-item");
			if (items.length <= 2) {
				Swal.fire({
					title: "최소 2개 필요합니다",
					icon: "error"
				});
				return;
			}
			const item = e.target.closest(".choice-item");
			if (item) item.remove();
		}
	});
};

// 척도 유형, 척도 몇 형인지 세팅 전역변수
const scaleOptions = {
	agree: {
		label: "동의 여부",
		labels: {
			5: ["전혀 동의하지 않음", "동의하지 않음", "보통이다", "동의함", "매우 동의함"],
			7: ["전혀 동의하지 않음", "동의하지 않음", "약간 동의하지 않음", "보통이다", "약간 동의함", "동의함", "매우 동의함"]
		}
	},
	satisfy: {
		label: "만족도",
		labels: {
			5: ["매우 불만족", "불만족", "보통이다", "만족", "매우 만족"],
			7: ["매우 불만족", "불만족", "다소 불만족", "보통이다", "다소 만족", "만족", "매우 만족"]
		}
	},
	truth: {
		label: "사실 여부",
		labels: {
			5: ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"],
			7: ["전혀 그렇지 않다", "그렇지 않다", "약간 그렇지 않다", "보통이다", "약간 그렇다", "그렇다", "매우 그렇다"]
		}
	},
	importance: {
		label: "중요도",
		labels: {
			5: ["전혀 중요하지 않음", "중요하지 않음", "보통이다", "중요함", "매우 중요함"],
			7: ["전혀 중요하지 않음", "중요하지 않음", "다소 중요하지 않음", "보통이다", "다소 중요함", "중요함", "매우 중요함"]
		}
	},
	use: {
		label: "사용 빈도",
		labels: {
			5: ["전혀 중요하지 않음", "거의 사용하지 않음", "보통이다", "매우 자주 사용함", "항상 사용함"],
			7: ["전혀 사용하지 않음", "거의 시용하지 않음", "가끔 사용함", "보통이다", "자주 사용함", "매우 자주 사용함", "항상 사용함"]
		}			
	},
	action: {
		label: "행동 의향",
		labels: {
			5: ["절대 아니다", "아니다", "보통이다", "그렇다", "매우 그렇다"],
			7: ["절대 아니다", "아니다", "그럴 가능성 낮음", "보통이다", "그럴 가능성 있음", "그렇다", "매우 그렇다"]
		}								
	}
	
};

function getGridQuestionHtml(questionNum, scaleType = "agree", scaleSize = 5,content="", categories = []) {
	


  const labels = scaleOptions[scaleType].labels[scaleSize];

  let headerHtml = labels.map((label, i) => `
    <th class="text-center">
      <div>${escapeHtml(label)}</div>
      <div>(${i + 1})</div>
    </th>
  `).join("");

  // tbody 행들 생성 (categories가 없으면 기본 3행 생성)
  let tbodyRowsHtml = "";
  if (categories.length > 0) {
    tbodyRowsHtml = categories
      .slice()
      .sort((a, b) => Number(a.categoryOrder) - Number(b.categoryOrder))
      .map((cat, idx) => `
        <tr class="question-row">
          <td class="d-flex align-items-center gap-1">
            <button type="button" class="btn btn-sm btn-outline-danger delete-grid-row">✕</button>
            <input type="text" class="form-control form-control-sm question-text" placeholder="질문 입력" value="${escapeHtml(cat.content)}">
          </td>
          ${labels.map((_, i) => `
            <td class="text-center">
              <input type="radio" name="grid_${questionNum}_row${idx + 1}" value="${i + 1}" >
            </td>`).join("")}
        </tr>
      `).join("");
  } else {
    tbodyRowsHtml = [1, 2, 3].map(rowIdx => `
      <tr class="question-row">
        <td class="d-flex align-items-center gap-1">
          <button type="button" class="btn btn-sm btn-outline-danger delete-grid-row">✕</button>
          <input type="text" class="form-control form-control-sm question-text" placeholder="질문 입력">
        </td>
        ${labels.map((_, i) => `
          <td class="text-center">
            <input type="radio" name="grid_${questionNum}_row${rowIdx}" value="${i + 1}" >
          </td>`).join("")}
      </tr>
    `).join("");
  }

  return `
  <div class="p-2 mt-3 draggable" data-question="${questionNum}" data-type="grid"
       data-scale-type="${scaleType}" data-scale-size="${scaleSize}">
  
    <!-- 문항 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="mb-2 fw-bold">문항 ${questionNum}</div>
      <div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
    </div>
    
    <!-- 척도 설정 -->
    <div class="d-flex align-items-center gap-2 mb-2">
      <label>척도 유형:</label>
      <select class="form-select form-select-sm w-auto grid-scale-type">
        <option value="agree" ${scaleType === "agree" ? "selected" : ""}>동의 여부</option>
        <option value="satisfy" ${scaleType === "satisfy" ? "selected" : ""}>만족도</option>
        <option value="truth" ${scaleType === "truth" ? "selected" : ""}>사실 여부</option>
        <option value="importance" ${scaleType === "importance" ? "selected" : ""}>중요도</option>
        <option value="use" ${scaleType === "use" ? "selected" : ""}>사용 빈도</option>
        <option value="action" ${scaleType === "action" ? "selected" : ""}>행동 의향</option>
      </select>
    
      <label>척도 수:</label>
      <select class="form-select form-select-sm w-auto grid-scale-size">
        <option value="5" ${scaleSize == 5 ? "selected" : ""}>5단</option>
        <option value="7" ${scaleSize == 7 ? "selected" : ""}>7단</option>
      </select>
    </div>
    
    <!-- 그리드 테이블 -->
    <div class="mb-2">
      <input type="text" class="form-control form-control-sm question-text" placeholder="중분류 입력" value="${escapeHtml(content)}">
    </div>
    
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle grid-table">
        <thead>
          <tr>
            <th class="align-middle"></th>
            ${headerHtml}
          </tr>
        </thead>
        <tbody>
          ${tbodyRowsHtml}
        </tbody>
      </table>
    </div>
    
    <div class="d-flex justify-content-between align-items-center mt-2">
      <button type="button" class="btn btn-sm btn-outline-secondary add-grid-row">+ 항목 추가</button>
      <button type="button" class="btn btn-sm btn-danger delete-btn">문항 삭제</button>
    </div>
  </div>
  `;
}


function bindGridQuestion() {
	document.getElementById("questionArea").addEventListener("click", function (e) {
		if (e.target.classList.contains("add-grid-row")) {
			const card = e.target.closest(".draggable");
			const table = card.querySelector(".grid-table tbody");
			const questionNum = card.getAttribute("data-question");
			const scaleSize = parseInt(card.querySelector(".grid-scale-size").value);
			
			const newRowIndex = table.querySelectorAll(".question-row").length + 1;
			const rowHtml = document.createElement("tr");
			rowHtml.className = "question-row";
			
			const textCell = document.createElement("td");
			textCell.className = "d-flex align-items-center gap-1";
			textCell.innerHTML = `
			<button type="button" class="btn btn-sm btn-outline-danger delete-grid-row">✕</button>	
			<input type="text" class="form-control form-control-sm question-text" placeholder="질문 입력">
			`;
			
			rowHtml.appendChild(textCell);
			for (let i = 1; i <= scaleSize; i++) {
				const cell = document.createElement("td");
				cell.className = "text-center";
				cell.innerHTML = `<input type="radio" name="grid_${questionNum}_row${newRowIndex}" value="${i}">`;
				rowHtml.appendChild(cell);
			}
			table.appendChild(rowHtml);
		}
		
		// 그리드질문 삭제
		if (e.target.classList.contains("delete-grid-row")) {
			const row = e.target.closest("tr");
			const tbody = row.closest("tbody");
			const rowCount = tbody.querySelectorAll(".question-row").length;
			if (rowCount <= 1) {
				Swal.fire({
					title: "최소 1개 필요합니다",
					icon: "error"
				});
				return;
			}
			if (row) row.remove();
		}
	});
	
	document.getElementById("questionArea").addEventListener("change", function (e) {
		  if (e.target.classList.contains("grid-scale-type") || e.target.classList.contains("grid-scale-size")) {
		    const card = e.target.closest(".draggable");
		    const questionNum = card.getAttribute("data-question");
		    const type = card.querySelector(".grid-scale-type").value;
		    const size = parseInt(card.querySelector(".grid-scale-size").value);
		
		    // 새 HTML 전체 받아오기
		    const newHtml = getGridQuestionHtml(questionNum, type, size);
		
		    // 새 HTML에서 최상위 div 제거 (wrapper div)
		    const temp = document.createElement("div");
		    temp.innerHTML = newHtml;
		    const innerContent = temp.firstElementChild.innerHTML;
		
		    // 내부 내용만 교체 (속성은 유지)
		    card.innerHTML = innerContent;
		  }
	});
}






// 미리보기 모달
function bindPreviewBtn() {
	const previewModalEl = document.getElementById("previewModal");
    const previewModal = new bootstrap.Modal(previewModalEl);
    
    previewModalEl.addEventListener("hide.bs.modal", function () {
    if (previewModalEl.contains(document.activeElement)) {
      document.activeElement.blur(); // 포커스 제거
    }
  });

  document.querySelectorAll(".surveyDetailBtn").forEach(function (btn) {


    btn.addEventListener("click", function () {
		btn.blur(); 


      // 미리보기 내용 초기화
      const previewContent = document.getElementById("previewContent");
      previewContent.innerHTML = "";

      // 기본정보(제목, 인사말, 마감일) 가져오기
      const title = document.getElementById("searchText")?.value || "";
      const greeting = document.querySelector(".basicInf textarea")?.value || "";
      const closingDate = document.getElementById("closingDate")?.value || "";

      // 기본정보 섹션 생성 및 추가
      const infoSection = document.createElement("div");
      infoSection.innerHTML = `
        <h5 class="fw-bold">기본정보</h5>
        <p><strong>제목:</strong> ${title}</p>
        <p><strong>인사말:</strong> ${greeting.replace(/\n/g, "<br>")}</p>
        <p><strong>마감일:</strong> ${closingDate}</p>
        <hr />
      `;
      previewContent.appendChild(infoSection);

      // 질문 클론 생성 (버튼 기준 가장 가까운 .question-box 또는 전체 영역)
      const questionBox = btn.closest(".question-box") || document.getElementById("questionArea");
      const questionClone = questionBox ? questionBox.cloneNode(true) : null;

      if (questionClone) {
        // 드래그 핸들 제거
        questionClone.querySelectorAll(".drag-handle").forEach(el => el.remove());

        // 편집 관련 요소 숨김
        const selectorsToHide = [
          "button",
          ".addChoiceBtn",
          ".removeChoiceBtn",
          ".remove-question",
          ".btn",
          ".dragHandle",
          ".question-number",
          ".questionNum",
          ".sortableHandle"
        ];
        selectorsToHide.forEach(sel => {
          questionClone.querySelectorAll(sel).forEach(el => {
            el.style.display = "none";
          });
        });

        // 척도 관련 라벨 및 입력 요소 숨김
        questionClone.querySelectorAll("label").forEach(label => {
          const text = label.textContent.trim();
          if (text.includes("척도") || text.includes("척도유형") || text.includes("척도수")) {
            label.style.display = "none";
            const next = label.nextElementSibling;
            if (next && (next.tagName === "SELECT" || next.tagName === "INPUT")) {
              next.style.display = "none";
            }
          }
        });

        // 질문 제목 숨김
        const titleEl = questionClone.querySelector("h5.fw-bold");
        if (titleEl) {
          titleEl.style.display = "none";
        }

        // 입력요소 비활성화 처리 (답변용 텍스트영역과 라디오 제외)
        questionClone.querySelectorAll("input, textarea, select").forEach(el => {
          const tag = el.tagName;
          const type = el.type;
          const isSubjectAnswer = tag === "TEXTAREA" && el.placeholder === "답변 입력란";
          const isRadio = type === "radio";
          if (isSubjectAnswer || isRadio) {
            el.removeAttribute("disabled");
          } else {
            el.setAttribute("disabled", true);
          }
        });

        previewContent.appendChild(questionClone);
      }

      // 맺음말 섹션 추가
      const closingText = document.getElementById("closingMessage")?.value || "";
      const closingSection = document.createElement("div");
      closingSection.innerHTML = `
        <hr />
        <h5 class="fw-bold">맺음말</h5>
        <p>${closingText.replace(/\n/g, "<br>")}</p>
      `;
      previewContent.appendChild(closingSection);
	
	
	  
      // 모달 표시
      previewModal.show();

      // 모달 닫힌 후 원래 버튼으로 포커스 이동 (접근성)
      previewModalEl.addEventListener("hidden.bs.modal", function onHidden() {
        btn.focus();
        previewModalEl.removeEventListener("hidden.bs.modal", onHidden);
      });
    });
  });
}


function addChoice(questionDiv) {
  if (!questionDiv) return;
  const choiceList = questionDiv.querySelector(".choice-list");
  if (!choiceList) return;
  const questionNum = questionDiv.getAttribute("data-question");
  const choiceHtml = `
    <div class="d-flex align-items-center mb-1 choice-item">
      <input type="radio" name="question_${questionNum}" disabled>
      <input type="text" class="form-control me-2" placeholder="보기 내용을 입력하세요">
      <button type="button" class="btn btn-sm btn-outline-danger delete-choice-btn">✕</button>
    </div>
  `;
  choiceList.insertAdjacentHTML("beforeend", choiceHtml);
}

//날짜 포멧
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// 서버에서 설문 데이터 불러오기 및 화면 렌더링
function loadSurveyData(surveyId) {
  fetch(contextPath +`/api/surveys/${surveyId}`)
    .then(res => res.ok ? res.json() : Promise.reject("설문 데이터를 불러오지 못했습니다."))
    .then(data => {
	  console.log("questions data:", data.questions);
      document.getElementById("searchText").value = data.title || "";
      document.querySelector(".basicInf textarea").value = data.description || "";
      document.getElementById("closingMessage").value = data.closingMessage || "";
      document.getElementById("closingDate").value = formatDate(data.closingDate || new Date());
      renderQuestions(data.questions || []);
      
      const sortedQuestions = (data.questions || []).slice().sort(
        (a, b) => Number(a.questionOrder) - Number(b.questionOrder)
      );
      
      renderQuestions(sortedQuestions);
      updateSaveButtonVisibility();
    })
    .catch(err => Swal.fire("데이터 로드 실패", err, "error"));
    
}

function renderQuestions(questions) {
  const questionArea = document.getElementById("questionArea");
  questionArea.innerHTML = "";
  questionNum = 0;
  
  


  questions.forEach((q, idx) => {
    const num = idx + 1;
    questionNum = num;

    let html = "";
    if (q.type === "objectV") {
      html = `
      <div class="p-2 mt-3 draggable" data-question="${num}" data-type="objectV">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-bold">문항 ${num}</div>
          <div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
        </div>
        <input type="text" class="form-control mb-2" placeholder="질문 내용을 입력하세요" value="${escapeHtml(q.content)}">
        <div class="choice-list mb-2">
	      ${q.choices
	        .slice()
	        .sort((a, b) => Number(a.choiceOrder) - Number(b.choiceOrder))
	        .map(c => `
            <div class="d-flex align-items-center mb-1 choice-item">
              <input type="radio" name="question_${num}" class="me-2">
              <input type="text" class="form-control me-2" placeholder="보기 내용을 입력하세요" value="${escapeHtml(c.content)}">
              <button type="button" class="btn btn-sm btn-outline-danger delete-choice-btn">✕</button>
            </div>
          `).join("")}
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <button type="button" class="btn btn-sm btn-outline-secondary add-choice-btn">+ 보기 추가</button>
          <button type="button" class="btn btn-sm btn-danger delete-btn">문항 삭제</button>
        </div>
      </div>
      `;
    } else if (q.type === "objectH") {
      html = `
      <div class="p-2 mt-3 draggable" data-question="${num}" data-type="objectH">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-bold">문항 ${num}</div>
          <div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
        </div>
        <input type="text" class="form-control mb-2" placeholder="질문 내용을 입력하세요" value="${escapeHtml(q.content)}">
        <div class="choice-list d-flex flex-wrap gap-2 mb-2">
	      ${q.choices
	        .slice()
	        .sort((a, b) => Number(a.choiceOrder) - Number(b.choiceOrder))
	        .map(c => `
            <div class="d-flex align-items-center choice-item">
              <input type="radio" name="question_${num}" class="me-2">
              <input type="text" class="form-control me-2" placeholder="보기 내용을 입력하세요" value="${escapeHtml(c.content)}">
              <button type="button" class="btn btn-sm btn-outline-danger delete-choice-btn">✕</button>
            </div>
          `).join("")}
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <button type="button" class="btn btn-sm btn-outline-secondary add-choice-btn">+ 보기 추가</button>
          <button type="button" class="btn btn-sm btn-danger delete-btn">문항 삭제</button>
        </div>
      </div>
      `;
    } else if (q.type === "subject") {
      html = `
      <div class="p-2 mt-3 draggable" data-question="${num}" data-type="subject">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-bold">문항 ${num}</div>
          <div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
        </div>
        <input type="text" class="form-control mb-2" placeholder="질문 내용을 입력하세요" value="${escapeHtml(q.content)}">
        <textarea class="form-control" placeholder="답변 입력란" disabled></textarea>
        <div class="text-end mt-2">
          <button type="button" class="btn btn-sm btn-danger delete-btn">문항 삭제</button>
        </div>
      </div>
      `;
    } else if (q.type === "grid") {
  html = getGridQuestionHtml(num, q.scaleType, q.scaleSize, q.content, q.categories);
    } else if (q.type === "section") {
      html = `
      <div class="p-2 mt-3 draggable bg-light border rounded" data-question="${num}" data-type="section">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-bold">중제목 ${num}</div>
          <div class="drag-handle" draggable="true" style="cursor: move;">⠿</div>
        </div>
        <input type="text" class="form-control" placeholder="중제목 내용을 입력하세요" value="${escapeHtml(q.content)}">
        <div class="text-end mt-2">
          <button type="button" class="btn btn-sm btn-danger delete-btn">중제목 삭제</button>
        </div>
      </div>
      `;
    }
    questionArea.insertAdjacentHTML("beforeend", html);
  });
}

function handleUpdateClick() {
  const surveyId = Number(document.getElementById("surveyId")?.value);
  const title = document.getElementById("searchText")?.value.trim() || "";
  const description = document.getElementById("greetingText")?.value.trim() || "";
  const endDate = document.getElementById("closingDate")?.value || "";
  const closingMessage = document.getElementById("closingMessage")?.value.trim() || "";

  const questions = collectQuestionData();
  

  if (!title || !endDate) {
    Swal.fire("필수 항목 누락", "제목, 종료일을 입력하세요.", "warning");
    return;
  }

  const surveyData = {
    title,
    description,
    closingDate: endDate,
    closingMessage,
    questions
    
  };

  fetch(contextPath+`/api/surveys/${surveyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(surveyData)
  })
  .then(res => {
    if (!res.ok) throw new Error("서버 오류");
    return res.text(); // 텍스트 메시지 받기
  })
  .then(msg => {
  Swal.fire("수정 완료", msg || "설문이 성공적으로 수정되었습니다.", "success")
    .then(() => location.href = contextPath+"/main.do");
})
  .catch(err => {
    console.error(err);
    Swal.fire("오류", "수정 요청 중 오류가 발생했습니다.", "error");
    console.log("보낼 surveyData:", JSON.stringify(surveyData, null, 2));
  });
}

function collectQuestionData() {
  const questionElements = document.querySelectorAll("#questionArea .draggable");
  const questions = [];

  questionElements.forEach((el, idx) => {
    const type = el.dataset.type;
    const content = el.querySelector("input[type='text'], textarea")?.value.trim() || "";
    const question = { 
      type, 
      content, 
      questionOrder: idx + 1  // DTO에 맞춰서 questionOrder로 변경
    };

    if (type === "objectV" || type === "objectH") {
      const choices = [];
      el.querySelectorAll(".choice-list .choice-item").forEach((item, i) => {
        const choiceContent = item.querySelector("input[type='text']").value.trim();
        if (choiceContent) {
          choices.push({ 
            content: choiceContent, 
            choiceOrder: i + 1  // DTO에 맞춰서 choiceOrder로 변경
          });
        }
      });
      question.choices = choices;

    } else if (type === "grid") {
      const scaleType = el.querySelector(".grid-scale-type")?.value || "agree";
      const scaleSize = parseInt(el.querySelector(".grid-scale-size")?.value) || 5;
      const categories = [];

      el.querySelectorAll(".grid-table tbody tr.question-row").forEach((row, rowIndex) => {
        const categoryContent = row.querySelector("input.question-text")?.value.trim() || "";
        if (categoryContent) {
          categories.push({
            content: categoryContent,
            categoryOrder: rowIndex + 1
          });
        }
      });

      question.scaleType = scaleType;
      question.scaleSize = scaleSize;
      question.categories = categories;
    } else if (type === "section") {
      // 중제목은 content만 있음
    }

    questions.push(question);
  });

  return questions;
}



function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, m => {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return m;
    }
  });
  
 
}
