import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { indigo } from '@mui/material/colors';

import { gridSize } from '@/shared/constants';
import { useUiConfirmModalStore } from '@/store/ui';

export type CustomConfirmDialogProps = {};

const CustomConfirmDialog: React.FC<CustomConfirmDialogProps> = () => {
  const open = useUiConfirmModalStore(s => s.confirmDialog.isOpen);
  const title = useUiConfirmModalStore(s => s.confirmDialog.title);
  const subtitle = useUiConfirmModalStore(s => s.confirmDialog.subtitle);
  const onClose = useUiConfirmModalStore(s => s.confirmDialog.onClose);
  const onConfirm = useUiConfirmModalStore(s => s.confirmDialog.onConfirm);
  const btnTitle = useUiConfirmModalStore(s => s.confirmDialog.btnTitle);
  const setConfirmDialogIsOpen = useUiConfirmModalStore(
    s => s.setConfirmDialogIsOpen
  );
  const cancelTextBtn = useUiConfirmModalStore(
    s => s.confirmDialog.cancelTextBtn
  );
  const confirmTextBtn = useUiConfirmModalStore(
    s => s.confirmDialog.confirmTextBtn
  );

  const shwoCustomInputsForm = useUiConfirmModalStore(
    s => s.confirmDialog.shwoCustomInputsForm
  );
  const inputsForm = useUiConfirmModalStore(s => s.confirmDialog.inputsForm);

  return (
    <Dialog
      open={open}
      onClose={() => {
        !onClose ? setConfirmDialogIsOpen(false) : onClose();
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1">{subtitle}</Typography>

        {/* ------ Modal FORM ------ */}
        {shwoCustomInputsForm && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            pt={4}
            pb={1}
          >
            <Grid item {...gridSize}>
              {inputsForm}
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          pr: 2,
        }}
      >
        <Button
          onClick={() => {
            !onClose ? setConfirmDialogIsOpen(false) : onClose();
          }}
          sx={{ color: indigo[600] }}
        >
          {btnTitle || cancelTextBtn || 'Cancelar'}
        </Button>
        <Button
          onClick={onConfirm}
          style={{
            color: 'white',
            background: indigo[900],
          }}
        >
          {confirmTextBtn || 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomConfirmDialog;
