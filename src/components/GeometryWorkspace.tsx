/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, PhoneCall, Globe, X, User, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeometryWorkspaceProps {
  onBackToHome: (section?: string) => void;
}

export default function GeometryWorkspace({ onBackToHome }: GeometryWorkspaceProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#f8f9fb] text-[#191c1e] flex flex-col items-stretch overflow-hidden select-none">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b-2 border-[#d5e4f8] w-full sticky top-0 z-50 shadow-xs shrink-0">
        <div className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onBackToHome('giới thiệu')}
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
                    onBackToHome('giới thiệu');
                  }} 
                  className="block px-4 py-2 rounded-full font-sans text-sm md:text-base font-semibold text-[#434655] hover:text-[#0037b0] hover:bg-white/50 transition-all duration-200 cursor-pointer"
                >
                  Giới thiệu
                </a>
              </li>
              <li>
                <a 
                  href="#giai-phap"
                  onClick={(e) => {
                    e.preventDefault();
                    onBackToHome('giải pháp');
                  }} 
                  className="block px-4 py-2 rounded-full font-sans text-sm md:text-base font-semibold text-[#434655] hover:text-[#0037b0] hover:bg-white/50 transition-all duration-200 cursor-pointer"
                >
                  Giải pháp
                </a>
              </li>
              <li>
                <span className="block px-4 py-2 rounded-full font-sans text-sm md:text-base font-bold bg-white text-[#0037b0] shadow-xs cursor-default">
                  Công cụ
                </span>
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

          {/* Invisible spacer to maintain perfectly centered layout for middle nav items */}
          <div className="w-[140px] hidden md:block"></div>
        </div>
      </nav>

      {/* Embedded 100% Interactive Live Tool Workspace */}
      <div className="flex-grow w-full h-full relative bg-white overflow-hidden">
        <iframe
          src="https://thnghia.cc/pgp"
          title="Plane Geometry Practice Live Workspace Tool"
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>

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
                    <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" id="mail-icon" />
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
