var fixedX = -1; // x position (-1 if to appear below control)
var fixedY = -1; // y position (-1 if to appear below control)
var startAt = 0; // 0 - sunday ; 1 - monday
var startAt = 0; // 0 - sunday ; 1 - monday
var showWeekNumber = 0;	// 0 - don't show; 1 - show
var showToday = 1;		// 0 - don't show; 1 - show
var imgDir = "Calendar/images/";	// directory for images ... e.g. var imgDir="/img/"
var calstyle = "";
var gotoString = "";
var todayString = "";
var weekString = "";
var scrollLeftMessage = "";
var scrollRightMessage = "";
var selectMonthMessage = "";
var selectYearMessage = "";
var selectDateMessage = "";
var dis_play = "";


var crossobj, crossMonthObj, crossYearObj, monthSelected, yearSelected, dateSelected, omonthSelected, oyearSelected, odateSelected, monthConstructed, yearConstructed, intervalID1, intervalID2, timeoutID1, timeoutID2, ctlToPlaceValue, ctlNow, dateFormat, nStartingYear;

var crossobj2, crossMonthObj2, crossYearObj2, monthSelected2, yearSelected2, dateSelected2, omonthSelected2, oyearSelected2, odateSelected2, monthConstructed2, yearConstructed2, intervalID12, intervalID22, timeoutID12, timeoutID22, ctlToPlaceValue2, ctlNow2, dateFormat2, nStartingYear2, movedate;

var bPageLoaded = false;
var ie = document.all;

var agt = navigator.userAgent.toLowerCase();
if (agt.indexOf("msie") != -1) ie = true;
if (agt.indexOf("trident") != -1) ie = true;

var dom = document.getElementById;

var ns4 = document.layers;
var today = new Date();
var dateNow = today.getDate();
var monthNow = today.getMonth();
//var	yearNow	 = today.getYear();
var yearNow = today.getFullYear();

//var	imgsrc = new Array("Cal_drop1.gif","Cal_drop2.gif","Cal_left1.gif","Cal_left2.gif","Cal_right1.gif","Cal_right2.gif");
//var	img	= new Array();
var oid1, oid2;
var lunarChkV = "0";

function duringcalculate(Svalue, Evalue, Ivalue, opt) {
    //기간 계산 인자 처음날짜 ,끝날짜 필드명 ,기간 필드명
    //만약 2004-10-31 에서 2004-11-01 이면 2라는 값이 지정이 됩니다.
    var form = document.forms[0];
    var SField = eval("form." + Svalue);
    var EField = eval("form." + Evalue);
    var IField = eval("form." + Ivalue);
    var adate = SField.value.split("-");
    var adate2 = EField.value.split("-");

    var date1 = new Date(adate[0], adate[1] - 1, adate[2]);
    var date2 = new Date(adate2[0], adate2[1] - 1, adate2[2]);

    if (date1 == "NaN" || date2 == "NaN") {
        alert("날짜를 설정 하십시오.");
        SField.value = "";
        EField.value = "";
        IField.value = "";
        return false;
    }
    else {
        var newdate = (date2 - date1) / (24 * 60 * 60 * 1000);
        if (eval(newdate + 1) < 1) {
            alert("기간이 제대로 설정되지 않았습니다.");
            SField.value = "";
            EField.value = "";
            IField.value = "";
            return false;
        } else {
            if (opt == "DayNight") {
                if (newdate == 0) {
                    IField.value = "1 일";
                } else {
                    IField.value = newdate + "박 " + eval(newdate + 1) + "일";
                }
            } else if (opt == "ReturnDayNight") {
                if (newdate == 0) {
                    return "0^1"
                } else {
                    return newdate + "^" + eval(newdate + 1);
                }

            } else if (opt == "HolidayCheck" || opt == "HolidayCheck2" || opt == "HolidayCheck3") {
                // 국경일 , 주말을 뺀 일수 계산

                var Holidays = document.forms[0].YearHolidays.value;
                var dayCnt = 0;
                var hdayCnt = 0;

                for (i = 0; i < newdate + 1; i++) {
                    tD = AddDays(SField.value, (i + 1)).split('-');
                    tmpDT = new Date(tD[0], parseInt(tD[1]) - 1, tD[2]);

                    if (Holidays.lastIndexOf(tD.join('-')) != -1) {// "국경일"
                        hdayCnt += 1;
                    } else if (opt == "HolidayCheck" && (tmpDT.getDay() == 0 || tmpDT.getDay() == 6)) {	//"주말"
                    } else if ((opt == "HolidayCheck2" || opt == "HolidayCheck3") && tmpDT.getDay() == 0) { //"주말"
                        hdayCnt += 1;
                    } else {
                        dayCnt++;
                    }
                }
                if (opt == "HolidayCheck2") {
                    return hdayCnt;
                } else {
                    IField.value = dayCnt;
                }
            } else {
                IField.value = eval(newdate + 1);
            }
        }

    }
}


function AddDays(sDate, DaysToAdd) {

    DaysToAdd = DaysToAdd - 1;

    var now = new Date();
    var tmpSD = sDate.split("-");
    var newdate = new Date(tmpSD[0], tmpSD[1] - 1, tmpSD[2]);
    var newtimems = newdate.getTime() + (DaysToAdd * 24 * 60 * 60 * 1000);
    newdate.setTime(newtimems);

    var yy = newdate.getYear();
    var mm = (newdate.getMonth() + 1);
    var dd = newdate.getDate();
    mm = (mm < 10 ? '0' + mm : mm);
    dd = (dd < 10 ? '0' + dd : dd);

    var s = yy + "-" + mm + "-" + dd;
    return s;
}

function HolidayRec(d, m, y, desc) {
    this.d = d
    this.m = m
    this.y = y
    this.desc = desc
}

var HolidaysCounter = 0;
var Holidays = new Array();

function addHoliday(d, m, y, desc) {
    Holidays[HolidaysCounter++] = new HolidayRec(d, m, y, desc)
}
//X버튼을 누르면 입력값을 널로 초기화 한다.
function datatonull() {
    ctlToPlaceValue.value = "";
    ctlToPlaceValue2.value = "";
}

