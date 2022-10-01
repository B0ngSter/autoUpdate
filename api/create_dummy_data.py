# This script would create debug data in the database to try out things in initial phase of project.
# Be very sure that it is being maintained if you use it at a later stage in the project
import os
shoppers_info_file = "dummy_data/shoppers.csv"
relationships_info_file = "dummy_data/relationships.csv"
products_info_file = "dummy_data/products.csv"
runtasks = True # Make false if you dont want to run tasks , wont create AI side data if you keep this false

import pandas as pd
import numpy as np
import math
import requests
import json
import random
import datetime

deployment_url = "http://localhost:4040"

if runtasks:
	from dagster import execute_pipeline
	import datetime

def dropna(somedict):
	returndict = {}
	for k,v in somedict.items():
		if v is np.NaN or v is math.nan:
			returndict[k] = None
		else:
			if 'id' in k or v == "max_quantity":
				if np.isnan(v):
					v = None
				else:
					v = int(v)
			returndict[k] = v
	return returndict
	
def create_shopping_json_and_discount_json(itemid2details):
	"""
	class OneCartItemDatatype(BaseModel):
		item_id : int
		quantity: int
		unit_price : float
		final_price: float
		discount: Optional[float]
		discountReason: Optional[str]

	class OneShoppingItemDatatype(BaseModel):
		customer_input_picurl: Optional[str]  # Pic might be absent if they search by text or speech or barcode
		customer_input_barcode: Optional[str]  # Will contain data if customer searches by barcode
		customer_input_text: Optional[str]  # Will contain data if customer searches by txtstring
		customer_input_speechurl: Optional[str]  # Will contain data if customer searches by speech
		ai_outputs_item_ids: List[int]  # In case of text search there will be just one item in this
		final_chosen: Union[OneCartItemDatatype, RareItemDatatype]


	class ShoppingVisitItemsDatatype(BaseModel):
		shopping_cart: List[OneShoppingItemDatatype]

	"""	
	
	"""
	class DiscountCalcNeedDataIn(BaseModel):
		inventory_id : int 
		catalog_id : Optional[int]
		quantity : int

	class DiscountCalculationDataIn(BaseModel):
		user_id : int 
		visit_id : int
		member_id : int
		vendor_discount : float
		items : List[DiscountCalcNeedDataIn]
	"""
	number_items = random.choice(range(3,20))
	items_in_visit = random.sample(itemid2details.items(),number_items)
	ds1 = [] # ShoppingJSON's shopping_cart
	ds2 = [] # DiscountCalculationDataIn's items
	total_pre_discount = 0.
	for item in items_in_visit:
		quantity = random.choice(range(3,7))
		inventory_id = item[0]
		catalog_id = item[1]["catalog_id"]
		unit_price = item[1]["unit_price"]
		discount = random.uniform(0.4,3.5)
		total_pre_discount += discount
		final_price = unit_price - discount
		ds1.append({"customer_input_picurl":None,"customer_input_barcode":None,"customer_input_text":None,"customer_input_speechurl":None,"ai_outputs_item_ids":[],"final_chosen":{"item_id":inventory_id, "unit_price":unit_price, "quantity":quantity, "discount_reason":None, "discount":discount, "final_price" : final_price }})
		ds2.append({"inventory_id":inventory_id,"catalog_id":catalog_id,"quantity":quantity})
	return {"shopping_cart":ds1},ds2,total_pre_discount

