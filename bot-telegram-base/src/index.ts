import { Telegraf, Context, Markup, session } from 'telegraf';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv';
import { BotContext } from './types';

// Load environment variables
dotenv.config();

// Check if bot token is provided
if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

// Create bot instance
const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

// Session middleware for storing user data
bot.use(session());

// Initialize session data
bot.use(async (ctx, next) => {
  if (!ctx.session) {
    ctx.session = {};
  }
  await next();
});

// ==================== BASIC COMMANDS ====================

// Start command
bot.command('start', async (ctx) => {
  const welcomeMessage = `
🤖 Welcome to the Telegraf.js Demo Bot!

This bot demonstrates various Telegraf.js features:

📋 Available commands:
/start - Show this welcome message
/help - Show help information
/buttons - Show inline keyboard buttons
/menu - Show main menu
/photo - Send a sample photo
/document - Send a sample document
/contact - Request contact information
/location - Request location
/poll - Create a poll
/quiz - Create a quiz
/echo - Echo your message
/weather - Simulate weather info
/calculator - Simple calculator
/game - Play a simple game

Try them out! 🎉
  `;
  
  await ctx.reply(welcomeMessage);
});

// Help command
bot.command('help', async (ctx) => {
  const helpMessage = `
📚 Bot Help Guide

🔹 Basic Commands:
• /start - Welcome message
• /help - This help message
• /echo [text] - Echo your message

🔹 Interactive Features:
• /buttons - Inline keyboard buttons
• /menu - Main menu with options
• /contact - Request contact info
• /location - Request location

🔹 Media Features:
• /photo - Send sample photo
• /document - Send sample document

🔹 Fun Features:
• /poll - Create a poll
• /quiz - Create a quiz
• /weather - Weather simulation
• /calculator - Simple calculator
• /game - Simple number game

🔹 Advanced Features:
• Reply to any message to echo it
• Send photos, documents, or voice messages
• Use inline keyboards for interaction

Need help? Just ask! 😊
  `;
  
  await ctx.reply(helpMessage);
});

// ==================== INLINE KEYBOARDS ====================

// Buttons command
bot.command('buttons', async (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🔍 Search', 'search'),
      Markup.button.callback('📊 Stats', 'stats')
    ],
    [
      Markup.button.callback('⚙️ Settings', 'settings'),
      Markup.button.callback('❓ Help', 'help_btn')
    ],
    [
      Markup.button.url('🌐 Visit Website', 'https://telegraf.js.org'),
      Markup.button.callback('📞 Contact', 'contact')
    ]
  ]);

  await ctx.reply('Choose an option:', keyboard);
});

// Menu command with more complex keyboard
bot.command('menu', async (ctx) => {
  const mainMenu = Markup.inlineKeyboard([
    [
      Markup.button.callback('📱 Media', 'media_menu'),
      Markup.button.callback('🎮 Games', 'games_menu')
    ],
    [
      Markup.button.callback('🔧 Tools', 'tools_menu'),
      Markup.button.callback('ℹ️ Info', 'info_menu')
    ],
    [
      Markup.button.callback('🔙 Back', 'back_to_main')
    ]
  ]);

  await ctx.reply('🎯 Main Menu - Select a category:', mainMenu);
});

// ==================== CALLBACK QUERIES ====================

// Handle callback queries
bot.action('search', async (ctx) => {
  await ctx.answerCbQuery('🔍 Search functionality coming soon!');
  await ctx.editMessageText('🔍 Search: This feature is under development.');
});

bot.action('stats', async (ctx) => {
  const stats = `
📊 Bot Statistics:
• Total users: 1,234
• Messages today: 567
• Commands used: 890
• Uptime: 99.9%
  `;
  await ctx.answerCbQuery('📊 Statistics loaded!');
  await ctx.editMessageText(stats);
});

bot.action('settings', async (ctx) => {
  const settingsKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🔔 Notifications', 'toggle_notifications'),
      Markup.button.callback('🌍 Language', 'change_language')
    ],
    [
      Markup.button.callback('🎨 Theme', 'change_theme'),
      Markup.button.callback('🔒 Privacy', 'privacy_settings')
    ],
    [
      Markup.button.callback('🔙 Back to Menu', 'back_to_main')
    ]
  ]);

  await ctx.editMessageText('⚙️ Settings Menu:', settingsKeyboard);
});

bot.action('help_btn', async (ctx) => {
  await ctx.answerCbQuery('❓ Help information');
  await ctx.editMessageText('❓ Need help? Use /help command for detailed information.');
});

