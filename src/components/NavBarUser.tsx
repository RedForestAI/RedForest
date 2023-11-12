import * as React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function AppBarUser() {
    const authStore = useAuthStore();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleAccount = () => {
        console.log("handleAccount")
    }

    return (
            <div>
              {authStore.accessToken
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
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleAccount}>My account</MenuItem>
                        <MenuItem onClick={handleAccount}>Logout</MenuItem>
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
