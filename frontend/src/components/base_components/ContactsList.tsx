import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import ToolTip from "./ToolTip";
import { useState } from "react";
import { AxiosError } from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";

export default function ContactsList() {
  const [searchItem, setSearchItem] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const axios = useAxiosPrivate();

  const { isError, isLoading, error, data, refetch } = useQuery({
    queryKey: ["users", searchItem],
    queryFn: async () => {
      try {
        const response = await axios.get<User[]>(
          `/api/users/all-users?search=${searchItem}`
        );
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message);
        }
      }
    },
    enabled: false,
  });

  const handleSheetClose = (open: boolean) => {
    setSearchItem("");
    setSheetOpen(open);
  };

  return (
    <div className="flex justify-left items-center gap-1">
      <Sheet open={sheetOpen} onOpenChange={(open) => handleSheetClose(open)}>
        <SheetTrigger>
          <ToolTip
            mainMessage={<Search className="cursor-pointer" />}
            info="Search users"
          />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="hidden">Search for users</SheetTitle>
            <SheetDescription className="hidden">
              Search for people you want to start chatting with.
            </SheetDescription>
          </SheetHeader>

          <div className="flex justify-center items-center gap-2 mt-10">
            <Input
              type="search"
              placeholder="Search for users"
              className="dark:ring-1"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <Button onClick={() => refetch()}>
              <Search size={20} />
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {/* Loading State */}
            {isLoading && <ChatLoading />}

            {/* Error State */}
            {isError && (
              <div className="text-red-500">
                <p className="text-center">
                  {error.message || "Failed to fetch users."}
                </p>
              </div>
            )}

            {/* Empty State */}
            {data && data.length === 0 && !isLoading && (
              <div className="text-center text-gray-500">
                No users found matching "{searchItem}".
              </div>
            )}

            {/* Data Display */}
            {data && data.length > 0 && (
              <div className="space-y-2 overflow-y-auto">
                {data.map((user) => (
                  <UserListItem
                    onSheetOpen={setSheetOpen}
                    key={user._id}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
