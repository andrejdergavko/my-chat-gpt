'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Field, FieldGroup } from '@/shared/components/ui/field';
import { GoogleIcon } from '@/shared/components/icons/GoogleIcon';
import { cn } from '@/lib/utils';
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/google', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to get Google OAuth URL');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('w-[388px]', className)} {...props}>
      <Card className="rounded-3xl px-4 py-10 border-none bg-background">
        <CardHeader className="text-center">
          <CardTitle className="text-[30px] font-bold mb-6">
            Войти или зарегистрироваться
          </CardTitle>
          <CardDescription className="text-base mb-6">
            Вы будете получать более продуманные ответы и сможете загружать
            файлы, изображения и многое другое.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="rounded-4xl h-12 w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <GoogleIcon className="mr-2" />
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
