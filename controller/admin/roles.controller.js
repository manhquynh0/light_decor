const Role = require("../../models/role.model");
const permissionList = require("../../config/permission").permissionList;
module.exports.index = async (req, res) => {
    const rolelist = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles", {
        permissionList: permissionList,
        title: "Quản lý phân quyền",
        rolelist: rolelist
    })
}
module.exports.openAddModal = async (req, res) => {
    const rolelist = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles", {
        permissionList: permissionList,
        openAddModal: true,
        rolelist: rolelist
    })
}
module.exports.add = async (req, res) => {
    try {
        console.log(req.body)
        const role = new Role(req.body);
        await role.save();
        req.flash("success", "Thêm vai trò mới thành công!")
        res.json({
            code: "success"
        })
    } catch (error) {
        console.log(error);
        req.flash("error", "Thêm vai trò mới thất bại")
        res.json({
            code: "error"
        })
    }
}
module.exports.openEditModal = async (req, res) => {
    const roleDetail = await Role.findOne({
        _id: req.params.id,
        deleted: false
    })
    const rolelist = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles", {
        permissionList: permissionList,
        openEditModal: true,
        roleDetail: roleDetail,
        rolelist: rolelist
    })
}
module.exports.edit = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id }, req.body)
        req.flash("success", "Cập nhật thành công")
        res.json({
            code: "success"
        })
    } catch (error) {
        console.log(error)
        req.flash("error", "Cập nhật thất bại")
        res.json({
            code: "error"
        })
    }
}
module.exports.delete = async (req, res) => {
    try {
        const role = await Role.findOne({
            _id: req.params.id,
            deleted: false
        })
        if (!role) {
            res.json({
                code: "error",
                message: "Không tìm thấy vai trò!"
            })
            return
        }
        await Role.updateOne({ _id: req.params.id }, {
            deleted: true,
            updatedBy: req.user.id
        })
        req.flash("success", "Xoá thành công!")
        res.json({
            code: "success"
        })
    } catch (error) {
        console.log(error)
        res.json({
            code: "error",
            message: "Lỗi server!"
        })
    }
}