if (dom) {


    //for	(i=0;i<imgsrc.length;i++)
    //{
    //	img[i] = new Image;
    //	img[i].src=imgDir+imgsrc[i];
    //}

    document.write("<div id='calendar' style='position:absolute;visibility:hidden;z-index:2094;width:220px;height:200px;border:0;'><iframe src='about:blank' width='96%' height='96%'></iframe><div style='position:absolute;left:0px;top:0px;z-index:2095' class='ui-calendar-module'><table width=" + ((showWeekNumber == 1) ? 248 : 218) + " ><tr bgcolor='#ffffff'><td><table width='" + ((showWeekNumber == 1) ? 248 : 218) + "'><tr><td style='padding:2px;font-family:arial; font-size:11px;'><font color='#ffffff'><B><span id='caption' ></span></B></font></td><td align=right></td></tr></table></td><td id='hid1'><table width='" + ((showWeekNumber == 1) ? 248 : 218) + "' ><tr><td style='padding:2px;font-family:arial; font-size:11px;'><font color='#ffffff'><B><span id='caption2'></span></B></font></td><td  align=right></td></tr></table></td></tr><tr><td  height=\"130px\" style='padding:0px'><span id='content' ></span></td><td id='hid2' style='padding:0px' bgcolor=#ffffff height=\"130\"><span id='content2'  ></span></td></tr>");

    if (showToday == 1) {
        document.write("<tr ><td style='padding:0px' align=center><span id='lblToday'></span><span id='lblToday1'></span></td><td style='padding:0px' align=center><span id='lblToday2'></span></td></tr>");
    }
    document.write("</table></div></div><div id='selectMonth' style='position:absolute;visibility:hidden;z-index:2096;width:72px;height=190px;' ><iframe src='about:blank' width='100%' height='100%' frameborder=0></iframe><div id='selectMonth2' style='position:absolute;left:0px;top:0px;z-index:2097' ></div></div><div id='selectYear' style='position:absolute;visibility:hidden;z-index:2096'></div><div id='selectMonth22' style='position:absolute;left:2px;top:2px;z-index:2098'></div></div><div id='selectYear2' style='position:absolute;visibility:hidden;z-index:2097'></div>");

}


var monthName = new Array("1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월");
if (startAt == 0) {
    dayName = new Array("일", "월", "화", "수", "목", "금", "토");
}
else {
    dayName = new Array("월", "화", "수", "목", "금", "토", "일");
}
var styleAnchor = "text-decoration:none;color:black;"
var styleLightBorder = "border-style:solid;border-width:1px;border-color:#a0a0a0;"

function swapImage(srcImg, destImg) {
    if (ie) { document.getElementById(srcImg).setAttribute("src", imgDir + destImg); }
}

function cal_init() {
    if (!ns4) {
        //if (!ie) { yearNow += 1900;	}

        crossobj = (dom) ? document.getElementById("calendar").style : ie ? document.all.calendar : document.calendar;

        crossMonthObj = (dom) ? document.getElementById("selectMonth").style : ie ? document.all.selectMonth : document.selectMonth;
        crossYearObj = (dom) ? document.getElementById("selectYear").style : ie ? document.all.selectYear : document.selectYear;

        crossMonthObj2 = (dom) ? document.getElementById("selectMonth22").style : ie ? document.all.selectMonth22 : document.selectMonth22;
        crossYearObj2 = (dom) ? document.getElementById("selectYear2").style : ie ? document.all.selectYear2 : document.selectYear2;

        monthConstructed = false;
        yearConstructed = false;

        monthConstructed2 = false;
        yearConstructed2 = false;

        if (showToday == 1) {

            document.getElementById("lblToday").innerHTML = todayString + "<table width='100%'><tr><td align='left'><input type='button' class='btn-general' value='오늘' onClick= 'javascript:monthSelected=monthNow;yearSelected=yearNow;constructCalendar();monthSelected2=monthNow;yearSelected2=yearNow;constructCalendar2();'></td></tr></table>";

            document.getElementById("lblToday1").innerHTML = "<table width='100%'><tr><td align='left'><input type='button' class='btn-general' value='오늘' onClick= 'javascript:monthSelected=monthNow;yearSelected=yearNow;constructCalendar();'></td><td align='right'><input type='button' class='btn-general' value='닫기' onClick= 'hideCalendar();'></td></tr></table>";

            document.getElementById("lblToday2").innerHTML = todayString + "<table width='100%'><tr><td align='right'><input type='button' class='btn-general' value='닫기' onClick='hideCalendar();'></td></tr></table>";
        }

        sHTML1 = "<table class='calendarHeader'>";
        sHTML1 += "<colgroup><col width='20%'>	<col width='*'><col width='20%'></colgroup>";
        sHTML1 += "<tbody><tr>";

        sHTML1 += "<td colspan='3'><strong class='calendar-tit'>시작일</strong></td>";
        sHTML1 += "</tr>	<tr>";
        sHTML1 += "<td class='t_left'><span id='spanLeft' class='prev' style='cursor:pointer'	 window.status=\"" + scrollLeftMessage + "\"' onclick='javascript:decMonth()' window.status=\"\"'></span>&nbsp;</td>";
        sHTML1 += "<td>";

        sHTML1 += "<span id='spanYear' class='year-select' window.status=\"" + selectYearMessage + "\"'	window.status=\"\"'	onclick='popUpYear()'></span>&nbsp;";
        sHTML1 += "</select>";

        sHTML1 += "<span id='spanMonth' class='month-select' window.status=\"" + selectMonthMessage + "\"' window.status=\"\"' onclick='popUpMonth()'></span>&nbsp;";
        sHTML1 += "</td>";

        sHTML1 += "<td class='t_right'><span id='spanRight' class='next' style='cursor:pointer'  window.status=\"" + scrollRightMessage + "\"' onclick='javascript:incMonth()' window.status=\"\"'></span>&nbsp;</td>";
        sHTML1 += "</tr>";
        sHTML1 += "</tbody>";
        sHTML1 += "</table>";




        //sHTML2="<table class='calendarHeader' border='1'>";
        sHTML2 = "<table class='calendarHeader' >";
        sHTML2 += "<colgroup><col width='20%'>	<col width='*'><col width='20%'></colgroup>";
        sHTML2 += "<tbody><tr>";
        sHTML2 += "<td colspan='3'><strong class='calendar-tit'>종료일</strong></td>";
        sHTML2 += "</tr>	<tr>";
        sHTML2 += "<td class='t_left'><span id='spanLeft2' class='prev' style='cursor:pointer' window.status=\"" + scrollLeftMessage + "\"' onclick='javascript:decMonth2()' window.status=\"\"'></span>&nbsp;</td>";
        sHTML2 += "<td>";

        sHTML2 += "<span id='spanYear2' class='year-select' window.status=\"" + selectYearMessage + "\"'	window.status=\"\"'	onclick='popUpYear2()'></span>&nbsp;";
        sHTML2 += "</select>";

        sHTML2 += "<span id='spanMonth2' class='month-select' window.status=\"" + selectMonthMessage + "\"' window.status=\"\"' onclick='popUpMonth2()'></span>&nbsp;";
        sHTML2 += "</td>";

        sHTML2 += "<td class='t_right'><span id='spanRight2' class='next' style='cursor:pointer'  window.status=\"" + scrollRightMessage + "\"' onclick='javascript:incMonth2()' window.status=\"\"'></span>&nbsp;</td>";
        sHTML2 += "</tr>";
        sHTML2 += "</tbody>";
        sHTML2 += "</table>";


        //document.getElementById("caption").innerHTML  = sHTML1;
        document.getElementById("caption2").innerHTML = sHTML2;
        bPageLoaded = true;
    }
}

