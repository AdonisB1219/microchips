import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { AppRouter } from './router/AppRouter';
import { CustomConfirmDialog } from './shared/components';
import { AppTheme } from './theme';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppTheme>
        {/* ========= router ========= */}
        <RouterProvider router={AppRouter} />

        <CustomConfirmDialog />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          limit={3}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </AppTheme>
    </QueryClientProvider>
  );
}

export default App;
