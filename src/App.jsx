import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Header from './layouts/Header/Header'
import Musics from './components/Musics'
import MusicPage from './components/MusicPage'
// import MusicPlayer from './components/MusicPlayer'
import { Theme } from './Theme/Theme'

function App() {

  const router = createBrowserRouter([{
    path:"/",
    element: <Header/>,
    children:[
      
      {
        path:"/",
        element:<MusicPage/>
      },
     
      {
        path:"/musicpage",
        element:<Musics/>
      }
    ]
  }])

  return (
    <>
    <Theme>
    <RouterProvider router={router}/>

    </Theme>
    </>
  )
}

export default App
