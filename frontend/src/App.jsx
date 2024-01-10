import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserProvider } from './config/UserContext';
import MyProfilePage from './pages/MyProfilePage';
import QuizPage from './pages/QuizPage';
import PlayQuiz from './pages/PlayQuiz';
import OpenQuiz from './pages/OpenQuiz';
import PlayOpenQuiz from './pages/PlayOpenQuix.jsx';

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
    path: '/about',
    element: <h1>About Page</h1>,
  },
  {
    path: '/myprofile',
    element: <MyProfilePage />,
  },
  {
    path: '/global',
    element: <h1>Global Page</h1>,
  },
  {
    path: '/quiz',
    element: <QuizPage />,
  },
  {
    path: '/quiz/:id',
    element: <PlayQuiz />
  },
  {
    path: '/openquiz',
    element: <OpenQuiz />
  },
  {
    path: '/openquiz/:id',
    element: <PlayOpenQuiz />
  },
  {
    path: '/*',
    element: <center><h1>Page Not Found</h1></center>,
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
