const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8826809113:AAG-Jz5emLF93JHy7WgZrr9q2g17oKVCSlk';
const bot = new TelegramBot(TOKEN, { polling: true });

// База данных (простая, в памяти)
const users = {};
const userProfiles = {};

// Языковые настройки
const langs = {
  ru: {
    welcome: 'Привет! Это бот по игре Animal Hospital. Здесь собраны полезные советы как для новичков, так и для профи, а также другие интересные функции. Нажимай на кнопки снизу 👇',
    tips_btn: '🐾 Полезные советы',
    profile_btn: '👤 Профиль',
    classes_btn: '⚔️ Способности классов',
    settings_btn: '⚙️ Настройки',
    facts_btn: '💡 Интересные факты',
    tips_title: '🐾 ПОЛЕЗНЫЕ СОВЕТЫ:\n\nЗдесь собраны советы, которые могут облегчить вам прохождение!',
    settings_title: '⚙️ НАСТРОЙКИ\n\nВыберите действие 👇',
    notif_btn: '🔔 Уведомления',
    lang_btn: '🌐 Язык',
    notif_on: '🔔 Уведомления включены',
    notif_off: '🔔 Уведомления выключены',
    lang_select: '🌐 Выберите язык:',
    lang_changed: '✅ Язык изменён на Русский',
    profile_title: '👤 ПРОФИЛЬ',
    extra_btn: '📝 Указать доп. информацию',
    extra_prompt: 'Введите через запятую:\n1. Сколько у вас смен\n2. Какие классы у вас есть\n3. Сколько у вас Кеткоинов\n\nПример: 150, Стажёр Медсестра, 5000',
    extra_saved: '✅ Информация сохранена!',
    days_in_bot: 'дней в боте'
  },
  en: {
    welcome: 'Hi! This is an Animal Hospital bot. Here you will find useful tips for both beginners and pros, as well as other interesting features. Press the buttons below 👇',
    tips_btn: '🐾 Useful Tips',
    profile_btn: '👤 Profile',
    classes_btn: '⚔️ Class Abilities',
    settings_btn: '⚙️ Settings',
    facts_btn: '💡 Interesting Facts',
    tips_title: '🐾 USEFUL TIPS:\n\nHere are tips that can make your game easier!',
    settings_title: '⚙️ SETTINGS\n\nChoose an action 👇',
    notif_btn: '🔔 Notifications',
    lang_btn: '🌐 Language',
    notif_on: '🔔 Notifications enabled',
    notif_off: '🔔 Notifications disabled',
    lang_select: '🌐 Choose language:',
    lang_changed: '✅ Language changed to English',
    profile_title: '👤 PROFILE',
    extra_btn: '📝 Add extra info',
    extra_prompt: 'Enter separated by commas:\n1. How many shifts\n2. Which classes you have\n3. How many Ketcoins\n\nExample: 150, Intern Nurse, 5000',
    extra_saved: '✅ Information saved!',
    days_in_bot: 'days in bot'
  },
  ua: {
    welcome: 'Привіт! Це бот з гри Animal Hospital. Тут зібрані корисні поради як для новачків, так і для профі, а також інші цікаві функції. Натискайте на кнопки знизу 👇',
    tips_btn: '🐾 Корисні поради',
    profile_btn: '👤 Профіль',
    classes_btn: '⚔️ Здібності класів',
    settings_btn: '⚙️ Налаштування',
    facts_btn: '💡 Цікаві факти',
    tips_title: '🐾 КОРИСНІ ПОРАДИ:\n\nТут зібрані поради, які можуть полегшити вам проходження!',
    settings_title: '⚙️ НАЛАШТУВАННЯ\n\nОберіть дію 👇',
    notif_btn: '🔔 Сповіщення',
    lang_btn: '🌐 Мова',
    notif_on: '🔔 Сповіщення увімкнено',
    notif_off: '🔔 Сповіщення вимкнено',
    lang_select: '🌐 Оберіть мову:',
    lang_changed: '✅ Мову змінено на Українську',
    profile_title: '👤 ПРОФІЛЬ',
    extra_btn: '📝 Вказати дод. інформацію',
    extra_prompt: 'Введіть через кому:\n1. Скільки у вас змін\n2. Які класи у вас є\n3. Скільки у вас Кеткоінів\n\nПриклад: 150, Стажист Медсестра, 5000',
    extra_saved: '✅ Інформацію збережено!',
    days_in_bot: 'днів у боті'
  }
};

