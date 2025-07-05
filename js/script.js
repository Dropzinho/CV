// Smooth scroll para seções
$('#learn-more').on('click', function(){
  $('html, body').animate({ scrollTop: $('.about').offset().top }, 800);
});

// Validação do formulário
$('#contact-form').on('submit', function(e){
  e.preventDefault();
  const name    = $('#name').val().trim();
  const email   = $('#email').val().trim();
  const message = $('#message').val().trim();

  if (!name || !email || !message) {
    $('#form-messages').text('Por favor, preencha todos os campos.');
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    $('#form-messages').text('Email inválido.');
    return;
  }
  $('#form-messages').text('Mensagem enviada com sucesso!');
  this.reset();
});

// Ripple nos links do menu
document.querySelectorAll('header .menu a').forEach(link => {
  link.style.overflow = 'hidden';
  link.addEventListener('click', function(e) {
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height);
    circle.style.width  = circle.style.height = d + 'px';
    circle.style.left   = (e.clientX - rect.left - d/2) + 'px';
    circle.style.top    = (e.clientY - rect.top  - d/2) + 'px';
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
});

// Chuva de meteoros com repulsão de mouse
;(function(){
  const canvas = document.getElementById('meteor-canvas');
  const ctx    = canvas.getContext('2d');
  let w, h;
  const mouse = { x:null, y:null, radius:120 };
  const meteors = [], MAX = 60;

  function resize(){
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function Meteor(){
    this.reset();
  }
  Meteor.prototype.reset = function(){
    this.x     = Math.random()*w;
    this.y     = -20;
    this.len   = 10 + Math.random()*40;
    this.speed = 1 + Math.random()*2;
    this.angle = Math.PI/3 + (Math.random()-0.5)*0.4;
    this.width = 1 + Math.random()*2;
  };
  Meteor.prototype.update = function(){
    const dx = Math.cos(this.angle)*this.speed;
    const dy = Math.sin(this.angle)*this.speed;
    this.x += dx; this.y += dy;
    if (mouse.x!==null) {
      const dist = Math.hypot(this.x-mouse.x, this.y-mouse.y);
      if (dist < mouse.radius) {
        this.x -= dx*5; this.y -= dy*5;
      }
    }
    if (this.x < -50 || this.x > w+50 || this.y > h+50) this.reset();
  };
  Meteor.prototype.draw = function(){
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth   = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - Math.cos(this.angle)*this.len,
      this.y - Math.sin(this.angle)*this.len
    );
    ctx.stroke();
  };

  function init(){
    resize();
    for (let i=0; i<MAX; i++) meteors.push(new Meteor());
    animate();
  }
  function animate(){
    ctx.clearRect(0,0,w,h);
    meteors.forEach(m=>{ m.update(); m.draw(); });
    requestAnimationFrame(animate);
  }
  init();
})();
