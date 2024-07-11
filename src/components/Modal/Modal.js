import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Box } from "../Box";
import { Button } from "../Button";
import { Label } from "../Label";
import { ModalComponent } from "./styled";

const modalElement = document.getElementById("modal-root");

export const Modal = forwardRef(
  (
    { children, okText, cancelText, headerText, iconsClose, modalHead, onCallback = () => {}, isCloseEnd },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }),
      []
    );

    const handleEscape = useCallback((e) => {
      if (e.keyCode === 27) setIsOpen(false);
    }, []);

    useEffect(() => {
      if (isOpen) document.addEventListener("keydown", handleEscape, false);
      return () => {
        document.removeEventListener("keydown", handleEscape, false);
      };
    }, [handleEscape, isOpen]);

    return createPortal(
      isOpen ? (
        <ModalComponent>
          <Box>
            <Box className={modalHead}>
              <Label className="modal-header-text">{headerText}</Label>
              <Button className="btn-transparent" onClick={() => setIsOpen(false)}>
                {iconsClose}
              </Button>
            </Box>
            {children}
            {(okText || cancelText) && (
              <Box className="modal-footer">
                {cancelText && (
                  <Button
                    className="modal-cancel-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    {cancelText}
                  </Button>
                )}
                {okText && (
                  <Button
                    className="modal-ok-btn"
                    onClick={() => {
                      onCallback();
                      !isCloseEnd && setIsOpen(false);
                    }}
                  >
                    {okText}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </ModalComponent>
      ) : null,
      modalElement
    );
  }
);
