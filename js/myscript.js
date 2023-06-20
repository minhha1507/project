var app = angular.module("myAPP", ["ngRoute"]);
        app.config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "homepage.html"
                })
                .when("/zone", {
                     templateUrl: "Zone.html"
                })
                .when("/NEWSB", {
                     templateUrl: "NEWS.html"
                })
                .when("/Ticket", {
                    templateUrl: "Ticket.html"
                })
                .when("/gallary", {
                    templateUrl: "gallary.html"
                })
                .when("/login", {
                     templateUrl: "login.html"
                })
                
                .when("/forgotpassword", {
                    templateUrl: "forgotpassword.html"
                })
                .when("/register", {
                    templateUrl: "register.html"
                })
                .when("/contactus", {
                    templateUrl: "contactus.html"
                })
                .when("/AboutUs", {
                    templateUrl: "AboutUs.html"
                })
                .when("/cart", {
                    templateUrl: "cart.html",
                    controller: 'cartControl',
                    controllerAs: 'cart'
                });

                $locationProvider.html5Mode(true).hashPrefix('*');;
        });


// signin-up page
//java login
function f1() {

    let uid = document.getElementById("username1").value.trim();

    if (uid.length == 0) {
        alert("Username cannot be blank, please do again !");
        document.getElementById("username1").focus();
        return false;
    }
    alert("Logged in successfully!");
}

//java register
function f2() {

    let uid = document.getElementById("username").value.trim();

    if (uid.length == 0) {
        alert("Username cannot be blank, Please re-enter !");
        document.getElementById("username").focus();
        return false;
    }
    let pass = document.getElementById("pass").value.trim();
    let pass2 = document.getElementById("pass2").value.trim();
    if (pass != pass2) {
        alert("Password and Retype Password do not match!");
        document.getElementById("pass").focus();
        return false;
    }
    alert("Thanks for your register!");
}


//contactus page
// Check send message
function send() {
    var name = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value
    var message = document.getElementById("message").value;

    if (name == null || name == "") {
        alert(" At least let us know your name! ");
        return false;
    }

    if (email == null || email == "") {
        alert(" Enter your email so we can contact you. Example: group5@gmail.com");
        return false;
    }

    if (phone == null || phone == "") {
        alert("Enter your phone number so we can contact you.");
        return false;
    }

    if (message == null || message == "") {
        alert("Please enter your message.");
        return false;
    }
}

//order ticket
//dinh nghia bien ds o pham vi ung dung a
app.run(function ($rootScope, $http) {
    $rootScope.cart = [];
    $rootScope.total = 0;
});

