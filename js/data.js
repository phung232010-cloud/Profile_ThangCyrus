/**
 * DATA CONFIGURATION - PORTFOLIO BIO LINK
 * Cấu hình thông tin cá nhân, ngân hàng, mạng xã hội, video nền và bài hát YouTube.
 */
window.PORTFOLIO_DATA = {
  // Thông tin cá nhân
  profile: {
    name: "Nguyễn Minh Thắng",
    roles: [
      "Developer",
      "Freelancer",
      "Yêu thích công nghệ và sáng tạo ✨",
      "UI/UX Enthusiast",
      "Lập Trình Viên Web"
    ],
    bio: "Developer | Freelancer | Yêu thích công nghệ và sáng tạo.",
    statusText: "Đang sẵn sàng nhận dự án mới",
    location: "Việt Nam",
    avatar: "assets/avatar.jpg",
    avatarBackup: "assets/avatar_original.jpg",
    verifiedBadge: true
  },

  // Video nền TikTok & Hiệu ứng chuyển động
  background: {
    videoSrc: "assets/video/bg_video.mp4",
    tiktokUrl: "https://www.tiktok.com/@music.hay1230/video/7573555196656176391",
    enableParticlesOverlay: true
  },

  // Mạng xã hội
  socials: [
    {
      id: "facebook",
      name: "Facebook",
      icon: "fa-brands fa-facebook-f",
      url: "https://www.facebook.com/minh.thang.929172",
      color: "#1877F2",
      tooltip: "Ghé thăm trang Facebook"
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "fa-brands fa-tiktok",
      url: "https://www.tiktok.com/@thangminh02032010?is_from_webapp=1&sender_device=pc",
      color: "#ff0050",
      tooltip: "Kênh TikTok @music.hay1230"
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "fa-brands fa-youtube",
      url: "https://www.youtube.com/@H%C3%B9ngPh%E1%BA%A1m-g6p",
      color: "#FF0000",
      tooltip: "Nghe bài hát trên YouTube"
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: "fa-brands fa-telegram",
      url: "https://t.me/thangminh2",
      color: "#229ED9",
      tooltip: "Nhắn tin Telegram"
    },
    {
      id: "github",
      name: "GitHub",
      icon: "fa-brands fa-github",
      url: "https://github.com/phung232010-cloud",
      color: "#00f2fe",
      tooltip: "Kho mã nguồn GitHub"
    },
    {
      id: "zalo",
      name: "Zalo",
      icon: "fa-solid fa-comment-dots",
      url: "https://zalo.me/0919095172",
      color: "#0068FF",
      tooltip: "Chat Zalo: 0919095172"
    }
  ],

  // Bài hát chính xác từ YouTube (https://youtu.be/IrEu11r-pHE)
  music: {
    title: "Lạc Vào Khu Rừng Hoa",
    subtitle: "Nắng Ấm Trong Tim (Lofi Ver) • Duong x CryzT",
    youtubeUrl: "https://youtu.be/IrEu11r-pHE",
    audioSrc: "assets/audio/lac_vao_khu_rung_hoa.webm",
    backupAudioSrc: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    lyricsSample: "Lạc vào khu rừng hoa... khu rừng ngập mùi hương người ta... ✨",
    durationDefault: 198 // 3:18
  },

  // Tài khoản ngân hàng & Thanh toán 1 chạm
  banking: [
    {
      id: "mbbank",
      bankName: "MB BANK",
      bankFullName: "Ngân hàng TMCP Quân Đội",
      accountNumber: "0919095172",
      accountName: "NGUYEN MINH THANG",
      bin: "970422",
      icon: "fa-solid fa-building-columns",
      badgeColor: "#1A56DB",
      qrTemplate: "compact2"
    },
    {
      id: "momo",
      bankName: "Ví MOMO",
      bankFullName: "Ví điện tử MoMo Pay",
      accountNumber: "0919095172",
      accountName: "NGUYEN MINH THANG",
      icon: "fa-solid fa-wallet",
      badgeColor: "#A50064",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=2|99|0919095172|||0|0|0|"
    },
    {
      id: "phone",
      bankName: "SỐ ĐIỆN THOẠI / ZALO",
      bankFullName: "Liên hệ trực tiếp hoặc Zalo",
      accountNumber: "0919095172",
      accountName: "Minh Thắng (Call / SMS)",
      icon: "fa-solid fa-phone-volume",
      badgeColor: "#10B981",
      actionUrl: "tel:0919095172"
    }
  ],

  // 5 Themes màu sắc
  themes: [
    {
      id: "magic-forest",
      name: "Rừng Hoa Kỳ Ảo 🌸",
      primary: "#ff77aa",
      secondary: "#00f2fe",
      accent: "#a777e3",
      cardBg: "rgba(15, 20, 38, 0.72)",
      cardBorder: "rgba(255, 119, 170, 0.4)",
      textColor: "#ffffff",
      glowColor: "rgba(255, 119, 170, 0.45)"
    },
    {
      id: "cyber-neon",
      name: "Cyberpunk Neon ⚡",
      primary: "#00ffcc",
      secondary: "#ff007f",
      accent: "#7928ca",
      cardBg: "rgba(10, 15, 30, 0.8)",
      cardBorder: "rgba(0, 255, 204, 0.35)",
      textColor: "#ffffff",
      glowColor: "rgba(0, 255, 204, 0.4)"
    },
    {
      id: "aurora-dream",
      name: "Cực Quang Tím Hồng 🌌",
      primary: "#d946ef",
      secondary: "#6366f1",
      accent: "#38bdf8",
      cardBg: "rgba(24, 18, 48, 0.75)",
      cardBorder: "rgba(217, 70, 239, 0.35)",
      textColor: "#ffffff",
      glowColor: "rgba(217, 70, 239, 0.4)"
    },
    {
      id: "sunset-gold",
      name: "Hoàng Hôn Ánh Vàng 🌅",
      primary: "#f59e0b",
      secondary: "#ef4444",
      accent: "#ec4899",
      cardBg: "rgba(35, 20, 25, 0.75)",
      cardBorder: "rgba(245, 158, 11, 0.35)",
      textColor: "#ffffff",
      glowColor: "rgba(245, 158, 11, 0.4)"
    },
    {
      id: "soft-neumorphic",
      name: "Sáng Tinh Khôi 🕊️",
      primary: "#4f46e5",
      secondary: "#06b6d4",
      accent: "#8b5cf6",
      cardBg: "rgba(240, 245, 255, 0.82)",
      cardBorder: "rgba(255, 255, 255, 0.9)",
      textColor: "#1e293b",
      glowColor: "rgba(79, 70, 229, 0.25)"
    },
    {
      id: "transparent-glass",
      name: "Chế Độ Trong Suốt 🪟",
      primary: "#38bdf8",
      secondary: "#ec4899",
      accent: "#a855f7",
      cardBg: "transparent",
      cardBorder: "rgba(255, 255, 255, 0.25)",
      textColor: "#ffffff",
      glowColor: "rgba(56, 189, 248, 0.4)"
    }
  ]
};
