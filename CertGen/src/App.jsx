import './index.css'
import Header from './components/Header'
import Notification from './components/Notification/Notification'
import Form from './components/Form/Form'
import Page from './components/Page'
import Loader from './components/Loader.jsx'

function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* <Loader /> */}
      <Page />
    </div>
  )
}

export default App
