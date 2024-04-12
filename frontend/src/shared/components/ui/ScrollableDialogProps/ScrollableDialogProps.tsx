import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export interface ScrollableDialogPropsProps {
  open: boolean;
  title: string;
  contentNode?: React.ReactNode;
  contentText?: string;
  cancelTextBtn?: string;
  cancelVariantBtn?: 'text' | 'outlined' | 'contained';
  confirmTextBtn?: string;
  confirmVariantBtn?: 'text' | 'outlined' | 'contained';
  onConfirm?: (() => Promise<void>) | (() => void);
  onClose: () => void;

  width?: string;
  minWidth?: string;

  showCustomActions?: boolean;
  customActions?: React.ReactNode;
}

const ScrollableDialogProps: React.FC<ScrollableDialogPropsProps> = ({
  open,
  title,
  cancelTextBtn = 'Cancelar',
  cancelVariantBtn = 'text',
  confirmTextBtn = 'Confirmar',
  confirmVariantBtn = 'text',
  contentNode,
  contentText,
  onClose,
  onConfirm,

  minWidth = '50%',
  width = '100%',
  showCustomActions = false,
  customActions,
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="paper"
        sx={{ '& .MuiDialog-paper': { width, minWidth } }}
      >
        {/* ========= Title ========= */}
        <DialogTitle style={{ padding: '24px 24px' }} id="scroll-dialog-title">
          {title}
        </DialogTitle>

        {/* ========= Content ========= */}
        <DialogContent dividers={true}>
          {contentNode ? (
            contentNode
          ) : (
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              {contentText}
            </DialogContentText>
          )}
        </DialogContent>

        {/* ========= Actions ========= */}
        <DialogActions>
          {showCustomActions ? (
            customActions
          ) : (
            <>
              <Button onClick={onClose} variant={cancelVariantBtn}>
                {cancelTextBtn}
              </Button>

              {!!onConfirm && (
                <Button onClick={onConfirm} variant={confirmVariantBtn}>
                  {confirmTextBtn}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScrollableDialogProps;
