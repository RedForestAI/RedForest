import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NavBarUser from './NavBarUser';

export default function MenuAppBar() {

  return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SandCastleReader
          </Typography>
          <NavBarUser />
        </Toolbar>
      </AppBar>
  );
}
