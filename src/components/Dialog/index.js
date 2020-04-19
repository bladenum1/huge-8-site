import React from 'react';
import Button from '@material-ui/core/Button';
import DialogBox from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import useGlobal from "../../state";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const Dialog = () => {
    const [globalState, globalActions] = useGlobal();

    const dialogToggle = () => {
        globalActions.dialogToggle(!globalState.dialog);
    }

    return (
        <div>
            <DialogBox
                open={globalState.dialog}
                onClose={dialogToggle}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Would you like to copy https://tobyis.fun to your clipboard?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogToggle} color="primary">
                        Close
                    </Button>
                    <CopyToClipboard text={'https://tobyis.fun'}>      
                        <Button onClick={dialogToggle} color="primary" autoFocus>
                            Copy
                        </Button>
                    </CopyToClipboard>
                </DialogActions>
            </DialogBox>
        </div>
    );
}

export default Dialog;