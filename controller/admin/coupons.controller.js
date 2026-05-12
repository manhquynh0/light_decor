const Coupon = require("../../models/coupon.model")


module.exports.index = async (req, res) => {
    const find = { deleted: false }

    if (req.query.keyword) {
        find.code = { $regex: req.query.keyword, $options: "i" }
    }
    if (req.query.status) {
        find.isActive = req.query.status === "active"
    }

    const limitItems = 10
    let page = 1
    if (req.query.page) {
        const p = parseInt(req.query.page)
        if (!isNaN(p) && p > 0) page = p
    }

    const totalRecord = await Coupon.countDocuments(find)
    const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1)
    if (page > totalPage) page = totalPage

    const skip = (page - 1) * limitItems
    const coupons = await Coupon.find(find)
        .sort({ createdAt: "desc" })
        .limit(limitItems)
        .skip(skip)

    const pagination = { currentPage: page, totalPage, skip, totalRecord }

    res.render("admin/pages/coupons", {
        title: "Mã Giảm Giá",
        coupons,
        pagination
    })
}


module.exports.openAddModal = async (req, res) => {
    const find = { deleted: false }
    const limitItems = 10
    const totalRecord = await Coupon.countDocuments(find)
    const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1)
    const coupons = await Coupon.find(find).sort({ createdAt: "desc" }).limit(limitItems)
    const pagination = { currentPage: 1, totalPage, skip: 0, totalRecord }

    res.render("admin/pages/coupons", {
        title: "Mã Giảm Giá",
        coupons,
        pagination,
        openAddModal: true
    })
}


module.exports.add = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minOrderValue, maxDiscount, expireAt, usageLimit, isActive } = req.body

        const exists = await Coupon.findOne({ code: code.toUpperCase().trim(), deleted: false })
        if (exists) {
            return res.json({ code: "error", message: "Mã coupon đã tồn tại!" })
        }

        const newCoupon = new Coupon({
            code: code.toUpperCase().trim(),
            description: description || "",
            discountType: discountType || "percent",
            discountValue: parseFloat(discountValue) || 0,
            minOrderValue: parseFloat(minOrderValue) || 0,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
            expireAt: expireAt ? new Date(expireAt) : null,
            usageLimit: usageLimit ? parseInt(usageLimit) : null,
            isActive: isActive === "true" || isActive === true
        })

        await newCoupon.save()
        req.flash("success", "Thêm mã giảm giá thành công!")
        res.json({ code: "success" })
    } catch (error) {
        console.error(error)
        req.flash("error", "Lỗi server!")
        res.json({ code: "error", message: "Lỗi server!" })
    }
}


module.exports.openEditModal = async (req, res) => {
    const find = { deleted: false }
    const limitItems = 10
    const totalRecord = await Coupon.countDocuments(find)
    const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1)
    const coupons = await Coupon.find(find).sort({ createdAt: "desc" }).limit(limitItems)
    const pagination = { currentPage: 1, totalPage, skip: 0, totalRecord }

    const couponDetail = await Coupon.findOne({ _id: req.params.id, deleted: false })

    res.render("admin/pages/coupons", {
        title: "Mã Giảm Giá",
        coupons,
        pagination,
        openEditModal: true,
        couponDetail
    })
}


module.exports.edit = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minOrderValue, maxDiscount, expireAt, usageLimit, isActive } = req.body


        const exists = await Coupon.findOne({ code: code.toUpperCase().trim(), deleted: false, _id: { $ne: req.params.id } })
        if (exists) {
            return res.json({ code: "error", message: "Mã coupon đã tồn tại!" })
        }

        await Coupon.updateOne({ _id: req.params.id }, {
            code: code.toUpperCase().trim(),
            description: description || "",
            discountType,
            discountValue: parseFloat(discountValue) || 0,
            minOrderValue: parseFloat(minOrderValue) || 0,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
            expireAt: expireAt ? new Date(expireAt) : null,
            usageLimit: usageLimit ? parseInt(usageLimit) : null,
            isActive: isActive === "true" || isActive === true
        })
        req.flash("success", "Cập nhật mã giảm giá thành công!")
        res.json({ code: "success" })
    } catch (error) {
        console.error(error)
        req.flash("error", "Lỗi server!")
        res.json({ code: "error", message: "Lỗi server!" })
    }
}


module.exports.toggle = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.params.id, deleted: false })
        if (!coupon) return res.json({ code: "error", message: "Không tìm thấy coupon!" })

        await Coupon.updateOne({ _id: req.params.id }, { isActive: !coupon.isActive })
        req.flash("success", "Thay đổi trạng thái mã giảm giá thành công!")
        res.json({ code: "success", isActive: !coupon.isActive })
    } catch (error) {
        req.flash("error", "Lỗi server!")
        res.json({ code: "error", message: "Lỗi server!" })
    }
}

module.exports.delete = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.params.id, deleted: false })
        if (!coupon) return res.json({ code: "error", message: "Không tìm thấy coupon!" })

        await Coupon.updateOne({ _id: req.params.id }, { deleted: true })
        req.flash("success", "Xóa mã giảm giá thành công!")
        res.json({ code: "success" })
    } catch (error) {
        req.flash("error", "Lỗi server!")
        res.json({ code: "error", message: "Lỗi server!" })
    }
}
