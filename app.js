// 两张原创线稿分别对应组合机制和情感叙事，仅用作封面占位。
const coverDrawings = {
  cats: `<svg viewBox="0 0 400 400"><ellipse class="sketch-orbit" cx="200" cy="235" rx="156" ry="53" transform="rotate(-26 200 235)"/><path d="M132 178 126 93 181 130Q208 116 235 130L281 89 271 178Q294 219 265 249Q242 275 196 263Q150 271 126 244Q102 215 132 178Z"/><path d="M155 197q12-17 24 0m42-1q12-17 24 0m-55 20 12 8 11-10m-11 10v15m-63-22-43-6m41 18-38 9m157-19 39-12m-38 28 42 7"/><path d="M158 265q-26 43 1 64m74-65q32 48-3 63m30-65q70 18 59-30q-7-18-24-5"/><circle cx="200" cy="224" r="5"/></svg>`,
  bitha: `<svg viewBox="0 0 500 320"><path class="flower-cloud" d="M253 84C215 16 165 47 180 98C113 64 88 124 146 150C66 170 109 230 169 205C131 276 205 291 229 232C252 304 321 275 298 220C371 260 400 198 343 174C420 154 375 88 322 115C347 43 275 27 253 84Z"/><path d="M233 181q15 18 31-2m-43-29 1 1m58-1 1 1"/><path class="sketch-orbit" d="m48 65 74 30-30-68 70 41-8-61 65 42 40-38 26 48 66-20-20 57 101 6-55 46 56 54-84-2 26 62-73-25-10 59-60-46-52 36-2-65-89 8 38-51-74-14 60-34Z"/></svg>`,
};
// 项目资料来自 content.js；有完整演示的作品直接进入演示页，其他作品保留原生详情展开。
const projects = document.querySelector('#projects');
projects.innerHTML = portfolio.projects.map(project => `
  <article class="project ${project.theme}">
    <!-- 有完整演示的封面使用原生链接，支持鼠标、触屏和键盘进入。 -->
    <${project.caseStudy ? 'a' : 'div'} class="project-visual"${project.caseStudy ? ` href="${project.caseStudy}" aria-label="查看${project.title}完整项目演示"` : ''}>
      ${project.image ? `<img src="${project.image}" alt="${project.imageAlt}" loading="lazy">` : `
        <div class="diagram" aria-hidden="true"><span class="diagram-index">PLAY STUDY / ${project.number}</span><span class="cover-word">${project.theme === 'cats' ? 'What<br>if?' : 'FEEL<br>SOMETHING.'}</span><div class="cover-drawing">${coverDrawings[project.theme]}</div><span class="cover-sticker">${project.theme === 'cats' ? '✳' : '✦'}</span><span class="diagram-text">${project.diagram}</span></div>
        <p class="placeholder-label">素材占位 / ${project.placeholder}</p>`}
      <span class="visual-number">${project.number}</span><span class="cover-tape" aria-hidden="true"></span>
    </${project.caseStudy ? 'a' : 'div'}>
    <!-- 补充插画独立于封面链接，放在项目标题右侧。 -->
    <div class="project-content">${project.sideArt ? `<figure class="project-side-art"><button class="art-enlarge" type="button" aria-label="放大查看插画"><img src="${project.sideArt}" alt="${project.sideArtAlt}" loading="lazy"></button></figure>` : ''}<div class="project-meta"><span>${project.type}</span><span>${project.period}</span></div>${project.titleKicker ? `<p class="project-title-kicker">${project.titleKicker}</p>` : ''}<h3>${project.title}</h3><p class="project-subtitle">${project.chinese}</p><p class="project-summary">${project.summary}</p><p class="role">${project.role}</p>${project.caseStudy ? '' : `<div class="project-actions"><details><summary>项目详情 <span>＋</span></summary><div class="detail-body"><p class="project-mode">${project.mode}</p>${project.details.map(([title, text]) => `<h4>${title}</h4><p>${text}</p>`).join('')}</div></details>${project.link ? `<a class="play-link" href="${project.link}" target="_blank" rel="noopener noreferrer" aria-label="试玩 ${project.title}（新窗口打开）">前往试玩 ↗</a>` : ''}</div>`}${project.caseStudy ? `<a class="case-link" href="${project.caseStudy}">${project.caseLabel || '查看完整项目演示'} <span>↗</span></a>` : ''}</div>
  </article>
`).join('');

