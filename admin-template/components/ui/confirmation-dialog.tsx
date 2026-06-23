"use client";

import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


export type IconType = "warning" | "delete" | "alert" | "success" | "error";

interface Props {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  content: string;
  iconType?: IconType;
  onConfirm: () => void | Promise<void>;
  onConfirmBtnText?: string;
  onCancelBtnText?: string;
  showCancelBtn?: boolean;
  showConfirmBtn?: boolean;
  onConfirmBtnVariant?: "default" | "destructive" | "secondary";
  lazy?: boolean;
  iconClassName?: string;
  onCancel?: () => void;
}

export default function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  iconType = "warning",
  content,
  lazy,
  onCancelBtnText,
  onConfirmBtnText,
  showCancelBtn = true,
  showConfirmBtn = true,
  onConfirmBtnVariant = "default",
  iconClassName,
  onCancel
}: Readonly<Props>) {
  const [loading, setLoading] = useState(false);

  // Ensure we never carry loading state across dialog uses
  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  const iconConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: "text-orange-600",
      backgroundColor: "bg-orange-50"
    },
    delete: {
      icon: Trash2,
      iconColor: "text-red-600",
      backgroundColor: "bg-red-50"
    },
    alert: {
      icon: AlertCircle,
      iconColor: "text-blue-600",
      backgroundColor: "bg-blue-50"
    },
    error: {
      icon: AlertCircle,
      iconColor: "text-red-600",
      backgroundColor: "bg-red-50"
    },
    success: {
      icon: CheckCircle2,
      iconColor: "text-green-600",
      backgroundColor: "bg-green-50"
    }
  };

  const currentIconConfig = iconConfig[iconType] || iconConfig.warning;

  const handleAction = async () => {
    if (lazy) {
      // Handle async execution
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    } else {
      // Handle synchronous execution
      onConfirm();
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => {}} >
       <DialogContent className="min-w-[450px] max-w-[450px]" showCloseButton={false}>
         <div className="flex flex-col items-center gap-6">
           <div className={`h-12 w-12 ${currentIconConfig.backgroundColor} rounded-full relative`}>
             <currentIconConfig.icon
               className={cn(
                 "h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                 currentIconConfig.iconColor,
                 iconClassName
               )}
             />
           </div>
           
           <div className="text-center">
             <DialogTitle className="p-0 m-0 mb-2 text-xl font-semibold">{title}</DialogTitle>
             <DialogDescription className="!p-0 !m-0 text-center">
               {content}
             </DialogDescription>
           </div>
           
           <div className="flex justify-center items-center gap-3 mt-2">
             {showCancelBtn && (
               <Button variant="outline" onClick={() => { onCancel?.(); onOpenChange?.(false) }}>
                 {onCancelBtnText || "Cancel"}
               </Button>
             )}
             {showConfirmBtn && (
               <Button
                 variant={onConfirmBtnVariant}
                loading={loading}
                 onClick={handleAction}
               >
                 {onConfirmBtnText || "Confirm"}
               </Button>
             )}
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
}
