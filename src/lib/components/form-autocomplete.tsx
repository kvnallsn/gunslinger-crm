import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, AutocompleteRenderOptionState, Checkbox, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { HTMLAttributes, useState } from "react";

interface Props {
    // Human-friendly label
    label: string;

    onChange: (value: any) => void;

    error?: any,

    multiple?: boolean,

    disabled?: boolean,

    // Options
    options: any[];

    size?: "small" | "medium" | undefined;

    clearOnSelect?: boolean,

    // What to display in the textfield
    getOptionLabel?: (e: any) => string;
    getListItemLabel?: (e: any) => string;
    isOptionEqualToValue?: (option: any, value: any) => boolean;
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

export default function FormAutocomplete({ label, multiple, options, getOptionLabel, isOptionEqualToValue, onChange, error, size, disabled, clearOnSelect }: Props) {
    const optionText = getOptionLabel ?? ((e) => e);
    const isEqual = isOptionEqualToValue ?? ((o, v) => o === v);

    const [value, setValue] = useState<any | undefined>(multiple ? [] : (clearOnSelect ? undefined : options[0]));
    const [inputValue, setInputValue] = useState<string>('');

    return (
        <Autocomplete
            fullWidth
            size={size ?? 'medium'}
            disabled={disabled}
            onChange={(_e, v) => {
                onChange(v);
                if (clearOnSelect) {
                    setInputValue('');
                    setValue(null);
                } else {
                    setValue(v);
                }
            }}
            value={value}
            multiple={multiple || false}
            disablePortal
            disableCloseOnSelect={multiple || false}
            options={options}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            isOptionEqualToValue={isEqual}
            getOptionLabel={optionText}
            renderOption={(multiple ? (props, option, state) => AutocompleteOption(props, optionText(option), state) : undefined)}
            renderInput={params => (
                <TextField
                    {...params}
                    label={label}
                    error={Boolean(error)}
                />
            )}
        />
    );
}