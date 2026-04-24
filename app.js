// app.js - основная логика приложения

let licenses = [];
let currentFilter = 'all';

// Утилиты
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getNumeral(n, one, two, five) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two;
    return five;
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Рендер карточек с новой анимацией
function renderCards(filteredLicenses) {
    const grid = document.getElementById('cardsGrid');
    if (filteredLicenses.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px; color:#888;"><div style="font-size:3rem;">🔍</div><h3>Ничего не найдено</h3></div>`;
    } else {
        grid.innerHTML = filteredLicenses.map(lic => `
            <div class="card ${lic.color} ${lic.expanded ? 'expanded' : ''}" onclick="toggleCard(this, ${lic.id})" id="card-${lic.id}">
                <div class="card-header">
                    <div class="traffic-light ${lic.color}"></div>
                    <span class="card-title">${lic.color === 'green' ? '🟢' : lic.color === 'yellow' ? '🟡' : '🔴'} ${escapeHtml(lic.name)}</span>
                </div>
                <div class="card-body">
                    <div class="card-body-inner">
                        ${lic.canDo?.length ? `<div class="detail-section"><strong>✅ Можно:</strong><ul class="can-do">${lic.canDo.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul></div>` : ''}
                        ${lic.cannotDo?.length ? `<div class="detail-section"><strong>❌ Нельзя:</strong><ul class="cannot-do">${lic.cannotDo.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul></div>` : ''}
                        ${lic.mustDo?.length ? `<div class="detail-section"><strong>⚠️ Нужно:</strong><ul class="must-do">${lic.mustDo.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul></div>` : ''}
                        <div class="card-actions"><button class="copy-btn" onclick="event.stopPropagation(); copyLicenseName('${escapeHtml(lic.name)}', this)">📋 Скопировать название</button></div>
                    </div>
                </div>
                <div class="expand-hint">👆 Нажмите, чтобы ${lic.expanded ? 'свернуть' : 'развернуть'}</div>
            </div>
        `).join('');
    }
    document.getElementById('statsText').innerHTML = `Показано ${filteredLicenses.length} ${getNumeral(filteredLicenses.length, 'лицензия', 'лицензии', 'лицензий')}`;
}

// Рендер списка карточек в админ-панели
function renderAdminCardsList() {
    const container = document.getElementById('cardsList');
    if (!container) return;
    container.innerHTML = licenses.map(lic => `
        <div class="card-item">
            <div class="card-item-info">
                <div class="card-item-name">${lic.color === 'green' ? '🟢' : lic.color === 'yellow' ? '🟡' : '🔴'} ${escapeHtml(lic.name)}</div>
                <div class="card-item-color">${lic.isBase ? '📌 Базовая' : '✨ Добавленная'}</div>
            </div>
            <div class="card-item-actions">
                <button class="card-item-btn edit" onclick="editLicense(${lic.id})">✏️</button>
                ${!lic.isBase ? `<button class="card-item-btn delete" onclick="deleteLicense(${lic.id})">🗑️</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Переключение карточки с сохранением состояния
function toggleCard(cardElement, licenseId) {
    const license = licenses.find(l => l.id === licenseId);
    if (license) {
        license.expanded = !license.expanded;
        cardElement.classList.toggle('expanded', license.expanded);
        const hint = cardElement.querySelector('.expand-hint');
        if (hint) {
            hint.textContent = license.expanded ? '👆 Нажмите, чтобы свернуть' : '👆 Нажмите, чтобы развернуть подробности';
        }
        saveLicenses(licenses);
    }
}

// Получение отфильтрованных лицензий
function getFilteredLicenses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    return licenses.filter(lic => {
        if (currentFilter !== 'all' && lic.color !== currentFilter) return false;
        if (searchTerm && !lic.name.toLowerCase().includes(searchTerm)) return false;
        return true;
    });
}

// Фильтрация
function filterLicenses() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClear');
    if (searchInput.value.trim()) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }
    renderCards(getFilteredLicenses());
}

function setFilter(color, chipElement) {
    currentFilter = color;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chipElement.classList.add('active');
    renderCards(getFilteredLicenses());
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterLicenses();
}

// Копирование
function copyLicenseName(name, btn) {
    navigator.clipboard.writeText(name).then(() => {
        btn.textContent = '✅ Скопировано!';
        btn.classList.add('copied');
        showToast(`📋 "${name}" скопировано`, 'success');
        setTimeout(() => {
            btn.textContent = '📋 Скопировать название';
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => showToast('Ошибка копирования', ''));
}

// Админ-панель с анимацией
function toggleAdminPanel() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        renderAdminCardsList();
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Section`).classList.add('active');
    if (tabName === 'edit') {
        renderAdminCardsList();
    }
}

// Генерация случайных карточек
function generateRandomCards(count = 5) {
    count = Math.min(Math.max(1, count), 50);
    for (let i = 0; i < count; i++) {
        licenses.push(generateRandomLicense());
    }
    saveLicenses(licenses);
    renderCards(getFilteredLicenses());
    if (document.getElementById('adminSidebar').classList.contains('open')) {
        renderAdminCardsList();
    }
    showToast(`✨ Сгенерировано ${count} случайных лицензий`, 'success');
}

function generateRandomCardsFromInput() {
    const input = document.getElementById('generateCount');
    let count = parseInt(input.value);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 50) {
        showToast('Максимум 50 лицензий за раз', '');
        count = 50;
        input.value = 50;
    }
    generateRandomCards(count);
}

// Удаление всех пользовательских карточек
function clearAllUserCards() {
    const userCount = licenses.filter(l => !l.isBase).length;
    if (userCount === 0) {
        showToast('Нет пользовательских лицензий для удаления', '');
        return;
    }
    if (confirm(`Удалить все ${userCount} добавленные лицензии? Базовые останутся.`)) {
        licenses = licenses.filter(l => l.isBase === true);
        saveLicenses(licenses);
        renderCards(getFilteredLicenses());
        if (document.getElementById('adminSidebar').classList.contains('open')) {
            renderAdminCardsList();
        }
        showToast(`🗑️ Удалено ${userCount} лицензий`, 'success');
    }
}

// Редактирование лицензии
function editLicense(id) {
    const license = licenses.find(l => l.id === id);
    if (!license) return;
    document.getElementById('editId').value = license.id;
    document.getElementById('licenseName').value = license.name;
    document.getElementById('licenseColor').value = license.color;
    document.getElementById('canDoRows').value = (license.canDo || []).join('\n');
    document.getElementById('cannotDoRows').value = (license.cannotDo || []).join('\n');
    document.getElementById('mustDoRows').value = (license.mustDo || []).join('\n');
    document.getElementById('modalTitle').innerText = '✏️ Редактировать лицензию';
    document.getElementById('licenseModal').style.display = 'flex';
}

// Удаление лицензии
function deleteLicense(id) {
    const license = licenses.find(l => l.id === id);
    if (license.isBase) {
        showToast('❌ Нельзя удалить базовую лицензию', '');
        return;
    }
    if (confirm(`Удалить лицензию "${license.name}"?`)) {
        licenses = licenses.filter(l => l.id !== id);
        saveLicenses(licenses);
        renderCards(getFilteredLicenses());
        if (document.getElementById('adminSidebar').classList.contains('open')) {
            renderAdminCardsList();
        }
        showToast(`🗑️ "${license.name}" удалена`, 'success');
    }
}

// Добавление/редактирование из формы
function addOrUpdateLicenseFromForm(event) {
    event.preventDefault();
    const editId = document.getElementById('editId').value;
    const name = document.getElementById('licenseName').value.trim();
    if (!name) { showToast('⚠️ Введите название', ''); return; }
    const color = document.getElementById('licenseColor').value;
    const canDo = document.getElementById('canDoRows').value.split(/\r?\n/).filter(l => l.trim());
    const cannotDo = document.getElementById('cannotDoRows').value.split(/\r?\n/).filter(l => l.trim());
    const mustDo = document.getElementById('mustDoRows').value.split(/\r?\n/).filter(l => l.trim());
    
    if (editId) {
        const index = licenses.findIndex(l => l.id == editId);
        if (index !== -1) {
            licenses[index] = {
                ...licenses[index],
                name, color,
                canDo: canDo.length ? canDo : ['Нет данных'],
                cannotDo: cannotDo.length ? cannotDo : ['Нет данных'],
                mustDo: mustDo.length ? mustDo : ['Нет данных']
            };
            showToast(`✏️ Лицензия "${name}" обновлена`, 'success');
        }
    } else {
        if (licenses.some(l => l.name.toLowerCase() === name.toLowerCase())) {
            showToast('❌ Такая лицензия уже есть', '');
            return;
        }
        const newLicense = {
            id: Date.now(),
            name, color,
            canDo: canDo.length ? canDo : ['Нет данных'],
            cannotDo: cannotDo.length ? cannotDo : ['Нет данных'],
            mustDo: mustDo.length ? mustDo : ['Нет данных'],
            isBase: false,
            expanded: false
        };
        licenses.push(newLicense);
        showToast(`✅ Лицензия "${name}" добавлена`, 'success');
    }
    closeModal();
    saveLicenses(licenses);
    renderCards(getFilteredLicenses());
    if (document.getElementById('adminSidebar').classList.contains('open')) {
        renderAdminCardsList();
    }
}

function openAddModal() {
    document.getElementById('editId').value = '';
    document.getElementById('addLicenseForm').reset();
    document.getElementById('modalTitle').innerText = '➕ Новая лицензия';
    document.getElementById('licenseModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('licenseModal').style.display = 'none';
}

// Инициализация
function init() {
    licenses = loadLicenses();
    renderCards(licenses);
    
    document.getElementById('addLicenseForm').addEventListener('submit', addOrUpdateLicenseFromForm);
    
    window.onclick = function(e) {
        const modal = document.getElementById('licenseModal');
        if (e.target === modal) closeModal();
    };
    
    // Закрытие админ-панели при клике вне (опционально)
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('adminSidebar');
        const fab = document.getElementById('fabBtn');
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !fab.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Глобальные функции для onclick
window.toggleCard = toggleCard;
window.filterLicenses = filterLicenses;
window.setFilter = setFilter;
window.clearSearch = clearSearch;
window.copyLicenseName = copyLicenseName;
window.toggleAdminPanel = toggleAdminPanel;
window.switchAdminTab = switchAdminTab;
window.generateRandomCards = generateRandomCards;
window.generateRandomCardsFromInput = generateRandomCardsFromInput;
window.clearAllUserCards = clearAllUserCards;
window.editLicense = editLicense;
window.deleteLicense = deleteLicense;
window.openAddModal = openAddModal;
window.closeModal = closeModal;

init();