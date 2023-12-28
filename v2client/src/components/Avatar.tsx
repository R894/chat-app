import { FC } from "react";

interface AvatarProps{
    name:string;
    online?:boolean;
}

const Avatar: FC<AvatarProps> = ({name, online}) => {
  return (
    <div className={`avatar placeholder ${ online && 'online'}`}>
      <div className="bg-neutral text-neutral-content rounded-full w-6">
        <span className="text-xs">{name[0].toUpperCase()}</span>
      </div>
    </div>
  );
};

export default Avatar;
