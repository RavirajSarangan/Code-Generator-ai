//The use server directive is critical for integrating server-side functionality in React components, enabling features like data fetching and form handling directly within the component.
'use server';

/**
 * @fileOverview Generates Python code snippets based on user prompts.
 *
 * - generatePythonCode - A function that handles the generation of Python code.
 * - GeneratePythonCodeInput - The input type for the generatePythonCode function.
 * - GeneratePythonCodeOutput - The return type for the generatePythonCode function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePythonCodeInputSchema = z.object({
  prompt: z.string().describe('The prompt describing the Python code to generate.'),
});
export type GeneratePythonCodeInput = z.infer<typeof GeneratePythonCodeInputSchema>;

const GeneratePythonCodeOutputSchema = z.object({
  code: z.string().describe('The generated Python code snippet.'),
});
export type GeneratePythonCodeOutput = z.infer<typeof GeneratePythonCodeOutputSchema>;

export async function generatePythonCode(input: GeneratePythonCodeInput): Promise<GeneratePythonCodeOutput> {
  return generatePythonCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePythonCodePrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt describing the Python code to generate.'),
    }),
  },
  output: {
    schema: z.object({
      code: z.string().describe('The generated Python code snippet.'),
    }),
  },
  prompt: `You are an AI assistant that generates Python code snippets based on user prompts. Generate only the code without any explanation. Enclose your code in \`\`\`python \`\`\`:

Prompt: {{{prompt}}}
`,
});

const generatePythonCodeFlow = ai.defineFlow<
  typeof GeneratePythonCodeInputSchema,
  typeof GeneratePythonCodeOutputSchema
>({
  name: 'generatePythonCodeFlow',
  inputSchema: GeneratePythonCodeInputSchema,
  outputSchema: GeneratePythonCodeOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

