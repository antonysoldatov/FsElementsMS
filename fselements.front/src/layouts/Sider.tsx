import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { useUser } from "../storage/UserContext";
import { Link } from "react-router-dom";

export interface SiderProps {
    menuOpen: boolean;
    onToggleMenu: () => void;
    isPermanent: boolean;
}

interface MenuItem {
    text: string;
    icon: React.ReactElement;
    path: string;
}

const drawerWidth = 250;

const menuItems: MenuItem[] = [
    {
        text: 'Home',
        icon: <HomeIcon />,
        path: '/',
    }
];

const getMenuItemView = (item: MenuItem) => {
    return (
        <Box key={item.path} sx={{
            '& > a': {
                textDecoration: 'none',
                color: 'inherit',
            }
        }}>
            <Link to={item.path}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            </Link>
        </Box>
    );
}

function Sider({ menuOpen, onToggleMenu, isPermanent }: SiderProps) {
    const onDrawerClose = () => {
        if (menuOpen) onToggleMenu();
    };

    const onBoxClick = () => {
        if (menuOpen) onToggleMenu();
    };

    const user = useUser();

    console.log("Sider user:", user);

    const userMenuItems: MenuItem[] = [];
    if (user.isAuthenticated) {
        if (user.role === "Seller") {
            userMenuItems.push({
                text: 'My Elements',
                icon: <AutoAwesomeMotionIcon />,
                path: '/sellerelements',
            });
        }

        userMenuItems.push({
            text: 'SignOut',
            icon: <LogoutIcon />,
            path: '/signout',
        });
    } else {
        userMenuItems.push({
            text: 'SignIn as Seller',
            icon: <LoginIcon />,
            path: '/signin',
        });
    }

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
                    {menuItems.map((item, index) => getMenuItemView(item))}
                    <Divider />
                    {userMenuItems.map((item, index) => getMenuItemView(item))}
                </List>
            </Box>
        </Drawer>
    );
}

export default Sider;