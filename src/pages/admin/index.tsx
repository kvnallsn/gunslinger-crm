import { User } from "@/lib/models";
import { useUsers } from "@/lib/utils/hooks";
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import { DataGrid, GridColumns, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CreateUserForm, { CreateUserFormSchema, NewCreateUserForm } from "@/lib/forms/user";
import { yupResolver } from "@hookform/resolvers/yup";
import FormTextField from "@/lib/components/form-textfield";

type ToolbarProps = {
    onClick: () => void;
}

type DialogProps = {
    open: boolean;
    onClose: () => void;
}

function DataToolbar({ onClick }: ToolbarProps) {
    return (
        <GridToolbarContainer>
            <GridToolbarQuickFilter />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <Button startIcon={<AddIcon />} size='small' onClick={onClick}>
                Create
            </Button>
        </GridToolbarContainer>
    );
}

function CreateUserDialog({ open, onClose }: DialogProps) {
    const { handleSubmit, control, watch, setValue, reset, resetField, formState: { errors } } = useForm<CreateUserForm>({
        mode: 'onSubmit',
        defaultValues: NewCreateUserForm(),
        resolver: yupResolver(CreateUserFormSchema),
    });

    const onSubmit: SubmitHandler<CreateUserForm> = async form => {
        console.log(form);

        const r = await fetch('/api/users', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(form),
        })

        console.debug(r);
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Create User</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container rowGap="1em" sx={{ my: 2 }}>
                        <Grid item xs={12}>
                            <FormTextField control={control} field="email" label="Email Addres" type="email" />
                        </Grid>

                        <Grid item xs={12}>
                            <FormTextField control={control} field="username" label="Username" />
                        </Grid>

                        <Grid item xs={12}>
                            <FormTextField control={control} field="password" label="Password" type="password" />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="active"
                                control={control}
                                render={({ field: { value } }) => (
                                    <FormControlLabel control={<Checkbox checked={value} onChange={e => setValue('active', e.target.checked)} />} label="Active" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="admin"
                                control={control}
                                render={({ field: { value } }) => (
                                    <FormControlLabel control={<Checkbox checked={value} onChange={e => setValue('admin', e.target.checked)} />} label="Admin" />
                                )}
                            />
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
    const router = useRouter();

    const { users, loading } = useUsers();
    const columns: GridColumns<User> = [
        { field: 'id', headerName: 'Id', flex: 2 },
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'username', headerName: 'Username', flex: 2 },
        { field: 'created', headerName: 'Created', type: 'dateTime', flex: 2, valueGetter: r => new Date(r.row.created) },
        { field: 'active', headerName: 'Is Active', flex: 1, renderCell: r => r.row.active ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" /> },
        { field: 'admin', headerName: 'Is Admin', flex: 1, renderCell: r => r.row.active ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" /> },
    ];

    const [open, setOpen] = useState<boolean>(false);
    const handleCreateClick = () => setOpen(true);

    return (
        <Box sx={{ height: '100%' }}>
            <CreateUserDialog open={open} onClose={() => setOpen(false)} />
            <DataGrid
                rows={users || []}
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