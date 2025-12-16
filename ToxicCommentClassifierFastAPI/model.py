import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer

seed = 1234
np.random.seed(seed) 

class NBLR(BaseEstimator, ClassifierMixin):
    def __init__(self, class_weight, C, max_features, ngram_range, sublinear_tf, min_df, max_df,  alpha, random_state=42):
        self.C = C
        self.class_weight = class_weight
        self.max_features = max_features
        self.ngram_range = tuple(ngram_range)
        self.sublinear_tf = sublinear_tf
        self.min_df = min_df
        self.max_df = max_df
        self.random_state = random_state
        self.alpha = alpha

        self.tfidf_vectorizer_ = None
        self.lr = None
        self.r_ = None

    def fit(self, text, y):

        self.classes_ = np.unique(y)   # required by sklearn ClassifierMixin

        # used to provider raw word count to Naive Bayes weighting process
        count_vectorizer = CountVectorizer(
            stop_words='english',
            ngram_range=self.ngram_range,
            max_features=self.max_features,
            min_df=self.min_df,
            max_df=self.max_df,
            strip_accents='unicode'
        )
        X_counts = count_vectorizer.fit_transform(text)

        # tfidf vectorizer is better for the features for logistic regression
        self.tfidf_vectorizer_ = TfidfVectorizer(
            vocabulary=count_vectorizer.vocabulary_,
            stop_words='english', 
            ngram_range=self.ngram_range, 
            max_features=self.max_features, 
            sublinear_tf=self.sublinear_tf,
            min_df=self.min_df,
            max_df=self.max_df,
            strip_accents='unicode'
        )
        X_tfidf = self.tfidf_vectorizer_.fit_transform(text)
                                    
        if hasattr(y, 'values'):    # for pandas compatability
            y = y.values

        p = self._prob(X_counts, y, 1)     # P(word | toxic)
        q = self._prob(X_counts, y, 0)     # P(word | non-toxic)
        self.r_ = np.log(p/q)

        X_nb = X_tfidf.multiply(self.r_)   # Apply weights to features:

        self.lr_ = LogisticRegression(
            solver='liblinear', 
            random_state=self.random_state, 
            class_weight=self.class_weight, 
            C=self.C,
        )
        self.lr_.fit(X_nb, y)
        return self
        
    def predict(self, X):
        X_tfidf = self.tfidf_vectorizer_.transform(X) 
        X_nb = X_tfidf.multiply(self.r_)
        return self.lr_.predict(X_nb)
        
    def predict_proba(self, X):
        X_tfidf = self.tfidf_vectorizer_.transform(X)  # ← Transform first!
        X_nb = X_tfidf.multiply(self.r_)
        return self.lr_.predict_proba(X_nb)
    
    def _prob(self, X, y, k):
        p = X[y == k].sum(0)
        return (p + self.alpha) / ((y == k).sum() + self.alpha)
    
    def evaluate(self, X, y):
        """Convenience method to get AUC"""
        y_probs = self.predict_proba(X)[:, 1]
        return roc_auc_score(y, y_probs)
