import SearchInput from "./SearchInput";
import Conversations from "../Conversations";

export default function Sidebar() {
  return (
    <section className="w-full sm:w-1/3 lg:w-1/4 bg-base-100 shadow-lg p-4 rounded-lg sm:rounded-none sm:rounded-l-lg">
      <SearchInput />
      <div className="divider"></div>
      <Conversations />
      {/* <LogoutButton /> */}
    </section>
  );
}
