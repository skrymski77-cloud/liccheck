// licensesData.js - данные лицензий и функции работы с ними

const STORAGE_KEY = 'licenses_data_admin';

// Базовые лицензии (защищённые от удаления) - 24 реальных лицензии
const baseLicenses = [
    // === СВОБОДНЫЕ LICENSES (GREEN) ===
    { id: 1, name: 'MIT', color: 'green', canDo: ['Использовать где угодно', 'Продавать свой проект', 'Менять код'], cannotDo: ['Убирать имя автора'], mustDo: ['Сохранить текст лицензии'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 2, name: 'Apache 2.0', color: 'green', canDo: ['Использовать в коммерции', 'Распространять', 'Модифицировать'], cannotDo: ['Убирать уведомления'], mustDo: ['Указать изменения', 'Сохранить NOTICE-файл'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 3, name: 'BSD 3-Clause', color: 'green', canDo: ['Использовать везде', 'Распространять', 'Модифицировать'], cannotDo: ['Использовать имя автора в рекламе'], mustDo: ['Сохранить текст лицензии'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 4, name: 'BSD 2-Clause', color: 'green', canDo: ['Использовать в коммерции', 'Распространять'], cannotDo: ['Убирать авторство'], mustDo: ['Сохранить лицензию'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 5, name: 'ISC', color: 'green', canDo: ['Любое использование', 'Коммерция', 'Модификация'], cannotDo: ['Убирать авторство'], mustDo: ['Сохранить текст лицензии'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 6, name: 'Unlicense', color: 'green', canDo: ['Всё что угодно', 'Продавать', 'Менять', 'Не указывать автора'], cannotDo: [], mustDo: [], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 7, name: 'CC0 1.0', color: 'green', canDo: ['Полная свобода', 'Коммерция', 'Изменения'], cannotDo: [], mustDo: ['Не использовать для клеветы'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 8, name: 'WTFPL', color: 'green', canDo: ['Абсолютно всё', 'Ничего не указывать'], cannotDo: [], mustDo: [], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 9, name: '0BSD', color: 'green', canDo: ['Любое использование', 'Коммерция', 'Изменения'], cannotDo: [], mustDo: [], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 10, name: 'Artistic 2.0', color: 'green', canDo: ['Использовать где угодно', 'Распространять'], cannotDo: ['Убирать уведомления'], mustDo: ['Сохранить авторство'], isBase: true, isGenerated: false, isUserAdded: false },

    // === ОГРАНИЧЕННЫЕ LICENSES (YELLOW) ===
    { id: 11, name: 'LGPL-2.1', color: 'yellow', canDo: ['Подключать как библиотеку', 'Использовать в коммерческом ПО'], cannotDo: ['Вносить изменения в саму библиотеку без открытия'], mustDo: ['Открыть изменения библиотеки', 'Указать автора'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 12, name: 'LGPL-3.0', color: 'yellow', canDo: ['Связать с проприетарным кодом'], cannotDo: ['Изменять LGPL-код без открытия'], mustDo: ['Открыть изменения', 'Указать авторство'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 13, name: 'MPL-2.0', color: 'yellow', canDo: ['Использовать в коммерческих проектах', 'Комбинировать с проприетарным кодом'], cannotDo: ['Закрывать изменения файлов под MPL'], mustDo: ['Открыть изменённые MPL-файлы'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 14, name: 'EPL-2.0', color: 'yellow', canDo: ['Использовать в коммерции', 'Распространять'], cannotDo: ['Закрывать изменения'], mustDo: ['Открыть изменения кода', 'Указать автора'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 15, name: 'CC BY', color: 'yellow', canDo: ['Делиться', 'Адаптировать', 'Использовать в коммерции'], cannotDo: ['Убирать указание авторства'], mustDo: ['Указать автора', 'Указать изменения'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 16, name: 'CC BY-SA', color: 'yellow', canDo: ['Делиться', 'Адаптировать', 'Коммерция'], cannotDo: ['Убирать авторство', 'Менять лицензию'], mustDo: ['Лицензировать изменения на тех же условиях'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 17, name: 'CC BY-NC', color: 'yellow', canDo: ['Делиться', 'Адаптировать'], cannotDo: ['Использовать в коммерческих целях'], mustDo: ['Указать автора', 'Указать изменения'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 18, name: 'ODbL', color: 'yellow', canDo: ['Делиться', 'Использовать в проектах'], cannotDo: ['Закрывать данные'], mustDo: ['Открыть производные базы данных'], isBase: true, isGenerated: false, isUserAdded: false },

    // === СТРОГИЕ LICENSES (RED) ===
    { id: 19, name: 'GPL-2.0', color: 'red', canDo: ['Использовать в открытых проектах', 'Менять код'], cannotDo: ['Закрывать исходный код', 'Коммерческое распространение без открытия'], mustDo: ['Открыть свой код', 'Сохранить лицензию'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 20, name: 'GPL-3.0', color: 'red', canDo: ['Использовать в открытых проектах', 'Менять код'], cannotDo: ['Закрывать исходный код', 'Использовать в проприетарном ПО'], mustDo: ['Открыть исходный код своего проекта', 'Указать автора'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 21, name: 'AGPL-3.0', color: 'red', canDo: ['Использовать в открытых проектах'], cannotDo: ['Закрывать код серверной части'], mustDo: ['Открыть код даже при сетевом использовании', 'Указать автора'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 22, name: 'OSL-3.0', color: 'red', canDo: ['Использовать в открытых проектах'], cannotDo: ['Закрывать код', 'Распространять без открытия'], mustDo: ['Открыть весь код', 'Сохранить уведомления'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 23, name: 'CPL-1.0', color: 'red', canDo: ['Распространять бинарники'], cannotDo: ['Закрывать изменения'], mustDo: ['Открыть исходный код изменений'], isBase: true, isGenerated: false, isUserAdded: false },
    { id: 24, name: 'MS-RL', color: 'red', canDo: ['Использовать в своих проектах'], cannotDo: ['Закрывать изменения'], mustDo: ['Открыть изменённые файлы'], isBase: true, isGenerated: false, isUserAdded: false }
];

// Загрузка лицензий из localStorage
function loadLicenses() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Восстанавливаем expanded состояние и убеждаемся, что есть все флаги
                return parsed.map(l => ({ 
                    ...l, 
                    expanded: false,
                    isBase: l.isBase || false,
                    isGenerated: l.isGenerated || false,
                    isUserAdded: l.isUserAdded || false
                }));
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

// Генерация случайной лицензии (с флагом isGenerated = true)
function generateRandomLicense() {
    const prefixes = ['Open', 'Free', 'Code', 'Flex', 'Smart', 'Secure', 'Light', 'Meta', 'Poly', 'Neo', 'Eco', 'Ultra', 'Prime', 'Core', 'Lite'];
    const suffixes = ['License', 'Public License', 'Free License', 'Community', 'Source', 'Commons', 'Open License', 'Distribution'];
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
        isGenerated: true,
        isUserAdded: false,
        expanded: false
    };
}

// Создание лицензии, добавленной вручную (через форму)
function createManualLicense(name, color, canDo, cannotDo, mustDo) {
    return {
        id: Date.now(),
        name: name,
        color: color,
        canDo: canDo.length ? canDo : ['Нет данных'],
        cannotDo: cannotDo.length ? cannotDo : ['Нет данных'],
        mustDo: mustDo.length ? mustDo : ['Нет данных'],
        isBase: false,
        isGenerated: false,
        isUserAdded: true,  // Флаг для пользовательских добавленных лицензий
        expanded: false
    };
}

// Получение всех лицензий (для отладки)
function getAllLicenses() {
    return loadLicenses();
}

// Глобальные функции для работы из app.js
window.loadLicenses = loadLicenses;
window.saveLicenses = saveLicenses;
window.generateRandomLicense = generateRandomLicense;
window.createManualLicense = createManualLicense;
window.baseLicenses = baseLicenses;
window.STORAGE_KEY = STORAGE_KEY;
window.getAllLicenses = getAllLicenses;
