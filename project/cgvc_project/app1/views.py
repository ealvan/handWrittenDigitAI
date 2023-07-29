from django.shortcuts import render
from django.http import HttpResponse

import base64
import json
from django.http import JsonResponse

from app1.model_manager import predict,process_image

import os
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
# from .app1.utils import is_ajax en la carpeta utils debe estas is_ajax not here

def loadModel():
    path = os.path.join(settings.STATICFILES_DIRS[0],'app1','config.js')
    model = open(path)
    return model

# Create your views here.
def index(request):
    model = loadModel()
    context = {
        'message': model.read(),
    }
    return render(request, 'paint.html', context)

def login(request):
    context = {}
    return render(request, 'login.html', context)
    
def drawer(request):
    context = {}
    return render(request, 'drawer.html', context)

def newdrawer(request):
    context = {}
    return render(request, 'drawerv2.html', context)

def game(request):
    context = {}
    return render(request,'game.html', context)

@csrf_exempt
def save_image(request):
    if request.method == 'POST':
        jsonData = request.body        
        string_data = jsonData.decode('utf-8')
        json_data = json.loads(string_data)
        image_data = json_data.get("image_data",'')

        # image_data = request.POST.get('image_data', '')
        # print("*"*12,request.POST)
        # print("*"*12,type(request.body))
        if image_data:
            # Remove the base64 image header and decode the image data
            image_data = image_data.replace("data:image/png;base64,", "")
            image_data = image_data.encode()
            with open(os.path.join(settings.MEDIA_ROOT,'image.png'), 'wb') as f:
                f.write(base64.decodebytes(image_data))
            return JsonResponse({'message': 'Image saved successfully.'})
    return JsonResponse({'error': 'Invalid request.'}, status=400)

def request_img(request):
    path = settings.MEDIA_ROOT
    files = [f for f in os.listdir(path)]
    images_data = {}
    for f in files:
        with open(os.path.join(settings.MEDIA_ROOT,f),'rb') as imgfile:
            encoded_string = base64.b64encode(imgfile.read()).decode('utf-8')
            # images_data.append(encoded_string)
            images_data[f] = encoded_string
    response_data = images_data
    return JsonResponse(response_data)
    # with os.scandir(path) as it:
    #     for entry in it:
    #         if entry.is_file():
    #             files.append()

def predict_image(request):
    # Get the image data from the request, process it as needed
    path = os.path.join(settings.MEDIA_ROOT,'image.png')
    try:
        image_data = process_image(path)
        label_prediction = predict(image_data)
    except Exception as e:
        print("Error in prediction",e)
        return JsonResponse({'error': 'Invalid prediction request.'}, status=400)
        # Process the predictions or do any other required operations
        # For example, return the predictions as JSON response
    return JsonResponse({'predictions': int(label_prediction) })

#----------------------------------------------------------------------
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'