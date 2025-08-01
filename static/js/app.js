// Movie Review Sentiment Analysis - Frontend JavaScript

class SentimentAnalyzer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.checkModelStatus();
    }

    initializeElements() {
        this.form = document.getElementById('sentimentForm');
        this.reviewText = document.getElementById('reviewText');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.modelStatus = document.getElementById('modelStatus');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.resultsContent = document.getElementById('resultsContent');
        this.sentimentIcon = document.getElementById('sentimentIcon');
        this.sentimentText = document.getElementById('sentimentText');
        this.confidenceText = document.getElementById('confidenceText');
        this.positivePercent = document.getElementById('positivePercent');
        this.negativePercent = document.getElementById('negativePercent');
        this.positiveBar = document.getElementById('positiveBar');
        this.negativeBar = document.getElementById('negativeBar');
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Real-time character count
        this.reviewText.addEventListener('input', () => this.updateCharacterCount());
    }

    async checkModelStatus() {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            this.updateModelStatus(data.model_ready, data.message);
        } catch (error) {
            console.error('Error checking model status:', error);
            this.updateModelStatus(false, 'Error checking model status');
        }
    }

    updateModelStatus(isReady, message) {
        const icon = this.modelStatus.querySelector('i');
        const text = this.modelStatus.querySelector('span');
        
        this.modelStatus.className = 'alert d-flex align-items-center';
        
        if (isReady) {
            this.modelStatus.classList.add('alert-success', 'model-ready');
            icon.className = 'fas fa-check-circle me-2';
            text.textContent = message;
        } else {
            this.modelStatus.classList.add('alert-warning', 'model-loading');
            icon.className = 'fas fa-exclamation-triangle me-2';
            text.textContent = message;
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const text = this.reviewText.value.trim();
        
        if (text.length < 10) {
            this.showError('Please enter a review with at least 10 characters.');
            return;
        }

        this.setLoadingState(true);
        
        try {
            const result = await this.analyzeSentiment(text);
            this.displayResults(result);
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            this.showError('An error occurred while analyzing the sentiment. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async analyzeSentiment(text) {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze sentiment');
        }

        return await response.json();
    }

    displayResults(result) {
        // Hide placeholder, show results
        this.resultsContainer.style.display = 'none';
        this.resultsContent.style.display = 'block';

        // Update sentiment display
        const isPositive = result.sentiment === 'Positive';
        
        this.sentimentIcon.innerHTML = isPositive 
            ? '<i class="fas fa-thumbs-up sentiment-icon sentiment-positive"></i>'
            : '<i class="fas fa-thumbs-down sentiment-icon sentiment-negative"></i>';
        
        this.sentimentText.textContent = result.sentiment;
        this.sentimentText.className = isPositive ? 'text-success' : 'text-danger';
        
        this.confidenceText.textContent = `Confidence: ${result.confidence}`;

        // Update progress bars
        const positivePercent = parseFloat(result.probability_positive);
        const negativePercent = parseFloat(result.probability_negative);
        
        this.positivePercent.textContent = result.probability_positive;
        this.negativePercent.textContent = result.probability_negative;
        
        // Animate progress bars
        setTimeout(() => {
            this.positiveBar.style.width = `${positivePercent}%`;
            this.negativeBar.style.width = `${negativePercent}%`;
        }, 100);

        // Scroll to results
        this.resultsContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }



    setLoadingState(isLoading) {
        const originalText = this.analyzeBtn.innerHTML;
        
        if (isLoading) {
            this.analyzeBtn.disabled = true;
            this.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analyzing...';
            this.analyzeBtn.classList.add('loading');
        } else {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.innerHTML = '<i class="fas fa-magic me-2"></i>Analyze Sentiment';
            this.analyzeBtn.classList.remove('loading');
        }
    }

    updateCharacterCount() {
        const count = this.reviewText.value.length;
        const minLength = 10;
        
        if (count < minLength) {
            this.analyzeBtn.disabled = true;
            this.analyzeBtn.classList.add('btn-secondary');
            this.analyzeBtn.classList.remove('btn-primary');
        } else {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.classList.remove('btn-secondary');
            this.analyzeBtn.classList.add('btn-primary');
        }
    }

    showError(message) {
        // Create error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert after model status
        this.modelStatus.parentNode.insertBefore(alertDiv, this.modelStatus.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Utility method to show success message
    showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        this.modelStatus.parentNode.insertBefore(alertDiv, this.modelStatus.nextSibling);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SentimentAnalyzer();
});

// Add some additional utility functions
window.addEventListener('load', () => {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const form = document.getElementById('sentimentForm');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
}); 