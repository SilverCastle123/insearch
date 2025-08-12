<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css">
	
<title>메인 페이지</title>
</head>

<body>
	<div class="wrapper">
	<jsp:include page="/WEB-INF/views/include/header.jsp" />
	
	
	<!-- 본문 영역 시작 -->
	<div class="content">
		
		<div class="input-group w-50 mb-3" style="justify-self: center;">
			<input type="text" class="form-control" placeholder="검색어를 입력해주세요" id="searchText">
		  	<button class="btn btn-primary" type="button" id="searchBtn">
		  		<img src="${pageContext.request.contextPath}/resources/img/icon/search.svg" style="filter: brightness(0) invert(1);">
		  	</button>
		</div>
		
		<div class="bg-light p-4 mb-3 text-end">
			<button type="button" class="init-btn logo" id="createFormBtn">+ 설문지 작성</button>
		</div>
		
		<div class="table-responsive"> <!-- 추후 동적 코드로 수정 -->
		  	<table class="table table-striped table-hover table-bordered align-middle text-center">
		    	<thead class="table-light">
		      		<tr>
				        <th class="w-auto" scope="col">번호</th>
				        <th class="w-auto" scope="col">파일</th>
				        <th class="w-75"   scope="col">제목</th>
				        <th class="w-auto" scope="col">시작일</th>
				        <th class="w-auto" scope="col">마감일</th>
				        <th class="w-auto" scope="col">설문현황</th>
				        <th class="w-auto" scope="col">응답현황</th>
		      		</tr>
		    	</thead>
		    	<tbody>			    	
				  <c:forEach var="survey" items="${surveyList}" varStatus="status">
				    <tr>
				      <td>${status.index + 1}</td>
				      <td>
				        <img src="${pageContext.request.contextPath}/resources/img/icon/download.svg" 
				             class="download-icon" data-id="${survey.id}" alt="다운로드아이콘" style="cursor: pointer;">
				      </td>
				      <td>
				        <a href="${pageContext.request.contextPath}/form/detail.do?id=${survey.id}">
				          ${survey.title}
				        </a>
				      </td>
				      <td>${survey.createdAtFormatted}</td>
				      <td>
					    <c:choose>
					      <c:when test="${not empty survey.closingDateStr}">
					         <fmt:parseDate value="${survey.closingDateStr}" pattern="yyyy-MM-dd" var="closingDateDate" />
					         <fmt:formatDate value="${closingDateDate}" pattern="yyyy-MM-dd" />
					      </c:when>
					      <c:otherwise>-</c:otherwise>
					    </c:choose>
					  </td>
				      <td>
						  <jsp:useBean id="now" class="java.util.Date" />
						  
						  <c:choose>
						    <c:when test="${not empty survey.closingDateStr}">
						      <fmt:parseDate value="${survey.closingDateStr}" pattern="yyyy-MM-dd" var="closingDateDate" />
						      <c:choose>
						        <c:when test="${closingDateDate.time >= now.time}">
						          <span class="badge bg-primary">진행</span>
						        </c:when>
						        <c:otherwise>
						          <span class="badge bg-secondary">마감</span>
						        </c:otherwise>
						      </c:choose>
						    </c:when>
						    <c:otherwise>
						      <span class="badge bg-warning text-dark">미정</span>
						    </c:otherwise>
						  </c:choose>
					  </td>
				      <td>-</td> <!-- 응답현황 나중에 추가 -->
				    </tr>
				  </c:forEach>			    	
		    	</tbody>
	  		</table>
	  		
			<c:if test="${totalPages > 0}">
			  <div class="pagination text-center my-4">
			    <c:if test="${hasPrevious}">
			      <a href="main.do?page=${currentPage - 1}" class="btn btn-outline-secondary btn-sm mx-1">이전</a>
			    </c:if>
			
			    <c:forEach begin="0" end="${totalPages - 1}" var="i">
			      <a href="main.do?page=${i}" class="btn btn-sm mx-1
			        <c:if test='${i == currentPage}'>btn-primary</c:if>
			        <c:if test='${i != currentPage}'>btn-outline-primary</c:if>">
			        ${i + 1}
			      </a>
			    </c:forEach>
			
			    <c:if test="${hasNext}">
			      <a href="main.do?page=${currentPage + 1}" class="btn btn-outline-secondary btn-sm mx-1">다음</a>
			    </c:if>
			  </div>
			</c:if>
			<c:if test="${empty surveyList}">
			  <tr>
			    <td colspan="6">등록된 설문이 없습니다.</td>
			  </tr>
			</c:if>
						  		
		</div>
		
<%-- 		<img id="popcat" src="${pageContext.request.contextPath}/resources/img/popcat-pop.gif" alt="팝캣" class="popcat-run" style="margin-top: 100px; width: 100px;">		 --%>
	</div>
	<!-- 본문 영역 종료 -->
	
	<!-- 다운로드 말풍선 영역 -->
	<div id="downloadDropdown" class="dropdown-menu show d-none" style="position: absolute; z-index: 9999;">
		<a class="dropdown-item" id="pdfDownBtn" style="cursor: pointer;">PDF 저장</a>
	  	<a class="dropdown-item" id="excelDownBtn" style="cursor: pointer;">엑셀 다운로드</a>
	  	<a class="dropdown-item" id="shareUrlBtn" style="cursor: pointer;">URL 공유</a>
	  	
	</div>
	
	<jsp:include page="/WEB-INF/views/include/footer.jsp" />
	</div>
	
<script src="${pageContext.request.contextPath}/resources/js/main/main.js"></script>
</body>

</html>