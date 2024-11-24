import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
type Props = {
  trigger: string | ReactNode;
  title: string;
  children: ReactNode;
  description: string;
};

export default function Modal({
  trigger,
  title,
  description,
  children,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
