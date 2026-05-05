const express = require("express");
require("dotenv").config(); // nạp biến env vào môi trường
const app = express();
const path = require("path");
const clientRouter = require("./router/client/index.router")
const adminRouter = require("./router/admin/index.router")
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const session = require("express-session");
const port = 3636; // sử dụng cổng
const DATABASE = require("./config/database")
// thiết lập view
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// thiết lập các file tĩnh bên FE
app.use(express.static(path.join(__dirname, "public")));

// cho phép gửi dữ liệu dạng json
app.use(express.json());

// kết nối database
DATABASE.connect();
//thiết lập đường dẫn 

// su dung cookie-parse
app.use(cookieParser("cay"))
// Nhúng thư viện flash
app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
    }
}))
app.use(flash());
//
app.use('/', clientRouter)
app.use('/admin', adminRouter)
//
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
