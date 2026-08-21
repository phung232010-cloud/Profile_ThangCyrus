/**
 * MAIN PORTFOLIO APPLICATION CONTROLLER
 * Xử lý sao chép tài khoản 1 chạm, Toast thông báo, Đổi giao diện (Themes),
 * Bộ đếm FPS thời gian thực, Hiệu ứng gõ chữ và Modal VietQR.
 */

class PortfolioApp {
  constructor() {
    this.data = window.PORTFOLIO_DATA;
    this.currentThemeIndex = 0;
    this.fps = 60;
    this.frames = 0;
    this.lastFpsUpdate = performance.now();

    this.init();
  }

  init() {
    this.ensureVideoAutoplay();
    this.renderProfile();
    this.renderSocials();
    this.renderBanking();
    this.initThemeSystem();
    this.initTypingEffect();
    this.initFpsCounter();
    this.initCardTilt();
    this.initQrModal();
    this.initClock();
  }

  ensureVideoAutoplay() {
    const video = document.getElementById("bg-video");
    if (!video) return;
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    tryPlay();
    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
  }

  renderProfile() {
    const profile = this.data.profile;
    const nameEl = document.getElementById("profile-name");
    const bioEl = document.getElementById("profile-bio");
    const avatarEl = document.getElementById("profile-avatar");

    if (nameEl) nameEl.textContent = profile.name;
    if (bioEl) bioEl.textContent = profile.bioPrefix !== undefined ? profile.bioPrefix : "Developer | Freelancer | ";
    if (avatarEl) {
      avatarEl.src = profile.avatar;
      avatarEl.onerror = () => {
        avatarEl.src = profile.avatarBackup;
      };
    }
  }

