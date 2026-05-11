const Order = require("../../models/order.model")
const User = require("../../models/account.model")
const Product = require("../../models/products.model")
module.exports.dashboard = async (req, res) => {
    const overview = {
        totalUser: 0,
        totalOrder: 0,
        totalPrice: 0,
        totalProduct: 0,
    };
    const productList = await Product.find({
        deleted: false
    })
    overview.totalProduct = productList.length;
    overview.totalUser = await User.countDocuments({
        deleted: false,

    });

    const orderList = await Order.find({
        deleted: false
    })

    overview.totalOrder = orderList.length;

    overview.totalPrice = orderList.reduce((sum, item) => {
        return sum + item.total;
    }, 0);
    // End Section 1
    const ordersNew = await Order.find({
        deleted: false
    }).sort({ createdAt: -1 }).limit(5)
    for (let item of ordersNew) {
        item.createdAtFormat = item.createdAt ? item.createdAt.toLocaleString("vi-VN") : ""
        item.totalFormat = item.total ? item.total.toLocaleString("vi-VN") : ""
    }
    res.render("admin/pages/dashboard", {
        pageTitle: "Tổng quan",
        overview: overview,
        ordersNew: ordersNew,

    })
}


module.exports.revenueChart = async (req, res) => {
    const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body

    // Truy vấn tất cả đơn hàng trong tháng hiện tại
    const ordersCurrentMonth = await Order.find({
        deleted: false,
        createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1)
        }
    })

    // Truy vấn tất cả đơn hàng trong tháng trước
    const ordersPreviousMonth = await Order.find({
        deleted: false,
        createdAt: {
            $gte: new Date(previousYear, previousMonth - 1, 1),
            $lt: new Date(previousYear, previousMonth, 1)
        }
    })

    // Tạo mảng doanh thu theo từng ngày
    const dataMonthCurrent = [];
    const dataMonthPrevious = [];

    for (const day of arrayDay) {
        // Tính tổng doanh thu theo từng ngày của tháng này
        let totalCurrent = 0;
        for (const order of ordersCurrentMonth) {
            const orderDate = new Date(order.createdAt).getDate();
            if (day == orderDate) {
                totalCurrent += order.total;
            }
        }
        dataMonthCurrent.push(totalCurrent);

        // Tính tổng doanh thu theo từng ngày của tháng trước
        let totalPrevious = 0;
        for (const order of ordersPreviousMonth) {
            const orderDate = new Date(order.createdAt).getDate();
            if (day == orderDate) {
                totalPrevious += order.total;
            }
        }
        dataMonthPrevious.push(totalPrevious);
    }

    res.json({
        code: "success",
        dataMonthCurrent: dataMonthCurrent,
        dataMonthPrevious: dataMonthPrevious
    });
}

