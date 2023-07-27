import MenuIcon from '@mui/icons-material/Menu';
import PlayArrow from '@mui/icons-material/PlayArrow';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';

type Video = { name: string; url: string };

function App() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [currentPlayedVideoIndex, setCurrentPlayedVideoIndex] =
    useState<number>(-1);

  const play = (index: number): void => {
    setVideoSrc(videosList[index].url);
    setCurrentPlayedVideoIndex(index);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files: File[] = [...e.target.files!];

    const videoList: Video[] = [];
    for (const file of files) {
      const fileName = file.name;
      const fileNameWithoutExt =
        fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      const fileURL = URL.createObjectURL(file);

      videoList.push({
        name: fileNameWithoutExt,
        url: fileURL
      });
    }

    setVideosList(videoList);
    setVideoSrc(videoList[0].url);
    setCurrentPlayedVideoIndex(0);
  };

  const onVideoEnded = (): void => {
    console.log(`Nam data is: video ended`);
    const nextVideoIndex =
      currentPlayedVideoIndex === videosList.length - 1
        ? 0
        : currentPlayedVideoIndex + 1;
    console.log(`Nam data is: nextVideoIndex`, nextVideoIndex);
    setCurrentPlayedVideoIndex(nextVideoIndex);
    setVideoSrc(videosList[nextVideoIndex].url);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Container>
          <Typography variant="h2" gutterBottom>
            Play list
          </Typography>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={onInputChange}
          />
          <List>
            {videosList.map((video, index) => (
              <ListItem key={video.url}>
                <Button
                  onClick={() => {
                    play(index);
                  }}
                  endIcon={<PlayArrow />}
                >
                  {video.name}
                </Button>
              </ListItem>
            ))}
          </List>
        </Container>
      </Drawer>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} padding={4}>
        <Grid xs={12} alignItems={'center'}>
          {videosList.length ? (
            <>
              <video
                style={{ width: '100%', height: '70vh' }}
                controls
                autoPlay
                src={videoSrc}
                onEnded={() => onVideoEnded()}
              ></video>
              <Typography variant="subtitle1">
                Currently playing: {videosList[currentPlayedVideoIndex].name}
              </Typography>
            </>
          ) : (
            <Typography variant="body1">Select videos to start</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
