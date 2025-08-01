# Deployment Guide

This guide provides instructions for deploying the Movie Review Sentiment Analysis application to various platforms.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Virtual environment
- All dependencies installed

### Local Development Server
```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Run the application
python app.py
```

The application will be available at `http://localhost:5000`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Using Docker directly
```bash
# Build the image
docker build -t sentiment-analyzer .

# Run the container
docker run -p 5000:5000 -v $(pwd)/dataset.csv:/app/dataset.csv sentiment-analyzer
```

## ☁️ Cloud Deployment

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Download and install from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Set buildpacks**
   ```bash
   heroku buildpacks:set heroku/python
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy sentiment analysis app"
   git push heroku main
   ```

6. **Open the app**
   ```bash
   heroku open
   ```

### Railway Deployment

1. **Connect your GitHub repository to Railway**
2. **Railway will automatically detect the Python app**
3. **Set environment variables if needed**
4. **Deploy automatically on push**

### Render Deployment

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build command:**
   ```bash
   pip install -r requirements.txt && python -m spacy download en_core_web_sm
   ```
4. **Configure start command:**
   ```bash
   gunicorn app:app
   ```

### Google Cloud Run

1. **Install Google Cloud SDK**
2. **Build and push to Container Registry**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/sentiment-analyzer
   ```
3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy sentiment-analyzer \
     --image gcr.io/PROJECT-ID/sentiment-analyzer \
     --platform managed \
     --allow-unauthenticated
   ```

### AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB application**
   ```bash
   eb init
   ```

3. **Create environment**
   ```bash
   eb create sentiment-analyzer-env
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

## 🔧 Environment Variables

Set these environment variables for production:

```bash
FLASK_ENV=production
PYTHONUNBUFFERED=1
```

## 📊 Monitoring and Health Checks

The application includes health check endpoints:

- **Health Check**: `GET /api/status`
- **Model Status**: Returns model readiness status

## 🔒 Security Considerations

### Production Security
1. **Use HTTPS** in production
2. **Set up proper CORS** if needed
3. **Implement rate limiting**
4. **Add authentication** if required
5. **Use environment variables** for sensitive data

### Example Security Headers
```python
# Add to app.py
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use multiple Gunicorn workers
- Implement load balancing
- Use Redis for session storage if needed

### Vertical Scaling
- Increase memory allocation
- Use more powerful CPU instances
- Optimize model loading

## 🐛 Troubleshooting

### Common Issues

1. **Model not loading**
   - Check if spaCy model is downloaded
   - Verify dataset.csv exists
   - Check logs for errors

2. **Memory issues**
   - Reduce sample size in training
   - Use smaller spaCy model
   - Increase container memory

3. **Slow response times**
   - Optimize model loading
   - Use caching
   - Implement async processing

### Logs
```bash
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs sentiment-analyzer
```

## 📝 Performance Optimization

### Model Optimization
1. **Use smaller spaCy model** (`en_core_web_sm` instead of `en_core_web_lg`)
2. **Reduce TF-IDF features** (currently 5000)
3. **Implement model caching**
4. **Use model serialization**

### Application Optimization
1. **Enable Gunicorn workers**
2. **Implement request caching**
3. **Use CDN for static files**
4. **Optimize database queries** (if applicable)

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 📞 Support

For deployment issues:
1. Check the logs
2. Verify environment setup
3. Test locally first
4. Review platform-specific documentation

---

**Note**: Always test your deployment in a staging environment before going to production. 