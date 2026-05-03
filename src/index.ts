import * as PostalMime from 'postal-mime';

function escapeMarkdownV2(text: string | null | undefined): string {
	if (!text) return '';
	return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\<>])/g, '\\$1');
}

function formatTelegramMessage(email: any): string {
	const fromName = email.from?.name ? escapeMarkdownV2(email.from.name) + ' ' : '';
	const fromAddress = escapeMarkdownV2(`<${email.from?.address || 'unknown'}>`);

	const toRecipients = (email.to || []).map((t: any) => {
		const name = t.name ? escapeMarkdownV2(t.name) + ' ' : '';
		const addr = escapeMarkdownV2(`<${t.address || 'unknown'}>`);
		return `${name}${addr}`;
	}).join(', ');

	const subject = escapeMarkdownV2(email.subject || 'No Subject');

	let textBody = email.text || email.html || 'No Content';
	if (textBody.length > 3500) {
		textBody = textBody.substring(0, 3500) + '... [truncated]';
	}
	const body = escapeMarkdownV2(textBody);

	return `📬 *You got mail\\!*
	
	*From:* ${fromName}${fromAddress}
	*To:* ${toRecipients}
	
	━━━━━━━━━━━━━━━━━━
	
	*Subject:* ${subject}
	
	📄 *Message:*
	||${body}||`;
}

export default {
	async sendMessage(message: string, env: any) {
		const url = `${env.API_HOST}/bot${env.BOT_TOKEN}/sendMessage`;
		const body = JSON.stringify({
			chat_id: env.CHAT_ID,
			text: message,
			parse_mode: 'MarkdownV2',
		});

		const result = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		});
	},

	async email(message: any, env: any, ctx: any) {
		const parser = new PostalMime.default();
		const rawEmail = new Response(message.raw);
		const email = await parser.parse(await rawEmail.arrayBuffer());

		const telegramMessage = formatTelegramMessage(email);

		await this.sendMessage(telegramMessage, env);
	},
};