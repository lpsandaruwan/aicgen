import { AIProvider, CredentialManager } from './credential-manager.js';
import { ProjectContextGatherer } from './context-gatherer.js';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { z } from 'zod';

const AnalysisSchema = z.object({
    language: z.enum(['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'csharp', 'php', 'ruby', 'other']),
    framework: z.string().optional(),
    projectType: z.enum(['cli', 'web-app', 'api', 'library', 'desktop', 'mobile', 'other']),
    architecture: z.enum(['microservices', 'modular-monolith', 'clean-architecture', 'mvc', 'serverless', 'event-driven', 'other']).optional(),
    recommendedAssistant: z.enum(['claude-code', 'copilot', 'gemini', 'antigravity', 'codex']),
    confidence: z.number().min(0).max(1),
    reasoning: z.string()
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

export class AIAnalysisService {

    constructor() {
    }

    async analyzeProject(
        provider: AIProvider,
        context: Awaited<ReturnType<ProjectContextGatherer['gather']>>
    ): Promise<AnalysisResult> {
        const systemPrompt = `You are an expert software architect. Analyze the provided project file structure and content extracts to determine its language, framework, type, and architectural pattern.
    
    You must output a JSON object adhering to this schema:
    {
      "language": "typescript" | "javascript" | "python" ...,
      "framework": "string (e.g., 'express', 'react', 'django') or null",
      "projectType": "cli" | "web-app" | "api" | "library" ...,
      "architecture": "microservices" | "modular-monolith" | "clean-architecture" ...,
      "recommendedAssistant": "claude-code" | "copilot" | "gemini" | "antigravity" | "codex",
      "confidence": 0.0 to 1.0,
      "reasoning": "Brief explanation of why you classified it this way."
    }
    
    RETURN ONLY RAW JSON. NO MARKDOWN.
    `;

        const userPrompt = `
    Project File Tree:
    ${context.tree}

    Key Files Content:
    ${Object.entries(context.files).map(([path, content]) => `--- ${path} ---\n${content}\n`).join('\n')}
    `;

        let rawJson = '';

        try {
            if (provider === 'claude') {
                const anthropic = new Anthropic(); // Uses ANTHROPIC_API_KEY env or defaults
                const msg = await anthropic.messages.create({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: [{ role: "user", content: userPrompt }]
                });

                if (msg.content[0].type === 'text') {
                    rawJson = msg.content[0].text;
                }

            } else if (provider === 'gemini') {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY!);
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-pro",
                    generationConfig: { responseMimeType: "application/json" }
                });

                const result = await model.generateContent([
                    systemPrompt, // Gemini often prefers system instructions as part of prompt or config, but standard messages work too
                    userPrompt
                ]);
                rawJson = result.response.text();

            } else if (provider === 'openai') {
                const openai = new OpenAI();
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    model: "gpt-4o",
                    response_format: { type: "json_object" }
                });
                rawJson = completion.choices[0].message.content || '{}';
            }

            // Clean markdown code blocks if present (despite instructions)
            rawJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();

            return AnalysisSchema.parse(JSON.parse(rawJson));

        } catch (error) {
            throw new Error(`AI Analysis failed using ${provider}: ${(error as Error).message}`);
        }
    }
}
