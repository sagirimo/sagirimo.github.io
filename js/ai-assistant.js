import questionBank from './js/question-bank.js';

const AIAssistant = {
    async queryDeepSeek(prompt, context = '') {
        try {
            // 实际项目中这里应该调用您的API
            // 以下是模拟实现
            console.log('发送到AI的请求:', { prompt, context });

            // 模拟API响应延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 返回模拟响应
            return {
                success: true,
                response: "这是AI的模拟响应。在实际应用中，这里会返回DeepSeek API的真实响应。\n\n" +
                         "您的问题是: " + prompt + "\n\n" +
                         (context ? "提供的上下文: " + context : "")
            };
        } catch (error) {
            console.error('AI请求失败:', error);
            return {
                success: false,
                error: '请求AI服务失败: ' + error.message
            };
        }
    },

    async askCustomQuestion(button, questionIndex) {
        const panel = button.closest('.ai-panel');
        const textarea = panel.querySelector('textarea');
        const responseDiv = panel.querySelector('.ai-response');

        if (!textarea.value.trim()) {
            alert('请输入您的问题');
            return;
        }

        button.disabled = true;
        responseDiv.textContent = "AI思考中...";

        try {
            const question = questionBank.getQuestionByIndex(questionIndex);
            if (!question) throw new Error('未找到题目');

            const context = JSON.stringify({
                stem: question.stem,
                options: question.options,
                answer: question.answer,
                explanation: question.explanation || "暂无解析"
            });

            const result = await this.queryDeepSeek(textarea.value, context);

            if (result.success) {
                responseDiv.innerHTML = this.formatResponse(result.response);
            } else {
                responseDiv.textContent = result.error;
            }
        } catch (error) {
            console.error('提问失败:', error);
            responseDiv.textContent = "提问失败: " + error.message;
        } finally {
            button.disabled = false;
        }
    },

    async askSmartQuestion(button, questionIndex) {
        const panel = button.closest('.ai-panel');
        const responseDiv = panel.querySelector('.ai-response');

        button.disabled = true;
        responseDiv.textContent = "AI分析中...";

        try {
            const question = questionBank.getQuestionByIndex(questionIndex);
            if (!question) throw new Error('未找到题目');

            const prompt = `请分析以下题目：
题目：${question.stem}
选项：${question.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('\n')}
正确答案：${Array.isArray(question.answer) ?
    question.answer.map(a=>String.fromCharCode(65+a)).join(', ') :
    String.fromCharCode(65+question.answer)}
解析：${question.explanation || "暂无"}

请从以下方面分析：
1. 题目考查的知识点
2. 各选项的含义和区别
3. 解题思路和技巧
4. 常见错误分析`;

            const result = await this.queryDeepSeek(prompt);

            if (result.success) {
                responseDiv.innerHTML = this.formatResponse(result.response);
            } else {
                responseDiv.textContent = result.error;
            }
        } catch (error) {
            console.error('分析失败:', error);
            responseDiv.textContent = "分析失败: " + error.message;
        } finally {
            button.disabled = false;
        }
    },

    formatResponse(text) {
        // 简单处理：将换行符转换为<br>，并转义HTML特殊字符
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
    }
};

export default AIAssistant;
