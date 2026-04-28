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
