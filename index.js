let key = "sk-498918c709a2402990333eaf30995c33";
let base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";


let getTitle = () => {
    return document.querySelector('.ques_right .ques_title .stem_con .stem').innerText;
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getOptionAndAnswer() {
    let titleType = document.querySelector("#__layout > div > div > div.answer_content > div > div > div.answerArea > div.answerArea_left > div.exam_title > div.question_type_left").textContent;
    let optionList = document.querySelectorAll('.option');
    var list = [];

    for (let i = 0; i < optionList.length; i++) {
        list.push(optionList[i].innerText);
    }

    if (titleType.includes("单选题")) {
        let prompt = `我给你一个题目和选项，你直接返回A、B、C、D就行:题目:${getTitle()}\r\n ${list}`;
        try {
            let result = await callQwenApi(prompt);
            let temp = result.trim()[0];
            if (temp == "A") optionList[0].click();
            else if (temp == "B") optionList[1].click();
            else if (temp == "C") optionList[2].click();
            else if (temp == "D") optionList[3].click();
            else console.log("未找到选项");
        } catch (error) {
            console.log("API 错误:", error);
        }

    } else if (titleType.includes("填空题")) {

        let prompt = `我给你一个填空题，你直接返回答案中间用空格分隔其他信息都不要，如果有选项就返回正确的选项(ABCD)不要返回选项的值 题目:${getTitle()}\r\n ${list}`;
        try {
            let result = await callQwenApi(prompt);
            result= result.replace(/\s+/g, '');
            for (let i = 0; i < result.length; i++) {
                // 获取 input 元素
                const inputElement = document.querySelector(`#math_container > div > div.ques_options > div > span > span:nth-child(${i+1}) > span > input`);
                // 设置值
                inputElement.value = result[i];
                // 创建并触发一个输入事件
                const event = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(event);
            }
        } catch (error) {
            console.log("填空 API 错误:", error);
        }

    } else {
        console.error("-------------暂不支持此题型请手动填入----------------");
        console.log(result);
        await delay(1000*10); // 等待一秒点击下一题
    }
}

async function startLoop() {
    const liElements = document.querySelectorAll("#__layout > div > div > div.answer_content > div > div > div.answerArea > div.answerArea_right > div > div.answer_num_card > div.answer_num_card_area > div.ques_num_box.scrollbar > ul li");
    for (let i = 0; i < liElements.length; i++) {
        await getOptionAndAnswer();
        await delay(1000); // 等待一秒点击下一题
        let nextBtn = document.querySelector("#__layout > div > div > div.answer_content > div > div > div.answerArea > div.answerArea_left > div.btn_box > div > button:nth-child(3)");
        if (nextBtn) nextBtn.click();
        else {
            console.log("未找到下一题按钮，可能到头了");
            break;
        }
        await delay(1500); // 等页面加载完再处理下一题
    }
}

async function startOne() {
    await getOptionAndAnswer();
    await delay(1500); // 等页面加载完再处理下一题
}

async function callQwenApiv2(text) {
    let response = await fetch("http://localhost:8080/")
}

async function callQwenApi(promptText) {
    const url = base_url;
    const apiKey = key;

    const requestBody = {
        model: "qwen-max",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: promptText
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody),
    });

    const responseBody = await response.json();
    return responseBody.choices[0].message.content;
}

function init() {
    // 启动循环刷题
    // startLoop();
    startOne();
}
init()