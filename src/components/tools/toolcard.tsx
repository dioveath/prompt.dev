import { ToolExtended } from "@/pages/tools";
import React from "react";

type ToolCardProps = {
  tool: ToolExtended;
};

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="max-w-md w-full shadow-xl rounded-md overflow-clip">
      <div className="bg-purple-500 p-4">
        <h1 className="text-2xl font-bold text-white">{tool.title}</h1>
      </div>

      <div className="p-4">
        <p>{tool.avatar}</p>
        <p>{tool.shortDescription}</p>
        <p>{tool.website}</p>
        <ul className="">
          {tool?.toolAuthors.map((usersOnTools: any) => {
            const author = usersOnTools.user;
            return (
              <li key={author.id} className="text-xs font-bold">
                {author.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
