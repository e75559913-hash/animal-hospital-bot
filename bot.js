const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8826809113:AAG-Jz5emLF93JHy7WgZrr9q2g17oKVCSlk';
const bot = new TelegramBot(TOKEN, { polling: true });

const users = {};
const userProfiles = {};

const tips = [
  '1. Если видите подкроватного монстра — дайте ему клиновый сироп, и он исчезнет.',
  '2. Когда приходит Барни/Аномалия, которая бьёт окно, вы можете отдать кофе и не потерять его. Для этого сделайте 3 глотка. Когда уже почти нажали — выпевайте кофе. Вам засчитается, и Барни/Аномалии тоже засчитается.',
  '3. Многие знают, что Слаймов можно убирать огнетушителем. Но их также можно убирать сиропом от кашля — так они убираются намного быстрее.',
  '4. Когда начался пожар (например, в 8-й комнате) — тушите его не полностью. Оставьте с краю 1 огонёк, и в этой комнате больше никогда не будет пожара.',
  '5. Когда в 8-й комнате идёт операция — встаньте к центру, точнее на пациента. Так вы всегда сможете доставать до лекарств.',
  '6. Невидимых человечков можно убивать огнетушителем — достаточно просто пшикнуть 1 раз.',
  '7. С помощью Сканера вы можете убивать привидений. Просто наведите сканером на привидение, и оно умрёт. Без КД, если у вас класс Секретный агент.',
  '8. Если вы видите сидячего пациента — можете его вырубить. Он потеряет сознание, отнесите его куда просит. Эта палата всегда будет с этим процентом, а смены пойдут дальше.',
  '9. Если у вас есть пистолет — вы можете стрелять с камер. Просто держите пистолет в руках и зайдите в камеры.',
  '10. Когда начался ритуал — тушите свечи каплями или кофе. Или просто выстрелите в пациента, и он убежит. Смерть не засчитается.'
];

const facts = [
  'Стажёр — единственный класс, имеющий несколько цветовых вариантов.',
  'Медсестра является продавщицей в магазине предметов. Самый дешёвый класс после Стажёра.',
  'Внешность Рона основана на старом образе Секретаря.',
  'Парамедик, Охранник и Секретный агент — единственные классы, которые появляются с предметами.',
  'Психолог — единственный класс, который даёт не только положительные, но и отрицательные эффекты.',
  'Хирург — самый дорогой класс за Кеткоины.',
  'Секретный агент и Главная медсестра — единственные классы за робуксы.',
  'Если посмотреть на Секретного агента через стеклянную дверь, его рот и нос становятся видны.'
];

const classes = {
  'Стажёр': { price: 'Бесплатно', lvl1: 'Начинает игру с 10 бонусными единицами рассудка.', lvl2: 'Начинает игру с 15 бонусными единицами рассудка.', lvl3: 'Начинает игру с 20 бонусными единицами рассудка.', desc: 'Жёлтый антропоморфный кролик в белой куртке с капюшоном.' },
  'Медсестра': { price: '20 Кеткоинов', lvl1: '+1 к максимальной вместимости инвентаря.', lvl2: '+2 к максимальной вместимости инвентаря.', lvl3: '+3 к максимальной вместимости инвентаря.', desc: 'Розовая антропоморфная собака в голубом медицинском халате и белой шапочке с красным сердечком.' },
  'Секретарь': { price: '120 Кеткоинов', lvl1: 'Восстанавливает 1 единицу рассудка при регистрации пациентов.', lvl2: 'Восстанавливает рассудок при регистрации, +5 бонусных очков рассудка.', lvl3: 'Восстанавливает рассудок при регистрации, +10 бонусных очков рассудка.', desc: 'Фиолетовая антропоморфная овца в белой рубашке с оранжевым галстуком и больших чёрных очках.' },
  'Парамедик': { price: '250 Кеткоинов', lvl1: 'Начинает игру с большой скоростной колы (6 использований).', lvl2: 'Начинает игру с большой скоростной колы (9 использований).', lvl3: 'Начинает игру с большой скоростной колы (9 исп.). Восстанавливает 1 использование каждую смену.', desc: 'Светло-коричневый олень в тёмно-зелёной форме и неоново-зелёном жилете.' },
  'Психолог': { price: '500 Кеткоинов', lvl1: 'Все эффекты рассудка удваиваются (отрицательные и положительные).', lvl2: 'Все эффекты восстановления рассудка удваиваются, 7.5% шанс игнорировать потерю рассудка.', lvl3: 'Все эффекты восстановления рассудка удваиваются, 15% шанс игнорировать потерю рассудка.', desc: 'Зелёный кролик в тёмно-зелёной рубашке и коричневых брюках, с большими круглыми очками и усами.' },
  'Доктор': { price: '900 Кеткоинов', lvl1: 'Восстанавливает 1 единицу рассудка при лечении пациентов.', lvl2: 'Восстанавливает рассудок при лечении, +15 бонусного рассудка.', lvl3: 'Восстанавливает рассудок при лечении, +20 бонусного рассудка.', desc: 'Оранжевый лось в голубом халате и белом консультационном халате.' },
  'Охранник': { price: '1250 Кеткоинов', lvl1: 'Начинает игру с электрошокером (5 использований).', lvl2: 'Начинает игру с электрошокером и развёртываемой камерой.', lvl3: 'Начинает игру с электрошокером и камерой. 1 использование восстанавливается каждую смену.', desc: 'Серый кот в тёмно-синей рубашке и чёрной шляпе с надписью SECURITY.' },
  'Главная медсестра': { price: '190 робуксов', lvl1: '+3 к максимальной вместимости инвентаря.', lvl2: '+3 к вместимости инвентаря, +10 бонусный рассудок.', lvl3: '+3 к вместимости инвентаря, начало игры с перком Особая техника.', desc: 'Белая кошка с серыми пятнами в голубом халате.' },
  'Хирург': { price: '2500 Кеткоинов', lvl1: 'Восстанавливает рассудок и получает кратковременное ускорение после лечения пациента.', lvl2: 'Восстанавливает рассудок и получает долговременное ускорение после лечения пациента.', lvl3: 'Удвоенное восстановление рассудка и долговременное ускорение после лечения. +10 бонусный рассудок.', desc: 'Коричневый лось с оранжевыми узорами на лице, в белом халате и синей шапочке.' },
  'Секретный агент': { price: '790 робуксов', lvl1: 'Начинает с пистолетом (20 исп.) и сканером. +2 к вместимости инвентаря.', lvl2: 'Пистолет имеет 24 использования и восстанавливает 1 исп. каждую смену.', lvl3: 'Убийство аномалий из пистолета даёт +4 к рассудку и +5 к деньгам.', desc: 'Чёрный кот в жилете поверх белой рубашки и чёрном галстуке.' }
};

