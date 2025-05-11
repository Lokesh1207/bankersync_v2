import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { LightMode, DarkMode } from "@mui/icons-material";
// import { useColorMode } from "../ThemeContext";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ManageAccounts as ManageAccountsIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MyFooter from "./MyFooter";

const drawerWidth = 240;

// Styled Link
const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#d32f2f",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? drawerWidth : 0, // Change this line to make the drawer fully close
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : 0, // Apply the same width change to the drawer paper
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function SideNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(!isMobile);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <Box
      sx={{ display: "flex", fontFamily: "Poppins, sans-serif" }}
      key={theme.palette.mode}
    >
      {" "}
      {/* Key added */}
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ marginRight: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={StyledLink}
            to="/home"
            sx={{ flexGrow: 1, color: "white", fontWeight: 600 }}
          >
            Banker Sync
          </Typography>

          {/* <IconButton color="inherit" onClick={toggleColorMode}>
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton> */}

          <IconButton color="inherit" onClick={handleProfileClick} size="large">
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseProfileMenu}
          >
            <MenuItem onClick={handleCloseProfileMenu}>
              <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{ display: isMobile ? "none" : "block" }}
      >
        <DrawerHeader />
        <Divider />
        <List>
          <ListItem button component={StyledLink} to="/client">
            <ListItemIcon>
              <PersonIcon sx={{ color: "#d32f2f" }} />
            </ListItemIcon>
            <Tooltip title="Client" placement="right">
              <ListItemText
                primary="Add Client"
                sx={{ visibility: open ? "visible" : "hidden" }}
              />
            </Tooltip>
          </ListItem>

          <ListItem button component={StyledLink} to="/clients/manage">
            <ListItemIcon>
              <ManageAccountsIcon sx={{ color: "#d32f2f" }} />
            </ListItemIcon>
            <Tooltip title="Manage Clients" placement="right">
              <ListItemText
                primary="Manage Clients"
                sx={{ visibility: open ? "visible" : "hidden" }}
              />
            </Tooltip>
          </ListItem>

          <ListItem button component={StyledLink} to="/loan">
            <ListItemIcon>
              <AttachMoneyIcon sx={{ color: "#d32f2f" }} />
            </ListItemIcon>
            <Tooltip title="Loan" placement="right">
              <ListItemText
                primary="Add Loan"
                sx={{ visibility: open ? "visible" : "hidden" }}
              />
            </Tooltip>
          </ListItem>

          <ListItem button component={StyledLink} to="/loans/manage">
            <ListItemIcon>
              <CreditCardIcon sx={{ color: "#d32f2f" }} />
            </ListItemIcon>
            <Tooltip title="Manage Loans" placement="right">
              <ListItemText
                primary="Manage Loans"
                sx={{ visibility: open ? "visible" : "hidden" }}
              />
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>
      {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet context={{ open }} /> 
      </Box> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <DrawerHeader />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet context={{ open }} /> {/* 👈 Page content */}
        </Box>
        <MyFooter /> {/* 👈 Always shown at bottom */}
      </Box>
    </Box>
  );
}
