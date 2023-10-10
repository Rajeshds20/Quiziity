import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';

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
    element: <h1>Register Page</h1>,
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
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
