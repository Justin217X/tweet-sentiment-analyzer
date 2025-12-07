from best_model import analyze_tweet

# Just sentiment score, no keywords (second arg = 0)
# score, keywords = analyze_tweet("I absolutely love this movie, it was amazing!", 0)
# print(score, keywords)

# Sentiment + keywords (second arg = 1)
score, keywords = analyze_tweet("Eat shit, moron", 1)
print("Score:", score)
print("Keywords:", keywords)