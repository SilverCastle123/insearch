<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css">
<title>설문 응답 페이지</title>
</head>

<body>
<div class="wrapper">
	<jsp:include page="/WEB-INF/views/include/header.jsp" />
	
	<div class="content">
		<div class="tab-content" id="surveyTabContent" style="width: 70%; margin: 0 auto;">

		    <!-- 설문 제목 및 설명 -->
		    <form action="${pageContext.request.contextPath}/submitResponse.do" method="post">
		    <input type="hidden" name="surveyId" value="${survey.id}">

	    	<div class="card">
				<div class="headLine" style="height: 10px; background-color: #1565c0;
	            	border-top-left-radius: 6px; 
	            	border-top-right-radius: 6px;
	            	position: absolute; top: 0; left: 0; right: 0;"></div>
				
				<div class="title mt-3">
			    	<h3>${survey.title}</h3>
				</div>
		    	
		    	<c:if test="${not empty survey.description}">
			        <div class="description mt-2">
			            <p>${survey.description}</p>
			        </div>
				</c:if>
				
				<hr/>
	    	</div>
		
		    <c:forEach var="question" items="${sortedQuestions}">
			    <c:choose>
			        <%-- 섹션 --%>
			        <c:when test="${question.type eq 'section'}">
			            <div class="sectionArea m-4">
			            	<hr class="my-0">
			            	<div class="bg-light px-4 py-3">
				                <strong>${question.content}</strong>
			            	</div>
			            	<hr class="my-0">
			            </div>
			        </c:when>

			        <%-- 문항 --%>
			        <c:otherwise>
			            <div class="card mb-3">
			                <div class="questionTitle mb-3">
			                    <strong>${question.questionOrder}. ${question.content}</strong>
			                </div>
			                
			                 <input type="hidden" name="questionIdList" value="${question.id}">
			                
			                <div class="questionAll">
			                    <c:choose>

			                        <%-- 객관식 세로 --%>
			                        <c:when test="${question.type eq 'objectV'}">
			                            <c:forEach var="choice" items="${question.sortedChoiceList}">
			                                <div>
			                                    <label>
			                                        <input type="radio" name="q_${question.id}" value="${choice.id}">
			                                        ${choice.content}
			                                    </label>
			                                </div>
			                            </c:forEach>
			                        </c:when>

			                        <%-- 객관식 가로 --%>
			                        <c:when test="${question.type eq 'objectH'}">
			                            <div>
			                                <c:forEach var="choice" items="${question.sortedChoiceList}">
			                                    <label style="margin-right: 10px;">
			                                        <input type="radio" name="q_${question.id}" value="${choice.id}">
			                                        ${choice.content}
			                                    </label>
			                                </c:forEach>
			                            </div>
			                        </c:when>

			                        <%-- 주관식 --%>
			                        <c:when test="${question.type eq 'subject'}">
			                            <input type="text" class="form-control" name="q_${question.id}" placeholder="응답 입력란" />
			                        </c:when>

			                        <%-- 그리드 --%>
			                        <c:when test="${question.type eq 'grid'}">
			                            <table class="table table-bordered text-center" id="gridTable_${question.questionOrder}">
			                                <thead></thead>
			                                <tbody>
			                                    <c:forEach var="cat" items="${question.sortedGridCategoryList}">
			                                        <tr>
			                                            <td>${cat.content}</td>
			                                            <c:forEach begin="1" end="${question.scaleSize}" var="i">
			                                                <td>
			                                                    <input type="radio"
			                                                           name="q_${question.id}_${cat.categoryOrder}"
			                                                           value="${i}" />
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
			
			<!-- 종료 인사말 및 제출 -->
			<div class="card">
				<c:if test="${not empty survey.closingMessage}">
			        <div class="">
			            <p>${survey.closingMessage}</p>
			        </div>
				</c:if>

				<div class="endLine" style="height: 10px; background-color: #1565c0;
	            	border-bottom-left-radius: 6px;
		        	border-bottom-right-radius: 6px;
		      		position: absolute; bottom: 0; left: 0; right: 0;"></div>
			</div>

			<div class="text-center mt-4 mb-5">
				<button type="submit" class="btn btn-primary">응답 제출</button>
			</div>

			</form> 

		</div>
	</div>

	<jsp:include page="/WEB-INF/views/include/footer.jsp" />
</div>

<script src="${pageContext.request.contextPath}/resources/js/form/response.js"></script>
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
