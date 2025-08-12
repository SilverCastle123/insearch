<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<header style="background-color: #f8f9fa; padding: 16px 24px; border-bottom: 1px solid #ddd;">

<!-- SweetAlert2 -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/sweetalert2/sweetalert2.min.css">
<script src="${pageContext.request.contextPath}/resources/sweetalert2/sweetalert2.min.js"></script>
<!-- bootstrap -->
<link href="${pageContext.request.contextPath}/resources/bootstrap/bootstrap.min.css" rel="stylesheet">
<script src="${pageContext.request.contextPath}/resources/bootstrap/bootstrap.bundle.min.js"></script>

<!-- jQuery -->
<script src="${pageContext.request.contextPath}/resources/js/jquery-3.7.1.min.js"></script>

<script>
 	// 경로 변수등록
 	const contextPath = "${pageContext.request.contextPath}";
</script>    
    
    <div class="headerTitle d-flex align-items-center gap-2">
		<a href="${pageContext.request.contextPath}/main.do" style="text-decoration: none; color: inherit;">
        	<img src="${pageContext.request.contextPath}/resources/img/inSearchLogo.png" alt="인아이티_로고" style="width: 200px; height: auto;">
        </a>
        <h1 class="ms-2" style="margin: 0; font-size: 20px; color: #333;">
        	<strong>설문조사 시스템 ( iN-SEARCH )</strong>
        </h1>
    </div>
    
</header>