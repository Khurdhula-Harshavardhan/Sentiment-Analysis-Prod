import './App.css';
import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

function useTypingEffect(text, delay = 100) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setDisplayedText((prevText) => prevText + text[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentIndex, delay, text]);

  return displayedText;
}

function ResultsDisplay({ data, input }) {
  const defaultMessage = 'Please enter text, so I can perform sentiment analysis.';

  const fullText = data
    ? `Sentiment: ${data.Label}\nP(Negative): ${data["Negative Class"]}\nLog P(Negative): ${data["Negative Class Log"]}\nP(Positive): ${data["Positive Class"]}\nLog P(Positive): ${data["Positive Class Log"]}\nPrediction: ${data.Prediction}\nText: ${data.Text}`
    : '';

  const displayedText = useTypingEffect(input ? (data ? fullText : input) : defaultMessage, 50);

  return <pre className="typing-effect">{displayedText}</pre>;
}

function App() {
  const [input, setInput] = useState("");
  const [apiData, setApiData] = useState(null);

  document.title = "Sentiment Analysis"

  useEffect(() => {
    if (!input) {
      setApiData(null);
      return;
    }

    const timerId = setTimeout(() => {
      showResults(input);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [input]);

  const showResults = async (text) => {
    try {
      const response = await fetch("https://khurdhulaharshavardhan.pythonanywhere.com/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiData(data);
      } else {
        throw new Error("Error fetching data from API");
      }
    } catch (error) {
      console.error(error);
      setApiData(null);
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const clearInput = () => {
    setInput('');
  };


  return (
      <>
      <head>
      <title>Sentiment</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="apiStyling.css" type="text/css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEFHV3NK5Dk8J+KryoMmUz5l/6en9XCp0" crossorigin="anonymous" />
      </head>
      
    
    <div style={{background: "black"}}>
      
            
      <div className="center-box">
        <h3>Sentiment Detector!</h3>
        <h5>
          <i>By Harsha Vardhan, Khurdula.</i>
        </h5>
        <form>
        <div className="form-group">
          <label htmlFor="search-input" style={{ fontSize: 'medium', color: 'beige' }}>
            Enter text in English:
          </label>
          <div style={{ display: 'flex' }}>
            <textarea
              onChange={handleInputChange}
              value={input}
              className="form-control"
              id="inputInEng"
              required=""
              style={{ resize: 'none' }}
            ></textarea>
            <button type="button" onClick={clearInput} className="btn btn-outline-light ml-2">
              <FaTrash />
            </button>
          </div>
        </div>
              <div className="mt-4">
        <label htmlFor="display-field" style={{ color: "beige", fontFamily:"monospace" }}>Sentiment:</label>
        <small><p>Note: The model can only classify your input into Positive or Negative class, hence even neutral comments will have to fall under these labels.</p></small>
        <div id="display-field" className="card">
          <div className="card-body">
          <ResultsDisplay data={apiData} input={input} />
          </div>
        </div>
      </div>
      <br></br>
    </form>
  </div>
  <footer className="app-footer">
    <p>
       Copyright &copy; 2023 Harsha Vardhan Khurdula. | <a href="https://github.com/Khurdhula-Harshavardhan/Sentiment-Analysis" target="_blank" rel="noopener noreferrer">View Source</a> | <a href="https://github.com/Khurdhula-Harshavardhan/Sentiment-Analysis-Prod/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">License</a>
    </p>
  </footer>
</div>
</>

);
}

export default App;
             
