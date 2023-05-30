import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Link from '@/components/layout/Link';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ListItemIcon from '@mui/material/ListItemIcon';
import LoginIcon from '@mui/icons-material/Login';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
export default function Navbar() {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const navLinks = [
        { title: 'Dashboard', path: '/' ,icon : () => {return <SpaceDashboardIcon sx = {{color: "white"}}/> } },
        { title: 'Login', path: '/login',icon : () => {return <LoginIcon sx= {{color: "white"}} />} },
        { title: 'Settings', path: '/settings',icon : () => {return <SettingsIcon sx= {{color: "white"}}/>} },
    ];

    const drawer = (
        <div>
            <List>
                {navLinks.map((link, index) => (
                    <Link
                        href={link.path}
                        key={link.title}
                    >
                        <ListItem button>

                            <ListItemIcon>
                                <link.icon />
                            </ListItemIcon>

                            <ListItemText primary={link.title}  sx = {{color: "white"}}/>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </div>
    );

    return (
        <div>
            <AppBar position="static" sx= {{backgroundColor: "transparent", boxShadow: "none"}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                    >
                        <StackedLineChartIcon />
                    </IconButton>
                    <Typography variant="h6">Peridash</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                <Box
                    sx={{
                        backgroundColor: theme.palette.secondary.main,
                        width: '180px',
                        height: '100%',
                    }}
                >
                    {drawer}
                </Box>
            </Drawer>
        </div>
    );
}
