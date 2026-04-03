'use client';

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
import { useGoogleSignIn } from '@/modules/auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { mutate: signInWithGoogle, isPending, error } = useGoogleSignIn();

  const handleGoogleSignIn = () => {
    signInWithGoogle();
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
                  disabled={isPending}
                >
                  <GoogleIcon className="mr-2" />
                  {isPending ? 'Загрузка...' : 'Продолжить с Google'}
                </Button>
              </Field>
              {error && (
                <Field>
                  <div className="text-red-500 text-sm text-center">
                    Произошла ошибка при входе
                  </div>
                </Field>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
