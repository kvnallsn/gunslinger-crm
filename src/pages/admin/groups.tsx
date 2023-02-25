import { useGroups, useUsers } from "@/lib/utils/hooks";
import { Box, Button, Checkbox, Chip, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormTextField from "@/lib/components/form-textfield";
import CreateGroupForm, { CreateGroupFormSchema, NewCreateGroupForm } from "@/lib/forms/group";
import Group from "@/lib/models/groups";
import FormAutocomplete from "@/lib/components/form-autocomplete";
import { User } from "@/lib/models";

type ToolbarProps = {
    onClick: () => void;
}

type DialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (group: Group) => void;
}

function DataToolbar({ onClick }: ToolbarProps) {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <Button startIcon={<AddIcon />} size='small' onClick={onClick}>
                Create
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

function CreateGroupDialog({ open, onClose, onCreate }: DialogProps) {
    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm<CreateGroupForm>({
        mode: 'onSubmit',
        defaultValues: NewCreateGroupForm(),
        resolver: yupResolver(CreateGroupFormSchema),
    });

    const members = useFieldArray({ name: "users", control: control });
    const { users } = useUsers();

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

export default function AdminDashboard() {
    const { data: session } = useSession({ required: true });

    const { groups, loading, mutate } = useGroups();
    const columns: GridColumns<Group> = [
        { field: 'id', headerName: 'Id', flex: 2 },
        { field: 'name', headerName: 'Name', flex: 2 },
        {
            field: 'members', headerName: 'Members', flex: 3, renderCell: params => (
                <Box sx={{ display: 'flex', columnGap: '1em', overflowX: 'hidden' }}>
                    {params.row.members.length == 0 ? <Typography>No members</Typography> : params.row.members.map(member => <Chip key={`mbr-${params.row.id}-${member.id}`} label={`${member.username}`} />)}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem icon={<EditIcon />} onClick={() => console.log('edit')} label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={() => { }} label="Delete" showInMenu />
            ],
        }
    ];

    const [open, setOpen] = useState<boolean>(false);
    const handleCreateClick = () => setOpen(true);
    const handleCreateClose = () => setOpen(false);

    const handleCreateGroup = async (group: Group) => {
        await mutate([...groups, group]);
        handleCreateClose();
    };

    return (
        <Box sx={{ height: '100%' }}>
            <CreateGroupDialog open={open} onClose={handleCreateClose} onCreate={handleCreateGroup} />
            <DataGrid
                sx={{ pt: 1 }}
                rows={groups || []}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: DataToolbar,
                }}
                componentsProps={{
                    toolbar: { onClick: handleCreateClick },
                }}
            />
        </Box>
    );
}