bot.action('contact', async (ctx) => {
  await ctx.answerCbQuery('📞 Contact information');
  await ctx.editMessageText('📞 Contact us at: support@example.com');
});

bot.action('media_menu', async (ctx) => {
  const mediaKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('📷 Photo', 'send_photo'),
      Markup.button.callback('📄 Document', 'send_document')
    ],
    [
      Markup.button.callback('🎵 Audio', 'send_audio'),
      Markup.button.callback('🎬 Video', 'send_video')
    ],
    [
      Markup.button.callback('🔙 Back to Main', 'back_to_main')
    ]
  ]);

  await ctx.editMessageText('📱 Media Menu:', mediaKeyboard);
});

bot.action('games_menu', async (ctx) => {
  const gamesKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🎲 Random Number', 'play_number_game'),
      Markup.button.callback('🎯 Quiz', 'play_quiz')
    ],
    [
      Markup.button.callback('🔙 Back to Main', 'back_to_main')
    ]
  ]);

  await ctx.editMessageText('🎮 Games Menu:', gamesKeyboard);
});

bot.action('tools_menu', async (ctx) => {
  const toolsKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🧮 Calculator', 'calculator'),
      Markup.button.callback('🌤️ Weather', 'weather')
    ],
    [
      Markup.button.callback('🔙 Back to Main', 'back_to_main')
    ]
  ]);

  await ctx.editMessageText('🔧 Tools Menu:', toolsKeyboard);
});

bot.action('info_menu', async (ctx) => {
  const infoKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('ℹ️ About', 'about'),
      Markup.button.callback('📈 Version', 'version')
    ],
    [
      Markup.button.callback('🔙 Back to Main', 'back_to_main')
    ]
  ]);

  await ctx.editMessageText('ℹ️ Info Menu:', infoKeyboard);
});

bot.action('back_to_main', async (ctx) => {
  const mainMenu = Markup.inlineKeyboard([
    [
      Markup.button.callback('📱 Media', 'media_menu'),
      Markup.button.callback('🎮 Games', 'games_menu')
    ],
    [
      Markup.button.callback('🔧 Tools', 'tools_menu'),
      Markup.button.callback('ℹ️ Info', 'info_menu')
    ]
  ]);

  await ctx.editMessageText('🎯 Main Menu - Select a category:', mainMenu);
});

// ==================== MEDIA COMMANDS ====================

// Photo command
bot.command('photo', async (ctx) => {
  await ctx.replyWithPhoto(
    'https://picsum.photos/400/300',
    {
      caption: '📷 Here\'s a random photo for you!',
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback('🔄 New Photo', 'new_photo'),
          Markup.button.callback('❤️ Like', 'like_photo')
        ]
      ]).reply_markup
    }
  );
});

// Document command
bot.command('document', async (ctx) => {
  await ctx.replyWithDocument(
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    {
      caption: '📄 Here\'s a sample document!',
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback('📥 Download', 'download_doc'),
          Markup.button.callback('📋 Info', 'doc_info')
        ]
      ]).reply_markup
    }
  );
});

// ==================== INTERACTIVE FEATURES ====================

// Contact command
bot.command('contact', async (ctx) => {
  const contactKeyboard = Markup.keyboard([
    [Markup.button.contactRequest('📞 Share Contact')],
    [Markup.button.text('❌ Cancel')]
  ]).resize();

  await ctx.reply('Please share your contact information:', contactKeyboard);
});

// Location command
bot.command('location', async (ctx) => {
  const locationKeyboard = Markup.keyboard([
    [Markup.button.locationRequest('📍 Share Location')],
    [Markup.button.text('❌ Cancel')]
  ]).resize();

  await ctx.reply('Please share your location:', locationKeyboard);
});

// ==================== POLLS AND QUIZZES ====================

// Poll command
bot.command('poll', async (ctx) => {
  await ctx.replyWithPoll(
    'What\'s your favorite programming language?',
    ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'],
    {
      is_anonymous: false,
      allows_multiple_answers: false
    }
  );
});

// Quiz command
bot.command('quiz', async (ctx) => {
  await ctx.replyWithQuiz(
    'What does HTML stand for?',
    ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
    {
      correct_option_id: 0,
      explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.'
    }
  );
});

// ==================== UTILITY COMMANDS ====================

