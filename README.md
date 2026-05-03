# Email to Telegram Worker

A Cloudflare Worker that intercepts incoming emails and routes them to a designated Telegram chat.

## Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/) with Email Routing enabled
- Telegram account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Bruno](https://www.usebruno.com/) API Client (for local testing)

---

## 1. Telegram Bot Setup

1. Open Telegram and search for **[@BotFather](https://core.telegram.org/bots/tutorial#obtain-your-bot-token)**.
2. Send the `/newbot` command and follow the instructions to create a new bot.
3. BotFather will provide you with a **Bot Token** (e.g., `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`). Save this properly.
4. **Important**: Open a chat with your newly created bot and send any message (like `/start` or `Hello`). The bot cannot send messages to a chat unless a user initiates the conversation.

---

## 2. Local Setup & Testing with Bruno

### Environment Files
1. Copy the `.env.example` in the project root to `.env`:
   ```env
   BOT_TOKEN=your_bot_token_here
   CHAT_ID=your_chat_id_here
   ```
2. Copy `./bruno/collections/Telegram Bot API/.env.example` to `./bruno/collections/Telegram Bot API/.env`:
   ```env
   BOT_TOKEN=your_bot_token_here
   CHAT_ID=your_chat_id_here
   ```

### Finding your `CHAT_ID`
To send messages, you need the unique ID of the chat. You can find this using Bruno:
1. Open the `./bruno` directory using the Bruno application.
2. Ensure you have sent a message to your bot in Telegram.
3. Open the **Telegram Bot API > Get Updates** request in Bruno and hit **Send**.
4. Check the JSON response for your incoming message. Look for `message.chat.id` — this is your `CHAT_ID`.
5. Update your root `.env` and `./bruno/collections/Telegram Bot API/.env` files with this ID.

### Testing the Worker
1. Start the local Wrangler development server:
   ```bash
   npm run dev
   ```
2. In Bruno, go to **Cloudflare Email Worker > Send Email from File** (or **Send Email**).
3. Send the request. You should receive the simulated email in your Telegram chat!

---

## 3. Deployment

1. Login to Wrangler (if not already logged in):
   ```bash
   npx wrangler login
   ```
2. Deploy the Worker to Cloudflare:
   ```bash
   npx wrangler deploy --env-file .env
   ```
4. Configure Email Routing in the Cloudflare Dashboard:
   - Go to your domain > **Email Routing** > **Routing Rules**.
   - Create a new rule (e.g., Catch-all or Custom Address).
   - Set the action to **Send to a Worker** and select your newly deployed Worker.