// 邮箱和显示文字共享同一来源，后续只需修改 content.js。
const emailLink = document.querySelector('#email-link');
emailLink.href = `mailto:${portfolio.email}`;
emailLink.textContent = `${portfolio.email} ↗`;


// 所有时间以毫秒计，位移以像素计；在这里统一调整动效强度。
const motionSettings = {
  enterDuration: 800, stagger: 65, revealDuration: 850,
  pointerRange: 9, titleTravel: 48, dotsTravel: 95, coverTravel: 16,
  coverShrink: .035, coverFade: .2,
  bubbleReach: 150, bubblePull: 7, bubbleStretch: .055,
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktopPointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 641px)');
const hero = document.querySelector('.hero');
const backgroundLayer = hero.querySelector('.poster-dots');
const navLinks = [...document.querySelectorAll('.rail nav a')];

// 给小字单独加底板：只拉动背景，文字位置保持稳定，避免阅读时晃动。
const bubbleElements = [...hero.querySelectorAll('.topline > span, .poster-kicker, .poster-invite, .poster-info, .poster-manifesto > p, .poster-edition > small, .hero-bottom > span, .hero-bottom > a')];
bubbleElements.forEach(element => element.classList.add('text-bubble'));
let bubblePointer = null;
function updateBubbles() {
  bubbleElements.forEach(element => {
    const bounds = element.getBoundingClientRect();
    const dx = bubblePointer ? bubblePointer.x - (bounds.left + bounds.width / 2) : 0;
    const dy = bubblePointer ? bubblePointer.y - (bounds.top + bounds.height / 2) : 0;
    const distance = Math.hypot(dx, dy);
    const reach = motionSettings.bubbleReach + Math.max(bounds.width, bounds.height) / 2;
    const strength = bubblePointer ? Math.max(0, 1 - distance / reach) : 0;
    const angle = Math.atan2(dy, dx);
    element.style.setProperty('--bubble-x', `${Math.cos(angle) * strength * motionSettings.bubblePull}px`);
    element.style.setProperty('--bubble-y', `${Math.sin(angle) * strength * motionSettings.bubblePull}px`);
    element.style.setProperty('--bubble-stretch-x', 1 + Math.abs(Math.cos(angle)) * strength * motionSettings.bubbleStretch);
    element.style.setProperty('--bubble-stretch-y', 1 + Math.abs(Math.sin(angle)) * strength * motionSettings.bubbleStretch);
    element.style.setProperty('--bubble-skew', `${Math.cos(angle) * strength * 3}deg`);
  });
}

// 无动态偏好时直接保持最终画面；切换系统偏好也会停止正在播放的动画。
function playEntrance() {
  document.querySelectorAll('[data-enter]').forEach((element, index) => {
    element.animate([
      { opacity: 0, filter: 'blur(12px)', translate: '0 24px' },
      { opacity: 1, filter: 'blur(0px)', translate: '0 0' },
    ], { duration: motionSettings.enterDuration, delay: index * motionSettings.stagger, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  });
}
if (!reducedMotion.matches) playEntrance();

// 每个封面只揭幕一次。文字延迟跟进，不隐藏链接，键盘始终可访问。
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    revealObserver.unobserve(entry.target);
    if (reducedMotion.matches) return;
    const curtain = document.createElement('span');
    curtain.className = 'reveal-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    entry.target.querySelector('.project-visual').append(curtain);
    const reveal = curtain.animate([{ scale: '1 1' }, { scale: '0 1' }], {
      duration: motionSettings.revealDuration, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards',
    });
    reveal.onfinish = () => curtain.remove();
    entry.target.querySelector('.project-content h3').animate([
      { opacity: .25, translate: '0 14px' }, { opacity: 1, translate: '0 0' },
    ], { duration: 650, delay: 180, easing: 'ease-out', fill: 'backwards' });
  });
}, { threshold: .08 });
document.querySelectorAll('.project').forEach(project => revealObserver.observe(project));