// Полезные советы (RU)
const tips = [
  '1. Если видите подкроватного монстра — дайте ему клиновый сироп, и он исчезнет.',
  '2. Когда приходит Барни/Аномалия, которая бьёт окно, вы можете отдать кофе и не потерять его. Для этого сделайте 3 глотка. Когда уже почти нажали — выпевайте кофе. Вам засчитается, и Барни/Аномалии тоже засчитается.',
  '3. Многие знают, что Слаймов можно убирать огнетушителем. Но их также можно убирать сиропом от кашля — так они убираются намного быстрее.',
  '4. Когда начался пожар (например, в 8-й комнате) — тушите его не полностью. Оставьте с краю 1 огонёк, и в этой комнате больше никогда не будет пожара.',
  '5. Когда в 8-й комнате идёт операция — встаньте к центру, точнее на пациента. Так вы всегда сможете доставать до лекарств.',
  '6. Невидимых человечков можно убивать огнетушителем — достаточно просто пшикнуть 1 раз.',
  '7. С помощью Сканера вы можете убивать привидений. Просто наведите сканером на привидение, и оно умрёт. Без КД, если у вас класс «Секретный агент».',
  '8. Если вы видите сидячего пациента — можете его вырубить. Он потеряет сознание, отнесите его куда просит. Эта палата всегда будет с этим процентом, а смены пойдут дальше.',
  '9. Если у вас есть пистолет — вы можете стрелять с камер. Просто держите пистолет в руках и зайдите в камеры.',
  '10. Когда начался ритуал — тушите свечи каплями или кофе. Или просто выстрелите в пациента, и он убежит. Смерть не засчитается.'
];

// Интересные факты
const facts = [
  '🟡 Стажёр — единственный класс, имеющий несколько цветовых вариантов.',
  '🩺 Медсестра является продавщицей в магазине предметов. Самый дешёвый класс после Стажёра.',
  '🐑 Внешность Рона основана на старом образе Секретаря. Рон носит чемодан и имеет коричневые волосы.',
  '🦌 Парамедик, Охранник и Секретный агент — единственные классы, которые появляются с предметами.',
  '🐰 Психолог — единственный класс, который даёт не только положительные, но и отрицательные эффекты.',
  '🫎 Хирург — самый дорогой класс за Кеткоины.',
  '🐈 Секретный агент и Главная медсестра — единственные классы за робуксы. Агент — самый дорогой.',
  '🔍 Если посмотреть на Секретного агента через стеклянную дверь, его рот и нос становятся видны. Рот угловатый, в виде буквы V.'
];

// Классы
const classes = {
  'Стажёр': {
    price: 'Бесплатно',
    lvl1: 'Начинает игру с 10 бонусными единицами рассудка.',
    lvl2: 'Начинает игру с 15 бонусными единицами рассудка.',
    lvl3: 'Начинает игру с 20 бонусными единицами рассудка.',
    desc: 'Жёлтый антропоморфный кролик в белой куртке с капюшоном. Может быть розовым, синим, зелёным или жёлтым.'
  },
  'Медсестра': {
    price: '20 Кеткоинов',
    lvl1: '+1 к максимальной вместимости инвентаря.',
    lvl2: '+2 к максимальной вместимости инвентаря.',
    lvl3: '+3 к максимальной вместимости инвентаря.',
    desc: 'Розовая антропоморфная собака в голубом медицинском халате и белой шапочке с красным сердечком.'
  },
  'Секретарь': {
    price: '120 Кеткоинов',
    lvl1: 'Восстанавливает 1 единицу рассудка при регистрации пациентов.',
    lvl2: 'Восстанавливает рассудок при регистрации, +5 бонусных очков рассудка.',
    lvl3: 'Восстанавливает рассудок при регистрации, +10 бонусных очков рассудка.',
    desc: 'Фиолетовая антропоморфная овца в белой рубашке с оранжевым галстуком и больших чёрных очках.'
  },
  'Парамедик': {
    price: '250 Кеткоинов',
    lvl1: 'Начинает игру с большой скоростной колы (6 использований).',
    lvl2: 'Начинает игру с большой скоростной колы (9 использований).',
    lvl3: 'Начинает игру с большой скоростной колы (9 исп.). Восстанавливает 1 использование каждую смену.',
    desc: 'Светло-коричневый олень в тёмно-зелёной форме и неоново-зелёном жилете. На шее — стетоскоп.'
  },
  'Психолог': {
    price: '500 Кеткоинов',
    lvl1: 'Все эффекты рассудка удваиваются (отрицательные и положительные).',
    lvl2: 'Все эффекты восстановления рассудка удваиваются, 7.5% шанс игнорировать потерю рассудка.',
    lvl3: 'Все эффекты восстановления рассудка удваиваются, 15% шанс игнорировать потерю рассудка.',
    desc: 'Зелёный кролик в тёмно-зелёной рубашке и коричневых брюках, с большими круглыми очками и усами.'
  },
  'Доктор': {
    price: '900 Кеткоинов',
    lvl1: 'Восстанавливает 1 единицу рассудка при лечении пациентов.',
    lvl2: 'Восстанавливает рассудок при лечении, +15 бонусного рассудка.',
    lvl3: 'Восстанавливает рассудок при лечении, +20 бонусного рассудка.',
    desc: 'Оранжевый лось в голубом халате и белом консультационном халате. На голове — налобное зеркало.'
  },
  'Охранник': {
    price: '1250 Кеткоинов',
    lvl1: 'Начинает игру с электрошокером (5 использований).',
    lvl2: 'Начинает игру с электрошокером и развёртываемой камерой.',
    lvl3: 'Начинает игру с электрошокером и камерой. 1 использование восстанавливается каждую смену.',
    desc: 'Серый кот в тёмно-синей рубашке и чёрной шляпе с надписью «SECURITY».'
  },
  'Главная медсестра': {
    price: '190 робуксов',
    lvl1: '+3 к максимальной вместимости инвентаря.',
    lvl2: '+3 к вместимости инвентаря, +10 бонусный рассудок.',
    lvl3: '+3 к вместимости инвентаря, начало игры с перком «Особая техника».',
    desc: 'Белая кошка с серыми пятнами в голубом халате. На голове — белая шапочка с красным сердечком.'
  },
  'Хирург': {
    price: '2500 Кеткоинов',
    lvl1: 'Восстанавливает рассудок и получает кратковременное ускорение после лечения пациента.',
    lvl2: 'Восстанавливает рассудок и получает долговременное ускорение после лечения пациента.',
    lvl3: 'Удвоенное восстановление рассудка и долговременное ускорение после лечения. +10 бонусный рассудок.',
    desc: 'Коричневый лось с оранжевыми узорами на лице, в белом халате и синей шапочке.'
  },
  'Секретный агент': {
    price: '790 робуксов',
    lvl1: 'Начинает с пистолетом (20 исп.) и сканером. +2 к вместимости инвентаря.',
    lvl2: 'Пистолет имеет 24 использования и восстанавливает 1 исп. каждую смену.',
    lvl3: 'Убийство аномалий из пистолета даёт +4 к рассудку и +5 к деньгам.',
    desc: 'Чёрный кот в жилете поверх белой рубашки и чёрном галстуке. Глаза с ярко-жёлтой склерой.'
  }
};

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function getLang(uid) {
  if (!users[uid]) users[uid] = { lang: 'ru', notif: false, joined: Date.now() };
  return langs[users[uid].lang];
}

function getProfile(uid, uname) {
  const profile = userProfiles[uid] || {};
  const days = Math.floor((Date.now() - (users[uid]?.joined || Date.now())) / 86400000);
  let txt = `👤 ПРОФИЛЬ\n\n👋 Юзернейм: @${uname}\n📅 Вы в боте: ${days} ${getLang(uid).days_in_bot}`;
  if (profile.shifts) txt += `\n🔄 Смен: ${profile.shifts}`;
  if (profile.classes) txt += `\n⚔️ Классы: ${profile.classes}`;
  if (profile.ketcoins) txt += `\n💰 Кеткоинов: ${profile.ketcoins}`;
  return txt;
}

// ========== КОМАНДА /start ==========
bot.onText(/\/start/, (msg) => {
  const uid = msg.from.id;
  const uname = msg.from.username || msg.from.first_name || 'Игрок';
  if (!users[uid]) users[uid] = { lang: 'ru', notif: false, joined: Date.now() };
  
  const L = getLang(uid);
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: L.tips_btn, callback_data: 'tips' }],
        [{ text: L.classes_btn, callback_data: 'classes' }],
        [{ text: L.facts_btn, callback_data: 'facts' }],
        [{ text: L.profile_btn, callback_data: 'profile' }],
        [{ text: L.settings_btn, callback_data: 'settings' }]
      ]
    }
  };
  bot.sendMessage(msg.chat.id, L.welcome, keyboard);
});

