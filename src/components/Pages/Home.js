import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import useGlobal from "../../state";

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
  const globals = useGlobal();
  const globalState = globals[0];
  return (
    <div className={classes.root}>
      <div align="center" className={classes.img}>
        <img width="200px" src="/imgs/huge-8.png" alt="The Big 8"></img>
      </div>
      <div align="center" className={classes.body}>
        <Typography variant="h4">
          {globalState.homeContent}
        </Typography>
      </div>
    </div>
  );
}

export default Home;