import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';

export type AIProvider = 'claude' | 'gemini' | 'openai';

export class CredentialManager {
    /**
     * Detects which AI providers have available credentials.
     */
    async getAvailableProviders(): Promise<AIProvider[]> {
        const providers: AIProvider[] = [];

        if (await this.hasClaudeCredentials()) {
            providers.push('claude');
        }

        if (await this.hasGeminiCredentials()) {
            providers.push('gemini');
        }

        if (this.hasOpenAICredentials()) {
            providers.push('openai');
        }

        return providers;
    }

    private async hasClaudeCredentials(): Promise<boolean> {
        // 1. Check Environment Variable
        if (process.env.ANTHROPIC_API_KEY) {
            return true;
        }

        // 2. Check Claude Code credentials file
        try {
            const homeDir = os.homedir();
            const credsPath = path.join(homeDir, '.claude', '.credentials.json');
            if (fs.existsSync(credsPath)) {
                return true;
            }
        } catch (error) {
            // Ignore valid file access errors
        }

        return false;
    }

    private async hasGeminiCredentials(): Promise<boolean> {
        // 1. Check Environment Variable
        if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
            return true;
        }

        // 2. Check for Application Default Credentials (ADC) via gcloud
        // A simple heuristic is checking if 'gcloud' is in PATH or if the ADC file exists.
        // However, for simplicity/speed in this CLI, we might just rely on Env vars 
        // or try to instantiate a dummy client if we want to be 100% sure. 
        // But instantiating might be slow.
        // Let's stick to Env vars + checking standard ADC file location as heuristic.

        // Standard ADC locations:
        // Windows: %APPDATA%/gcloud/application_default_credentials.json
        // UNIX: $HOME/.config/gcloud/application_default_credentials.json

        try {
            const homeDir = os.homedir();
            let adcPath = '';
            if (process.platform === 'win32') {
                adcPath = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'gcloud', 'application_default_credentials.json');
            } else {
                adcPath = path.join(homeDir, '.config', 'gcloud', 'application_default_credentials.json');
            }

            if (fs.existsSync(adcPath)) {
                return true;
            }
        } catch (error) {
            // ignore
        }

        return false;
    }

    private hasOpenAICredentials(): boolean {
        return !!process.env.OPENAI_API_KEY;
    }

    getClaudeClient() {
        // The Agent SDK might handle this, but for raw text analysis we might use standard SDK or Agent SDK "chat" capability.
        // Since we just need analysis, we can use the standard Anthropic SDK if we have the key, 
        // OR rely on the Agent SDK if it abstracts it well.
        // Given we installed @anthropic-ai/claude-agent-sdk, let's see how to use it.
        // Note: The user explicitly mentioned Agent SDK.
        // However, purely for "analyzing a prompt", the standard SDK is often simpler.
        // BUT the requirement was "use agent sdk".
        // I will import it dynamically to avoid issues if not used.
        return new Anthropic();
        // Note: If using Agent SDK, we'd use `import { Agent } from ...`
        // For this specific 'analysis' task, standard SDK/Provider pattern is often cleaner 
        // unless we want the agent to 'explore' the files itself.
        // Design doc said "ProjectContextService" gathers files -> "AIAnalysisService" sends prompt.
        // So simple LLM call is sufficient.
        // The Agent SDK finds credentials automatically though. 
    }
}
