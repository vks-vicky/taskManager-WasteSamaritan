import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    Button,
  } from "@mui/material";
  import { useTheme } from "@mui/material/styles";
  import MenuIcon from "@mui/icons-material/Menu";
  import { useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  
  const drawerWidth = 240;
  
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Analytics", path: "/analytics" },
    { label: "Manage Tags & Categories", path: "/manage" },
  ];
  
  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          Task Manager
        </Typography>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
  
        {/* AppBar */}
        <AppBar component="nav" position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left: Menu + Title */}
            <Box display="flex" alignItems="center" gap={2}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" component="div">
                Task Manager
              </Typography>
            </Box>
  
            {/* Right: Add Task Button (shown only on Dashboard) */}
            {location.pathname === "/" && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  const event = new CustomEvent("openTaskForm");
                  window.dispatchEvent(event);
                }}
                size="large"
              >
                + Add Task
              </Button>
            )}
          </Toolbar>
        </AppBar>
  
        {/* Drawer for mobile */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "block" },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
  
        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar /> {/* Push content below AppBar */}
          {children}
        </Box>
      </Box>
    );
  };
  
  export default Layout;
  