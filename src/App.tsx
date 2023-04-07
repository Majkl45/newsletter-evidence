import { ThemeProvider } from "@fluentui/react"
import Header from "./components/Header"
import SearchForm from "./components/SearchForm"
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons(/* optional base url */);

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <main>
          <SearchForm/>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
