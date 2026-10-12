import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { AnnouncerProvider } from './context/AnnouncerContext.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'

// The router itself (BrowserRouter / MemoryRouter) is supplied by the caller,
// so the same App can be mounted in the browser and in tests.
export default function App() {
  return (
    <AnnouncerProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="book/:serviceId" element={<BookingPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnnouncerProvider>
  )
}
