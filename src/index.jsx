import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { StrictMode} from 'react'
import { Leva } from 'leva'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(

    <StrictMode>
        <Leva  />
        
        <Canvas
            orthographic
            camera={ {
                fov: 45,
                near: 0.1,
                far: 2000,
                position: [ 0, 0, 200],
                zoom : 10
            } }
        >
            <Experience />
        </Canvas>
    </StrictMode>
)