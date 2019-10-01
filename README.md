# Agricultura, Áreas de control.

## Visualización de polígonos de agricultura en la zona sur de veracruz, con mapa base de sentinel-hub de la República Mexicana.

##### En esta app se encuentra el código para visualizar un archivo shapefile como una capa que se puede prender y apagar.

##### Y al mismo tiempo se obtiene los mapas base de sentinel-hub del año 2018 para vegetación, color falso del territorio de México.

##### Se programó en Pyhon/Django y se utilizaron wms para obtener los mapas base para sentinel-hub.


Se puede ver la app en este servidor:
------

[AgriculturaApp](http://adesur.centrogeo.org.mx/hd/sentinel_hub/)
======



Se puede ver el manual para usar la app:
------

[Manual técnico para uso de la aplicación Agricultura](https://docs.google.com/document/d/10VbrN08x1xuQJngsE47tgaCYx55x-zUsx_8OfErFPsQ/edit?usp=sharing/)
======

App: 
![agricultura][logo]

[logo]: https://github.com/krisleon99/portfolio/blob/master/img/dummies/agriculture.png "Logo Title Text 2"


 
Esta app se desarrollo en django, tiene la estructura MVC.

> En la carpeta agricultura se encuentra la app polygons, en dónde se encuentra la lógica de la aplicación

1. Views
* index
> Método principal para renderizar el template sentinel_hub.html en dónde contiene los wms base que de sentinelhub de la República  Mexicana del año 2018

- search_area
> Método vía ajax en donde buscaremos el área que el usuario ingrese, en el cliente se valida que el área sea un valor numérico

Se utilizó *postgres* y la extensión *postgis* para la base de datos, se hizo un query que retorna la geometría de la capa con un método de postgis `ST_AsGeoJSON`

+ get_featureinfo
> Método vía ajax en donde obtenemos los atributos de la capa seleccionada,

 *Nota:* No se cuenta con modelos por los datos consultados se hacen vía wms, y consultas con `psycopg2`
 
2. Templates
* sentinel_hub.html
> HTML principal que contiene la visualización del mapa de poligonos de agricultura
