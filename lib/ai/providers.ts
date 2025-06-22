import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { togetherai } from '@ai-sdk/togetherai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': togetherai('deepseek-ai/DeepSeek-V3'),
        'chat-model-reasoning': wrapLanguageModel({
          model: togetherai('deepseek-ai/DeepSeek-R1-0528-tput'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': togetherai('deepseek-ai/DeepSeek-V3'),
        'artifact-model': togetherai('deepseek-ai/DeepSeek-V3'),
      },
    });
