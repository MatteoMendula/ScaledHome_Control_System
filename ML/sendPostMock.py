# importing the requests library 
import requests 
  
# defining the api-endpoint  
API_ENDPOINT = "http://localhost:3000/mqttpythoncmd"
API_KEY = "scaledHomeUcf"
  
# data to be sent to api 
data = {'key':API_KEY, 
        'cmd':'close all', 
} 
  
# sending post request and saving response as response object 
r = requests.post(url = API_ENDPOINT, data = data) 
  
# extracting response text  
pastebin_url = r.text 
print("Reponse is: %s"%pastebin_url) 