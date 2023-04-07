import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { gql, useQuery } from "@apollo/client";
import { Link, Skeleton, useTheme } from "@mui/material";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { GoSignIn } from "react-icons/go";
import { ColorModeContext } from "@/pages/_app";
import { useUser } from "@auth0/nextjs-auth0/client";

const pages = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Community", href: "/posts" },
  { label: "Submit Tool", href: "/tools/create" },
];

const settings = [
  {
    label: "Profile",
    href: "/profile",
  },
  {
    label: "Logout",
    href: "/api/auth/logout",
  },
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
  const [anchorAuthMenu, setAnchorAuthMenu] = React.useState<null | HTMLElement>(null);

  const { user } = useUser();
  const { data, loading, error } = useQuery(meQuery, { skip: !user });
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { toggleColorMode } = React.useContext(ColorModeContext);

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

  const handleOpenAuthMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAuthMenu(event.currentTarget);
  };

  const handleCloseAuthMenu = () => {
    setAnchorAuthMenu(null);
  };

  return (
    <AppBar position="static" color="transparent" className="shadow-none lg:px-10">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 6,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: "-0.05rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            prompters.dev
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ label, href }) => (
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
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: "700",
              letterSpacing: "-0.05rem",
              color: "inherit",
              textDecoration: "none",
            }}
            className="text-base md:text-md lg:text-lg"
          >
            prompters.dev
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex", gap: "3rem" } }}>
            {pages.map(({ label, href }) => (
              <Button key={label} onClick={handleCloseNavMenu} sx={{ my: 2 }} href={href} variant={href === path ? "contained" : "text"} className="shadow-none">
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {!loading && !data && (
              <Button variant="contained" color="primary" href="/api/auth/login" className="shadow-none">
                Login
              </Button>
            )}
            {!loading && !data && (
              <Button variant="outlined" color="primary" href="/api/auth/login" className="shadow-none">
                Sign Up
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0, display: { md: "none" } }}>
            <Tooltip title="Credentials">
              <IconButton onClick={handleOpenAuthMenu} sx={{ p: 0 }}> <GoSignIn/> </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorAuthMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorAuthMenu)}
              onClose={handleCloseAuthMenu}
            >
              <MenuItem onClick={handleCloseAuthMenu} href={"auth/login"}> 
                {/* <Link> */}
                <Typography>Login</Typography>               
              {/* </Link> */}
              </MenuItem>
              <MenuItem onClick={handleCloseAuthMenu} href={"auth/login"}>
              {/* <Link> */}
                <Typography>Sign Up</Typography>               
              {/* </Link>                 */}
              </MenuItem>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* <IconButton onClick={toggleColorMode} sx={{marginRight: "20px"}}> 
            { isDark ? <MdLightMode /> : <MdDarkMode />}
            </IconButton> */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {loading && <Skeleton animation="wave" variant="circular" width={40} height={40} />}
                {data && <Avatar alt={data.me.name + " Avatar"} src={data.me.avatar} />}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(({ label, href }) => (
                <Link key={label} href={href} sx={{ textDecoration: "none" }}>
                  <MenuItem onClick={handleCloseUserMenu} href={href}>
                    <Typography textAlign="center">{label}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