const welcomeText = `Добро пожаловать в Animal Hospital Bot! :3

Здесь собраны полезные советы, информация о классах и другие функции :)

Используйте кнопки ниже для навигации ^_^

Наш Телеграм Канал: Новости игры и Бота — @NewsAnimalHospitabot`;

const adText = '\n\n— — —\nНаш Телеграм Канал: Новости игры и Бота — @NewsAnimalHospitabot';

function getProfile(uid, uname) {
  const profile = userProfiles[uid] || {};
  const days = Math.floor((Date.now() - (users[uid]?.joined || Date.now())) / 86400000);
  let txt = `👤 Профиль\n\n😎 Имя: @${uname}\n📅 Дней в боте: ${days}`;
  if (profile.shifts) txt += `\n🔄 Смен: ${profile.shifts}`;
  if (profile.classes) txt += `\n⚔️ Классы: ${profile.classes}`;
  if (profile.ketcoins) txt += `\n💰 Кеткоинов: ${profile.ketcoins}`;
  return txt;
}

function mainMenu() {
  return {
    reply_markup: { inline_keyboard: [
      [{ text: '💡 Полезные советы', callback_data: 'tips' }],
      [{ text: '⚔️ Способности классов', callback_data: 'classes' }],
      [{ text: '📚 Интересные факты', callback_data: 'facts' }],
      [{ text: '👤 Профиль', callback_data: 'profile' }],
      [{ text: '⚙️ Настройки', callback_data: 'settings' }]
    ]}
  };
}

bot.onText(/\/start/, (msg) => {
  const uid = msg.from.id;
  if (!users[uid]) users[uid] = { lang: 'ru', notif: false, joined: Date.now() };
  bot.sendMessage(msg.chat.id, welcomeText, mainMenu());
});