// ========== ОБРАБОТКА КНОПОК ==========
bot.on('callback_query', (q) => {
  const uid = q.from.id;
  const L = getLang(uid);
  const d = q.data;

  // ПОЛЕЗНЫЕ СОВЕТЫ
  if (d === 'tips') {
    let txt = L.tips_title + '\n\n' + tips.join('\n\n');
    bot.sendMessage(q.message.chat.id, txt);
  }

  // КЛАССЫ
  else if (d === 'classes') {
    const classNames = Object.keys(classes);
    const keyboard = {
      reply_markup: {
        inline_keyboard: classNames.map(name => ([{ text: name, callback_data: 'class_' + name }])) + [[{ text: '🔙 Назад', callback_data: 'back' }]]
      }
    };
    bot.sendMessage(q.message.chat.id, '⚔️ ВЫБЕРИТЕ КЛАСС:', keyboard);
  }

  // КОНКРЕТНЫЙ КЛАСС
  else if (d.startsWith('class_')) {
    const name = d.replace('class_', '');
    const c = classes[name];
    if (c) {
      let txt = `⚔️ КЛАСС: ${name}\n💰 Цена: ${c.price}\n\n📊 УРОВНИ:\n🔹 Уровень 1: ${c.lvl1}\n🔹 Уровень 2: ${c.lvl2}\n🔹 Уровень 3: ${c.lvl3}\n\n👁️ ВНЕШНИЙ ВИД:\n${c.desc}`;
      bot.sendMessage(q.message.chat.id, txt);
    }
  }

  // ИНТЕРЕСНЫЕ ФАКТЫ
  else if (d === 'facts') {
    let txt = '💡 ИНТЕРЕСНЫЕ ФАКТЫ О КЛАССАХ:\n\n' + facts.join('\n\n');
    bot.sendMessage(q.message.chat.id, txt);
  }

  // ПРОФИЛЬ
  else if (d === 'profile') {
    const uname = q.from.username || q.from.first_name || 'Игрок';
    let txt = getProfile(uid, uname);
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: L.extra_btn, callback_data: 'extra' }],
          [{ text: '🔙 Назад', callback_data: 'back' }]
        ]
      }
    };
    bot.sendMessage(q.message.chat.id, txt, keyboard);
  }

  // ДОП. ИНФА
  else if (d === 'extra') {
    bot.sendMessage(q.message.chat.id, L.extra_prompt);
    users[uid].awaitingExtra = true;
  }

  // НАСТРОЙКИ
  else if (d === 'settings') {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: L.notif_btn, callback_data: 'notif' }],
          [{ text: L.lang_btn, callback_data: 'lang' }],
          [{ text: '🔙 Назад', callback_data: 'back' }]
        ]
      }
    };
    bot.sendMessage(q.message.chat.id, L.settings_title, keyboard);
  }

  // УВЕДОМЛЕНИЯ
  else if (d === 'notif') {
    users[uid].notif = !users[uid].notif;
    bot.sendMessage(q.message.chat.id, users[uid].notif ? L.notif_on : L.notif_off);
  }

  // ЯЗЫК
  else if (d === 'lang') {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🇷🇺 Русский', callback_data: 'lang_ru' }],
          [{ text: '🇬🇧 English', callback_data: 'lang_en' }],
          [{ text: '🇺🇦 Українська', callback_data: 'lang_ua' }]
        ]
      }
    };
    bot.sendMessage(q.message.chat.id, L.lang_select, keyboard);
  }

  // СМЕНА ЯЗЫКА
  else if (d.startsWith('lang_')) {
    const lang = d.replace('lang_', '');
    users[uid].lang = lang;
    bot.sendMessage(q.message.chat.id, langs[lang].lang_changed);
  }

  // НАЗАД
  else if (d === 'back') {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: L.tips_btn, callback_data: 'tips' }],
          [{ text: L.classes_btn, callback_data: 'classes' }],
          [{ text: L.facts_btn, callback_data: 'facts' }],
          [{ text: L.profile_btn, callback_data: 'profile' }],
          [{ text: L.settings_btn, callback_data: 'settings' }]
        ]
      }
    };
    bot.sendMessage(q.message.chat.id, L.welcome, keyboard);
  }

  bot.answerCallbackQuery(q.id);
});

// ========== ОБРАБОТКА ТЕКСТОВЫХ СООБЩЕНИЙ ==========
bot.on('message', (msg) => {
  const uid = msg.from.id;
  const L = getLang(uid);
  const text = msg.text?.trim();

  // Сохранение доп. инфы
  if (users[uid]?.awaitingExtra && text) {
    const parts = text.split(',').map(s => s.trim());
    if (!userProfiles[uid]) userProfiles[uid] = {};
    userProfiles[uid].shifts = parts[0] || '—';
    userProfiles[uid].classes = parts[1] || '—';
    userProfiles[uid].ketcoins = parts[2] || '—';
    users[uid].awaitingExtra = false;
    bot.sendMessage(msg.chat.id, L.extra_saved);
  }
});

console.log('🏥 Animal Hospital Бот запущен!');
