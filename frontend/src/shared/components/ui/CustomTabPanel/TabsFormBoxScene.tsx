import { Box, Container, Grid, Stack, Typography } from '@mui/material';

import { gridSizeMdLg8 } from '@/shared/constants';
import { useIsMediaQuery } from '@/shared/hooks';
import { CreateOrCancelButtonsForm } from '..';

export type TabsFormBoxSceneProps = {
  children: React.ReactNode;
  // children: JSX.Element | JSX.Element[];
  titlePage: string;
  titlePageNode?: React.ReactNode;

  /// save and cancel btn
  showBtns?: boolean;
  onCancel?: () => void;
  onSave?: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  cancelTextBtn?: string;
  saveTextBtn?: string;

  disableSubmitBtn?: boolean;

  ///* tabs
  tabs: any;

  formSize?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };

  showCustomBtns?: boolean;
  customBtns?: React.ReactNode;

  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const TabsFormBoxScene: React.FC<TabsFormBoxSceneProps> = ({
  children,
  titlePage,
  titlePageNode,

  showBtns = true,
  onCancel,
  onSave,
  disableSubmitBtn = false,
  cancelTextBtn = 'Cancelar',
  saveTextBtn = 'Guardar',

  tabs,
  formSize = gridSizeMdLg8,

  showCustomBtns = false,
  customBtns,

  maxWidth = 'lg',
}) => {
  const isMobile = useIsMediaQuery('sm');

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={maxWidth}>
        <Stack spacing={3}>
          {/* =========== title =========== */}
          {titlePageNode ? (
            titlePageNode
          ) : (
            <Typography variant="h4" pb={isMobile ? 3 : 6}>
              {titlePage}
            </Typography>
          )}

          {/* =========== form =========== */}
          <Grid container justifyContent="center" alignItems="center">
            <Grid item {...formSize}>
              {/* ======== tabs ======= */}
              {tabs}

              {/* ======== tab panel ======= */}
              {children}

              {/* ====== submit btn ====== */}
              {showBtns && onCancel && onSave && (
                <Box
                  sx={{
                    pr: '9px',
                  }}
                >
                  <CreateOrCancelButtonsForm
                    onCancel={onCancel}
                    onSave={onSave}
                    disabled={disableSubmitBtn}
                    cancelTextBtn={cancelTextBtn}
                    saveTextBtn={saveTextBtn}
                  />
                </Box>
              )}

              {/* ====== custom btns ====== */}
              {showCustomBtns && customBtns}
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default TabsFormBoxScene;
