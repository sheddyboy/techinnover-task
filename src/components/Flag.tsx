import Image from "next/image";

interface FlagProps {
  type: "grey" | "red" | "green";
}

const Flag = ({ type }: FlagProps) => {
  return (
    <Image
      alt="flag"
      src={
        type === "green"
          ? "/icons/green-flag.svg"
          : type === "grey"
            ? "/icons/grey-flag.svg"
            : "/icons/red-flag.svg"
      }
      width={24}
      height={24}
    />
  );
};

export default Flag;
