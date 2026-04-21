import { PhoneFrame } from './components/PhoneFrame/PhoneFrame'
import { NewsFeed } from './components/NewsFeed/NewsFeed'
import './styles/main.scss'

export default function App() {
  return (
    <PhoneFrame>
      <NewsFeed />
    </PhoneFrame>
  )
}
