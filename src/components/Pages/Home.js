import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {

  },
  img: {
    width: "100%",
  },
  body: {
    width: "100%",
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div align="center" className={classes.img}>
        <img width="200px" src="/imgs/huge-8.png" alt="The Big 8"></img>
      </div>
      <div align="center" className={classes.body}>
        <Typography variant="h4">
          It's Happening
        </Typography>
      </div>
    </div>
  );
}

export default Home;