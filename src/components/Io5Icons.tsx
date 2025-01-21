import * as Icons from "react-icons/io5";

export type Io5IconName = keyof typeof Icons;

interface IIo5Icons {
  iconName: Io5IconName;
  className?: string;
  fallbackIconName?: Io5IconName;
}

const Io5Icons = ({ iconName, className, fallbackIconName }: IIo5Icons) => {
  const IconComponent =
    Icons[iconName] || Icons[fallbackIconName || "IoEllipseOutline"];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} />;
};

export default Io5Icons;
