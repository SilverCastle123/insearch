// 설문지 상세보기 JS 페이지
document.addEventListener("DOMContentLoaded", initSurveyApp);

function initSurveyApp() {
	updateBtn();		// 수정 버튼
	deleteBtn();		// 삭제 버튼
};


function updateBtn() {
  const btn = document.getElementById("updateBtn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    // 수정 페이지로 이동
    const surveyId = document.getElementById("surveyId").value;
    window.location.href = contextPath +`/update.do?id=${surveyId}`;
  });
}


function deleteBtn() {
  const btn = document.getElementById("deleteBtn");

  if (btn) {
    btn.addEventListener("click", function () {
      Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: "이 설문은 복구할 수 없습니다.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then((result) => {
        if (result.isConfirmed) {
          const surveyId = new URLSearchParams(location.search).get("id");

          fetch(contextPath +`/api/surveys/${surveyId}`, {
            method: 'DELETE',
          })
            .then(res => {
              if (res.status === 204) {
                Swal.fire('삭제 완료', '', 'success').then(() => {
                  window.location.href = contextPath +'/main.do'; // 목록 페이지로 이동
                });
              } else {
                throw new Error("삭제 실패");
              }
            })
            .catch(err => {
              console.error(err);
              Swal.fire('삭제 실패', '서버 오류가 발생했습니다.', 'error');
            });
        }
      });
    });
  }
}







// 척도 라벨 정의
const scaleOptions = {
    agree: {
        label: "동의 여부",
        labels: {
            5: ["전혀 동의하지 않음", "동의하지 않음", "보통", "동의함", "매우 동의함"],
            7: ["전혀 동의하지 않음", "약간 동의하지 않음", "동의하지 않음", "보통", "동의함", "약간 동의함", "매우 동의함"]
        }
    },
    satisfy: {
        label: "만족도",
        labels: {
            5: ["매우 불만족", "불만족", "보통", "만족", "매우 만족"],
            7: ["매우 불만족", "다소 불만족", "불만족", "보통", "만족", "다소 만족", "매우 만족"]
        }
    },
    truth: {
        label: "사실 여부",
        labels: {
            5: ["전혀 그렇지 않다", "그렇지 않다", "보통", "그렇다", "매우 그렇다"],
            7: ["전혀 그렇지 않다", "약간 그렇지 않다", "그렇지 않다", "보통", "그렇다", "약간 그렇다", "매우 그렇다"]
        }
    },
		importance: {
		label: "중요도",
		labels: {
			5: ["전혀 중요하지 않음", "중요하지 않음", "보통", "중요함", "매우 중요함"],
			7: ["전혀 중요하지 않음", "중요하지 않음", "다소 중요하지 않음", "보통", "다소 중요함", "중요함", "매우 중요함"]
		}
	},
	use: {
		label: "사용 빈도",
		labels: {
			5: ["전혀 중요하지 않음", "거의 사용하지 않음", "보통", "매우 자주 사용함", "항상 사용함"],
			7: ["전혀 사용하지 않음", "거의 시용하지 않음", "가끔 사용함", "보통", "자주 사용함", "매우 자주 사용함", "항상 사용함"]
		}			
	},
	action: {
		label: "행동 의향",
		labels: {
			5: ["절대 아니다", "아니다", "보통", "그렇다", "매우 그렇다"],
			7: ["절대 아니다", "아니다", "그럴 가능성 낮음", "보통", "그럴 가능성 있음", "그렇다", "매우 그렇다"]
		}								
	}
};

// 그리드 테이블 헤더 생성 함수
function renderGridTableHeader(questionOrder, scaleType, scaleSize) {
    const table = document.getElementById(`gridTable_${questionOrder}`);
    if (!table) return;

    const thead = table.querySelector('thead');
    const scale = scaleOptions[scaleType];

    if (!scale) {
        console.warn(`알 수 없는 scaleType: ${scaleType}`);
        return;
    }

    const labels = scale.labels[scaleSize];
    if (!labels) {
        console.warn(`알 수 없는 scaleSize: ${scaleSize} for scaleType: ${scaleType}`);
        return;
    }

    // 헤더 행 생성
    const tr = document.createElement('tr');

    // 첫 번째 빈 헤더 셀
    const thEmpty = document.createElement('th');
    tr.appendChild(thEmpty);

    // 척도 라벨 셀 생성
    labels.forEach(labelText => {
        const th = document.createElement('th');
        th.textContent = labelText;
        tr.appendChild(th);
    });

    // thead에 추가
    thead.appendChild(tr);
}



