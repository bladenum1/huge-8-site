import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Init from '../../init';
import NavBar from '../NavBar';
import Menu from '../Menu';
import Dialog from '../Dialog';
import Pages from '../Pages';
import Footer from '../Footer';

const useStyles = makeStyles({
  header: {
    width: '100%',
    position: 'fixed',
    zIndex: '1',
  },
  root: {
    width: '100%',
    paddingTop: '75px'
  },
  footer: {
    width: '100%',
    position: 'fixed',
    zIndex: '1',
    bottom: '0px',
    backgroundColor: 'black',
  }
});

const App = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.header}>
        <NavBar />
        <Menu />
      </div>
      <div className={classes.root}>
        <Dialog />
        <Pages />
      </div>
      <div className={classes.footer}>
        <Footer />
      </div>
      <Init />
    </div>
  );
}

export default App;