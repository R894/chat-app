import { useEffect, useState } from "react";

const Alert = ({
  message,
  duration = 2000,
}: {
  message: string;
  duration?: number;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timeOut);
  }, [duration]);
  return isVisible ? (
    <div className="absolute flex flex-col mt-2 max-w-56 top-0 left-1/2 transform -translate-x-1/2 alert alert-success">
      {message}
      <progress className="progress" />
    </div>
  ) : null;
};

export default Alert;
