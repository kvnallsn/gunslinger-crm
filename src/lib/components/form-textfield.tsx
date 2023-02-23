import { TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface Props {
    // name of the form field to bind
    field: string;

    // form control
    control: Control<any>;

    // text to display as field label
    label: string;

    // type of textfield (text, password, etc.)
    // default is text
    type?: string;

    // set to greater than 1 if multiline is needed
    rows?: number;
}

export default function FormTextField({ field, control, label, type, rows }: Props) {
    return (
        <Controller
            name={field}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    fullWidth
                    multiline={rows && rows > 1 ? true : false}
                    rows={rows}
                    label={label}
                    error={Boolean(error)}
                    helperText={error && error.message}
                    type={type || 'text'}
                    {...field}
                />
            )}
        />
    );
}