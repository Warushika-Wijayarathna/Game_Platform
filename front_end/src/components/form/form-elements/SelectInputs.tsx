import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import MultiSelect from "../MultiSelect";

export default function SelectInputs() {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);

  const handleSelectChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedOption(selectedOption);
    console.log("Selected option:", selectedOption);
  };

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
    { value: "5", text: "Option 5", selected: false },
  ];

  return (
      <ComponentCard title="Select Inputs">
        <div className="space-y-6">
          <div>
            <Label>Select Input</Label>
            <Select
                options={options}
                value={selectedOption} // Pass the selected object
                placeholder="Select Option"
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
            />
            {selectedOption && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {selectedOption.label} ({selectedOption.value})
                </p>
            )}
          </div>
          <div>
            <MultiSelect
                label="Multiple Select Options"
                options={multiOptions}
                defaultSelected={["1", "3"]}
                onChange={(values) => setSelectedValues(values)}
            />
            <p className="sr-only">
              Selected Values: {selectedValues.join(", ")}
            </p>
          </div>
        </div>
      </ComponentCard>
  );
}
