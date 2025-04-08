import {useState, useEffect} from "react";

interface BaseOption {
    value: string;
    label: string;
}

interface SelectProps<T extends BaseOption> {
    options: T[],
    placeholder?: string,
    onChange: (selectedOption: T | null) => void,
    className?: string,
    defaultValue?: T | null,
    value?: T | null,
    required?: boolean,
    id?: string
}

const Select = <T extends BaseOption>({
                                          options,
                                          placeholder = "Select an option",
                                          onChange,
                                          className = "",
                                          defaultValue = null,
                                          value = null,
                                          required = false,
                                          id = "",
                                      }: SelectProps<T>) => {
    const [selectedValue, setSelectedValue] = useState<T | null>(defaultValue);

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedOption = options.find((option) => option.value === selectedValue) || null;
        setSelectedValue(selectedOption);
        onChange(selectedOption);
    };

    return (
        <select
            className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                selectedValue
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400 dark:text-gray-400"
            } ${className}`}
            value={selectedValue ? selectedValue.value : ""}
            onChange={handleChange}
            required={required}
            id={id}
        >
            <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                {placeholder}
            </option>
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                    {option.label}

                </option>
            ))}
        </select>
    );
};

export default Select;
