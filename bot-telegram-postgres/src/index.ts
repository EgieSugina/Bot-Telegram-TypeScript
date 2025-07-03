import { Telegraf } from "telegraf";
import { DatabaseService } from "./services/DatabaseService";
import { ChartProcessor } from "./services/ChartProcessor";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const databaseService = new DatabaseService();
const chartProcessor = new ChartProcessor();

// Start command
bot.start((ctx) => {
  ctx.reply(
    "Welcome to the Chart Bot! 📊\n\n" +
      "Available commands:\n" +
      "/latency - Show network latency data (last 30 days)\n" +
      "/help - Show this help message"
  );
});

// Help command
bot.help((ctx) => {
  ctx.reply(
    "Chart Bot Commands:\n\n" +
      "/latency [region] [node] - Show network latency for last 30 days\n" +
      "  Example: /latency SUMBAGSEL 4G\n" +
      "  Default: region=SUMBAGSEL, node=4G\n" +
      "/help - Show this help message\n\n"
  );
});

// Latency command - Enhanced with reusable ChartProcessor
bot.command("latency", async (ctx) => {
  try {
    // Send a "generating" message
    const message = await ctx.reply(
      "🔄 Fetching latency data and generating chart..."
    );

    // Parse command arguments
    const args = ctx.message.text.split(" ").slice(1);
    const region = args[0] || "SUMBAGSEL";
    const node = args[1] || "4G";

    // Fetch latency data from database
    const kpiData = await databaseService.getLatencyData(region, node);

    if (kpiData.length === 0) {
      await ctx.reply(
        `❌ No latency data found for region: ${region}, node: ${node}`
      );
      await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      return;
    }

    // Generate the latency chart using the reusable ChartProcessor
    const imageBuffer = await chartProcessor.generateLatencyChart(kpiData);

    // Get unique operators for caption
    const chartData = chartProcessor.transformKPIData(kpiData, "latency");
    const operators = chartProcessor.getOperators(chartData);
    const operatorList = operators.join(", ");

    // Send the chart image
    await ctx.replyWithPhoto(
      { source: imageBuffer },
      {
        caption:
          `📊 **Network Latency Chart**\n\n` +
          `📍 Region: ${region}\n` +
          `📡 Node: ${node}\n` +
          `📈 Period: Last 30 days\n` +
          `🏢 Operators: ${operatorList}\n` +
          `📊 Data points: ${kpiData.length}\n\n`,
        parse_mode: "Markdown",
      }
    );

    // Delete the "generating" message
    await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
  } catch (error) {
    console.error("Error generating latency chart:", error);
    ctx.reply(
      "❌ Sorry, there was an error generating your latency chart. Please check:\n" +
        "• Database connection\n" +
        "• Region and node parameters\n" +
        "• Data availability"
    );
  }
});

// Handle errors
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply("❌ An error occurred. Please try again later.");
});

// Graceful shutdown
process.once("SIGINT", async () => {
  console.log("🔄 Shutting down gracefully...");
  await databaseService.close();
  bot.stop("SIGINT");
});

process.once("SIGTERM", async () => {
  console.log("🔄 Shutting down gracefully...");
  await databaseService.close();
  bot.stop("SIGTERM");
});

// Launch the bot
bot.launch().then(() => {
  console.log("🚀 Chart Bot is running!");
  console.log("Bot username:", bot.botInfo?.username);
});
