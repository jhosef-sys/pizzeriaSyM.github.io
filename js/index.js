document.addEventListener('DOMContentLoaded', () => {
    const pizzaLogos = document.querySelectorAll('.pizza-logo');

    if (pizzaLogos.length) {
        let angle = 0;

        const animatePizza = () => {
            pizzaLogos.forEach((pizza, index) => {
                const offset = index * 1.8;
                const baseX = index === 0 ? -42 : 42;
                const translationX = Math.sin(angle + offset) * 28;
                const translationY = Math.sin(angle * 1.3 + offset) * 10;
                pizza.style.transform = `translate3d(${baseX + translationX}px, ${translationY}px, 0)`;
            });

            angle += 0.018;
            requestAnimationFrame(animatePizza);
        };

        animatePizza();
    }

    const gallery = document.querySelector('.product-gallery');
    if (gallery) {
        const cards = Array.from(gallery.querySelectorAll('.poster-card'));
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;
            gallery.classList.remove('dragging');
        };

        gallery.addEventListener('pointerdown', (event) => {
            isDragging = true;
            gallery.classList.add('dragging');
            gallery.setPointerCapture(event.pointerId);
            startX = event.clientX;
            startScrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            const delta = event.clientX - startX;
            gallery.scrollLeft = startScrollLeft - delta;
        });

        gallery.addEventListener('pointerup', stopDragging);
        gallery.addEventListener('pointercancel', stopDragging);
        gallery.addEventListener('pointerleave', stopDragging);

        const setActiveCard = () => {
            const center = gallery.scrollLeft + gallery.clientWidth / 2;
            let closestIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                const distance = Math.abs(center - cardCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            cards.forEach((card, index) => {
                card.classList.toggle('active', index === closestIndex);
            });
        };

        gallery.addEventListener('scroll', setActiveCard, { passive: true });
        setActiveCard();
    }

    const musicKey = 'pizzaMusicState';
    const musicSrc = 'sonido/VIDEOBLOG.mp3';
    const chorusStart = 1;
    const isIndexPage = /\/index\.html?$/.test(window.location.pathname) || window.location.pathname === '/';

    const setAudioPosition = (startAt) => {
        const targetTime = Number.isFinite(startAt) ? startAt : chorusStart;
        if (audio.readyState >= 1) {
            audio.currentTime = targetTime;
            return;
        }

        const onMetadataLoaded = () => {
            audio.currentTime = targetTime;
            audio.removeEventListener('loadedmetadata', onMetadataLoaded);
        };

        audio.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
    };

    const getMusicState = () => {
        try {
            const raw = localStorage.getItem(musicKey);
            if (!raw) {
                return { enabled: false, startedOnce: false, currentTime: 0 };
            }

            const parsed = JSON.parse(raw);
            return {
                enabled: Boolean(parsed.enabled),
                startedOnce: Boolean(parsed.startedOnce),
                currentTime: Number.isFinite(parsed.currentTime) ? Number(parsed.currentTime) : 0,
            };
        } catch (error) {
            return { enabled: false, startedOnce: false, currentTime: 0 };
        }
    };

    const saveMusicState = (nextState) => {
        const currentState = getMusicState();
        const mergedState = { ...currentState, ...nextState };
        localStorage.setItem(musicKey, JSON.stringify(mergedState));
        return mergedState;
    };

    const audio = document.getElementById('bg-audio') || (() => {
        const musicAudio = new Audio(musicSrc);
        musicAudio.id = 'bg-audio';
        musicAudio.loop = true;
        musicAudio.preload = 'auto';
        musicAudio.volume = 0.60
        document.body.appendChild(musicAudio);
        return musicAudio;
    })();

    audio.src = musicSrc;
    audio.load();

    const ensureToggleButton = () => {
        let button = document.getElementById('music-toggle');
        if (!button) {
            button = document.createElement('button');
            button.id = 'music-toggle';
            button.type = 'button';
            button.className = 'music-toggle';
            button.setAttribute('aria-label', 'Activar o pausar música');
            button.textContent = '🔊 Música';
            document.body.appendChild(button);
        }

        return button;
    };

    const toggleButton = ensureToggleButton();

    const updateButton = (enabled) => {
        toggleButton.textContent = enabled ? '🔊 Pausar música' : '🔊 Reproducir música';
        toggleButton.classList.toggle('is-playing', enabled);
        toggleButton.setAttribute('aria-pressed', String(enabled));
    };

    const playMusic = async (startAt = chorusStart) => {
        audio.src = musicSrc;
        audio.volume = 0.60;
        setAudioPosition(Number.isFinite(startAt) ? startAt : chorusStart);

        try {
            await audio.play();
            saveMusicState({ enabled: true, startedOnce: true, currentTime: audio.currentTime || chorusStart });
            updateButton(true);
        } catch (error) {
            saveMusicState({ enabled: false, startedOnce: true, currentTime: audio.currentTime || chorusStart });
            updateButton(false);
        }
    };

    const pauseMusic = () => {
        audio.pause();
        saveMusicState({ enabled: false, startedOnce: true, currentTime: audio.currentTime || chorusStart });
        updateButton(false);
    };

    toggleButton.addEventListener('click', () => {
        if (audio.paused) {
            const state = getMusicState();
            playMusic(Number(state.currentTime) || chorusStart);
            return;
        }

        pauseMusic();
    });

    const state = getMusicState();
    const attemptResumeOnPageLoad = () => {
        if (state.startedOnce && state.enabled) {
            const savedTime = Number(state.currentTime) || chorusStart;
            audio.currentTime = Math.min(savedTime, audio.duration || savedTime);
            audio.play().catch(() => {
                updateButton(false);
            });
            return;
        }

        audio.pause();
        updateButton(false);
    };

    if (isIndexPage) {
        if (!state.startedOnce) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    playMusic(chorusStart);
                }, 400);
            }, { once: true });
        } else {
            audio.pause();
            updateButton(state.enabled && !audio.paused);
        }
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (state.startedOnce && state.enabled) {
                    attemptResumeOnPageLoad();
                } else {
                    audio.pause();
                    updateButton(false);
                }
            }, 200);
        }, { once: true });
    }

    document.addEventListener('pointerdown', () => {
        const currentState = getMusicState();
        if (!currentState.startedOnce || !currentState.enabled) return;
        if (audio.paused) {
            playMusic(Number(currentState.currentTime) || chorusStart);
        }
    }, { once: true });

    window.addEventListener('beforeunload', () => {
        saveMusicState({
            enabled: !audio.paused,
            startedOnce: true,
            currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : chorusStart,
        });
    });
});
