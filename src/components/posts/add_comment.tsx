import React, { useEffect, useRef } from 'react'
import Button from '@mui/material/Button';
import { gql, useMutation } from '@apollo/client';
import { useRefresh } from '@/hooks/useRefresh';
import { CommentExtended, useCommentContext } from '@/pages/posts/[id]';
import apolloClient from '../../../lib/apollo';
import { TextField, TextareaAutosize } from '@mui/material';

type AddCommentProps = {
    comment: { postId: string, id?: string }
    setFormOpen: (value: boolean) => void;
}

const addCommentMutation = gql`
    mutation($content: String!, $postId: ID!, $parentId: ID) {
        createComment(content: $content, postId: $postId, parentId: $parentId) {
            id
            content
            createdAt
            updatedAt
            author {
                id
                name
                avatar
            }
            post {
                id
            }
        }
    }
`;

export default function AddComment({ comment, setFormOpen }: AddCommentProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [addComment, { data, loading, error }] = useMutation(addCommentMutation);
    
    const onAddComment = async (content: string) => {
        if(!content) return;

        try {
            const addedComment = await addComment({ variables: { content: content, postId: comment.postId, parentId: comment.id } });
            setFormOpen(false);
            textareaRef.current!.value = "";
            apolloClient.refetchQueries({ include: "active" });
        } catch (error) {
            console.log(error);
        }
  };


  return (
    <form action="#" className='flex w-full items-center gap-4'>
        <div className='flex-1'>
            <TextField id='outlined-basic' label='Your message' variant='outlined' multiline rows={2} maxRows={4} fullWidth inputRef={textareaRef}/>
            { error && <div className='text-xs text-red-500'> {error.message} </div> }
        </div>
        
        <div className='flex flex-col gap-1'>
            <Button onClick={(e) => onAddComment(textareaRef.current?.value || "")} variant='contained'> Add Comment </Button>
            <Button onClick={(e) => setFormOpen(false)} variant='text'> Cancel Comment </Button>        
        </div>
        
    </form>
  )
}