// Echo command
bot.command('echo', async (ctx) => {
  const text = ctx.message.text.slice(6); // Remove '/echo ' from the message
  if (text) {
    await ctx.reply(`🔄 Echo: ${text}`);
  } else {
    await ctx.reply('Please provide text to echo. Usage: /echo [your text]');
  }
});

// Weather command (real data)
bot.command('weather', async (ctx) => {
  try {
    // Extract city from command args or use default
    const args = ctx.message.text.split(' ').slice(1);
    const city = args.length > 0 ? args.join(' ') : 'Jakarta Selatan';
    
    await ctx.reply('🌡️ Getting weather data...');
    
    const weatherData = await getWeatherData(city);
    
    if (!weatherData) {
      await ctx.reply(`❌ Could not get weather data for "${city}". Please check the city name and try again.\n\nUsage: /weather [city name]\nExample: /weather Jakarta`);
      return;
    }

    const weatherMessage = `
🌤️ Weather Report for ${weatherData.location}

🌡️ Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
☁️ Condition: ${weatherData.condition}
💧 Humidity: ${weatherData.humidity}%
💨 Wind: ${weatherData.windSpeed} m/s ${weatherData.windDirection}
🌅 Sunrise: ${weatherData.sunrise}
🌇 Sunset: ${weatherData.sunset}
👁️ Visibility: ${weatherData.visibility} km
🏙️ Pressure: ${weatherData.pressure} hPa

📍 Coordinates: ${weatherData.coordinates}
⏰ Local time: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
    `;

    const weatherKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('🔄 Refresh', `weather_refresh_${encodeURIComponent(city)}`),
        Markup.button.callback('📍 Default Location', 'weather_default')
      ],
      [
        Markup.button.callback('🌍 Other Cities', 'weather_other_cities')
      ]
    ]);

    await ctx.reply(weatherMessage.trim(), weatherKeyboard);
  } catch (error) {
    console.error('Weather command error:', error);
    await ctx.reply('❌ Sorry, there was an error getting weather data. Please try again later.');
  }
});

// Weather API types
interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind?: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  visibility?: number;
}

// Weather helper function
async function getWeatherData(city: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.error('OPENWEATHER_API_KEY not found in environment variables');
      return null;
    }

    // Get coordinates first
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      console.error('Geocoding API error:', geoResponse.status);
      return null;
    }
    
    const geoData = await geoResponse.json() as GeocodingResponse[];
    
    if (!geoData || geoData.length === 0) {
      console.error('No location found for:', city);
      return null;
    }

    const { lat, lon, name, country, state } = geoData[0];
    
    // Get weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      console.error('Weather API error:', weatherResponse.status);
      return null;
    }
    
    const weather = await weatherResponse.json() as WeatherResponse;

    // Format location name
    const locationParts = [name];
    if (state && state !== name) locationParts.push(state);
    if (country) locationParts.push(country);
    const location = locationParts.join(', ');

    // Get wind direction
    const getWindDirection = (degrees: number) => {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      return directions[Math.round(degrees / 22.5) % 16];
    };

    return {
      location,
      temperature: Math.round(weather.main.temp),
      feelsLike: Math.round(weather.main.feels_like),
      condition: weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1),
      humidity: weather.main.humidity,
      windSpeed: Math.round(weather.wind?.speed || 0),
      windDirection: weather.wind?.deg ? getWindDirection(weather.wind.deg) : 'N/A',
      sunrise: new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      }),
      sunset: new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      }),
      visibility: weather.visibility ? Math.round(weather.visibility / 1000) : 'N/A',
      pressure: weather.main.pressure,
      coordinates: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Calculator command
bot.command('calculator', async (ctx) => {
  const calcKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('7', 'calc_7'),
      Markup.button.callback('8', 'calc_8'),
      Markup.button.callback('9', 'calc_9'),
      Markup.button.callback('÷', 'calc_divide')
    ],
    [
      Markup.button.callback('4', 'calc_4'),
      Markup.button.callback('5', 'calc_5'),
      Markup.button.callback('6', 'calc_6'),
      Markup.button.callback('×', 'calc_multiply')
    ],
    [
      Markup.button.callback('1', 'calc_1'),
      Markup.button.callback('2', 'calc_2'),
      Markup.button.callback('3', 'calc_3'),
      Markup.button.callback('-', 'calc_subtract')
    ],
    [
      Markup.button.callback('0', 'calc_0'),
      Markup.button.callback('.', 'calc_decimal'),
      Markup.button.callback('=', 'calc_equals'),
      Markup.button.callback('+', 'calc_add')
    ],
    [
      Markup.button.callback('C', 'calc_clear')
    ]
  ]);

  await ctx.reply('🧮 Calculator\n\n0', calcKeyboard);
});

