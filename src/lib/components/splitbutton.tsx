import { useRef, useState } from "react";
import Link from 'next/link';
import { Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const options = [
    { display: 'Contact', link: '/contacts/edit' },
    { display: 'Organization', link: '/orgs/edit' },
    { display: 'Location', link: '/locations/edit' },
];

export default function SplitButton() {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <ButtonGroup variant="contained" ref={anchorRef} aria-label="create items button">
                <Link href={options[selectedIndex].link}>
                    <Button>Create {options[selectedIndex].display}</Button>
                </Link>
                <Button
                    size='small'
                    aria-controls={open ? 'create-items-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label='create items'
                    aria-haspopup='menu'
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom'
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="create-items-menu" autoFocusItem>
                                    {options.map((option, idx) => (
                                        <MenuItem
                                            key={`action-${option.display}`}
                                            selected={idx === selectedIndex}
                                            onClick={event => handleMenuItemClick(event, idx)}
                                        >
                                            {option.display}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}