// =================== 页面初始化 ===================
document.addEventListener("DOMContentLoaded", function () {
    initCarousel();   // 初始化轮播图
    initSchedule();   // 初始化日程
    initScrollSpy();  // 初始化导航滚动监听
    initHeader();     // 初始化头部样式变化
});

// =================== 轮播图功能 ===================
let currentSlide = 0;
let autoPlayInterval;

function initCarousel() {
    const slideContainer = document.querySelector(".carousel-slides");
    const slides = document.querySelectorAll(".carousel-slide");
    const indicators = document.querySelectorAll(".indicator");
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");
    const totalSlides = slides.length;

    // 显示指定幻灯片
    function showSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        slideContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        indicators.forEach((ind, i) =>
            ind.classList.toggle("active", i === currentSlide)
        );
    }

    // 左右切换按钮
    prevBtn?.addEventListener("click", () => {
        showSlide(currentSlide - 1);
        resetAutoPlay();
    });
    nextBtn?.addEventListener("click", () => {
        showSlide(currentSlide + 1);
        resetAutoPlay();
    });

    // 指示器点击
    indicators.forEach((ind, i) => {
        ind.addEventListener("click", () => {
            showSlide(i);
            resetAutoPlay();
        });
    });

    // 自动播放
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 鼠标悬停暂停
    slideContainer.addEventListener("mouseenter", stopAutoPlay);
    slideContainer.addEventListener("mouseleave", startAutoPlay);

    showSlide(0);
    startAutoPlay();
}

// =================== 日程功能 ===================
function initSchedule() {
    const days = document.querySelectorAll(".day");
    const dayContents = document.querySelectorAll(".day-content");

    const today = new Date().getDay(); // 0=周日, 1=周一, ...
    const dayIndex = today === 0 ? 6 : today - 1; // 周一=0

    // 默认显示当天
    if (days[dayIndex]) {
        days.forEach((day) => day.classList.remove("active"));
        dayContents.forEach((c) => c.classList.remove("active"));

        days[dayIndex].classList.add("active");
        document
            .querySelector(`.day-content[data-day="${days[dayIndex].dataset.day}"]`)
            ?.classList.add("active");
    }

    // 点击切换
    days.forEach((day) => {
        day.addEventListener("click", function () {
            const dayValue = this.dataset.day;

            days.forEach((d) => d.classList.remove("active"));
            this.classList.add("active");

            dayContents.forEach((c) => {
                c.classList.toggle("active", c.dataset.day === dayValue);
            });
        });
    });
}

// =================== 滚动导航功能 ===================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth" });

    document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.target === sectionId);
    });
}

function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navButtons = document.querySelectorAll(".nav-btn");

    window.addEventListener("scroll", () => {
        let currentSection = "";
        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (
                window.scrollY >= top - 100 &&
                window.scrollY < top + height - 100
            ) {
                currentSection = section.id;
            }
        });

        navButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.target === currentSection);
        });
    });
}

// =================== 头部样式变化 ===================
function initHeader() {
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {  // 滚动超过300px显示按钮
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


document.addEventListener('DOMContentLoaded', function () {
    const mainWrap = document.getElementById('main-display-wrap');
    const thumbs = Array.from(document.querySelectorAll('.gallery-thumbnails .thumb'));
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');

    // Lightbox 元素
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (!thumbs.length) return;

    // 找到初始 active 索引
    let currentIndex = thumbs.findIndex(t => t.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;

    // 渲染主视图（图片或视频）
    function renderMain(index) {
        index = (index + thumbs.length) % thumbs.length;
        const thumb = thumbs[index];

        // 更新 active class
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // 获取缩略内的媒体元素：img 或 video
        const media = thumb.querySelector('img,video');
        if (!media) return;

        // 决定 full src：优先 data-full，没就用缩略 src
        let fullSrc = media.dataset && media.dataset.full ? media.dataset.full : (media.getAttribute('src') || '');

        // 清空主视图并插入新元素
        mainWrap.innerHTML = '';
        let mainMedia;
        if (fullSrc.toLowerCase().endsWith('.mp4')) {
            mainMedia = document.createElement('video');
            mainMedia.src = fullSrc;
            mainMedia.controls = true;
            mainMedia.autoplay = true;
            mainMedia.muted = true;
            mainMedia.loop = true;
        } else {
            mainMedia = document.createElement('img');
            mainMedia.src = fullSrc;
            mainMedia.alt = '展示图';
        }
        mainMedia.className = 'main-media fade-in';
        mainWrap.appendChild(mainMedia);

        currentIndex = index;
    }

    // 缩略图点击
    thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
            renderMain(idx);
            // 缩略图居中
            try { thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch (e) { }
        });
    });

    // 左右按钮切换
    prevBtn && prevBtn.addEventListener('click', () => renderMain(currentIndex - 1));
    nextBtn && nextBtn.addEventListener('click', () => renderMain(currentIndex + 1));

    /// 点击大图显示原图
    mainWrap.addEventListener('click', () => {
        const currentThumb = thumbs[currentIndex];
        const media = currentThumb.querySelector('img,video');
        const fullSrc = media.dataset && media.dataset.full ? media.dataset.full : media.getAttribute('src');
        lightboxImg.src = fullSrc;
        lightbox.style.display = 'flex'; // ✅ 仅在点击时显示
    });

    // Lightbox 关闭
    lightboxClose.addEventListener('click', () => lightbox.style.display = 'none');
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });

    // 初始化显示
    renderMain(currentIndex);
});
