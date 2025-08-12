<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css">

<title>설문지 상세보기 페이지</title>

</head>

<body>
<div class="wrapper">
	<jsp:include page="/WEB-INF/views/include/header.jsp" />
	
	<%-- 본문 영역 시작 --%>
	<div class="content">
		<%-- 질문 영역 --%>
		<div class="tab-content" id="surveyTabContent" style="width: 70%; margin: 0 auto;">
			
		    <%-- 설문 제목, 인사말, 수정 및 삭제 버튼 --%>
		    <input type="hidden" id="surveyId" value="${survey.id}">
	    	<div class="card">
				<div class="headLine" style="height: 10px; background-color: #1565c0;
	            	border-top-left-radius: 6px; 
	            	border-top-right-radius: 6px;
	            	position: absolute; top: 0; left: 0; right: 0;">
	  			</div>
				
				<div class="title mt-3">
			    	<h3>${survey.title}</h3>
				</div>
		    	
		    	<c:if test="${not empty survey.description}">
			        <div class="description mt-2">
			            <p>${survey.description}</p>
			        </div>
				</c:if>
				
				<hr/>
				<div class="buttonArea text-end">
				    <img src="${pageContext.request.contextPath}/resources/img/icon/editBtn.svg"
				         alt="수정" class="icon-btn" id="updateBtn">
				    <img src="${pageContext.request.contextPath}/resources/img/icon/deleteBtn.svg"
				         alt="삭제" class="icon-btn" id="deleteBtn">
				</div>
	    	</div>
		
		    <c:forEach var="question" items="${survey.questions}">
			    <c:choose>
			        <%-- 섹션 영역 --%>
			        <c:when test="${question.type eq 'section'}">
			            <div class="sectionArea m-4">
			            	<hr class="my-0">
			            		<div class="bg-light px-4 py-3">
				                	<strong>${question.content}</strong>
			            		</div>
			            	<hr class="my-0">
			            </div>
			        </c:when>
			
			        <%-- 설문문항 영역 --%>
			        <c:otherwise>
			            <div class="card mb-3">
			            
			                <div class="questionTitle mb-3">
			                    <strong>${question.questionOrder}. ${question.content}</strong>
			                </div>
			                
			                <div class="questionAll">
			                    <c:choose>
			                        <%-- 객관식 세로 --%>
			                        <c:when test="${question.type eq 'objectV'}">
			                            <c:forEach var="choice" items="${question.choices}">
			                                <div><input type="radio" disabled> ${choice.content}</div>
			                            </c:forEach>
			                        </c:when>
			
			                        <%-- 객관식 가로 --%>
			                        <c:when test="${question.type eq 'objectH'}">
			                            <div>
			                                <c:forEach var="choice" items="${question.choices}">
			                                    <label style="margin-right: 10px;">
			                                        <input type="radio" disabled> ${choice.content}
			                                    </label>
			                                </c:forEach>
			                            </div>
			                        </c:when>
			
			                        <%-- 주관식 --%>
			                        <c:when test="${question.type eq 'subject'}">
			                            <input type="text" class="form-control" disabled placeholder="응답 입력란" />
			                        </c:when>
			
			                        <%-- 그리드 --%>
			                        <c:when test="${question.type eq 'grid'}">
			                            <table class="table table-bordered text-center" id="gridTable_${question.questionOrder}">
			                                <thead>
			                                    <%-- JS에서 동적 헤더 생성 --%>
			                                </thead>
			                                <tbody>
			                                    <c:forEach var="cat" items="${question.categories}">
			                                        <tr>
			                                            <td>${cat.content}</td>
			                                            <c:forEach begin="1" end="${question.scaleSize}">
			                                                <td>
			                                                    <input type="radio" disabled name="grid_${question.questionOrder}_${cat.categoryOrder}" />
			                                                </td>
			                                            </c:forEach>
			                                        </tr>
			                                    </c:forEach>
			                                </tbody>
			                            </table>
			                        </c:when>
			                    </c:choose>
			                </div>
			                
			            </div>
			        </c:otherwise>
			    </c:choose>
			</c:forEach>
			
			<div class="card">
				<c:if test="${not empty survey.closingMessage}">
			        <div class="">
			            <p>${survey.closingMessage}</p>
			        </div>
				</c:if>
	
				<div class="endLine" style="height: 10px; background-color: #1565c0;
	            	border-bottom-left-radius: 6px;
		        	border-bottom-right-radius: 6px;
		      		position: absolute; bottom: 0; left: 0; right: 0;">
	  			</div>
			</div>	
			
		</div>
	</div>
	<%-- 본문 영역 종료 --%>
	
	<jsp:include page="/WEB-INF/views/include/footer.jsp" />
	</div>

<script src="${pageContext.request.contextPath}/resources/js/form/detail.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        <c:forEach var="q" items="${survey.questions}">
            <c:if test="${q.type eq 'grid'}">
                renderGridTableHeader(${q.questionOrder}, "${q.scaleType}", ${q.scaleSize});
            </c:if>
        </c:forEach>
    });
</script>
</body>
</html>