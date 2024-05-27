import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Typography,
  IconButton,
  Paper,
  Tooltip,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import { Table, TableColumn, InfoCard, CodeSnippet } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

type GithubRepoPreviewProps = {
  repoUrl: string;
};

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxHeight: '60vh',
    marginBottom: theme.spacing(2),
  },
  table: {
    width: '100%',
  },
  dialogContent: {
    maxWidth: '80vw',
    overflowX: 'hidden',
  },
  readme: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(2),
  },
  codeContainer: {
    position: 'relative',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  copyButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  markdown: {
    '& img': {
      maxWidth: '100%',
    },
    '& a': {
      color: theme.palette.primary.main,
    },
  },
  repoOverview: {
    marginTop: theme.spacing(3),
  },
  backButton: {
    marginBottom: theme.spacing(2),
  },
}));

const parseRepoUrl = (url: string) => {
  if (!url) throw new Error('URL is undefined');
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2] };
};

const GithubRepoPreview: React.FC<GithubRepoPreviewProps> = ({ repoUrl }) => {
  const classes = useStyles();
  const config = useApi(configApiRef);
  const githubToken = config.getString('integrations.github[0].token');

  const fetchGithubRepoContents = async (owner: string, repo: string, path: string = '') => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${githubToken}`,
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
        Authorization: `token ${githubToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching file contents: ${response.statusText}`);
    }
    return response.text();
  };

  const sortContents = (contents: any[]) => {
    return contents.sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.name.localeCompare(b.name);
    });
  };

  if (!repoUrl) {
    return <Typography variant="h6">No repository URL provided</Typography>;
  }

  let owner: string;
  let repo: string;

  try {
    const parsedUrl = parseRepoUrl(repoUrl);
    owner = parsedUrl.owner;
    repo = parsedUrl.repo;
  } catch (error) {
    return <Typography variant="h6">{error.message}</Typography>;
  }

  const [path, setPath] = useState('');
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isFile, setIsFile] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const data = await fetchGithubRepoContents(owner, repo, path);
        if (Array.isArray(data)) {
          const sortedContents = sortContents(data);
          setContents(sortedContents);
          setIsFile(false);

          // Check for .md files in the directory
          const mdFile = sortedContents.find((item) => item.name.toLowerCase().endsWith('.md'));
          if (mdFile) {
            const mdData = await fetchGithubFileContents(owner, repo, mdFile.path);
            setMarkdownContent(mdData);
          } else {
            setMarkdownContent(null);
          }
        } else {
          const fileData = await fetchGithubFileContents(owner, repo, path);
          setFileContent(fileData);
          setFileName(path.split('/').pop() || '');
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

  const handleItemClick = async (item: any) => {
    if (item.type === 'dir') {
      setPath(item.path);
    } else {
      try {
        setLoading(true);
        const fileData = await fetchGithubFileContents(owner, repo, item.path);
        setFileContent(fileData);
        setFileName(item.name);
        setIsFile(true);
      } catch (error) {
        console.error('Error fetching file contents:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackClick = () => {
    const newPath = path.split('/').slice(0, -1).join('/');
    setPath(newPath);
    setIsFile(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const columns: TableColumn[] = [
    {
      title: '',
      field: 'icon',
      render: (rowData) => (rowData.type === 'dir' ? <FolderIcon /> : <InsertDriveFileIcon />),
    },
    { title: 'Name', field: 'name' },
    { title: 'Type', field: 'type' },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h4" className={classes.repoOverview}>Repository Overview</Typography>
      {(path || isFile) && (
        <IconButton className={classes.backButton} onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
      )}
      {!isFile && (
        <Table
          columns={columns}
          data={contents}
          onRowClick={(_, rowData) => handleItemClick(rowData)}
          options={{
            paging: false,
            search: true,
            showTitle: false,
            toolbar: false,
          }}
        />
      )}
      {isFile ? (
        <div className={classes.codeContainer}>
          <Tooltip title="Copy to clipboard">
            <IconButton className={classes.copyButton} onClick={() => handleCopy(fileContent || '')}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <InfoCard title={fileName}>
            <CodeSnippet text={fileContent || ''} language="auto" showLineNumbers />
          </InfoCard>
        </div>
      ) : (
        markdownContent && (
          <Paper className={classes.readme}>
            <Typography variant="h4">Markdown File</Typography>
            <ReactMarkdown className={classes.markdown} rehypePlugins={[rehypeRaw]} remarkPlugins={[gfm]}>
              {markdownContent}
            </ReactMarkdown>
          </Paper>
        )
      )}
    </>
  );
};
