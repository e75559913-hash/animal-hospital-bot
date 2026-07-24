const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8826809113:AAG-Jz5emLF93JHy7WgZrr9q2g17oKVCSlk';
const bot = new TelegramBot(TOKEN, { polling: true });

const users = {};
const userProfiles = {};

const tips = [
  '1. Если видите подкроватного монстра — дайте ему клиновый сироп, и он исчезнет.',
  '2. Когда приходит Барни/Аномалия, которая бьёт окно, вы можете отдать кофе и не потерять его.',
  '3. Слаймов можно убирать огнетушителем, но сиропом от кашля — намного быстрее.',
  '4. Когда начался пожар — тушите его не полностью. Оставьте с краю 1 огонёк.',
  '5. Когда в 8-й комнате идёт операция — встаньте к центру на пациента.',
  '6. Невидимых человечков можно убивать огнетушителем.',
  '7. С помощью Сканера вы можете убивать привидений.',
  '8. Если вы видите сидячего пациента — можете его вырубить.',
  '9. Если у вас есть пистолет — вы можете стрелять с камер.',
  '10. Когда начался ритуал — тушите свечи каплями или кофе.'
];

const facts = [
  'Стажёр — единственный класс, имеющий несколько цветовых вариантов.',
  'Медсестра является продавщицей в магазине предметов.',
  'Внешность Рона основана на старом образе Секретаря.',
  'Парамедик, Охранник и Секретный агент — единственные классы с предметами.',
  'Психолог — единственный класс с отрицательными эффектами.',
  'Хирург — самый дорогой класс за Кеткоины.',
  'Секретный агент и Главная медсестра — единственные классы за робуксы.',
  'У Секретного агента виден рот и нос через стеклянную дверь.'
];

const classes = {
  'Стажёр': { price: 'Бесплатно', lvl1: '10 бонусных единиц рассудка.', lvl2: '15 бонусных единиц рассудка.', lvl3: '20 бонусных единиц рассудка.', desc: 'Жёлтый кролик в белой куртке.' },
  'Медсестра': { price: '20 Кеткоинов', lvl1: '+1 к инвентарю.', lvl2: '+2 к инвентарю.', lvl3: '+3 к инвентарю.', desc: 'Розовая собака в голубом халате.' },
  'Секретарь': { price: '120 Кеткоинов', lvl1: '+1 рассудка при регистрации.', lvl2: '+5 бонусных очков.', lvl3: '+10 бонусных очков.', desc: 'Фиолетовая овца в очках.' },
  'Парамедик': { price: '250 Кеткоинов', lvl1: 'Скоростная кола (6 исп.).', lvl2: 'Скоростная кола (9 исп.).', lvl3: 'Кола (9 исп.) +1 каждую смену.', desc: 'Олень в зелёной форме.' },
  'Психолог': { price: '500 Кеткоинов', lvl1: 'Эффекты рассудка x2.', lvl2: 'Восст. x2, 7.5% игнор потери.', lvl3: 'Восст. x2, 15% игнор потери.', desc: 'Зелёный кролик с очками.' },
  'Доктор': { price: '900 Кеткоинов', lvl1: '+1 рассудка при лечении.', lvl2: '+15 бонусного.', lvl3: '+20 бонусного.', desc: 'Оранжевый лось в халате.' },
  'Охранник': { price: '1250 Кеткоинов', lvl1: 'Электрошокер (5 исп.).', lvl2: 'Шокер + камера.', lvl3: 'Шокер + камера, +1 исп. в смену.', desc: 'Серый кот в шляпе.' },
  'Главная медсестра': { price: '190 робуксов', lvl1: '+3 к инвентарю.', lvl2: '+3 к инвентарю, +10 рассудка.', lvl3: '+3 к инвентарю, Особая техника.', desc: 'Белая кошка в халате.' },
  'Хирург': { price: '2500 Кеткоинов', lvl1: 'Восст. и ускорение после лечения.', lvl2: 'Долгое ускорение.', lvl3: 'x2 восст. + долгое ускорение.', desc: 'Коричневый лось в шапочке.' },
  'Секретный агент': { price: '790 робуксов', lvl1: 'Пистолет (20 исп.) + сканер.', lvl2: 'Пистолет (24 исп.) +1 в смену.', lvl3: '+4 рассудка и +5 денег за убийство.', desc: 'Чёрный кот в жилете.' }
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
  if (!users[uid]) users[uid] = { notif: false, joined: Date.now() };
  bot.sendMessage(msg.chat.id, welcomeText, mainMenu());
});

bot.on('callback_query', async (q) => {
  const uid = q.from.id;
  const d = q.data;
  const chatId = q.message.chat.id;
  const msgId = q.message.message_id;
  if (!users[uid]) users[uid] = { notif: false, joined: Date.now() };

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
      await bot.editMessageText('⚙️ Настройки:', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: `${notifIcon} Уведомления`, callback_data: 'notif' }], [{ text: '← Назад', callback_data: 'back' }]] } });
    } else if (d === 'notif') {
      users[uid].notif = !users[uid].notif;
      const notifIcon = users[uid].notif ? '✅' : '❌';
      await bot.editMessageText(`🔔 Уведомления: ${users[uid].notif ? 'включены' : 'выключены'}`, { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [[{ text: `${notifIcon} Уведомления`, callback_data: 'notif' }], [{ text: '← Назад', callback_data: 'back' }]] } });
    } else if (d === 'back') {
      await bot.editMessageText(welcomeText, { chat_id: chatId, message_id: msgId, reply_markup: mainMenu().reply_markup });
    }
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
