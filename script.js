document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio Loaded Successfully");

    // === 이메일 클립보드 복사 기능 ===
    const copyBtns = document.querySelectorAll('.btn-copy-email');
    const toast = document.getElementById('copy-toast');
    let toastTimeout;

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'yde8359@naver.com';

            try {
                await navigator.clipboard.writeText(email);

                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-check text-emerald-500 text-sm';
                    setTimeout(() => {
                        icon.className = 'fa-regular fa-copy text-sm';
                    }, 1500);
                }

                if (toast) {
                    clearTimeout(toastTimeout);
                    toast.classList.remove('opacity-0', 'pointer-events-none');
                    toast.classList.add('opacity-100');

                    toastTimeout = setTimeout(() => {
                        toast.classList.remove('opacity-100');
                        toast.classList.add('opacity-0', 'pointer-events-none');
                    }, 2000);
                }
            } catch (err) {
                console.error('클립보드 복사 실패:', err);
            }
        });
    });

    // === 커스텀 마우스 커서 ===
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, [role="button"], input, textarea')) {
            cursor.classList.add('hovered');
        } else {
            cursor.classList.remove('hovered');
        }
    });

    // 앵커 링크 부드러운 스크롤
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // === 캐러셀 & 모달 라이트박스 제어 ===
    const track = document.getElementById('process-carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModalBtn = document.getElementById('close-modal');
    const modalPrevBtn = document.getElementById('modal-prev');
    const modalNextBtn = document.getElementById('modal-next');

    if (track && items.length > 0) {
        let currentIndex = 0;
        let modalCurrentIndex = 0;
        const totalSlides = items.length;
        let slideInterval;

        const imageSources = Array.from(items).map(item => item.getAttribute('data-img') || item.querySelector('img').src);

        items.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `h-2.5 rounded-full transition-all ${idx === 0 ? 'bg-brand-yellow w-6' : 'bg-slate-300 w-2.5 hover:bg-slate-400'}`;
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetTimer();
            });
            indicatorsContainer.appendChild(dot);
        });

        const dots = indicatorsContainer.querySelectorAll('button');

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.className = 'w-6 h-2.5 rounded-full bg-brand-yellow transition-all';
                } else {
                    dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-all';
                }
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex >= totalSlides) currentIndex = 0;
            if (currentIndex < 0) currentIndex = totalSlides - 1;
            updateCarousel();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, 4000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetTimer();
            });
        }

        function updateModalImage(index) {
            modalCurrentIndex = index;
            if (modalCurrentIndex >= totalSlides) modalCurrentIndex = 0;
            if (modalCurrentIndex < 0) modalCurrentIndex = totalSlides - 1;

            if (modalImg) {
                modalImg.src = imageSources[modalCurrentIndex];
            }
        }

        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (modal && modalImg) {
                    updateModalImage(index);
                    modal.classList.remove('hidden');
                    setTimeout(() => {
                        modal.classList.remove('opacity-0');
                        modal.classList.add('flex', 'opacity-100');
                    }, 10);
                }
            });
        });

        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateModalImage(modalCurrentIndex - 1);
            });
        }

        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateModalImage(modalCurrentIndex + 1);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (modal && !modal.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') updateModalImage(modalCurrentIndex - 1);
                if (e.key === 'ArrowRight') updateModalImage(modalCurrentIndex + 1);
                if (e.key === 'Escape') closeModal();
            }
        });

        function closeModal() {
            if (modal) {
                modal.classList.remove('opacity-100');
                modal.classList.add('opacity-0');
                setTimeout(() => {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                }, 300);
            }
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        if (track.parentElement) {
            track.parentElement.addEventListener('mouseenter', () => clearInterval(slideInterval));
            track.parentElement.addEventListener('mouseleave', () => startTimer());
        }

        startTimer();
    }

    // === AI 챗봇 연동 기능 (안정화 및 URL 수정 적용) ===
    const GEMINI_API_KEY = 'AQ.Ab8RN6Km5LRoYfG0h7leaY6oDtZ8wTm8-MOlyey7RK0YJ-hUjg';

    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggleBtn && chatbotWindow) {
        // 챗봇 창 열기/닫기 토글
        chatbotToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow.classList.toggle('hidden');
            chatbotWindow.classList.toggle('flex');
        });

        if (chatbotCloseBtn) {
            chatbotCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chatbotWindow.classList.add('hidden');
                chatbotWindow.classList.remove('flex');
            });
        }

        // 메시지 화면 출력 함수
        function appendMessage(text, isUser = false) {
            if (!chatbotMessages) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = isUser
                ? 'bg-brand-blue text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto shadow-sm leading-relaxed break-words'
                : 'bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 max-w-[85%] shadow-sm leading-relaxed text-slate-800 break-words';
            msgDiv.innerText = text;
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        // Gemini API 호출 함수 (올바른 v1beta 엔드포인트 및 gemini-1.5-flash 지원 모델 적용)
        async function fetchGeminiResponse(userPrompt) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            
            const fullPrompt = `
[역할 지정]
당신은 기획자 '이다은'의 포트폴리오 안내 AI 도우미입니다. 아래 정보를 바탕으로 방문자의 질문에 친절하고 정중하게 답변하세요.

[이력 및 정보]
- 이름: 이다은
- 경력: 인터파크 커머스 기획팀 (2021.06 ~ 2023.06) / 컴투스 웹기획팀 (2023.07 ~ 재직 중)
- 학력: 연세대학교 (컴퓨터공학, 생활디자인)

[프로젝트 1: 글로벌 웹 상점 구축]
- 성과: 상점 세팅 공수 80% 감소(4주->3일), 전체 매출 대비 웹 매출 비중 5% 증가, 1인당 평균 결제액 15% 증가, 결제 진입 후 이탈률 8% 감소
- 주요내용: 백오피스 구축, 쿠폰/포인트 시스템 사내 최초 구축, 16개 언어 대상 글로벌 이커머스 최적화

[프로젝트 2: 자체 커뮤니티 플랫폼 구축]
- 성과: 브랜드 사이트 리텐션 60% 방어, 외부 솔루션 구독 비용 100% 절감, 차기 구축 개발 공수 약 4개월 단축
- 주요내용: 4개 게시판 템플릿 제공, 어뷰징 관리 백오피스 분리, 마이페이지 활동 내역 제공

[사용자 질문]
${userPrompt}
`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Gemini API Detail Error:", data);
                throw new Error(data.error?.message || `HTTP ${response.status} 오류`);
            }

            return data.candidates[0].content.parts[0].text;
        }

        // 폼 제출 이벤트 핸들러
        if (chatbotForm) {
            chatbotForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userText = chatbotInput.value.trim();
                if (!userText) return;

                appendMessage(userText, true);
                chatbotInput.value = '';

                // 로딩 안내
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 max-w-[85%] shadow-sm text-slate-400 italic';
                loadingDiv.innerText = '답변 작성 중...';
                chatbotMessages.appendChild(loadingDiv);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                try {
                    const aiReply = await fetchGeminiResponse(userText);
                    chatbotMessages.removeChild(loadingDiv);
                    appendMessage(aiReply, false);
                } catch (error) {
                    console.error('Chatbot Call Error:', error);
                    chatbotMessages.removeChild(loadingDiv);
                    appendMessage(`오류 발생: ${error.message}`, false);
                }
            });
        }
    }
});