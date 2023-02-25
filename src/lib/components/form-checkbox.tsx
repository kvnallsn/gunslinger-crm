import { Checkbox, FormControlLabel } from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface Props {
    // name of the form field to bind
    field: string;

    // form control
    control: Control<any>;

    // text to display as field label
    label: string;
}

export default function FormCheckbox({ field, control, label }: Props) {
    return (
        <Controller
            name={field}
            control={control}
            render={({ field: { value, ref, onBlur, onChange } }) => (
                <FormControlLabel control={<Checkbox checked={value} ref={ref} onBlur={onBlur} onChange={onChange} />} label={label} />
            )}
        />
    );
}