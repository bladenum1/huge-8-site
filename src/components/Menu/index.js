import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LockIcon from '@material-ui/icons/Lock';
import InfoIcon from '@material-ui/icons/Info';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PeopleIcon from '@material-ui/icons/People';
import CodeIcon from '@material-ui/icons/Code';
import HomeIcon from '@material-ui/icons/Home';
import useGlobal from "../../state";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

const Menu = () => {
  const classes = useStyles();

  const [globalState, globalActions] = useGlobal();

  const toggleDrawer = () => event => {
    globalActions.menuToggle(false);
  };

  const setPage = (page) => event => {
    if(page === 'Home') { globalActions.titleHandler(globalState.title); }
    globalActions.setPage(page);
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <List>
        {['Home', 'About', 'Statistics', 'Members', 'Author'].map((txt, index) => (
          <ListItem button key={txt} onClick={setPage(txt)}>
            <ListItemIcon>{
                txt === 'About' ? <InfoIcon /> : 
                txt === 'Statistics' ? <EqualizerIcon /> : 
                txt === 'Members' ? <PeopleIcon /> : 
                txt === 'Author' ? <CodeIcon /> : 
                txt === 'Home' ? <HomeIcon /> :
                undefined 
            }</ListItemIcon>
            <ListItemText primary={txt} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Admin'].map((txt, index) => (
          <ListItem button key={txt} onClick={setPage(txt)}>
            <ListItemIcon>{<LockIcon />}</ListItemIcon>
            <ListItemText primary={txt} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <SwipeableDrawer
        open={globalState.menuToggle}
        onClose={toggleDrawer()}
        onOpen={toggleDrawer()}
      >
        {sideList()}
      </SwipeableDrawer>
    </div>
  );
}

export default Menu;
