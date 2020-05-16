import React from 'react';

import About from './About';
import Author from './Author';
import Members from './Members';
import Statistics from './Statistics';
import Admin from './Admin';
import Home from './Home';
import Twitter from '../Twitter';

import useGlobal from "../../state";


const Pages = () => {
    const [globalState] = useGlobal();
    return (
        <div>
            {
            globalState.page === 'About' ?
                <About /> :
            globalState.page === 'Author' ?
                <Author /> :
            globalState.page === 'Members' ?
                <Members /> :
            globalState.page === 'Statistics' ?
                <Twitter /> : 
            globalState.page === 'Admin' ?
                <Admin /> : 
            globalState.page === 'Home' ?
                <Home /> :
                <div></div>
            }
        </div>
    );
}

export default Pages;