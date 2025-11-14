import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="signin" element={<SignInPage />} />
              </Route>              
          </Routes>
      </BrowserRouter>
  )
}

export default App
