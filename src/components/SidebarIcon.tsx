import Image from "next/image";

interface SidebarIconProps {
  name: string;
  file: string;
  isActive: boolean;
}

const SidebarIcon = ({ isActive, name, file }: SidebarIconProps) => {
  return (
    <div
      className={`flex cursor-pointer items-center gap-[20px] border-r-[6px] ${isActive ? `border-r-[#4F35F3] bg-[#F5F3FF]` : "border-r-transparent"} p-[20px]`}
    >
      <Image alt="calendar" src={file} width={36} height={36} />
      <span
        className={`font-sfProText text-[18px] font-semibold uppercase leading-[21px] ${isActive ? `text-[#4F35F3]` : `text-[#65676D]`} `}
      >
        {name}
      </span>
    </div>
  );
};

export default SidebarIcon;
