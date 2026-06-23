function applyAccessibilitySettings() {
    const savedFontSize = localStorage.getItem('mosiqatiFontSize') || 'font-normal';
    document.body.classList.remove('font-normal', 'font-medium', 'font-large', 'font-xlarge');
    document.body.classList.add(savedFontSize);
    
    const savedTheme = localStorage.getItem('mosiqatiTheme') || 'light-mode';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark-mode');

    const savedLang = localStorage.getItem('mosiqatiLang') || 'ar';
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'en' ? 'ltr' : 'rtl';
}

function updateActiveButtonClass(buttonsList, attributeName, currentValue) {
    buttonsList.forEach(btn => {
        btn.classList.toggle('active-setting', btn.getAttribute(attributeName) === currentValue);
    });
}

function initAccessibilityControls() {
    const fontButtons = document.querySelectorAll('.font-btn');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const langButtons = document.querySelectorAll('.lang-btn');

    [fontButtons, themeButtons, langButtons].forEach(list => {
        list.forEach(btn => {
            btn.addEventListener('click', function() {
                const type = btn.getAttribute('data-size') ? 'mosiqatiFontSize' : (btn.getAttribute('data-theme') ? 'mosiqatiTheme' : 'mosiqatiLang');
                const val = btn.getAttribute('data-size') || btn.getAttribute('data-theme') || btn.getAttribute('data-lang');
                localStorage.setItem(type, val);
                applyAccessibilitySettings();
                if (btn.classList.contains('font-btn')) {
    updateActiveButtonClass(list, 'data-size', val);
}

if (btn.classList.contains('theme-btn')) {
    updateActiveButtonClass(list, 'data-theme', val);
}
            });
        });
    });
    updateActiveButtonClass(
    fontButtons,
    'data-size',
    localStorage.getItem('mosiqatiFontSize') || 'font-normal'
);

updateActiveButtonClass(
    themeButtons,
    'data-theme',
    localStorage.getItem('mosiqatiTheme') || 'light-mode'
);
}
document.addEventListener("DOMContentLoaded", function () {
    
    applyAccessibilitySettings();
    initAccessibilityControls();
    applyTTSSettings();
    initTTSControls();
});
    

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const filterValue = searchInput.value.trim().toLowerCase();
            document.querySelectorAll(".product-card").forEach(card => {
                const title = card.querySelector(".product-title").textContent.toLowerCase();
                card.style.display = title.includes(filterValue) ? "" : "none";
            });
        });
    }

    
/* =========================
   القارئ الذكي للنصوص
========================= */

function applyTTSSettings() {
    const ttsEnabled =
        localStorage.getItem('mosiqatiTTS') === 'on';

    document.body.classList.toggle(
        'tts-enabled',
        ttsEnabled
    );
}

function initTTSControls() {

    const ttsButtons =
        document.querySelectorAll('.tts-btn');

    ttsButtons.forEach(btn => {

        btn.addEventListener('click', () => {

            const value =
                btn.getAttribute('data-tts');

            localStorage.setItem(
                'mosiqatiTTS',
                value
            );

            applyTTSSettings();

            ttsButtons.forEach(b =>
                b.classList.remove('active-setting')
            );

            btn.classList.add('active-setting');
        });
    });

    const current =
        localStorage.getItem('mosiqatiTTS') || 'off';

    ttsButtons.forEach(btn => {

        if (
            btn.getAttribute('data-tts')
            === current
        ) {
            btn.classList.add('active-setting');
        }
    });
}

document.addEventListener('mouseup', function () {

    if (localStorage.getItem('mosiqatiTTS') !== 'on') {
        return;
    }

    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
        return;
    }

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(selectedText);

    speech.lang = 'ar-SA';
    speech.rate = 1;

    speechSynthesis.speak(speech);

});