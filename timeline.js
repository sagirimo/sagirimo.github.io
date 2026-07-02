// ═══════════════════════════════════════════════════════
//  Research Worldline — gitgraph.js build script
//  Loads GitgraphJS UMD bundle, expects a container element with id="gitgraph".
//  All text fields carry en / zh / hk translations via data-* attributes,
//  so the site-wide language toggle in script.js swaps them automatically.
// ═══════════════════════════════════════════════════════

(function() {
  if (!window.GitgraphJS) { console.error('GitgraphJS not loaded'); return; }
  var container = document.getElementById('gitgraph');
  if (!container) return;

  var GG = window.GitgraphJS;
  var SVGNS = 'http://www.w3.org/2000/svg';

  // ─── Multi-language text helper ───
  //  Use `t(en, zh, hk)` to create a translatable text node.
  //  Passing just `en` uses the same string for all three languages.
  function t(en, zh, hk) {
    return { en: en, zh: (zh != null ? zh : en), hk: (hk != null ? hk : (zh != null ? zh : en)) };
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }
  function trAttr(field) {
    if (field == null) return '';
    if (typeof field === 'string') return field;   // plain string, no translation
    return 'data-en="'+esc(field.en)+'" data-zh="'+esc(field.zh)+'" data-hk="'+esc(field.hk)+'"';
  }
  function trText(field) {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    return field.en;   // initial render uses English; script.js swaps on lang change
  }

  // ─── Build a card element from a data spec ───
  function cardHTML(d) {
    var badges = (d.badges || []).map(function(b){
      return '<span class="badge '+b.type+'" '+trAttr(b.text)+'>'+trText(b.text)+'</span>';
    }).join('');
    var tags = (d.tags || []).map(function(tg){
      return '<span '+trAttr(tg)+'>'+trText(tg)+'</span>';
    }).join('');
    var badgesHTML = badges ? '<div class="badges">'+badges+'</div>' : '';
    var tagsHTML   = tags   ? '<div class="tags">'+tags+'</div>' : '';
    var extra = d.extra ? '<div '+trAttr(d.extra)+'>'+trText(d.extra)+'</div>' : '';

    if (d.track === 'divergence') {
      return '<div class="diverge-title" '+trAttr(d.title)+'>'+trText(d.title)+'</div>' +
             '<div class="diverge-sub" '+trAttr(d.body)+'>'+trText(d.body)+'</div>';
    }
    return badgesHTML +
           '<h3 '+trAttr(d.title)+'>'+trText(d.title)+'</h3>' +
           '<div class="meta" '+trAttr(d.meta)+'>'+trText(d.meta)+'</div>' +
           '<p '+trAttr(d.body)+'>'+trText(d.body)+'</p>' +
           extra +
           tagsHTML;
  }

  // ─── renderDot returning dot + card + optional year label ───
  function renderDotCard(data, opts) {
    opts = opts || {};
    return function(commit) {
      // gitgraph translates branch line paths by (dot.size, dot.size). We match with
      // a wrapping translate so our dot lands ON the line.
      var offset = (commit.style && commit.style.dot && commit.style.dot.size) || 6;
      var g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('transform', 'translate(' + offset + ', ' + offset + ')');
      var color = (commit.style && commit.style.dot && commit.style.dot.color) || '#64ffda';

      if (opts.big) {
        var ring = document.createElementNS(SVGNS, 'circle');
        ring.setAttribute('cx', 0); ring.setAttribute('cy', 0);
        ring.setAttribute('r', 16);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', color);
        ring.setAttribute('stroke-width', 1);
        ring.setAttribute('opacity', 0.45);
        g.appendChild(ring);
      }

      var dot = document.createElementNS(SVGNS, 'circle');
      dot.setAttribute('cx', 0); dot.setAttribute('cy', 0);
      dot.setAttribute('r', opts.big ? 8 : 6);
      dot.setAttribute('fill', color);
      dot.setAttribute('stroke', '#0a192f');
      dot.setAttribute('stroke-width', 3);
      g.appendChild(dot);

      // Year axis marker on the LEFT of the timeline
      if (data.yearMark) {
        var labelX = -commit.x - offset - 24;
        var yearText = document.createElementNS(SVGNS, 'text');
        yearText.textContent = data.yearMark;
        yearText.setAttribute('x', labelX);
        yearText.setAttribute('y', 5);
        yearText.setAttribute('fill', '#64ffda');
        yearText.setAttribute('font-family', '"SF Mono","Fira Code",monospace');
        yearText.setAttribute('font-size', '17');
        yearText.setAttribute('font-weight', '700');
        yearText.setAttribute('letter-spacing', '3');
        yearText.setAttribute('text-anchor', 'end');
        yearText.setAttribute('opacity', '0.95');
        g.appendChild(yearText);

        var yTick = document.createElementNS(SVGNS, 'line');
        yTick.setAttribute('x1', labelX + 10);
        yTick.setAttribute('y1', 0);
        yTick.setAttribute('x2', -12);
        yTick.setAttribute('y2', 0);
        yTick.setAttribute('stroke', '#64ffda');
        yTick.setAttribute('stroke-width', 1);
        yTick.setAttribute('opacity', 0.3);
        yTick.setAttribute('stroke-dasharray', '4 4');
        g.appendChild(yTick);
      }

      var stub = document.createElementNS(SVGNS, 'line');
      stub.setAttribute('x1', 6); stub.setAttribute('y1', 0);
      stub.setAttribute('x2', 20); stub.setAttribute('y2', 0);
      stub.setAttribute('stroke', color);
      stub.setAttribute('stroke-width', 1.4);
      stub.setAttribute('opacity', 0.65);
      g.appendChild(stub);

      var fo = document.createElementNS(SVGNS, 'foreignObject');
      fo.setAttribute('x', 22);
      fo.setAttribute('y', -12);
      fo.setAttribute('overflow', 'visible');

      var div = document.createElement('div');
      div.className = 'gg-card';
      if (data.track) div.setAttribute('data-track', data.track);
      div.innerHTML = cardHTML(data);

      //  Inline mobile styles directly on the div so CSS-in-SVG loading order
      //  on iOS Safari can't break the card dimensions.  The external stylesheet
      //  will still apply (or override) once loaded, but these guarantee a baseline.
      if (isMobileViewport) {
        div.style.cssText = [
          'width:280px', 'max-width:280px', 'box-sizing:border-box',
          'padding:0.55rem 0.7rem', 'font-size:0.68rem', 'line-height:1.45',
          'background:linear-gradient(180deg,rgba(17,34,64,.94),rgba(10,25,47,.96))',
          'border:1px solid rgba(100,255,218,.14)', 'border-radius:6px',
          'color:#a8b2d1', 'font-family:Inter,sans-serif', 'position:relative'
        ].join(';');
        fo.setAttribute('width', 310);
        fo.setAttribute('height', 600);   // generous; real height measured by forceMobileRelayout
      } else {
        fo.setAttribute('width', 400);
        fo.setAttribute('height', 300);
      }

      fo.appendChild(div);
      g.appendChild(fo);

      return g;
    };
  }

  //  Real iOS Safari has a timing bug where foreignObject.getBoundingClientRect() can
  //  return 0 during gitgraph's internal auto-spacing pass — Playwright WebKit doesn't
  //  reproduce it, but iPhones do. Two layers of defence below:
  //    (1) mobile branch spacing is tighter so narrow viewport doesn't require huge scroll
  //    (2) forceRelayoutIfStacked() runs post-render as a safety net if commits stacked
  var isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

  // ─── Template ───
  var sgTemplate = GG.templateExtend(GG.TemplateName.Metro, {
    //  col 0 main / α = teal      col 1 psychiatry = green-teal
    //  col 2 plastic  = amber     col 3 cardio     = coral
    //  col 4 reasoning= pale blue col 5 β main     = purple
    //  col 6 graphiti = deep purple  col 7 embodied = light purple
    colors: ['#64ffda', '#7ee3b8', '#ffd085', '#ff9db0', '#a0d8ff', '#e5b4ff', '#d9a3f0', '#f0c9ff'],
    branch: {
      lineWidth: 2.5,
      spacing: isMobileViewport ? 60 : 70,
      mergeStyle: GG.MergeStyle.Bezier,
      label: { display: false }
    },
    commit: {
      spacing: 24,       // gitgraph adds measured card height on top of this
      hasTooltipInCompactMode: false,
      dot: { size: 6, strokeColor: '#0a192f', strokeWidth: 3 },
      message: { display: false }
    }
  });

  var gitgraph = GG.createGitgraph(container, {
    template: sgTemplate,
    orientation: GG.Orientation.VerticalReverse,   // 2023 bottom → 2026 top; fan out UP
    responsive: false
  });

  function C(branch, data, big) {
    branch.commit({
      subject: (typeof data.title === 'string' ? data.title : data.title.en),
      renderDot: renderDotCard(data, { big: !!big })
    });
  }

  // ═══ Build the timeline ═══

  var main = gitgraph.branch('main');

  C(main, {
    yearMark: '2023',
    title: t('Basic Biochemistry Research', '生物化学入门 · 文献综述', '生物化學入門 · 文獻綜述'),
    meta:  t('2023 · Independent · Unpublished', '2023 · 独立探索 · 未发表', '2023 · 獨立探索 · 未發表'),
    body:  t(
      'Wrote two literature reviews. Self-taught PubMed / MeSH, Endnote / Zotero, AMA / Vancouver citation. Reviews unpublished but <span class="hl">established the literature-retrieval habits underlying every later project</span>.',
      '撰写了两篇生物化学文献综述。自学掌握 PubMed / MeSH 检索、Endnote / Zotero 管理、AMA / Vancouver 引用规范。综述均未发表，但<span class="hl">建立了后续所有研究所需的文献检索与管理习惯</span>。',
      '撰寫了兩篇生物化學文獻綜述。自學掌握 PubMed / MeSH 檢索、Endnote / Zotero 管理、AMA / Vancouver 引用規範。綜述均未發表，但<span class="hl">建立了後續所有研究所需的文獻檢索與管理習慣</span>。'
    ),
    badges: [
      { type:'co-author', text: t('FOUNDATION', '基础', '基礎') },
      { type:'in-prep',   text: t('UNPUBLISHED', '未发表', '未發表') }
    ],
    tags: ['PubMed','MeSH','Endnote','Zotero','Citation'],
    track: 'foundation'
  });

  var psychiatry = gitgraph.branch({ name: 'psychiatry', from: main });
  C(psychiatry, {
    yearMark: '2024',
    title: t(
      'Psychiatry & Clinical Research @ PKU 6th',
      '精神科临床研究 @ 北大六院',
      '精神科臨床研究 @ 北大六院'
    ),
    meta: t(
      '2024.07 – 2024.10 · Prof. Qian Ying',
      '2024.07 – 2024.10 · 钱英教授',
      '2024.07 – 2024.10 · 錢英教授'
    ),
    body: t(
      'Adolescent psychiatry shadowing. Weekly journal clubs on MFGT & school refusal. <span class="hl">Learned RCT design, SPSS, meta-analysis, evidence-quality assessment.</span>',
      '青少年精神科门诊跟诊。每周组会文献研读，汇报 MFGT 与青少年拒学干预研究进展。<span class="hl">系统学习了 RCT 方案设计、SPSS 统计、meta 分析流程与证据质量评价</span>。',
      '青少年精神科門診跟診。每週組會文獻研讀，匯報 MFGT 與青少年拒學干預研究進展。<span class="hl">系統學習了 RCT 方案設計、SPSS 統計、meta 分析流程與證據質量評價</span>。'
    ),
    badges: [
      { type:'track-a',   text: t('TRACK α', '主线 α', '主線 α') },
      { type:'co-author', text: t('CO-AUTHOR', '共同作者', '共同作者') }
    ],
    tags: ['SPSS','RCT','Meta-Analysis','MFGT'],
    track: 'alpha'
  });
  C(psychiatry, {
    title: t(
      'BMC Psychology Publication',
      'BMC Psychology 发表',
      'BMC Psychology 發表'
    ),
    meta: t(
      'MFGT for School Refusal — RCT Study Protocol · 2026',
      '青少年抑郁症拒学的 MFGT — RCT 方案 · 2026',
      '青少年抑鬱症拒學的 MFGT — RCT 方案 · 2026'
    ),
    body: t(
      'First complete research cycle: <span class="hl">design → ethics → data → publication</span>. Established the workflow reused in every later project.',
      '第一次完整的研究闭环：<span class="hl">方案设计 → 伦理审查 → 数据采集 → 论文发表</span>。这套流程之后被复用到每一个项目。',
      '第一次完整的研究閉環：<span class="hl">方案設計 → 倫理審查 → 數據採集 → 論文發表</span>。這套流程之後被複用到每一個項目。'
    ),
    badges: [
      { type:'published', text: t('PUBLISHED 2026', '2026 已发表', '2026 已發表') },
      { type:'co-author', text: t('CO-AUTHOR', '共同作者', '共同作者') }
    ],
    tags: ['BMC Psychology','RCT','Study Protocol'],
    track: 'alpha'
  });

  var plastic = gitgraph.branch({ name: 'plastic', from: main });
  C(plastic, {
    title: t(
      'Plastic Surgery AI Lab @ PKU 3rd',
      '整形外科 AI 实验室 @ 北医三院',
      '整形外科 AI 實驗室 @ 北醫三院'
    ),
    meta: t(
      '2024.09 – 2026.05 · Prof. An Yang · First formal research group',
      '2024.09 – 2026.05 · 安阳教授 · 第一个正式研究组',
      '2024.09 – 2026.05 · 安陽教授 · 第一個正式研究組'
    ),
    body: t(
      'Journal clubs, textbook editing, video narration, peer review — <span class="hl">systematic reading + writing skills</span>. Segmented ~1/3 of nasal septum CT data (3D Slicer / Mimics). First DICOM / STL / ML exposure.',
      '文献汇报、教材编辑、手术视频旁白、辅助审稿——<span class="hl">系统的阅读、写作、评审能力</span>。独立完成约 1/3 的鼻中隔 CT 数据分割标注（3D Slicer / Mimics）。首次接触 DICOM / STL 与机器学习基础。',
      '文獻匯報、教材編輯、手術視頻旁白、輔助審稿——<span class="hl">系統的閱讀、寫作、評審能力</span>。獨立完成約 1/3 的鼻中隔 CT 數據分割標註（3D Slicer / Mimics）。首次接觸 DICOM / STL 與機器學習基礎。'
    ),
    badges: [
      { type:'track-a',   text: t('TRACK α', '主线 α', '主線 α') },
      { type:'published', text: t('JPRAS · 2025', 'JPRAS · 2025', 'JPRAS · 2025') },
      { type:'co-author', text: t('CO-AUTHOR', '共同作者', '共同作者') }
    ],
    tags: ['3D Slicer','Mimics','CT','Segmentation','JPRAS','Diffusion Models'],
    track: 'alpha'
  });

  C(main, {
    yearMark: '2025',
    title: t(
      'Aerospace Center — Direction Finding',
      '航天中心医院 · 方向确认',
      '航天中心醫院 · 方向確認'
    ),
    meta: t(
      '2025.04 – 2025.09 · Entry point',
      '2025.04 – 2025.09 · 主线入口',
      '2025.04 – 2025.09 · 主線入口'
    ),
    body: t(
      'Explored multiple directions, met mentors. <span class="hl">Discovered orthopedic robotics</span> — Changmugu™ UKA — and identified <span class="hl">surgical robotics + AI</span> as the core direction.',
      '临床见习阶段，接触多个方向，遇见多位导师。<span class="hl">在骨科首次接触长木谷 UKA 机器人</span>，确定了<span class="hl">骨科手术机器人 + AI</span>作为后续核心方向。',
      '臨床見習階段，接觸多個方向，遇見多位導師。<span class="hl">在骨科首次接觸長木谷 UKA 機器人</span>，確定了<span class="hl">骨科手術機器人 + AI</span>作為後續核心方向。'
    ),
    badges: [
      { type:'first-author', text: t('◆ MAIN WORLDLINE ENTRY POINT', '◆ 主世界线入口', '◆ 主世界線入口') }
    ],
    tags: ['Clinical Practice','Orthopedics','Surgical Robotics','Direction Finding'],
    track: 'milestone'
  }, true);

  var cardio = gitgraph.branch({ name: 'cardio', from: main });
  C(cardio, {
    title: t(
      'Cardiology Meta-Analysis',
      '心内科 Meta 分析',
      '心內科 Meta 分析'
    ),
    meta: t(
      '2025 · Manuscript in preparation',
      '2025 · 论文撰写中',
      '2025 · 論文撰寫中'
    ),
    body: t(
      '<em>Atrial septal pacing vs. right atrial appendage pacing for AF reduction.</em> PRISMA systematic review — heterogeneity, forest plots, publication-bias assessment.',
      '<em>房间隔起搏 vs. 右心耳起搏对房颤发生率的比较。</em>基于 PRISMA 的系统综述——异质性检验、森林图、发表偏倚评估。',
      '<em>房間隔起搏 vs. 右心耳起搏對房顫發生率的比較。</em>基於 PRISMA 的系統綜述——異質性檢驗、森林圖、發表偏倚評估。'
    ),
    badges: [
      { type:'track-a',   text: t('TRACK α', '主线 α', '主線 α') },
      { type:'in-prep',   text: t('IN PREP', '撰写中', '撰寫中') },
      { type:'co-author', text: t('CO-AUTHOR', '共同作者', '共同作者') }
    ],
    tags: ['PRISMA','Meta-Analysis','Forest Plot'],
    track: 'alpha'
  });

  var reasoning = gitgraph.branch({ name: 'reasoning', from: main });
  C(reasoning, {
    title: t(
      'Clinical Reasoning & Diagnostic Thinking',
      '临床推理与诊断思维',
      '臨床推理與診斷思維'
    ),
    meta: t(
      '2025 · Innovation Comprehensive Experiment · 97/100',
      '2025 · 创新综合实验 · 97/100',
      '2025 · 創新綜合實驗 · 97/100'
    ),
    body: t(
      'Differential diagnosis framework: complaint → list → likelihood → Bayesian updating. <span class="hl">Formal diagnostic logic directly applicable to AI clinical decision systems.</span>',
      '鉴别诊断框架：主诉 → 鉴别列表 → 可能性排序 → 贝叶斯更新。<span class="hl">这套形式化诊断逻辑对 AI 临床决策系统设计有直接参考价值。</span>',
      '鑑別診斷框架：主訴 → 鑑別列表 → 可能性排序 → 貝葉斯更新。<span class="hl">這套形式化診斷邏輯對 AI 臨床決策系統設計有直接參考價值。</span>'
    ),
    badges: [
      { type:'track-a',   text: t('TRACK α', '主线 α', '主線 α') },
      { type:'published', text: t('GRADE 97/100', '成绩 97/100', '成績 97/100') }
    ],
    tags: ['Differential Diagnosis','Bayesian Reasoning','Clinical AI'],
    track: 'alpha'
  });

  C(main, {
    yearMark: '2026',
    title: t(
      '◆ WORLDLINE DIVERGENCE — 2026 ◆',
      '◆ 世界线分叉 · 2026 ◆',
      '◆ 世界線分叉 · 2026 ◆'
    ),
    body: t(
      'Main line continues as <span class="a">Track α</span> (Clinical, w/ Prof. Chen Jing) · <span class="b">Track β</span> (CS / AI) diverges — parallel, non-convergent.',
      '主线延续为 <span class="a">Track α</span>（临床研究，跟随陈晶老师）· <span class="b">Track β</span>（计算 / AI）分叉——平行、不再收敛。',
      '主線延續為 <span class="a">Track α</span>（臨床研究，跟隨陳晶老師）· <span class="b">Track β</span>（計算 / AI）分叉——平行、不再收斂。'
    ),
    track: 'divergence'
  }, true);

  var beta = gitgraph.branch({ name: 'track-beta', from: main });

  C(main, {
    title: t(
      'Robotic-Assisted UKA Accuracy Study',
      '机器人辅助 UKA 手术精度研究',
      '機器人輔助 UKA 手術精度研究'
    ),
    meta: t(
      '2025.04 – Present · Orthopedic Robotics & AI Lab · Chen Jing',
      '2025.04 – 至今 · 骨科机器人与 AI 研究组 · 陈晶',
      '2025.04 – 至今 · 骨科機器人與 AI 研究組 · 陳晶'
    ),
    body: t(
      '20 Changmugu™ robotic UKA procedures with CT pre-planning & intra-op execution. 40-case learning-curve analysis (CUSUM). <span class="hl">Submitted to Frontiers in Bioengineering & Biotechnology</span>.',
      '完成 20 例长木谷机器人 UKA 手术的 CT 术前规划与术中执行。基于 CUSUM 方法的 40 例学习曲线分析。<span class="hl">已投稿 Frontiers in Bioengineering & Biotechnology</span>（生物力学专栏）。',
      '完成 20 例長木谷機器人 UKA 手術的 CT 術前規劃與術中執行。基於 CUSUM 方法的 40 例學習曲線分析。<span class="hl">已投稿 Frontiers in Bioengineering & Biotechnology</span>（生物力學專欄）。'
    ),
    badges: [
      { type:'track-a',      text: t('TRACK α', '主线 α', '主線 α') },
      { type:'submitted',    text: t('SUBMITTED', '已投稿', '已投稿') },
      { type:'first-author', text: t('FIRST AUTHOR', '第一作者', '第一作者') }
    ],
    tags: ['Robotic Surgery','UKA','CT Planning','CUSUM'],
    track: 'alpha'
  });

  C(beta, {
    title: t(
      'Breast Tumor Localization',
      '乳腺肿瘤定位：俯卧位 → 仰卧位预测',
      '乳腺腫瘤定位：俯臥位 → 仰臥位預測'
    ),
    meta: t(
      '2026.03 – Present · Independent · target JBHI 2026',
      '2026.03 – 至今 · 独立研究 · 目标 JBHI 2026',
      '2026.03 – 至今 · 獨立研究 · 目標 JBHI 2026'
    ),
    body: t(
      'Prone MRI → Supine prediction. <span class="hl">314 paired cases</span> (Shenzhen No.2 Hospital). Pipeline: point cloud → ICP → CPD → <span class="hl">PointNet++</span> → 3D coordinate prediction.',
      '俯卧位 MRI → 仰卧位定位预测。<span class="hl">314 对配对病例</span>（深圳市第二人民医院）。技术路线：表面点云 → ICP 刚性配准 → CPD 非刚性变形 → <span class="hl">PointNet++</span> → 三维坐标预测。',
      '俯臥位 MRI → 仰臥位定位預測。<span class="hl">314 對配對病例</span>（深圳市第二人民醫院）。技術路線：表面點雲 → ICP 剛性配準 → CPD 非剛性變形 → <span class="hl">PointNet++</span> → 三維坐標預測。'
    ),
    badges: [
      { type:'track-b',      text: t('TRACK β', '分支 β', '分支 β') },
      { type:'ongoing',      text: t('ONGOING', '进行中', '進行中') },
      { type:'first-author', text: t('FIRST AUTHOR', '第一作者', '第一作者') }
    ],
    tags: ['PointNet++','ICP/CPD','3D Point Cloud','n=314','PyTorch','JBHI'],
    track: 'beta'
  });

  C(main, {
    title: t(
      'Robotic ACL Reconstruction — Multi-Center RCT',
      '机器人辅助 ACL 重建 — 多中心 RCT',
      '機器人輔助 ACL 重建 — 多中心 RCT'
    ),
    meta: t(
      '2025.10 – Present · w/ Jishuitan Hospital · NSFC 2026',
      '2025.10 – 至今 · 合作方：积水潭医院 · 2026 国自然申报',
      '2025.10 – 至今 · 合作方：積水潭醫院 · 2026 國自然申報'
    ),
    body: t(
      'Co-designed <span class="hl">n=120 RCT</span> protocol. TiRobot validation roadmap: sawbone → cadaver → clinical. Participating in 2026 NSFC grant application.',
      '合作设计 <span class="hl">n=120 RCT</span> 方案，制定 TiRobot 精度验证路线：假骨 → 尸体 → 临床。参与 2026 年国家自然科学基金申报。',
      '合作設計 <span class="hl">n=120 RCT</span> 方案，制定 TiRobot 精度驗證路線：假骨 → 屍體 → 臨床。參與 2026 年國家自然科學基金申報。'
    ),
    badges: [
      { type:'track-a',   text: t('TRACK α', '主线 α', '主線 α') },
      { type:'ongoing',   text: t('ONGOING', '进行中', '進行中') },
      { type:'co-author', text: t('CO-INVESTIGATOR', '合作研究员', '合作研究員') }
    ],
    tags: ['RCT n=120','TiRobot','ACL','NSFC Grant'],
    track: 'alpha'
  });

  C(main, {
    title: t(
      '3D-Printed Surgical Guide System',
      '3D 打印手术导板系统',
      '3D 打印手術導板系統'
    ),
    meta: t(
      '2026.01 – Present · BIT Multi-Modal Lab (Prof. Ma Kang)',
      '2026.01 – 至今 · 北理工多模态实验室（马康教授）',
      '2026.01 – 至今 · 北理工多模態實驗室（馬康教授）'
    ),
    body: t(
      'CV-driven personalized 3D-printed guides for UKA / ACL. Market research, competitor analysis (Shikang / Changmugu / Anying), <span class="hl">physician needs interviews</span>. Entered "Challenge Cup 2026".',
      'CV 驱动的个性化 3D 打印手术导板，面向 UKA / ACL 手术。完成市场调研、竞品分析（施康 / 长木谷 / 安颖），<span class="hl">医生需求访谈</span>。参加 2026 年"青创北京"挑战杯。',
      'CV 驅動的個性化 3D 打印手術導板，面向 UKA / ACL 手術。完成市場調研、競品分析（施康 / 長木谷 / 安穎），<span class="hl">醫生需求訪談</span>。參加 2026 年「青創北京」挑戰杯。'
    ),
    badges: [
      { type:'track-a',      text: t('TRACK α', '主线 α', '主線 α') },
      { type:'ongoing',      text: t('ONGOING', '进行中', '進行中') },
      { type:'first-author', text: t('CLINICAL & PRODUCT LEAD', '临床与产品负责人', '臨床與產品負責人') }
    ],
    tags: ['3D Printing','CV','Surgical Guide','MedTech','Challenge Cup'],
    track: 'alpha'
  });

  // ─── β sub-branches ───
  var graphiti = gitgraph.branch({ name: 'graphiti', from: beta });
  C(graphiti, {
    title: t(
      'Graphiti — Memory Graph for LLM Reasoning',
      'Graphiti — 大模型记忆图谱推理',
      'Graphiti — 大模型記憶圖譜推理'
    ),
    meta: t(
      '2026.05 – Present · Independent · target ICLR 2027',
      '2026.05 – 至今 · 独立研究 · 目标 ICLR 2027',
      '2026.05 – 至今 · 獨立研究 · 目標 ICLR 2027'
    ),
    body: t(
      'Dynamic knowledge graphs for LLM episodic memory. <span class="hl">Graphiti</span> pipeline: entity extraction → KG construction → graph embedding → multi-hop RAG.',
      '为大语言模型构建动态知识图谱作为情景记忆。基于 <span class="hl">Graphiti</span> 框架：实体抽取 → 图谱构建 → 图嵌入 → 多跳 RAG。',
      '為大語言模型構建動態知識圖譜作為情景記憶。基於 <span class="hl">Graphiti</span> 框架：實體抽取 → 圖譜構建 → 圖嵌入 → 多跳 RAG。'
    ),
    badges: [
      { type:'track-b',      text: t('β · SUB', 'β · 子分支', 'β · 子分支') },
      { type:'ongoing',      text: t('ONGOING', '进行中', '進行中') },
      { type:'first-author', text: t('INDEPENDENT', '独立', '獨立') }
    ],
    tags: ['GraphRAG','Knowledge Graph','LLM','Graphiti','ICLR 2027'],
    track: 'beta'
  });

  var embodied = gitgraph.branch({ name: 'embodied', from: beta });
  C(embodied, {
    title: t(
      'Embodied AI — Motion Recognition',
      '具身智能 — 运动识别与评估',
      '具身智能 — 運動識別與評估'
    ),
    meta: t(
      '2026.05 – Present · BIT Multi-Modal Lab (Prof. Ma Kang)',
      '2026.05 – 至今 · 北理工多模态实验室（马康教授）',
      '2026.05 – 至今 · 北理工多模態實驗室（馬康教授）'
    ),
    body: t(
      'Multi-modal sensor fusion (<span class="hl">IMU + vision + pressure</span>) for surgical skill assessment and rehabilitation monitoring. Currently in literature review + sensor setup.',
      '多模态传感器融合（<span class="hl">IMU + 视觉 + 压力</span>）用于手术技能评估与康复监测。目前处于文献调研与传感器方案搭建阶段。',
      '多模態傳感器融合（<span class="hl">IMU + 視覺 + 壓力</span>）用於手術技能評估與康復監測。目前處於文獻調研與傳感器方案搭建階段。'
    ),
    badges: [
      { type:'track-b',   text: t('β · SUB', 'β · 子分支', 'β · 子分支') },
      { type:'ongoing',   text: t('ONGOING', '进行中', '進行中') },
      { type:'co-author', text: t('COLLABORATOR', '合作研究员', '合作研究員') }
    ],
    tags: ['Embodied AI','IMU','Sensor Fusion','Surgical Skill'],
    track: 'beta'
  });

  // ═══ Post-render: resize foreignObjects, expand SVG viewBox, sync language ═══
  function resizeCards() {
    var svg = container.querySelector('svg');
    if (!svg) return;
    var fos = svg.querySelectorAll('foreignObject');
    fos.forEach(function(fo) {
      var inner = fo.firstElementChild;
      if (inner && inner.offsetHeight) {
        fo.setAttribute('height', inner.offsetHeight + 6);
      }
    });
    try {
      var bbox = svg.getBBox();
      var padL = 30, padR = 30, padT = 20, padB = 20;
      var vbX = bbox.x - padL;
      var vbY = bbox.y - padT;
      var vbW = bbox.width + padL + padR;
      var vbH = bbox.height + padT + padB;
      svg.setAttribute('viewBox', vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH);
      svg.setAttribute('width', vbW);
      svg.setAttribute('height', vbH);
      //  On mobile the container's overflow-y is hidden (to allow overflow-x scroll).
      //  Force the container's height to match the SVG's natural height so nothing is
      //  clipped vertically — page scroll handles vertical progression.
      if (window.matchMedia('(max-width: 768px)').matches) {
        container.style.height = vbH + 'px';
      } else {
        container.style.height = '';
      }
    } catch(e) {}
  }

  // ═══ Mobile relayout: always runs on mobile viewports.
  //  iOS Safari measures foreignObject children unreliably during gitgraph's internal
  //  auto-spacing pass (getBoundingClientRect can return clipped or zero heights).
  //  We bypass gitgraph's layout entirely on mobile: measure card heights via
  //  scrollHeight (viewport-independent), then reposition every commit group and
  //  redraw branch lines as simple verticals.
  function forceMobileRelayout() {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    var svg = container.querySelector('svg');
    if (!svg) return;

    //  Commit group DOM structure from gitgraph:
    //  <g transform="translate(bx, by)">   ← outerG (what we reposition)
    //    <g transform="translate(6, 6)">   ← innerG (our renderDot content)
    //      <circle/>  <line/>  <foreignObject><div.gg-card/></foreignObject>
    //    </g>
    //  </g>
    var fos = svg.querySelectorAll('g > g > foreignObject');
    if (!fos.length) return;

    var groups = [];
    fos.forEach(function(fo) {
      var innerG = fo.parentElement;
      var outerG = innerG && innerG.parentElement;
      if (!outerG) return;
      var tr = outerG.getAttribute('transform') || '';
      var m = /translate\(\s*([-\d.]+)[\s,]+([-\d.]+)/.exec(tr);
      if (!m) return;
      var inner = fo.firstElementChild;
      //  scrollHeight is immune to viewport clipping, overflow:hidden, and off-screen
      //  positioning — the only reliable height on iOS Safari.
      var h = (inner && inner.scrollHeight > 10) ? inner.scrollHeight
            : (inner && inner.offsetHeight > 10)  ? inner.offsetHeight
            : 260;   // hard fallback for completely-unrendered cards
      groups.push({ outer: outerG, fo: fo, bx: parseFloat(m[1]), h: h });
    });
    if (groups.length < 2) return;

    //  Assign y positions top-to-bottom in DOM (creation) order, using measured heights
    var gap = 18;
    var y = 40;
    groups.forEach(function(g) {
      g.newY = y;
      y += g.h + gap;
      g.outer.setAttribute('transform', 'translate(' + g.bx + ', ' + g.newY + ')');
    });

    //  Remove gitgraph's paths and any previously-inserted relayout lines, then draw
    //  one vertical connector per branch column.
    svg.querySelectorAll('path').forEach(function(p) { p.remove(); });
    svg.querySelectorAll('line.wl-branch').forEach(function(l) { l.remove(); });

    var byColumn = {};
    groups.forEach(function(g) {
      var key = String(Math.round(g.bx));
      if (!byColumn[key]) byColumn[key] = [];
      byColumn[key].push(g);
    });
    Object.keys(byColumn).forEach(function(key) {
      var col = byColumn[key];
      col.sort(function(a, b) { return a.newY - b.newY; });
      if (col.length < 2) return;
      var first = col[0], last = col[col.length - 1];
      var cx = first.bx + 6;   // center x of the branch dot
      var line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('x1', cx);  line.setAttribute('y1', first.newY + 6);
      line.setAttribute('x2', cx);  line.setAttribute('y2', last.newY + 6);
      line.setAttribute('class', 'wl-branch');
      var dot = first.fo.parentElement.querySelector('circle');
      var color = (dot && dot.getAttribute('fill')) || '#64ffda';
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('opacity', '0.65');
      svg.insertBefore(line, svg.firstChild);
    });

    //  Recompute viewBox to encompass the new layout
    try {
      var bbox = svg.getBBox();
      var padL = 30, padR = 30, padT = 20, padB = 20;
      var vbX = bbox.x - padL, vbY = bbox.y - padT;
      var vbW = bbox.width + padL + padR, vbH = bbox.height + padT + padB;
      svg.setAttribute('viewBox', vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH);
      svg.setAttribute('width', vbW);
      svg.setAttribute('height', vbH);
      container.style.height = vbH + 'px';
    } catch(e) {}
  }

  //  After the graph mounts, apply the current language from the site's toggle.
  //  script.js has already run and set root.lang; re-run its swap for our newly-
  //  injected data-en/data-zh/data-hk nodes inside foreignObjects.
  function syncLangFromRoot() {
    var lang = document.documentElement.lang === 'zh-CN' ? 'zh'
             : document.documentElement.lang === 'zh-HK' ? 'hk'
             : 'en';
    if (lang === 'en') return;
    container.querySelectorAll('[data-en]').forEach(function(el) {
      var text = el.getAttribute('data-' + lang);
      if (text != null) el.innerHTML = text;
    });
  }

  function fullPass() { resizeCards(); syncLangFromRoot(); forceMobileRelayout(); }
  setTimeout(fullPass, 50);
  setTimeout(fullPass, 300);
  setTimeout(fullPass, 900);
  setTimeout(fullPass, 1800);   // extra safety pass for slow iOS layout
  window.addEventListener('resize', fullPass);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fullPass);

  //  Re-run resize after the site language toggle — Chinese text often differs
  //  in length from English, so card heights (and SVG bbox) shift.
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      setTimeout(fullPass, 350);
      setTimeout(fullPass, 700);
    });
  }
})();
