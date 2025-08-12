// 설문지 상세보기 JS 페이지
document.addEventListener("DOMContentLoaded", initSurveyApp);

function initSurveyApp() {

};










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