// Game command
bot.command('game', async (ctx) => {
  if (!ctx.session) ctx.session = {};
  if (!ctx.session.gameState) {
    ctx.session.gameState = {
      secretNumber: Math.floor(Math.random() * 100) + 1,
      attempts: 0,
      maxAttempts: 10
    };
  }

  const gameKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('1-25', 'game_1_25'),
      Markup.button.callback('26-50', 'game_26_50'),
      Markup.button.callback('51-75', 'game_51_75'),
      Markup.button.callback('76-100', 'game_76_100')
    ],
    [
      Markup.button.callback('🔄 New Game', 'game_new'),
      Markup.button.callback('❌ Give Up', 'game_giveup')
    ]
  ]);

  await ctx.reply(
    `🎮 Number Guessing Game!\n\nI'm thinking of a number between 1 and 100.\nYou have ${ctx.session.gameState.maxAttempts - ctx.session.gameState.attempts} attempts left.\n\nChoose a range:`,
    gameKeyboard
  );
});

// ==================== MESSAGE HANDLERS ====================

// Handle text messages (echo functionality)
bot.on(message('text'), async (ctx) => {
  const text = ctx.message.text;
  
  // Ignore commands
  if (text.startsWith('/')) {
    return;
  }

  // Handle special text responses
  switch (text.toLowerCase()) {
    case 'hello':
    case 'hi':
      await ctx.reply('👋 Hello! How can I help you today?');
      break;
    case 'bye':
    case 'goodbye':
      await ctx.reply('👋 Goodbye! Have a great day!');
      break;
    case 'thanks':
    case 'thank you':
      await ctx.reply('😊 You\'re welcome!');
      break;
    case '❌ cancel':
      await ctx.reply('❌ Cancelled.', Markup.removeKeyboard());
      break;
    default:
      // Echo the message
      await ctx.reply(`🔄 You said: ${text}`);
  }
});

// Handle contact messages
bot.on(message('contact'), async (ctx) => {
  const contact = ctx.message.contact;
  await ctx.reply(
    `📞 Contact received!\n\nName: ${contact.first_name} ${contact.last_name || ''}\nPhone: ${contact.phone_number}`,
    Markup.removeKeyboard()
  );
});

// Handle location messages
bot.on(message('location'), async (ctx) => {
  const location = ctx.message.location;
  await ctx.reply(
    `📍 Location received!\n\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`,
    Markup.removeKeyboard()
  );
});

// Handle photo messages
bot.on(message('photo'), async (ctx) => {
  const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Get the largest photo
  await ctx.reply(
    `📷 Nice photo! File ID: ${photo.file_id}\nSize: ${photo.file_size} bytes`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback('🔄 Get File', 'get_photo_file'),
        Markup.button.callback('💾 Save Info', 'save_photo_info')
      ]
    ])
  );
});

// Handle document messages
bot.on(message('document'), async (ctx) => {
  const document = ctx.message.document;
  await ctx.reply(
    `📄 Document received!\n\nName: ${document.file_name}\nType: ${document.mime_type}\nSize: ${document.file_size} bytes`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback('🔄 Get File', 'get_doc_file'),
        Markup.button.callback('💾 Save Info', 'save_doc_info')
      ]
    ])
  );
});

// Handle voice messages
bot.on(message('voice'), async (ctx) => {
  const voice = ctx.message.voice;
  await ctx.reply(
    `🎤 Voice message received!\n\nDuration: ${voice.duration} seconds\nSize: ${voice.file_size} bytes`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback('🔄 Get File', 'get_voice_file'),
        Markup.button.callback('💾 Save Info', 'save_voice_info')
      ]
    ])
  );
});

// ==================== ERROR HANDLING ====================

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('❌ An error occurred. Please try again later.');
});

// ==================== BOT LAUNCH ====================

