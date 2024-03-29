import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrow from '@mui/icons-material/PlayArrow';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useRef, useState } from 'react';
import styles from './App.module.scss';
import playingVideoGif from './playing-video.gif';

type Video = { name: string; url: string };

function App() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [currentPlayedVideoIndex, setCurrentPlayedVideoIndex] =
    useState<number>(-1);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const play = (index: number): void => {
    const nextVideoIndex = index >= videosList.length || index < 0 ? 0 : index;
    setVideoSrc(videosList[nextVideoIndex].url);
    setCurrentPlayedVideoIndex(nextVideoIndex);
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
              <ListItem className={styles['video-item']} key={video.url}>
                <ListItemButton
                  onClick={() => {
                    play(index);
                  }}
                >
                  {currentPlayedVideoIndex === index && (
                    <img
                      style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        marginRight: '1rem'
                      }}
                      src={playingVideoGif}
                      alt="...loading"
                    />
                  )}
                  <ListItemText primary={video.name} />
                  <ListItemIcon className={styles['play-icon']}>
                    <PlayArrow />
                  </ListItemIcon>
                </ListItemButton>
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
            <Container>
              <video
                ref={videoElementRef}
                style={{ width: '100%', height: '70vh' }}
                controls
                autoPlay
                src={videoSrc}
                onEnded={() => play(currentPlayedVideoIndex + 1)}
                onTimeUpdate={() => {
                  // fix for video with malformed meta data that will not end
                  if (
                    videoElementRef.current?.duration ===
                    videoElementRef.current?.currentTime
                  ) {
                    play(currentPlayedVideoIndex + 1);
                  }
                }}
              ></video>
              <Typography variant="subtitle1">
                Currently playing: {videosList[currentPlayedVideoIndex].name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 'fit-content',
                  gap: '1rem'
                }}
              >
                <Button
                  onClick={() => play(currentPlayedVideoIndex - 1)}
                  variant="contained"
                  startIcon={<ChevronLeft />}
                >
                  Prev
                </Button>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Button
                  onClick={() => play(currentPlayedVideoIndex + 1)}
                  variant="contained"
                  endIcon={<ChevronRight />}
                >
                  Next
                </Button>
              </Box>
            </Container>
          ) : (
            <Typography variant="body1">Select videos to start</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
