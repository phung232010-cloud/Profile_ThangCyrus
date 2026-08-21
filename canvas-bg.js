/**
 * DYNAMIC MAGIC FOREST CANVAS & VIDEO BACKGROUND
 * Hiệu ứng nền khu rừng hoa kỳ ảo: Cánh hoa rơi 3D, đom đóm phát sáng, làn sương huyền bí
 * Tự động thích ứng xoay dọc trên Điện thoại và trải rộng toàn màn hình trên Máy tính
 */

class MagicForestBackground {
  constructor() {
    this.canvas = document.getElementById("forest-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.petals = [];
    this.fireflies = [];
    this.lightBeams = [];
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    this.ripples = [];
    this.audioIntensity = 0;

    this.initSize();
    this.createElements();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
    this.isMobile = this.width < 768;
  }

  createElements() {
    // 1. Khởi tạo cánh hoa rơi (Blossom Petals)
    const petalCount = this.isMobile ? 35 : 70;
    this.petals = [];
    for (let i = 0; i < petalCount; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 1.5 - 0.5,
        speedY: Math.random() * 1.2 + 0.8,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayDistance: Math.random() * 30 + 15,
        colorType: Math.floor(Math.random() * 4), // Hồng đào, Tím dạ quang, Trắng ngọc, Xanh ngọc
        alpha: Math.random() * 0.6 + 0.4,
        z: Math.random() * 0.8 + 0.2 // Chiều sâu 3D
      });
    }

