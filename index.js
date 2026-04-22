const express = require("express");
require("dotenv").config();
const app = express();
const port = 3636;
const path = require("path");
const clientRouter = require("./router/client/index.router")
const adminRouter = require("./router/admin/index.router")

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
app.use('/', clientRouter)
app.use('/admin', adminRouter)
//
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});