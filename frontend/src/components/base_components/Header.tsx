import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center">
      <h1 className="text-2xl font-bold">Chatify</h1>
      <ThemeToggle />
    </header>
  );
}
