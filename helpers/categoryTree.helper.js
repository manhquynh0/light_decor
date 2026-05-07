
const Category = require("../models/category.model")
const categoryTree = (categories, parent = "") => {
    const tree = []
    categories.forEach(item => {
        let itemParent = (item.parent || "").toString();
        if (itemParent === "null" || itemParent === "undefined") itemParent = "";

        let targetParent = (parent || "").toString();
        if (targetParent === "null" || targetParent === "undefined") targetParent = "";

        if (itemParent === targetParent) {
            const children = categoryTree(categories, item._id)
            tree.push({
                _id: item._id.toString(),
                name: item.name,
                children: children,
                slug: item.slug
            })
        }
    })
    return tree
}

module.exports.categoryTree = categoryTree
module.exports.getAllSubcateId = async (parentID) => {
    const result = [parentID] // tạo mảng lưu trữ id của tất cả danh mục con và cha
    const findChildren = async (currentID) => { //hàm tìm các id con
        const children = await Category.find({
            parent: currentID, // tìm id con sao cho trùng với id cha (vì id cha là id của danh mục con)
            deleted: false,
            status: "active"
        });
        for (const item of children) {
            result.push(item.id);
            await findChildren(item.id);
        }
    };

    await findChildren(parentID);
    return result;
}