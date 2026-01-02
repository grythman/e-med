import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>e-med - Эмчийн Сургалтын Сайт</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Нүүр хуудас</h2>
      <p>Тавтай морилно уу! Эмчийн сургалтын сайтад тавтай морилно уу.</p>
    </div>
  );
}

function Courses() {
  return (
    <div>
      <h2>Сургалтууд</h2>
      <p>Сургалтуудын жагсаалт энд байрлана.</p>
    </div>
  );
}

export default App;








