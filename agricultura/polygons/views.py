#-*-encoding:utf-8-*-

# imports
import json
import urllib2

# django
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.db import connections
from django.http import HttpResponse


"""
    método principal en donde desplegamos el HTML que nos propocionó sentinelHub 
    (se hicieron las modificaciones pertinentes para poder tener los wms como capa base de opciones)
"""
def index(request):
    return render_to_response('sentinel_hub.html', context_instance=RequestContext(request))


"""
    método vía ajax en donde buscaremos el área que el usuario ingrese,
    en el cliente se valida que el área sea un valor numerico 
"""
def search_area(request):
    if request.is_ajax():
        # se obtiene el parametro que regresa el request vía GET
        area = request.GET['area']
        # se define la capa a consultar
        layer = 'poligonos_agricultura'
        # se prepara la conección a la base de datos
        cur = connections['datastore'].cursor()
        # armamos el query, para traer el geojson del área seleccionada
        sql = 'SELECT ST_AsGeoJSON(the_geom), area, descr_31 FROM "%s" WHERE area =' % layer \
              + "'%s'" % area

        common_geom = []
        try:
            # se ejecuta la consulta en un try por si algo sale mal
            cur.execute(sql)
            common_geom = cur.fetchall()
        except Exception as e:
            print e

        corn_features = []
        for r in common_geom:
            # convertimos nuestro json en un diccionario python para poder obtener el primer row de la consulta
            obj = json.loads(r[0])
            # sí hay más de un poligono esto significa que es un multipolygon
            if len(obj['coordinates']) > 1:
                feat = {"type": "Feature", "geometry": {"type": "MultiPolygon", "coordinates": obj['coordinates']},
                        "properties": {"area": r[1], "description": r[2]}}
            else:
                # si no, sólo es un poligono
                feat = {"type": "Feature", "geometry": {"type": "Polygon", "coordinates": obj['coordinates'][0]},
                        "properties": {"area": r[1], "description": r[2]}}
            # se agrega en una lista por los posibles multipoligonos
            corn_features.append(feat)
        common_geojson = {"type": "FeatureCollection", "features": corn_features}

        return HttpResponse(json.dumps(common_geojson), mimetype="application/json")
    else:
        return HttpResponse("Not ajax request")


"""
    método vía ajax en donde obtenemos los atribustos de la capa seleccionada,
"""
def get_featureinfo(request):
    if request.is_ajax():
        typename = request.POST['layername']
        print(typename)

        return HttpResponse(json.dumps(typename), mimetype="application/json")
    else:
        return HttpResponse("Not ajax request")
