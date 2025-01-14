import './App.css';
import Books from './Books';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Books />} exact />
        </Routes>
      </div>
    </Router>
  );
}

export default App;