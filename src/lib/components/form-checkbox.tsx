import { Checkbox, FormControlLabel } from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface Props {
    // name of the form field to bind
    field: string;

    // form control
    control: Control<any>;

    // text to display as field label
    label: string;

    onChange: (checked: boolean) => void;
}

export default function FormCheckbox({ field, control, label, onChange }: Props) {
    return (
        <Controller
            name={field}
            control={control}
            render={({ field: { value } }) => (
                <FormControlLabel control={<Checkbox checked={value} onChange={e => onChange(e.target.checked)} />} label={label} />
            )}
        />
    );
}