// Launch bot
bot.launch()
  .then(() => {
    console.log('🤖 Bot is running...');
    console.log('📱 Use /start to begin');
  })
  .catch((err) => {
    console.error('❌ Error starting bot:', err);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Export bot for testing
export default bot; 

// ==================== GAME CALLBACK HANDLERS ====================

// Game range selection handlers
bot.action('game_1_25', async (ctx) => {
  await handleGameGuess(ctx, 1, 25);
});

bot.action('game_26_50', async (ctx) => {
  await handleGameGuess(ctx, 26, 50);
});

bot.action('game_51_75', async (ctx) => {
  await handleGameGuess(ctx, 51, 75);
});

bot.action('game_76_100', async (ctx) => {
  await handleGameGuess(ctx, 76, 100);
});

bot.action('game_new', async (ctx) => {
  if (!ctx.session) ctx.session = {};
  ctx.session.gameState = {
    secretNumber: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    maxAttempts: 10
  };

  const gameKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('1-25', 'game_1_25'),
      Markup.button.callback('26-50', 'game_26_50'),
      Markup.button.callback('51-75', 'game_51_75'),
      Markup.button.callback('76-100', 'game_76_100')
    ],
    [
      Markup.button.callback('🔄 New Game', 'game_new'),
      Markup.button.callback('❌ Give Up', 'game_giveup')
    ]
  ]);

  await ctx.editMessageText(
    `🎮 New Game Started!\n\nI'm thinking of a number between 1 and 100.\nYou have ${ctx.session.gameState.maxAttempts} attempts left.\n\nChoose a range:`,
    gameKeyboard
  );
});

bot.action('game_giveup', async (ctx) => {
  if (!ctx.session || !ctx.session.gameState) {
    await ctx.answerCbQuery('No active game!');
    return;
  }

  const secretNumber = ctx.session.gameState.secretNumber;
  ctx.session.gameState = undefined;

  await ctx.editMessageText(
    `😔 Game Over!\n\nThe secret number was: ${secretNumber}\n\nThanks for playing! Use /game to start a new game.`
  );
});

// Game helper function
async function handleGameGuess(ctx: Context & { session?: any }, min: number, max: number) {
  if (!ctx.session || !ctx.session.gameState) {
    await ctx.answerCbQuery('No active game!');
    return;
  }

  const gameState = ctx.session.gameState;
  const secretNumber = gameState.secretNumber;
  gameState.attempts++;

  let message = '';
  let keyboard;

  // Check if the secret number is in the guessed range
  if (secretNumber >= min && secretNumber <= max) {
    // Correct range - narrow it down further
    if (max - min <= 3) {
      // Final range - show individual numbers
      const numbers = [];
      for (let i = min; i <= max; i++) {
        numbers.push(Markup.button.callback(i.toString(), `game_final_${i}`));
      }
      
      keyboard = Markup.inlineKeyboard([
        numbers,
        [
          Markup.button.callback('🔄 New Game', 'game_new'),
          Markup.button.callback('❌ Give Up', 'game_giveup')
        ]
      ]);

      message = `🎯 Getting close! The number is between ${min} and ${max}.\nAttempts left: ${gameState.maxAttempts - gameState.attempts}\n\nPick the exact number:`;
    } else {
      // Split the range
      const mid1 = min + Math.floor((max - min) / 3);
      const mid2 = min + Math.floor(2 * (max - min) / 3);

      keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(`${min}-${mid1}`, `game_${min}_${mid1}`),
          Markup.button.callback(`${mid1 + 1}-${mid2}`, `game_${mid1 + 1}_${mid2}`),
          Markup.button.callback(`${mid2 + 1}-${max}`, `game_${mid2 + 1}_${max}`)
        ],
        [
          Markup.button.callback('🔄 New Game', 'game_new'),
          Markup.button.callback('❌ Give Up', 'game_giveup')
        ]
      ]);

      message = `🎯 Good guess! The number is between ${min} and ${max}.\nAttempts left: ${gameState.maxAttempts - gameState.attempts}\n\nNarrow it down:`;
    }
  } else {
    // Wrong range
    if (gameState.attempts >= gameState.maxAttempts) {
      // Game over
      ctx.session.gameState = undefined;
      message = `🎮 Game Over!\n\nYou've used all your attempts. The secret number was: ${secretNumber}\n\nThanks for playing! Use /game to start a new game.`;
      try {
        await ctx.editMessageText(message);
      } catch (error: any) {
        if (error.response?.error_code === 400 && 
            error.response?.description?.includes('message is not modified')) {
          return;
        }
        throw error;
      }
      return;
    }

    keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('1-25', 'game_1_25'),
        Markup.button.callback('26-50', 'game_26_50'),
        Markup.button.callback('51-75', 'game_51_75'),
        Markup.button.callback('76-100', 'game_76_100')
      ],
      [
        Markup.button.callback('🔄 New Game', 'game_new'),
        Markup.button.callback('❌ Give Up', 'game_giveup')
      ]
    ]);

    const hint = secretNumber < min ? 'too high' : 'too low';
    message = `❌ Wrong! The number is not between ${min} and ${max} (your guess was ${hint}).\nAttempts left: ${gameState.maxAttempts - gameState.attempts}\n\nTry again:`;
  }

  try {
    await ctx.editMessageText(message, keyboard);
  } catch (error: any) {
    if (error.response?.error_code === 400 && 
        error.response?.description?.includes('message is not modified')) {
      return;
    }
    throw error;
  }
}

