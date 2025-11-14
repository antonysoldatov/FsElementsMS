import { Box, Drawer, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';

export interface SiderProps {
    menuOpen: boolean;
    onToggleMenu: () => void;
    isPermanent: boolean;
}

const drawerWidth = 250;

const menuItems = [
    {
        text: 'Home',
        icon: <HomeIcon />,
        path: '/',
    },
    {
        text: 'SignIn as Seller',
        icon: <LoginIcon />,
        path: '/signin',
    },
];

function Sider({ menuOpen, onToggleMenu, isPermanent }: SiderProps) {
    const onDrawerClose = () => {
        if (menuOpen) onToggleMenu();
    };

    const onBoxClick = () => {
        if (menuOpen) onToggleMenu();
    };

    return (
        <Drawer
            open={menuOpen}
            onClose={onDrawerClose}
            variant={isPermanent ? "permanent" : "temporary"}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}>
            <Toolbar />
            <Box role="presentation" onClick={onBoxClick}>
                <List>
                    {menuItems.map((item, index) => (
                        <Link href={item.path} key={item.path} underline="none" color="textPrimary"> 
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}                    
                </List>
            </Box>
        </Drawer>
    );
}

export default Sider;