import { AppBar, Button, Divider, Toolbar } from '@mui/material';
import { GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

interface GridToolbarProps {
    // called when the create button is clicked
    onCreate: () => void;
}

export default function GridToolbar(props: GridToolbarProps) {
    const { onCreate } = props;

    // example to create custom buttons
    //const api = useGridApiContext();
    //api.current.showColumnMenu;

    return (
        <AppBar position='static' color='transparent' elevation={1}>
            <Toolbar>
                <Button
                    size='small'
                    variant='contained'
                    color='primary'
                    startIcon={<AddIcon />}
                    onClick={onCreate}
                >
                    Create
                </Button>
                <Divider
                    orientation='vertical'
                    flexItem
                    sx={{ mx: 3 }}
                />
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <Divider
                    orientation='vertical'
                    flexItem
                    sx={{ mx: 3 }}
                />
                <GridToolbarQuickFilter fullWidth sx={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    )
}