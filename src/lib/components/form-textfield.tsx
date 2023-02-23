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
}

export default function FormTextField({ field, control, label, type }: Props) {
    return (
        <Controller
            name={field}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    fullWidth
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