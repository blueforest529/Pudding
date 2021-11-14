#!/usr/bin/env python
# encoding: utf-8
# -*- coding: cp949 -*-

import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = [
'https://spreadsheets.google.com/feeds',
'https://www.googleapis.com/auth/drive',
]

json_file_name = 'jsonfile'

credentials = ServiceAccountCredentials.from_json_keyfile_name(json_file_name, scope)
gc = gspread.authorize(credentials)

spreadsheet_url = 'sheet url'
doc = gc.open_by_url(spreadsheet_url)

title1 = '<?xml version="1.0" encoding="utf-8"?>'+ "\n";
title2 = '<CATEGORY TYPE="MSG" LANG="ko">'+ "\n";
end = '</CATEGORY>';


###################################################
# X_VOLT wprx
###################################################
worksheet = doc.worksheet('1. X_VOLT_wprx')

# 한국어
row_data = worksheet.col_values(7)
row_data = [x.encode('utf-8') for x in row_data]

f = open('lang.volt.ko.wprx', 'w')
f.write(title1)
f.write(title2)
for index, value in enumerate(row_data):
    if index>3:
        f.write(str(value) + "\n")
f.write(end)
f.close()

# 일본어
row_data = worksheet.col_values(6)
row_data = [x.encode('utf-8') for x in row_data]

f = open('lang.volt.jp.wprx', 'w')
f.write(title1)
f.write(title2)
for index, value in enumerate(row_data):
    if index>3:
        f.write(str(value) + "\n")
f.write(end)
f.close()

# 영어
row_data = worksheet.col_values(5)
row_data =  [x.encode('utf-8') for x in row_data]

f = open('lang.volt.en.wprx', 'w')
f.write(title1)
f.write(title2)
for index, value in enumerate(row_data):
    if index>3:
        f.write(str(value) + "\n")
f.write(end)
f.close()

# 우크라이나어
row_data = worksheet.col_values(4)
row_data =  [x.encode('utf-8') for x in row_data]

f = open('lang.volt.uk.wprx', 'w')
f.write(title1)
f.write(title2)
for index, value in enumerate(row_data):
    if index>3:
        f.write(str(value) + "\n")
f.write(end)
f.close()

# 러시아어
row_data = worksheet.col_values(3)
row_data =  [x.encode('utf-8') for x in row_data]

f = open('lang.volt.uk.wprx', 'w')
f.write(title1)
f.write(title2)
for index, value in enumerate(row_data):
    if index>3:
        f.write(str(value) + "\n")
f.write(end)
f.close()


###################################################
# WMC 
###################################################


worksheet = doc.worksheet('2. WMC_wprx')

# 한국어
row_data = worksheet.col_values(7)
row_data = [x.encode('utf-8') for x in row_data]

f = open('lang.msg.ko.wprx', 'w')
f.write(title1)
f.write(title2)

this_idx = 0

for index, value in enumerate(row_data):
    if index>3:
        f.write(str(value) + "\n")

    if index>3 and str(value) == "":
        this_idx = index
        break

f.write(end)
f.close()

f = open('lang.ctrl.ko.wprx', 'w')
f.write(title1)
f.write(title2)

for index, value in enumerate(row_data):
    if index>this_idx:
        f.write(str(value) + "\n")

    if index>this_idx and str(value) == "":
        this_idx = index
        break

f.write(end)
f.close()

f = open('lang.audit.ko.wprx', 'w')
f.write(title1)
f.write(title2)

for index, value in enumerate(row_data):
    if index>this_idx:
        f.write(str(value) + "\n")

f.write(end)
f.close()


###################################################
# X_VOLT wprx
###################################################