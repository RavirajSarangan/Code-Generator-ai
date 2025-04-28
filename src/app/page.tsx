import PythonTutor from '@/components/python-tutor';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
       <div className="w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 text-primary">
            Python Tutor <span className="text-accent">AI</span>
        </h1>
        <PythonTutor />
      </div>
    </main>
  );
}
