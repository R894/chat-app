import Avatar from "./Avatar";

const MessageComponent = ({
  name,
  content,
}: {
  name: string;
  content: string;
}) => {
  return (
    <>
      <div className="gap-3 flex hover:bg-base-200 p-2 items-center">
        <div>
          <Avatar name={name} large={true} />
        </div>
        <div className="flex flex-col">
          <p className="font-semibold">{name}</p>
          <p>{content}</p>
        </div>
      </div>
    </>
  );
};

export default MessageComponent;