  renderSocials() {
    const container = document.getElementById("socials-container");
    if (!container) return;

    container.innerHTML = this.data.socials
      .map(
        (s) => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" 
         class="social-btn" id="social-${s.id}" 
         style="--accent-color: ${s.color}" 
         title="${s.tooltip || s.name}" 
         aria-label="${s.name}">
        <i class="${s.icon}"></i>
        <span class="social-tooltip">${s.name}</span>
      </a>
    `
      )
      .join("");
  }

  renderBanking() {
    const container = document.getElementById("banking-container");
    if (!container) return;

    container.innerHTML = this.data.banking
      .map((b) => {
        const isMB = b.id === "mbbank";
        const isMoMo = b.id === "momo";
        
        // Tạo link VietQR tự động cho MB Bank
        const qrAction = isMB
          ? `<button class="qr-btn" onclick="window.app.openQrModal('mbbank')" title="Xem mã VietQR"><i class="fa-solid fa-qrcode"></i> QR</button>`
          : (isMoMo ? `<button class="qr-btn" onclick="window.app.openQrModal('momo')" title="Xem mã QR MoMo"><i class="fa-solid fa-qrcode"></i> QR</button>` : "");

        return `
        <div class="bank-card" id="bank-${b.id}">
          <div class="bank-info">
            <div class="bank-header">
              <span class="bank-badge" style="background: ${b.badgeColor}22; color: ${b.badgeColor}; border: 1px solid ${b.badgeColor}44">
                <i class="${b.icon}"></i> ${b.bankName}
              </span>
              <span class="bank-subtext">${b.bankFullName}</span>
            </div>
            <div class="bank-account-num" id="acc-${b.id}">${b.accountNumber}</div>
            <div class="bank-holder-name">${b.accountName}</div>
          </div>
          <div class="bank-actions">
            ${qrAction}
            <button class="copy-btn" id="copy-btn-${b.id}" onclick="window.app.copyToClipboard('${b.accountNumber}', '${b.bankName}', this)">
              <i class="fa-regular fa-copy"></i>
              <span>Copy</span>
            </button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  copyToClipboard(text, name, btnElement) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        this.onCopySuccess(text, name, btnElement);
      }).catch(() => {
        this.fallbackCopy(text, name, btnElement);
      });
    } else {
      this.fallbackCopy(text, name, btnElement);
    }
  }

  fallbackCopy(text, name, btnElement) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      this.onCopySuccess(text, name, btnElement);
    } catch (err) {
      this.showToast("Không thể tự sao chép, vui lòng copy thủ công: " + text);
    }
    document.body.removeChild(textarea);
  }

  onCopySuccess(text, name, btnElement) {
    // Hiệu ứng nút bấm
    if (btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.classList.add("copied");
      btnElement.innerHTML = `<i class="fa-solid fa-check"></i> <span>Đã chép!</span>`;
      
      // Tạo hiệu ứng hạt nổ nhỏ xung quanh nút
      this.createSparkleBurst(btnElement);

      setTimeout(() => {
        btnElement.classList.remove("copied");
        btnElement.innerHTML = originalHtml;
      }, 2000);
    }

    this.showToast(`✨ Đã sao chép ${name}: <strong>${text}</strong>`);
  }

  createSparkleBurst(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle-particle";
      const angle = (i / 8) * Math.PI * 2;
      const dist = Math.random() * 30 + 15;
      sparkle.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      sparkle.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      sparkle.style.left = `${rect.left + rect.width / 2}px`;
      sparkle.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 700);
    }
  }

  showToast(message) {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "toast-container";
      document.body.appendChild(toast);
    }

    const item = document.createElement("div");
    item.className = "toast-item";
    item.innerHTML = message;
    toast.appendChild(item);

    requestAnimationFrame(() => {
      item.classList.add("show");
    });

    setTimeout(() => {
      item.classList.remove("show");
      setTimeout(() => item.remove(), 400);
    }, 2800);
  }

  initThemeSystem() {
    const savedTheme = localStorage.getItem("portfolio_theme") || "magic-forest";
    this.setTheme(savedTheme);

    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeMenu = document.getElementById("theme-dropdown-menu");

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (themeMenu) {
          themeMenu.classList.toggle("active");
        } else {
          this.cycleNextTheme();
        }
      });
    }

    // Render danh sách themes nếu có menu
    if (themeMenu) {
      themeMenu.innerHTML = this.data.themes
        .map(
          (t) => `
        <button class="theme-option ${t.id === savedTheme ? "active" : ""}" 
                onclick="window.app.setTheme('${t.id}')">
          <span class="theme-dot" style="background: linear-gradient(135deg, ${t.primary}, ${t.secondary})"></span>
          <span>${t.name}</span>
        </button>
      `
        )
        .join("");

      document.addEventListener("click", () => {
        themeMenu.classList.remove("active");
      });
    }
  }

  setTheme(themeId) {
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("portfolio_theme", themeId);

    const themeObj = this.data.themes.find((t) => t.id === themeId);
    if (themeObj) {
      const themeIcon = document.getElementById("theme-icon");
      if (themeIcon) {
        if (themeId === "soft-neumorphic") {
          themeIcon.className = "fa-solid fa-sun";
        } else if (themeId === "transparent-glass") {
          themeIcon.className = "fa-solid fa-wand-magic-sparkles";
        } else {
          themeIcon.className = "fa-solid fa-moon";
        }
      }

      // Cập nhật active class trong menu
      const options = document.querySelectorAll(".theme-option");
      options.forEach((opt) => {
        opt.classList.toggle("active", opt.getAttribute("onclick")?.includes(themeId));
      });
    }
  }

  cycleNextTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "magic-forest";
    const currentIndex = this.data.themes.findIndex((t) => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % this.data.themes.length;
    this.setTheme(this.data.themes[nextIndex].id);
    this.showToast(`🎨 Đã chuyển sang giao diện: <strong>${this.data.themes[nextIndex].name}</strong>`);
  }

  initTypingEffect() {
    const typingEl = document.getElementById("typing-text");
    if (!typingEl) return;

    const roles = this.data.profile.roles || ["Developer", "Freelancer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 1800;

    const type = () => {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 300);
      } else {
        setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
      }
    };

    type();
  }

  initFpsCounter() {
    const fpsEl = document.getElementById("fps-val");
    if (!fpsEl) return;

    const updateFps = (timestamp) => {
      this.frames++;
      if (timestamp >= this.lastFpsUpdate + 1000) {
        this.fps = Math.round((this.frames * 1000) / (timestamp - this.lastFpsUpdate));
        fpsEl.textContent = Math.min(this.fps, 60);
        this.frames = 0;
        this.lastFpsUpdate = timestamp;
      }
      requestAnimationFrame(updateFps);
    };

    requestAnimationFrame(updateFps);
  }

  initClock() {
    const clockEl = document.getElementById("live-clock");
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      clockEl.textContent = `${h}:${m}:${s}`;
    };
    update();
    setInterval(update, 1000);
  }

  initCardTilt() {
    // 3D Tilt mượt mà khi rê chuột trên Desktop
    if (window.innerWidth < 768) return;

    const card = document.querySelector(".portfolio-container");
    if (!card) return;

    window.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      const rotateY = x * 4;
      const rotateX = -y * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    window.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  }

  initQrModal() {
    const modal = document.getElementById("qr-modal");
    const closeBtn = document.getElementById("close-qr-modal");
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }
  }

  openQrModal(bankId) {
    const modal = document.getElementById("qr-modal");
    const qrImg = document.getElementById("qr-image-display");
    const qrTitle = document.getElementById("qr-modal-title");
    const qrBankName = document.getElementById("qr-bank-name");
    const qrAccNum = document.getElementById("qr-acc-num");
    const qrAccHolder = document.getElementById("qr-acc-holder");

    const item = this.data.banking.find((b) => b.id === bankId);
    if (!item || !modal) return;

    qrTitle.textContent = `Mã QR Thanh Toán: ${item.bankName}`;
    qrBankName.textContent = item.bankFullName;
    qrAccNum.textContent = item.accountNumber;
    qrAccHolder.textContent = item.accountName;

    // Link VietQR động chuẩn ngân hàng Việt Nam
    if (item.bin) {
      qrImg.src = `https://img.vietqr.io/image/${item.bin}-${item.accountNumber}-compact2.png?accountName=${encodeURIComponent(item.accountName)}&addInfo=Chuyen%20tien%20Minh%20Thang`;
    } else if (item.qrUrl) {
      qrImg.src = item.qrUrl;
    } else {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(item.accountNumber)}`;
    }

    modal.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new PortfolioApp();
});
