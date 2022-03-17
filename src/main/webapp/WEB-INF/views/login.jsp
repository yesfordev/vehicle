<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="${JSP}/include/resource.jsp" />

<script type="text/javascript">
	
	var Login = {
		init : function() {
			$('#txtCar4number').keyup(function() {
				var v = this.value;
				if ($.isNumeric(v) === false) {
					this.value = this.value.slice(0, -1);
				}
			});
			Login.button.btnLoginClickEvent();
		},
		button : {
			btnLoginClickEvent : function() {
				$('#btnLogin').on('click', function() {
					if(Login.validation.inputCheck()){
						$.ajax({
							url: ROOT + '/SSOLogin',
							data: JSON.stringify({ empid: $('#txtEmpid').val().trim(), car4num: $('#txtCar4number').val().trim() }),
							contentType : 'application/json;charset=utf-8',
							dataType : 'json',
							type:'POST',
							success: function(res) {
								if (res.result === 'Y') {
									jAlert('로그인 되었습니다!', '알림창');
									location.href ='';		
								} else {
									jAlert('일치하는 사용자 정보가 없습니다.<br/>임원사번 또는 차량번호를 확인하세요!', '알림창');
				                    $('#txtEmpid').val("");
				                    $('#txtCar4number').val("");
								}
							},
							error: function(err) {
		                        jAlert('일시적으로 접속 오류가 발생했습니다.<br/>잠시 후에 다시 접속 하시거나 02-6400-2945으로 연락바랍니다.', '알림창');
								
							}
						});
					
					}	
				});
			}
		},
		validation : {
			inputCheck : function() {
				if ($('#txtEmpid').val().trim() == "") {
					jAlert('임원사번 정보를 입력하세요!', '알림창');
					return false;
				}		
				else if ($('#txtCar4number').val().trim() == "") {
					jAlert('차량번호를 입력하세요!', '알림창');
					return false;
				}
				else 
					return true;
			}
		}
	};
	
	var Logout = {
		btnLogoutClickEvent : function() {
			$('#btnLogout').on('click', function() {
				$.ajax({
					url: ROOT + '/Logout',
					contentType : 'application/json;charset=utf-8',
					type:'GET',
					success: function(res) {
						location.href='';
					},
					error: function(err) {
                        jAlert('일시적으로 접속 오류가 발생했습니다.<br/>잠시 후에 다시 접속 하시거나 02-6400-2945으로 연락바랍니다.', '알림창');
						
					}
				});
			})
		}
	}

	$(document).ready(function() {
		Login.init();
		Logout.btnLogoutClickEvent();
	});
