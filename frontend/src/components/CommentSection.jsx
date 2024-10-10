"use client";
// components/CommentSection.js
import React, { useState } from 'react';
import { addComment } from '../lib/api';

const CommentSection = ({ taskId, comments, onCommentAdded }) => {
    const [newComment, setNewComment] = useState('');

    const handleAddComment = async () => {
        if (newComment.trim())
        {
            try
            {
                const updatedComments = await addComment(taskId, newComment);
                onCommentAdded(updatedComments);
                setNewComment('');
            } catch (error)
            {
                console.error('Failed to add comment:', error);
            }
        }
    };

    return (
        <div className="mt-4">
            <h4 className="font-bold mb-2">Comments</h4>
            {comments.map((comment, index) => (
                <div key={index} className="bg-gray-700 p-2 mb-2 rounded">
                    <p className="text-sm">{comment.text}</p>
                    <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString()}</span>
                </div>
            ))}
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 mb-2 bg-gray-700 rounded"
                placeholder="Add a comment..."
                rows="2"
            />
            <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700"
            >
                Add Comment
            </button>
        </div>
    );
};