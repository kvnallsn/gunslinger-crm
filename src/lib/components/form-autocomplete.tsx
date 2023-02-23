import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, AutocompleteRenderOptionState, Checkbox, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { HTMLAttributes } from "react";

interface Props {
    // name of the form field to bind
    field: string;

    // form control
    control: Control<any>;

    // Human-friendly label
    label: string;

    multiple?: boolean,

    // Options
    options: any[];

    // What to display in the textfield
    getOptionLabel?: (e: any) => string;
    getListItemLabel?: (e: any) => string;

    isOptionEqualToValue?: (option: any, value: any) => boolean;

    // Triggered when a change/selection has been made, if the value needs to be modified before
    // being stored in the value attribute
    onChanged?: (value: any) => any;
}

function AutocompleteOption(props: HTMLAttributes<HTMLLIElement>, text: string, state: AutocompleteRenderOptionState) {
    return (
        <li {...props}>
            <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={state.selected}
            />
            {text}
        </li>
    );
}

function log(v) {
    console.log(v);
    return true;
}

export default function FormAutocomplete({ field, control, label, multiple, options, getOptionLabel, isOptionEqualToValue, onChanged }: Props) {
    const optionText = getOptionLabel ?? ((e) => e);
    const isEqual = isOptionEqualToValue ?? ((o, v) => o === v);
    const handleChanged = onChanged ?? ((e: any) => e);

    return (
        <Controller
            name={field}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                    onChange={(_e, v) => {
                        onChange(handleChanged(v));
                    }}
                    value={value}
                    multiple={multiple || false}
                    disablePortal
                    disableCloseOnSelect={multiple || false}
                    options={options}
                    isOptionEqualToValue={isEqual}
                    getOptionLabel={optionText}
                    renderOption={(multiple ? (props, option, state) => AutocompleteOption(props, optionText(option), state) : undefined)}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={label}
                            error={Boolean(error)}
                            helperText={error && error.message}
                        />
                    )}
                />
            )}
        />
    );
}