let key = ""
let base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
let getTitle = () => {
    return document.querySelector('.ques_right .ques_title .stem_con .stem').innerText

}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let getOption = async () => {
    let titleType = document.querySelector("#__layout > div > div > div.answer_content > div > div > div.answerArea > div.answerArea_left > div.exam_title > div.question_type_left").textContent
    let optionList = document.querySelectorAll('.option');
    var list = [];
    for (let i = 0; i < optionList.length; i++) {
        let option = optionList[i];
        let optionText = option.innerText;
        list.push(optionText);
    }

    if (titleType.includes("单选题")) {
        var prompt = `我给你一个题目和选项，你直接返回A、B、C、D就行:题目:${getTitle()}\r\n ${list} `;
        console.log("题目:" + prompt);
        callQwenApi(prompt).then(result => {
            console.log("响应:" + result);
            let temp = result[0];
            if (temp == "A") {
                optionList[0].click();
            } else if (temp == "B") {
                optionList[1].click();
            } else if (temp == "C") {
                optionList[2].click();
            } else if (temp == "D") {
                optionList[3].click();
            } else {
                console.log("未找到");
            }
                document.querySelector("#__layout > div > div > div.answer_content > div > div > div.answerArea > div.answerArea_left > div.btn_box > div > button:nth-child(3)").click();
        });
    } else if (titleType.includes("填空题")) {
        document.querySelector("#__layout > div > div > div.answer_content > div > div > div.answerArea > div.answerArea_left > div.btn_box > div > button:nth-child(3)").click();

        // var prompt = `我给你一个题目和选项，你直接返回A、B、C、D、如果有多个题目如两题，你就返回 AB这样就行题目:${getTitle()}\r\n ${list} `;
        // console.log("题目:" + prompt);
        // callQwenApi(prompt).then(result => {
        //     console.log("响应:" + result);
        //     result = result.replace(/\s/g, '');
        //     for(let i=0;i<result.length-1;i++){
        //        let input = document.querySelector(`#math_container > div > div.ques_options > div > span > span:nth-child(${i+1}) > span > input`)
        //        input.value = result[i]
               
        //     }
        // });
    }else {
        document.querySelector("#__layout > div > div > div.answer_content > div > div > div.answerArea > div.answerArea_left > div.btn_box > div > button:nth-child(3)").click();
    }

};

// setInterval(getOption, 2000);
getOption()
async function callQwenApi(promptText) {
    const url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    const apiKey = key;
    const requestBody = {
        model: "qwen-plus-2025-01-25",
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
        body: JSON.stringify(requestBody)
    });
    const responseBody = await response.json();
    return responseBody.choices[0].message.content;
}

