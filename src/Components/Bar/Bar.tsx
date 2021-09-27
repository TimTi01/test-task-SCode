import React, {FC, useEffect, useState} from 'react';
import {alpha, styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from "@mui/material/Box";
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Button, ButtonGroup, Divider, Link, Popover, Typography} from '@mui/material';
import {TEvents} from "../../Types/Types";
import axios from "axios";
import {makeStyles, Theme, createStyles} from "@material-ui/core";

const useStyle = makeStyles((theme:Theme) => createStyles({
    box: {
        maxHeight: theme.spacing(21),
        'overflow-y': 'hidden',
        '& p': {
            maxWidth: theme.spacing(40),
            padding: '5px 10px'
        },
    },
    box_link: {
        padding: '5px 10px',
    }
}))

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function getNumEvents(events:TEvents[]):number {
    let activeEventNum = 0
    for (const event of events) {
        if (event.active) {
            activeEventNum++
        }
    }
    return activeEventNum
}

function delEvents(events:TEvents[], setEvents:any):void {
    events.splice(0, events.length)
    setEvents(events)
}

function activateEvents(events:TEvents[], setEvents:any):void {
    for (const event of events) {
        if (event.active) {
            event.active = false
        }
    }
    setEvents(events)
}

function getNewData(dataArr:TEvents[], events:TEvents[], setEvents:any) {
    for (const item of dataArr) {
        item.active = true
        events.push(item)
    }
    return setEvents(events)
}

export const Bar:FC = () => {
    const classes = useStyle()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [events, setEvents] = useState<TEvents[]>([])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);

    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts?_limit=6')
            .then(response => getNewData(response.data, events, setEvents))
    }, [events])

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Поиск…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <ButtonGroup>
                        <Button variant="contained" onClick={() => delEvents(events, setEvents)}>
                            Удалить
                        </Button>
                        <Button variant="contained" onClick={() => activateEvents(events, setEvents)}>
                            Прочитать
                        </Button>
                    </ButtonGroup>
                    <Box sx={{flexGrow: 1}}/>
                    <IconButton
                        size="large"
                        aria-label="show 5 new notifications"
                        color="inherit"
                        onClick={handleClick}
                    >
                        <Badge badgeContent={getNumEvents(events)} color="error">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box className={classes.box}>
                            {events.map((event: TEvents) => {
                                return (
                                    <Typography noWrap key={event.id}>
                                        {event.id}.
                                        {event.title}
                                        {event.active}
                                    </Typography>
                                )
                            })}
                        </Box>
                        <Divider/>
                        <Box className={classes.box_link}>
                            <Link
                                component="button"
                                variant="body2"
                                color="inherit"
                                underline="hover"
                                onClick={() => {}}
                            >
                                Посмотреть все..
                            </Link>
                        </Box>
                    </Popover>
                </Toolbar>
            </AppBar>
        </Box>
    );
}