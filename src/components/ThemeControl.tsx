import * as Menu from "@radix-ui/react-dropdown-menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const modes = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export default function ThemeControl() {
  const { theme = "system", setTheme } = useTheme();
  const Icon = modes.find((mode) => mode.value === theme)?.icon ?? Monitor;
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger asChild>
        <button
          className="theme-toggle"
          type="button"
          aria-label="Choose color theme"
        >
          <Icon size={19} aria-hidden="true" />
        </button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          className="theme-menu"
          align="end"
          sideOffset={12}
          aria-label="Color theme"
        >
          <Menu.RadioGroup value={theme} onValueChange={setTheme}>
            {modes.map(({ value, label, icon: ModeIcon }) => (
              <Menu.RadioItem
                key={value}
                value={value}
                className="theme-option"
              >
                <ModeIcon size={17} aria-hidden="true" />
                {label}
                <Menu.ItemIndicator className="theme-check">
                  <Check size={16} aria-hidden="true" />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
