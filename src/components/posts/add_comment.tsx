import React, { useRef } from 'react'
import Button from '@mui/material/Button';
import { gql, useMutation } from '@apollo/client';
import apolloClient from '../../../lib/apollo';
import { TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useUser } from '@auth0/nextjs-auth0/client';

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
    const { user, isLoading: userLoading, error: userError } = useUser();

    const onAddComment = async (content: string) => {
        if(!user) return toast.error("You must be logged in to comment");
        if(!content) return toast.error("You must enter a comment");

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
