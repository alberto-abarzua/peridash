import Link from '@/components/layout/Link';
import { logout } from '@/utils/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
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
    Divider,
    Box,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useTheme } from '@mui/material/styles';

import { useState } from 'react';

export default function Navbar() {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const navLinks = [
        {
            title: 'Dashboard',
            path: '/',
            icon: () => {
                return <SpaceDashboardIcon sx={{ color: 'white' }} />;
            },
        },
        {
            title: 'Settings',
            path: '/settings',
            icon: () => {
                return <SettingsIcon sx={{ color: 'white' }} />;
            },
        },
    ];

    const drawer = (
        <div>
            <List>
                {navLinks.map(link => (
                    <Link href={link.path} key={link.title}>
                        <ListItem button>
                            <ListItemIcon>
                                <link.icon />
                            </ListItemIcon>

                            <ListItemText
                                primary={link.title}
                                sx={{ color: 'white' }}
                            />
                        </ListItem>
                    </Link>
                ))}
                <Divider />
                <ListItem button onClick={logout}>
                    <ListItemIcon>
                        <LogoutIcon sx={{ color: 'red' }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: 'white' }} />
                </ListItem>
            </List>
        </div>
    );

    return (
        <div>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    mb: '2rem',
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                    >
                        <StackedLineChartIcon sx={{ fontSize: 40 }} />{' '}
                        <Box m={1} />
                        <Typography variant="h4">Peridash</Typography>
                    </IconButton>
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
