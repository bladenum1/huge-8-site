import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import useGlobal from "../../state";

const fetchFile = async (key) => {
    return key.indexOf('.json') !== -1 ? await(await fetch(key)).json() : await(await fetch(key)).text();
}

const useStyles = makeStyles(theme => ({
    textBox: {
        margin: theme.spacing(1),
        width: "90%"
    },
    submit: {
        margin: theme.spacing(0),
        marginRight: "5%",
        alignSelf: "right",
    }
}));

let email, password, api_key, home_text;
const Admin = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [hidden, setHidden] = React.useState(true);
    const [homeText, setHomeText] = React.useState("");
    const globals = useGlobal();
    const globalState = globals[0];
    

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleShow = () => {
        setHidden(false);
    };

    const handleHomeText = (text) => {
        setHomeText(text);
    };
    
    const handleClickSubmit = async (event) => {
        let body = {};
        if (event.currentTarget.id === "home_submit") {
            body = {
                key: 'content/home.txt',
                content: home_text,
            }
        }
        let params = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': api_key,
              'email': email,
              'password': password,
            },
            redirect: 'follow', // manual, *follow, error
            body: JSON.stringify(body) // body data type must match "Content-Type" header
        };
        await fetch(`https://${globalState.init.api_url}`, params);
    };

    const handleChange = (event) => {
        if (event.target.id === 'email') {
            email = event.target.value;
        } else if (event.target.id === 'password') {
            password = event.target.value;
        } else if (event.target.id === 'api_key') {
            api_key = event.target.value;
        } else if (event.target.id === 'home_text') {
            home_text = event.target.value;
        }
    };

    const handleLogin = async () => {
        let params = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': api_key,
              'email': email,
              'password': password,
            },
            redirect: 'follow', // manual, *follow, error
            body: "" // body data type must match "Content-Type" header
        };
        let resp = await fetch(`https://${globalState.init.api_url}`, params);
        handleClose();
        params.body = "list_editable";
        resp = await fetch(`https://${globalState.init.api_url}`, params);
        resp = await resp.json();
        const keys = resp.keys;

        let editables = {};
        for (let i = 0; i<keys.length; i++) {
            editables[keys[i]] = await fetchFile(keys[i]);
        }
        handleHomeText(editables["content/home.txt"]);
        handleShow();
    };

    const theme = createMuiTheme({
        palette: {
          primary: {
              main: "#000000",
          },
          secondary: {
              main: "#000000",
          },
        }
    });
      
    return (
        <div>
            <div>
                <h1 align="center">Admin</h1>
            </div>
            <div align="center">
                <MuiThemeProvider theme={theme}>
                    {hidden ?
                        <Button color="primary" variant="outlined" onClick={handleClickOpen}>Login</Button> :
                        undefined
                    }
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Account</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            By attempting to login you are agreeing that you are a member of thehug8 dev-admin group.
                        </DialogContentText>
                        <TextField onChange={handleChange}
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                        />
                        <TextField onChange={handleChange}
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                        />
                        <TextField onChange={handleChange}
                            margin="dense"
                            id="api_key"
                            label="API Key"
                            type="password"
                            fullWidth
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleLogin} color="primary">
                            Login
                        </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
            </div>
            { !hidden ?
                <div>
                    <div align="center">
                        <FormControl className={classes.textBox} variant="filled">
                            <TextField
                                id="home_text"
                                label="Home Text"
                                variant="outlined"
                                defaultValue={homeText}
                                multiline
                                rows={1}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </div>
                    <div align="right" max-widtht="10%">
                        <Button className={classes.submit} color="primary" variant="outlined" id="home_submit" onClick={handleClickSubmit}>Submit</Button> :
                    </div> 
                </div>:
                undefined
            }
        </div>
    );
}

export default Admin;