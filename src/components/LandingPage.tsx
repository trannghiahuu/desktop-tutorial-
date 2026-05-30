/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Ban, Eye, Ruler, Zap, Play, ChevronRight, HelpCircle, Shield, PhoneCall, X, User, Mail, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onStartTool: () => void;
  scrollTarget: string | null;
  onClearScrollTarget: () => void;
}

export default function LandingPage({ onStartTool, scrollTarget, onClearScrollTarget }: LandingPageProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'solution'>('intro');

  const introRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollTarget) {
      if (scrollTarget === 'giới thiệu') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveTab('intro');
      } else if (scrollTarget === 'giải pháp') {
        solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveTab('solution');
      }
      onClearScrollTarget();
    }
  }, [scrollTarget, onClearScrollTarget]);

  const scrollToSection = (target: 'intro' | 'solution') => {
    setActiveTab(target);
    if (target === 'intro') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'solution') {
      solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Anim variants for subtle entering feel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] flex flex-col items-center selection:bg-brand-primary-light selection:text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b-2 border-[#d5e4f8] w-full sticky top-0 z-50 shadow-xs">
        <div className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('intro')}
              className="flex items-center gap-3 group bg-transparent border-none p-0 cursor-pointer text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#FDE047] text-black flex items-center justify-center font-display font-extrabold text-lg shadow-md group-hover:bg-[#FACC15] group-hover:scale-105 transition-all shrink-0">
                PGP
              </div>
              <div className="font-display text-2xl md:text-3xl font-extrabold text-[#0037b0] tracking-tight hover:text-[#1d4ed8] transition-colors">
                Plane Geometry Practice
              </div>
            </button>
          </div>
          
          <nav aria-label="Main Navigation" className="hidden md:block">
            <ul className="flex items-center gap-1.5 bg-[#edf2f9]/80 border border-[#d5e4f8] rounded-full p-1 shadow-xs">
              <li>
                <a 
                  href="#gioi-thieu"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('intro');
                  }} 
                  className={`block px-4 py-2 rounded-full font-sans text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === 'intro' 
                      ? 'bg-white text-[#0037b0] shadow-xs' 
                      : 'text-[#434655] hover:text-[#0037b0] hover:bg-white/50'
                  }`}
                >
                  Giới thiệu
                </a>
              </li>
              <li>
                <a 
                  href="#giai-phap"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('solution');
                  }} 
                  className={`block px-4 py-2 rounded-full font-sans text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === 'solution' 
                      ? 'bg-white text-[#0037b0] shadow-xs' 
                      : 'text-[#434655] hover:text-[#0037b0] hover:bg-white/50'
                  }`}
                >
                  Giải pháp
                </a>
              </li>
              <li>
                <a 
                  href="#cong-cu"
                  onClick={(e) => {
                    e.preventDefault();
                    onStartTool();
                  }} 
                  className="block px-4 py-2 rounded-full font-sans text-sm md:text-base font-semibold text-[#434655] hover:text-[#0037b0] hover:bg-white/50 transition-all duration-200 cursor-pointer"
                >
                  Công cụ
                </a>
              </li>
              <li>
                <a 
                  href="#huong-dan"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowHelpModal(true);
                  }} 
                  className="block px-4 py-2 rounded-full font-sans text-sm md:text-base font-semibold text-[#434655] hover:text-[#0037b0] hover:bg-white/50 transition-all duration-200 cursor-pointer"
                >
                  Hướng dẫn
                </a>
              </li>
              <li>
                <a 
                  href="#lien-he"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowContactModal(true);
                  }} 
                  className="block px-4 py-2 rounded-full font-sans text-sm md:text-base font-semibold text-[#434655] hover:text-[#0037b0] hover:bg-white/50 transition-all duration-200 cursor-pointer"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </nav>

          <button
            onClick={onStartTool}
            id="btn-nav-start"
            className="bg-[#0037b0] text-white font-semibold text-base py-2.5 px-6 rounded-full hover:bg-brand-primary-light transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            Bắt đầu ngay
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1920px] px-6 md:px-16 py-8 md:py-12 flex flex-col gap-12 flex-grow"
      >
        {/* Hero Section */}
        <motion.section
          ref={introRef}
          variants={itemVariants}
          id="gioi-thieu"
          className="flex flex-col xl:flex-row items-center gap-10 bg-white border-2 border-[#d5e4f8] rounded-2xl p-6 md:p-12 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 opacity-60"></div>
          
          <div className="flex-1 flex flex-col gap-6 items-start">
            <div className="inline-flex items-center gap-2 bg-[#d5e4f8]/50 px-4 py-1.5 rounded-full text-[#0037b0] text-sm font-bold tracking-wide uppercase">
              <Zap className="w-4 h-4 fill-current" /> ĐỘT PHÁ CÔNG NGHỆ DẠY HỌC
            </div>
            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-extrabold text-[#191c1e] leading-tight tracking-tight">
              Đột Phá Trực Quan - <br className="hidden md:block"/>
              <span className="text-[#0037b0]">Tối Ưu Cho Mọi Tiết Dạy Hình Học</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-[#434655] leading-relaxed max-w-2xl">
              Công cụ thực hành hình học phẳng chuyên nghiệp, hiển thị hoàn hảo trên màn hình Tivi hình ảnh sắc nét, 
              giúp giáo viên tỏa sáng trong các tiết thao giảng, hội giảng và dạy học hằng ngày.
            </p>
            
            <div className="pt-4 w-full md:w-auto">
              <button
                onClick={onStartTool}
                id="btn-hero-launch"
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#0037b0] text-white font-bold text-lg md:text-xl py-4 px-8 rounded-full hover:bg-brand-primary-light focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg group active:scale-98"
              >
                <Play className="w-5 h-5 fill-current group-hover:translate-x-0.5 transition-transform" />
                Mở Công Cụ Trình Chiếu Ngay
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center items-center w-full">
            <div className="relative group max-w-full">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-15 group-hover:opacity-25 transition duration-1000"></div>
              <img
                alt="Giáo viên sử dụng công cụ hình học trên màn hình TV lớn trong lớp học."
                className="relative rounded-2xl shadow-lg border border-[#d5e4f8] max-w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZSHJmIHZxByGlJu1OFVT2z5znp7HQhB0_xXKhOjZLMjUWejm5Wc_-txHEvyeddNnzo5m7IyW3L7CPCzDPRaJrbSHtuWTREIAtipXFL2trk8AcDhHzs29QC8rUgCziJTTwKwetMfu0y-EenGK4DnzWH12XKz6TCGtT97Tdcc11EukbJc-N-iKhDPO9qClbIBLbiayUBgU46hUOI42jB-VWcFD2OobiCd4Hcg3Uj-WH5JIn2gnRXkFrYWihUpv-7I7sETyV7XdVcA"
              />
            </div>
          </div>
        </motion.section>

        {/* Teacher Solution Section */}
        <motion.section
          ref={solutionRef}
          variants={itemVariants}
          id="giai-phap"
          className="scroll-mt-24 flex flex-col gap-8 bg-[#f3f4f6] rounded-2xl p-6 md:p-12 border-2 border-[#c4c5d7]"
        >
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-[#0037b0] tracking-tight">
              Giải Pháp Thay Thế Hoàn Hảo Cho Dụng Cụ Truyền Thống
            </h2>
            <div className="w-20 h-1 bg-[#0037b0] mx-auto rounded-full"></div>
            <p className="font-sans text-base md:text-lg text-[#434655] mt-2">
              Chào tạm biệt những dụng cụ cồng kềnh, độ chính xác thấp và dễ gây mỏi mệt khi vẽ bảng truyền thống.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="bg-white p-8 rounded-2xl border-2 border-[#d5e4f8] flex flex-col items-center text-center gap-4 hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Ban className="w-10 h-10" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-[#191c1e]">
                Tạm Biệt Dụng Cụ Cồng Kềnh
              </h3>
              <p className="font-sans text-base md:text-lg text-[#434655] leading-relaxed max-w-md">
                Là mảnh ghép hoàn hảo song hành cùng dụng cụ truyền thống trên lớp, tối ưu khi giảng dạy trên máy hoặc dạy học online. Mọi thao tác minh họa trực quan sinh động ngay trên màn hình tương tác hay chuột máy tính.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border-2 border-[#d5e4f8] flex flex-col items-center text-center gap-4 hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#0037b0]">
                <Eye className="w-10 h-10" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-[#191c1e]">
                Hiển Thị Siêu Nét Từ Mọi Góc Nhìn
              </h3>
              <p className="font-sans text-base md:text-lg text-[#434655] leading-relaxed max-w-md">
                Đường nét dầy dặn, tương phản cao trên bảng đen hoặc bảng trắng ảo. Học sinh ngồi góc chếch hay dưới bàn cuối vẫn theo dõi rõ ràng từng bước dựng hình của giáo viên.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Features Section (Bento Grid) */}
        <motion.section variants={itemVariants} className="flex flex-col gap-8">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-[#0037b0] tracking-tight">
              Tính Năng Chuyên Nghiệp Dành Riêng Cho Màn Hình Lớn
            </h2>
            <div className="w-20 h-1 bg-[#0037b0] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Feature 1 - Toolset */}
            <div className="xl:col-span-2 bg-white border-2 border-[#d5e4f8] rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0037b0]">
                  <Ruler className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[#191c1e]">
                  Bộ Dụng Cụ Đo Lường Chính Xác
                </h3>
              </div>
              <p className="font-sans text-base md:text-lg text-[#434655] leading-relaxed">
                Tích hợp đầy đủ Thước thẳng chia vạch, Thước đo độ bám sát nét căn góc, Eke vuông 45-60 độ và Compa vẽ đường tròn linh hoạt. 
                Từng công cụ được thiết kế to rõ, tối ưu độ tương phản màu sắc để hiển thị nổi bật trên màn hình trình chiếu lớp học (Smart TV / Projector).
              </p>
              
              <div className="flex flex-wrap gap-2.5 mt-auto">
                <span className="bg-[#e1e0ff] text-[#07006c] font-semibold text-sm md:text-base py-1.5 px-4 rounded-full">
                  Thước thẳng xoay 360°
                </span>
                <span className="bg-[#e1e0ff] text-[#07006c] font-semibold text-sm md:text-base py-1.5 px-4 rounded-full">
                  Compa vẽ tròn chuẩn tâm
                </span>
                <span className="bg-[#e1e0ff] text-[#07006c] font-semibold text-sm md:text-base py-1.5 px-4 rounded-full">
                  Ê ke đo, vẽ góc vuông chính xác
                </span>
                <span className="bg-[#e1e0ff] text-[#07006c] font-semibold text-sm md:text-base py-1.5 px-4 rounded-full">
                  Thước đo độ chi tiết
                </span>
              </div>
            </div>
            
            {/* Feature 2 - Zero latency */}
            <div className="xl:col-span-1 bg-[#0037b0] text-white border-2 border-brand-primary-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 justify-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                <Zap className="w-6 h-6 fill-current text-[#FDE047]" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold">
                Tương Tác Mượt Mà, Không Độ Trễ
              </h3>
              <p className="font-sans text-base md:text-lg opacity-90 leading-relaxed">
                Được lập trình dựa trên HTML5 Canvas hiệu năng cao. Đảm bảo mọi thao tác kéo thả thước, giữ compa, xoay góc 
                hoặc vẽ vết mượt mịn, không giật lag nhằm duy trì nhịp độ giảng dạy hoàn hảo cho thầy cô.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>

      {/* Footer */}
      <footer className="bg-[#edeef0] dark:bg-zinc-900 w-full px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center border-t-2 border-[#c4c5d7] gap-4 z-15">
        <button 
          id="footer-logo"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-xl font-bold text-[#0037b0] hover:underline bg-transparent border-none p-0 cursor-pointer text-left"
        >
          Plane Geometry Practice
        </button>
        
        <div className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 text-center">
          © 2026 Plane Geometry Practice. Đột phá trực quan cho giáo dục hình hình học phẳng.
        </div>
        
        <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
          <button 
            onClick={() => setShowHelpModal(true)}
            className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 hover:underline hover:text-[#0037b0] bg-transparent border-none p-0 cursor-pointer"
          >
            Hướng dẫn sử dụng
          </button>
          <button 
            onClick={() => {
              alert("Điều khoản dịch vụ: Plane Geometry Practice là công cụ học tập phi thương mại, phát triển nhằm phục vụ cộng đồng giáo viên và học sinh Việt Nam.");
            }}
            className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 hover:underline hover:text-[#0037b0] bg-transparent border-none p-0 cursor-pointer"
          >
            Điều khoản dịch vụ
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 hover:underline hover:text-[#0037b0] bg-transparent border-none p-0 cursor-pointer"
          >
            Liên hệ hỗ trợ
          </button>
        </div>
      </footer>

      {/* Modern Interactive User Guide Overlay */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="bg-[#0037b0] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#FDE047]" />
                  Hướng dẫn sử dụng Plane Geometry Practice
                </h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/15 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-[#434655] font-sans sm:text-sm text-xs leading-relaxed">
                <div>
                  <h4 className="font-extrabold text-slate-800 border-b pb-1.5 flex items-center gap-2 text-base">
                    <span>1. Nhóm thao tác cơ bản</span>
                  </h4>
                  <ul className="mt-3.5 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0037b0] shrink-0">↖️ Di chuyển:</span>
                      <span>Kéo di chuyển thước/compa, chữ viết và hình ảnh. (Điểm, đường thẳng, đường tròn đã vẽ sẽ được khóa cố định).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0037b0] shrink-0">🔄 Rotate (Quay):</span>
                      <span>Chọn chế độ này rồi bấm giữ vào dụng cụ để xoay Thước, Thước đo góc, Eke và Compa.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0037b0] shrink-0">✋ Pan:</span>
                      <span>Dùng bàn tay để kéo cuộn không gian bảng vẽ.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0037b0] shrink-0">🔍+ / 🔍-:</span>
                      <span>Phóng to và thu nhỏ toàn bộ bảng vẽ linh hoạt.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 border-b pb-1.5 flex items-center gap-2 text-base">
                    <span>2. Nhóm dụng cụ Hình học</span>
                  </h4>
                  <ul className="mt-3.5 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#ea580c] shrink-0">📏 Ruler:</span>
                      <span>Bật/tắt Thước thẳng đo khoảng cách.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#ea580c] shrink-0">◗ Protractor:</span>
                      <span>Bật/tắt Thước đo góc. Mở rộng bán kính hiển thị bằng nút kéo giãn song song <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">↔️</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#ea580c] shrink-0">📐 Eke:</span>
                      <span>Bật/tắt Thước vuông eke đo góc tù, vuông hoặc nhon.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#ea580c] shrink-0">⭕ Compass:</span>
                      <span>Bật/tắt Compa ảo vẽ cung tròn. Kéo <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">↔️</span> để mở rộng bán kính. Kéo <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">🔃</span> để lật đảo chiều hướng. Bấm chọn biểu tượng quay <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">🔄</span> để tự động tạo nét vẽ.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 border-b pb-1.5 flex items-center gap-2 text-base">
                    <span>3. Nhóm vẽ, viết & chỉnh sửa</span>
                  </h4>
                  <ul className="mt-3.5 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0d9488] shrink-0">✏️ Pen:</span>
                      <span>Hỗ trợ 3 chế độ vẽ chuyên dụng: Chấm điểm, Kẻ đoạn thẳng liên kết và Vẽ tự do theo ý thích.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0d9488] shrink-0">Aa Text:</span>
                      <span>Nhấp chọn vị trí trống bất kỳ trên bảng ảo để gõ văn bản, chữ cái đặt tiêu đề hoặc ghi chú lời giải.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0d9488] shrink-0">📋 Paste:</span>
                      <span>Dán ảnh đề bài / hình mẫu vào bảng trực tiếp (Nền trắng của bức ảnh sẽ được thuật toán tự động lọc trong suốt hoàn hảo). Ảnh được ưu tiên sắp xếp nằm ở lớp dưới cùng tránh đè đường nét vẽ.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#0d9488] shrink-0">🧽 Eraser:</span>
                      <span>Công cụ tẩy dùng để chọn và xóa các đối tượng hình vẽ không cần thiết khỏi bảng.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t flex justify-end">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="bg-[#0037b0] text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Contact Modal Overlay */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#0037b0] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-[#FDE047]" />
                  Thông tin tác giả
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/15 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-slate-700 font-sans select-text">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0037b0] flex items-center justify-center font-display text-2xl font-black shadow-inner">
                    TN
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg">Trần Hữu Nghĩa</h4>
                    <p className="text-xs text-slate-500">Giáo viên Toán hình học</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-sm">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Trường công tác:</p>
                      <p className="text-slate-600">Trường THCS Cầu Kè - Tỉnh Vĩnh Long</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" id="mail-icon-home" />
                    <div>
                      <p className="font-bold text-slate-800">Email:</p>
                      <p className="text-slate-600 hover:underline">trannghiahuu@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <PhoneCall className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Điện thoại liên hệ:</p>
                      <p className="text-slate-600 font-mono">0799998122</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t flex justify-end">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="bg-[#0037b0] text-white font-bold py-2 @lg:py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
