import React from 'react';
import useGlobal from "../state";

let init = true;
const Init = () => {
    const global = useGlobal();
    const globalActions = global[1];
    if (init){
        init = false;
        (async () => {
            let init = await fetch('./content/init.json');
            init = await init.json();
            init.protocol = 'https';
            globalActions.setInit(init);
        })();
        (async () => {
            let home_content = await fetch('./content/home.txt');
            home_content = await home_content.text();
            globalActions.setHomeContent(home_content);
        })();
    }
    return (
        <div></div>
    );
};

export default Init;