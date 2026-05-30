/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Ban, Eye, Ruler, Zap, Play, ChevronRight, HelpCircle, Shield, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStartTool: () => void;
}

export default function LandingPage({ onStartTool }: LandingPageProps) {
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
            <a href="https://thnghia.cc/pgp" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#FDE047] text-black flex items-center justify-center font-display font-extrabold text-lg shadow-md group-hover:bg-[#FACC15] group-hover:scale-105 transition-all">
                PGP
              </div>
              <div className="font-display text-2xl md:text-3xl font-extrabold text-[#0037b0] tracking-tight hover:text-[#1d4ed8] transition-colors">
                Plane Geometry Practice
              </div>
            </a>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-[#0037b0] border-[#0037b0] border-b-3 font-bold pb-1 font-sans text-base transition-colors" href="#">
              Giới thiệu
            </a>
            <button onClick={onStartTool} className="text-[#434655] font-medium pb-1 font-sans text-base hover:text-[#0037b0] transition-colors">
              Giải pháp
            </button>
            <button onClick={onStartTool} className="text-[#434655] font-medium pb-1 font-sans text-base hover:text-[#0037b0] transition-colors">
              Công cụ
            </button>
            <a className="text-[#434655] font-medium pb-1 font-sans text-base hover:text-[#0037b0] transition-colors" href="#help">
              Hướng dẫn
            </a>
            <a className="text-[#434655] font-medium pb-1 font-sans text-base hover:text-[#0037b0] transition-colors" href="#contact">
              Liên hệ
            </a>
          </div>

          <button
            onClick={onStartTool}
            id="btn-nav-start"
            className="bg-[#0037b0] text-white font-semibold text-base py-2.5 px-6 rounded-full hover:bg-brand-primary-light transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
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
          variants={itemVariants}
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
          variants={itemVariants}
          className="flex flex-col gap-8 bg-[#f3f4f6] rounded-2xl p-6 md:p-12 border-2 border-[#c4c5d7]"
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
                Loại bỏ hoàn toàn thước gỗ, eke, compa khổng lồ thường hay rơi vỡ. Mọi thao tác vẽ hình giờ đây gọn gàng ngay trên màn hình cảm ứng hoặc chuột máy tính.
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
                  Eke vuông cân và góc nhọn
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
        <a id="footer-logo" href="https://thnghia.cc/pgp" target="_blank" rel="noreferrer" className="font-display text-xl font-bold text-[#0037b0] hover:underline">
          Plane Geometry Practice
        </a>
        
        <div className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 text-center">
          © 2026 Plane Geometry Practice Tool. Đột phá trực quan cho giáo dục hình học.
        </div>
        
        <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
          <a className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 hover:underline hover:text-[#0037b0]" href="#help">
            Hướng dẫn sử dụng
          </a>
          <a className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 hover:underline hover:text-[#0037b0]" href="#terms">
            Điều khoản dịch vụ
          </a>
          <a className="font-sans text-sm md:text-base text-[#434655] dark:text-gray-300 hover:underline hover:text-[#0037b0]" href="#support">
            Liên hệ hỗ trợ
          </a>
        </div>
      </footer>
    </div>
  );
}
