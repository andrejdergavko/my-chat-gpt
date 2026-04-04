'use client';

import { useAuth, useLoginModal } from '@/modules/auth';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useState } from 'react';
import { Brain, Check, ChevronDown, Zap } from 'lucide-react';

const models = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'Отлично подходит для повседневных задач',
    icon: Zap,
  },
  {
    id: 2,
    name: 'Deep Seek',
    description: 'Отлично подходит для сложных задач',
    icon: Brain,
  },
];

export default function Header() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const { openLoginModal } = useLoginModal();
  const { isAuthenticated } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="lg" className="text-lg">
            {selectedModel.name}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {models.map((model) => {
            const Icon = model.icon;
            const isSelected = selectedModel.id === model.id;

            return (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className="flex cursor-pointer items-center justify-between gap-3 px-3 py-4 pr-2"
              >
                <div className="flex max-w-62 flex-1 items-center gap-3">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {model.description}
                    </span>
                  </div>
                </div>
                {isSelected && <Check className="ml-2 h-4 w-4 flex-shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-3">
        {!isAuthenticated && (
          <>
            <Button
              size="lg"
              className="rounded-4xl px-4"
              onClick={openLoginModal}
            >
              Войти
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-4xl px-4"
              onClick={openLoginModal}
            >
              Зарегистрироваться бесплатно
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
