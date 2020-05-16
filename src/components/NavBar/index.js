import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import useGlobal from "../../state";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
    menuButton: {
        marginRight: theme.spacing(0),
    },
    title: {
        flexGrow: 1,
    },
    socials: {
        flexGrow: 1,
        marginLeft: theme.spacing(0),
    },
}));

const NavBar = () => {
    const classes = useStyles();
    const [globalState, globalActions] = useGlobal();
    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ background: 'black'}}>
                <Toolbar>
                <IconButton onClick={() => globalActions.menuToggle(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <IconButton onClick={() => globalActions.setPage('Home')} className={classes.socials} color="inherit" aria-label="youtube">
                    <img alt ="twitch" height="32px" src={"./imgs/huge-8.png"}/>
                </IconButton>
                <IconButton onClick={() => window.open(`${globalState.init.protocol}://${globalState.init.instagram_url}`)} className={classes.socials} color="inherit" aria-label="instagram">
                    <InstagramIcon />
                </IconButton>
                <IconButton onClick={() => window.open(`${globalState.init.protocol}://${globalState.init.twitter_url}`)} className={classes.socials} align="right" color="inherit" aria-label="twitter">
                    <TwitterIcon />
                </IconButton>
                <IconButton onClick={() => window.open(`${globalState.init.protocol}://${globalState.init.youtube_url}`)} className={classes.socials} color="inherit" aria-label="youtube">
                    <YouTubeIcon />
                </IconButton>
                <IconButton onClick={() => window.open(`${globalState.init.protocol}://${globalState.init.twitch_url}`)} className={classes.socials} color="inherit" aria-label="youtube">
                    <img alt ="twitch" height="32px" src={"./icons/icons8-twitch-512.png"}/>
                </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavBar;