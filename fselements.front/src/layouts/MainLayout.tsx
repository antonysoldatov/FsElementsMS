import { Box, Button, Stack, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sider";

function MainLayout() {
    const theme = useTheme();

    const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));
    const [isSiderOpened, setIsSiderOpened] = React.useState(isOverMdViewport);

    const handleToggleHeaderMenu = () => {
        if (!isOverMdViewport) {
            setIsSiderOpened(!isSiderOpened);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100%',
                width: '100%',
            }}
        >
            <Header
                menuOpen={isSiderOpened && !isOverMdViewport}
                onToggleMenu={handleToggleHeaderMenu}
            />
            <Sidebar
                menuOpen={isSiderOpened}
                onToggleMenu={handleToggleHeaderMenu}
                isPermanent={isOverMdViewport}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 0,
                    p: 3
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default MainLayout;