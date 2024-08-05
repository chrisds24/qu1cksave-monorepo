'use client'

import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Card, CardContent, CardMedia, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function FeaturesList() {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.down('xl'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const xs = useMediaQuery(theme.breakpoints.down('xs'));

  let col = 3;
  if (xs) {
    col = 1
  } else if (sm) {
    col = 1
  } else if (md) {
    col = 1
  } else if (lg) {
    col = 2
  } else if (xl) {
    col = 3
  }
  
  return (
    <ImageList
      sx={{
        maxWidth: {xs: '95vw', lg: '90vw'},
      }}
      cols={col}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          {/* <img
            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          /> */}
          <Card sx={{ maxWidth: 345, backgroundColor: '#000000' }}>
            <CardMedia
              component="img"
              image={item.img}
              alt={item.title}
              height="300px"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{color: '#ffffff'}}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="#707477" sx={{fontSize: '17px'}}>
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </Card>
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  }
];