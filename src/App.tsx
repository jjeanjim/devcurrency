import { router} from './router'
import { RouterProvider} from 'react-router-dom'


import './App.css'

function App(){
  return(
    <div>
      <RouterProvider router={router} />
    </div>
  )
}



export default App
