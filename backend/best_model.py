"""
Best tweet sentiment model: best_model.

Usage:
    from best_model import analyze_tweet

    score, keywords = analyze_tweet("I love this movie!", 1)
"""

import numpy as np
from joblib import load

# Load the best model (Pipeline with 'tfidf' and 'clf')
_MODEL_PATH = "nb_best_TF_IDF_tuned_2_grams.joblib"
_pipeline = load(_MODEL_PATH)


def analyze_tweet(tweet: str, return_keywords: int = 0):
    """
    Analyze a tweet's sentiment.

    Args:
        tweet: The tweet text as a string.
        return_keywords: 0 or 1. If 1, also return a list of keyword strings
                         derived from TF-IDF weights for this tweet.

    Returns:
        (score_int, keywords)
        - score_int: integer sentiment score in [-100, 100]
        - keywords: list of str, possibly empty if return_keywords == 0
    """
    if not isinstance(tweet, str):
        raise TypeError("tweet must be a string")

    # Get probability of positive class
    proba = _pipeline.predict_proba([tweet])[0]
    p_pos = float(proba[1])

    # Map P(positive) to [-100, 100]
    score = -100 + 200 * p_pos
    score_int = int(round(score))

    keywords = []
    if return_keywords:
        tfidf = _pipeline.named_steps["tfidf"]
        X = tfidf.transform([tweet])
        feature_names = np.array(tfidf.get_feature_names_out())

        row = X[0]
        indices = row.nonzero()[1]
        n_terms = len(indices)
        if n_terms > 0:
            scores = row.data
            order = np.argsort(scores)[::-1]

            # Top 10% of words, with a minimum of 3 and
            # at most n_terms if there are fewer than 3
            top_k = max(3, int(np.ceil(0.10 * n_terms)))
            top_k = min(top_k, n_terms)

            top_indices = indices[order[:top_k]]
            keywords = feature_names[top_indices].tolist()

    return score_int, keywords