function hideCalendar() {

    if (crossobj != undefined) {

        crossobj.visibility = "hidden";
        if (crossMonthObj != null) { crossMonthObj.visibility = "hidden"; }
        if (crossYearObj != null) { crossYearObj.visibility = "hidden"; }

    }
}

function padZero(num) {
    return (num < 10) ? '0' + num : num;
}

function constructDate(d, m, y) {
    sTmp = dateFormat;
    sTmp = sTmp.replace("dd", "<e>");
    sTmp = sTmp.replace("d", "<d>");
    sTmp = sTmp.replace("<e>", padZero(d));
    sTmp = sTmp.replace("<d>", d);
    sTmp = sTmp.replace("mmm", "<o>");
    sTmp = sTmp.replace("mm", "<n>");
    sTmp = sTmp.replace("m", "<m>");
    sTmp = sTmp.replace("<m>", m + 1);
    sTmp = sTmp.replace("<n>", padZero(m + 1));
    sTmp = sTmp.replace("<o>", monthName[m]);
    return sTmp.replace("yyyy", y);
}

function closeCalendar() {

    var sTmp;
    var x;

    var x = new Array("일요일", "월요일", "화요일");
    var x = x.concat("수요일", "목요일", "금요일");
    var x = x.concat("토요일");

    if (dis_play == "none") {
        hideCalendar();
    }

    if (ctlToPlaceValue2.value != "") {
        var d = ctlToPlaceValue2.value;
        var sfromdate = new Date(yearSelected, monthSelected, dateSelected);

        //if(typeof (ctlToPlaceValue3) != "undefined" ){
        if (dis_play != "none") {
            var stodate = new Date(d.split("-")[0], parseInt(d.split("-")[1]) - 1, d.split("-")[2]);
            if (sfromdate > stodate) {
                alert("종료일이 시작일 보다 이전일 수 없습니다.");
                ctlToPlaceValue.value = "";
                ctlToPlaceValue2.value = "";
                return;
            }

        }
    }

    dis_play = "";
    ctlToPlaceValue.value = constructDate(dateSelected, monthSelected, yearSelected);

    //#######음력에 대한 양력 날짜 입력######################################################
    //alert(lunarChkV)
    if (lunarChkV == "1") {
        dDiv = constructDate(dateSelected, monthSelected, yearSelected).split("-");
        if (document.all.YunChk.checked) lc.toSolar("1", dDiv[0], dDiv[1], dDiv[2]);
        else lc.toSolar("0", dDiv[0], dDiv[1], dDiv[2]);
        solarD = lc.sy + "-" + lc.sm + "-" + lc.sd;
        dV2 = getDateType(solarD, "-", "-", "1");
        document.all.Date.value = dV2;

        dV3 = getDateType(solarD, "-", ".", "1");
        document.all.DispSolarDate.value = "(양력) " + dV3;
        document.all.idDispSolar.innerHTML = "【 (양력) " + dV3 + " 】";
        //alert(dV3)
    }
    //#######음력에 대한 양력 날짜 입력######################################################

    // 기간 날짜 계산을 취해 추가함.
    try {
        if (DuringCalculateflag != null) {
            fnDuringClaculate(DuringCalculateflag);
            DuringCalculateflag = null;
        }
    }
    catch (e) {
    }

    try {
        if (document.all[weekday] != null) {
            document.all[weekday].value = x[d.getDay()];
        }
    }
    catch (e) {
    }
}


//=============================================================================================================
function closeCalendar2() {

    var sTmp;
    var x;

    var x = new Array("일요일", "월요일", "화요일");
    var x = x.concat("수요일", "목요일", "금요일");
    var x = x.concat("토요일");

    var fromdate = new Date(yearSelected, monthSelected, dateSelected);
    var todate = new Date(yearSelected2, monthSelected2, dateSelected2);

    if (fromdate > todate) {
        alert("종료일이 시작일 보다 이전일 수 없습니다 ");
        ctlToPlaceValue2.value = "";
        return;
    }

    if (ctlToPlaceValue.value == "") {
        alert("시작 날짜를 선택해주세요");
        return;
    }
    movedate = "";
    hideCalendar();
    var e = new Date(yearSelected2, monthSelected2, dateSelected2);
    ctlToPlaceValue2.value = constructDate(dateSelected2, monthSelected2, yearSelected2);

}

//==============================================================================================================

/*** Month Pulldown	***/

function StartDecMonth() {
    intervalID1 = setInterval("decMonth()", 80);
}

function StartIncMonth() {
    intervalID1 = setInterval("incMonth()", 80);
}

function StartDecMonth2() {
    intervalID1 = setInterval("decMonth2()", 80);
}

function StartIncMonth2() {
    intervalID1 = setInterval("incMonth2()", 80);
}

function incMonth() {
    monthSelected++;
    if (monthSelected > 11) {
        monthSelected = 0;
        yearSelected++;
    }
    constructCalendar();
}

function decMonth() {
    monthSelected--;
    if (monthSelected < 0) {
        monthSelected = 11;
        yearSelected--;
    }
    constructCalendar();
}

function incMonth2() {
    monthSelected2++;
    if (monthSelected2 > 11) {
        monthSelected2 = 0;
        yearSelected2++;
    }
    constructCalendar2();
}

function decMonth2() {
    monthSelected2--;
    if (monthSelected2 < 0) {
        monthSelected2 = 11;
        yearSelected2--;
    }
    constructCalendar2();
}

function constructMonth() {
    popDownYear();
    if (!monthConstructed) {
        sHTML = "";
        for (i = 0; i < 12; i++) {
            sName = monthName[i];
            if (i == monthSelected) {
                sName = "<B>" + sName + "</B>";
            }

            sHTML += "<tr class=box-font><td id='m" + i + "' onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;' onclick='monthConstructed=false;monthSelected=" + i + ";constructCalendar();popDownMonth();event.cancelBubble=true'>&nbsp;" + sName + "&nbsp;</td></tr>";
        }

        document.getElementById("selectMonth2").innerHTML = "<table width=70	style='font-size:11px; border-width:0; border-style:solid; border-color:#a0a0a0;' bgcolor='#FFFFDD' cellspacing=0 onmouseover='clearTimeout(timeoutID1)'	onmouseout='clearTimeout(timeoutID1);timeoutID1=setTimeout(\"popDownMonth()\",100);event.cancelBubble=true'>" + sHTML + "</table>";

        monthConstructed = true;
    }
}

