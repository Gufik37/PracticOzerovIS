document.addEventListener('DOMContentLoaded', () => {
    console.log('Minecraft Cases loaded');

    const openBtn = document.getElementById('openCaseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const historyList = document.getElementById('historyList');
    const animationBox = document.getElementById('animationBox');
    const loginLink = document.getElementById('loginLink');

    const items = [
        { name: 'Каменный меч', rarity: 'common', image: '🗡️' },
        { name: 'Алмаз', rarity: 'rare', image: '💎' },
        { name: 'Золотое яблоко', rarity: 'epic', image: '🍎' },
        { name: 'Книга зачарований', rarity: 'rare', image: '📖' },
        { name: 'Незерит', rarity: 'epic', image: '🔥' },
        { name: 'Грязь', rarity: 'common', image: '🧱' }
    ];

    function fetchItems() {
        return fetch('data/items.json')
            .then(response => response.json())
            .catch(() => items);
    }

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            animationBox.textContent = 'Открываем...';
            animationBox.classList.add('spinning');

            setTimeout(() => {
                fetchItems().then(itemList => {
                    const randomIndex = Math.floor(Math.random() * itemList.length);
                    const wonItem = itemList[randomIndex];
                    animationBox.classList.remove('spinning');
                    animationBox.innerHTML = `Вы получили: ${wonItem.image} ${wonItem.name}`;

                    const li = document.createElement('li');
                    li.className = `list-group-item ${wonItem.rarity}`;
                    li.textContent = `${wonItem.image} ${wonItem.name} (${wonItem.rarity})`;
                    historyList.prepend(li);

                    console.log('Открыт кейс:', wonItem);
                });
            }, 1000);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            historyList.innerHTML = '';
            animationBox.innerHTML = 'Нажми "Открыть кейс"';
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Функция входа будет доступна позже');
        });
    }

    const xssOutput = document.getElementById('xssOutput');
    if (xssOutput) {
        const urlParams = new URLSearchParams(window.location.search);
        const comment = urlParams.get('comment');
        if (comment) {
            xssOutput.innerHTML = comment;
        }
    }

    const safeSubmit = document.getElementById('safeSubmit');
    const safeOutput = document.getElementById('safeOutput');
    const safeComment = document.getElementById('safeComment');
    if (safeSubmit) {
        safeSubmit.addEventListener('click', () => {
            const comment = safeComment.value;
            safeOutput.textContent = comment;
        });
    }

    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authStatus = document.getElementById('authStatus');
    const protectedData = document.getElementById('protectedData');

    const token = localStorage.getItem('token');
    updateAuthStatus(token);

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN0dWRlbnQiLCJpYXQiOjE1MTYyMzkwMjJ9.abcdef123456';
            localStorage.setItem('token', fakeToken);
            updateAuthStatus(fakeToken);
            protectedData.innerHTML = '<p>Секретные данные: только для авторизованных. Вы вошли!</p>';
            try {
                const payload = JSON.parse(atob(fakeToken.split('.')[1]));
                console.log('JWT Payload:', payload);
            } catch (e) {}
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            updateAuthStatus(null);
            protectedData.innerHTML = '';
        });
    }

    function updateAuthStatus(token) {
        if (authStatus) {
            authStatus.innerHTML = token 
                ? '<span class="text-success">✓ Вы авторизованы (имитация JWT)</span>'
                : '<span class="text-danger">✗ Вы не авторизованы</span>';
        }
    }
});
