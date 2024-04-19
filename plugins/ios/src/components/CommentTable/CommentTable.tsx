import React, { useEffect, useState } from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { Button } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { IosIn, iosApiRef } from '../../api';

export const CommentComponent = () => {
  const [comments, setComments] = useState<IosIn[]>([]);
  const iosApi = useApi(iosApiRef);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await iosApi.getComments();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [iosApi]);

  const handleDeleteComment = async (username: string, comment: string) => {
    try {
      await iosApi.deleteComment(username, comment);
      const updatedComments = comments.filter(
        c => c.username !== username || c.comment !== comment,
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Comment', field: 'comment' },
    {
      title: 'Actions',
      field: 'actions',
      render: rowData => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDeleteComment(rowData.name, rowData.comment)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const data: { name: string; comment: string; actions: string; }[] = comments.map(comment => ({
    name: comment.username,
    comment: comment.comment,
    actions: comment.username && comment.comment ? 'delete' : '',
  }));

  return <Table title="Comments" columns={columns} data={data} />;
};

