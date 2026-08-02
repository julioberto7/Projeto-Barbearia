/* ============================================================
   LUDUGERO BARBEARIA — script.js
   Animações + interatividade (sem verde)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. BARRA DE PROGRESSO */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  /* 2. HEADER scrolled + nav ativa */
  const header   = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }, { passive: true });

  /* 3. MENU MOBILE */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');
  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('aberto');
    navToggle.setAttribute('aria-expanded', open);
  });
  navMenu?.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navMenu.classList.remove('aberto'));
  });

  /* 4. TYPEWRITER no hero */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const raw    = heroTitle.innerHTML;
    const emMatch = raw.match(/<em>(.*?)<\/em>/);
    const emText  = emMatch ? emMatch[1] : '';
    const before  = raw.split('<em>')[0];

    heroTitle.innerHTML = '';
    heroTitle.style.opacity  = '1';
    heroTitle.style.animation = 'none';

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    heroTitle.appendChild(cursor);

    let i = 0, phase = 'before';

    function typeChar() {
      if (phase === 'before') {
        if (i < before.length) {
          heroTitle.insertBefore(document.createTextNode(before[i++]), cursor);
          setTimeout(typeChar, 52);
        } else {
          phase = 'em'; i = 0;
          const em = document.createElement('em');
          heroTitle.insertBefore(em, cursor);
          typeEm(em);
        }
      }
    }
    function typeEm(em) {
      if (i < emText.length) {
        em.textContent += emText[i++];
        setTimeout(() => typeEm(em), 52);
      } else {
        setTimeout(() => cursor.style.display = 'none', 2200);
      }
    }
    setTimeout(typeChar, 820);
  }

  /* 5. SCROLL REVEAL */
  const targets = [
    '.service-card', '.plano-card', '.gallery-item',
    '.sobre-desc', '.contato-list li', '.stat',
    '.section-eyebrow', '.section-title', '.agendar-form',
    '.membro-card',
  ];
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      const inGrid = el.closest(
        '.services-grid,.planos-grid,.gallery-grid,.contato-list,.sobre-stats,.equipe-grid'
      );
      el.classList.add(inGrid ? 'reveal-stagger' : 'reveal');
      if (inGrid) el.style.transitionDelay = (i % 5) * 90 + 'ms';
    });
  });
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal,.reveal-stagger').forEach(el => revObs.observe(el));

  /* 6. CONTADOR ANIMADO */
  const statsMap = {
    '15+': { target:15, suffix:'+' },
    '8':   { target:8,  suffix:'' },
    '100%':{ target:100, suffix:'%' },
  };
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el   = e.target;
      const info = statsMap[el.textContent.trim()];
      if (!info) return;
      let cur = 0;
      const step = Math.ceil(info.target / 40);
      const t = setInterval(() => {
        cur = Math.min(cur + step, info.target);
        el.textContent = cur + info.suffix;
        if (cur >= info.target) clearInterval(t);
      }, 38);
      cntObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => cntObs.observe(el));

  /* 7. PARTÍCULAS no hero */
  const hero = document.querySelector('.hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800),
      r: Math.random() * 1.3 + 0.3,
      vx:(Math.random() - 0.5) * 0.18,
      vy:(Math.random() - 0.5) * 0.18,
      a: Math.random() * 0.35 + 0.08,
    }));

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,225,232,${p.a})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });
      requestAnimationFrame(draw);
    })();
  }

  /* 8. FORMULÁRIO → WhatsApp */
  const form = document.getElementById('agendar-form');
  if (form) {
    const WPP = '5584981582916';

    const showErr = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
    const clearErr = () => {
      document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      document.querySelectorAll('.erro').forEach(el => el.classList.remove('erro'));
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErr();
      const nome     = form.nome.value.trim();
      const tel      = form.telefone.value.trim();
      const servico  = form.servico.value;
      const data     = form.data.value;
      const barb     = form.barbeiro ? form.barbeiro.value : '';
      const obs      = form.mensagem.value.trim();
      let ok = true;

      if (!nome)                                  { showErr('erro-nome','Informe seu nome.');        form.nome.classList.add('erro');     ok=false; }
      if (tel.replace(/\D/g,'').length < 10)      { showErr('erro-telefone','WhatsApp inválido.');  form.telefone.classList.add('erro'); ok=false; }
      if (!servico)                               { showErr('erro-servico','Selecione um serviço.'); form.servico.classList.add('erro'); ok=false; }
      if (!data)                                  { showErr('erro-data','Selecione uma data.');      form.data.classList.add('erro');    ok=false; }
      if (!barb)                                  { showErr('erro-barbeiro','Escolha o barbeiro.');                                      ok=false; }
      if (!ok) return;

      const dtFmt = new Date(data + 'T12:00:00').toLocaleDateString('pt-BR');
      let txt = `Olá! Vim pelo site da *Ludugero Barbearia* 💈\n\n`;
      txt += `*Nome:* ${nome}\n`;
      txt += `*Barbeiro:* ${barb}\n`;
      txt += `*Serviço:* ${servico}\n`;
      txt += `*Data:* ${dtFmt}\n`;
      if (obs) txt += `*Obs:* ${obs}\n`;

      window.open(`https://wa.me/${WPP}?text=${encodeURIComponent(txt)}`, '_blank');
    });

    /* Máscara telefone */
    form.telefone?.addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'').slice(0,11);
      if (v.length >= 7)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length >= 3) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length >= 1) v = `(${v}`;
      this.value = v;
    });

    /* Data mínima = hoje */
    if (form.data) {
      const hoje = new Date();
      hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
      form.data.min = hoje.toISOString().split('T')[0];
    }
  }

  /* 9. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth' });
    });
  });

}); // fim DOMContentLoaded