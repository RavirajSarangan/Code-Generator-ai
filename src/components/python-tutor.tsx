'use client';

import * as React from 'react';
import { useActionState } from 'react'; // Keep useActionState from react
import { useFormStatus } from 'react-dom'; // Import useFormStatus from react-dom
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, Copy } from 'lucide-react';
import { handleGenerateCode, type FormState } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"; // Import useToast

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
  // Use useActionState instead of useFormState
  const [state, formAction] = useActionState(handleGenerateCode, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [generatedCode, setGeneratedCode] = React.useState<string | undefined>(undefined);
  const { toast } = useToast(); // Initialize useToast

  React.useEffect(() => {
    if (state.code) {
        setGeneratedCode(state.code);
        // Clear message on success if needed, or display success toast
        // toast({ title: "Success", description: state.message });
    } else if (state.message && state.message !== 'Code generated successfully!' && !state.errors) {
      // Show error toast only if there's a message, it's not the success message, and there are no validation errors
      toast({
          variant: "destructive",
          title: "Error",
          description: state.message,
        });
    }
    // Optionally clear form on success or keep it
    // if (state.message === 'Code generated successfully!') {
    //   formRef.current?.reset();
    // }
  }, [state, toast]); // Add toast to dependency array

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode).then(() => {
        toast({ description: "Code copied to clipboard!" });
      }).catch(err => {
        console.error('Failed to copy code: ', err);
        toast({ variant: "destructive", description: "Failed to copy code." });
      });
    }
  };

  // Determine if there was a failure message (excluding validation errors)
  const hasFailureMessage = state.message && state.message.toLowerCase().includes('failed') && !state.errors;

  return (
    <Card className="w-full shadow-lg rounded-lg overflow-hidden border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-card-foreground">Generate Python Code</CardTitle>
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
              className="min-h-[100px] bg-input border-input focus:border-ring focus:ring-1 focus:ring-ring text-foreground"
              aria-describedby="prompt-error"
              aria-invalid={!!state.errors?.prompt}
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

        {/* Display failure alert only for actual generation failures */}
        {hasFailureMessage && (
          <Alert variant="destructive" className="mt-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>
              {state.message} Please check your API key or try again later.
            </AlertDescription>
          </Alert>
        )}

        {generatedCode && (
          <div className="mt-6 space-y-2">
            <Label className="block text-sm font-medium text-foreground">Generated Code</Label>
            <div className="bg-muted/50 border border-border rounded-md p-4 shadow-inner relative group">
              <pre className="text-sm whitespace-pre-wrap overflow-x-auto font-mono text-foreground">
                <code>{generatedCode}</code>
              </pre>
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyCode}
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/75"
                  aria-label="Copy code"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