// 滚动和指针共用一帧更新；只改变合成属性，不修改文档流或拦截自然滚动。
let framePending = false;
let pointerX = 0;
function renderMotion() {
  framePending = false;
  const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
  // 磨砂强度从顶部 10% 平滑增加到 100%。
  const frostStrength = .1 + progress * .9;
  backgroundLayer.style.setProperty('--frost-blur', `${frostStrength * 28}px`);
  backgroundLayer.style.setProperty('--frost-white', .04 + frostStrength * .38);
  if (reducedMotion.matches) return;
  hero.style.setProperty('--title-y', `${progress * motionSettings.titleTravel}px`);
  hero.style.setProperty('--dots-y', `${-progress * motionSettings.dotsTravel}px`);
  hero.style.setProperty('--cover-y', `${progress * motionSettings.coverTravel}px`);
  hero.style.setProperty('--cover-scale', 1 - progress * motionSettings.coverShrink);
  hero.style.setProperty('--cover-opacity', 1 - progress * motionSettings.coverFade);
  hero.style.setProperty('--title-x', `${pointerX}px`);
  // 底图横向视差为文字的两倍，其他鼠标动效保持原强度。
  hero.style.setProperty('--pointer-x', `${-pointerX * 2}px`);
  // 清晰窗口坐标减去底图当前边界，抵消滚动和视差位移。
  if (bubblePointer) {
    const backgroundBounds = backgroundLayer.getBoundingClientRect();
    backgroundLayer.style.setProperty('--reveal-x', `${bubblePointer.x - backgroundBounds.left}px`);
    backgroundLayer.style.setProperty('--reveal-y', `${bubblePointer.y - backgroundBounds.top}px`);
  }
  updateBubbles();
}
function requestMotion() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(renderMotion);
}
addEventListener('scroll', requestMotion, { passive: true });
addEventListener('resize', () => { pointerX = 0; bubblePointer = null; requestMotion(); });
hero.addEventListener('pointermove', event => {
  if (!desktopPointer.matches) return;
  const bounds = hero.getBoundingClientRect();
  pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * motionSettings.pointerRange * 2;
  bubblePointer = { x: event.clientX, y: event.clientY };
  hero.classList.add('lens-active');
  requestMotion();
});
hero.addEventListener('pointerleave', () => {
  pointerX = 0;
  bubblePointer = null;
  hero.classList.remove('lens-active');
  requestMotion();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    document.getAnimations().forEach(animation => animation.cancel());
    document.querySelectorAll('.reveal-curtain').forEach(curtain => curtain.remove());
    hero.removeAttribute('style');
    hero.classList.remove('lens-active');
    bubblePointer = null;
    bubbleElements.forEach(element => element.removeAttribute('style'));
  } else requestMotion();
});
requestMotion();

// 按当前阅读位置更新导航状态；aria-current 同时向辅助技术传递位置。
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('main > section').forEach(section => sectionObserver.observe(section));

// 鼠标名牌：位置由弹簧计算，而不是给每次 mousemove 叠加 CSS 动画。
// 保留系统指针，名牌只作装饰，不接收点击，也不会被屏幕阅读器朗读。
const cursorLabel = document.createElement('div');
cursorLabel.className = 'cursor-label';
// SVG 保留模切轮廓；去掉噪声和位移滤镜，缩小后边缘仍然清晰。
cursorLabel.innerHTML = `<svg class="cursor-sticker" viewBox="0 0 148 62" aria-hidden="true"><defs><path id="karina-cut" d="M2 21Q0 10 12 8Q20 1 32 8Q43 2 53 9Q67 3 77 10Q88 4 99 9Q112 0 123 5Q140 0 145 14Q151 25 144 36Q147 49 134 53Q124 63 111 55Q99 63 88 56Q75 64 64 56Q51 64 40 55Q26 61 18 53Q4 56 3 43Q-2 33 2 21Z"/><clipPath id="karina-clip"><use href="#karina-cut"/></clipPath></defs><g clip-path="url(#karina-clip)"><path fill="#acd820" d="M0 0h148v62H0z"/></g></svg><span class="cursor-label-text">Karina</span>`;
cursorLabel.setAttribute('aria-hidden', 'true');
document.body.append(cursorLabel);
const cursorSettings = {
  stiffness: 190, damping: 21, mass: .8,
  offsetX: 8, offsetY: -32, edge: 10, restDistance: .08, restSpeed: .15,
};
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
// 首页和关于区域显示名牌，侧栏与作品区域不触发。
const cursorAreas = [...document.querySelectorAll('#home, #about')];
let cursorPointer = { x: 0, y: 0 };
const cursorState = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, visible: false, frame: 0, lastTime: 0 };