function constructMonth2() {
    popDownYear2();
    if (!monthConstructed2) {
        sHTML = "";
        for (i = 0; i < 12; i++) {
            sName = monthName[i];
            if (i == monthSelected2) {
                sName = "<B>" + sName + "</B>";
            }
            sHTML += "<tr class=box-font><td id='m" + i + "' onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;' onclick='monthConstructed2=false;monthSelected2=" + i + ";constructCalendar2();popDownMonth2();event.cancelBubble=true'>&nbsp;" + sName + "&nbsp;</td></tr>";
        }

        document.getElementById("selectMonth22").innerHTML = "<table width=70	style='font-size:11px; border-width:0; border-style:solid; border-color:#a0a0a0;' bgcolor='#FFFFDD' cellspacing=0 onmouseover='clearTimeout(timeoutID1)'	onmouseout='clearTimeout(timeoutID1);timeoutID1=setTimeout(\"popDownMonth2()\",100);event.cancelBubble=true'>" + sHTML + "</table>";

        monthConstructed2 = true;
    }
}

function popUpMonth() {
    constructMonth();
    crossMonthObj.visibility = (dom || ie) ? "visible" : "show";
    crossMonthObj.left = parseInt(crossobj.left) + 115 + "px";     //parseInt(crossobj.left) + 50
    crossMonthObj.top = parseInt(crossobj.top) + 40 + "px";  // parseInt(crossobj.top) + 26
}

function popUpMonth2() {
    constructMonth2();
    crossMonthObj2.visibility = (dom || ie) ? "visible" : "show"
    crossMonthObj2.left = parseInt(crossobj.left) + 340 + "px";
    crossMonthObj2.top = parseInt(crossobj.top) + 40 + "px";
}

function popDownMonth() {
    crossMonthObj.visibility = "hidden";
}

function popDownMonth2() {
    crossMonthObj2.visibility = "hidden";
}

/*** Year Pulldown ***/

function incYear() {

    for (i = 0; i < 7; i++) {
        newYear = (i + nStartingYear) + 1;
        if (newYear == yearSelected) { txtYear = "&nbsp;<B>" + newYear + "</B>&nbsp;"; }
        else { txtYear = "&nbsp;" + newYear + "&nbsp;"; }
        document.getElementById("y" + i).innerHTML = txtYear;
    }
    nStartingYear++;
}

function incYear2() {

    for (i = 0; i < 7; i++) {
        newYear2 = (i + nStartingYear2) + 1;
        if (newYear2 == yearSelected2) { txtYear2 = "&nbsp;<B>" + newYear2 + "</B>&nbsp;"; }
        else { txtYear2 = "&nbsp;" + newYear2 + "&nbsp;"; }
        document.getElementById("y2" + i).innerHTML = txtYear2;
    }
    nStartingYear2++;
}

function decYear() {
    for (i = 0; i < 7; i++) {
        newYear = (i + nStartingYear) - 1;
        if (newYear == yearSelected) { txtYear = "&nbsp;<B>" + newYear + "</B>&nbsp;"; }
        else { txtYear = "&nbsp;" + newYear + "&nbsp;"; }
        document.getElementById("y" + i).innerHTML = txtYear;
    }
    nStartingYear--;
}

function decYear2() {
    for (i = 0; i < 7; i++) {
        newYear2 = (i + nStartingYear2) - 1;
        if (newYear2 == yearSelected2) { txtYear2 = "&nbsp;<B>" + newYear2 + "</B>&nbsp;"; }
        else { txtYear2 = "&nbsp;" + newYear2 + "&nbsp;"; }
        document.getElementById("y2" + i).innerHTML = txtYear2;
    }
    nStartingYear2--;
}

function selectYear(nYear) {
    yearSelected = parseInt(nYear + nStartingYear);
    yearConstructed = false;
    constructCalendar();
    popDownYear();
}

function selectYear2(nYear) {
    yearSelected2 = parseInt(nYear + nStartingYear2);
    yearConstructed2 = false;
    constructCalendar2();
    popDownYear2();

}

function constructYear() {
    popDownMonth();
    sHTML = "";
    if (!yearConstructed) {

        sHTML = "<tr><td align='center'	onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='clearInterval(intervalID1);this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;'	onmousedown='clearInterval(intervalID1);intervalID1=setInterval(\"decYear()\",30)' onmouseup='clearInterval(intervalID1)'>-</td></tr>";

        j = 0;
        nStartingYear = yearSelected - 3;

        for (i = (yearSelected - 3); i <= (yearSelected + 3); i++) {
            sName = i;
            if (i == yearSelected) {
                sName = "<B>" + sName + "</B>";
            }

            sHTML += "<tr><td id='y" + j + "' onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;' onclick='selectYear(" + j + ");event.cancelBubble=true'>&nbsp;" + sName + "&nbsp;</td></tr>";
            j++;
        }

        sHTML += "<tr><td align='center' onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='clearInterval(intervalID2);this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;' onmousedown='clearInterval(intervalID2);intervalID2=setInterval(\"incYear()\",30)'	onmouseup='clearInterval(intervalID2)'>+</td></tr>";

        document.getElementById("selectYear").innerHTML = "<table width=44 style='font-family:arial; font-size:11px; border-width:0; border-style:solid; border-color:#a0a0a0;'	bgcolor='#FFFFDD' onmouseover='clearTimeout(timeoutID2)' onmouseout='clearTimeout(timeoutID2);timeoutID2=setTimeout(\"popDownYear()\",100)' cellspacing=0>" + sHTML + "</table>";

        yearConstructed = true;
    }
}


function constructYear2() {
    popDownMonth2();
    sHTML = "";
    if (!yearConstructed2) {

        sHTML = "<tr><td align='center'	onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='clearInterval(intervalID12);this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;'	onmousedown='clearInterval(intervalID12);intervalID12=setInterval(\"decYear2()\",30)' onmouseup='clearInterval(intervalID12)'>-</td></tr>";

        j = 0;

        nStartingYear2 = yearSelected2 - 3;

        for (i = (yearSelected2 - 3); i <= (yearSelected2 + 3); i++) {
            sName = i;
            if (i == yearSelected2) {
                sName = "<B>" + sName + "</B>";
            }

            sHTML += "<tr><td id='y2" + j + "' onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;' onclick='selectYear2(" + j + ");event.cancelBubble=true'>&nbsp;" + sName + "&nbsp;</td></tr>";
            j++;
        }

        sHTML += "<tr><td align='center' onmouseover='this.style.backgroundColor=\"#FFCC99\"' onmouseout='clearInterval(intervalID22);this.style.backgroundColor=\"\"' style='cursor:pointer;font-size:12px;' onmousedown='clearInterval(intervalID22);intervalID22=setInterval(\"incYear2()\",30)'	onmouseup='clearInterval(intervalID22)'>+</td></tr>";

        document.getElementById("selectYear2").innerHTML = "<table width=44 style='font-family:arial; font-size:11px; border-width:0; border-style:solid; border-color:#a0a0a0;'	bgcolor='#FFFFDD' onmouseover='clearTimeout(timeoutID22)' onmouseout='clearTimeout(timeoutID22);timeoutID22=setTimeout(\"popDownYear2()\",100)' cellspacing=0>" + sHTML + "</table>";

        yearConstructed2 = true;
    }
}


