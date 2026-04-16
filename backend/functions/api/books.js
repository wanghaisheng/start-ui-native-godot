export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    const userId = url.searchParams.get('userId');
    const bookId = url.searchParams.get('bookId');

    if (!userId && !bookId) {
      return new Response(
        JSON.stringify({ error: 'userId or bookId is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // TODO: 实现从数据库获取书籍
    if (bookId) {
      const book = {
        id: bookId,
        userId: userId || 'user-123',
        title: 'Demo Book',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return new Response(JSON.stringify(book), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const books = [
      {
        id: 'book-1',
        userId,
        title: 'Demo Book 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return new Response(JSON.stringify(books), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'POST') {
    const body = await request.json();
    const { userId, title } = body;

    if (!userId || !title) {
      return new Response(
        JSON.stringify({ error: 'userId and title are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // TODO: 实现创建书籍
    const book = {
      id: crypto.randomUUID(),
      userId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(book), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'PUT') {
    const body = await request.json();
    const { bookId, title } = body;

    // TODO: 实现更新书籍
    const book = {
      id: bookId,
      title: title || 'Updated Book',
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(book), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: 实现删除书籍
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
