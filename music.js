/**
 * NEUMORPHIC MUSIC PLAYER ENGINE
 * Quản lý phát nhạc "Lạc Vào Khu Rừng Hoa", điều khiển thời gian thực,
 * Sóng âm thanh Visualizer và Bộ tổng hợp âm thanh Web Audio API dự phòng.
 */

class MusicPlayer {
  constructor() {
    this.data = window.PORTFOLIO_DATA.music;
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.isPlaying = false;
    this.isMuted = false;
    this.isLooping = true;
    this.isShuffle = false;
    this.duration = this.data.durationDefault || 214;
    this.currentTime = 0;
    this.audioCtx = null;
    this.synthPlaying = false;
    this.synthInterval = null;

    // DOM Elements
    this.playBtn = document.getElementById("play-btn");
    this.playIcon = document.getElementById("play-icon");
    this.progressContainer = document.getElementById("progress-container");
    this.progressBar = document.getElementById("progress-bar");
    this.currentTimeEl = document.getElementById("current-time");
    this.durationTimeEl = document.getElementById("duration-time");
    this.songTitleEl = document.getElementById("song-title");
    this.songSubtitleEl = document.getElementById("song-subtitle");
    this.volumeSlider = document.getElementById("volume-slider");
    this.loopBtn = document.getElementById("loop-btn");
    this.shuffleBtn = document.getElementById("shuffle-btn");
    this.visualizerCanvas = document.getElementById("music-visualizer");
    this.quickPlayNotice = document.getElementById("quick-play-notice");

    this.init();
  }

  init() {
    if (this.songTitleEl) this.songTitleEl.textContent = this.data.title;
    if (this.songSubtitleEl) this.songSubtitleEl.textContent = this.data.subtitle;
    if (this.durationTimeEl) this.durationTimeEl.textContent = this.formatTime(this.duration);

    this.setupAudioSource();
    this.bindEvents();
    this.initVisualizer();
  }

  setupAudioSource() {
    this.audio.src = this.data.audioSrc;
    this.audio.loop = this.isLooping;

    this.audio.addEventListener("loadedmetadata", () => {
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        this.duration = this.audio.duration;
        if (this.durationTimeEl) this.durationTimeEl.textContent = this.formatTime(this.duration);
      }
    });

