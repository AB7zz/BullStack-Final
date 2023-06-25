import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './HomeDetails.css';

const HomeDetails = () => {
  const [isBullish, setIsBullish] = useState(false);
  const [table, setTable] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state variable
  const fetchedResponse = useLocation();
  const { response, company } = fetchedResponse.state;
  const quotes = response.quote;
  const usdElement = quotes.find(
    (element) =>
      element.currency === 'USD' &&
      ['Stock', 'Commodity', 'Currency', 'Index', 'IndexFuture', 'Rate'].includes(element.template)
  );
  const Id = usdElement ? usdElement.id : -1;

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const axios = require('axios');

    const headers = {
      'X-RapidAPI-Key': 'your key',
      'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com'
    };

    let totalScore = 0;

    try {
      for (const item of response.news) {
        const options = {
          method: 'GET',
          url: 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/',
          params: {
            text: item.title
          },
          headers
        };

        const response2 = await axios.request(options);
        const score = response2.data.score;
        totalScore += score;
      }
      console.log((totalScore / response.news.length), totalScore)
      const calculatedIsBullish = (totalScore / 25) > 0.04;

      setIsBullish(calculatedIsBullish);

      if (Id !== -1) {
        const options = {
          method: 'GET',
          url: 'https://bloomberg-market-and-financial-news.p.rapidapi.com/stock/get-statistics',
          params: {
            id: Id
          },
          headers: {
            'X-RapidAPI-Key': 'your key',
            'X-RapidAPI-Host': 'bloomberg-market-and-financial-news.p.rapidapi.com'
          }
        };

        try {
          const response = await axios.request(options);
          setTable(response.data.result[0].table);
        } catch (error) {
          console.error(error);
        }
      }

      // Set isLoading to false after all API calls are completed
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoBack = () => {
    navigate('/'); // Go back to the previous page
  };

  console.log('Is Bullish:', isBullish);

  return (
    <div>
      {isLoading ? (
        <div className="load">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="coin-container">
          <button onClick={handleGoBack} className='back'>Go Back</button>
            <div className="company-name">
              <h1 className="heading">{company}</h1>
            </div>
            <div>
              {isBullish ? (
                <div className="bullish-box">Bullish</div>
              ) : (
                <div className="bearish-box">Bearish</div>
              )}
            </div>
            <div className="company-name">
              <div className="statistics-container">
                <h2>Key Statistics</h2>
                {Id !== -1 ? (
                  <table>
                    <tbody>
                      {table.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No statistics available</p>
                )}
              </div>
            </div>
          </div>
         

        </>
      )}
    </div>
  );
};

export default HomeDetails;
