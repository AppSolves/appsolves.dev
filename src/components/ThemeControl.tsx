import * as Menu from "@radix-ui/react-dropdown-menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

const modes = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

type ThemeControlProps = {
  theme: string;
  chooseTheme: (value: string, control: HTMLElement) => void;
  mobile?: boolean;
};

export default function ThemeControl({
  theme,
  chooseTheme,
  mobile = false,
}: ThemeControlProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const Icon = modes.find((mode) => mode.value === theme)?.icon ?? Monitor;
  if (mobile)
    return (
      <fieldset className="mobile-theme">
        <legend>Appearance</legend>
        <div className="mobile-theme-options">
          {modes.map(({ value, label, icon: ModeIcon }) => (
            <label key={value}>
              <input
                type="radio"
                name="appearance"
                value={value}
                checked={theme === value}
                onChange={(event) =>
                  chooseTheme(value, event.currentTarget.parentElement!)
                }
              />
              <ModeIcon size={17} aria-hidden="true" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  return (
    <Menu.Root modal={false} open={open} onOpenChange={setOpen}>
      <Menu.Trigger asChild>
        <button
          className="theme-toggle"
          ref={trigger}
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
          <Menu.RadioGroup
            value={theme}
            onValueChange={(value) => {
              flushSync(() => setOpen(false));
              if (trigger.current) chooseTheme(value, trigger.current);
            }}
          >
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
