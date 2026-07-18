// ==========================================================================
// 📑 1. 탭 메뉴 활성화 및 데이터 카운팅 애니메이션 트리거
// ==========================================================================
function openTab(evt, tabName) {
    let i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
        tabcontent[i].classList.remove("fade-in");
        tabcontent[i].style.display = "none";
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }
    const targetTab = document.getElementById(tabName);
    targetTab.style.display = "block";
    setTimeout(() => {
        targetTab.classList.add("fade-in");
        triggerCountUp(targetTab);
    }, 20);
    evt.currentTarget.classList.add("active");
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// ==========================================================================
// 🌓 2. 인터랙션: 다크/라이트 테마 원자적 전환 로직
// ==========================================================================
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById("theme-icon");
    const currentTheme = body.getAttribute("data-theme");

    if (!themeIcon) return;

    themeIcon.classList.add("slide-out");

    setTimeout(() => {
        if (currentTheme === "dark") {
            body.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeIcon.src = "images/light.png";
        } else {
            body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeIcon.src = "images/dark.png";
        }

        themeIcon.classList.remove("slide-out");
        themeIcon.classList.add("slide-prepare");

        setTimeout(() => {
            themeIcon.classList.remove("slide-prepare");
        }, 20);

    }, 200);
}

// ==========================================================================
// 📈 3. 인터랙션: 수치 카운트업 타이머 연산 엔진
// ==========================================================================
function triggerCountUp(scope) {
    const counters = scope.querySelectorAll('.count-up');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        
        counter.innerText = "0"; 
        let count = 0;
        const speed = target / 25;

        const updateCount = () => {
            count += speed;
            if (count < target) {
                counter.innerText = Math.floor(count);
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// ==========================================================================
// 🚀 전체 생태계 DOM 빌드 시동 제어
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const themeIcon = document.getElementById("theme-icon");

    if (savedTheme === "dark") {
        document.body.setAttribute("data-theme", "dark");
        if (themeIcon) themeIcon.src = "images/dark.png";
    } else {
        document.body.removeAttribute("data-theme");
        if (themeIcon) themeIcon.src = "images/light.png";
    }

    const defaultTab = document.getElementById("web-shop");
    if(defaultTab) {
        setTimeout(() => { 
            defaultTab.classList.add("fade-in"); 
            triggerCountUp(defaultTab); 
        }, 50);
    }
    
    initSliders();
    initCustomCursor();
});

// ==========================================================================
// 🎯 4. 인터랙션: 기획자 시선 트래킹
// ==========================================================================
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const clickables = document.querySelectorAll('a, button, .slider-dot, .slider-slide img, .ai-quick-replies button');
    clickables.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
            cursor.style.backgroundColor = 'rgba(24, 101, 164, 0.08)';
        });
        elem.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// ==========================================================================
// 🖼️ 5. 이미지 슬라이더 코어 프로세스
// ==========================================================================
function initSliders() {
    const containers = document.querySelectorAll('.slider-container');
    
    containers.forEach(container => {
        const wrapper = container.querySelector('.slider-wrapper');
        if (!wrapper) return;
        
        if (!container.querySelector('.slider-container-inner')) {
            const innerDiv = document.createElement('div');
            innerDiv.classList.add('slider-container-inner');
            container.insertBefore(innerDiv, wrapper);
            innerDiv.appendChild(wrapper);
        }

        const slides = container.querySelectorAll('.slider-slide');
        const pagination = container.querySelector('.slider-pagination');
        const caption = container.querySelector('.slider-caption');
        if (slides.length === 0) return;
        
        let currentIndex = 0;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationId = 0;
        let autoFlipTimer = null;

        if (slides.length === 1) {
            if (pagination) pagination.style.display = 'none';
            if (caption) caption.style.display = 'none'; 
            container.style.cursor = 'default';
            updateManualCaption(0);
            return; 
        }

        if (pagination) pagination.style.display = 'flex';
        if (caption) caption.style.display = 'block';
        container.style.cursor = 'grab';

        pagination.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoFlip();
            });
            pagination.appendChild(dot);
        });
        
        const dots = pagination.querySelectorAll('.slider-dot');
        updateManualCaption(0);
        
        container.addEventListener('mousedown', dragStart);
        container.addEventListener('mouseup', dragEnd);
        container.addEventListener('mousemove', dragMove);
        container.addEventListener('mouseleave', dragEnd);
        
        container.addEventListener('touchstart', dragStart, {passive: true});
        container.addEventListener('touchend', dragEnd);
        container.addEventListener('touchmove', dragMove, {passive: true});
        
        startAutoFlip();
        
        function dragStart(e) {
            resetAutoFlip();
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            animationId = requestAnimationFrame(animation);
        }
        
        function dragMove(e) {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            currentTranslate = prevTranslate + (currentX - startX);
        }
        
        function dragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationId);
            
            const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
            const moveX = endX - startX;
            
            if (moveX < -50 && currentIndex < slides.length - 1) currentIndex += 1;
            if (moveX > 50 && currentIndex > 0) currentIndex -= 1;
            
            goToSlide(currentIndex);
            startAutoFlip();
        }
        
        function animation() {
            wrapper.style.transform = `translateX(${currentTranslate}px)`;
            if (isDragging) requestAnimationFrame(animation);
        }
        
        function goToSlide(index) {
            currentIndex = index;
            const innerWrapper = container.querySelector('.slider-container-inner');
            currentTranslate = currentIndex * -innerWrapper.offsetWidth;
            prevTranslate = currentTranslate;
            wrapper.style.transform = `translateX(${currentTranslate}px)`;
            
            dots.forEach(d => d.classList.remove('active'));
            if(dots[currentIndex]) dots[currentIndex].classList.add('active');
            
            updateManualCaption(currentIndex);
        }

        function updateManualCaption(index) {
            if (!caption) return;
            const currentSlide = slides[index];
            if (currentSlide) {
                const img = currentSlide.querySelector('img');
                const altText = img ? img.getAttribute('alt') : '';
                caption.textContent = altText;
            }
        }
        
        function startAutoFlip() {
            autoFlipTimer = setInterval(() => {
                if (currentIndex < slides.length - 1) currentIndex++;
                else currentIndex = 0;
                goToSlide(currentIndex);
            }, 3000);
        }
        
        function resetAutoFlip() { clearInterval(autoFlipTimer); }
    });
}

