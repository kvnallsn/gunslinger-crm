import { User } from "@/lib/models";
import { useUsers } from "@/lib/utils/hooks";
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateUserForm, { CreateUserFormSchema, NewCreateUserForm } from "@/lib/forms/user";
import { yupResolver } from "@hookform/resolvers/yup";
import FormTextField from "@/lib/components/form-textfield";
import FormPassword from "@/lib/components/form-password";
import FormCheckbox from "@/lib/components/form-checkbox";
import GridToolbar from '@/lib/components/grid-toolbar';

type DialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (user: User) => void;
}

function CreateUserDialog({ open, onClose, onCreate }: DialogProps) {
    const { handleSubmit, control, setValue, reset } = useForm<CreateUserForm>({
        mode: 'onSubmit',
        defaultValues: NewCreateUserForm(),
        resolver: yupResolver(CreateUserFormSchema),
    });

    const onSubmit: SubmitHandler<CreateUserForm> = async form => {
        fetch('/api/users', {
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
                            <FormPassword control={control} field="password" label="Password" />
                        </Grid>

                        <Grid item xs={12}>
                            <FormCheckbox control={control} field="active" label="Active" />
                        </Grid>

                        <Grid item xs={12}>
                            <FormCheckbox control={control} field="admin" label="Admin" />
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

    const { users, loading, mutate } = useUsers();
    const columns: GridColumns<User> = [
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'username', headerName: 'Username', flex: 2 },
        { field: 'created', headerName: 'Created', type: 'dateTime', flex: 2, valueGetter: r => new Date(r.row.created) },
        { field: 'active', headerName: 'Is Active', flex: 1, renderCell: r => r.row.active ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" /> },
        { field: 'admin', headerName: 'Is Admin', flex: 1, renderCell: r => r.row.admin ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" /> },
    ];

    const [open, setOpen] = useState<boolean>(false);
    const handleCreateClick = () => setOpen(true);
    const handleCreateClose = () => setOpen(false);

    const handleCreateUser = async (user: User) => {
        await mutate([...users, user]);
        handleCreateClose();
    };

    return (
        <Box sx={{ height: '100%' }}>
            <CreateUserDialog open={open} onClose={handleCreateClose} onCreate={handleCreateUser} />
            <DataGrid
                rows={users || []}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: GridToolbar
                }}
                componentsProps={{
                    toolbar: { onCreate: handleCreateClick },
                }}
            />
        </Box>
    );
}