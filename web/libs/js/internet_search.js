/**
 * Created by 余乐悠 on 2017/8/11.
 */

var pages;

window.load = function () {

};

$(document).ready(function(){
    $("#result-list").delegate("a","click",function(){
        console.log(this.id);
        console.log(pages[this.id].displayUrl);
        parent.document.getElementById("close_internet_btn").style.display = "block";
        parent.document.getElementById("internet_search_result").src = "http://" + pages[this.id].displayUrl;
        window.parent.document.getElementById("internet_search_result").style.display = "block";
    });
});

/**
 * 转换为网页视图
 * */
function page() {
    ID("red-line-left").style.display = "block";
    ID("red-line-right").style.display = "none";
}

/**
 * 转换为图片视图
 * */
function picture() {
    ID("red-line-left").style.display = "none";
    ID("red-line-right").style.display = "block";
}

/**
 * 获取指定id的dom对象
 * */
function ID(id) {
    return document.getElementById(id);
}

/**
 * 必应搜索
 * */
function SearchBing() {
    ID("load").style.display = "block";
    var query = document.getElementById("search_input").value;
    if(query ==""){
        return;
    }
    query += "寻人";
    console.log(query);
    var params = {
        // Request parameters
        "q": query,
        "count": "5",
        "offset": "0",
        "mkt": "zh",
        "safesearch": "Moderate",
    };
    var url = "https://api.cognitive.microsoft.com/bing/v7.0/search?" + $.param(params);
    console.log(url);
    $.ajax({
        url: url,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","192a7933e14848b5ac6395d66fdbc3d7");
        },
        type: "GET",
        // Request body
        data: "{body}"
    })
        .done(function(data) {
            console.log("success");
            console.log(data);
            console.log(JSON.stringify(data));
            /*var webPages = data.webPages.value;
            console.log(webPages);*/
            /*var images = data.images.value;
            console.log(images);*/
            pages = data.webPages.value;
            setResultList(data.webPages.value);
            ID("load").style.display = "none";
        })
        .fail(function() {
            alert("error");
        });
}

/**
 * 展示搜索结果
 * */
function setResultList(data) {
    var html = "";
    for (var i=0;i<data.length;i++) {
        html += getSingleResult(i, data[i].name, data[i].snippet);
    }
    ID("result-list").innerHTML = html;
}

/**
 * 获取单条搜索结果
 * */
function getSingleResult(id, name, content) {
    return '<div class="row result">'+
            '<div class="row">'+
            '<a id="'+id+'">'+ name +'</a>'+
            '</div>'+
            '<div class="row">'+
            '<p>'+content+'</p>'+
            '</div>'+
            '</div>';
}

function closeSearch() {
    parent.document.getElementById("internet_search").style.display = "none";
}