app.controller("cartControl", function ($scope, $rootScope) {

    $scope.cart = [];
    $scope.cartDisplay = [];

    $scope.bangGia = [
        {loaiVe: "Adults", giaTien: 80, loaiThoiGian: "weekday", tenHienThi: "Adults - WeekDay"},
        {loaiVe: "Adults", giaTien: 100, loaiThoiGian: "weekend", tenHienThi: "Adults - Weekend"},
        {loaiVe: "Children", giaTien: 50, loaiThoiGian: "weekday", tenHienThi: "Children (over 5 years old)- WeekDay"},
        {loaiVe: "Children", giaTien: 70, loaiThoiGian: "weekend", tenHienThi: "Children (over 5 years old) - Weekend"},
        {loaiVe: "ChildrenUnder5yearsOld", giaTien: 0, loaiThoiGian: "weekday", tenHienThi: "Children (under 5 years old) - WeekDay"},
        {loaiVe: "ChildrenUnder5yearsOld", giaTien: 0, loaiThoiGian: "weekend", tenHienThi: "Children (under 5 years old) - Weekend"},
        {loaiVe: "FamilyPackMoreThan3Adults", giaTien: 60, loaiThoiGian: "weekday", tenHienThi: "Family packer (with more than 3 Adults) - WeekDay"},
        {loaiVe: "FamilyPackMoreThan3Adults", giaTien: 80, loaiThoiGian: "weekend", tenHienThi: "Family packer (with more than 3 Adults) - Weekend"},
        {loaiVe: "FamilyPackMoreThan3Child", giaTien: 30, loaiThoiGian: "weekday", tenHienThi: "Family packer (with more than 3 Children over 5 ages) - WeekDay"},
        {loaiVe: "FamilyPackMoreThan3Child", giaTien: 20, loaiThoiGian: "weekend", tenHienThi: "Family packer (with more than 3 Children over 5 ages) - Weekend"},
    ];

    $scope.loaiThoiGian = "weekday";
    $scope.loaiVe = "Adults";

    $scope.soluong = 2;
    $scope.dongia = 0;
    $scope.tongTienChuaVAT = 0;
    $scope.tongTienCoVAT = 0;


    $scope.onChangeLoaiVe = function () {
        const price = $scope.bangGia.find(x => x.loaiThoiGian == $scope.loaiThoiGian && x.loaiVe == $scope.loaiVe);
        if (!price)
            throw new Error("Vui long cau hinh gia tien cho tuy chon nay");

        $scope.dongia = price.giaTien;
    }

    $scope.themVaoGioHang = function () {
        //{ loaiVe: "Adults", giaTien: 80, loaiThoiGian: "weekday", soLuong: 1}
        let ve = $scope.bangGia.find(x => x.loaiThoiGian == $scope.loaiThoiGian && x.loaiVe == $scope.loaiVe);

        let cartItem = $scope.cart.find(x => x.loaiThoiGian == $scope.loaiThoiGian && x.loaiVe == $scope.loaiVe);
        // nếu chưa tồn tại thì thêm vào gio hang
        if (!cartItem) {
            cartItem = { loaiVe: $scope.loaiVe, giaTien: ve.giaTien, loaiThoiGian: $scope.loaiThoiGian, soLuong: $scope.soluong};
            $scope.cart.push(cartItem);
        } else {
            // cập nhật số lượng
            cartItem.soLuong += $scope.soluong;
        }


        $scope.capNhatHienThiGioHang();
    }

    $scope.tinhTien = function () {
        let tongTienChuaVat = 0;
        for (let item of $scope.cart) {
            tongTienChuaVat += item.giaTien * item.soLuong;
        }

        $scope.tongTienChuaVAT = tongTienChuaVat;
        $scope.tongTienCoVAT = (tongTienChuaVat * 1.1).toFixed(2);
    }

    $scope.capNhatHienThiGioHang = function () {
        $scope.cartDisplay = $scope.cart.map(function(item, index) {
            let ve = $scope.bangGia.find(x => x.loaiThoiGian == item.loaiThoiGian && x.loaiVe == item.loaiVe);

            return {tenLoaiVe: ve.tenHienThi, soThuTu: index + 1, ...item};
        });

        // tinh tong tien
        $scope.tinhTien();
    }

    $scope.updateSoLuong = function (displayItem) {
        let cartItem = $scope.cart.find(x => x.loaiThoiGian == displayItem.loaiThoiGian && x.loaiVe == displayItem.loaiVe);
        if (!cartItem) {
            throw new Error("Khong tim thay doi tuong de cap nhat");
        }

        cartItem.soLuong = displayItem.soLuong;
        $scope.capNhatHienThiGioHang();
    }

    $scope.xoaItem = function (displayItem) {
        let removeIndex = $scope.cart.findIndex(x => x.loaiThoiGian == displayItem.loaiThoiGian && x.loaiVe == displayItem.loaiVe);
        if (removeIndex == -1) {
            throw new Error("Khong tim thay doi tuong de xoa");
        }
        $scope.cart.splice(removeIndex, 1);

        $scope.capNhatHienThiGioHang();

    }

    $scope.resetDefaultValues = function () {
        $scope.soluong = 2;
        $scope.loaiThoiGian = "weekday";
        $scope.loaiVe = "Adults";
        $scope.onChangeLoaiVe();
    }

    $scope.xoaGioHang = function () {
        $scope.cart = [];
        $scope.capNhatHienThiGioHang();
    }

    $scope.confirmThanhToan = function myFunction() {
        if (confirm(`Are you sure you want to pay ${$scope.tongTienCoVAT} $ ?`) == true) {
            $scope.xoaGioHang();
            $scope.resetDefaultValues();
            alert("Payment Success!");
        }
    }

    $scope.loadDefaultValue= function () {
        $scope.onChangeLoaiVe();
    }

    $scope.loadPage= function () {
        $scope.loadDefaultValue();
    }

    // load default
    $scope.loadPage();

});

