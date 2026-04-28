// Add/Remove SWOT Items
function addSwotItem(listId) {
    const list = document.getElementById(listId);
    if (!list) return;

    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.contentEditable = 'true';
    span.textContent = 'Novo item...';
    
    const btn = document.createElement('button');
    btn.className = 'btn-remove';
    btn.innerHTML = '×';
    btn.title = 'Remover';
    btn.onclick = function() { removeSwotItem(this); };

    li.appendChild(span);
    li.appendChild(btn);
    
    list.appendChild(li);

    // Auto focus the new item
    setTimeout(() => {
        span.focus();
        // Select all text inside the new span
        const range = document.createRange();
        range.selectNodeContents(span);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }, 10);
}

function removeSwotItem(button) {
    const li = button.closest('li');
    if (li && li.parentNode) {
        li.parentNode.removeChild(li);
    }
}

// Scroll Animation Observer
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});

// Data Persistence (Auto-Save to Server)
let saveTimeout;

async function saveToServer() {
    // 1. Remove .active from .reveal so animations reset on reload
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => el.classList.remove('active'));

    const finalHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

    // Put animations back so the screen doesn't flicker
    revealElements.forEach(el => el.classList.add('active'));

    try {
        await fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ html: finalHtml })
        });
        console.log('Saved to server.');
    } catch (err) {
        console.error('Failed to save to server:', err);
    }
}

function triggerSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveToServer();
    }, 1000); // Debounce for 1 second
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Static Editable Elements
    const staticEditables = document.querySelectorAll('[contenteditable="true"]:not(.swot-list [contenteditable="true"])');
    staticEditables.forEach((el, index) => {
        // Fix glitch text attribute so it saves properly
        if (el.classList.contains('glitch-text')) {
            el.addEventListener('input', () => {
                el.setAttribute('data-text', el.innerText);
            });
        }
        
        el.addEventListener('input', triggerSave);
    });

    // 2. Dynamic SWOT Lists
    const swotLists = ['forcas-list', 'fraquezas-list', 'oportunidades-list', 'ameacas-list'];
    swotLists.forEach(id => {
        const list = document.getElementById(id);
        if (!list) return;

        const observer = new MutationObserver(() => {
            triggerSave();
        });
        observer.observe(list, { childList: true, subtree: true, characterData: true });
    });
});
