import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';

type Video = { name: string; url: string; isPlaying: boolean };

function App() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [videosList, setVideosList] = useState<Video[]>([]);

  const play = (): void => {
    videosList.forEach((vid) => {
      if (vid.isPlaying) {
        setVideoSrc(vid.url);
      }
    });
  };

  const setNextTrack = (jumpToIndex?: number): void => {
    const currentVidIndex = videosList.findIndex((vid) => vid.isPlaying);
    videosList[currentVidIndex].isPlaying = false;

    if (jumpToIndex !== undefined) {
      videosList[jumpToIndex].isPlaying = true;
    } else {
      videosList[
        currentVidIndex === videosList.length - 1 ? 0 : currentVidIndex + 1
      ].isPlaying = true;
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files: FileList = e.target.files!;

    const videoList: Video[] = [];
    for (const [index, value] of Object.entries(files)) {
      const fileName = value.name;
      const fileNameWithoutExt =
        fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      const fileURL = URL.createObjectURL(value);
      if (parseInt(index) === 0) {
        setVideoSrc(fileURL);
      }
      videoList.push({
        name: fileNameWithoutExt,
        url: fileURL,
        isPlaying: parseInt(index) === 0 ? true : false
      });
    }

    setVideosList(videoList);
  };

  const onVideoEnded = (): void => {
    setNextTrack();
    play();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <h1>Hello</h1>
        <input type="file" accept="video/*" multiple onChange={onInputChange} />
        <List>
          {videosList.map((video, index) => (
            <ListItem disablePadding key={video.url}>
              <ListItemButton>
                <ListItemText
                  primary={video.name}
                  onClick={() => {
                    setNextTrack(index);
                    play();
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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

      <Grid container spacing={2}>
        <Grid xs={12} alignItems={'center'}>
          <video
            style={{ width: '100%', height: '70vh' }}
            controls
            autoPlay
            src={videoSrc}
            onEnded={onVideoEnded}
          ></video>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