bot.on('callback_query', async (q) => {
  const uid = q.from.id;
  const d = q.data;
  const chatId = q.message.chat.id;
  const msgId = q.message.message_id;
  if (!users[uid]) users[uid] = { lang: 'ru', notif: false, joined: Date.now() };

  try {
    if (d === 'tips') {
      await bot.editMessageText('💡 Полезные советы:\n\n' + tips.join('\n\n') + adText, { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← Назад', callback_data: 'back' }]] } });
    } else if (d === 'classes') {
      const classNames = Object.keys(classes);
      const buttons = [];
      for (let i = 0; i < classNames.length; i += 2) {
        buttons.push([{ text: classNames[i], callback_data: 'class_' + classNames[i] }].concat(classNames[i + 1] ? [{ text: classNames[i + 1], callback_data: 'class_' + classNames[i + 1] }] : []));
      }
      buttons.push([{ text: '← Назад', callback_data: 'back' }]);
      await bot.editMessageText('⚔️ Выберите класс:' + adText, { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: buttons } });
    } else if (d.startsWith('class_')) {
      const name = d.replace('class_', '');
      const c = classes[name];
      if (c) {
        await bot.editMessageText(`⚔️ ${name}\n💰 Цена: ${c.price}\n\n📊 Уровни:\n🔹 1 ур.: ${c.lvl1}\n🔹 2 ур.: ${c.lvl2}\n🔹 3 ур.: ${c.lvl3}\n\n👁️ Внешний вид: ${c.desc}`, { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← К списку классов', callback_data: 'classes' }]] } });
      }
    } else if (d === 'facts') {
      await bot.editMessageText('📚 Интересные факты:\n\n' + facts.join('\n\n') + adText, { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← Назад', callback_data: 'back' }]] } });
    } else if (d === 'profile') {
      const uname = q.from.username || q.from.first_name || 'Игрок';
      await bot.editMessageText(getProfile(uid, uname), { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '📝 Указать доп. информацию', callback_data: 'extra' }], [{ text: '← Назад', callback_data: 'back' }]] } });
    } else if (d === 'extra') {
      await bot.editMessageText('📝 Введите через запятую:\n1. Количество смен\n2. Ваши классы\n3. Количество Кеткоинов\n\nПример: 150, Стажёр Медсестра, 5000', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← Назад', callback_data: 'profile' }]] } });
      users[uid].awaitingExtra = true;
    } else if (d === 'settings') {
      const notifIcon = users[uid].notif ? '✅' : '❌';
      await bot.editMessageText('⚙️ Настройки:', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: `${notifIcon} Уведомления`, callback_data: 'notif' }], [{ text: '🌐 Язык', callback_data: 'lang' }], [{ text: '← Назад', callback_data: 'back' }]] } });
    } else if (d === 'notif') {
      users[uid].notif = !users[uid].notif;
      const notifIcon = users[uid].notif ? '✅' : '❌';
      await bot.editMessageText(`🔔 Уведомления: ${users[uid].notif ? 'включены' : 'выключены'}`, { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: `${notifIcon} Уведомления`, callback_data: 'notif' }], [{ text: '🌐 Язык', callback_data: 'lang' }], [{ text: '← Назад', callback_data: 'back' }]] } });
    } else if (d === 'lang') {
      await bot.editMessageText('🌐 Выберите язык:', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '🇷🇺 Русский', callback_data: 'lang_ru' }], [{ text: '🇬🇧 English', callback_data: 'lang_en' }], [{ text: '🇺🇦 Українська', callback_data: 'lang_ua' }], [{ text: '🇰🇿 Қазақша', callback_data: 'lang_kz' }], [{ text: '← Назад', callback_data: 'settings' }]] } });
    } else if (d === 'lang_ru') { users[uid].lang = 'ru'; await bot.editMessageText('✅ Язык: 🇷🇺 Русский', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← Назад', callback_data: 'settings' }]] } }); }
    else if (d === 'lang_en') { users[uid].lang = 'en'; await bot.editMessageText('✅ Language: 🇬🇧 English', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← Назад', callback_data: 'settings' }]] } }); }
    else if (d === 'lang_ua') { users[uid].lang = 'ua'; await bot.editMessageText('✅ Мова: 🇺🇦 Українська', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← Назад', callback_data: 'settings' }]] } }); }
    else if (d === 'lang_kz') { users[uid].lang = 'kz'; await bot.editMessageText('✅ Тіл: 🇰🇿 Қазақша', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: '← Назад', callback_data: 'settings' }]] } }); }
    else if (d === 'back') { await bot.editMessageText(welcomeText, { chat_id: chatId, message_id: msgId, reply_markup: mainMenu().reply_markup }); }
  } catch (e) { console.log('Ошибка:', e.message); }
  bot.answerCallbackQuery(q.id);
});

bot.on('message', (msg) => {
  const uid = msg.from.id;
  const text = msg.text?.trim();
  if (users[uid]?.awaitingExtra && text && !text.startsWith('/')) {
    const parts = text.split(',').map(s => s.trim());
    if (!userProfiles[uid]) userProfiles[uid] = {};
    userProfiles[uid].shifts = parts[0] || '—';
    userProfiles[uid].classes = parts[1] || '—';
    userProfiles[uid].ketcoins = parts[2] || '—';
    users[uid].awaitingExtra = false;
    bot.sendMessage(msg.chat.id, '✅ Информация сохранена!', { reply_markup: { inline_keyboard: [[{ text: '← Назад в профиль', callback_data: 'profile' }]] } });
  }
});

console.log('Animal Hospital Bot запущен');
