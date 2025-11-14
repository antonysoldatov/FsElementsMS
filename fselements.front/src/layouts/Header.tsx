import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router';
import { AppBar } from '@mui/material';

export interface HeaderProps {
    logo?: React.ReactNode;
    title?: string;
    menuOpen: boolean;
    onToggleMenu: (open: boolean) => void;
}

export default function Header({
    title,
    menuOpen,
    onToggleMenu,
}: HeaderProps) {
    const theme = useTheme();

    const handleMenuOpen = React.useCallback(() => {
        onToggleMenu(!menuOpen);
    }, [menuOpen, onToggleMenu]);

    const getMenuIcon = React.useCallback(
        (isExpanded: boolean) => {
            const expandMenuActionText = 'Expand';
            const collapseMenuActionText = 'Collapse';

            return (
                <Tooltip
                    title={`${isExpanded ? collapseMenuActionText : expandMenuActionText} menu`}
                    enterDelay={1000}
                >
                    <div>
                        <IconButton
                            size="small"
                            aria-label={`${isExpanded ? collapseMenuActionText : expandMenuActionText} navigation menu`}
                            onClick={handleMenuOpen}
                        >
                            {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
                        </IconButton>
                    </div>
                </Tooltip>
            );
        },
        [handleMenuOpen],
    );

    return (
        <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {getMenuIcon(menuOpen)}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
