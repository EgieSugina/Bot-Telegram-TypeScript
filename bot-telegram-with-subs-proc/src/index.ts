import { Telegraf } from "telegraf";
import { ImageProcessor } from "./services/ImageProcessor";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const imageProcessor = new ImageProcessor();

// Start command
bot.start((ctx) => {
  ctx.reply(
    "Welcome to the Chart Bot! 📊\n\n" +
      "Available commands:\n" +
      "/chart - Generate a sample chart\n" +
      "/help - Show this help message"
  );
});

// Help command
bot.help((ctx) => {
  ctx.reply(
    "Chart Bot Commands:\n\n" +
      "/chart - Generate a sample line chart with random data\n" +
      "/help - Show this help message\n\n" +
      "The bot will generate beautiful charts using AmCharts v4 and process them in subprocesses!"
  );
});

// Chart generation command
bot.command("chart", async (ctx) => {
  try {
    // Send a "generating" message
    const message = await ctx.reply("🔄 Generating your chart...");

    // Generate random data
    const data = imageProcessor.generateRandomData();

    // Generate the chart as buffer using child process
    const imageBuffer = await imageProcessor.generateChartAsBuffer(data, {
      width: 840,
      height: 560,
      timeout: 30000,
    });

    // Send the chart image as buffer
    await ctx.replyWithPhoto(
      { source: imageBuffer },
      {
        caption:
          "📊 Here's your sample chart!\n\nGenerated with AmCharts v4 and processed in subprocess",
      }
    );

    // Delete the "generating" message
    await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
  } catch (error) {
    console.error("Error generating chart:", error);
    ctx.reply(
      "❌ Sorry, there was an error generating your chart. Please try again."
    );
  }
});

// Handle errors
// bot.catch((err, ctx) => {
//   console.error(`Error for ${ctx.updateType}:`, err);
//   ctx.reply("❌ An error occurred. Please try again later.");
// });

// Launch the bot
console.log("🚀 Chart Bot is running!");
bot.launch();
console.log("Bot username:", bot.botInfo?.username);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
