import router from './routes/Routes.jsx';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <RouterProvider router={router} />
    </>
  )
}