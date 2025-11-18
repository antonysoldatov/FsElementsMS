import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignIn/SignInPage'
import { UserContextProvider } from './storage/UserContext'
import SignOutPage from './pages/SignOutPage'

function App() {
    return (
        <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="signin" element={<SignInPage />} />
                        <Route path="signout" element={<SignOutPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
    )
}

export default App
