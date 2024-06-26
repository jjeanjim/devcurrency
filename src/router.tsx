import {createBrowserRouter} from 'react-router-dom'
import { Home } from './Pages/Home';
import { Detail } from './Pages/details';
import { NotFound } from './Pages/notfound';
import { Layout } from '../src/components/layout'




const router = createBrowserRouter([
    {
        element:<Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path:"/detail/:cripto",
                element:<Detail/>
            },
            {
                path:"*",
                element: <NotFound/>
            }
        ]
    }
])

export {router};