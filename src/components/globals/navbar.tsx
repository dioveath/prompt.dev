import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { gql, useQuery } from '@apollo/client';
import { Link, Skeleton } from '@mui/material';

const pages = [
  { label: 'Home', href: '/'},
  { label: 'Tools', href: '/tools' },
  { label: 'Community', href: '/posts' },
  { label: 'Submit Tool', href: '/tools/create' },
];

const settings = [
  { 
    label: 'Profile', 
    href: '/profile'
  }, 
  {
    label: 'Account',
    href: '/account'
  },
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Logout',
    href: '/api/auth/logout'
  }
];
  

const meQuery = gql`
  query {
    me {
      email
      name
      avatar
      jobTitle
      email
      createdAt
      avatar
      posts {
        id
        title
        votesCount
      }
    }
  }
`;


interface NavbarProps {
  path: string;
}

function ResponsiveAppBar({ path }: NavbarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { data, loading, error } = useQuery(meQuery);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color='transparent' className='shadow-none lg:px-10'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '-0.05rem',
              color: 'inherit',
              textDecoration: 'none',
              paddingRight: '4rem',
            }}
          >
            prompters.dev
          </Typography>
            

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({ label, href}) => (
                <MenuItem key={label} onClick={handleCloseNavMenu} selected={href === path}>
                  <Link href={href}>
                    <Typography textAlign="center">{label}</Typography>                  
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '-0.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            prompters.dev
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', gap: '3rem'} }}>
            {pages.map(({ label, href }) => (
              <Button
                key={label}
                onClick={handleCloseNavMenu}
                sx={{ my: 2 }}
                href={href}
                variant={href === path ? 'contained' : 'text'}
                className='shadow-none'
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2}}>
            { !loading && !data && <Button variant="contained" color="primary" href="/api/auth/login" className='shadow-none'>Login</Button> }
            { !loading && !data && <Button variant="outlined" color="primary" href="/api/auth/login" className='shadow-none'>Sign Up</Button> }
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                { loading && <Skeleton animation="wave" variant="circular" width={40} height={40} />}
                { data && <Avatar alt={data.me.name + " Avatar"} src={data.me.avatar} /> }
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(({ label, href}) => (
                <MenuItem key={label} onClick={handleCloseUserMenu} href={href}>
                  <Link href={href} className='no-underline'>
                  <Typography textAlign="center">
                    {label}</Typography>                  
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;