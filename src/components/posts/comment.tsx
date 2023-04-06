import React, { useState } from "react";
import Image from "next/image";

import AddComment from "./add_comment";
import { CommentExtended, useCommentContext } from "@/pages/posts/[id]";
import { Avatar, Button } from "@mui/material";
import toast from "react-hot-toast";
import { useUser } from "@auth0/nextjs-auth0/client";

type CommentCardProps = {
  comment: CommentExtended;
};

export default function CommentCard({ comment }: CommentCardProps) {
  const { groupComments } = useCommentContext();
  const [isFormOpen, setFormOpen] = useState(false);
  const replyComments = groupComments ? groupComments[comment.id] || [] : [];
  const { user, isLoading, error } = useUser();

  return (
    <>
      <div key={comment.id} className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-start gap-2">
          <Avatar alt={`${comment?.author?.name} Profile`} src={comment?.author?.avatar} />
          <div>
            <h1 className="text-sm text-gray-500">{comment?.author?.name}</h1>
            <p className="text-black">{comment?.content}</p>
          </div>
        </div>
        <div className="max-w-md flex justify-between items-center gap-4 text-xs">
          <div> upvote </div>
          <div> downvote </div>
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => {
                if (!user) return toast.error("You must be logged in to comment");
                setFormOpen(!isFormOpen);
              }}
            >
              reply
            </Button>
          </div>
        </div>
        {isFormOpen && <AddComment comment={{ id: comment.id, postId: comment.post.id }} setFormOpen={setFormOpen} />}
        <div className="w-full flex justify-start">
          <div className="min-h-full w-10 border-l-2 border-gray-200" />
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
