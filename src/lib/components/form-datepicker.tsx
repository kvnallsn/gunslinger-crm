import { DatePicker } from "@mui/x-date-pickers";
import { Control, Controller } from "react-hook-form";

interface Props {
    // name of the form field to bind
    field: string;

    // form control
    control: Control<any>;

    // Human-friendly label
    label: string;
}

export default function FormDatepicker({ field, control, label }: Props) {
    return (
        <Controller
            name={field}
            control={control}
            render={({ field }) => (
                <DatePicker
                    {...field}
                    label={label}
                    slotProps={{
                        textField: { fullWidth: true }
                    }}
                />
            )}
        />
    );
}