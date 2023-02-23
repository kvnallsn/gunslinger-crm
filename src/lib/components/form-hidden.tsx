import { Control, Controller } from "react-hook-form";

interface Props {
    // name of the form field to bind
    field: string;

    // form control
    control: Control<any>;
}

export default function FormHidden({ field, control }: Props) {
    return (
        <Controller
            name={field}
            control={control}
            render={({ field: { value } }) => (
                <input type='hidden' value={value} />
            )}
        />
    );
}