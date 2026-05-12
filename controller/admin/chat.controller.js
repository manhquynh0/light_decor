const Product = require("../../models/products.model");
const Category = require("../../models/category.model");
const Chat = require("../../models/chat.model");
const { postToGemini } = require("../../helpers/gemini.helper");

function normalizeGeminiHistory(history) {
    const normalized = history.map((chat) => ({
        role: chat.role === "model" ? "model" : "user",
        parts: [{ text: chat.content }]
    }));

    while (normalized.length > 0 && normalized[0].role !== "user") {
        normalized.shift();
    }

    while (normalized.length > 0 && normalized[normalized.length - 1].role !== "model") {
        normalized.pop();
    }

    return normalized;
}

module.exports.index = async (req, res) => {
    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;
        const userId = req.user ? req.user.id : "admin_global";

        if (!message) {
            return res.json({ code: "error", message: "Tin nhan trong!" });
        }

        const history = await Chat.find({ user_id: userId, type: "admin" })
            .sort({ createdAt: -1 })
            .limit(10);

        const formattedHistory = normalizeGeminiHistory(history.reverse());

        const modelToUse = "models/gemini-flash-latest";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${modelToUse}:generateContent?key=${API_KEY}`;

        const tools = [{
            function_declarations: [
                {
                    name: "create_product",
                    description: "Them san pham moi. Co the kem gia, so luong, mo ta va ten danh muc.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" },
                            priceNEW: { type: "STRING" },
                            priceOLD: { type: "STRING" },
                            stock: { type: "STRING" },
                            description: { type: "STRING" },
                            category_name: { type: "STRING" },
                            made: { type: "STRING" },
                            material: { type: "STRING" },
                            power: { type: "STRING" },
                            size: { type: "STRING" },
                            colorIndex: { type: "STRING" },
                            avatar: { type: "STRING" },
                            images: { type: "STRING" }
                        },
                        required: ["name", "priceNEW"]
                    }
                },
                {
                    name: "create_category",
                    description: "Tao danh muc moi, co the chi dinh danh muc cha va mo ta.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" },
                            parent_name: { type: "STRING" },
                            description: { type: "STRING" }
                        },
                        required: ["name"]
                    }
                },
                {
                    name: "update_product_price",
                    description: "Cap nhat gia moi cho san pham.",
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
                    description: "Xoa mem san pham.",
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

        let data;

        try {
            data = await postToGemini(apiUrl, {
                system_instruction: {
                    parts: [{
                        text: "Ban la tro ly Admin cap cao cua MANHQUYNH DECOR. Ban co quyen tao san pham, danh muc va cap nhat gia."
                    }]
                },
                contents: [...formattedHistory, { role: "user", parts: [{ text: message }] }],
                tools
            });
        } catch (error) {
            if (!String(error.message).toLowerCase().includes("history")) {
                throw error;
            }

            data = await postToGemini(apiUrl, {
                system_instruction: {
                    parts: [{
                        text: "Ban la tro ly Admin cua MANHQUYNH DECOR."
                    }]
                },
                contents: [{ role: "user", parts: [{ text: message }] }],
                tools
            });
        }

        return handleResponse(data, userId, message, res);
    } catch (error) {
        res.json({ code: "error", message: "Loi Admin AI: " + error.message });
    }
};

async function handleResponse(data, userId, message, res) {
    const candidate = data?.candidates?.[0];

    if (!candidate?.content?.parts?.length) {
        throw new Error("Gemini khong tra ve noi dung hop le.");
    }

    const functionCall = candidate.content.parts.find((part) => part.functionCall);
    let finalMessage = "";

    if (functionCall) {
        const { name, args = {} } = functionCall.functionCall;

        if (name === "create_product") {
            let categoryIds = [];

            if (args.category_name) {
                const category = await Category.findOne({
                    name: { $regex: args.category_name, $options: "i" }
                });

                if (category) {
                    categoryIds.push(category.id);
                }
            }

            const newProduct = new Product({
                name: args.name,
                priceNEW: args.priceNEW,
                stock: args.stock || "0",
                description: args.description || "",
                category: categoryIds,
                status: "active",
                colorIndex : args. colorIndex,
             
                made : args.made,
           
                material : args.material,
                
                power : args.power,
               
                size : args.size,
                avatar : args.avatar,
                images : args.images
               
            });
            await newProduct.save();
            finalMessage = `Đã tạo sản phẩm : **${args.name}**.`;
        } else if (name === "update_product_price") {
            const product = await Product.findOne({
                name: { $regex: args.name, $options: "i" },
                deleted: false
            });

            if (product) {
                product.priceNEW = args.new_price;
                await product.save();
                const numericPrice = Number(args.new_price);
                const formattedPrice = Number.isFinite(numericPrice)
                    ? numericPrice.toLocaleString("vi-VN")
                    : args.new_price;
                finalMessage = `Da cap nhat gia san pham **${product.name}** thanh **${formattedPrice} VND**.`;
            } else {
                finalMessage = `Khong tim thay san pham "${args.name}".`;
            }
        } else if (name === "create_category") {
            let parentId = "";

            if (args.parent_name) {
                const parentCategory = await Category.findOne({
                    name: { $regex: args.parent_name, $options: "i" }
                });

                if (parentCategory) {
                    parentId = parentCategory.id;
                }
            }

            const newCategory = new Category({
                name: args.name,
                parent: parentId,
                description: args.description || "",
                status: "active"
            });
            await newCategory.save();
            finalMessage = `Da tao danh muc: **${args.name}**.`;
        } else if (name === "delete_product") {
            const product = await Product.findOneAndUpdate(
                { name: { $regex: args.name, $options: "i" } },
                { deleted: true, deletedAt: new Date() },
                { new: true }
            );

            if (product) {
                finalMessage = `Da xoa san pham: **${product.name}**.`;
            } else {
                finalMessage = `Khong tim thay san pham "${args.name}".`;
            }
        } else {
            finalMessage = "Gemini goi toi mot chuc nang chua duoc ho tro.";
        }
    } else {
        finalMessage = candidate.content.parts[0].text || "Gemini khong tra ve noi dung.";
    }

    await Chat.create([
        { user_id: userId, role: "user", content: message, type: "admin" },
        { user_id: userId, role: "model", content: finalMessage, type: "admin" }
    ]);

    return res.json({ code: "success", message: finalMessage });
}

module.exports.getHistory = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : "admin_global";
        const history = await Chat.find({ user_id: userId, type: "admin" })
            .sort({ createdAt: 1 })
            .limit(30);

        res.json({ code: "success", history });
    } catch (error) {
        res.json({ code: "error", message: error.message });
    }
};
