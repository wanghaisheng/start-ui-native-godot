export async function onRequest(context) {
  const { request } = context;
  const method = request.method;

  if (method === 'POST') {
    const body = await request.json();
    const {
      characters,
      plot,
      chapter,
      chapterCharacters,
      previousSummary,
      previousPuzzle,
      plotSelection,
    } = body;

    // TODO: 实现故事生成逻辑（可能调用 AI 服务）
    const story = {
      story: `Chapter ${chapter}: ${plot}`,
      summary: `Summary of chapter ${chapter}`,
      puzzle: 'A puzzle for the player to solve',
    };

    return new Response(JSON.stringify(story), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