if __name__=="__main__":
	shoppers_df = pd.read_csv(shoppers_info_file,encoding="latin_1",dtype={"phone_number":str})
	relationships_df = pd.read_csv(relationships_info_file,encoding="latin_1",dtype={"shopper_number":str})
	products_df = pd.read_csv(products_info_file,encoding="latin_1")
 
	response = requests.get(deployment_url+"/getShopEmplyeeDetails")
	shop_data = response.json()
	print(shop_data)
 
	userphone2id = {}
	username2id = {}
	for usernum,userdata in shoppers_df.iterrows():
		userdict = dropna(dict(userdata))
		userdict["phone_number"] = str(userdict["phone_number"])
		userjson = json.dumps(userdict)
		print("adding user: ",userjson)
		response = requests.post(deployment_url+"/checkIfCustomerExistsOrCreateNewCustomer",data={"phone_number": str(userdict["phone_number"])})
		responsejson = response.json()
		print(responsejson)
		response1 = requests.post(deployment_url+ "/setConsumerNameForKhataUsers", data={"phoneNumber": str(userdict["phone_number"]), "consumerName": userdict["name"]})
		responsejson1 = response1.json()
		print(responsejson1)
		userphone2id[userdict["phone_number"]] = responsejson["shopper_id"]
		username2id[userdict["name"]] = responsejson["shopper_id"]
	
	'''Write code for adding shop here then shop employees and relationships after application of node persist.'''
 
	relationship_ids = []
	relationship_map = {}
	for relationshipnum, relationshipdata in relationships_df.iterrows():
		relationshipdict = dropna(dict(relationshipdata))
		shop_id = shop_data["shop_id"]
		shopper_id = userphone2id[ str(relationshipdict["shopper_number"]) ]
		del relationshipdict["shop_name"]
		del relationshipdict["shopper_number"]
		senddict = {"shop_id":int(shop_data["shop_id"]), "shopper_id":int(shopper_id), "relationship_data":relationshipdict}
		relationshipjson = json.dumps(senddict)
		print("Starting Relationships............")
		response = requests.post(deployment_url+"/createOrRetrieveRelationship", json=senddict)
		print(response.status_code)
		responsejson = response.json()
		print(responsejson)
		relationship_ids.append([responsejson["relationship_id"],shopper_id])
		relationship_map[(shopper_id,shop_id)] = responsejson["relationship_id"]
	#"""	
	itemname2id = {}
	itemname2picpath = {}
	itemid2details = {}
	itemIDs = []
	for productnum,productdata in products_df.iterrows():
		productdict = dropna(dict(productdata))
		filename = productdict['picfile']
		
		productdict["picurl"] = ""
		product_cat_dict = {}
		product_cat_dict["subcategory"] = productdict["subcategory"]
		product_cat_dict["subsubcategory"] = productdict["subsubcategory"]
		product_cat_dict["essential_item"] = productdict["essential_item"]
		del productdict["subcategory"]
		del productdict["subsubcategory"]
		del productdict["essential_item"]
		print("product addition...............")
		productdict["selling_price"] = productdict["unit_price"] - productdict["discount"]
		if productdict["barcode"] == None:
			productdict["barcode"] = ""
		if product_cat_dict["subcategory"] == None:
			product_cat_dict["subcategory"] = ""
		if product_cat_dict["subsubcategory"] == None:
			product_cat_dict["subsubcategory"] = ""
		if productdict["selling_price"] < 0:
			productdict["selling_price"] = 0
		req_data = {"product_data": productdict, "product_categorization": product_cat_dict}
		print(req_data)
		productjson = json.dumps(req_data)
		response = requests.post(deployment_url+"/addInventoryItemWithCategorizationForBarcodeBilling",json=req_data,params={"employeeID":shop_data["employee_id"], "shopID": shop_data["shop_id"]})
		responsejson = response.json()
		print(responsejson)
		item_id = responsejson['item_id']
		itemIDs.append(item_id)
		itemname2id[responsejson['product_data']['name']] =  responsejson['item_id']
		itemname2picpath[responsejson['product_data']['name']] = responsejson['product_data']['picurl']
		itemid2details[responsejson['item_id']] = {"unit_price":responsejson['product_data']['unit_price'],"catalog_id":None}

	numvisits = 50
	visitsdata = []
	for visitnum in range(numvisits):
		visitdata = create_shopping_json_and_discount_json(itemid2details)
		visitsdata.append([visitdata,False])
	blankvisits = 10
	for _ in range(blankvisits):
		visitsdata.append([({},[],0.0),True])
	
	random.shuffle(visitsdata)	
	visit_type_dict = {}
	visitIDs = []
	for visitnum in range(numvisits):
		visitdata = visitsdata[visitnum][0]
		hasnodata = visitsdata[visitnum][1]
		[relation_to_use, shopper] = random.choice(relationship_ids)
		print("VisitData :: ",visitdata)
		live_order = True
		visitdict = {"relationship_id": relation_to_use, "visit": { "shopping_json": visitdata[0], "discarded": hasnodata, "shop_employee_driven_btc": live_order, "shop_employee_driven_btc_scan_completed": False}}
		advanced_order_type = "NA"
		
		visitjson = json.dumps(visitdict)
		response = requests.post(deployment_url+"/createVisit",json=visitdict)
		responsejson = response.json()
		visit_id = responsejson["visit_id"]
		visit_type_dict[visit_id] = advanced_order_type
		print(responsejson)
		if not hasnodata:
			print(visitdata[0])
			employee_id = shop_data["employee_id"]
			updateshopdict = { "shopping_json": visitdata[0]['shopping_cart'], "discarded": hasnodata, "shop_employee_driven_btc": live_order, "shop_employee_driven_btc_scan_completed": True, "advanced_order_type":advanced_order_type, "employee_id":employee_id}
			updateshopjson = json.dumps(updateshopdict)
			print(updateshopjson)
			resp1 = requests.post(deployment_url+"/updateVisit/%d"%visit_id,json=updateshopdict)
			resp1json = resp1.json()
			print(resp1json)
			payment_id = resp1json["visit_info"][0]["payment_id"]
			visitIDs.append((visit_id, payment_id))
			
		if hasnodata:
			continue

	random.shuffle(visitIDs)
	payment_sucess_visitIDs = visitIDs[:3*len(visitIDs)//4]
	payment_failed_visitIDs = visitIDs[3*len(visitIDs)//4:]
	for (visitID, paymentID) in payment_sucess_visitIDs:
		request_data = {
			"payment_id": paymentID,
			"timestamp": "1659528332870",
			"success": True,
			"mode": "CASH",
			"visit_id": visitID
		}
		response = requests.post(deployment_url+"/notifyPaymentStatus", json=request_data)
		print(response.json())

	for (visitID, paymentID) in payment_failed_visitIDs:
		request_data = {
			"payment_id": paymentID,
			"timestamp": "1659528332870",
			"success": False,
			"mode": "CASH",
			"visit_id": visitID
		}
		response = requests.post(deployment_url+"/notifyPaymentStatus", json=request_data)
		print(response.json())
		
	request_data_arr = []
	for itemId in itemIDs:
		gst_rate = random.choice([0, 5, 10, 18, 28])
		request_signle_data = {
			"shop_id": shop_data["shop_id"],
			"grn_data": {
				"hsn_code": "HSN"+str(random.randint(10000, 50000)),
				"purchase_rate": random.randint(50, 200),
				"sgst_rate": gst_rate/2,
				"cgst_rate": gst_rate/2,
				"inventory_item_id": itemId
			}
		}
		request_data_arr.append(request_signle_data)
	response = requests.post(deployment_url+"/createHSNEntries", json=request_data_arr)
	responseJson = response.json()
	print(responseJson)
	print("Completed")