import dynamic from "next/dynamic";
import React from "react";
const Select = dynamic(import("react-select"), { ssr: false });


export default function PSelect({ ...others }: any) {
  return (
    <Select
      {...others}
      classNames={{
        control: ({ isFocused }) => `bg-[#101010] text-white bg-border-transparent outline-none`,
      }}
      styles={{
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          return {
            ...styles,
            backgroundColor: isFocused ? "#635cfeee" : "#101010",
            color: isDisabled ? "#ccc" : isSelected ? "#fff" : "#fff",
            cursor: isDisabled ? "not-allowed" : "default",

            ":active": {
              ...styles[":active"],
              backgroundColor: !isDisabled && (isSelected ? "#635cfe" : "#635cfeaa"),
            },
          };
        },
        singleValue: (styles, { data }) => { return { ...styles, color: "#fff" } },
        multiValue(base, props) {
          return { ...base, backgroundColor: "#635cfe" };
        },
        multiValueLabel: (styles, { data }) => ({
          ...styles,
          color: "white",
        }),
        multiValueRemove: (styles, { data }) => ({
          ...styles,
          color: "white",
          ":hover": {
            backgroundColor: "red",
            color: "white",
          },
        }),
      }}
    />
  );
}
