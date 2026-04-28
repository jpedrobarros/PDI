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
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});

// Data Persistence (Local Storage Auto-Save)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Static Editable Elements
    const staticEditables = document.querySelectorAll('[contenteditable="true"]:not(.swot-list [contenteditable="true"])');
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
            if (el.classList.contains('glitch-text')) {
                el.setAttribute('data-text', el.innerText);
            }
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

// GitHub API Integration (Save to Production)
async function saveToGitHub() {
    let token = localStorage.getItem('github_pat');
    if (!token) {
        token = prompt('Digite seu GitHub Personal Access Token (PAT) para salvar em produção:');
        if (!token) return;
        localStorage.setItem('github_pat', token);
    }

    const repo = 'jpedrobarros/PDI';
    const filePath = 'index.html';
    const apiUrl = \https://api.github.com/repos/\/contents/\\;
    const btn = document.getElementById('saveGithubBtn');
    
    btn.innerHTML = '⏳ Publicando...';
    btn.disabled = true;

    try {
        // 1. Get current file SHA
        const getRes = await fetch(apiUrl, {
            headers: { 'Authorization': \	oken \\ }
        });
        
        if (getRes.status === 401 || getRes.status === 403) {
            localStorage.removeItem('github_pat');
            throw new Error('Token inválido ou expirado.');
        }

        if (!getRes.ok) throw new Error('Não foi possível ler o arquivo atual no GitHub.');
        
        const fileData = await getRes.json();
        const sha = fileData.sha;

        // 2. Clean DOM before saving
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => el.classList.remove('active'));

        // 3. Encode to Base64 (UTF-8 safe)
        const finalHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
        const encodedHtml = btoa(unescape(encodeURIComponent(finalHtml)));

        // Restore animations
        revealElements.forEach(el => el.classList.add('active'));

        // 4. Push Update
        const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': \	oken \\,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update PDI via Production Dashboard',
                content: encodedHtml,
                sha: sha
            })
        });

        if (!putRes.ok) throw new Error('Falha ao enviar commit para o GitHub.');

        alert('✅ Sucesso! Suas alterações foram publicadas no GitHub. O site será atualizado em alguns minutos.');
    } catch (err) {
        console.error(err);
        alert('❌ Erro: ' + err.message);
    } finally {
        btn.innerHTML = \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> Publicar Alterações\;
        btn.disabled = false;
    }
}
