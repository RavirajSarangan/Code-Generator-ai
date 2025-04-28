'use server';

import { generatePythonCode, type GeneratePythonCodeInput, type GeneratePythonCodeOutput } from '@/ai/flows/generate-python-code';
import { z } from 'zod';

const InputSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty."),
});

export type FormState = {
    message: string;
    code?: string;
    errors?: {
        prompt?: string[];
    };
}

export async function handleGenerateCode(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = InputSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { prompt } = validatedFields.data;

  try {
    const input: GeneratePythonCodeInput = { prompt };
    const result: GeneratePythonCodeOutput = await generatePythonCode(input);

    // Extract code, removing markdown fences if present
    const code = result.code.replace(/^```python\s*|```$/g, '').trim();

    return { message: 'Code generated successfully!', code: code };
  } catch (error) {
    console.error("Error generating code:", error);
    return { message: 'Failed to generate code. Please try again.' };
  }
}
