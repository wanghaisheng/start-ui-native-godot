export async function onRequest(context) {
  const openapiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Game API',
      version: '1.0.0',
      description: 'Game application API - React Native + Godot Starter',
    },
    servers: [
      {
        url: 'https://lego-story.pages.dev',
        description: 'Production server',
      },
      {
        url: 'http://localhost:8788',
        description: 'Local development server',
      },
    ],
    paths: {
      '/api/users': {
        get: {
          summary: 'Get user',
          operationId: 'getUser',
          tags: ['Users'],
          parameters: [
            {
              name: 'userId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'User data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create or login user',
          operationId: 'createOrLoginUser',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                  },
                  required: ['username'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User created or logged in',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },
        put: {
          summary: 'Update user',
          operationId: 'updateUser',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    timeUsed: { type: 'number' },
                    dailyTimeLimit: { type: 'number' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User updated',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },
      },
      '/api/books': {
        get: {
          summary: 'Get books',
          operationId: 'getBooks',
          tags: ['Books'],
          parameters: [
            {
              name: 'userId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'List of books',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Book',
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create book',
          operationId: 'createBook',
          tags: ['Books'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    title: { type: 'string' },
                  },
                  required: ['userId', 'title'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Book created',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Book',
                  },
                },
              },
            },
          },
        },
        put: {
          summary: 'Update book',
          operationId: 'updateBook',
          tags: ['Books'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    bookId: { type: 'string' },
                    title: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Book updated',
            },
          },
        },
        delete: {
          summary: 'Delete book',
          operationId: 'deleteBook',
          tags: ['Books'],
          parameters: [
            {
              name: 'id',
              in: 'query',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Book deleted',
            },
          },
        },
      },
      '/api/characters': {
        get: {
          summary: 'Get characters',
          operationId: 'getCharacters',
          tags: ['Characters'],
          parameters: [
            {
              name: 'userId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'List of characters',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Character',
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create character',
          operationId: 'createCharacter',
          tags: ['Characters'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    personality: { type: 'string' },
                    speakingStyle: { type: 'string' },
                    creatorId: { type: 'string' },
                  },
                  required: ['name'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Character created',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Character',
                  },
                },
              },
            },
          },
        },
        put: {
          summary: 'Update character',
          operationId: 'updateCharacter',
          tags: ['Characters'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    characterId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Character updated',
            },
          },
        },
        delete: {
          summary: 'Delete character',
          operationId: 'deleteCharacter',
          tags: ['Characters'],
          parameters: [
            {
              name: 'id',
              in: 'query',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Character deleted',
            },
          },
        },
      },
      '/api/story': {
        post: {
          summary: 'Generate story',
          operationId: 'generateStory',
          tags: ['Story'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    characters: { type: 'array', items: { type: 'object' } },
                    plot: { type: 'string' },
                    chapter: { type: 'number' },
                    chapterCharacters: {
                      type: 'array',
                      items: { type: 'object' },
                    },
                    previousSummary: { type: 'string' },
                    previousPuzzle: { type: 'string' },
                    plotSelection: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Story generated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      story: { type: 'string' },
                      summary: { type: 'string' },
                      puzzle: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', nullable: true },
            timeUsed: { type: 'number', nullable: true },
            dailyTimeLimit: { type: 'number', nullable: true },
            createdAt: { type: 'string' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        Character: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            personality: { type: 'string' },
            speakingStyle: { type: 'string' },
            creatorId: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(openapiSpec, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
