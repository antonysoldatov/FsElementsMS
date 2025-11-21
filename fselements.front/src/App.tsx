import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignIn/SignInPage'
import SignOutPage from './pages/SignOutPage'
import MyElementsPage from './pages/Seller/MyElementsPage'
import AddEditElementPage from './pages/Seller/AddEditElementPage'
import MultiContextProvider from './storage/MultiContextProvider'
import MakeOrderPage from './pages/MakeOrderPage'
import MyOrdersPage from './pages/Seller/MyOrdersPage'
import AppStateLoader from './storage/AppStateLoader'

function App() {
    return (
        <MultiContextProvider>
            <AppStateLoader>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="signin" element={<SignInPage />} />
                            <Route path="signout" element={<SignOutPage />} />
                            <Route path="sellerelements" element={<MyElementsPage />} />
                            <Route path="sellereditelement/:id?" element={<AddEditElementPage />} />
                            <Route path="sellerorders" element={<MyOrdersPage />} />
                            <Route path="makeorder" element={<MakeOrderPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AppStateLoader>
        </MultiContextProvider>
    )
}

export default App
