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

// Data Persistence (Auto-Save)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Static Editable Elements
    const staticEditables = document.querySelectorAll('[contenteditable=\"true\"]:not(.swot-list [contenteditable=\"true\"])');
    staticEditables.forEach((el, index) => {
        const id = el.id || ('static-edit-' + index);
        el.id = id;

        const savedContent = localStorage.getItem(id);
        if (savedContent !== null) {
            el.innerHTML = savedContent;
            if (el.classList.contains('glitch-text')) {
                el.setAttribute('data-text', el.innerText);
            }
        }

        el.addEventListener('input', () => {
            localStorage.setItem(id, el.innerHTML);
        });
    });

    // 2. Dynamic SWOT Lists
    const swotLists = ['forcas-list', 'fraquezas-list', 'oportunidades-list', 'ameacas-list'];
    swotLists.forEach(id => {
        const list = document.getElementById(id);
        if (!list) return;

        const savedList = localStorage.getItem(id);
        if (savedList !== null) {
            list.innerHTML = savedList;
        }

        const observer = new MutationObserver(() => {
            localStorage.setItem(id, list.innerHTML);
        });
        observer.observe(list, { childList: true, subtree: true, characterData: true });
    });
});
