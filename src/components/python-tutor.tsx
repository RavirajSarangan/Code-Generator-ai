'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { handleGenerateCode, type FormState } from '@/app/actions';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Generating...' : 'Generate Code'}
    </Button>
  );
}

export default function PythonTutor() {
  const [state, formAction] = useFormState(handleGenerateCode, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [generatedCode, setGeneratedCode] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (state.code) {
        setGeneratedCode(state.code);
    }
    // Optionally clear form on success or keep it
    // if (state.message === 'Code generated successfully!') {
    //   formRef.current?.reset();
    // }
  }, [state]);

  return (
    <Card className="w-full shadow-lg rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Generate Python Code</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter a description of the Python functionality you need, and the AI will generate the code for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="block text-sm font-medium mb-1 text-foreground">
              Your Prompt
            </Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="e.g., 'Create a Python function that takes a list of numbers and returns the sum.'"
              required
              className="min-h-[100px] bg-secondary/50 border-input focus:border-accent focus:ring-accent"
              aria-describedby="prompt-error"
            />
            {state.errors?.prompt && (
              <p id="prompt-error" className="text-sm text-destructive mt-1">
                {state.errors.prompt[0]}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>

        {state.message && !state.code && state.message !== 'Validation failed.' && (
          <Alert variant={state.message.includes('Failed') ? "destructive" : "default"} className="mt-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{state.message.includes('Failed') ? 'Error' : 'Status'}</AlertTitle>
            <AlertDescription>
              {state.message}
            </AlertDescription>
          </Alert>
        )}

        {generatedCode && (
          <div className="mt-6">
            <Label className="block text-sm font-medium mb-2 text-foreground">Generated Code</Label>
            <div className="bg-primary/5 border border-border rounded-md p-4 shadow-inner">
              <pre className="text-sm whitespace-pre-wrap overflow-x-auto font-mono text-foreground">
                <code>{generatedCode}</code>
              </pre>
            </div>
             <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="mt-2"
              >
                Copy Code
              </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
