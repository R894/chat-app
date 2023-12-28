import Avatar from "./Avatar";

const Message = ({ name, content }: { name: string; content: string }) => {
  return (
    <>
      <div className="flex gap-2 hover:bg-base-200 p-2">
        <Avatar name={name} />
        <p>{content}</p>
      </div>
    </>
  );
};

export default Message;
