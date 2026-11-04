import base64, json, uuid
import requests
from urllib.parse import urlparse

base='http://127.0.0.1:8772'
assert urlparse(base).hostname in ('127.0.0.1','localhost')
headers={'Origin':base}
photo=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=')
payload={'requestId':str(uuid.uuid4()),'name':'Local QA Only','email':'qa@example.com','cemetery':'Example cemetery','service':'New memorial','style':'Upright memorial','message':'Local development validation, not a customer enquiry.','consent':'yes','language':'en'}
results={}
response=requests.get(base+'/review-inbox',allow_redirects=False);assert response.status_code==302;results['anonymous_inbox']='redirects to sign-in'
response=requests.get(base+'/api/quote-photos/not-a-photo');assert response.status_code==403;results['anonymous_photos']='denied'
response=requests.post(base+'/api/inquiries',data=payload,files={'photos':('test.png',photo,'image/png')},headers={'Origin':'https://wrong.example'});assert response.status_code==403;results['cross_origin']='denied'
response=requests.post(base+'/api/inquiries',data={**payload,'email':'invalid'},files={'photos':('test.png',photo,'image/png')},headers=headers);assert response.status_code==400;results['invalid_email']='rejected'
response=requests.post(base+'/api/inquiries',data=payload,files={'photos':('fake.png',b'not a PNG','image/png')},headers=headers);assert response.status_code==400;results['spoofed_photo']='rejected'
response=requests.post(base+'/api/inquiries',data=payload,files={'photos':('test.png',photo,'image/png')},headers=headers);assert response.status_code==201,response.text
saved=response.json();assert saved['photoCount']==1;results['enquiry_with_photo']='saved'
response=requests.post(base+'/api/inquiries',data=payload,files={'photos':('test.png',photo,'image/png')},headers=headers);assert response.status_code==200 and response.json()['reference']==saved['reference'];results['idempotent_retry']='same reference, no duplicate'
session=requests.Session();response=session.get(base+'/signin-with-chatgpt?return_to=/review-inbox');assert response.status_code==200 and 'Local QA Only' in response.text,response.text[:300]
results['local_admin_inbox']='authenticated review works'
import re
photo_path=re.search(r'href="(/api/quote-photos/[^\"]+)"',response.text).group(1)
response=session.get(base+photo_path);assert response.status_code==200 and response.headers['Content-Type']=='image/png';results['admin_photo']='retrieved'
response=requests.get(base+photo_path);assert response.status_code==403;results['saved_photo_anonymous']='denied'
response=session.post(base+'/api/inquiries/'+saved['reference']+'/status',data={'status':'reviewing'},headers=headers,allow_redirects=False);assert response.status_code==303;results['status_update']='saved'
print(json.dumps(results,indent=2))
