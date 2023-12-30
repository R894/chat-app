import { FC } from "react";

interface AvatarProps{
    name:string;
    online?:boolean;
    large?: boolean
}

const Avatar: FC<AvatarProps> = ({name, online, large}) => {
  return (
    <div className={`avatar placeholder ${ online && 'online'}`}>
      <div className={`bg-neutral text-neutral-content rounded-full ${!large ? 'w-6': 'w-10'}`}>
        <span className={`${!large? 'text-xs' : 'text-base'}`}>{name[0].toUpperCase()}</span>
      </div>
    </div>
  );
};

export default Avatar;
