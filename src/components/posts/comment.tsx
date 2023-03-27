import React, { useState } from "react";
import Image from "next/image";

import AddComment from "./add_comment";
import { CommentExtended, useCommentContext } from "@/pages/posts/[id]";

type CommentCardProps = {
  comment: CommentExtended,
};

export default function CommentCard({ comment }: CommentCardProps) {
  const { groupComments } = useCommentContext();
  const [isFormOpen, setFormOpen] = useState(false);
  const replyComments = groupComments[comment.id] || [];

  return (
    <>
      <div key={comment.id} className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-start gap-2">
          <Image
            alt={`${comment?.author?.name} Profile`}
            src={comment?.author?.avatar}
            className="rounded-full"
            width={"40"}
            height={"40"}
          />
          <div>
            <h1 className="text-sm text-gray-500">{comment?.author?.name}</h1>
            <p className="text-black">{comment?.content}</p>
          </div>
        </div>
        <div className="max-w-md flex justify-between items-center gap-4 text-xs">
            <div> upvote </div>
            <div> downvote </div>            
            <div className="flex flex-row gap-2">
                <button onClick={() => setFormOpen(!isFormOpen)}> reply </button>
            </div>
        </div>
        {isFormOpen && <AddComment comment={{ id: comment.id, postId: comment.post.id }} setFormOpen={setFormOpen}/>}
        <div className="w-full flex justify-start">
            <div className="min-h-full w-10 border-l-2 border-gray-200"/>
            <div className="w-full">
                {replyComments.map((comment: CommentExtended) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}                    
            </div>
        </div>
      </div>
    </>
  );
}