// ==========================================================================
// 🤖 6. AI 챗봇 컴포넌트 핵심 비즈니스 로직
// ==========================================================================
function toggleChatWindow() {
    const chatWindow = document.getElementById('aiChatWindow');
    chatWindow.classList.toggle('active');
}

function sendQuickReply(text) {
    document.getElementById('aiInput').value = text;
    sendChatMessage();
}

async function sendChatMessage() {
    const inputEl = document.getElementById('aiInput');
    const chatBody = document.getElementById('chatBody');
    const userText = inputEl.value.trim();
    
    if (!userText) return;

    // 유저 버블 생성
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerText = userText;
    chatBody.appendChild(userBubble);
    inputEl.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // AI 로딩 스피너 버블 생성
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    aiBubble.innerText = '생각 중...';
    chatBody.appendChild(aiBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 보안 우회 및 순수 프론트엔드 구동을 위한 무료 Gemini API 엔드포인트 직접 호출
    // ⚠️ 실서비스 배포 시에는 API 키 탈취 위험이 있으므로 백엔드 이전을 권장합니다.
    const GEMINI_API_KEY = "AQ.Ab8RN6I9-rcoNQwsIMXoY_DwFsuVNMnpVEzHJZSG7aoMsxDmrw"; 
    const targetModel = 'gemini-3-flash-preview';

    // 포트폴리오 데이터를 기반으로 하는 AI 역할 정의 프롬프트 수혈
    const systemInstruction = `당신은 서비스 기획자 '이다은'의 포트폴리오 안내 비서입니다. 제공된 데이터에 기반해 친절하고 전문적으로 기획자 이다은을 대변하세요.
    [주요 이력 정보]
    1. 웹 상점 구축: 이커머스 백오피스 구축(상점 세팅 공수 80% 이상 절감), 사내 최초 쿠폰/포인트 시스템 설계, 프론트 결제 플로우 여정 개선으로 이탈률 13% 감소.
    2. 커뮤니티 플랫폼: 인바운드 트래픽 제고를 위한 4대 핵심 템플릿(리스트/섬네일 등) 설계 및 배포 리소스 단축 기틀 마련.
    3. 브랜드 사이트: '스타시드' 사전예약 전환율 70% 달성, 일본 타겟 '프로야구라이징' 최적화 및 재방문율 10% 방어.
    답변은 3줄 이내로 핵심 위주로 문맥에 맞게 두괄식으로 간결하게 작성하세요.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\n사용자 질문: ${userText}` }] }]
            })
        });

        const data = await response.json();
        const aiResponseText = data.candidates[0].content.parts[0].text;
        aiBubble.innerText = aiResponseText;
    } catch (error) {
    // 이 부분을 원하는 문구로 변경하세요
    aiBubble.innerText = '⚠️ 현재 AI 호출량이 많아 잠시 서비스가 제한되었습니다. 잠시 후 다시 시도해 주세요!';
    console.error(error);
    } finally {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}