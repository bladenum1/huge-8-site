import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    bottom: 0,
    backgroundColor: 'black',
    height: '100%',
  },
});

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
        <h5 align="center" style={{color: 'white'}}>Copyright © 2020 The Huge 8 - All Rights Reserved.</h5>
    </div>
  );
};

export default Footer;