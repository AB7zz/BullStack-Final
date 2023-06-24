import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [company, setCompany] = useState('');
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  // api call
  const fetchData = async () => {

    const axios = require('axios');

    const options = {
      method: 'GET',
      url: 'https://bloomberg-market-and-financial-news.p.rapidapi.com/market/auto-complete',
      params: { query: company },
      headers: {
        'X-RapidAPI-Key': 'dddbcc777bmshd30593e208368d1p173904jsn3e44e854c9f2',
        'X-RapidAPI-Host': 'bloomberg-market-and-financial-news.p.rapidapi.com'
      }
    };

    try {
      const resp = await axios.request(options);
      setResponse(resp.data); // Store the response data in the state
    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    if (response) {
      navigate('/HomeDetails', { replace: true, state: { response, company: company } });
    }
  }, [response, navigate, company]);
  
  const handleChange = (e) => {
    setCompany(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="coin-app">
      <div className="coin-search">
        <h1 className="coin-text">Search a Company</h1>
        <p className="made-by">Made by Abbas Zaidi</p>
        <form onSubmit={handleSubmit} className='form-css'>
            <div>
                <input onChange={handleChange} type="text" placeholder="Search" className="coin-input" />
            </div>
            <div>
                <input type="submit" value="Search" className='coin-submit'/>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
