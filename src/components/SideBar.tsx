"use client";
import Image from "next/image";
import SidebarIcon from "@/components/SidebarIcon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signOut } from "@/actions/auth";
import { useRouter } from "next/navigation";

interface SideBarProps {}

const SideBar = ({}: SideBarProps) => {
  const router = useRouter();
  return (
    <div className="flex h-full min-w-[276px] max-w-[500px] flex-col">
      <div className="px-[48px] pb-[60px] pt-[40px]">
        <Image alt="logo" src="/logo.png" width={180} height={44} />
      </div>
      <div className="flex flex-1 flex-col overflow-auto">
        <SidebarIcon
          name="calendar"
          isActive={true}
          file="/icons/side-nav/calendar.svg"
        />
        <SidebarIcon
          name="INBOX"
          isActive={false}
          file="/icons/side-nav/inbox.svg"
        />
        <SidebarIcon
          name="NOTES"
          isActive={false}
          file="/icons/side-nav/notes.svg"
        />
        <SidebarIcon
          name="TODO LIST"
          isActive={false}
          file="/icons/side-nav/to-do.svg"
        />
        <SidebarIcon
          name="SETTINGS"
          isActive={false}
          file="/icons/side-nav/settings.svg"
        />
      </div>
      <Button
        variant={"destructive"}
        className="mx-[20px] mb-[20px]"
        onClick={() => {
          toast.promise(signOut(), {
            loading: "Logging Out...",
            success: ({ data, error }) => {
              if (error) {
                throw error;
              }
              router.push("/login");
              return "Logged Out";
            },
            error: (error) => {
              return error.message;
            },
          });
        }}
      >
        LogOut
      </Button>
    </div>
  );
};

export default SideBar;
