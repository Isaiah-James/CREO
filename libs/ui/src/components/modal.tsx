'use client';

import React, { useCallback, useMemo } from "react";
import { IconType } from "react-icons";
import { useModal } from "../hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Separator } from "@radix-ui/react-separator";



export interface ModalProps {
    type: string;
    name: string;
    description?: string;
    Icon?: IconType;
    children: React.ReactNode;
    closeAction?: () => void;
};

export const Modal: React.FC<ModalProps> = ({ type, name, description, Icon, children, closeAction }) => {
    const modal = useModal();
    const isOpen = useMemo(() => {
        return modal.isOpen && modal.type == type;
    }, [modal.isOpen, modal.type, type]);

    const handleClose = useCallback(() => {
        modal.close();
        closeAction?.();
    }, [modal, closeAction]);


  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className='overflow-hidden'>
        <DialogHeader className="flex flex-col items-center justify-center gap-1">
          <div className='flex items-center'>{Icon && <Icon className="w-9 h-9 text-slate-700" />}
          <DialogTitle className="text-3xl text-accent-foreground">  {name}</DialogTitle>
          </div>
          <p>{description}</p>
        </DialogHeader>
        <Separator />
        {children}
      </DialogContent>
    </Dialog>
  );
}