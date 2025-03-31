import questionBank from './question-bank.js';

class QuestionRenderer {
    constructor() {
        this.container = document.getElementById('questionContainer');
    }

    renderQuestions(questions) {
        if (!questions || !questions.length) {
            this.container.innerHTML = '<div class="no-questions">没有找到题目</div>';
            return;
        }

        this.container.innerHTML = '';

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.dataset.index = index;

            questionDiv.innerHTML = this._buildQuestionHTML(question, index);
            this.container.appendChild(questionDiv);
        });
    }

    _buildQuestionHTML(question, index) {
        let html = `
            <h3>题目 ${index + 1}</h3>
            <div class="stem">${question.stem}</div>
        `;

        if (question.image) {
            html += `<img src="${question.image}" alt="题目图片" class="question-image">`;
        }

        html += `
            <div class="options-container">
                ${this._buildOptionsHTML(question, index)}
            </div>
            <button class="submit-btn" onclick="app.showAnswer(this, ${index})">提交答案</button>
            <div class="explanation" hidden>${question.explanation || '暂无解析'}</div>
        `;

        return html;
    }

    _buildOptionsHTML(question, qIndex) {
        return question.options.map((option, optIndex) => `
            <label class="option">
                <input type="${question.type === 'multi' ? 'checkbox' : 'radio'}"
                       name="q${qIndex}"
                       value="${optIndex}">
                <span class="option-text">${String.fromCharCode(65 + optIndex)}. ${option}</span>
            </label>
        `).join('');
    }
}

const questionRenderer = new QuestionRenderer();
export { questionRenderer };
