class QuestionBank {
    constructor() {
        this.chapters = [];
        this.currentQuestions = [];
        this.isLoaded = false;
    }

    async init() {
        try {
            console.log('[QuestionBank] 开始初始化题库...');

            // 1. 加载章节列表
            const listRes = await fetch('./chapter-list.json');
            if (!listRes.ok) {
                throw new Error(`无法加载章节列表: HTTP ${listRes.status}`);
            }

            const listData = await listRes.json();
            console.log('[QuestionBank] 加载到章节列表:', listData.files);

            if (!listData.files || !Array.isArray(listData.files)) {
                throw new Error('无效的chapter-list.json格式: 缺少files数组');
            }

            // 2. 加载所有章节文件
            const loadPromises = listData.files.map(async (fileName) => {
                try {
                    console.log(`[QuestionBank] 正在加载: ${fileName}`);
                    const res = await fetch(`./${fileName}`);
                    if (!res.ok) {
                        throw new Error(`加载失败: ${res.status}`);
                    }
                    const data = await res.json();
                    this._validate(data);
                    return data.chapters;
                } catch (e) {
                    console.error(`[QuestionBank] 加载 ${fileName} 失败:`, e);
                    throw e;
                }
            });

            // 3. 合并所有章节
            const chaptersArrays = await Promise.all(loadPromises);
            this.chapters = chaptersArrays.flat();

            if (this.chapters.length === 0) {
                throw new Error('未加载到任何有效章节数据');
            }

            // 4. 按章节ID排序
            this.chapters.sort((a, b) => a.id - b.id);
            this.isLoaded = true;

            console.log('[QuestionBank] 题库初始化完成，加载章节数:', this.chapters.length);
            return true;
        } catch (e) {
            console.error('[QuestionBank] 初始化失败:', e);
            this.isLoaded = false;
            throw e;
        }
    }

    _validate(data) {
        if (!data?.chapters?.length) {
            throw new Error('章节数据无效: 缺少chapters字段');
        }

        data.chapters.forEach((ch, idx) => {
            const requiredFields = ['id', 'name', 'questions'];
            requiredFields.forEach(field => {
                if (!(field in ch)) {
                    throw new Error(`章节${idx}缺少必要字段: ${field}`);
                }
            });

            if (!Array.isArray(ch.questions) || ch.questions.length === 0) {
                throw new Error(`章节${ch.id}-${ch.name}没有有效题目`);
            }
        });
    }

    getQuestions(chapterId, shuffle = false) {
        if (!this.isLoaded) {
            throw new Error('题库未初始化完成');
        }

        let questions = [];
        if (chapterId === 'all') {
            questions = this.chapters.flatMap(ch => [...ch.questions]);
        } else {
            const chapter = this.chapters.find(ch => ch.id == chapterId);
            if (!chapter) {
                throw new Error(`未找到章节ID: ${chapterId}`);
            }
            questions = [...chapter.questions];
        }

        this.currentQuestions = shuffle ? this._shuffleArray(questions) : questions;
        console.log(`[QuestionBank] 获取章节${chapterId}问题，数量: ${this.currentQuestions.length}`);
        return this.currentQuestions;
    }

    getQuestionByIndex(index) {
        if (index < 0 || index >= this.currentQuestions.length) {
            console.error(`无效的问题索引: ${index} (共${this.currentQuestions.length}题)`);
            return null;
        }
        return this.currentQuestions[index];
    }

    _shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 创建并导出单例实例
const questionBank = new QuestionBank();
export default questionBank;
