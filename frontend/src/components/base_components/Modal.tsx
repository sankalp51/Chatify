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
  open?: boolean;
  handleModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Modal({
  trigger,
  title,
  description,
  children,
  open,
  handleModalOpen,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        handleModalOpen && handleModalOpen(open);
      }}
    >
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
