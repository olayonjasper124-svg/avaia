// ---------- Header: solid on scroll + back-to-top ----------
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('solid', y > 60);
  toTop.classList.toggle('show', y > window.innerHeight * 0.6);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Fullscreen menu ----------
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
function setMenu(open) {
  menu.classList.toggle('open', open);
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---------- About background slideshow ----------
const bgs = document.querySelectorAll('#aboutBg img');
let bgIndex = 0;
setInterval(() => {
  bgs[bgIndex].classList.remove('on');
  bgIndex = (bgIndex + 1) % bgs.length;
  bgs[bgIndex].classList.add('on');
}, 5000);

// ---------- Featured film player ----------
const wrap = document.getElementById('mainFilm');
const film = document.getElementById('filmVideo');
document.getElementById('playBtn').addEventListener('click', () => {
  film.controls = true;
  film.play();
  wrap.classList.add('playing');
});
film.addEventListener('ended', () => wrap.classList.remove('playing'));

// ---------- Testimonial slider ----------
const slides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');
let cur = 0, timer;
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
  b.addEventListener('click', () => { show(i); restart(); });
  dotsBox.appendChild(b);
});
const dots = dotsBox.querySelectorAll('button');
function show(i) {
  slides[cur].classList.remove('on'); dots[cur].classList.remove('on');
  cur = i;
  slides[cur].classList.add('on'); dots[cur].classList.add('on');
}
function restart() { clearInterval(timer); timer = setInterval(() => show((cur + 1) % slides.length), 7000); }
show(0); restart();

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Contact form with math captcha ----------
const qa = document.getElementById('qa'), qb = document.getElementById('qb');
const ans = document.getElementById('ans'), msg = document.getElementById('formMsg');
let sum = 0;
function newCaptcha() {
  const a = 1 + Math.floor(Math.random() * 9), b = 1 + Math.floor(Math.random() * 9);
  qa.textContent = a; qb.textContent = b; sum = a + b; ans.value = '';
}
newCaptcha();
document.getElementById('refresh').addEventListener('click', newCaptcha);

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  msg.className = 'form-msg';
  if (!f.name.value.trim() || !/^\S+@\S+\.\S+$/.test(f.email.value) || !f.event.value) {
    msg.textContent = 'Please fill in your name, a valid email and the type of event.';
    msg.classList.add('err'); return;
  }
  if (Number(ans.value) !== sum) {
    msg.textContent = 'Wrong answer. Please try the sum again.';
    msg.classList.add('err'); newCaptcha(); return;
  }
  // TODO: send to your backend / Formspree / EmailJS here.
  msg.textContent = 'Thank you! We will get back to you soon.';
  msg.classList.add('ok');
  f.reset(); newCaptcha();
});

document.getElementById('year').textContent = new Date().getFullYear();
