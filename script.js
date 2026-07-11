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
        // 💥 인터랙션 2: 탭이 펼쳐질 때 본문 내 성과 지표를 실시간 가동
        triggerCountUp(targetTab);
    }, 20);
    evt.currentTarget.classList.add("active");
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// ==========================================================================
// 🌓 2. 인터랙션: 다크/라이트 테마 원자적 전환 로직 (하늘로 솟구치는 슬라이드 연동)
// ==========================================================================
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById("theme-icon");
    const currentTheme = body.getAttribute("data-theme");

    if (!themeIcon) return;

    // [1단계] 기존 아이콘을 위로 쏘아 올려 숨깁니다 (Slide Out)
    themeIcon.classList.add("slide-out");

    // [2단계] 아이콘이 하늘 위로 완전히 사라진 시점(0.2초 뒤)에 테마를 바꾸고 새 아이콘을 바닥에 대기시킵니다
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

        // 새 이미지가 바닥(아래쪽)에서 올라올 준비를 하도록 세팅합니다 (Slide Prepare)
        themeIcon.classList.remove("slide-out");
        themeIcon.classList.add("slide-prepare");

        // [3단계] 아주 찰나의 순간(0.02초) 뒤에 바닥에 숨겨둔 새 아이콘을 위로 스무스하게 올립니다
        setTimeout(() => {
            themeIcon.classList.remove("slide-prepare");
        }, 20);

    }, 200); // 0.2초 대기
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
        const speed = target / 25; // 차오르는 프레임 속도 분할률

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
// 🚀 전체 생태계 DOM 빌드 시동 제어 (최초 로드 시 아이콘 매칭 반영)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 저장된 테마를 불러와 body 태그 및 아이콘 src에 적용합니다.
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
// 🎯 4. 인터랙션: 기획자 시선 트래킹 (마우스 커서 스토킹 링)
// ==========================================================================
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // clickable 인터랙티브 요소 접근 시 은은하게 반응하도록 피드백 수혈
    const clickables = document.querySelectorAll('a, button, .slider-dot, .slider-slide img');
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
// 🖼️ 5. 이미지 슬라이더 코어 프로세스 (기존 로직 100% 완전 보존)
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