import { HashRouter, Routes, Route } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Home, Navbar, Tech, Works, StarsCanvas } from './components';

const App = () => {
  return (
    <HashRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
        </div>

        {/* Define routes to switch between pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/work" element={<Works />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/contact" element={
            <div className="relative z-0">
              <Contact />
              <StarsCanvas />
            </div>
          } />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App;