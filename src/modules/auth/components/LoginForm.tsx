"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import { GoogleIcon } from "@/shared/components/icons/GoogleIcon";
import { cn } from "@/lib/utils";
import { useGoogleSignIn } from "@/modules/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: signInWithGoogle, isPending, error } = useGoogleSignIn();

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <div className={cn("w-[388px]", className)} {...props}>
      <Card className="bg-background rounded-3xl border-none px-4 py-10">
        <CardHeader className="text-center">
          <CardTitle className="mb-6 text-[30px] font-bold">
            Войти или зарегистрироваться
          </CardTitle>
          <CardDescription className="mb-6 text-base">
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
                  className="h-12 w-full rounded-4xl"
                  onClick={handleGoogleSignIn}
                  disabled={isPending}
                >
                  <GoogleIcon className="mr-2" />
                  {isPending ? "Загрузка..." : "Продолжить с Google"}
                </Button>
              </Field>
              {error && (
                <Field>
                  <div className="text-center text-sm text-red-500">
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
