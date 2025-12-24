'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RegisterForm } from '@/features/auth/register-form';
import { useAuthStore } from '@/shared/lib/store/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { ApiException } from '@repo/shared';
import { CheckSquare, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => register(data),
    onSuccess: () => {
      toast.success('Account created successfully! Redirecting...');
      router.push(ROUTES.TODOS);
    },
    onError: (error) => {
      if (error instanceof ApiException) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    },
  });

  const errorMessage = mutation.error instanceof ApiException
    ? mutation.error.message
    : mutation.error
      ? 'An unexpected error occurred. Please try again.'
      : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Beautiful gradient background with pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
              <CheckSquare className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">TaskFlow</span>
          </div>
        </div>
        
        <Card className="card-elevated backdrop-blur-sm bg-card/95 border-border/50">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
            <CardDescription className="text-center">
              Sign up to get started with TaskFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <RegisterForm onSubmit={(data) => mutation.mutate(data)} isLoading={mutation.isPending} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

