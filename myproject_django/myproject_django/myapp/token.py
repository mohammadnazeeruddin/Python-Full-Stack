import requests

url = 'http://127.0.0.1:8000/hello/'
headers = {'Authorization': 'Token 77df1fdaec00589280bf082144cfacfdc46c10f9'}
r = requests.get(url, headers=headers)