// Handle final number guesses
bot.action(/^game_final_(\d+)$/, async (ctx) => {
  if (!ctx.session || !ctx.session.gameState) {
    await ctx.answerCbQuery('No active game!');
    return;
  }

  const guessedNumber = parseInt(ctx.match[1]);
  const secretNumber = ctx.session.gameState.secretNumber;
  const attempts = ctx.session.gameState.attempts + 1;

  ctx.session.gameState = undefined;

  if (guessedNumber === secretNumber) {
    await ctx.editMessageText(
      `🎉 Congratulations!\n\nYou guessed the number ${secretNumber} correctly in ${attempts} attempts!\n\nWell done! Use /game to play again.`
    );
  } else {
    await ctx.editMessageText(
      `😔 So close!\n\nYou guessed ${guessedNumber}, but the number was ${secretNumber}.\nYou used ${attempts} attempts.\n\nBetter luck next time! Use /game to play again.`
    );
  }
});

// Handle dynamic range actions
bot.action(/^game_(\d+)_(\d+)$/, async (ctx) => {
  const min = parseInt(ctx.match[1]);
  const max = parseInt(ctx.match[2]);
  await handleGameGuess(ctx, min, max);
});

// ==================== WEATHER CALLBACK HANDLERS ====================

// Weather refresh handler
bot.action(/^weather_refresh_(.+)$/, async (ctx) => {
  try {
    const city = decodeURIComponent(ctx.match[1]);
    await ctx.answerCbQuery('🔄 Refreshing weather data...');
    
    const weatherData = await getWeatherData(city);
    
    if (!weatherData) {
      await ctx.editMessageText(`❌ Could not get weather data for "${city}". Please try again later.`);
      return;
    }

    const weatherMessage = `
🌤️ Weather Report for ${weatherData.location}

🌡️ Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
☁️ Condition: ${weatherData.condition}
💧 Humidity: ${weatherData.humidity}%
💨 Wind: ${weatherData.windSpeed} m/s ${weatherData.windDirection}
🌅 Sunrise: ${weatherData.sunrise}
🌇 Sunset: ${weatherData.sunset}
👁️ Visibility: ${weatherData.visibility} km
🏙️ Pressure: ${weatherData.pressure} hPa

📍 Coordinates: ${weatherData.coordinates}
⏰ Local time: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
    `;

    const weatherKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('🔄 Refresh', `weather_refresh_${encodeURIComponent(city)}`),
        Markup.button.callback('📍 Default Location', 'weather_default')
      ],
      [
        Markup.button.callback('🌍 Other Cities', 'weather_other_cities')
      ]
    ]);

    try {
      await ctx.editMessageText(weatherMessage.trim(), weatherKeyboard);
    } catch (error: any) {
      if (error.response?.error_code === 400 && 
          error.response?.description?.includes('message is not modified')) {
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error('Weather refresh error:', error);
    await ctx.answerCbQuery('❌ Error refreshing weather data');
  }
});

