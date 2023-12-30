import { ChangeEvent, FC } from "react";

interface ChatInputProps {
  text: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ChatInput: FC<ChatInputProps> = ({
  text,
  handleInputChange,
  handleInputKeyDown,
}) => {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Type here..."
        className="input input-bordered w-full border focus:outline-none"
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        value={text}
      />
    </div>
  );
};

export default ChatInput;
