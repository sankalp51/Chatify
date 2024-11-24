import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  profileUrl?: string;
  name: string;
};

export default function Avtar({ name, profileUrl }: Props) {
  const firstInitial = name.split(" ")[0].charAt(0).toUpperCase();
  const lastInitial = name.split(" ")[1].charAt(0).toUpperCase();
  return (
    <Avatar>
      <AvatarImage src={profileUrl} />
      <AvatarFallback>{`${firstInitial}${lastInitial}`}</AvatarFallback>
    </Avatar>
  );
}
