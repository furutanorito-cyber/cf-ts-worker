export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response('Deploy from GitHub Actions');
	},
} satisfies ExportedHandler<Env>;
