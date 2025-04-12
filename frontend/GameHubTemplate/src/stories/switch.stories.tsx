// [build] library: 'shadcn'
import { Label } from "../components/ui/label.tsx";
import { Switch } from "../components/ui/switch.tsx";

const meta = {
  title: "ui/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

export const Base = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
  args: {},
};
