import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { useChatStream } from '../hooks/useChatStream';

export function Chat() {
  const { messages, isStreaming, sendMessage } = useChatStream();

  return (
    <div className="relative h-full w-full">
      <div className="mb-20 flex h-full w-full flex-col items-center overflow-auto [clip-path:polygon(0%_0%,100%_0%,100%_100%,90%_100%,90%_calc(100%-50px),0%_calc(100%-50px))]">
        <div className="mt-20 mb-[260px] w-[770px]">
          <ChatMessages messages={messages} />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-1/2 w-[770px] -translate-x-1/2 pt-4 pb-2">
        <ChatInput onSendMessage={sendMessage} isLoading={isStreaming} />
        <p className="text-muted-foreground mt-2 w-full text-center text-xs font-medium">
          ChatGPT может допускать ошибки. Проверяйте важную информацию. Смотрите
          настройки cookie-файлов.
        </p>
      </div>
    </div>
  );
}
