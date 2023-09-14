
import React from 'react';
import './App.css';
import CountryList from './components/CountryList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h2>Country List</h2>
      <CountryList />
    </div>
  );
};

export default App;
