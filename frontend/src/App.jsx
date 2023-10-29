import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserProvider } from './config/UserContext';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/*',
    element: <h1>Page Not Found</h1>,
  }
]);

function App() {

  // useEffect(() => {
  //   fetch(`http://localhost:5000/user/hi`, {
  //     method: 'GET',
  //     credentials: 'include',
  //   })
  //     .then(async (response) => {
  //       const user = await response.json();
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <UserProvider>
      <RouterProvider router={routes} />
    </UserProvider>
  )
}

export default App
