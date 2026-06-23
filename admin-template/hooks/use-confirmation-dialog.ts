import { useState } from "react";
import React from "react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import type { IconType } from "@/components/ui/confirmation-dialog";
export interface ConfirmationDialogOptions {
  title: string;
  content: string;
  iconType?: IconType;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  lazy?: boolean;
}

export interface ConfirmationDialogState {
  isOpen: boolean;
  title: string;
  content: string;
  iconType: IconType;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  showCancelButton: boolean;
  lazy: boolean;
}

export const useConfirmationDialog = () => {
  const [state, setState] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    content: "",
    iconType: "warning",
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: "Confirm",
    cancelText: "Cancel",
    showCancelButton: true,
    lazy: false,
  });

  const showDialog = (options: ConfirmationDialogOptions) => {
    setState({
      isOpen: true,
      title: options.title,
      content: options.content,
      iconType: options.iconType || "warning",
      onConfirm: options.onConfirm || (() => {}),
      onCancel: options.onCancel || (() => {}),
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      showCancelButton: options.showCancelButton ?? true,
      lazy: options.lazy ?? false,
    });
  };

  const hideDialog = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  interface ShowSuccessOptions {
    title: string;
    content: string;
    onConfirm?: () => void | Promise<void>;
    confirmText?: string;
    lazy?: boolean;
  }

  interface ShowErrorOptions {
    title: string;
    content: string;
    onConfirm?: () => void | Promise<void>;
    confirmText?: string;
    lazy?: boolean;
  }

  interface ShowWarningOptions {
    title: string;
    content: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    lazy?: boolean;
  }

  const showSuccess = ({ title, content, onConfirm, confirmText = "Continue", lazy }: ShowSuccessOptions) => {
    showDialog({
      title,
      content,
      iconType: "success",
      onConfirm: onConfirm || hideDialog,
      showCancelButton: false,
      confirmText,
      lazy,
    });
  };

  const showError = ({ title, content, onConfirm, confirmText = "Close", lazy }: ShowErrorOptions) => {
    showDialog({
      title,
      content,
      iconType: "error",
      onConfirm: onConfirm || hideDialog,
      showCancelButton: false,
      confirmText,
      lazy,
    });
  };

  const showWarning = ({ 
    title, 
    content, 
    onConfirm, 
    onCancel, 
    confirmText = "Yes", 
    cancelText = "No",
    lazy
  }: ShowWarningOptions) => {
    showDialog({
      title,
      content,
      iconType: "warning",
      onConfirm: onConfirm || hideDialog,
      onCancel: onCancel || hideDialog,
      showCancelButton: true,
      confirmText,
      cancelText,
      lazy,
    });
  };

  const showConfirmation = ({ 
    title, 
    content, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    lazy
  }: ShowWarningOptions) => {
    showDialog({
      title,
      content,
      iconType: "warning",
      onConfirm: onConfirm || hideDialog,
      onCancel: onCancel || hideDialog,
      showCancelButton: true,
      confirmText,
      cancelText,
      lazy,
    });
  };

  const renderDialog = () => React.createElement(ConfirmationDialog, {
    open: state.isOpen,
    onOpenChange: hideDialog,
    title: state.title,
    content: state.content,
    iconType: state.iconType,
    onConfirm: state.onConfirm,
    onConfirmBtnText: state.confirmText,
    onCancelBtnText: state.cancelText,
    showCancelBtn: state.showCancelButton,
    lazy: state.lazy,
    onCancel: () => { state.onCancel()},
  });

  return {
    ...state,
    showDialog,
    hideDialog,
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
    renderDialog,
  };
};
