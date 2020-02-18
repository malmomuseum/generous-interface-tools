import json
import math
import re
import shelve
from itertools import islice

import requests

import dataskakare.data_transformation as transformation


class ItemStorage():
    def __init__(self, item_type, provider, item):
        self.item = item
        self.provider = provider
        self.type = item_type

# K-samsök supports JOSN if given the following Accept header
headers = {
    'Accept': 'application/json'
}

# We will work with two of K-samsöks methods search/fields for getting data
# and statisticSearch for automatic statistics
endpoint = 'http://www.kulturarvsdata.se/ksamsok/api'
endpoint_fields = '{}?&x-api=test&method=search&hitsPerPage=500&recordSchema=xml'.format(endpoint)
endpoint_facet = '{}?&x-api=test&method=statisticSearch&removeBelow=1'.format(endpoint)

# K-samsök uses the query language CQL
# it allows you to create very advanced queries
# https://www.loc.gov/standards/sru/cql/
    
# K-samsök has a lot of fields that you can query:
# https://www.raa.se/hitta-information/k-samsok/att-anvanda-k-samsok/index-for-statistic-facet/
# https://www.raa.se/hitta-information/k-samsok/att-anvanda-k-samsok/ytterligare-index-for-sok/
    
# Lets ask K-samsök for photos with images (thumbnails) which were taken before 1890
query = 'serviceOrganization="mm" AND itemType="objekt/föremål" AND text=verktyg AND thumbnailExists=j'

# Byt thumbnail mot low resolution source när Albin säger till
# Lets also specify which fields we want to recive
fields = 'itemLabel,fromTime,lowresSource,itemKeyWord,url'

# the following is a generator
# a generator is similar to a function
# but insead of returning something once
# it returns mulityply things which you can loop over
# this particular generator uses K-samsöks methods search/fields to recive data
# you can resuse this generator in you own projects
def search_field_generator(query, fields):
    # initial query to know how many results we get
    query_url = '{}&query={}&fields={}&startRecord='.format(endpoint_fields, query, fields)
    r = requests.get(query_url, headers=headers)
    json = r.json()

    # K-samsök only returns 500 results in a single request
    # therefor we need to use the total number of results
    # to calculate the number of request we could potentially need to do
    total_results = json['result']['totalHits']
    required_n_requests = math.ceil(total_results / 500)

    # now we can start querying while keeping track of where in the results we are
    count = 0
    while required_n_requests > count:
        start_record = count * 500
        count += 1

        r = requests.get(query_url + str(start_record), headers=headers)
        response_data = r.json()

        for record in response_data['result']['records']['record']:
            # sometimes there are empty records and those has no fields :-(
            if not len(record) == 2:
                continue
                
            item_to_yield = {}
            
            # some fields can appear multiply times
            # therefor we need to merge those to lists if needed
            for field in record['field']:
                # if the field is already a list 
                if isinstance(item_to_yield.get(field['name'], False), list):
                    item_to_yield[field['name']].append(field['content'])
                # if it's not yet a list but we found the same field name/key again
                elif item_to_yield.get(field['name'], False):
                    item_to_yield[field['name']] = list([item_to_yield[field['name']], field['content']])
                # default to just a regular value
                else:
                    item_to_yield[field['name']] = field['content']

            yield item_to_yield





# START
# byt thumbnail till lower resolution source när Albin säger till


print('This might take a while...')

final_items = list()
for item in search_field_generator(query, fields):
    processed_item = dict()


    if not 'itemKeyWord' in item:
        continue
    if not 'fromTime' in item:
        continue
    if isinstance(item['itemKeyWord'], str):
        item['itemKeyWord'] = list([item['itemKeyWord']])
    if isinstance(item['fromTime'], int):
        item['fromTime'] = list([item['fromTime']])


    processed_item['url'] = item['url']
    processed_item['rights'] = 'hej123'
    processed_item['time'] = item['fromTime']
    processed_item['title'] = item['itemLabel']
    processed_item['provider'] = 'malmö museer'
    processed_item['image'] = item['lowresSource']
    processed_item['labels'] = item['itemKeyWord']


    final_items.append(processed_item)

with open('data.json', 'w') as outfile:
    json.dump(final_items, outfile)
