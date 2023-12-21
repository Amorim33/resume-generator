vi.mock('openai', async () => {
  const mod = await vi.importActual<typeof import('openai')>('openai');
  return {
    ...mod,
    OpenAI: vi.fn().mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            id: 'chat-123',
            object: 'chat.completion',
            created: 1677652288,
            model: 'gpt-4',
            system_fingerprint: 'fp_44709d6fcb',
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: '```html<p>Test resume</p>```',
                },
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: 9,
              completion_tokens: 12,
              total_tokens: 21,
            },
          }),
        },
      },
    }),
  };
});
