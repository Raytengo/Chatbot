document.addEventListener("DOMContentLoaded", function () {
    const chatHistoryDiv = document.getElementById("chat-history");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const worldSettingInput = document.getElementById("world-setting");
    const updateWorldBtn = document.getElementById("update-world-btn");

    // 全局配置
    const config = {
        model: "",
        historyLength: 0,
        temperature: 0
    };

    // 角色模型配置
    const roleModels = {
        ai_left: ""
    };

    // 初始化时获取服务器配置
    fetch("/get_config")
        .then(response => response.json())
        .then(data => {
            if (data.default_model) {
                config.model = data.default_model;
                console.log("已从服务器获取默认模型设置:", config.model);
            }
            if (data.chat_config) {
                config.historyLength = data.chat_config.history_length || config.historyLength;
                config.temperature = data.chat_config.temperature || config.temperature;
                console.log("已从服务器获取对话配置:", data.chat_config);
            }
            if (data.role_models) {
                roleModels.ai_left = data.role_models.ai_left;
                console.log("已从服务器获取角色模型设置:", roleModels);
            }
        })
        .catch(error => console.error("获取服务器配置失败:", error));

    // 狀態變數
    let conversationHistory = [];
    let currentWorldSetting = "";
    let lastChunk = "";

    // 更新世界設定按鈕事件
    updateWorldBtn.addEventListener("click", function () {
        updateWorldBtn.textContent = "以更新!!!";
        updateWorldBtn.disabled = true;
        currentWorldSetting = worldSettingInput.value.trim();
        setTimeout(() => {
            updateWorldBtn.textContent = "更新世界";
            updateWorldBtn.disabled = false;
        }, 1000);
    });

    // 發送按鈕事件
    sendButton.addEventListener("click", sendMessage);

    // 輸入框按Enter發送
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // 發送訊息
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // 添加用戶訊息到聊天歷史
        appendMessage("user", message);
        conversationHistory.push({ role: "user", content: message });
        userInput.value = "";

        // 發送到伺服器並獲取AI回應
        const loadingBubble = appendMessage("ai_left", "thinking...");
        let dots = 0;
        const loadingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            loadingBubble.textContent = `thinking${".".repeat(dots)}`;
        }, 500);

        sendChatRequest(roleModels.ai_left, "ai_left", conversationHistory, message)
            .then(response => {
                clearInterval(loadingInterval);
                loadingBubble.textContent = "";
                if (!response.ok) {
                    loadingBubble.textContent = `AI回應錯誤 (狀態碼: ${response.status})`;
                    return response.text().then(text => console.error("錯誤詳情:", text));
                }

                const reader = response.body.getReader();
                let fullText = "";
                function readChunk() {
                    reader.read().then(({ value, done }) => {
                        if (done) {
                            conversationHistory.push({ role: "ai_left", content: fullText.trim() });
                            return;
                        }
                        const chunk = new TextDecoder().decode(value, { stream: true });
                        const processedChunk = chunk.replace(/data:/g, "").replace(/\n/g, "").replace(/\s+/g, " ").replace("[DONE]", "").trim();
                        fullText += processedChunk;
                        processStreamData(value);
                        readChunk();
                    });
                }
                readChunk();
            })
            .catch(error => {
                clearInterval(loadingInterval);
                loadingBubble.textContent = "錯誤：" + error.message;
                console.error("Fetch 錯誤:", error);
            });
    }

    // 發送聊天請求
    function sendChatRequest(model, role, history, message) {
        return fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                history: history.slice(-config.historyLength),
                message: message,
                temperature: config.temperature,
                model: model,
                role: role,
                world_setting: currentWorldSetting
            })
        });
    }

    // 處理流式數據
    function processStreamData(value) {
        const decoder = new TextDecoder("utf-8");
        const chunkValue = decoder.decode(value, { stream: true });
        const lines = chunkValue.split("\n\n");
        const loadingBubble = chatHistoryDiv.lastElementChild.querySelector(".bubble");

        for (const line of lines) {
            if (line.startsWith("data:")) {
                const data = line.replace(/data:/g, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
                if (data !== "[DONE]" && data !== lastChunk) {
                    loadingBubble.textContent += data;
                    lastChunk = data;
                }
            }
        }
    }

    // 添加訊息到聊天歷史
    function appendMessage(role, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${role}`;
        msgDiv.innerHTML = role === "ai_left" ? `
            <div class="avatar"><img src="/static/pic/left.jpg" alt="Avatar"></div>
            <div class="bubble">${text}</div>
        ` : `
            <div class="bubble">${text}</div>
            <div class="avatar"><img src="/static/pic/right.jpg" alt="Avatar"></div>
        `;
        chatHistoryDiv.appendChild(msgDiv);
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
        return msgDiv.querySelector(".bubble");
    }
});