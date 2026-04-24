// licensesData.js - данные лицензий и функции работы с ними

const STORAGE_KEY = 'licenses_data_admin';

// Базовые лицензии (защищённые от удаления)
const baseLicenses = [
    { id: 1, name: 'MIT', color: 'green', canDo: ['Использовать где угодно', 'Продавать свой проект', 'Менять код'], cannotDo: ['Убирать имя автора'], mustDo: ['Сохранить текст лицензии'], isBase: true },
    { id: 2, name: 'GPL-3.0', color: 'red', canDo: ['Использовать в открытых проектах', 'Менять код'], cannotDo: ['Закрывать исходный код', 'Использовать в проприетарном ПО'], mustDo: ['Открыть исходный код', 'Указать автора'], isBase: true },
    { id: 3, name: 'Apache 2.0', color: 'green', canDo: ['Использовать в коммерции', 'Распространять', 'Модифицировать'], cannotDo: ['Убирать уведомления'], mustDo: ['Указать изменения'], isBase: true },
    { id: 4, name: 'LGPL-2.1', color: 'yellow', canDo: ['Подключать как библиотеку'], cannotDo: ['Изменять без открытия'], mustDo: ['Открыть изменения'], isBase: true },
    { id: 5, name: 'BSD 3-Clause', color: 'green', canDo: ['Использовать везде'], cannotDo: ['Использовать имя автора в рекламе'], mustDo: ['Сохранить текст'], isBase: true },
    { id: 6, name: 'CC BY', color: 'green', canDo: ['Делиться', 'Адаптировать'], cannotDo: ['Убирать авторство'], mustDo: ['Указать автора'], isBase: true },
    { id: 7, name: 'CC BY-NC', color: 'yellow', canDo: ['Делиться'], cannotDo: ['Коммерция'], mustDo: ['Указать автора'], isBase: true },
    { id: 8, name: 'AGPL', color: 'red', canDo: ['Открытые проекты'], cannotDo: ['Закрывать серверный код'], mustDo: ['Открыть код'], isBase: true },
    { id: 9, name: 'MPL-2.0', color: 'yellow', canDo: ['Коммерция'], cannotDo: ['Закрывать изменения MPL'], mustDo: ['Открыть MPL-файлы'], isBase: true },
    { id: 10, name: 'Unlicense', color: 'green', canDo: ['Всё'], cannotDo: [], mustDo: [], isBase: true }
];

// Загрузка лицензий из localStorage
function loadLicenses() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map(l => ({ ...l, expanded: false }));
            }
        } catch(e) {
            console.error('Ошибка загрузки', e);
        }
    }
    return baseLicenses.map(l => ({ ...l, expanded: false }));
}

// Сохранение лицензий
function saveLicenses(licenses) {
    const toSave = licenses.map(({ expanded, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

// Генерация случайной лицензии
function generateRandomLicense() {
    const prefixes = ['Open', 'Free', 'Code', 'Flex', 'Smart', 'Secure', 'Light', 'Meta', 'Poly', 'Neo', 'Eco', 'Ultra'];
    const suffixes = ['License', 'Public License', 'Free License', 'Community', 'Source', 'Commons', 'Open License'];
    const randomName = prefixes[Math.floor(Math.random() * prefixes.length)] + '-' + 
                      (Math.floor(Math.random() * 99) + 1) + ' ' + 
                      suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const colors = ['green', 'yellow', 'red'];
    const color = colors[Math.floor(Math.random() * 3)];
    
    const actionsList = [
        ['Использовать в любых проектах', 'Модифицировать код', 'Распространять'],
        ['Использовать в некоммерческих проектах', 'Распространять'],
        ['Использовать только в открытых проектах', 'Изменять код'],
        ['Свободно использовать', 'Копировать', 'Адаптировать']
    ];
    const forbidsList = [
        ['Убирать имя автора'],
        ['Использовать в коммерции'],
        ['Закрывать исходный код'],
        ['Убирать уведомления'],
        ['Продавать без изменений']
    ];
    const mustsList = [
        ['Сохранить лицензию'],
        ['Указать авторство'],
        ['Открыть изменения'],
        ['Указать оригинального автора']
    ];
    
    return {
        id: Date.now() + Math.random() * 10000,
        name: randomName,
        color: color,
        canDo: actionsList[Math.floor(Math.random() * actionsList.length)],
        cannotDo: [forbidsList[Math.floor(Math.random() * forbidsList.length)][0]],
        mustDo: [mustsList[Math.floor(Math.random() * mustsList.length)][0]],
        isBase: false,
        expanded: false
    };
}

// Глобальные функции для работы из app.js
window.loadLicenses = loadLicenses;
window.saveLicenses = saveLicenses;
window.generateRandomLicense = generateRandomLicense;
window.baseLicenses = baseLicenses;
window.STORAGE_KEY = STORAGE_KEY;