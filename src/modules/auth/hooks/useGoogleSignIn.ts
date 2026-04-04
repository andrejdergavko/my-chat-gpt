import { useMutation } from "@tanstack/react-query";

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/google", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Не удалось получить URL Google OAuth");
      }

      const { url } = await response.json();
      return url;
    },
    onSuccess: (url) => {
      if (url) {
        window.location.href = url;
      }
    },
    onError: (error: Error) => {
      console.error("Ошибка входа:", error);
    },
  });
}
