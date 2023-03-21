import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Divider, Drawer, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColumns, GridRowParams, MuiEvent } from "@mui/x-data-grid";
import FormTextField from "@/lib/components/form-textfield";
import FlexColumnBox from '@/lib/components/box-flexcolumn';
import FlexBox from '@/lib/components/box-flexrow';
import FormAutocomplete from "@/lib/components/form-autocomplete";
import GridToolbar from '@/lib/components/grid-toolbar';
import { Virtuoso } from 'react-virtuoso';
import useColor from '@/lib/utils/color';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from "@mui/icons-material/Delete";

import { User } from "@/lib/models";
import Group, { GroupMember } from "@/lib/models/groups";
import CreateGroupForm, { CreateGroupFormSchema, NewCreateGroupForm } from "@/lib/forms/group";
import { useGroups, useUsers } from "@/lib/utils/hooks";
import AddGroupMemberForm, { AddGroupMemberFormSchema, NewAddGroupMemberForm } from '@/lib/forms/group-addmember';
import FormHidden from '@/lib/components/form-hidden';

type DialogProps = {
    users: User[];
    open: boolean;
    onClose: () => void;
    onCreate: (group: Group) => void;
}

function CreateGroupDialog({ users, open, onClose, onCreate }: DialogProps) {
    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm<CreateGroupForm>({
        mode: 'onSubmit',
        defaultValues: NewCreateGroupForm(),
        resolver: yupResolver(CreateGroupFormSchema),
    });

    const members = useFieldArray({ name: "users", control: control });

    const onSubmit: SubmitHandler<CreateGroupForm> = async form => {
        fetch('/api/groups', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(form),
        })
            .then(r => r.json())
            .then(r => {
                reset();
                onCreate(r.data);
            })
            .catch(e => console.error(e));
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Create Group</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container rowGap="1em" sx={{ my: 2 }}>
                        <Grid item xs={12}>
                            <FormTextField control={control} field="name" label="Group Name" />
                        </Grid>

                        <Grid item xs={12}>
                            <FormAutocomplete
                                clearOnSelect
                                options={users}
                                label="Add Members"
                                onChange={(u: User | null) => u && members.append({ id: u.id, username: u.username, level: 'read' })}
                                getOptionLabel={(u: User) => `${u.username} (${u.email})`}
                                error={errors['users']}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <List>
                                {members.fields.map(({ id, username, level }, index) =>
                                    <ListItem key={`add-user-${id}`} secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => members.remove(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }>
                                        <ListItemText>
                                            {username}
                                        </ListItemText>
                                        <FormControl sx={{ flexGrow: 1 }}>
                                            <InputLabel id="member-permission">Permissions</InputLabel>
                                            <Controller
                                                name={`users.${index}.level`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        labelId="member-permission"
                                                        id="permission"
                                                        label="Permissions"
                                                    >
                                                        <MenuItem value={'read'}>Read</MenuItem>
                                                        <MenuItem value={'edit'}>Edit</MenuItem>
                                                        <MenuItem value={'owner'}>Owner</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    </ListItem>)}
                            </List>
                        </Grid>

                        <Grid item xs={12}>
                            <Button type='submit' variant="contained" fullWidth>Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface GroupDrawerProps {
    users: User[];
    group: Group;
    onAddUser: (groupId: string, member: GroupMember) => void;
    onDelUser: (groupId: string, member: GroupMember) => void;
}

function GroupDrawer(props: GroupDrawerProps) {
    const { users, group, onAddUser, onDelUser } = props;

    const { handleSubmit, control, setValue, reset, resetField } = useForm<AddGroupMemberForm>({
        mode: 'onSubmit',
        defaultValues: {
            userId: '',
            username: '',
            level: 'owner'
        },
        resolver: yupResolver(AddGroupMemberFormSchema)
    })

    const userIds = group.members.map(u => u.id);
    const availableUsers = users.filter((user: User) => !userIds.includes(user.id));
    const [members, setMembers] = useState<GroupMember[]>(group.members);

    useEffect(() => {
        setMembers(group.members);
    }, [group.members])

    const onSubmit: SubmitHandler<AddGroupMemberForm> = async data => {
        const resp = await fetch(`/api/group/member?groupid=${group.id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (resp.ok) {
            const mbr = {
                id: data.userId,
                username: data.username,
                level: data.level
            };

            reset();

            setMembers([...members, mbr]);
            onAddUser(group.id, mbr);
        }
    };

    const onError = (e: any) => console.error(e);

    const onDelete = async (userId: string) => {
        const resp = await fetch(`/api/group/member?groupid=${group.id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId
            })
        });

        if (resp.ok) {
            const idx = members.findIndex(m => m.id === userId);
            if (idx > -1) {
                const mbr = members.splice(idx, 1);
                console.log(mbr);
                setMembers([...members]);
                onDelUser(group.id, mbr[0]);
            }
        }
    }

    return (
        <FlexColumnBox sx={{ minWidth: '400px', height: '100%' }}>
            <FlexColumnBox sx={{ rowGap: 1, p: 1, bgcolor: useColor(200, 700), borderBottom: `1px solid ${useColor(400, 800)}` }}>
                <FlexBox sx={{ alignItems: 'center', columnGap: 2 }}>
                    <Typography variant='h5'>{group.name}</Typography>
                </FlexBox>
                <FlexBox sx={{ flexWrap: 'wrap', columnGap: 2, rowGap: 1 }}>
                    <PersonIcon color="inherit" />
                    <Typography>{group.members.length} Members</Typography>
                </FlexBox>
            </FlexColumnBox>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <FlexBox sx={{ px: 1, py: 2, columnGap: 1, alignItems: 'center' }}>
                    <FormAutocomplete
                        size='small'
                        options={availableUsers}
                        label="Add Members"
                        getOptionLabel={(u: User) => `${u.username} (${u.email})`}
                        onChange={(u: User | null) => {
                            if (u) {
                                setValue('userId', u.id);
                                setValue('username', u.username);
                            } else {
                                resetField('userId');
                                resetField('username');
                            }
                        }}
                    />
                    <FormHidden field='level' control={control} />
                    <Button type='submit' variant='outlined' startIcon={<AddIcon />}>Add</Button>
                </FlexBox>
            </form>
            <Divider />
            <Box sx={{ flexGrow: 1 }}>
                <Virtuoso
                    data={members}
                    itemContent={(index, user) => (
                        <React.Fragment>
                            <ListItem
                                secondaryAction={
                                    <IconButton edge='end' aria-label='delete' onClick={() => onDelete(user.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                }>
                                <ListItemText secondary={user.level}>{user.username}</ListItemText>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    )}
                />
            </Box>
        </FlexColumnBox>
    )
}

export default function AdminDashboard() {
    const { data: session } = useSession({ required: true });

    const { groups, loading, mutate } = useGroups();
    const { users } = useUsers();

    const columns: GridColumns<Group> = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'members', headerName: 'Members', flex: 3, renderCell: params => (
                <Box sx={{ display: 'flex', columnGap: '1em', overflowX: 'hidden' }}>
                    {params.row.members.length == 0 ? <Typography>No members</Typography> : params.row.members.map(member => <Chip key={`mbr-${params.row.id}-${member.id}`} label={`${member.username}`} />)}
                </Box>
            )
        }
    ];

    const [open, setOpen] = useState<boolean>(false);
    const [group, setGroup] = useState<Group | undefined>(undefined);

    const handleCreateClick = () => setOpen(true);
    const handleCreateClose = () => setOpen(false);

    const handleCreateGroup = async (group: Group) => {
        await mutate([...groups, group]);
        handleCreateClose();
    };

    const toggleDrawer = (group?: Group) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setGroup(group);
    };

    const handleClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
        // open the drawer
        toggleDrawer(params.row)(event);
    }

    const onAddUser = (groupId: string, member: GroupMember) => {
        const idx = groups.findIndex(g => g.id === groupId);
        if (idx > -1) {
            groups[idx].members.push(member);
        }
    };

    const onDelUser = (groupId: string, member: GroupMember) => {
        const idx = groups.findIndex(g => g.id === groupId);
        if (idx > -1) {
            const mbrIdx = groups[idx].members.findIndex(m => m.id === member.id);
            groups[idx].members.splice(mbrIdx, 1);
        }
    };

    return (
        <Box sx={{ height: '100%' }}>
            <CreateGroupDialog
                users={users}
                open={open}
                onClose={handleCreateClose}
                onCreate={handleCreateGroup}
            />
            <DataGrid
                rows={groups || []}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: GridToolbar
                }}
                componentsProps={{
                    toolbar: { onCreate: handleCreateClick },
                }}
                onRowClick={handleClick}
            />
            <Drawer
                anchor='right'
                open={group !== undefined}
                onClose={toggleDrawer()}
            >
                {group && <GroupDrawer group={group} users={users} onAddUser={onAddUser} onDelUser={onDelUser} />}
                <Box sx={{ position: 'absolute ', top: '0px', right: '0px' }}>
                    <IconButton sx={{ m: 2 }} onClick={toggleDrawer(undefined)}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>
            </Drawer>
        </Box>
    );
}