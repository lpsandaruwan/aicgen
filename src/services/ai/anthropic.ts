import Anthropic from '@anthropic-ai/sdk';
import { AIProviderError } from '../../utils/errors.js';

let client: Anthropic | null = null;

export function initializeAnthropic(apiKey: string): void {
  client = new Anthropic({ apiKey });
}

export async function isAnthropicAvailable(): Promise<boolean> {
  if (client) return true;

  const envKey = process.env.ANTHROPIC_API_KEY;
  if (envKey) {
    initializeAnthropic(envKey);
    return true;
  }

  return false;
}

export async function generateWithAnthropic(
  prompt: string,
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  if (!client) {
    throw new AIProviderError('Anthropic client not initialized', 'anthropic');
  }

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 1.0,
      messages: [{ role: 'user', content: prompt }]
    });

    const textBlock = message.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new AIProviderError('No text content in response', 'anthropic');
    }

    return textBlock.text;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AIProviderError(message, 'anthropic');
  }
}