// 每帧分两小步积分，使普通屏幕与高刷新率屏幕都有接近的阻尼手感。
function animateCursor(time) {
  const elapsed = cursorState.lastTime ? Math.min((time - cursorState.lastTime) / 1000, 1 / 30) : 1 / 60;
  cursorState.lastTime = time;
  const step = elapsed / 2;
  for (let i = 0; i < 2; i++) {
    cursorState.vx += ((cursorState.targetX - cursorState.x) * cursorSettings.stiffness - cursorState.vx * cursorSettings.damping) / cursorSettings.mass * step;
    cursorState.vy += ((cursorState.targetY - cursorState.y) * cursorSettings.stiffness - cursorState.vy * cursorSettings.damping) / cursorSettings.mass * step;
    cursorState.x += cursorState.vx * step;
    cursorState.y += cursorState.vy * step;
  }
  cursorLabel.style.transform = `translate3d(${cursorState.x}px, ${cursorState.y}px, 0)`;
  const distance = Math.hypot(cursorState.targetX - cursorState.x, cursorState.targetY - cursorState.y);
  const speed = Math.hypot(cursorState.vx, cursorState.vy);
  if (distance > cursorSettings.restDistance || speed > cursorSettings.restSpeed) {
    cursorState.frame = requestAnimationFrame(animateCursor);
  } else {
    // 收稳后停止请求帧，鼠标再次移动才唤醒动画。
    cursorState.frame = 0;
    cursorState.lastTime = 0;
  }
}

cursorAreas.forEach(area => area.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
  cursorPointer = { x: event.clientX, y: event.clientY };
  // 靠近屏幕边缘时把目标留在视口内，避免标签被裁掉。
  cursorState.targetX = Math.max(cursorSettings.edge, Math.min(innerWidth - cursorLabel.offsetWidth - cursorSettings.edge, event.clientX + cursorSettings.offsetX));
  cursorState.targetY = Math.max(cursorSettings.edge, Math.min(innerHeight - cursorLabel.offsetHeight - cursorSettings.edge, event.clientY + cursorSettings.offsetY));
  if (!cursorState.visible) {
    // 首次出现直接放到鼠标附近，避免从页面左上角飞入。
    cursorState.x = cursorState.targetX;
    cursorState.y = cursorState.targetY;
    cursorState.visible = true;
    cursorLabel.style.transform = `translate3d(${cursorState.x}px, ${cursorState.y}px, 0)`;
    cursorLabel.classList.add('is-visible');
  }
  if (!cursorState.frame) cursorState.frame = requestAnimationFrame(animateCursor);
}, { passive: true }));

// 离开网页、切换窗口或改为减少动态效果时，立即停止跟随并隐藏名牌。
function hideCursorLabel() {
  cancelAnimationFrame(cursorState.frame);
  cursorState.frame = 0;
  cursorState.lastTime = 0;
  cursorState.vx = 0;
  cursorState.vy = 0;
  cursorState.visible = false;
  cursorLabel.classList.remove('is-visible');
}
document.documentElement.addEventListener('pointerleave', hideCursorLabel);
cursorAreas.forEach(area => area.addEventListener('pointerleave', hideCursorLabel));
// 鼠标不动但页面滚走时，也要判断指针下方是否仍是首页或关于内容。
addEventListener('scroll', () => {
  if (cursorState.visible && !cursorAreas.some(area => area.contains(document.elementFromPoint(cursorPointer.x, cursorPointer.y)))) hideCursorLabel();
}, { passive: true });
document.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') hideCursorLabel(); });
addEventListener('blur', hideCursorLabel);
addEventListener('resize', hideCursorLabel);
document.addEventListener('visibilitychange', () => { if (document.hidden) hideCursorLabel(); });
finePointer.addEventListener('change', hideCursorLabel);
reducedMotion.addEventListener('change', hideCursorLabel);

