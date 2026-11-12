/* ==========================================================================
   iFactiS — 多言語切替（JA / EN）
   ・日本語は HTML に書かれた文言が原本。英語はこのファイルの辞書で置き換える
   ・[data-i18n="key"]            … 要素の中身（HTML 可）を置き換え
   ・[data-i18n-attr="attr:key"]  … 属性（aria-label / alt など）を置き換え。複数は ; 区切り
   ・言語は ?lang=en / localStorage に保存。切替時に 'langchange' イベントを発火
   ・ID / VI を追加するときは DICT と META に言語を足し、SUPPORTED に加える
   ========================================================================== */
(() => {
  const STORAGE_KEY = 'ifactis-lang';
  const SUPPORTED = ['ja', 'en'];

  const META = {
    ja: {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
    },
    en: {
      title: 'iFactiS | Turning veterans’ know-how into systems anyone can use',
      description: 'iFactiS is a solution for manufacturers, built, tested and refined by the Ichii Group, an automotive parts maker, in its own factories. It turns veterans’ procedures, judgment criteria and troubleshooting know-how into a form new hires and overseas workers can follow without hesitation.',
    },
  };

  /* JS から使う UI 文言（HTML に原本がないもの） */
  const UI = {
    ja: { menuOpen: 'メニューを開く', menuClose: 'メニューを閉じる', filterStatus: '「{stage}」で使える製品：{n}件' },
    en: { menuOpen: 'Open menu', menuClose: 'Close menu', filterStatus: '{n} products for {stage}' },
  };

  const DICT = {
    en: {
      /* ---------- a11y / attributes ---------- */
      'a11y.home': 'iFactiS home',
      'a11y.gnav': 'Main navigation',
      'a11y.lang': 'Select language',
      'a11y.card': 'Example of an iFactiS work instruction screen',
      'a11y.cloud': 'Examples of tacit knowledge',
      'a11y.skills': 'Ichii Group shop-floor expertise',
      'a11y.process': 'Manufacturing processes',
      'a11y.stages': 'Supported processes',
      'a11y.info': 'Events and news',
      'a11y.sns': 'Official social media',
      'a11y.x': 'X (formerly Twitter)',
      'a11y.sitemap': 'Site map',
      'a11y.contact': 'Contact',
      'a11y.links': 'Related sites',
      'a11y.langSwitch': 'Language',
      'alt.hero': 'A worker at a welding station',
      'alt.origin': 'A worker operating machinery in a mass-production plant',
      'alt.case': 'A worker operating a touch panel in a factory',

      /* ---------- Header ---------- */
      'nav.about': 'About iFactiS',
      'nav.products': 'Products',
      'nav.cases': 'Case Studies',
      'nav.news': 'News',
      'nav.events': 'Events',
      'nav.partners': 'Partners',
      'cta.contact': 'Contact',
      'cta.consult': 'Talk to us about improvement',
      'cta.talk': 'Talk to us',
      'lang.soon': 'Coming soon',

      /* ---------- Hero ---------- */
      'hero.badge': 'Built by a manufacturer, for manufacturers',
      'hero.title': '<span class="line">Veterans’ <span class="mark">know-how</span>,</span><span class="line">turned into a system</span><span class="line accent">anyone can follow.</span>',
      'hero.lead': 'iFactiS is a solution for manufacturers, <strong>built, tested and refined by the Ichii Group, an automotive parts maker, in its own factories.</strong> It turns the procedures, judgment criteria and troubleshooting steps in veterans’ heads into a form new hires and overseas workers can follow without hesitation.',
      'hero.products': 'See products & services',
      'hero.lead2': 'A solution for manufacturers, built, tested and refined by the <strong>Ichii Group</strong>, an automotive parts maker, in its own factories.',
      'a11y.swap': 'What iFactiS changes',
      'swap.1a': 'Gut feeling',
      'swap.1b': 'Clear criteria',
      'swap.2a': 'Knacks',
      'swap.2b': 'Standard steps',
      'swap.3a': '“Go ask the veteran”',
      'swap.3b': 'It’s on the screen',
      'swap.4a': 'Verbal instructions',
      'swap.4b': 'Guides in their own language',
      'fv.inhouse': 'In-house',
      'fv.inhouseNote': 'Proven on our own production lines',
      'hero.proof1': 'Running in factories in Japan, Indonesia and Vietnam',
      'hero.proof2': 'Shop-floor screens in 4 languages',
      'hero.proof3': 'Proven on our own production lines',
      'tacit.name': 'Tanaka',
      'tacit.role': 'Welder, 28 yrs · Quality Dept.',
      'tacit.quote': '“Look at the bead’s sheen and width, and you can pretty much tell.”',
      'tacit.tag': 'Until now: only in Tanaka’s head',
      'ph.caption': 'Sample photo',
      'card.okSample': 'OK sample',

      /* ---------- Next event ---------- */
      'ticket.time': 'THU 14:00–15:00 JST',
      'ticket.title': 'Seminar: Production Management That Starts on the Floor',
      'ticket.meta': 'Online · Free · For plant managers and production control staff',
      'ticket.cta': 'Details & registration',
      'badge.open': 'Open',

      /* ---------- Voices ---------- */
      'voices.title': 'Do you hear these words<br>in your factory, too?',
      'voices.lead': 'iFactiS grew out of the words people actually say on the factory floor.',
      'voice.1': 'When that one person is off, <span class="mark">a process grinds to a halt</span>.',
      'voice.1.who': 'Plant manager',
      'voice.2': 'I teach the same thing <span class="mark">again and again</span>, to one person after another.',
      'voice.2.who': 'Floor supervisor',
      'voice.3': 'Our information is <span class="mark">scattered</span> across paper, Excel and word of mouth.',
      'voice.3.who': 'Production control',
      'voice.4': 'When a defect occurs, it always ends up as <span class="mark">“human error.”</span>',
      'voice.4.who': 'Quality assurance',
      'voice.5': 'I want to keep our veterans’ skills in the company <span class="mark">before they retire</span>.',
      'voice.5.who': 'Executive',
      'voice.6': 'We brought in a system, and all it did was <span class="mark">add data entry</span>.',
      'voice.6.who': 'Line leader',
      'voice.1.tag': 'Person-dependent',
      'voice.2.tag': 'Training load',
      'voice.3.tag': 'Scattered info',
      'voice.4.tag': 'Blaming people',
      'voice.5.tag': 'Skills transfer',
      'voice.6.tag': 'Admin overload',
      'voices.common': 'What all six voices have in common:',
      'voices.answer': 'The problem isn’t people.<br>It’s the <span class="mark">system</span>.',
      'voices.answerSub': 'iFactiS builds shop floors where no one has to be blamed.',

      /* ---------- Approach ---------- */
      'about.title': 'From a veteran’s “feel”<br>to everyone’s “standard.”',
      'about.lead': 'iFactiS never dismisses veterans’ experience or intuition. We carefully ask, “What do you look at, and what is your standard?” and shape the answers into procedures, judgment criteria and abnormality responses anyone can use.',
      'flow.before': 'Knowledge locked in people',
      'flow.chip1': 'Gut feel',
      'flow.chip2': 'Tricks',
      'flow.chip3': 'Years of experience',
      'flow.chip4': 'Unwritten rules',
      'flow.chip5': 'Verbal instructions',
      'flow.chip6': '“Just ask Tanaka”',
      'flow.x1': 'You only know if you ask',
      'flow.x2': 'Everyone does it differently',
      'flow.x3': 'The line stops when someone is off',
      'flow.core': 'Turning shop-floor wisdom into systems',
      'flow.c1': 'Work procedures',
      'flow.c1s': 'Step by step, with photos and video',
      'flow.c2': 'Judgment criteria',
      'flow.c2s': 'OK/NG samples, so everyone sees the same way',
      'flow.c3': 'Abnormality response',
      'flow.c3s': 'Stop, call, wait, without hesitation',
      'flow.c4': 'Records & training',
      'flow.c4s': 'History is kept; teaching becomes consistent',
      'flow.after': 'Same quality, whoever does it',
      'flow.p1': 'New hires',
      'flow.p2': 'Young staff',
      'flow.p3': 'Overseas<br>workers',
      'flow.ok1': 'No hesitation',
      'flow.ok2': 'No need to ask',
      'flow.ok3': 'Same quality every time',

      'kw.1.suffix': 'GENBA',
      'kw.1.title': 'Starting from real problems<br>on the floor, not at a desk.',
      'kw.1.text': 'Processes, forms, Excel sheets, verbal checks: we walk the floor and see for ourselves. We never start from “What can AI do?”',
      'kw.1.qlabel': 'What we ask at the first meeting',
      'kw.1.q': '“Which job relies on people the most right now?”',
      'kw.2.suffix': 'SHOKUNIN',
      'kw.2.title': 'Turning veterans’ wisdom<br>into company assets.',
      'kw.2.text': 'We never call a veteran’s intuition “old-fashioned.” We put their judgment into words and photos and pass it on to young, new and overseas workers.',
      'kw.2.qlabel': 'What we ask veterans',
      'kw.2.q': '“When you make that call, what do you look at, and what is your standard?”',
      'kw.3.suffix': 'KANTAN',
      'kw.3.title': 'Anyone can follow it,<br>from day one.',
      'kw.3.text': 'We don’t boast about features. Big buttons, photo samples, native-language screens. No extra data entry or checks: it fits naturally into the way you already work.',
      'kw.3.qlabel': 'What we always check before rollout',
      'kw.3.q': '“Has data entry or checking on the floor gone up?”',

      /* ---------- Origin ---------- */
      'origin.title': 'We’re not an IT company.<br>We make things, <span class="u">every day</span>.',
      'origin.p1': 'iFactiS was created by the <strong>Ichii Group</strong>, a mass producer of automotive parts. From press and sheet-metal work, welding, and die and jig making through to mass-production launches, ours is a shop floor that faces quality and delivery demands every single day.',
      'origin.p2': 'Labor shortages, skills transfer, training overseas workers: these were all our own problems. That’s why we <strong>struggle with, test and refine iFactiS in our own factories</strong> before it reaches you.',
      'skill.1': 'Automotive parts mass production',
      'skill.2': 'Press & sheet metal',
      'skill.3': 'Welding',
      'skill.4': 'Dies & jigs',
      'skill.5': 'Prototype to mass production',
      'skill.6': 'TPS & kaizen',
      'cycle.1.title': 'Struggle',
      'cycle.1.sub': '困る',
      'cycle.1.text': 'Labor shortages, skills transfer, uneven training. The problems in our own factories are where development begins.',
      'cycle.2.title': 'Try',
      'cycle.2.sub': '試す',
      'cycle.2.text': 'Whatever we build, we first use on our own production lines. The floor’s reaction is the most honest review there is.',
      'cycle.3.title': 'Refine',
      'cycle.3.sub': '磨く',
      'cycle.3.text': 'Small complaints from the floor become the next improvement, until it’s tough enough for mass production.',
      'cycle.return': 'And back to the floor',
      'cycle.caption': 'Struggle on the floor, try on the floor, refine on the floor. That’s how iFactiS is made.',
      'facts.countries': 'Countries in operation',
      'facts.countriesUnit': 'countries',
      'facts.countriesNote': 'and more',
      'facts.langs': 'Languages on shop-floor screens',
      'facts.langsUnit': 'languages',
      'facts.langsNote': 'JA · EN · ID · VI',
      'facts.sites': 'Main proving grounds',
      'country.jp': 'Japan',
      'country.id': 'Indonesia',
      'country.vn': 'Vietnam',

      /* ---------- Products ---------- */
      'products.title': 'The right tool<br>for each process.',
      'products.lead': 'You don’t have to change everything at once. Start small with the process that troubles you most. Product details are available on each product site.',
      'stage.plan': 'Planning',
      'stage.source': 'Sourcing',
      'stage.make': 'Manufacturing',
      'stage.quality': 'Quality',
      'stage.maintain': 'Maintenance',
      'stage.deliver': 'Shipping',
      'stage.all': 'All processes',
      'p1.cat': 'Production management & visibility',
      'p1.title': 'Production data scattered across paper and Excel,<br class="br-pc"> all in one place.',
      'p1.text': 'Plans, results and progress on a single screen. The floor simply records as usual, and managers can see at a glance what’s happening where.',
      'p2.cat': 'Quality & inspection',
      'p2.title': 'Let everyone inspect<br class="br-pc"> with a veteran’s eye.',
      'p2.text': 'OK/NG sample photos and judgment criteria, shown right at the inspection station. Even less experienced workers can judge by the same standards as veterans.',
      'p3.cat': 'Maintenance (in trials at our own plants)',
      'p3.title': 'Helping anyone notice when equipment<br class="br-pc"> “isn’t quite right.”',
      'p3.text': 'Turning veteran maintenance staff’s inspection know-how into daily check procedures and standards. Now being trialed at Ichii Group factories.',
      'p3.note': 'Release timing will be announced.',
      'p4.cat': 'Not sure which product fits?',
      'p4.name': 'Individual consultation',
      'p4.title': 'Problems that span processes? Bring them as they are.',
      'p4.text': 'Even problems you haven’t sorted out yet are welcome. We’ll listen to your situation and work out with you where to start.',
      'link.productSite': 'Visit product site',
      'products.hint': 'Select a process to see the products for it.',
      'products.hint2': 'Click a process to narrow down the products for it.',
      'products.lead2': 'See at a glance which service helps at each stage of manufacturing. You don’t have to change everything at once — start small with the process that troubles you most.',
      'mascot.guide2': 'I’ll show you the right service<br>for each process!',
      'stage.logistics': 'Logistics & Shipping',
      'a11y.pm': 'Solutions by process',
      'pm.lgMain': 'Main use',
      'pm.lgRel': 'Related process',
      'pm.all': 'Covers all processes',
      'pm.consult.sub': 'Not sure which product fits?',
      'pm.consult.text': 'We’ll listen to your situation and work out with you how to tackle problems that span processes. Unsorted problems are welcome too.',
      'pm.nexus.plan': 'Orders & planning',
      'pm.nexus.source': 'Materials',
      'pm.nexus.make': 'Progress & results',
      'pm.nexus.deliver': 'Delivery & costing',
      'pm.worktag.plan': 'Production plan',
      'pm.worktag.make': 'Work tags',
      'pm.talentline.plan': 'Staffing needs',
      'pm.talentline.make': 'Staff assignment',
      'pm.stockcore.source': 'Weighing & storage',
      'pm.stockcore.make': 'Usage & yield',
      'pm.vision.make': 'Work monitoring',
      'pm.vision.quality': 'Missed-inspection alerts',
      'pm.knowledge.quality': 'Standards & reports',
      'pm.knowledge.maintain': 'First response to faults',
      'pm.movex.make': 'Empty-container supply',
      'pm.movex.deliver': 'Finished-goods transport',
      'pm.labelpro.deliver': 'Delivery labels',
      'pm.smartpackage.make': 'Link to production data',
      'pm.smartpackage.deliver': 'Shipping & return records',
      'products.reset': 'Show all',
      'a11y.productsNav': 'Product sites',
      'pr.nexus.cat': 'Production management',
      'pr.nexus.catch': 'Orders, materials, progress — scattered information, connected in one flow.',
      'pr.worktag.cat': 'Production planning & work orders',
      'pr.worktag.catch': 'What do we make first today? From the plan to work tags, without confusion.',
      'pr.talentline.cat': 'Staff assignment',
      'pr.talentline.catch': '“Who goes where today?” — no longer a burden for one person.',
      'pr.stockcore.cat': 'Materials & inventory',
      'pr.stockcore.catch': 'Check “it should be there” against the actual weight.',
      'pr.vision.cat': 'Camera-based monitoring',
      'pr.vision.catch': 'Don’t let “nobody saw it” be the end of the story. Catch anomalies on the floor.',
      'pr.knowledge.cat': 'Knowledge search',
      'pr.knowledge.catch': 'What “only that person knows,” anyone on the floor can find.',
      'pr.movex.cat': 'Automated transport',
      'pr.movex.catch': 'Hand the endless “carry this over” jobs to robots.',
      'pr.labelpro.cat': 'Delivery label printing',
      'pr.labelpro.catch': 'Less cutting and sorting of delivery labels in shipping prep.',
      'pr.smartpackage.cat': 'Pallet & returnable box tracking',
      'pr.smartpackage.catch': '“Did that box come back?” — confirmed by records.',
      'kn.q': 'Line 3 stopped. What should I check first?',
      'kn.a': 'Past maintenance records show the hydraulic unit pressure is checked first.',
      'kn.src': 'Source: maintenance report',
      'products.note': '*Product names and descriptions are placeholder text for design purposes.',

      /* ---------- Cases ---------- */
      'cases.title': 'In use on real shop floors.',
      'cases.lead': 'It starts with our own factories. On production floors in Japan and overseas, iFactiS supports everyday work.',
      'badge.quality': 'Quality & inspection',
      'badge.jpvn': 'Japan · Vietnam',
      'badge.id': 'Indonesia',
      'badge.jp': 'Japan',
      'badge.vn': 'Vietnam',
      'badge.consult': 'Consultation',
      'case.company': 'Ichii Group | Automotive parts (press & welding)',
      'case.title': 'A veteran inspector’s “eye,” turned into a standard.<br class="br-pc"> Now overseas workers inspect to the same criteria.',
      'case.before': 'Judgments varied from person to person, and final calls depended on a few veterans. Training was left to OJT.',
      'case.after': 'Sample photos and criteria are shown in each worker’s language. Judgments are consistent whoever inspects, and trainers carry less of the load.',
      'case.quote': '“‘You have to ask that person’ is something we hear far less on the floor now.”',
      'case.cite': 'Section Manager, Quality Assurance (interview content is placeholder)',
      'link.readCase': 'Read the case',
      'caseA.company': 'Metalworking manufacturer A',
      'caseA.title': 'Paper daily reports replaced: production results now visible, with no extra data entry.',
      'caseB.company': 'Plastic molding manufacturer B',
      'caseB.title': 'Inspection criteria shared with photos, closing judgment gaps between sites.',
      'caseC.company': 'Electronic components manufacturer C',
      'caseC.title': 'Work procedures in Vietnamese, so new hires work independently sooner.',
      'cases.note': '*Cases other than the Ichii Group are design samples.',
      'link.allCases': 'See all case studies',

      /* ---------- Events & News ---------- */
      'events.kicker': 'UPCOMING',
      'events.title': 'Events',
      'news.kicker': 'LATEST',
      'news.title': 'News',
      'link.viewAll': 'View all',
      'badge.seminar': 'Seminar',
      'badge.expo': 'Trade show',
      'badge.tour': 'Factory tour',
      'ev1.title': 'Production Management That Starts on the Floor: a first step toward turning veteran-dependent processes into systems',
      'ev1.time': '14:00–15:00 JST',
      'ev1.place': 'Online · Free',
      'ev2.title': 'Exhibiting at a manufacturing trade show (name TBD), with live demos of “Vision”',
      'ev2.place': 'Venue to be announced',
      'ev3.title': 'Ichii Group factory tour: see iFactiS in use on a real production line',
      'ev3.time': '10:00–12:00 JST',
      'ev3.place': 'Ichii Group factory (planned)',
      'badge.notice': 'Notice',
      'badge.event': 'Event',
      'badge.press': 'Press',
      'badge.media': 'Media',
      'news.1': 'The iFactiS service site is now live',
      'news.2': 'Registration is open for our online seminar on Dec 10 (Thu), “Production Management That Starts on the Floor”',
      'news.3': 'Ichii Group begins full operation of “Vision” at its Vietnam factory',
      'news.4': 'An industry newspaper ran an interview on the story behind iFactiS',
      'news.5': 'Shop-floor screens now support Indonesian and Vietnamese',
      'news.note': '*Content shown is sample text for design purposes.',

      /* ---------- Track record ---------- */
      'record.title': 'A track record built<br>alongside the shop floor.',
      'record.lead': 'It began with trials in our own factories. Today iFactiS is used on production floors across different industries and countries.',
      'record.s1': 'Companies using iFactiS',
      'record.s1u': '+ companies',
      'record.s2': 'Retention rate',
      'record.s2u': '% or higher',
      'record.s3': 'Industries',
      'ind.auto': 'Automotive parts',
      'ind.elec': 'Electronic components',
      'ind.metal': 'Metalworking',
      'ind.resin': 'Plastic molding',
      'ind.food': 'Food',
      'ind.chem': 'Chemicals',
      'ind.logi': 'Logistics',
      'record.logos': 'Selected clients',
      'record.logosNote': '*Placeholder logos',
      'record.note': '*Figures, industries and logos are placeholders for design purposes. Replace them with confirmed, approved content.',

      /* ---------- Mascot（吹き出し） ---------- */
      'mascot.think': 'Sound<br>familiar…?',
      'mascot.guide': 'I’ll guide you, process by process!',
      'mascot.thumbs': 'Proven on the shop floor!',
      'mascot.present': 'Either way,<br>we’d love to hear from you!',

      /* ---------- Contact ---------- */
      'contact.title': 'First, tell us about<br>your shop floor.',
      'contact.lead': 'Even if you’re still at the “we don’t know where to start” stage, that’s fine. We don’t start with a sales pitch; we start by listening.',
      'c1.title': 'Improvement consultation',
      'c1.text': 'Labor shortages, dependence on individuals, training, inconsistent quality. Bring us your challenges as they are, even ones that cut across processes or departments.',
      'c1.p1': 'We listen to your situation and propose a way forward',
      'c1.p2': 'Start small with a single process or department',
      'c1.p3': 'Overseas factories (Indonesia, Vietnam and more) are welcome',
      'c1.btn': 'Go to consultation form',
      'c2.title': 'Partner program',
      'c2.text': 'We’re looking for partners, including resellers, system integrators and consulting firms, to bring iFactiS to shop floors with us.',
      'c2.p1': 'Sales and implementation support in Japan and ASEAN',
      'c2.p2': 'Joint proposals to manufacturing customers',
      'c2.p3': 'Supporting customers until the system takes root',
      'c2.btn': 'About the partner program',

      /* ---------- Footer ---------- */
      'footer.tagline': 'Turning veterans’ know-how into systems anyone can use.',
      'footer.operator': 'Operated by the Ichii Group<br>(company name and address to be added)',
      'f.home': 'Home',
      'f.about': 'About iFactiS',
      'f.cases': 'Case Studies',
      'f.news': 'News',
      'f.events': 'Events',
      'f.consult': 'Improvement consultation',
      'f.partner': 'Partner program',
      'f.nexus': 'Nexus product site',
      'f.vision': 'Vision product site',
      'f.company': 'Company profile',
      'f.recruit': 'Careers',
      'f.ichii': 'Ichii Group',
      'f.privacy': 'Privacy Policy',
      'f.sitepolicy': 'Site Policy',
      'f.cookie': 'Cookie Policy',
    },
  };

  const root = document.documentElement;
  const originals = new Map();     // 要素 → 日本語の innerHTML
  const originalAttrs = new Map(); // 要素 → { 属性: 日本語の値 }
  let current = 'ja';

  const store = (lang) => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode 等 */ }
    try {
      const url = new URL(location.href);
      if (lang === 'ja') url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
      history.replaceState(history.state, '', url);
    } catch (e) { /* file:// など */ }
  };

  const updateSwitchers = (lang) => {
    document.querySelectorAll('[data-set-lang]').forEach((a) => {
      a.setAttribute('aria-current', String(a.dataset.setLang === lang));
    });
    document.querySelectorAll('.lang-label').forEach((el) => { el.textContent = lang.toUpperCase(); });
  };

  function apply(lang, { save = true } = {}) {
    if (!SUPPORTED.includes(lang)) lang = 'ja';
    const dict = DICT[lang] || {};

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      const key = el.dataset.i18n;
      if (lang === 'ja') { el.innerHTML = originals.get(el); return; }
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.innerHTML = dict[key];
      } else {
        el.innerHTML = originals.get(el);
        console.warn(`[i18n] "${lang}" に未翻訳のキー: ${key}`);
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const saved = originalAttrs.get(el) || {};
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (!attr || !key) return;
        if (!(attr in saved)) saved[attr] = el.getAttribute(attr) || '';
        el.setAttribute(attr, lang === 'ja' ? saved[attr] : (dict[key] ?? saved[attr]));
      });
      originalAttrs.set(el, saved);
    });

    current = lang;
    root.lang = lang;
    document.title = META[lang].title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = META[lang].description;
    updateSwitchers(lang);
    if (save) store(lang);
    root.classList.remove('i18n-loading');
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  /* 切替ボタン（ヘッダーのメニュー・フッターの JA/EN） */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-set-lang]');
    if (!a) return;
    e.preventDefault();
    if (a.dataset.setLang !== current) apply(a.dataset.setLang);
  });

  /* 初期表示：?lang= → 前回の選択 → 日本語 */
  let initial = 'ja';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem(STORAGE_KEY);
    initial = SUPPORTED.includes(q) ? q : (SUPPORTED.includes(saved) ? saved : 'ja');
  } catch (e) { /* noop */ }
  if (initial !== 'ja') {
    apply(initial, { save: false });
  } else {
    root.lang = 'ja';
    updateSwitchers('ja');
    root.classList.remove('i18n-loading');
  }

  window.IFX_I18N = {
    apply,
    get lang() { return current; },
    t: (key) => (UI[current] && UI[current][key]) || UI.ja[key] || key,
  };
})();
