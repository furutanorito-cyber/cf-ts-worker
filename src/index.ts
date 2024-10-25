export interface Env {
	LINE_NOTIFY_TOKEN: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		console.log(env.LINE_NOTIFY_TOKEN);

		// リクエストのメソッドを確認（POSTリクエストのみ処理する）
		if (request.method === 'POST') {
			// Content-Typeヘッダーを確認
			const contentType = request.headers.get('content-type');

			let message: string;

			if (contentType && contentType.includes('application/json')) {
				// JSON形式のメッセージを処理
				try {
					const body = await request.json();
					console.log('Received Webhook (JSON):', body);
					message = JSON.stringify(body);
				} catch (e) {
					console.error('Failed to parse JSON:', e);
					message = 'Failed to parse JSON';
				}
			} else {
				// プレーンテキスト形式のメッセージを処理
				const textBody = await request.text();
				console.log('Received Webhook (Text):', textBody);
				message = textBody;
			}

			// LINE Notify APIを呼び出してメッセージを送信
			const lineNotifyToken = env.LINE_NOTIFY_TOKEN; // LINE Notifyのトークンを設定
			const lineNotifyUrl = 'https://notify-api.line.me/api/notify';

			const response = await fetch(lineNotifyUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Bearer ${lineNotifyToken}`,
				},
				body: `message=${encodeURIComponent(message)}`,
			});

			if (response.ok) {
				console.log('Message sent to LINE Notify');
			} else {
				console.error(
					'Failed to send message to LINE Notify:',
					response.statusText
				);
			}

			// 成功レスポンスを返す
			return new Response('Webhook received', { status: 200 });
		} else {
			// GETリクエストなど、他のメソッドに対するレスポンス
			return new Response('Method not allowed', { status: 405 });
		}
	},
} satisfies ExportedHandler<Env>;