function popDownYear() {
    clearInterval(intervalID1);
    clearTimeout(timeoutID1);
    clearInterval(intervalID2);
    clearTimeout(timeoutID2);
    crossYearObj.visibility = "hidden";
}


function popDownYear2() {
    clearInterval(intervalID12);
    clearTimeout(timeoutID12);
    clearInterval(intervalID22);
    clearTimeout(timeoutID22);
    crossYearObj2.visibility = "hidden";
}

function popUpYear() {
    var leftOffset;

    constructYear();
    crossYearObj.visibility = (dom || ie) ? "visible" : "show";
    leftOffset = parseInt(crossobj.left) + document.getElementById("spanYear").offsetLeft;
    //if (ie)
    //{
    leftOffset += 50; //6
    //}
    crossYearObj.left = leftOffset + "px";
    crossYearObj.top = parseInt(crossobj.top) + 40 + "px";  //26
}

function popUpYear2() {
    var leftOffset
    constructYear2()
    crossYearObj2.visibility = (dom || ie) ? "visible" : "show"
    leftOffset = parseInt(crossobj.left) + document.getElementById("spanYear2").offsetLeft
    //if (ie)
    //{
    leftOffset += 275
    //}

    crossYearObj2.left = leftOffset + "px";
    crossYearObj2.top = parseInt(crossobj.top) + 40 + "px"; //26

}


/*** calendar ***/

function WeekNbr(n) {
    var P3D = 259200000, P7D = 604800000, y = n.getYear(), y = (y < 1000 ? 1900 + y : y);
    var s = Math.floor((Date.UTC(y, n.getMonth(), n.getDate()) + P3D) / P7D);
    tmp = new Date(s * P7D); j = tmp.getYear(); j = (j < 1000 ? 1900 + j : j);
    return 1 + s - Math.floor((Date.UTC(j, 0, 4) + P3D) / P7D);
}