</script>
</head>
<body>
	<div id="wrap">
		<div id="header">
			<div class="h_wrap">
				<h1>
					<img src="${IMG}/title.png" alt="운행 기록부 입력" />
				</h1>
				<div class="login">
					<!-- 로그인 -->
					<c:choose>
						<c:when test="${empty LoginVo}">
							<div class="on">
								<span>임원사번</span>
								<div class="textbox">
									<input type="text" id="txtEmpid" class="alignC" name="txtEmpid" maxlength="8" />
								</div>
								<span>차량번호(뒤 4자리)</span>
								<div class="textbox">
									<input type="text" id="txtCar4number" name="txtCar4number" class="alignC" maxlength="4" />
								</div>
								<a id="btnLogin" href="javascript:void(0);">로그인</a>
							</div>
						</c:when>
						
						<c:otherwise>
							<!-- 로그아웃 -->
							<div class="off">
								<span>${LoginVo.username}님 접속중 입니다.</span>
								<a id="btnLogout" href="javascript:void(0);">로그아웃</a>
								<c:if test="${LoginVo.empid eq 'ADMIN'}">
									<a href="#" class="admin">관리자</a>
								</c:if>
							</div>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
		</div>
		<!-- header 끝 -->
		<div id="contants">
			<div class="box2">
				<!-- 기본정보 -->
				<div class="box_L floatL">
					<div class="boxTitle">
						<img src="${IMG}/t_icon1.png" alt="기본정보"> <span
							class="title">기본정보</span>
						<div class="btn"></div>
					</div>
					<div class="boxCon">
						<div class="basicTable">
							<table>
								<colgroup>
									<col width="30%" />
									<col width="70%" />
								</colgroup>
								<tbody>
									<tr>
										<th>소속</th>
										<td></td>
									</tr>
									<tr>
										<th>성명</th>
										<td></td>
									</tr>
									<tr>
										<th>차종</th>
										<td></td>
									</tr>
									<tr>
										<th>차량번호</th>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div class="searchBox">
						<div class="search_title">
							<h2>정보조회</h2>
							<img class="close" src="${IMG}/btn_close.png" alt="닫기" />
						</div>
						<div class="search_con">
							<ul>
								<li><span>임원 사번</span>
									<div class="textbox">
										<input type="text" />
									</div></li>
								<li><span>차량번호 (뒤 4자리)</span>
									<div class="textbox">
										<input type="text" class="alignC" maxlength="4" />
									</div></li>
							</ul>
							<div class="btnArea">
								<a href="#" class="btn_save">검색</a>
							</div>
						</div>
					</div>
				</div>

				<!-- 운행정보 입력 -->
				<div class="box_L floatR">
					<div class="boxTitle">
						<img src="${IMG}/t_icon2.png" alt="운행정보 입력"> <span
							class="title">운행정보 입력</span>
					</div>
					<div class="boxCon">
						<div class="basicTable inputTable">
							<table>
								<colgroup>
									<col width="25%" />
									<col width="25%" />
									<col width="25%" />
									<col width="25%" />
								</colgroup>
								<tbody>
									<tr>
										<th>사용일자</th>
										<td colspan="3">
											<div class="textbox"></div>
										</td>
									</tr>
									<tr>
										<th>주행 전 계기판(km)</th>
										<td>
											<div class="textbox"></div>
										</td>
										<th>출/퇴근용(km)</th>
										<td>
											<div class="textbox"></div>
										</td>
									</tr>
									<tr>
										<th>주행 후 계기판(km)</th>
										<td>
											<div class="textbox"></div>
										</td>
										<th>일반 업무용(km)</th>
										<td>
											<div class="textbox"></div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="mt10" style="overflow: hidden">
							<p>
								※ 문의 : 경영지원팀 조덕근 M (☎ 02-6100-5458) <br /> &nbsp;&nbsp; 시스템 문의
								: 사내IT서비스팀 김세훈 M (☎ 02-6100-5690)
							</p>
						</div>
						<div class="btnArea"></div>
					</div>
				</div>
			</div>

			<!-- 운행기록 -->
			<div class="box_L">
				<div class="boxTitle">
					<img src="${IMG}/t_icon3.png" alt="운행기록"> <span class="title">운행기록</span>
				</div>
				<div class="boxCon">
					<div class="rowTable">
						<table id="tblBackground" cellspacing="0">
							<tr>
								<td>
									<div class="scroll_thead">
										<table id="tblHead">
											<colgroup>
												<col width="110px;">
												<col width="100px;">
												<col width="90px;">
												<col width="120px;">
												<col width="100px;">
												<col width="80px;">
												<col width="120px;">
												<col width="120px;">
												<col width="120px;">
												<col width="120px;">
												<col width="120px;">
												<col width="">
											</colgroup>
											<thead>
												<tr>
													<th class="bordernone" rowspan="3">편집</th>
													<th colspan="2">기본정보</th>
													<th rowspan="3">사용일자(요일)</th>
													<th colspan="2">사용자</th>
													<th colspan="6">운행내역</th>
													<th width="17px" rowspan="3"></th>
												</tr>
												<tr>
													<th rowspan="2">차종</th>
													<th rowspan="2">자동차<br /> 등록번호
													</th>
													<th rowspan="2">부서</th>
													<th rowspan="2">성명</th>
													<th rowspan="2">주행 전 계기판<br /> 거리(km)
													</th>
													<th rowspan="2">주행 후 계기판<br /> 거리(km)
													</th>
													<th rowspan="2">주행 거리(km)</th>
													<th colspan="2">업무용 사용거리</th>
													<th rowspan="2">비고</th>
												</tr>
												<tr>
													<th>출/퇴근용 (km)</th>
													<th>일반업무용 (km)</th>
												</tr>
											</thead>
										</table>
									</div>
									<div class="scroll_tbody">
										<table id="tblBody">
											<colgroup>
												<col width="110px;">
												<col width="100px;">
												<col width="90px;">
												<col width="120px;">
												<col width="100px;">
												<col width="80px;">
												<col width="120px;">
												<col width="120px;">
												<col width="120px;">
												<col width="120px;">
												<col width="120px;">
												<col width="">
											</colgroup>
											<tbody>
												<tr>
													<td colspan="12">
														운행기록이 없습니다.
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>