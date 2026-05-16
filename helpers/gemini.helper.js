async function parseJsonResponse(response) {
    const rawText = await response.text();

    if (!rawText || !rawText.trim()) {
        const statusLabel = response.status ? `HTTP ${response.status}` : "unknown status";
        throw new Error(`Gemini trả về nội dung rỗng (${statusLabel}).`);
    }

    try {
        return JSON.parse(rawText);
    } catch (error) {
        const preview = rawText.slice(0, 200).replace(/\s+/g, " ").trim();
        throw new Error(`Gemini trả về dữ liệu không hợp lệ: ${preview || "empty body"}`);
    }
}

function getRetrySeconds(message) {
    const rawMessage = String(message || "").trim();
    const retryMatch = rawMessage.match(/retry in\s+([\d.]+)s/i);
    return retryMatch ? Math.ceil(Number(retryMatch[1])) : null;
}

function formatGeminiErrorMessage(message, status) {
    const rawMessage = String(message || "").trim();
    const lowerMessage = rawMessage.toLowerCase();

    if (
        status === 429 ||
        lowerMessage.includes("quota exceeded") ||
        lowerMessage.includes("rate limit") ||
        lowerMessage.includes("resource_exhausted") ||
        lowerMessage.includes("exceeded your current quota")
    ) {
        const retrySeconds = getRetrySeconds(rawMessage);

        if (retrySeconds && Number.isFinite(retrySeconds)) {
            return `AI dang qua tai hoac het quota tam thoi. Thu lai sau ${retrySeconds} giay.`;
        }

        return "AI dang qua tai hoac het quota tam thoi. Vui long thu lai sau it phut.";
    }

    if (status === 404) {
        return "Không tìm thấy model AI hoặc endpoint Gemini không hợp lệ.";
    }

    return rawMessage || `HTTP ${status}`;
}

async function postToGemini(url, body, retryCount = 0) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await parseJsonResponse(response);

    if (!response.ok) {
        const errorMessage = data?.error?.message || "";
        const status = response.status;

        // Tự động thử lại nếu bị rate limit (429) và thời gian chờ < 30 giây
        if (status === 429 && retryCount < 2) {
            const retrySeconds = getRetrySeconds(errorMessage);
            if (retrySeconds && retrySeconds <= 30) {
                console.log(`Rate limit detected. Attempt ${retryCount + 1}. Retrying in ${retrySeconds} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retrySeconds * 1000 + 1000));
                return postToGemini(url, body, retryCount + 1);
            }
        }

        throw new Error(formatGeminiErrorMessage(errorMessage, status));
    }

    if (data?.error?.message) {
        throw new Error(formatGeminiErrorMessage(data.error.message, response.status));
    }

    return data;
}

module.exports = {
    postToGemini
};
