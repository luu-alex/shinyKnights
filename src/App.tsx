
import WebApp from '@twa-dev/sdk'
import PhaserGame from './game/PhaserGame';
import './App.css'

function App() {
  return (
    <>
      
      <PhaserGame />
      <button onClick={() => WebApp.showAlert(`Hello World!`)}>
            Show Alert
        </button>
    </>
  )
}

export default App
