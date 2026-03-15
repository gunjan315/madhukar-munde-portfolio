/**
 * Madhukar Munde — Gallery Walk Theme
 * Horizontal gallery, lightbox, smooth reveal, nav
 */
(function () {
    'use strict';

    let currentFilter = 'all';
    let lbIndex = 0;

    // ===== NAVIGATION =====
    function initNav() {
        const nav = document.getElementById('nav');
        const burger = document.getElementById('nav-burger');
        const links = document.getElementById('nav-links');
        const navAnchors = links.querySelectorAll('a');

        // Scroll — add .scrolled class + active section
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            sections.forEach(s => {
                if (window.scrollY >= s.offsetTop - 250) current = s.id;
            });
            navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
        });

        // Mobile burger
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            links.classList.toggle('open');
        });
        navAnchors.forEach(a => a.addEventListener('click', () => {
            burger.classList.remove('open');
            links.classList.remove('open');
        }));
    }

    // ===== HERO FEATURED =====
    function initHero() {
        const img = document.getElementById('hero-painting');
        const label = document.getElementById('hero-painting-label');
        if (!img || !label) return;

        // Pick a random featured painting
        const featured = PAINTINGS[Math.floor(Math.random() * PAINTINGS.length)];
        img.src = featured.image;
        img.alt = featured.title + ' by Madhukar Munde';
        label.textContent = 'Featured: ' + featured.title;
    }

    // ===== GALLERY — Horizontal Scroll =====
    function initGallery() {
        const track = document.getElementById('gallery-track');
        const countEl = document.getElementById('gallery-count');
        const filters = document.querySelectorAll('#filters .chip');

        function render(filter) {
            track.innerHTML = '';
            const items = filter === 'all' ? PAINTINGS : PAINTINGS.filter(p => p.category === filter);

            items.forEach((p, i) => {
                const card = document.createElement('div');
                card.className = 'g-card';
                card.dataset.id = p.id;
                card.innerHTML = `
                    <div class="g-card-img">
                        <img src="${p.image}" alt="${p.title} by Madhukar Munde" loading="lazy">
                    </div>
                    <div class="g-card-info">
                        <h3>${p.title}</h3>
                        <p>${p.dimensions ? p.dimensions + ' · ' : ''}${p.medium}</p>
                    </div>
                `;
                card.addEventListener('click', () => openLightbox(p.id));
                track.appendChild(card);
            });

            // Update counter
            if (countEl) {
                countEl.textContent = items.length + ' work' + (items.length !== 1 ? 's' : '');
            }

            // Reset scroll position
            track.scrollLeft = 0;
        }

        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                render(currentFilter);
            });
        });

        render('all');
    }

    // ===== LIGHTBOX =====
    function getFiltered() {
        return currentFilter === 'all' ? PAINTINGS : PAINTINGS.filter(p => p.category === currentFilter);
    }

    function openLightbox(id) {
        const list = getFiltered();
        lbIndex = list.findIndex(p => p.id === id);
        if (lbIndex === -1) return;
        updateLightbox();
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateLightbox() {
        const list = getFiltered();
        const p = list[lbIndex];
        const img = document.getElementById('lb-img');
        img.src = p.image;
        img.alt = p.title + ' by Madhukar Munde';
        document.getElementById('lb-title').textContent = p.title;
        document.getElementById('lb-info').textContent =
            (p.dimensions ? p.dimensions + '  ·  ' : '') + p.medium;
    }

    function closeLightbox() {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    }

    function initLightbox() {
        const lb = document.getElementById('lightbox');

        lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
        lb.querySelector('.lb-bg').addEventListener('click', closeLightbox);

        lb.querySelector('.lb-prev').addEventListener('click', () => {
            const list = getFiltered();
            lbIndex = (lbIndex - 1 + list.length) % list.length;
            updateLightbox();
        });
        lb.querySelector('.lb-next').addEventListener('click', () => {
            const list = getFiltered();
            lbIndex = (lbIndex + 1) % list.length;
            updateLightbox();
        });

        document.addEventListener('keydown', e => {
            if (!lb.classList.contains('active')) return;
            const list = getFiltered();
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + list.length) % list.length; updateLightbox(); }
            if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % list.length; updateLightbox(); }
        });
    }

    // ===== SCROLL REVEAL =====
    function initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // ===== ADD REVEAL CLASSES to sections =====
    function addRevealClasses() {
        // Add reveal to key section elements
        const selectors = [
            '.about-left', '.about-right',
            '.gallery-header',
            '.phil-item', '.phil-quote',
            '.cv-card', '.expo-list', '.collections-strip',
            '.contact-grid > div', '#contact-form'
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
        });
    }

    // ===== CONTACT FORM =====
    function initContact() {
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            const subj = encodeURIComponent('Inquiry from ' + form.name.value + ' via Portfolio');
            const body = encodeURIComponent('Name: ' + form.name.value + '\nEmail: ' + form.email.value + '\n\n' + form.message.value);
            window.location.href = 'mailto:mundemadhukar@gmail.com?subject=' + subj + '&body=' + body;
        });
    }

    // ===== SMOOTH SCROLL =====
    function initScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const target = document.querySelector(a.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', () => {
        initNav();
        initHero();
        initGallery();
        initLightbox();
        addRevealClasses();
        initReveal();
        initContact();
        initScroll();
    });
})();
