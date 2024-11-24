import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type DropdownItem = {
  label: string;
  onClick?: () => void;
};

type Props = {
  icon?: React.ReactNode;
  label: string;
  items: DropdownItem[];
};

export default function Dropdown({ icon, label, items }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-muted text-white p-2 rounded-full">
        {icon}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-muted">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
