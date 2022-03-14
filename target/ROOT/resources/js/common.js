
/// *********************************************************
/// * 드래그, 마우스 방지 스크립트
/// *********************************************************

//InitECMPage();

function InitECMPage() {
    try {
        document.oncontextmenu = new Function("return false");
        document.ondragstart = new Function("return false");
        document.onselectstart = new Function("return false");
        document.onmousedown = RightMouseClick;
    } catch (e) { }
}

function RightMouseClick() {
    if ((event.button == 2) || (event.button == 3)) {
        //alert('죄송합니다.\r\n오른쪽 마우스 클릭이 금지되어 있습니다.');
    }
}


/// *********************************************************
/// * 공통 스크립트를 관리한다.
/// * 별도 내용
/// *  - Open 스크립트에서 팝업 속성을 변경하고자 할 때, 
/// *    별도 스크립트 생성하여 사용 하시길 바랍니다.
/// *********************************************************



// 팝업 페이지 Open 스크립트 (속성 등록가능)
function fn_OpenPopup(url, winName, width, height, feature) {
    var x = (screen.width) ? (screen.width - width) / 2 : 0;
    var y = (screen.height) ? (screen.height - height) / 2 : 0;
    var param = "width=" + width + ", height=" + height +
				", left=" + x + ", top=" + y + ", " + feature;

    win = window.open(url, winName, param);
    try {
        win.focus();
    } catch (e) {

    }
    return win;
}


// 모달 팝업 페이지 Open 스크립트 (IE 7.0 버전 체크함)
function fn_ModalOpenPopup(url, args, width, heigth) {
    try {
        var res = null;

        res = window.showModalDialog(url, args, "dialogWidth:" + (width + 5) + "px; dialogHeight:" + (heigth + 25) + "px; center:yes; resizable:no; status:no; scroll:no; help:no; ");

        return res;
    }
    catch (exception) {
    }
}


// 문자열 가져와서 특정문자를 다른 문자로 바꾸는 함수 (ALL)
// str1 : 원본 문자열
// str2 : 특정 문자열
// str3 : 바꿀 문자열
function fn_StringReplaceAll(str1, str2, str3) {
    var temp_str = "";
    if (fn_Trim(str1) != "" && str2 != str3) {
        temp_str = str1;

        while (temp_str.indexOf(str2) > -1) {
            temp_str = temp_str.replace(str2, str3);
        }
    }
    return temp_str;
}


// String 의 공백을 모두 제거한다.
function fn_Trim(sourceString) {
    var strResult;

    strResult = sourceString.replace(/\s/g, "");

    return strResult;
}




/// *********************************************************
/// * 쿠키 설정
/// *********************************************************

//쿠키 설정
function setCookie(name, value) {
    var argc = setCookie.arguments.length
    var argv = setCookie.arguments
    var expires = (argc > 2) ? argv[2] : null
    var path = (argc > 3) ? argv[3] : null
    var domain = (argc > 4) ? argv[4] : null
    var secure = (argc > 5) ? argv[5] : false
    document.cookie = name + "=" + escape(value) +
                              ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    //((path == null) ? "" : ("; path=" + path)) +
                              ((path == null) ? "" : ("; path=/")) +
                              ((domain == null) ? "" : ("; domain=" + domain)) +
                              ((secure == true) ? "; secure" : "")
}

//쿠키 조회
function getCookie(name) {
    var nameOfCookie = name + "=";
    var x = 0

    while (x <= document.cookie.length) {
        var y = (x + nameOfCookie.length);
        if (document.cookie.substring(x, y) == nameOfCookie) {
            if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                endOfCookie = document.cookie.length;
            return unescape(document.cookie.substring(y, endOfCookie));
        }
        x = document.cookie.indexOf(" ", x) + 1;
        if (x == 0)
            break;
    }
    return "";
}



//처리중 Mask Div 활성화
function EnableLoadingArea(w, h) {
    var x = (screen.width) ? (document.body.clientWidth - w) / 2 : 0;
    var y = (screen.height) ? (document.body.clientHeight - h) / 2 : 0;

    iFrame_BackLayer.frameElement.width = screen.width;
    iFrame_BackLayer.frameElement.height = screen.height;
    iFrame_MsgLayer.frameElement.width = w;
    iFrame_MsgLayer.frameElement.height = h;
    iFrame_MsgLayer.frameElement.style.top = y;
    iFrame_MsgLayer.frameElement.style.left = x;

    document.getElementById('layerPop').style.display = 'block';

    return true;
}

//처리중 Mask Div 비활성화
function DisableLoadingArea() {
    document.getElementById('layerPop').style.display = 'none';
    return true;
}



/// *********************************************************
/// * Byte를 KB, MB, GB, TB, PB 로 Return
/// *********************************************************
function byteConvertor(bytes) {
    bytes = parseInt(bytes);
    var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    if (e == "-Infinity") return "0 " + s[0];
    else return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
}



