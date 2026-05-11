module.exports.index = async (req, res) => {
    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!message) return res.json({ code: "error", message: "Tin nhắn trống!" });

        const modelToUse = "models/gemini-flash-latest";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/${modelToUse}:generateContent?key=${API_KEY}`;

        // PHẦN HUẤN LUYỆN AI Ở ĐÂY
        const systemInstruction = `
            Bạn là trợ lý ảo AI chuyên nghiệp của cửa hàng nội thất cao cấp MANHQUYNH DECOR.
            Thông tin cửa hàng:
            - Tên: MANHQUYNH DECOR!
            - Sản phẩm: Các loại đèn trang trí , đồ trang trí cao cấp.
            - Phong cách: Sang trọng, tinh tế, hiện đại.
            
            Quy tắc trả lời:
            1. Luôn lịch sự, xưng hô là "Dạ, MANHQUYNH xin nghe" hoặc "Em có thể giúp gì cho anh/chị ạ?".
            2. Trả lời ngắn gọn, tập trung vào tư vấn sản phẩm nội thất.
            3. Nếu khách hỏi về giá hoặc mua hàng, hãy mời khách xem trong danh mục "Sản phẩm" hoặc để lại số điện thoại để nhân viên gọi tư vấn.
            4. Tuyệt đối không trả lời các câu hỏi về chính trị, tôn giáo hoặc các vấn đề không liên quan đến nội thất.
        `;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Google API Error:", data.error);
            if (data.error.status === "RESOURCE_EXHAUSTED") {
                throw new Error("Hệ thống đang bận một chút, bạn thử lại sau 30 giây nhé.");
            }
            throw new Error("AI đang nghỉ ngơi, bạn quay lại sau nhé!");
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        res.json({
            code: "success",
            message: aiResponse
        });

    } catch (error) {
        console.error("AI Chat Error Detail:", error);
        res.json({
            code: "error",
            message: error.message
        });
    }
};
