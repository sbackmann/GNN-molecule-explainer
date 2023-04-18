import os 
import pandas as pd

df_xy = pd.read_csv('backend-project/data/mutag_xy.csv')
df_label = pd.read_csv('backend-project/data/gin_3l_predictions.csv')

df = df_xy[['idx', 'pca_x', 'pca_y']]
df = pd.merge(df, df_label, on='idx')
print(df.head())
df.to_csv('backend-project/data/embeddings.csv', index=False)