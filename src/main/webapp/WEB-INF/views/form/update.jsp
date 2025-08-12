<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String surveyId = request.getParameter("id");
	
	
	String surveyTitle = request.getAttribute("surveyTitle") != null ? (String)request.getAttribute("surveyTitle") : "";
	String description = request.getAttribute("description") != null ? (String)request.getAttribute("description") : "";
	String closingMessage = request.getAttribute("closingMessage") != null ? (String)request.getAttribute("closingMessage") : "";

%>
<html>
<head>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css">

<title>설문지 작성</title>
    
<style type="text/css">
.draggable.dragging {
  opacity: 0.5;
  border: 2px dashed #007bff;
  background-color: #f1f9ff;
}

[data-type="section"] {
  background-color: #f9f9f9;
  border-left: 4px solid #0d6efd;
}

#previewModal textarea {
  margin-top: 0.5rem;
}


</style>
    
</head>




<body>
	<div class="wrapper">
	<jsp:include page="/WEB-INF/views/include/header.jsp" />
	
	<!-- 본문 영역 시작 -->
	<div class="content">
		<nav class="init-nav">
	  		<ol>
			    <li><a href="#" data-target=".basicInf" class="fw-bold text-primary">기본정보 등록</a></li>
			    <li><a href="#" data-target=".question">설문문항 작성</a></li>
			    <li><a href="#" data-target=".closing">맺음말 작성</a></li>
			    <li><a href="#" data-target=".complete">설문저장</a></li>
			</ol>
		</nav>
		
		<!-- 기본정보 등록 -->
		<div class="basicInf">
			<div class="card" style="width: 70%; height: auto;">
				<div id="informationArea">
					<input type="hidden" id="surveyId" value="<%= surveyId %>" />
					<h5 class="fw-bold mb-3">기본정보 등록</h5>
				    <div class="alert alert-info small mb-3">
				    	※ 설문지 제목을 입력해주세요.
				    </div>
					<input type="text" class="form-control mb-3" id="searchText" value="<%= surveyTitle %>" placeholder="설문지 제목 작성..">
					
					<div class="alert alert-info small mb-3">
				    	※ 설문 목적이나 참여 방법 등을 간단히 안내하는 인사말을 작성해 주세요.
				    </div>
					<textarea class="form-control mb-3" id="greetingText" rows="5" placeholder="인사말 작성.."><%= description %></textarea>
					
					<div class="alert alert-info small mb-3">
				        ※  설문 시작일을 선택해 주세요.
				    </div>
				    <input type="date" class="form-control mb-3" id="createdAt" value="${survey.createdAtStr}">
					
					<div class="alert alert-info small mb-3">
				        ※ 설문지 마감일을 선택해 주세요.
				    </div>
				    <input type="date" class="form-control mb-3" id="closingDate" value="${survey.closingDateStr}">
				</div>
				<div class="d-flex justify-content-end mt-3">
					<button type="button" class="btn btn-primary mt-3 saveBtn">수정 저장</button>
			        <button class="btn btn-primary next-btn mt-3" data-target=".question">다음</button>
			    </div>				
			</div>
		</div>
		
		<!-- 설문지 작성 -->
		<div class="question d-none">
			<div class="card" style="width: 70%; height: auto;">
				<div id="questionArea">
					<h5 class="fw-bold mb-3">설문지 작성</h5>
	  			</div>
	  			
	  			<div class="d-flex justify-content-center">
	  				<div class="alert alert-danger small mb-3" id="questionNotice">
	  					우측 패널을 이용하여 설문 문항을 등록하여주세요.
	  				</div>
