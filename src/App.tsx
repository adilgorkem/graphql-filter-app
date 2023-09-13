
import React from 'react';
import './App.css';
import CountryList from './components/CountryList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Country List</h1>
      <CountryList />
    </div>
  );
};

export default App;
