const Product = require("../../models/products.model");
const Category = require("../../models/category.model");

module.exports.index = async (req, res) => {
    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!message) return res.json({ code: "error", message: "Tin nhắn trống!" });

        const modelToUse = "models/gemini-flash-latest";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/${modelToUse}:generateContent?key=${API_KEY}`;

        // 1. ĐỊNH NGHĨA CÁC CÔNG CỤ (TOOLS)
        const tools = [{
            function_declarations: [
                // Quyền: Tạo sản phẩm
                {
                    name: "create_product",
                    description: "Thêm sản phẩm mới. Các trường: name (tên), price (giá), stock (số lượng), description (mô tả).",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" },
                            price: { type: "STRING" },
                            stock: { type: "STRING" },
                            description: { type: "STRING" },
                            category_name: { type: "STRING", description: "Tên danh mục sản phẩm (nếu có)" }
                        },
                        required: ["name", "price"]
                    }
                },
                // Quyền: Tạo danh mục (QUYỀN MỚI)
                {
                    name: "create_category",
                    description: "Tạo một danh mục sản phẩm mới.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING", description: "Tên danh mục" },
                            parent_name: { type: "STRING", description: "Tên danh mục cha (nếu có)" },
                            description: { type: "STRING", description: "Mô tả danh mục" }
                        },
                        required: ["name"]
                    }
                },
                {
                    name: "update_product_price",
                    description: "Cập nhật giá sản phẩm.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" },
                            new_price: { type: "STRING" }
                        },
                        required: ["name", "new_price"]
                    }
                },
                {
                    name: "delete_product",
                    description: "Xóa sản phẩm.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" }
                        },
                        required: ["name"]
                    }
                }
            ]
        }];

        // 2. GỬI YÊU CẦU
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: "Bạn là trợ lý Admin MANHQUYNH DECOR. Bạn giúp quản lý sản phẩm và danh mục. Hãy sử dụng các công cụ được cung cấp để thực hiện yêu cầu của admin." }]
                },
                contents: [{ parts: [{ text: message }] }],
                tools: tools
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const candidate = data.candidates[0];
        const functionCall = candidate.content.parts.find(p => p.functionCall);

        if (functionCall) {
            const { name, args } = functionCall.functionCall;

            // XỬ LÝ TẠO SẢN PHẨM
            if (name === "create_product") {
                let categoryIds = [];
                if (args.category_name) {
                    const cat = await Category.findOne({ name: { $regex: args.category_name, $options: "i" } });
                    if (cat) categoryIds.push(cat.id);
                }

                const newProduct = new Product({
                    name: args.name,
                    priceNEW: args.price,
                    stock: args.stock || "0",
                    description: args.description || "",
                    category: categoryIds,
                    status: "active"
                });
                await newProduct.save();
                return res.json({ code: "success", message: `✅ Đã tạo sản phẩm: **${args.name}**${args.category_name ? ` trong danh mục **${args.category_name}**` : ""}.` });
            }

            // XỬ LÝ TẠO DANH MỤC
            if (name === "create_category") {
                let parentId = "";
                if (args.parent_name) {
                    const parentCat = await Category.findOne({ name: { $regex: args.parent_name, $options: "i" } });
                    if (parentCat) parentId = parentCat.id;
                }

                const newCategory = new Category({
                    name: args.name,
                    parent: parentId,
                    description: args.description || "",
                    status: "active"
                });
                await newCategory.save();
                return res.json({ code: "success", message: `✅ Đã tạo danh mục mới: **${args.name}**${args.parent_name ? ` (thuộc **${args.parent_name}**)` : ""}.` });
            }

            // Xử lý Cập nhật giá
            if (name === "update_product_price") {
                const result = await Product.findOneAndUpdate(
                    { name: { $regex: args.name, $options: "i" } }, 
                    { priceNEW: args.new_price },
                    { new: true }
                );
                if (result) return res.json({ code: "success", message: `✅ Cập nhật giá **${result.name}**: ${args.new_price}đ.` });
                return res.json({ code: "error", message: `❌ Không tìm thấy sản phẩm "${args.name}".` });
            }

            // Xử lý Xóa sản phẩm
            if (name === "delete_product") {
                const result = await Product.findOneAndUpdate(
                    { name: { $regex: args.name, $options: "i" } },
                    { deleted: true, deletedAt: new Date() }
                );
                if (result) return res.json({ code: "success", message: `🗑️ Đã xóa sản phẩm: **${result.name}**.` });
                return res.json({ code: "error", message: `❌ Không tìm thấy sản phẩm "${args.name}".` });
            }
        }

        res.json({ code: "success", message: candidate.content.parts[0].text });

    } catch (error) {
        res.json({ code: "error", message: "Lỗi: " + error.message });
    }
};