    // 2. Khởi tạo đom đóm phát sáng (Fireflies)
    const fireflyCount = this.isMobile ? 25 : 50;
    this.fireflies = [];
    for (let i = 0; i < fireflyCount; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        baseRadius: Math.random() * 3 + 1.5,
        radius: Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        glowPulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        hue: Math.random() > 0.4 ? 320 : (Math.random() > 0.5 ? 180 : 50) // Hồng sen, Cyan ngọc, Vàng đom đóm
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.initSize();
      this.createElements();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.active = true;
      }
    }, { passive: true });

    // Hiệu ứng sóng năng lượng khi click
    window.addEventListener("click", (e) => {
      this.ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: this.isMobile ? 120 : 200,
        alpha: 0.8
      });
    });
  }

  setAudioIntensity(val) {
    this.audioIntensity = val; // Nhận từ music visualizer
  }

  drawGradientBackground() {
    const videoEl = document.getElementById("bg-video");
    const hasActiveVideo = videoEl && !videoEl.paused && videoEl.readyState >= 2;

    // Nếu có video TikTok đang chạy, chỉ phủ nhẹ hiệu ứng ánh sáng quang học huyền ảo
    if (hasActiveVideo) {
      const time = Date.now() * 0.0005;
      const shiftX = Math.sin(time) * 40;
      const shiftY = Math.cos(time * 0.8) * 30;
      const centerX = this.width * 0.5 + shiftX * 0.5;
      const centerY = this.height * 0.4 + shiftY * 0.5;
      
      const bloomGrad = this.ctx.createRadialGradient(
        centerX, centerY, 50,
        centerX, centerY, Math.max(this.width, this.height) * 0.65
      );
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.15 + this.audioIntensity * 0.3;
      bloomGrad.addColorStop(0, `rgba(255, 119, 170, ${0.12 * pulse})`);
      bloomGrad.addColorStop(0.5, `rgba(0, 242, 254, ${0.08 * pulse})`);
      bloomGrad.addColorStop(1, "rgba(0,0,0,0)");

      this.ctx.fillStyle = bloomGrad;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    // Nền chuyển động nhiều lớp dự phòng mô phỏng khu rừng hoa
    const time = Date.now() * 0.0005;
    const shiftX = Math.sin(time) * 40;
    const shiftY = Math.cos(time * 0.8) * 30;

    const bgGrad = this.ctx.createLinearGradient(0, 0, this.width + shiftX, this.height + shiftY);
    const theme = document.documentElement.getAttribute("data-theme") || "magic-forest";
    
    if (theme === "magic-forest") {
      bgGrad.addColorStop(0, "#0b0c1e");
      bgGrad.addColorStop(0.35, "#1e102f");
      bgGrad.addColorStop(0.7, "#112035");
      bgGrad.addColorStop(1, "#070b16");
    } else if (theme === "cyber-neon") {
      bgGrad.addColorStop(0, "#050b14");
      bgGrad.addColorStop(0.4, "#0f1a30");
      bgGrad.addColorStop(0.8, "#1a0826");
      bgGrad.addColorStop(1, "#02050d");
    } else if (theme === "aurora-dream") {
      bgGrad.addColorStop(0, "#0f0c29");
      bgGrad.addColorStop(0.5, "#302b63");
      bgGrad.addColorStop(1, "#24243e");
    } else if (theme === "transparent-glass") {
      bgGrad.addColorStop(0, "#0b0c1e");
      bgGrad.addColorStop(0.35, "#151b33");
      bgGrad.addColorStop(0.7, "#1c1432");
      bgGrad.addColorStop(1, "#070b16");
    } else if (theme === "sunset-gold") {
      bgGrad.addColorStop(0, "#1f0d14");
      bgGrad.addColorStop(0.5, "#38171e");
      bgGrad.addColorStop(1, "#12080a");
    } else {
      bgGrad.addColorStop(0, "#e0e7ff");
      bgGrad.addColorStop(0.5, "#f5d0fe");
      bgGrad.addColorStop(1, "#ccfbf1");
    }

    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Vùng sáng trung tâm tỏa rực rỡ (Bioluminescent Bloom)
    const centerX = this.width * 0.5 + shiftX * 0.5;
    const centerY = this.height * 0.4 + shiftY * 0.5;
    const bloomGrad = this.ctx.createRadialGradient(
      centerX, centerY, 50,
      centerX, centerY, Math.max(this.width, this.height) * 0.65
    );

    const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.15 + this.audioIntensity * 0.3;
    
    if (theme !== "soft-neumorphic") {
      bloomGrad.addColorStop(0, `rgba(255, 119, 170, ${0.18 * pulse})`);
      bloomGrad.addColorStop(0.4, `rgba(0, 242, 254, ${0.12 * pulse})`);
      bloomGrad.addColorStop(0.8, `rgba(167, 119, 227, ${0.06 * pulse})`);
      bloomGrad.addColorStop(1, "rgba(0,0,0,0)");
    } else {
      bloomGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      bloomGrad.addColorStop(0.6, "rgba(230, 240, 255, 0.2)");
      bloomGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    }

    this.ctx.fillStyle = bloomGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawPetal(petal) {
    this.ctx.save();
    this.ctx.translate(petal.x, petal.y);
    this.ctx.rotate(petal.angle);
    this.ctx.scale(petal.z, petal.z);

    // Màu cánh hoa theo type
    let color1 = "rgba(255, 182, 193, ";
    let color2 = "rgba(255, 105, 180, ";
    if (petal.colorType === 1) { // Tím hoa cà
      color1 = "rgba(221, 160, 221, ";
      color2 = "rgba(186, 85, 211, ";
    } else if (petal.colorType === 2) { // Xanh ngọc đom đóm
      color1 = "rgba(167, 243, 208, ";
      color2 = "rgba(56, 189, 248, ";
    } else if (petal.colorType === 3) { // Trắng phát sáng
      color1 = "rgba(255, 255, 255, ";
      color2 = "rgba(254, 205, 211, ";
    }

    // Gradient cánh hoa
    const grad = this.ctx.createRadialGradient(0, 0, 1, 0, 0, petal.size);
    grad.addColorStop(0, `${color1}${petal.alpha})`);
    grad.addColorStop(1, `${color2}${petal.alpha * 0.4})`);

    this.ctx.fillStyle = grad;
    this.ctx.shadowColor = "rgba(255, 182, 193, 0.6)";
    this.ctx.shadowBlur = 6 * petal.z;

    // Vẽ hình cánh hoa mềm mại
    this.ctx.beginPath();
    this.ctx.moveTo(0, -petal.size);
    this.ctx.bezierCurveTo(petal.size * 0.8, -petal.size * 0.6, petal.size * 0.9, petal.size * 0.6, 0, petal.size);
    this.ctx.bezierCurveTo(-petal.size * 0.9, petal.size * 0.6, -petal.size * 0.8, -petal.size * 0.6, 0, -petal.size);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawFirefly(f) {
    this.ctx.save();
    f.glowPulse += f.pulseSpeed;
    const pulseFactor = (Math.sin(f.glowPulse) + 1) * 0.5;
    const currentRadius = f.baseRadius * (1 + pulseFactor * 0.6) * (1 + this.audioIntensity * 0.5);

    const grad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, currentRadius * 4);
    grad.addColorStop(0, `hsla(${f.hue}, 100%, 80%, ${0.85 + pulseFactor * 0.15})`);
    grad.addColorStop(0.3, `hsla(${f.hue}, 100%, 65%, ${0.4 + pulseFactor * 0.3})`);
    grad.addColorStop(1, `hsla(${f.hue}, 100%, 50%, 0)`);

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(f.x, f.y, currentRadius * 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Hạt lõi phát sáng
    this.ctx.fillStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.arc(f.x, f.y, currentRadius * 0.4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawGradientBackground();

    const time = Date.now() * 0.001;

    // 1. Cập nhật & vẽ cánh hoa
    for (let p of this.petals) {
      p.angle += p.rotationSpeed;
      p.y += p.speedY * p.z;
      p.x += Math.sin(time * p.swaySpeed + p.y * 0.01) * 0.8 + p.speedX;

      // Phản ứng nhẹ khi chuột lại gần
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= (dx / dist) * 2;
          p.y -= (dy / dist) * 2;
        }
      }

      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 20) p.x = -20;
      if (p.x < -20) p.x = this.width + 20;

      this.drawPetal(p);
    }

    // 2. Cập nhật & vẽ đom đóm
    for (let f of this.fireflies) {
      f.x += f.speedX;
      f.y += f.speedY;

      // Đổi hướng nhẹ nhàng
      if (Math.random() < 0.02) f.speedX += (Math.random() - 0.5) * 0.2;
      if (Math.random() < 0.02) f.speedY += (Math.random() - 0.5) * 0.2;

      // Giữ vận tốc ổn định
      f.speedX = Math.max(Math.min(f.speedX, 0.8), -0.8);
      f.speedY = Math.max(Math.min(f.speedY, 0.8), -0.8);

      if (f.x < -10) f.x = this.width + 10;
      if (f.x > this.width + 10) f.x = -10;
      if (f.y < -10) f.y = this.height + 10;
      if (f.y > this.height + 10) f.y = -10;

      this.drawFirefly(f);
    }

    // 3. Hiệu ứng Click Ripple
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 3.5;
      r.alpha -= 0.015;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.strokeStyle = `rgba(255, 119, 170, ${r.alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    requestAnimationFrame(this.animate);
  }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  window.forestBg = new MagicForestBackground();
});
