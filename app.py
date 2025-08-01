from flask import Flask, render_template, request, jsonify
import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import os

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)

# Global variables for model and vectorizer
model = None
tfidf_vectorizer = None

def preprocess_text(text):
    """
    Cleans and preprocesses a single text string.
    1. Removes HTML tags
    2. Lowercases text
    3. Removes punctuation and numbers
    4. Tokenizes text
    5. Removes stop words
    6. Lemmatizes words
    """
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove punctuation and numbers
    text = re.sub(r'[^a-z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    
    # Lemmatization
    text = ' '.join(tokens)
    doc = nlp(text)
    lemmatized_tokens = [token.lemma_ for token in doc]
    
    return ' '.join(lemmatized_tokens)

def train_model():
    """Train the sentiment analysis model"""
    global model, tfidf_vectorizer
    
    print("Loading dataset...")
    try:
        df = pd.read_csv('dataset.csv')
    except FileNotFoundError:
        return False, "Dataset file not found"
    
    print("Preprocessing data...")
    # Sample data for faster training (you can remove .sample(500) for full dataset)
    df = df.sample(500).copy()
    df['cleaned_review'] = df['review'].apply(preprocess_text)
    
    # Convert sentiment to numeric
    df['sentiment_numeric'] = df['sentiment'].map({'positive': 1, 'negative': 0})
    
    # Prepare features and target
    X = df['cleaned_review']
    y = df['sentiment_numeric']
    
    # Split data
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("Training TF-IDF vectorizer...")
    # Train TF-IDF vectorizer
    tfidf_vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)
    
    print("Training Logistic Regression model...")
    # Train model
    model = LogisticRegression(solver='liblinear', random_state=42)
    model.fit(X_train_tfidf, y_train)
    
    # Evaluate model
    X_test_tfidf = tfidf_vectorizer.transform(X_test)
    accuracy = model.score(X_test_tfidf, y_test)
    
    print(f"Model trained successfully! Accuracy: {accuracy:.4f}")
    return True, f"Model trained successfully! Accuracy: {accuracy:.4f}"

def predict_sentiment(text):
    """Predict sentiment for given text"""
    if model is None or tfidf_vectorizer is None:
        return "Error: Model not trained"
    
    # Preprocess the text
    cleaned_text = preprocess_text(text)
    
    # Vectorize the text
    vectorized_text = tfidf_vectorizer.transform([cleaned_text])
    
    # Predict
    prediction = model.predict(vectorized_text)[0]
    probability = model.predict_proba(vectorized_text)[0]
    
    sentiment = "Positive" if prediction == 1 else "Negative"
    confidence = probability[1] if prediction == 1 else probability[0]
    
    return {
        'sentiment': sentiment,
        'confidence': f"{confidence:.2%}",
        'probability_positive': f"{probability[1]:.2%}",
        'probability_negative': f"{probability[0]:.2%}"
    }

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def api_predict():
    """API endpoint for sentiment prediction"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        if len(text) < 10:
            return jsonify({'error': 'Text too short. Please provide a longer review.'}), 400
        
        result = predict_sentiment(text)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def api_train():
    """API endpoint for training the model"""
    try:
        success, message = train_model()
        return jsonify({'success': success, 'message': message})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/status')
def api_status():
    """API endpoint to check model status"""
    model_ready = model is not None and tfidf_vectorizer is not None
    return jsonify({
        'model_ready': model_ready,
        'message': 'Model is ready' if model_ready else 'Model not trained yet'
    })

if __name__ == '__main__':
    # Train model on startup
    print("Initializing sentiment analysis model...")
    success, message = train_model()
    if success:
        print("✅ Model ready!")
    else:
        print(f"❌ Model training failed: {message}")
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000) 