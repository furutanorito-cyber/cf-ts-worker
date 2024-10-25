export default {
	async fetch(request, env, ctx): Promise<Response> {
		// リクエストのメソッドを確認（POSTリクエストのみ処理する）
		if (request.method === 'POST') {
			// リクエストのボディを取得
			const body = await request.json();
			console.log('Received Webhook:', body);

			// ここで何らかの処理を行う（例：データベースへの保存、別のAPIへのリクエストなど）
			// 例: await saveToDatabase(body);

			// 成功レスポンスを返す
			return new Response('Webhook received', { status: 200 });
		} else {
			// GETリクエストなど、他のメソッドに対するレスポンス
			return new Response('Method not allowed', { status: 405 });
		}
	},
} satisfies ExportedHandler<Env>;