// Weather default location handler
bot.action('weather_default', async (ctx) => {
  try {
    await ctx.answerCbQuery('📍 Getting weather for Jakarta Selatan, Tebet...');
    
    const city = 'Jakarta Selatan, Tebet, ID';
    const weatherData = await getWeatherData(city);
    
    if (!weatherData) {
      await ctx.editMessageText('❌ Could not get weather data for default location. Please try again later.');
      return;
    }

    const weatherMessage = `
🌤️ Weather Report for ${weatherData.location}

🌡️ Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
☁️ Condition: ${weatherData.condition}
💧 Humidity: ${weatherData.humidity}%
💨 Wind: ${weatherData.windSpeed} m/s ${weatherData.windDirection}
🌅 Sunrise: ${weatherData.sunrise}
🌇 Sunset: ${weatherData.sunset}
👁️ Visibility: ${weatherData.visibility} km
🏙️ Pressure: ${weatherData.pressure} hPa

📍 Coordinates: ${weatherData.coordinates}
⏰ Local time: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
    `;

    const weatherKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('🔄 Refresh', `weather_refresh_${encodeURIComponent(city)}`),
        Markup.button.callback('📍 Default Location', 'weather_default')
      ],
      [
        Markup.button.callback('🌍 Other Cities', 'weather_other_cities')
      ]
    ]);

    try {
      await ctx.editMessageText(weatherMessage.trim(), weatherKeyboard);
    } catch (error: any) {
      if (error.response?.error_code === 400 && 
          error.response?.description?.includes('message is not modified')) {
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error('Weather default error:', error);
    await ctx.answerCbQuery('❌ Error getting default location weather');
  }
});

// Weather other cities handler
bot.action('weather_other_cities', async (ctx) => {
  const citiesKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🏙️ Jakarta', 'weather_city_Jakarta'),
      Markup.button.callback('🏢 Bandung', 'weather_city_Bandung')
    ],
    [
      Markup.button.callback('🌴 Bali', 'weather_city_Bali'),
      Markup.button.callback('🌊 Surabaya', 'weather_city_Surabaya')
    ],
    [
      Markup.button.callback('🏛️ Yogyakarta', 'weather_city_Yogyakarta'),
      Markup.button.callback('🏞️ Medan', 'weather_city_Medan')
    ],
    [
      Markup.button.callback('📍 Default Location', 'weather_default')
    ]
  ]);

  await ctx.editMessageText('🌍 Select a city for weather information:', citiesKeyboard);
});

// Handle city selection
bot.action(/^weather_city_(.+)$/, async (ctx) => {
  try {
    const cityName = ctx.match[1];
    await ctx.answerCbQuery(`🌡️ Getting weather for ${cityName}...`);
    
    const weatherData = await getWeatherData(cityName);
    
    if (!weatherData) {
      await ctx.editMessageText(`❌ Could not get weather data for ${cityName}. Please try again later.`);
      return;
    }

    const weatherMessage = `
🌤️ Weather Report for ${weatherData.location}

🌡️ Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
☁️ Condition: ${weatherData.condition}
💧 Humidity: ${weatherData.humidity}%
💨 Wind: ${weatherData.windSpeed} m/s ${weatherData.windDirection}
🌅 Sunrise: ${weatherData.sunrise}
🌇 Sunset: ${weatherData.sunset}
👁️ Visibility: ${weatherData.visibility} km
🏙️ Pressure: ${weatherData.pressure} hPa

📍 Coordinates: ${weatherData.coordinates}
⏰ Local time: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
    `;

    const weatherKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('🔄 Refresh', `weather_refresh_${encodeURIComponent(cityName)}`),
        Markup.button.callback('📍 Default Location', 'weather_default')
      ],
      [
        Markup.button.callback('🌍 Other Cities', 'weather_other_cities')
      ]
    ]);

    try {
      await ctx.editMessageText(weatherMessage.trim(), weatherKeyboard);
    } catch (error: any) {
      if (error.response?.error_code === 400 && 
          error.response?.description?.includes('message is not modified')) {
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error('Weather city error:', error);
    await ctx.answerCbQuery('❌ Error getting weather data');
  }
});

// ==================== CALCULATOR CALLBACK HANDLERS ====================

// Calculator number handlers
for (let i = 0; i <= 9; i++) {
  bot.action(`calc_${i}`, async (ctx) => {
    await handleCalculatorInput(ctx, i.toString());
  });
}

// Calculator operator handlers
bot.action('calc_add', async (ctx) => {
  await handleCalculatorInput(ctx, '+');
});

bot.action('calc_subtract', async (ctx) => {
  await handleCalculatorInput(ctx, '-');
});

bot.action('calc_multiply', async (ctx) => {
  await handleCalculatorInput(ctx, '×');
});

bot.action('calc_divide', async (ctx) => {
  await handleCalculatorInput(ctx, '÷');
});

bot.action('calc_decimal', async (ctx) => {
  await handleCalculatorInput(ctx, '.');
});

bot.action('calc_equals', async (ctx) => {
  await handleCalculatorEquals(ctx);
});

bot.action('calc_clear', async (ctx) => {
  await handleCalculatorClear(ctx);
});

