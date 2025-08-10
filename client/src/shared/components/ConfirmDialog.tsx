import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/ui/alert-dialog";
import { ReactNode } from "react";

type ConfirmColor = "danger" | "primary" | "default";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  confirmColor?: ConfirmColor;
  icon?: ReactNode;
  loading?: boolean;
}

const getButtonClass = (color: ConfirmColor = "default") => {
  switch (color) {
    case "danger":
      return "bg-red-600 hover:bg-red-700 text-white";
    case "primary":
      return "bg-[#1F4D2C]/90 hover:bg-[#1F4D2C] text-white";
    default:
      return "";
  }
};

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  confirmColor = "default",
  icon,
  loading = false,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={getButtonClass(confirmColor)}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Carregando..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