<!-- 	  				<div class="saveBtn d-none" id="saveSurveyWrap"> -->
<!-- 		  				<button type="button" class="btn btn-primary mt-3" id="saveSurveyBtn">미리보기</button> -->
<!-- 	  				</div> -->
	  			</div>
	  			<div class="d-flex justify-content-between mt-3">
				   <button class="btn btn-secondary prev-btn mt-3" data-target=".basicInf">이전</button>
				   <button type="button" class="btn btn-primary mt-3 saveBtn">수정 저장</button>
				   <button type="button" class="btn btn-primary mt-3 surveyDetailBtn">미리보기</button>
				   <button class="btn btn-primary next-btn mt-3" data-target=".closing">다음</button>
				</div>		  				
			</div>
		</div>
		
		<!-- 맺음말 작성 -->
		<div class="closing d-none">
			<div class="card" style="width: 70%; height: auto;">
				<div id="closingArea">
					<h5 class="fw-bold mb-3">설문지 맺음말</h5>
				    <div class="alert alert-info small mb-3">
				    	※ 응답자에게 마지막으로 전달할 감사 메시지를 입력해 주세요.
				    </div>
      				<textarea class="form-control" id="closingMessage" rows="5" placeholder="맺음말 작성.."><%= closingMessage %></textarea>
	  			</div>
				<div  id="saveSurveyWrap">
					<button class="btn btn-secondary prev-btn mt-3" data-target=".question">이전</button>
		  			<button type="button" class="btn btn-primary mt-3 saveBtn">수정 저장</button>
		  			<button type="button" class="btn btn-primary mt-3 surveyDetailBtn">미리보기</button>
      				<button class="btn btn-primary next-btn mt-3" data-target=".complete">다음</button>
		  			
	  			</div>
			</div>
		</div>
		
		<!-- 완료 -->
		<div class="complete d-none">
			<div class="card" style="width: 70%; height: auto;">
				<div id="completeArea">
					<div class="text-center">
						<img src="${pageContext.request.contextPath}/resources/img/surveyFinish.png" class="img-fluid" style="max-width: 40%;" alt="설문완료_일러스트">
						<div class="alert alert-warning small mt-3">
				    		설문지 수정이 완료되었습니다.				    		
				    	</div>
					</div>
					<div class=" d-flex justify-content-center gap-3" id="compleSurveyWrap">
		  				<button type="button" class="btn btn-secondary rounded-pill px-3 surveyDetailBtn">미리보기</button>
		  				<button type="button" class="btn btn-primary rounded-pill px-3 saveBtn">수정저장</button>
		  				<button class="btn btn-secondary prev-btn rounded-pill px-3" data-target=".closing">이전</button>
	  				</div>
	  			</div>
			</div>
		</div>
		
		<!-- 설문지 작성 컨트롤러 -->
		<div class="ctrl-panel d-none" id="questionCtrl">
			<div class="d-flex flex-column align-items-center">
				<div class="addQuestionBtn text-center mb-2 position-relative" id="section" style="cursor: pointer;">
					<img src="${pageContext.request.contextPath}/resources/img/button/sectionBtn.png" alt="중제목" style="width: 80%;" draggable="false">
			  		<div class="position-absolute top-50 start-50 translate-middle-y small fw-bold" style="margin-left: 20px;">
			  			중제목 추가
			  		</div>
				</div>	
				<div class="addQuestionBtn text-center mb-2 position-relative" id="objectV" style="cursor: pointer;">
		  			<img src="${pageContext.request.contextPath}/resources/img/button/objectVBtn.png" alt="객관식 세로" style="width: 80%;" draggable="false">
			  		<div class="position-absolute top-50 start-50 translate-middle-y small fw-bold" style="margin-left: 20px;">
			  			객관식(세로)
			  		</div>
				</div>
				<div class="addQuestionBtn text-center mb-2 position-relative" id="objectH" style="cursor: pointer;">
		  			<img src="${pageContext.request.contextPath}/resources/img/button/objectHBtn.png" alt="객관식 가로" style="width: 80%;" draggable="false">
			  		<div class="position-absolute top-50 start-50 translate-middle-y small fw-bold" style="margin-left: 20px;">
			  			객관식(가로)
			  		</div>
				</div>
				<div class="addQuestionBtn text-center mb-2 position-relative" id="subject" style="cursor: pointer;">
		  			<img src="${pageContext.request.contextPath}/resources/img/button/subjectBtn.png" alt="주관식" style="width: 80%;" draggable="false">
			  		<div class="position-absolute top-50 start-50 translate-middle-y small fw-bold" style="margin-left: 20px;">
			  			&nbsp;&nbsp;&nbsp;주관식
			  		</div>
				</div>
				<div class="addQuestionBtn text-center mb-2 position-relative" id="grid" style="cursor: pointer;">
		  			<img src="${pageContext.request.contextPath}/resources/img/button/gridBtn.png" alt="그리드" style="width: 80%;" draggable="false">
			  		<div class="position-absolute top-50 start-50 translate-middle-y small fw-bold" style="margin-left: 20px;">
			  			다문항 선택
			  		</div>
				</div>
			</div>
		</div>


		<!-- 응답자 정보 컨트롤러 -->
		<div class="ctrl-panel d-none" id="respInfoCtrl">
			<div class="d-flex flex-column align-items-center">
				<button type="button" class="init-btn addrespInfoBtn mb-2" id="section">중제목 추가</button>					
				<button type="button" class="init-btn addrespInfoBtn mb-2" id="respInfoV">객관식 문항 (세로) 추가</button>
				<button type="button" class="init-btn addrespInfoBtn mb-2" id="respInfoH">객관식 문항 (가로) 추가</button>
				<button type="button" class="init-btn addrespInfoBtn mb-2" id="respInfoSub">주관식 문항 추가</button>
			</div>
		</div>
		
		<!-- 미리보기 모달 -->
		<div id="previewModal" class="modal fade" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-xl modal-dialog-scrollable">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h5 class="modal-title" id="previewModalLabel">설문 미리보기</h5>
		        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
		      </div>
		      <div class="modal-body" id="previewContent"></div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
		      </div>
		    </div>
		  </div>
		</div>
				
		
		
   	</div>
	<!-- 본문 영역 종료 -->
	
	<jsp:include page="/WEB-INF/views/include/footer.jsp" />
	</div>

<!-- Bootstrap JS (모달 기능용) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/form/update.js"></script>
</body>
</html>
