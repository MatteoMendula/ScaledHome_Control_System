#!/usr/bin/env python
# coding: utf-8

# In[6]:


import os
import numpy as np
import datetime


# In[3]:


import pandas as pd
def read_data(data_path):
    data_frame = pd.read_csv(data_path)
    #data_frame = data_frame.set_index(pd.DatetimeIndex(data_frame['TIME']))
    #data_frame = data_frame.drop(columns=['icon', 'summary'])
    return data_frame


# In[4]:


DATASET_PATH = "../middleware/data"
# DATASET_PATH = "D:/Thesis draft/code/UCF_ScaledHomeMqtt/middleware/data"
# data_file_name = "data.csv"

# data_file_name = "2_1_2020.csv"
# data_file_name = "2_2_2020.csv"
data_file_name = "2_3_2020.csv"

# data_file_name = "data-only-increase.csv"
columns_to_drop = ["OUT_H[%]","T6[*C]","H6[%]","T12[*C]","H12[%]","T18[*C]",
                  "H18[%]","T19[*C]","H19[%]","T24[*C]","H24[%]","T25[*C]","H25[%]",
                  "T26[*C]","H26[%]","FAN_STATE","AC_STATE","HEATER_STATE"]

FMT = '%Y-%m-%d %H:%M:%S.%f'

data_path = os.path.join(DATASET_PATH, data_file_name)
# print(data_path.replace('/','\\'))
data = read_data(data_path)
data.head()


# In[7]:


data1 = data.copy()
# for i, j in data1.iterrows(): 
#     j[0] = datetime.datetime.strptime(j[0], '%Y-%m-%d %H:%M:%S.%f').time()
#     print(j[0])

def cleanData(data,cols_to_drop):
    data_cleaned = data.drop(columns=cols_to_drop)
    return data_cleaned
    
def timeDiffence(data):
    time_list = list()
    temp_list = list()
    
    t0 = (data["TIME"][0])
    for i, j in data.iterrows(): 
        el = (datetime.datetime.strptime(j[0], FMT) - datetime.datetime.strptime(t0, FMT)).seconds
        time_list.append(el)
        temp_list.append(j[1])
    return np.array(time_list), np.array(temp_list)
    
data1 = cleanData(data1,columns_to_drop)
time, temp = timeDiffence(data1)
# for el in time:
#     print (el)


# In[9]:


import matplotlib
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()

# %matplotlib inline

ax.plot(time, temp)

ax.set(xlabel='time (s)', ylabel='temp (°C)',
       title='Outside temperature over time')
ax.grid()

fig.savefig("test.png")
plt.show()


# In[28]:


np.argmax(temp)
temp[25]

np.argmin(temp)
temp[13]

time_diff_increase = time[13] - time[25]
time_diff_increase

time_diff_decrease = time[-34] - time[-11]
time_diff_decrease


# In[ ]:




