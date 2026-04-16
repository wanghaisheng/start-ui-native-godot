export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    const userId = url.searchParams.get('userId');
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: 实现从数据库获取用户
    const user = {
      id: userId,
      username: 'demo-user',
      email: 'demo@example.com',
      timeUsed: 0,
      dailyTimeLimit: 60,
      createdAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'POST') {
    const body = await request.json();
    const { username, email } = body;

    if (!username) {
      return new Response(JSON.stringify({ error: 'username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: 实现创建或登录用户
    const user = {
      id: crypto.randomUUID(),
      username,
      email: email || null,
      timeUsed: 0,
      dailyTimeLimit: 60,
      createdAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'PUT') {
    const body = await request.json();
    const { userId, timeUsed, dailyTimeLimit } = body;

    // TODO: 实现更新用户
    const user = {
      id: userId,
      username: 'demo-user',
      email: 'demo@example.com',
      timeUsed: timeUsed || 0,
      dailyTimeLimit: dailyTimeLimit || 60,
      createdAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
