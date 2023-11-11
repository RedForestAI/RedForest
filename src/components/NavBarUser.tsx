import * as React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

export default function AppBarUser() {
    const [auth, setAuth] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleLogin = () => {
        console.log("handleLogin")
    }


    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    };


    const handleAccount = () => {
        console.log("handleAccount")
    }

    return (
            <div>
              {auth
                  ? <div>
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                      >
                        <MenuItem onClick={handleAccount}>My account</MenuItem>
                      </Menu>
                  </div>
                : <div>
                    <Button
                      key="login"
                      onClick={handleLogin}
                      color="inherit"
                    > Login
                    </Button>
                  </div>
                }
            </div>
    );
}
