const Chat = require("../../models/chat.model");
const Product = require("../../models/products.model");
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

function normalizeDisplayHistory(history) {
    const normalized = [...history];

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
        const { message, guestId: clientGuestId } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        // Đồng nhất userId: Ưu tiên User ID, sau đó là Guest ID từ client, sau đó là session
        let userId = res.locals.user ? res.locals.user.id : (clientGuestId || req.session.guestId);

        // Nếu là khách và chưa có guestId, hãy tạo mới
        if (!userId) {
            userId = "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
            req.session.guestId = userId;
        }

        if (!message) return res.json({ code: "error", message: "Tin nhắn trống!" });

        // 1. LẤY DANH SÁCH SẢN PHẨM THỰC TẾ TỪ CỬA HÀNG
        const allProducts = await Product.find({ deleted: false })
            .populate("category", "name")

        // Thêm id để Gemini dễ tham chiếu
        const productData = allProducts.map((p, i) => ({
            stt: i + 1,
            name: p.name || "Chưa có tên",
            price: p.priceNEW != null
                ? Number(p.priceNEW).toLocaleString("vi-VN") + " ₫"
                : "Liên hệ",
            priceOLD: p.priceOLD != null
                ? Number(p.priceOLD).toLocaleString("vi-VN") + " ₫"
                : null,
            category: Array.isArray(p.category)
                ? p.category.map(c => c.name).join(", ")
                : "Không rõ",
            status: p.status === "stock" ? "Còn hàng" : "Hết hàng",
            stock: p.stock || "Không rõ",
            description: p.description || "",
            material: p.material || "",
            made: p.made || "",
            power: p.power || "",
            size: p.size || "",
            colorIndex: p.colorIndex || "",
        }));



        // 2. Lấy lịch sử chat (Chỉ lấy trong 24 giờ gần nhất để tối ưu)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const history = await Chat.find({
            user_id: userId,
            type: "client",
            createdAt: { $gte: oneDayAgo }
        })
            .sort({ createdAt: -1, _id: -1 })
            .limit(10);

        const formattedHistory = normalizeGeminiHistory(history.reverse());

        const modelToUse = "models/gemini-flash-latest";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/${modelToUse}:generateContent?key=${API_KEY}`;


        const systemInstruction = `
        Bạn là trợ lý tư vấn bán hàng chuyên nghiệp của MANHQUYNH DECOR — cửa hàng đèn trang trí cao cấp.
        Hãy trả lời thân thiện, tự nhiên như một nhân viên tư vấn thực thụ.

        DANH SÁCH SẢN PHẨM (chỉ dùng dữ liệu này, không được tự bịa):
        ${JSON.stringify(productData, null, 2)}

        ═══════════════════════════════════════
        QUY TẮC BẮT BUỘC:
        ═══════════════════════════════════════

        [DỮ LIỆU]
        1. Tên và giá COPY NGUYÊN XI, không sửa đổi.
        2. Format liệt kê: "- [tên] — [giá]"
        3. Nếu danh sách trống: "Hiện cửa hàng chưa cập nhật sản phẩm."
        4. Không dùng dấu * để bao tên/giá sản phẩm.
        5. Sản phẩm "mới nhất" = sản phẩm có stt cao nhất trong danh sách.

        [TƯ VẤN THÔNG MINH]
      
        6. Nếu khách hỏi "rẻ nhất" → tìm sản phẩm có giá thấp nhất và gợi ý.
        7. Nếu khách hỏi "đắt nhất" / "cao cấp nhất" → tìm giá cao nhất.
        8. Nếu khách hỏi theo phòng (phòng khách, phòng ngủ, bếp...) → lọc theo category hoặc description phù hợp.
        9. Nếu khách hỏi theo ngân sách ("dưới 1 triệu", "khoảng 2 triệu") → lọc sản phẩm trong tầm giá đó.
        10. Nếu khách hỏi chung chung ("có gì đẹp không?") → giới thiệu 3 sản phẩm nổi bật, đa dạng giá.
        11. Nếu khách hỏi sản phẩm không có trong danh sách → trả lời lịch sự: "Hiện cửa hàng chưa có sản phẩm này, bạn có muốn xem các mẫu tương tự không?"
        12. Nếu khách so sánh 2 sản phẩm → liệt kê điểm khác biệt về giá, chất liệu, kích thước.
        13. Nếu khách muốn xin thông tin để liên hệ hoặc có vấn đề gì hãy gợi ý khách liên hệ với số điện thoại : 0373382805 hoặc email : vumanhquynh2852005@gmail.com
       ═══════════════════════════════════════
        [HỎI NGOÀI LỀ ĐƯỢC PHÉP]
        1. Nếu khách hỏi: "Vũ Mạnh Quỳnh là ai?" → trả lời chính xác: "Vũ Mạnh Quỳnh là CEO của MANHQUYNH DECOR."
       
        3. Các câu hỏi ngoài lề KHÁC: → lịch sự từ chối và hướng khách quay lại sản phẩm.
        [GIAO TIẾP]
        14. Xưng "mình" với khách, gọi khách là "bạn".
        15. Cuối mỗi câu trả lời nên có 1 câu hỏi gợi mở để tiếp tục tư vấn.
            Ví dụ: "Bạn đang tìm đèn cho không gian nào ạ?" hoặc "Bạn có muốn mình tư vấn thêm không?"
        16. Không trả lời quá dài, tối đa 5-6 sản phẩm mỗi lần, tránh làm khách overwhelmed.
        17. Nếu khách nói "cảm ơn" hoặc kết thúc → chào tạm biệt thân thiện và mời quay lại.
        18. Nếu câu hỏi không liên quan đến sản phẩm/cửa hàng → lịch sự từ chối và hướng về tư vấn sản phẩm.
       
        `;

        const requestBody = {
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [
                ...formattedHistory,
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ]
        };

        const data = await postToGemini(API_URL, requestBody);

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không thể trả lời lúc này.";

        // Lưu vào lịch sử Chat
        await Chat.create([
            { user_id: userId, role: "user", content: message, type: "client" },
            { user_id: userId, role: "model", content: aiResponse, type: "client" }
        ]);

        const isUser = !!res.locals.user;
        return res.json({
            code: "success",
            message: aiResponse,
            guestId: isUser ? null : userId,
            isUser: isUser
        });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return res.json({ code: "error", message: "Lỗi trợ lý: " + error.message });
    }
};

module.exports.getHistory = async (req, res) => {
    try {
        // Chỉ dùng guestId từ query nếu là guest (không có user đăng nhập)
        let userId = null;

        if (res.locals.user) {
            // Nếu đã đăng nhập, luôn dùng userId từ server
            userId = res.locals.user.id;
        } else {
            // Nếu là guest, dùng guestId từ query
            userId = req.query.guestId || req.session.guestId;
        }

        if (!userId) {
            return res.json({ code: "success", history: [] });
        }

        const history = await Chat.find({ user_id: userId, type: "client" })
            .sort({ createdAt: -1, _id: -1 })
            .limit(20);

        res.json({
            code: "success",
            history: normalizeDisplayHistory(history.reverse())
        });
    } catch (error) {
        res.json({ code: "error", message: error.message });
    }
};
