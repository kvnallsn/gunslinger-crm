import { Button, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ButtonLink {
    // link to navigate to
    href: string;

    // Text to display
    display: string;
}

interface Props {
    // text to display on button
    label: string;

    // optional menu id (for screen readers)
    menuId?: string;

    // menu options to display in dropdown
    options: ButtonLink[];
}

export default function DropdownMenu({ label, menuId, options }: Props) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const id = menuId || 'menu';

    const handleItemClick = async (href: string) => {
        handleClose();
        await router.push(href);
    };

    return (
        <>
            <Button
                id={`${id}-button`}
                aria-controls={open ? 'id' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                {label}
            </Button>
            <Menu
                id={id}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': `${id}-button`
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                {options.map(o => <MenuItem key={`am-${o.href}`} onClick={() => handleItemClick(o.href)}>{o.display}</MenuItem>)}
            </Menu>
        </>
    )
}