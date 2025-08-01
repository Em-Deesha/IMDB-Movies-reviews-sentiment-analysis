# Movie Review Sentiment Analysis

A machine learning project that analyzes movie reviews to predict sentiment (positive or negative) using Natural Language Processing (NLP) techniques and provides an interactive web interface.

## 📋 Project Overview

This project implements a sentiment analysis model for movie reviews using the IMDB dataset. The model processes text reviews and classifies them as either positive or negative sentiment using Logistic Regression with TF-IDF vectorization.

## 🎯 Features

- **Interactive Web Interface**: Modern, responsive web application for easy sentiment analysis
- **Text Preprocessing**: Comprehensive text cleaning including HTML tag removal, lemmatization, and stop word removal
- **TF-IDF Vectorization**: Converts text to numerical features using Term Frequency-Inverse Document Frequency
- **Logistic Regression Model**: Binary classification for sentiment prediction
- **Real-time Analysis**: Instant sentiment prediction with confidence scores
- **Visual Results**: Animated progress bars and sentiment indicators
- **RESTful API**: Programmatic access to sentiment analysis functionality

## 📊 Dataset

The project uses the **IMDB Movie Reviews Dataset** containing:
- **50,000 movie reviews** (25,000 positive, 25,000 negative)
- **Two columns**: `review` (text) and `sentiment` (positive/negative)
- **Balanced dataset** with equal distribution of positive and negative reviews

### Dataset Structure
```csv
review,sentiment
"Movie review text...",positive
"Another review text...",negative
```

## 🛠️ Technologies Used

- **Python 3.11**
- **Flask** - Web framework for the interactive interface
- **pandas** - Data manipulation and analysis
- **numpy** - Numerical computing
- **scikit-learn** - Machine learning algorithms
- **nltk** - Natural Language Processing
- **spaCy** - Advanced NLP with lemmatization
- **Bootstrap 5** - Modern, responsive UI framework
- **JavaScript** - Interactive frontend functionality
- **Jupyter Notebook** - Interactive development

## 🚀 Installation & Setup

### Prerequisites
- Python 3.11 or higher
- pip package manager

### Setup Instructions

1. **Clone or download the project**
   ```bash
   cd "movie review"
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install required packages**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy model**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Download NLTK data**
   ```python
   import nltk
   nltk.download('stopwords')
   nltk.download('punkt')
   ```

## 📖 Usage

### Running the Web Application

1. **Start the Flask application**
   ```bash
   python app.py
   ```

2. **Open your browser** and go to `http://localhost:5000`

3. **Enter a movie review** in the text area and click "Analyze Sentiment"

### Running the Jupyter Notebook

1. **Start Jupyter Notebook**
   ```bash
   jupyter notebook
   ```

2. **Open `main.ipynb`** and run all cells sequentially

### Model Performance

The trained model achieves:
- **Accuracy**: 82.00%
- **Precision**: 84% (macro average)
- **Recall**: 82% (macro average)
- **F1-Score**: 82% (macro average)

### API Usage

The application provides RESTful API endpoints:

```bash
# Check model status
curl http://localhost:5000/api/status

# Predict sentiment
curl -X POST -H "Content-Type: application/json" \
     -d '{"text":"This movie was fantastic!"}' \
     http://localhost:5000/api/predict
```

### Making Predictions in Python

Use the `predict_sentiment()` function to analyze new reviews:

```python
# Example usage
review = "This movie was absolutely fantastic! The acting was superb."
sentiment = predict_sentiment(review)
print(f"Sentiment: {sentiment}")  # Output: Sentiment: Positive
```

## 🔧 Project Structure

```
movie review/
├── README.md                 # Project documentation
├── app.py                   # Flask web application
├── templates/
│   └── index.html          # Web interface template
├── static/
│   ├── css/style.css       # Custom styling
│   └── js/app.js           # Interactive JavaScript
├── main.ipynb              # Main analysis notebook
├── dataset.csv             # IMDB movie reviews dataset
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container deployment
├── docker-compose.yml     # Local deployment
├── Procfile              # Heroku deployment
└── DEPLOYMENT.md         # Deployment guide
```

## 📈 Key Components

### 1. Text Preprocessing Pipeline
- HTML tag removal
- Text lowercasing
- Punctuation and number removal
- Tokenization
- Stop word removal
- Lemmatization using spaCy

### 2. Feature Engineering
- TF-IDF vectorization with 5000 most common words
- Train-test split (80-20) with stratification

### 3. Model Training
- Logistic Regression with liblinear solver
- Optimized for binary classification

### 4. Evaluation Metrics
- Accuracy score
- Classification report (precision, recall, F1-score)
- Confusion matrix visualization

## 🎨 Web Interface Features

The interactive web application includes:
- **Modern, Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Sentiment Analysis**: Instant predictions with confidence scores
- **Visual Results Display**: Animated progress bars and sentiment indicators
- **Input Validation**: Smart character counting and validation
- **Professional Styling**: Clean, modern interface with smooth animations

## 🔍 Model Insights

- **Positive Reviews**: 94% recall, 76% precision
- **Negative Reviews**: 69% recall, 92% precision
- **Overall Performance**: 82% accuracy on test set

## 🚧 Limitations

- Model trained on a sample of 500 reviews (for demonstration)
- Limited to binary classification (positive/negative)
- Performance may vary with different text styles or domains
- Requires English language reviews

## 🔮 Future Enhancements

- Expand to full dataset (50,000 reviews)
- Implement more advanced models (BERT, transformers)
- Add multi-class sentiment analysis (very positive, positive, neutral, negative, very negative)
- Add user authentication and review history
- Implement model interpretability features
- Add batch processing for multiple reviews
- Create mobile app version

## 👨‍💻 Author

**Adeesha Waheed**
- Movie Review Sentiment Analysis Project
- Machine Learning & NLP Implementation

## 📄 License

This project is for educational and research purposes.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the project.

---

**Note**: This project demonstrates fundamental NLP and machine learning concepts for sentiment analysis. The model is trained on a subset of the data for demonstration purposes. The web interface provides an easy-to-use platform for analyzing movie review sentiment in real-time. 