// 封面跟随一个滞后的滚动位置：页面先走，封面短暂停留，再逐渐追上。
// 临界阻尼消除来回弹跳，只更新 translate，收稳后停帧。
const coverMotion = [...document.querySelectorAll('.project-visual')].map(element => ({ element, y: 0, velocity: 0, target: 0 }));
const coverSettings = { range: 80, followRate: 7 };
const coverScroll = { target: scrollY, position: scrollY, velocity: 0 };
let coverFrame = 0;
let coverTime = 0;
function animateCovers(time) {
  const dt = coverTime ? Math.min((time - coverTime) / 1000, 1 / 30) : 1 / 60;
  coverTime = time;
  // 临界阻尼的解析解：不同刷新率下保持相同手感，不会越过目标再反弹。
  const error = coverScroll.position - coverScroll.target;
  const rate = coverSettings.followRate;
  const decay = Math.exp(-rate * dt);
  const momentum = coverScroll.velocity + rate * error;
  coverScroll.position = coverScroll.target + (error + momentum * dt) * decay;
  coverScroll.velocity = (coverScroll.velocity - rate * momentum * dt) * decay;
  let moving = Math.abs(coverScroll.target - coverScroll.position) > .03 || Math.abs(coverScroll.velocity) > .08;
  if (!moving) { coverScroll.position = coverScroll.target; coverScroll.velocity = 0; }
  // 向下滚动时正位移抵消页面上移；柔和限幅避免快速滚动时突然撞到边界。
  const scrollOffset = coverSettings.range * Math.tanh((coverScroll.target - coverScroll.position) / coverSettings.range);
  coverMotion.forEach(card => {
    for (let step = 0; step < 2; step++) {
      card.velocity += ((card.target - card.y) * 210 - card.velocity * 30) * dt / 2;
      card.y += card.velocity * dt / 2;
    }
    if (Math.abs(card.target - card.y) > .03 || Math.abs(card.velocity) > .08) moving = true;
    else { card.y = card.target; card.velocity = 0; }
    card.element.style.setProperty('--card-y', `${(scrollOffset + card.y).toFixed(2)}px`);
  });
  if (moving) coverFrame = requestAnimationFrame(animateCovers);
  else { coverFrame = 0; coverTime = 0; }
}
function requestCoverMotion() {
  if (!reducedMotion.matches && !coverFrame) coverFrame = requestAnimationFrame(animateCovers);
}
coverMotion.forEach(card => {
  card.element.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
    const bounds = card.element.getBoundingClientRect();
    card.target = Math.max(-8, Math.min(8, ((event.clientY - bounds.top) / bounds.height - .5) * 16));
    requestCoverMotion();
  }, { passive: true });
  card.element.addEventListener('pointerleave', () => { card.target = 0; requestCoverMotion(); });
});
addEventListener('scroll', () => {
  coverScroll.target = scrollY;
  if (reducedMotion.matches) return;
  requestCoverMotion();
}, { passive: true });
reducedMotion.addEventListener('change', () => {
  cancelAnimationFrame(coverFrame);
  coverFrame = 0;
  coverTime = 0;
  coverScroll.target = scrollY;
  coverScroll.position = scrollY;
  coverScroll.velocity = 0;
  coverMotion.forEach(card => {
    card.y = 0; card.target = 0; card.velocity = 0;
    card.element.style.removeProperty('--card-y');
  });
});

