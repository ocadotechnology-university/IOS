import React, { useEffect, useState } from 'react';
import { CircularProgress, List, ListItem, ListItemText, Typography, Button } from '@material-ui/core';

type GithubRepoPreviewProps = {
  owner: string;
  repo: string;
  path?: string;
};

const fetchGithubRepoContents = async (owner: string, repo: string, path: string = '') => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching repository contents: ${response.statusText}`);
  }
  return response.json();
};

const fetchGithubFileContents = async (owner: string, repo: string, path: string = '') => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Accept: 'application/vnd.github.v3.raw',
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching file contents: ${response.statusText}`);
  }
  return response.text();
};

export const GithubRepoPreview: React.FC<GithubRepoPreviewProps> = ({ owner, repo, path = '' }) => {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isFile, setIsFile] = useState(false);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const data = await fetchGithubRepoContents(owner, repo, path);
        if (Array.isArray(data)) {
          setContents(data);
          setIsFile(false);
        } else {
          const fileData = await fetchGithubFileContents(owner, repo, path);
          setFileContent(fileData);
          setIsFile(true);
        }
      } catch (error) {
        console.error('Error fetching repository contents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [owner, repo, path]);

  if (loading) {
    return <CircularProgress />;
  }

  if (isFile) {
    return (
      <div>
        <Button onClick={() => window.history.back()}>Back</Button>
        <Typography variant="h4">File: {path}</Typography>
        <pre>{fileContent}</pre>
      </div>
    );
  }

  return (
    <div>
      {path === '' && <Typography variant="h4">Repository Structure</Typography>}
      {path !== '' && <Button onClick={() => window.history.back()}>Back</Button>}
      <List>
        {contents.map((item) => (
          <ListItem key={item.sha} button onClick={() => window.location.assign(`#${item.path}`)}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};


