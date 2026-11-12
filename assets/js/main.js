/* iFactiS — Top page interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const i18n = window.IFX_I18N || { lang: 'ja', t: (k) => ({ menuOpen: 'メニューを開く', menuClose: 'メニューを閉じる' }[k] || k) };

  /* ---------- Header state / SP fixed CTA ---------- */
  const header = $('.site-header');
  const spCta = $('.sp-cta');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (spCta) {
      const show = y > 640 && !document.body.classList.contains('nav-open');
      spCta.classList.toggle('is-show', show);
      spCta.setAttribute('aria-hidden', String(!show));
      spCta.querySelector('a').tabIndex = show ? 0 : -1;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const toggle = $('.menu-toggle');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', i18n.t(open ? 'menuClose' : 'menuOpen'));
    $('use', toggle).setAttribute('href', open ? '#i-x' : '#i-menu');
    onScroll();
  };
  toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('.gnav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => e.matches && setNav(false));
  toggle.setAttribute('aria-label', i18n.t('menuOpen'));
  document.addEventListener('langchange', () => {
    toggle.setAttribute('aria-label', i18n.t(document.body.classList.contains('nav-open') ? 'menuClose' : 'menuOpen'));
  });

  /* ---------- Language dropdown ---------- */
  const lang = $('.lang');
  const langBtn = $('.lang-btn', lang);
  const setLangMenu = (open) => {
    lang.classList.toggle('is-open', open);
    langBtn.setAttribute('aria-expanded', String(open));
  };
  langBtn.addEventListener('click', (e) => { e.stopPropagation(); setLangMenu(!lang.classList.contains('is-open')); });
  document.addEventListener('click', (e) => { if (!lang.contains(e.target)) setLangMenu(false); });
  $$('.lang-menu [data-set-lang]').forEach((a) => a.addEventListener('click', () => { setLangMenu(false); langBtn.focus(); }));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setLangMenu(false);
    if (document.body.classList.contains('nav-open')) setNav(false);
  });

  /* ---------- 工程別ソリューション（工程 × 製品のマトリクス） ----------
     ・製品の行にホバー／フォーカス → その製品が使われる工程を見出しで点灯
     ・見出しの工程を押す → その工程で使える製品にしぼり込み（もう一度押すか「すべて表示」で解除） */
  const pm = $('.pm');
  if (pm) {
    const heads = $$('thead th[data-stage]', pm);
    const rows = $$('tbody tr[data-stages]', pm);
    const cols = $$('[data-col]', pm);
    const pfilter = $('.pfilter');
    let filterStage = null;
    const stagesOf = (tr) => tr.dataset.stages.split(/\s+/);
    const light = (stages) => {
      pm.classList.toggle('is-hover', stages.length > 0); // 流れる箱を一時停止
      heads.forEach((th) => th.classList.toggle('is-on', stages.includes(th.dataset.stage)));
    };
    const restore = () => light(filterStage ? [filterStage] : []);
    rows.forEach((tr) => {
      const stages = stagesOf(tr);
      tr.addEventListener('mouseenter', () => light(stages));
      tr.addEventListener('mouseleave', restore);
      tr.addEventListener('focusin', () => light(stages));
      tr.addEventListener('focusout', restore);
    });
    const setFilter = (stage) => {
      filterStage = stage;
      let count = 0;
      rows.forEach((tr) => {
        const hit = !stage || stagesOf(tr).includes(stage);
        tr.classList.toggle('is-dim', !hit);
        if (stage && hit && !tr.classList.contains('pm-consult')) count++;
      });
      cols.forEach((el) => el.classList.toggle('is-col', el.dataset.col === stage));
      heads.forEach((th) => $('.pm-col', th).setAttribute('aria-pressed', String(th.dataset.stage === stage)));
      if (pfilter) {
        pfilter.classList.toggle('is-active', !!stage);
        if (stage) {
          const label = $(`th[data-stage="${stage}"] .pm-jp`, pm).textContent;
          $('.pf-text', pfilter).textContent = i18n.t('filterStatus').replace('{stage}', label).replace('{n}', count);
        }
      }
      restore();
    };
    heads.forEach((th) => $('.pm-col', th).addEventListener('click', () => {
      setFilter(filterStage === th.dataset.stage ? null : th.dataset.stage);
    }));
    if (pfilter) $('.pf-reset', pfilter).addEventListener('click', () => setFilter(null));
    document.addEventListener('langchange', () => { if (filterStage) setFilter(filterStage); });
  }

  /* 旧デザイン（index-v1.html）の工程ライン ↔ 製品カード */
  const processLine = $('.process');
  if (processLine) {
    const steps = $$('li', processLine);
    const highlight = (stages) => {
      processLine.classList.toggle('is-hover', stages.length > 0);
      steps.forEach((li) => li.classList.toggle('is-on', stages.includes(li.dataset.stage)));
    };
    $$('.product[data-stages]').forEach((card) => {
      const stages = card.dataset.stages.split(/\s+/);
      card.addEventListener('mouseenter', () => highlight(stages));
      card.addEventListener('mouseleave', () => highlight([]));
      card.addEventListener('focusin', () => highlight(stages));
      card.addEventListener('focusout', () => highlight([]));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        // 同じ親の中で順番に少しずつ表示
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Process animations：画面に入ったら再生 ---------- */
  // 子要素に順番（--i）を振って、CSS 側で時間差をつける
  $$('[data-stagger]').forEach((list) => [...list.children].forEach((el, i) => el.style.setProperty('--i', i)));
  const anims = $$('[data-anim]');
  if ('IntersectionObserver' in window && motionOK) {
    const ioAnim = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-play');
        ioAnim.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    anims.forEach((el) => ioAnim.observe(el));
  } else {
    anims.forEach((el) => el.classList.add('is-play'));
  }

  /* ---------- First view：「勘 → 判断基準」などを1組ずつ切り替え ---------- */
  const swap = $('.fv-swap');
  if (swap && motionOK) {
    const pairs = $$('li', swap);
    let cur = -1;
    const next = () => {
      if (cur >= 0) pairs[cur].classList.remove('is-active');
      cur = (cur + 1) % pairs.length;
      pairs[cur].classList.add('is-active');
    };
    swap.classList.add('is-anim');
    setTimeout(() => {
      next();
      setInterval(() => { if (!document.hidden) next(); }, 3600);
    }, 1100); // タイトルの登場を待つ
  }

  /* ---------- 導入企業ロゴ：リストを複製して継ぎ目なく流す ---------- */
  const hideClone = (el) => {
    el.setAttribute('aria-hidden', 'true');
    $$('img', el).forEach((img) => { img.alt = ''; });
    return el;
  };
  $$('.logo-marquee').forEach((mq) => {
    const track = $('.logo-track', mq);
    if (!track || !motionOK || !track.children.length) return;
    // 先に流す状態（1列・折り返しなし）にしてから幅を測る
    mq.classList.add('is-run');
    // ロゴが少なくて1列が枠より短いと隙間が出るので、枠の幅を超えるまで並べ足す
    const originals = [...track.children];
    const minW = Math.max(mq.clientWidth, 1600);
    for (let n = 0; track.offsetWidth < minW && n < 10; n++) {
      originals.forEach((li) => track.appendChild(hideClone(li.cloneNode(true))));
    }
    mq.appendChild(hideClone(track.cloneNode(true)));
    // 横幅に合わせて速度を一定に（約 22px/秒：ゆっくり・なめらかに）
    const setSpeed = () => mq.style.setProperty('--mq-dur', `${Math.max(40, track.offsetWidth / 22)}s`);
    setSpeed();
    window.addEventListener('resize', setSpeed, { passive: true });
  });

  /* ---------- 実績の数値：画面に入ったらカウントアップ（data-count に数値があるときだけ） ---------- */
  const counters = $$('[data-count]').filter((el) => parseFloat(el.dataset.count) > 0);
  if (counters.length && motionOK && 'IntersectionObserver' in window) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1400);
        el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const ioCount = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        run(en.target);
        ioCount.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => ioCount.observe(el));
  }

  /* ---------- Hero：作業手順カード ----------
     サイトの言語（JA / EN）とベトナム語を交互に表示し、チェック → OK → 基準化 のデモを繰り返す */
  const card = $('.step-card');
  if (card) {
    const items = $$('.sc-checks li', card);
    const ok = $('.sc-ok', card);
    const stamp = $('.stamp', card);
    const pills = $$('.sc-lang [data-lang]', card);
    const el = {
      tag: $('.sc-tag', card),
      title: $('.sc-title', card),
      sub: $('.sc-sub', card),
      ng: $('.sc-ng', card),
      src: $('.sc-src .t', card),
      checks: items.map((li) => $('.t', li)),
    };
    const dict = {
      ja: {
        tag: '検査工程', title: '溶接ビードの外観チェック',
        checks: ['ビード幅 6〜8mm', 'つや（光沢）が均一', 'ピット・割れがない'],
        ng: 'NG・処置を見る', src: '判断基準：田中さん（溶接歴28年）の「見るポイント」を基準化',
      },
      en: {
        tag: 'Inspection', title: 'Weld bead visual check',
        checks: ['Bead width 6–8 mm', 'Even sheen (gloss)', 'No pits or cracks'],
        ng: 'NG · What to do', src: 'Standard: based on what Tanaka (28 yrs welding) looks for',
      },
      vi: {
        tag: 'Kiểm tra', title: 'Kiểm tra ngoại quan mối hàn',
        checks: ['Độ rộng mối hàn 6–8mm', 'Độ bóng đồng đều', 'Không rỗ khí, không nứt'],
        ng: 'NG・Cách xử lý', src: 'Tiêu chí: điểm quan sát của anh Tanaka (28 năm kinh nghiệm hàn)',
      },
    };
    let primary = dict[i18n.lang] ? i18n.lang : 'ja'; // サイトの言語
    let shown = primary;                              // カードに表示中の言語（primary ⇄ vi）

    const setCardLang = (lang) => {
      const d = dict[lang];
      const other = lang === 'vi' ? primary : 'vi';
      ['tag', 'title', 'ng', 'src'].forEach((k) => { el[k].textContent = d[k]; el[k].lang = lang; });
      el.sub.textContent = dict[other].title;
      el.sub.lang = other;
      el.checks.forEach((t, i) => { t.textContent = d.checks[i]; t.lang = lang; });
      pills[0].textContent = primary.toUpperCase();
      pills[0].dataset.lang = primary;
      pills.forEach((p) => p.classList.toggle('on', p.dataset.lang === lang));
      shown = lang;
    };
    if (primary !== 'ja') setCardLang(primary);
    document.addEventListener('langchange', (e) => {
      primary = dict[e.detail.lang] ? e.detail.lang : 'ja';
      setCardLang(primary);
    });

    if (motionOK) {
      card.classList.add('is-anim');
      // 画面外・タブ非表示のときは止める
      let visible = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(card);
      }
      const ready = async () => { while (!visible || document.hidden) await sleep(400); };
      const press = () => {
        ok.classList.remove('press');
        requestAnimationFrame(() => requestAnimationFrame(() => ok.classList.add('press')));
      };

      (async () => {
        let first = true;
        await sleep(1800); // カードの登場を待つ
        for (;;) {
          await ready();
          for (const li of items) { li.classList.add('done'); await sleep(560); }
          await sleep(200);
          press();
          if (first) { await sleep(380); stamp.classList.add('on'); first = false; }
          await sleep(2600);
          await ready();
          card.classList.add('is-swapping');
          await sleep(270);
          setCardLang(shown === 'vi' ? primary : 'vi');
          items.forEach((li) => li.classList.remove('done'));
          card.classList.remove('is-swapping');
          await sleep(650);
        }
      })();
    }
  }

  /* ---------- 計測：ボタン・リンクのクリック（GA4 / GTM 用 dataLayer） ---------- */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    window.dataLayer.push({
      event: 'cta_click',
      cta_id: el.dataset.track,
      link_url: el.getAttribute('href') || '',
      link_text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 80),
    });
  });
})();
