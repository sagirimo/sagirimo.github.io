import questionBank from './question-bank.js';
import { questionRenderer } from './question-render.js';
import * as aiAssistant from './ai-assistant.js';

// 初始化章节选择器
function initChapters() {
    const select = document.getElementById('chapterSelect');
    select.innerHTML = '<option value="all">全部章节</option>';

    questionBank.chapters.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter.id;
        option.textContent = chapter.name;
        select.appendChild(option);
    });
}

// 开始刷题
function startPractice() {
    if (!questionBank.isLoaded) {
        alert('题库尚未加载完毕，请稍后再试');
        return;
    }

    const chapterId = document.getElementById('chapterSelect').value;
    const isRandom = document.getElementById('modeSelect').value === 'random';

    try {
        const questions = questionBank.getQuestions(chapterId, isRandom);
        questionRenderer.renderQuestions(questions);
    } catch (error) {
        console.error('开始刷题失败:', error);
        alert('加载题目失败: ' + error.message);
    }
}

// 显示答案
function showAnswer(button, questionIndex) {
    const question = questionBank.getQuestionByIndex(questionIndex);
    if (!question) return;

    const questionDiv = button.closest('.question');
    const inputs = questionDiv.querySelectorAll('input');
    const explanation = questionDiv.querySelector('.explanation');

    // 重置样式
    questionDiv.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });

    // 获取正确答案
    const correctAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];
    let isCorrect = true;

    // 检查用户答案
    inputs.forEach((input, index) => {
        const isAnswerCorrect = correctAnswers.includes(index);
        const optionElement = input.closest('.option');

        if (input.checked) {
            optionElement.classList.add(isAnswerCorrect ? 'correct' : 'incorrect');
            if (!isAnswerCorrect) isCorrect = false;
        } else if (isAnswerCorrect) {
            optionElement.classList.add('correct');
        }
    });

    // 显示解释
    explanation.hidden = false;
    button.disabled = true;

    // 显示结果
    const resultText = isCorrect ? '回答正确!' : '回答错误';
    alert(`${resultText}\n正确答案: ${correctAnswers.map(a => String.fromCharCode(65 + a)).join(', ')}`);
}

// 暴露公共方法
export {
    initChapters,
    startPractice,
    showAnswer
};