// 原生 dialog 支持 Esc 关闭，并阻止弹窗打开时操作背后的页面。
const artDialog = document.createElement('dialog');
artDialog.className = 'art-dialog';
artDialog.innerHTML = '<button class="art-close" type="button" aria-label="关闭大图">关闭 ×</button><img alt="">';
document.body.append(artDialog);
document.querySelectorAll('.art-enlarge').forEach(button => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    const enlarged = artDialog.querySelector('img');
    enlarged.src = source.src;
    enlarged.alt = source.alt;
    artDialog.showModal();
  });
});
artDialog.querySelector('.art-close').addEventListener('click', () => artDialog.close());
// 背景遮罩的点击目标是 dialog 本身；图片与关闭按钮不会误触此分支。
artDialog.addEventListener('click', event => {
  if (event.target === artDialog) artDialog.close();
});

// 自拍翻页参数集中管理；每次只播放前卡翻出与后卡补位，不持续运行。
const portraitStack = document.querySelector('.portrait-stack');
const portraitCards = [...portraitStack.querySelectorAll('img')];
const portraitCount = document.querySelector('.portrait-count');
const portraitMotion = { duration: 700, distance: 115, tilt: 18, swipe: 35 };
let portraitIndex = 0;
let portraitTurning = false;
let portraitStartX = 0;
let portraitSwiped = false;
// 根据当前索引计算每张卡片在叠放中的位置，保证循环翻阅顺序正确。
function arrangePortraits() {
  portraitCards.forEach((card, index) => {
    const depth = (index - portraitIndex + portraitCards.length) % portraitCards.length;
    card.style.zIndex = portraitCards.length - depth;
    card.style.transform = `translate(${depth * 8}px, ${depth * 3}px) rotate(${depth * 3}deg) scale(${1 - depth * .035})`;
    card.style.visibility = depth < 3 ? 'visible' : 'hidden';
    card.setAttribute('aria-hidden', depth === 0 ? 'false' : 'true');
  });
  portraitCount.textContent = `${String(portraitIndex + 1).padStart(2, '0')} / 04`;
}
async function turnPortrait(direction = 1) {
  if (portraitTurning) return;
  portraitTurning = true;
  const outgoing = portraitCards[portraitIndex];
  if (!reducedMotion.matches) {
    // 卡片先向侧面抬起、旋转，再回到叠层背后，模拟视频里的翻卡惯性。
    await outgoing.animate([
      { transform: outgoing.style.transform, opacity: 1 },
      { transform: `translateX(${-direction * portraitMotion.distance}%) rotate(${-direction * portraitMotion.tilt}deg) rotateY(${direction * 25}deg)`, opacity: .85 },
    ], { duration: portraitMotion.duration * .55, easing: 'cubic-bezier(.32,0,.2,1)', fill: 'forwards' }).finished;
  }
  portraitIndex = (portraitIndex + direction + portraitCards.length) % portraitCards.length;
  // 先记录补位前的位置，再更新叠层，让卡片以弹性曲线归位。
  const previousTransforms = portraitCards.map(card => card.style.transform);
  outgoing.getAnimations().forEach(animation => animation.cancel());
  arrangePortraits();
  if (!reducedMotion.matches) {
    await Promise.all(portraitCards.map((card, index) => card.animate([
      { transform: card === outgoing ? `translateX(${-direction * portraitMotion.distance}%) rotate(${-direction * portraitMotion.tilt}deg)` : previousTransforms[index] },
      { transform: card.style.transform },
    ], { duration: portraitMotion.duration * .65, easing: 'cubic-bezier(.16,1.3,.3,1)' }).finished));
  }
  portraitTurning = false;
}
portraitStack.addEventListener('click', () => { if (!portraitSwiped) turnPortrait(); });
document.querySelector('.portrait-prev').addEventListener('click', () => turnPortrait(-1));
document.querySelector('.portrait-next').addEventListener('click', () => turnPortrait(1));
portraitStack.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    turnPortrait(event.key === 'ArrowRight' ? 1 : -1);
  }
});
// 保留纵向页面滚动，只有明显的横向滑动才触发翻页。
portraitStack.addEventListener('pointerdown', event => { portraitStartX = event.clientX; portraitSwiped = false; });
portraitStack.addEventListener('pointerup', event => {
  const delta = event.clientX - portraitStartX;
  portraitSwiped = Math.abs(delta) > portraitMotion.swipe;
  if (portraitSwiped) turnPortrait(delta < 0 ? 1 : -1);
});
arrangePortraits();
