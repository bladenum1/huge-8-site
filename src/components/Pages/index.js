import React from 'react';

import About from './About';
import Author from './Author';
import Members from './Members';
import Statistics from './Statistics';
import Home from './Home';

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
                <Statistics /> : 
            globalState.page === 'Home' ?
                <Home /> :
                <div></div>
            }
        </div>
    );
}

export default Pages;