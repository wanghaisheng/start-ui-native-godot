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

    // TODO: 实现从数据库获取角色
    const characters = [
      {
        id: 'char-1',
        name: 'Hero',
        description: 'The main character',
        personality: 'Brave and determined',
        speakingStyle: 'Formal',
        creatorId: userId,
        createdAt: new Date().toISOString(),
      },
    ];

    return new Response(JSON.stringify(characters), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'POST') {
    const body = await request.json();
    const { name, description, personality, speakingStyle, creatorId } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: 实现创建角色
    const character = {
      id: crypto.randomUUID(),
      name,
      description: description || '',
      personality: personality || '',
      speakingStyle: speakingStyle || '',
      creatorId: creatorId || 'user',
      createdAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(character), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'PUT') {
    const body = await request.json();
    const { characterId, name, description } = body;

    // TODO: 实现更新角色
    const character = {
      id: characterId,
      name: name || 'Updated Character',
      description: description || '',
    };

    return new Response(JSON.stringify(character), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'DELETE') {
    const id = url.searchParams.get('id');
    const force = url.searchParams.get('force') === 'true';

    if (!id) {
      return new Response(JSON.stringify({ error: 'id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: 实现删除角色
    return new Response(JSON.stringify({ success: true, force }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
