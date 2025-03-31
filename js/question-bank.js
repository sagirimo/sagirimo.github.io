class QuestionBank {
    constructor() {
        this.chapters = [];
        this.currentQuestions = [];
        this.isLoaded = false;
    }

    async init() {
        try {
            const listRes = await fetch('./chapter-list.json');
            if (!listRes.ok) throw new Error('无法加载章节列表');

            const { files } = await listRes.json();
            if (!files || !Array.isArray(files)) {
                throw new Error('无效的章节列表格式');
            }

            await Promise.all(files.map(async file => {
                try {
                    const res = await fetch(file);
                    if (!res.ok) throw new Error(`无法加载章节文件: ${file}`);

                    const data = await res.json();
                    this._validate(data);
                    this.chapters.push(...data.chapters);
                } catch (e) {
                    console.error(`加载章节文件失败: ${file}`, e);
                    throw e;
                }
            }));

            this.chapters.sort((a, b) => a.id - b.id);
            this.isLoaded = true;
            document.getElementById('loadProgress').textContent = '题库加载完成';
        } catch (e) {
            console.error('题库初始化失败:', e);
            document.getElementById('loadProgress').textContent = '加载失败: ' + e.message;
            throw e;
        }
    }

    _validate(data) {
        if (!data?.chapters?.length) {
            throw new Error('无效章节数据: 缺少chapters字段');
        }

        data.chapters.forEach((ch, i) => {
            const required = ['id', 'name', 'questions'];
            required.forEach(field => {
                if (!(field in ch)) {
                    throw new Error(`章节${i+1}缺少必要字段: ${field}`);
                }
            });

            if (!Array.isArray(ch.questions)) {
                throw new Error(`章节${ch.name}的questions必须是数组`);
            }
        });
    }

    getQuestions(chapterId, shuffle = false) {
        if (!this.isLoaded) {
            throw new Error('题库尚未加载完成');
        }

        let questions = [];
        if (chapterId === 'all') {
            questions = this.chapters.flatMap(c => c.questions);
        } else {
            const ch = this.chapters.find(c => c.id == chapterId);
            if (!ch) {
                console.warn(`未找到章节ID: ${chapterId}`);
                return [];
            }
            questions = [...ch.questions]; // 创建副本避免修改原数组
        }

        this.currentQuestions = shuffle ? this._shuffleArray(questions) : questions;
        return this.currentQuestions;
    }

    getQuestionByIndex(index) {
        if (index < 0 || index >= this.currentQuestions.length) {
            console.error(`无效的问题索引: ${index}`);
            return null;
        }
        return this.currentQuestions[index];
    }

    _shuffleArray(arr) {
        if (!Array.isArray(arr)) return [];

        // Fisher-Yates洗牌算法
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 创建单例实例
const questionBank = new QuestionBank();
export default questionBank;