// Calculator helper functions
async function handleCalculatorInput(ctx: Context & { session?: any }, input: string) {
  if (!ctx.session) ctx.session = {};
  if (!ctx.session.calculator) {
    ctx.session.calculator = {
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewNumber: false
    };
  }

  const calc = ctx.session.calculator;
  const previousDisplay = calc.display;

  if (input === '+' || input === '-' || input === '×' || input === '÷') {
    // Handle operators
    if (calc.operation && !calc.waitingForNewNumber) {
      // Perform the pending operation first
      await handleCalculatorEquals(ctx);
    }
    
    calc.previousValue = parseFloat(calc.display.replace(',', ''));
    calc.operation = input;
    calc.waitingForNewNumber = true;
  } else if (input === '.') {
    // Handle decimal point
    if (calc.waitingForNewNumber) {
      calc.display = '0.';
      calc.waitingForNewNumber = false;
    } else if (!calc.display.includes('.')) {
      calc.display += '.';
    }
  } else {
    // Handle numbers
    if (calc.waitingForNewNumber || calc.display === '0') {
      calc.display = input;
      calc.waitingForNewNumber = false;
    } else {
      // Prevent display from getting too long
      if (calc.display.length < 15) {
        calc.display += input;
      }
    }
  }

  // Only update display if it actually changed
  if (calc.display !== previousDisplay) {
    await updateCalculatorDisplay(ctx);
  }
}

async function handleCalculatorEquals(ctx: Context & { session?: any }) {
  if (!ctx.session || !ctx.session.calculator) return;

  const calc = ctx.session.calculator;
  
  if (calc.operation && calc.previousValue !== null && !calc.waitingForNewNumber) {
    const currentValue = parseFloat(calc.display.replace(',', ''));
    let result;

    switch (calc.operation) {
      case '+':
        result = calc.previousValue + currentValue;
        break;
      case '-':
        result = calc.previousValue - currentValue;
        break;
      case '×':
        result = calc.previousValue * currentValue;
        break;
      case '÷':
        if (currentValue === 0) {
          calc.display = 'Error';
          calc.operation = null;
          calc.previousValue = null;
          calc.waitingForNewNumber = true;
          await updateCalculatorDisplay(ctx);
          return;
        }
        result = calc.previousValue / currentValue;
        break;
      default:
        return;
    }

    // Format the result
    if (Number.isInteger(result) && Math.abs(result) < 1000000) {
      calc.display = result.toString();
    } else {
      calc.display = result.toPrecision(8).replace(/\.?0+$/, '');
    }

    calc.operation = null;
    calc.previousValue = null;
    calc.waitingForNewNumber = true;
  }

  await updateCalculatorDisplay(ctx);
}

async function handleCalculatorClear(ctx: Context & { session?: any }) {
  if (!ctx.session) ctx.session = {};
  ctx.session.calculator = {
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewNumber: false
  };

  await updateCalculatorDisplay(ctx);
}

async function updateCalculatorDisplay(ctx: Context & { session?: any }) {
  const calc = ctx.session?.calculator || { display: '0' };
  
  const calcKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('7', 'calc_7'),
      Markup.button.callback('8', 'calc_8'),
      Markup.button.callback('9', 'calc_9'),
      Markup.button.callback('÷', 'calc_divide')
    ],
    [
      Markup.button.callback('4', 'calc_4'),
      Markup.button.callback('5', 'calc_5'),
      Markup.button.callback('6', 'calc_6'),
      Markup.button.callback('×', 'calc_multiply')
    ],
    [
      Markup.button.callback('1', 'calc_1'),
      Markup.button.callback('2', 'calc_2'),
      Markup.button.callback('3', 'calc_3'),
      Markup.button.callback('-', 'calc_subtract')
    ],
    [
      Markup.button.callback('0', 'calc_0'),
      Markup.button.callback('.', 'calc_decimal'),
      Markup.button.callback('=', 'calc_equals'),
      Markup.button.callback('+', 'calc_add')
    ],
    [
      Markup.button.callback('C', 'calc_clear')
    ]
  ]);

  const newText = `🧮 Calculator\n\n${calc.display}`;
  
  try {
    await ctx.editMessageText(newText, calcKeyboard);
  } catch (error: any) {
    // Ignore "message is not modified" errors - this happens when display hasn't changed
    if (error.response?.error_code === 400 && 
        error.response?.description?.includes('message is not modified')) {
      // Silently ignore - the message content is already correct
      return;
    }
    // Re-throw other errors
    throw error;
  }
} 