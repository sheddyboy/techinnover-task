"use client";
import { getFormattedDate } from "@/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Tasks } from "@/db/schema";
import { PanelLeftDashed } from "lucide-react";
import useStore from "@/store";

interface NavbarProps {
  tasks: (typeof Tasks.$inferSelect)[] | null;
  setBoardTasks?: Dispatch<SetStateAction<(typeof Tasks.$inferSelect)[]>>;
}

const Navbar = ({ tasks, setBoardTasks }: NavbarProps) => {
  const { toggleSideBarWidth, sideBarWidth } = useStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("search", search);

    setBoardTasks &&
      setBoardTasks(
        tasks
          ? tasks.filter(
              (task) =>
                task.name
                  .toLowerCase()
                  .trim()
                  .includes(search.toLowerCase().trim()) ||
                task.description
                  ?.toLowerCase()
                  .trim()
                  .includes(search.toLowerCase().trim()),
            )
          : [],
      );
  }, [search, setBoardTasks, tasks]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 overflow-auto px-[38px]">
      <div className="flex shrink-0 items-center gap-4 font-sfProText text-[30px] font-medium leading-[32px] text-black">
        <Button
          variant={"link"}
          className={`p-0 ${sideBarWidth === "276px" ? "hidden" : "flex"}`}
          onClick={() => {
            toggleSideBarWidth(sideBarWidth);
          }}
        >
          <PanelLeftDashed />
        </Button>
        {getFormattedDate()}
        <div className="flex items-center gap-4 max-sm:hidden">
          <Button variant={"link"} className="p-0">
            <Image
              alt="left-icon"
              src={"/icons/left-icon.svg"}
              width={40}
              height={40}
            />
          </Button>
          <Button variant={"link"} className="p-0">
            <Image
              alt="right-icon"
              src={"/icons/right-icon.svg"}
              width={40}
              height={40}
            />
          </Button>
        </div>
      </div>
      <div className="relative flex shrink-0 items-center max-sm:w-full max-sm:max-w-none">
        <Image
          alt="search-icon"
          src={"/icons/search-icon.svg"}
          className="absolute left-[8px]"
          width={24}
          height={24}
        />
        <Input
          value={search}
          onChange={handleChange}
          placeholder="Search"
          className="h-auto max-w-[236px] rounded-[6px] border border-[#dde2e4] py-[8px] pl-[40px] text-[14px] leading-[24px] -tracking-[0.006em] shadow-custom placeholder:text-[#9AA6AC] max-sm:w-full max-sm:max-w-none max-sm:text-[16px]"
        />
      </div>
    </div>
  );
};

export default Navbar;
