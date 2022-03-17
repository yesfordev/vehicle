
function AjaxHelperCallBox() {
    this.URL = '';
    this.IsPost = true;
    this.IsAsync = true;
    this.IsAndroidFileUp = false;
    //this.UseLoadingMask = true;
    this.Data = null;
    this.ReturnDataType = '';
    this.ContentType = null;
    this.Function_Success = null;
    this.Function_Error = null;
    this.Function_Before = null;
    this.Function_Complete = null;
    this.InternalAjax = null;
    this.Send = function () {
        var caller = this;
        this.InternalAjax = $.ajax({
            // 전송타입 POST or GET
            type: (caller.IsPost == true) ? 'POST' : 'GET',
            // 대상 URL
            url: caller.URL,
            // Async-Sync 처리
            async: (caller.IsAsync == true) ? true : false,
            // 전송할 데이터
            data: (caller.Data != null) ? caller.Data : '',
            // 캐시 사용안함
            cache: false,
            // 컨텐츠 타입
            contentType: (caller.ContentType != null) ? caller.ContentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            // 전송전 이벤트
            beforeSend: function () {
                //// 로딩마스크 사용할 경우
                //if (caller.UseLoadingMask == true) {
                //    WrapLoadingMask();
                //}
                if (caller.Function_Before != null) caller.Function_Before();
            },
            // 전송후 이벤트
            complete: function () {
                //if (caller.UseLoadingMask == true) {
                //    UnwrapLoadingMask();
                //}
                if (caller.Function_Complete != null) caller.Function_Complete();
            },
            // 페이지 호출 성공시, 페이내 결과와는 별개
            success: function (d, s, x) {
                if (caller.Function_Success != null)
                    caller.Function_Success(d, s, x);
            },

            // 페이지 호출 실패시, 401, 500 오류등..
            error: function (d, s, e) {
                if (caller.Function_Error != null)
                    caller.Function_Error(d, s, e);
            },
            // 리턴 데이터타입
            dataType: (caller.ReturnDataType == 'JSON') ? 'JSON' : (caller.ReturnDataType == 'XML') ? 'XML' : ''
        });
    };
    this.Cancel = function () { if (this.InternalAjax != null) this.InternalAjax.abort(); };
};