function constructCalendar() {

    var aNumDays = Array(31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    var dateMessage;
    var startDate = new Date(yearSelected, monthSelected, 1);
    var endDate;

    if (monthSelected == 1) {
        endDate = new Date(yearSelected, monthSelected + 1, 1);
        endDate = new Date(endDate - (24 * 60 * 60 * 1000));
        numDaysInMonth = endDate.getDate();
    }
    else {
        numDaysInMonth = aNumDays[monthSelected];
    }

    datePointer = 0;
    dayPointer = startDate.getDay() - startAt;

    if (dayPointer < 0) {
        dayPointer = 6;
    }

    sHTML = "<table	 border=1 class='calendar01' style='background-color:#f2f2f2;'><thead><tr>";
    if (showWeekNumber == 1) {
        sHTML += "<td width=27><b>" + weekString + "</b></td><td width=1 rowspan=7 bgcolor='#d0d0d0' style='padding:0px'><img src='" + imgDir + "Cal_divider.gif' width=1></td>";
    }

    for (i = 0; i < 7; i++) {
        if (dayName[i] == "일") {
            sHTML += "<th width='27' class='holiday'><B>" + dayName[i] + "</B></th>";
        } else if (dayName[i] == "토") {
            sHTML += "<th width='27' class='sat'><B>" + dayName[i] + "</B></th>";
        } else {
            sHTML += "<th width='27' ><B>" + dayName[i] + "</B></th>";
        }
    }
    sHTML += "</tr></thead><tr>";

    if (showWeekNumber == 1) {
        sHTML += "<td align=right>" + WeekNbr(startDate) + "&nbsp;</td>";
    }

    for (var i = 1; i <= dayPointer; i++) {
        sHTML += "<td>&nbsp;</td>";
    }

    for (datePointer = 1; datePointer <= numDaysInMonth; datePointer++) {
        dayPointer++;
        //	sHTML += "<td  id='ca_"+datePointer+"' onClick='chg_txt1(this.id)'>";
        sStyle = styleAnchor;
        if ((datePointer == odateSelected) && (monthSelected == omonthSelected) && (yearSelected == oyearSelected)) { sStyle += styleLightBorder; }

        sHint = "";
        for (k = 0; k < HolidaysCounter; k++) {
            if ((parseInt(Holidays[k].d) == datePointer) && (parseInt(Holidays[k].m) == (monthSelected + 1))) {
                if ((parseInt(Holidays[k].y) == 0) || ((parseInt(Holidays[k].y) == yearSelected) && (parseInt(Holidays[k].y) != 0))) {
                    sStyle += "background-color:#FFDDDD;";
                    sHint += sHint == "" ? Holidays[k].desc : "\n" + Holidays[k].desc;
                }
            }
        }

        var chkDate = new Date(yearSelected, monthSelected, datePointer);
        var nDate = new Date(yearNow, monthNow, dateNow);
        var regexp = /\"/g;
        sHint = sHint.replace(regexp, "&quot;");

        dateMessage = "onmousemove='window.status=\"" + selectDateMessage.replace("[date]", constructDate(datePointer, monthSelected, yearSelected)) + "\"' onmouseout='window.status=\"\"' ";

        if ((datePointer == dateNow) && (monthSelected == monthNow) && (yearSelected == yearNow)) {
            sHTML += "<td  id='ca_" + datePointer + "' onClick='chg_txt1(this.id)' style='background:#fb6077;'><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\" style='" + sStyle + "' href='javascript:dateSelected=" + datePointer + ";closeCalendar();'><B><font color=blue>" + datePointer + "</font></B></a>";
        }
        else if (dayPointer % 7 == (startAt * -1) + 1) {
            if ((chkDate < nDate) && (calstyle == "I")) {
                sHTML += "<td  id='ca_" + datePointer + "' >" + datePointer + "&nbsp;";
            } else {
                sHTML += "<td class='sunCell' id='ca_" + datePointer + "' onClick='chg_txt1(this.id)' style='background:white;'><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\" style='" + sStyle + "' href='javascript:dateSelected=" + datePointer + ";closeCalendar();'>&nbsp;<font color=red>" + datePointer + "</font>&nbsp;</a>";
            }
        }
        else if (dayPointer % 7 == (startAt * -0) + 0) {
            if ((chkDate < nDate) && (calstyle == "I")) {
                sHTML += "<td  id='ca_" + datePointer + "'>" + datePointer + "&nbsp;";
            } else {
                sHTML += "<td class='satCell' id='ca_" + datePointer + "' onClick='chg_txt1(this.id)' style='background:white;'><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\" style='" + sStyle + "' href='javascript:dateSelected=" + datePointer + ";closeCalendar();'>&nbsp;<font color=blue>" + datePointer + "</font>&nbsp;</a>";
            }
        }
        else {
            if ((chkDate < nDate) && (calstyle == "I")) {
                sHTML += "<td  id='ca_" + datePointer + "'>&nbsp;" + datePointer + "&nbsp;";
            } else {
                sHTML += "<td  id='ca_" + datePointer + "' onClick='chg_txt1(this.id)' style='background:white;'><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\"  href='javascript:dateSelected=" + datePointer + ";closeCalendar();'>&nbsp;" + datePointer + "&nbsp;";
            }

        }

        sHTML += ""
        if ((dayPointer + startAt) % 7 == startAt) {
            sHTML += "</tr><tr>";
            if ((showWeekNumber == 1) && (datePointer < numDaysInMonth)) {
                sHTML += "<td align=right>" + (WeekNbr(new Date(yearSelected, monthSelected, datePointer + 1))) + "</td>";
            }
        }
    }

    document.getElementById("content").innerHTML = sHTML;
    document.getElementById("spanMonth").innerHTML = "&nbsp;" + monthName[monthSelected] + "&nbsp;<IMG id='changeMonth' SRC='" + imgDir + "down_arrow.png' WIDTH='11' HEIGHT='10' BORDER=0>";
    document.getElementById("spanYear").innerHTML = "&nbsp;" + yearSelected + "&nbsp;<IMG id='changeYear' SRC='" + imgDir + "down_arrow.png' WIDTH='12' HEIGHT='10' BORDER=0>";

}


function chg_txt1(id) {
    if (typeof (oid1) == "undefined") {
        document.getElementById(id).style.backgroundColor = "#c0c0c0";
    } else {
        document.getElementById(id).style.backgroundColor = "#c0c0c0";
        document.getElementById(oid1).style.backgroundColor = "#ffffff";
    }
    oid1 = id;
}

function constructCalendar2() {

    var aNumDays = Array(31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var dateMessage;
    var startDate = new Date(yearSelected2, monthSelected2, 1);
    var endDate;

    if (monthSelected2 == 1) {
        endDate = new Date(yearSelected2, monthSelected2 + 1, 1);
        endDate = new Date(endDate - (24 * 60 * 60 * 1000));
        numDaysInMonth = endDate.getDate();
    }
    else {
        numDaysInMonth = aNumDays[monthSelected2];
    }

    datePointer = 0;
    dayPointer = startDate.getDay() - startAt;

    if (dayPointer < 0) {
        dayPointer = 6;
    }
    sHTML22 = "<table border=0 class='calendar01' style='background-color:#f2f2f2;'><thead><tr>";

    if (showWeekNumber == 1) {
        sHTML22 += "<td width=27><b>" + weekString + "</b></td><td width=1 rowspan=7 bgcolor='#d0d0d0' style='padding:0px'><img src='" + imgDir + "Cal_divider.gif' width=1></td>";
    }


    for (i = 0; i < 7; i++) {
        if (dayName[i] == "일") {
            sHTML22 += "<th width='27' class='holiday'><B>" + dayName[i] + "</B></th>";
        } else if (dayName[i] == "토") {
            sHTML22 += "<th width='27'  class='sat'><B>" + dayName[i] + "</B></th>";
        } else {
            sHTML22 += "<th width='27' ><B>" + dayName[i] + "</B></th>";
        }
    }
    sHTML22 += "</tr></thead><tr>";

    if (showWeekNumber == 1) {
        sHTML22 += "<td align=right>" + WeekNbr(startDate) + "&nbsp;</td>";
    }

    for (var i = 1; i <= dayPointer; i++) {
        sHTML22 += "<td>&nbsp;</td>";
    }

    for (datePointer = 1; datePointer <= numDaysInMonth; datePointer++) {
        dayPointer++;
        sStyle = styleAnchor;
        if ((datePointer == odateSelected2) && (monthSelected2 == omonthSelected2) && (yearSelected2 == oyearSelected2)) { sStyle += styleLightBorder; }

        sHint = "";
        for (k = 0; k < HolidaysCounter; k++) {
            if ((parseInt(Holidays[k].d) == datePointer) && (parseInt(Holidays[k].m) == (monthSelected2 + 1))) {
                if ((parseInt(Holidays[k].y) == 0) || ((parseInt(Holidays[k].y) == yearSelected2) && (parseInt(Holidays[k].y) != 0))) {
                    sStyle += "background-color:#FFDDDD;";
                    sHint += sHint == "" ? Holidays[k].desc : "\n" + Holidays[k].desc;
                }
            }
        }
        var chkDate2 = new Date(yearSelected2, monthSelected2, datePointer);
        var nDate2 = new Date(yearNow, monthNow, dateNow);
        var regexp = /\"/g;
        sHint = sHint.replace(regexp, "&quot;");

        dateMessage = "onmousemove='window.status=\"" + selectDateMessage.replace("[date]", constructDate(datePointer, monthSelected2, yearSelected2)) + "\"' onmouseout='window.status=\"\"' ";

        if ((datePointer == dateNow) && (monthSelected2 == monthNow) && (yearSelected2 == yearNow)) { sHTML22 += "<td  align=right><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\" style='" + sStyle + "' href='javascript:dateSelected2=" + datePointer + ";closeCalendar2();'><font color=blue>" + datePointer + "</font></a>"; }
        else if (dayPointer % 7 == (startAt * -1) + 1) {
            if ((chkDate2 < nDate2) && (calstyle == "I")) {
                sHTML22 += "<td align=right>" + datePointer + "&nbsp;";
            } else {
                sHTML22 += "<td class='sunCell' align=right style='background:white;'><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\" style='" + sStyle + "' href='javascript:dateSelected2=" + datePointer + ";closeCalendar2();'>&nbsp;<font color=red>" + datePointer + "</font>&nbsp;</a>";
            }
        }
        else if (dayPointer % 7 == (startAt * -0) + 0) {
            if ((chkDate2 < nDate2) && (calstyle == "I")) {
                sHTML22 += "<td align=right>" + datePointer + "&nbsp;";
            } else {
                sHTML22 += "<td class='satCell' align=right style='background:white;'><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\" style='" + sStyle + "' href='javascript:dateSelected2=" + datePointer + ";closeCalendar2();'>&nbsp;<font color=blue>" + datePointer + "</font>&nbsp;</a>";
            }
        }
        else {
            if ((chkDate2 < nDate2) && (calstyle == "I")) {
                sHTML22 += "<td align=right>&nbsp;" + datePointer + "&nbsp;";
            } else {
                sHTML22 += "<td align=right style='background:white;'><a class='calendar-alink' " + dateMessage + " title=\"" + sHint + "\"  href='javascript:dateSelected2=" + datePointer + ";closeCalendar2();'>&nbsp;" + datePointer + "&nbsp;";
            }
        }

        sHTML22 += ""
        if ((dayPointer + startAt) % 7 == startAt) {
            sHTML22 += "</tr><tr>"
            if ((showWeekNumber == 1) && (datePointer < numDaysInMonth)) {
                sHTML22 += "<td align=right>" + (WeekNbr(new Date(yearSelected2, monthSelected2, datePointer + 1))) + "&nbsp;</td>"
            }
        }
    }

    document.getElementById("content2").innerHTML = sHTML22;
    document.getElementById("spanMonth2").innerHTML = "&nbsp;" + monthName[monthSelected2] + "&nbsp;<IMG id='changeMonth2' SRC='" + imgDir + "down_arrow.png' WIDTH='11' HEIGHT='10' BORDER=0>";
    document.getElementById("spanYear2").innerHTML = "&nbsp;" + yearSelected2 + "&nbsp;<IMG id='changeYear2' SRC='" + imgDir + "down_arrow.png' WIDTH='12' HEIGHT='10' BORDER=0>";
}




function popUpCalendar(offsetx, offsety, ctl, ctl2, ctl3, format, act) {

    var leftpos = 0;
    var toppos = 0;

    if (bPageLoaded) {
        if (crossobj.visibility == "hidden") {
            ctlToPlaceValue = ctl2;
            ctlToPlaceValue2 = ctl3;
            dateFormat = format;

            formatChar = " ";
            aFormat = dateFormat.split(formatChar);
            if (aFormat.length < 3) {
                formatChar = "/";
                aFormat = dateFormat.split(formatChar);
                if (aFormat.length < 3) {
                    formatChar = ".";
                    aFormat = dateFormat.split(formatChar);
                    if (aFormat.length < 3) {
                        formatChar = "-";
                        aFormat = dateFormat.split(formatChar);
                        if (aFormat.length < 3) {
                            formatChar = "";
                        }
                    }
                }
            }

            tokensChanged = 0;
            if (formatChar != "") {
                // use user's date
                aData = ctl2.value.split(formatChar);
                if (ctl3 != "none") {
                    bData = ctl3.value.split(formatChar);
                } else {
                    bData = ctl2.value.split(formatChar);
                }

                for (i = 0; i < 3; i++) {
                    if ((aFormat[i] == "d") || (aFormat[i] == "dd")) {
                        dateSelected = parseInt(aData[i], 10);
                        dateSelected2 = parseInt(aData[i], 10);
                        tokensChanged++;
                    }
                    else if ((aFormat[i] == "m") || (aFormat[i] == "mm")) {
                        monthSelected = parseInt(aData[i], 10) - 1;
                        monthSelected2 = parseInt(bData[i], 10) - 1;
                        tokensChanged++;
                    }
                    else if (aFormat[i] == "yyyy") {
                        yearSelected = parseInt(aData[i], 10);
                        yearSelected2 = parseInt(bData[i], 10);
                        tokensChanged++;
                    }
                    else if (aFormat[i] == "mmm") {
                        for (j = 0; j < 12; j++) {
                            if (aData[i] == monthName[j]) {
                                monthSelected = j;
                                monthSelected2 = j;
                                tokensChanged++;
                            }
                        }
                    }
                }
            }

            if ((tokensChanged != 3) || isNaN(dateSelected) || isNaN(monthSelected) || isNaN(yearSelected) || isNaN(dateSelected2) || isNaN(monthSelected2) || isNaN(yearSelected2)) {

                dateSelected = dateNow;
                monthSelected = monthNow;
                yearSelected = yearNow;

                dateSelected2 = dateNow;
                monthSelected2 = monthNow;
                yearSelected2 = yearNow;
            }

            odateSelected = dateSelected;
            omonthSelected = monthSelected;
            oyearSelected = yearSelected;

            odateSelected2 = dateSelected2;
            omonthSelected2 = monthSelected2;
            oyearSelected2 = yearSelected2;

            //debugger;
            aTag = ctl;
            do {
                aTag = aTag.offsetParent;
                if (aTag == null) break;
                leftpos += aTag.offsetLeft;
                toppos += aTag.offsetTop;
            } while (aTag.tagName != "BODY");

            tmpLeft = fixedX == -1 ? ctl.offsetLeft + leftpos : fixedX;
            tmpTop = fixedY == -1 ? ctl.offsetTop + toppos + ctl.offsetHeight + 2 : fixedY;

            constructCalendar(1, monthSelected, yearSelected);
            constructCalendar2(1, monthSelected2, yearSelected2);

            tmpLeft = tmpLeft + offsetx;
            tmpTop = tmpTop + offsety;

            crossobj.left = tmpLeft + "px";
            crossobj.top = tmpTop + "px";

            crossobj.visibility = (dom || ie) ? "visible" : "show";

        }
        else {

            if (ctlNow != ctl) { popUpCalendar(ctl, ctl2, format); }
        }
        ctlNow = ctl;
    }
}

var DuringCalculateflag = '';											// 기간계산을 할건지 체크 변수
function ViewCalendar(ctl, ctl2, format, act, Flg, offsetx, offsety) {

    //console.log(ctl);
    //console.log(ctl2);
    //console.log(format);
    //console.log(act);
    ////console.log(DurCal);
    //console.log(Flg);
    //console.log(offsetx);
    //console.log(offsety);

    sHTML_single = "<table class='calendarHeader'>";
    sHTML_single += "<colgroup><col width='20%'>	<col width='*'><col width='20%'></colgroup>";
    sHTML_single += "<tbody><tr>";
    sHTML_single += "<td colspan='3'><strong class='calendar-tit'>날짜선택</strong></td>";
    sHTML_single += "</tr>	<tr>";
    sHTML_single += "<td class='t_left'><span id='spanLeft' class='prev' style='cursor:pointer'	 window.status=\"" + scrollLeftMessage + "\"' onclick='javascript:decMonth()' window.status=\"\"'></span>&nbsp;</td>";
    sHTML_single += "<td>";
    sHTML_single += "<span id='spanYear' class='year-select' window.status=\"" + selectYearMessage + "\"'	window.status=\"\"'	onclick='popUpYear()'></span>&nbsp;";
    sHTML_single += "</select>";
    sHTML_single += "<span id='spanMonth' class='month-select' window.status=\"" + selectMonthMessage + "\"' window.status=\"\"' onclick='popUpMonth()'></span>&nbsp;";
    sHTML_single += "</td>";
    sHTML_single += "<td class='t_right'><span id='spanRight' class='next' style='cursor:pointer'  window.status=\"" + scrollRightMessage + "\"' onclick='javascript:incMonth()' window.status=\"\"'></span>&nbsp;</td>";
    sHTML_single += "</tr>";
    sHTML_single += "</tbody>";
    sHTML_single += "</table>";

    sHTML_multi = "<table class='calendarHeader'>";
    sHTML_multi += "<colgroup><col width='20%'>	<col width='*'><col width='20%'></colgroup>";
    sHTML_multi += "<tbody><tr>";
    sHTML_multi += "<td colspan='3'><strong class='calendar-tit'>시작일</strong></td>";
    sHTML_multi += "</tr>	<tr>";
    sHTML_multi += "<td class='t_left'><span id='spanLeft' class='prev' style='cursor:pointer'	 window.status=\"" + scrollLeftMessage + "\"' onclick='javascript:decMonth()' window.status=\"\"'></span>&nbsp;</td>";
    sHTML_multi += "<td>";
    sHTML_multi += "<span id='spanYear' class='year-select' window.status=\"" + selectYearMessage + "\"'	window.status=\"\"'	onclick='popUpYear()'></span>&nbsp;";
    sHTML_multi += "</select>";
    sHTML_multi += "<span id='spanMonth' class='month-select' window.status=\"" + selectMonthMessage + "\"' window.status=\"\"' onclick='popUpMonth()'></span>&nbsp;";
    sHTML_multi += "</td>";
    sHTML_multi += "<td class='t_right'><span id='spanRight' class='next' style='cursor:pointer'  window.status=\"" + scrollRightMessage + "\"' onclick='javascript:incMonth()' window.status=\"\"'></span>&nbsp;</td>";
    sHTML_multi += "</tr>";
    sHTML_multi += "</tbody>";
    sHTML_multi += "</table>";

    var caption_title = document.getElementById("caption").innerHTML;
    if (format == "none") {
        dis_play = "none";
        document.getElementById("caption2").style.display = "none";
        document.getElementById("content2").style.display = "none"
        document.getElementById("calendar").style.width = "240px";
        document.getElementById("calendar").style.height = "260px";
        document.getElementById("hid1").style.display = "none";
        document.getElementById("hid2").style.display = "none";
        document.getElementById("lblToday1").style.display = "";
        document.getElementById("lblToday").style.display = "none";
        document.getElementById("lblToday2").style.display = "none";
        document.getElementById("caption").innerHTML = sHTML_single;

    } else {
        dis_play = "";
        document.getElementById("caption2").style.display = "";
        document.getElementById("content2").style.display = "";
        document.getElementById("calendar").style.width = "480px";
        document.getElementById("calendar").style.height = "260px";
        document.getElementById("hid1").style.display = "";
        document.getElementById("hid2").style.display = "";
        document.getElementById("lblToday1").style.display = "none";
        document.getElementById("lblToday").style.display = "";
        document.getElementById("lblToday2").style.display = "";
        document.getElementById("caption").innerHTML = sHTML_multi;
    }

    calstyle = Flg;
    //if (DurCal !=null){
    //    DuringCalculateflag= DurCal;
    //}else{
    //    DuringCalculateflag = null;
    //}

    if (document.all.calendar) {
        document.all.calendar.style.visibility = "hidden";
    }

    //layer_open으로 띄운 경우 체크
    //alert($(ctl).offsetParent().attr("class"));
    if ($(ctl).offsetParent().attr("class") == "pop-layer") {
        offsety = $(document).scrollTop();
    }

    if (!bPageLoaded)
        cal_init();
    popUpCalendar(offsetx, offsety, ctl, ctl2, format, act);
}
//*************************************************************************
var winWidth = $(window).width();
var winHeight = $(window).height();
var chkFirst = false;
function resizeCalendar() {

    //if (crossobj == undefined) return;

    var newWinWidth = $(window).width();
    var newWinHeight = $(window).height();
    var pos = $('#calendar').position();

    var page;
    var leftPos, topPos;
    var offset;

    if (winWidth >= newWinWidth) {
        offset = winWidth - newWinWidth;
        leftPos = parseInt(pos.left) - (parseInt(offset / 2));
    }

    if (winWidth < newWinWidth) {
        offset = newWinWidth - winWidth;
        leftPos = parseInt(pos.left) + (parseInt(offset / 2));
    }

    //처음이벤트시에만 사이즈조정
    if (chkFirst == false) {
        leftPos = leftPos + 8;
    }
    document.all.calendar.style.left = leftPos + "px";

    if (crossobj != undefined) {
        //layer_open으로 띄운 경우 체크
        if ($(ctlNow).offsetParent().attr("class") == "pop-layer") {

            if (winHeight >= newWinHeight) {
                offset = winHeight - newWinHeight;
                topPos = parseInt(pos.top) - (parseInt(offset / 2));
            }

            if (winWidth < newWinWidth) {
                offset = newWinHeight - winHeight;
                topPos = parseInt(pos.top) + (parseInt(offset / 2));
            }
            document.all.calendar.style.top = topPos + "px";
        }
    }
    chkFirst = true;
    winWidth = newWinWidth;
    winHeight = newWinHeight;
}

//$(window).resize(function () {
//    resizeCalendar();
//});

//var delta = 100;
//var timer = null;

//$(window).on('resize', function () {
//    clearTimeout(timer);
//    timer = setTimeout(resizeCalendar, delta);
//});

var lastScroll = 0;
$(window).scroll(function (event) {
    var st = $(this).scrollTop();
    var ed = $(window).height() - 5;

    if (crossobj != undefined) {
        //layer_open으로 띄운 경우 체크
        if ($(ctlNow).offsetParent().attr("class") == "pop-layer") {
            hideCalendar();
            //if (st > lastScroll) {
            //    //alert($('#calendar').position().top);
            //    //alert(st);
            //    var topPos = parseInt($('#calendar').position().top) + st;
            //    document.all.calendar.style.top = topPos + "px";
            //    //alert("DOWN");
            //}
            //else {
            //    var topPos = ed - parseInt($('#calendar').position().top);
            //    document.all.calendar.style.top = topPos + "px";
            //    //alert("UP");
            //}
        }
    }
    lastScroll = st;
});
//*************************************************************************