/// *********************************************************
/// * 인쇄 스크립트
/// *********************************************************
function NPEXPrint() {
    window.print();
    return;

    //영역만 인쇄는 Width가 깨짐으로, 그냥 인쇄 처리한다.
    //영역 인쇄를 할려면, 위의 window.print();를 제거하면 된다.
    var displayName = "#npex-formprint";    //인쇄할 영역 (NPEXBulletinTemplate.ascx에 정의)
    var displayForm = $(displayName);

    //본문영역 Width르 100%로 설정함.
    var postarea = $(".postArea");
    if (postarea.length > 0) {
        postarea[0].style.width = "100%"
    }

    if (displayForm.length > 0) {
        var scrollWidth = displayForm[0].scrollWidth + 10;        //Field Div Width
        var scrollHeight = displayForm[0].scrollHeight + 10;       //Field Div Height

        var printOption = {
            mode: "popup",                  //형태 : iframe, popup
            popHt: 500,                     //팝업시 Heigh
            popWd: scrollWidth,             //팝업시 Width
            popX: 10,                       //팝업시 Top X값
            popY: 10,                       //팝업시 Top Y값
            popTitle: "영역 프린트",        //타이틀
            popClose: true                  //프린트후 팝업 자동닫기여부
        };

        //Print 띄움
        $(displayName).printArea(printOption);
    }
    else {
        alert('인쇄할 수 없는 영역입니다.');
    }
}




var _OpenObj;

function fn_openPopup(url, strTitle) {
    _OpenObj = $("#dialog");

    _OpenObj.html("<iframe frameborder='0' scrolling='no' width='700' height='700' src='" + url + "' ></iframe>");

    _OpenObj.dialog({
        autoOpen: false,
        position: 'center',
        title: strTitle,
        draggable: false,
        width: 800,
        height: 700,
        resizable: true,
        modal: true
    });


    _OpenObj.dialog("open");
}



/// <summary>
/// fn_openPopup: Layer Popup
/// </summary>
/// <param name="url">페이지 경로</param>
/// <param name="intWidth">넓이</param>
/// <param name="intHeight">높이</param>
function fn_openPopup(id, url, strTitle, intWidth, intHeight) {    
    _OpenObj = $("#" + id);

    _OpenObj.html("<iframe frameborder='0' scrolling='no' width='" + intWidth + "' height='" + intHeight + "' src='" + url + "' ></iframe>");

    _OpenObj.dialog({
        autoOpen: false,
        title: strTitle,
        width: intWidth + 20,
        height: intHeight + 100,
        resizable: false,
        modal: true,
        buttons: {
            닫기: function () {
                _OpenObj.dialog("close");
            }
        }
    });

    _OpenObj.dialog("open");
}

function CloseCallback() {
    _OpenObj.dialog("close");
}

function fn_ModalClose() {
    parent.CloseCallback();
}

function fn_ModalCloseRefresh() {
    // parent.CloseCallback('', true);
    parent.location.href = parent.location.href;
}

//function fn_

function fn_ModalClose() {
    parent.CloseCallback();
}

// 에러 메시지용 팝업 창 표시
function fn_openErrorPopup(Title, Data) {
    var temp = decodeURIComponent(Data);


    if ($("#dialog").length == 0) {
        $(document.body).append("<div id='dialog' style='display: none;' title='Dialog Title'></div>"); 
    }
    var _OpenObj = $("#dialog");

    _OpenObj.html(temp);

    _OpenObj.dialog({
        autoOpen: false,
        title: Title,
        width: 500,
        resizable: true,
        position: { my: "center", at: "center", of: window, within: $("body") },
        modal: true
    }).parent().css("z-index", "99999");

    _OpenObj.dialog("open");
}


// 에러 메시지용 Display 표시 처리
function kuisin(idMyDiv) {
    var objDiv = document.getElementById(idMyDiv);

    if (objDiv.style.display == "block") { objDiv.style.display = "none"; }
    else { objDiv.style.display = "block"; }
}

//Request url parameter 가져오기
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

//Html encode
function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}



// 숫자 키만 입력
function DigitCheck(evt) {
    var code = evt.which ? evt.which : event.keyCode;
    if (code < 48 || code > 57) {
        return false;
    }
}


//특수문자 체크
function checkStringFormat(string) {
    //var stringRegx=/^[0-9a-zA-Z가-힝]*$/; 
    //var stringRegx = /[~!@\#$%<>^&*\()\-=+_\’]/gi;
    var stringRegx = /[~!@\#$%<>^&*\()\’\`\']/gi;
    var isValid = true;
    if (stringRegx.test(string)) {
        isValid = false;
    }

    return isValid;
}




// **************************************************
// PageMethods 호출
//
// *  호출 예제
// *   var allData = { "buzzID": buzzID };
// *   fn_PageMethods("TnetBuzzList.aspx/ViewUserBuzz", allData, fn_ViewUserBuzz_Success, fn_WebMathod_error);
// **************************************************
function fn_PageMethods(pageUrl, params, on_success, on_failure) {
    $.ajax({
        type: "POST",
        url: pageUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: on_success,
        error: on_failure
    });
}

// QueryString
var Request = {
    QueryString: function (paramName) {
        /// <summary>
        /// 현재 페이지의 QueryString을 리턴
        /// </summary>
        /// <param name="paramName" type="String">
        /// QueryString 이름
        /// </param>
        /// <returns type="String" />
        var returnValue = "";
        var currentAddr = unescape(location.href);
        var parameters = (currentAddr.slice(currentAddr.indexOf("?") + 1, currentAddr.length)).split("&");
        var paramValue;

        for (var i = 0; i < parameters.length; i++) {
            paramValue = parameters[i].split("=")[0];

            if (paramValue.toUpperCase() == paramName.toUpperCase()) {
                returnValue = parameters[i].split("=")[1];
                break;
            }
        }

        return returnValue;
    }
}

function CompactTrim(text) {
    return text.replace(/(\s*)/g, "");
}
