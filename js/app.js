import questionBank from './js/question-bank.js';
import { questionRenderer } from './js/question-render.js';
import aiAssistant from './js/ai-assistant.js';

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
        if (questions.length === 0) {
            throw new Error('当前章节没有可用题目');
        }
        questionRenderer.renderQuestions(questions);
    } catch (error) {
        console.error('开始刷题失败:', error);
        alert('加载题目失败: ' + error.message);
    }
}

// 显示答案
function showAnswer(button, questionIndex) {
    const question = questionBank.getQuestionByIndex(questionIndex);
    if (!question) {
        console.error('未找到题目:', questionIndex);
        return;
    }

    const questionDiv = button.closest('.question');
    const inputs = questionDiv.querySelectorAll('input');
    const explanation = questionDiv.querySelector('.explanation');

    // 重置样式
    questionDiv.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });

    // 处理正确答案（支持单选和多选）
    const correctAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];
    let isUserCorrect = true;

    // 检查用户选择
    inputs.forEach((input, index) => {
        const optionElement = input.closest('.option');
        const isCorrectOption = correctAnswers.includes(index);

        if (input.checked) {
            optionElement.classList.add(isCorrectOption ? 'correct' : 'incorrect');
            if (!isCorrectOption) isUserCorrect = false;
        } else if (isCorrectOption) {
            optionElement.classList.add('correct');
        }
    });

    // 显示解释
    explanation.hidden = false;
    button.disabled = true;

    // 显示结果
    const resultText = isUserCorrect ? '✓ 回答正确!' : '✗ 回答错误';
    const correctAnswerText = correctAnswers.map(a => String.fromCharCode(65 + a)).join(', ');
    alert(`${resultText}\n正确答案: ${correctAnswerText}`);
}

// 导出公共接口
export default {
    initChapters,
    startPractice,
    showAnswer
};
