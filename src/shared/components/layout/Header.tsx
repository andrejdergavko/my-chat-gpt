'use client';

import { useState } from 'react';
import { ChevronDown, Zap, Brain, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useLoginModal } from '@/shared/providers/LoginModalProvider';

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

  return (
    <header className="flex items-center justify-between px-6 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="lg" className="text-lg">
            {selectedModel.name}
            <ChevronDown className="w-4 h-4" />
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
                className="flex items-center gap-3 py-4 px-3 cursor-pointer justify-between pr-2"
              >
                <div className="flex max-w-62 items-center gap-3 flex-1">
                  <Icon className="w-5 h-5  flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 ml-2 flex-shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-3">
        <Button onClick={openLoginModal}>Войти</Button>
        <Button variant="outline">Зарегистрироваться бесплатно</Button>
      </div>
    </header>
  );
}