    this.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
    });

    this.audio.addEventListener("ended", () => {
      if (!this.isLooping) {
        this.pause();
      }
    });

    this.audio.addEventListener("error", () => {
      console.warn("Chuyển sang nguồn nhạc phụ / Bộ Synth thư giãn...");
      if (this.audio.src !== this.data.backupAudioSrc && this.data.backupAudioSrc) {
        this.audio.src = this.data.backupAudioSrc;
        if (this.isPlaying) this.audio.play().catch(() => this.startAmbientSynth());
      } else {
        this.startAmbientSynth();
      }
    });
  }

  bindEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener("click", () => this.togglePlay());
    }

    if (this.progressContainer) {
      this.progressContainer.addEventListener("click", (e) => {
        const rect = this.progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, clickX / rect.width));
        const seekTime = percent * this.duration;
        this.seek(seekTime);
      });
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener("input", (e) => {
        this.audio.volume = parseFloat(e.target.value);
      });
    }

    if (this.loopBtn) {
      this.loopBtn.addEventListener("click", () => {
        this.isLooping = !this.isLooping;
        this.audio.loop = this.isLooping;
        this.loopBtn.classList.toggle("active", this.isLooping);
        this.showToast(this.isLooping ? "Lặp lại bài hát: Bật" : "Lặp lại bài hát: Tắt");
      });
    }

    if (this.shuffleBtn) {
      this.shuffleBtn.addEventListener("click", () => {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle("active", this.isShuffle);
        this.showToast(this.isShuffle ? "Chế độ phát ngẫu nhiên: Bật" : "Chế độ phát tuần tự");
      });
    }

    if (this.quickPlayNotice) {
      this.quickPlayNotice.addEventListener("click", () => {
        this.play();
        this.quickPlayNotice.style.display = "none";
      });
    }

    // Tự động phát khi người dùng tương tác lần đầu
    const autoPlayOnFirstGesture = () => {
      if (!this.isPlaying) {
        this.play();
        if (this.quickPlayNotice) this.quickPlayNotice.style.display = "none";
      }
      window.removeEventListener("click", autoPlayOnFirstGesture);
      window.removeEventListener("touchstart", autoPlayOnFirstGesture);
    };
    window.addEventListener("click", autoPlayOnFirstGesture, { once: true });
    window.addEventListener("touchstart", autoPlayOnFirstGesture, { once: true });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    if (this.playIcon) {
      this.playIcon.classList.remove("fa-play");
      this.playIcon.classList.add("fa-pause");
    }
    if (this.playBtn) this.playBtn.classList.add("playing");

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("Autoplay bị trình duyệt giữ lại, kích hoạt synth ambient...");
        this.startAmbientSynth();
      });
    }

    if (this.quickPlayNotice) this.quickPlayNotice.style.display = "none";
  }

  pause() {
    this.isPlaying = false;
    if (this.playIcon) {
      this.playIcon.classList.remove("fa-pause");
      this.playIcon.classList.add("fa-play");
    }
    if (this.playBtn) this.playBtn.classList.remove("playing");
    this.audio.pause();
    this.stopAmbientSynth();
  }

  seek(time) {
    this.currentTime = time;
    if (this.audio.duration) {
      this.audio.currentTime = time;
    }
    this.updateProgress();
  }

  updateProgress() {
    const percent = (this.currentTime / this.duration) * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
    if (this.currentTimeEl) {
      this.currentTimeEl.textContent = this.formatTime(this.currentTime);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}.${secs < 10 ? "0" : ""}${secs}`;
  }

  // Web Audio Synth để luôn có âm thanh kỳ ảo thư giãn ngay cả khi offline
  startAmbientSynth() {
    if (this.synthPlaying) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioContext();
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();

      this.synthPlaying = true;
      const notes = [261.63, 329.63, 392.00, 523.25, 587.33, 659.25]; // C E G C D E (Lofi pentatonic chord)
      
      this.synthInterval = setInterval(() => {
        if (!this.isPlaying || !this.synthPlaying) return;
        
        // Cập nhật giả lập thời gian
        this.currentTime += 0.8;
        if (this.currentTime > this.duration) this.currentTime = 0;
        this.updateProgress();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        const freq = notes[Math.floor(Math.random() * notes.length)];
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.3);
      }, 750);
    } catch (e) {
      console.log("Web Audio API not supported", e);
    }
  }

  stopAmbientSynth() {
    this.synthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  initVisualizer() {
    if (!this.visualizerCanvas) return;
    const ctx = this.visualizerCanvas.getContext("2d");
    const numBars = 18;
    const bars = Array.from({ length: numBars }, () => ({
      height: 4,
      targetHeight: 4,
      speed: Math.random() * 0.1 + 0.05
    }));

    const render = () => {
      ctx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
      const width = this.visualizerCanvas.width;
      const height = this.visualizerCanvas.height;
      const barWidth = (width / numBars) - 2;

      let totalEnergy = 0;

      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        if (this.isPlaying) {
          if (Math.abs(b.height - b.targetHeight) < 1) {
            b.targetHeight = Math.random() * (height - 6) + 4;
          }
          b.height += (b.targetHeight - b.height) * 0.2;
        } else {
          b.height += (3 - b.height) * 0.1;
        }

        totalEnergy += b.height;

        const x = i * (barWidth + 2);
        const y = height - b.height;

        // Gradient màu rực rỡ cho thanh sóng
        const grad = ctx.createLinearGradient(0, y, 0, height);
        grad.addColorStop(0, "#ff77aa");
        grad.addColorStop(0.5, "#00f2fe");
        grad.addColorStop(1, "#a777e3");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, b.height, 2);
        ctx.fill();
      }

      // Truyền năng lượng âm thanh cho nền canvas phản hồi
      if (window.forestBg) {
        const intensity = this.isPlaying ? (totalEnergy / (numBars * height)) : 0;
        window.forestBg.setAudioIntensity(intensity);
      }

      requestAnimationFrame(render);
    };

    render();
  }

  showToast(msg) {
    if (window.app && window.app.showToast) {
      window.app.showToast(msg);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.musicPlayer = new MusicPlayer();
});
