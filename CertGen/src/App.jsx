import './index.css'
import Header from './components/Header'
import Notification from './components/Notification/Notification'
import Form from './components/Form/Form'

function App() {
  return (
    <div className='flex flex-col justify-center items-center bg-background gap-10'>
      <Header /> 
      <Form />
      <Notification />
    </div>
  )
}

export default App
