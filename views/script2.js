

var cat = [];
var url = "http://localhost:8081";
var DB = [];

function displayCatalog() {



    for (var i = 0; i < DB.length; i++) {

        var theItem = DB[i];
        displayItem(theItem);


        if (cat.indexOf(theItem.cat) < 0) {
            cat.push(theItem.cat);
        }
    }

    console.log(cat);
    for (var j = 0; j < cat.length; j++) {
        var catstring = cat[j];
        $("#cat-list").append(`<li>${catstring}</li>`)
    }
}

function displayItem(item) {
    var itemHTML = `<div class="item">
                    <img src="${item.image}">
                    <h4>${item.brand}</h4>
                    <p>${item.des}</p>
                    </div>`;
    $("#item-list").append(itemHTML);
}

function search() {

    $("#item-list").html('');

    var text = $("#txtSearch").val();
    text = text.toLowerCase();
    console.log(text);

    for (var i = 0; i < DB.length; i++) {
        var item = DB[i];
        if (item.des.toLowerCase().indexOf(text) >= 0
            ||
            item.brand.toLowerCase().indexOf(text) >= 0
            ||
            item.id == text ||
            item.cat.toLowerCase() == text
        ) {
            displayItem(item);
        }
    }
}


function lowerThan100() {
    for (var i = 0; i < DB.length; i++) {
        var item = DB[i]
        if (item.price <= 100) {
            console.log(item.brand + " - $ " + item.price);
        }
    }

}

function greaterThan100() {
    for (var i = 0; i < DB.length; i++) {
        var item = DB[i]
        if (item.price >= 100) {
            console.log(item.brand + " - $" + item.price);
        }
    }

}

function init() {

    $("#btnSearch").click(search);
    $("#txtSearch").keypress(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });

    getCatalog();


}


function testAjax() {
    var endPoint = url + '/API/test';
    $.ajax({
        url: endPoint,
        type: 'GET',
        success: function (response, status, error) {
            console.log("all good", response);
            console.log('status', status);
            console.log(error);
        },
        error: errFun,
    });
}


function errFun(response, status) {
    console.error("E*R*R*O*R", response);
    console.log("Status", status);
}


function getCatalog() {
    var endPoint = url + '/API/points';
    $.ajax({
        url: endPoint,
        type: 'GET',
        success: function (response) {
            console.log("Great!", response)
            for (var i = 0; i < response.length; i++) {
                var item = response[i];
                if (item.user == "Alexander") {
                    DB.push(item);
                }
            }
            displayCatalog();
        },
        error: function (response) {
            console.error("E*R*R*O*R", response)
        },
    })
}

window.onload = init;
