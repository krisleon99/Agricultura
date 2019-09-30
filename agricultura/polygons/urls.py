from django.conf.urls import patterns, url

from agricultura.polygons import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^search_area/$', 'search_area', name='search_area'),
    url(r'^get_featureinfo/?$', 'get_featureinfo', name='get_featureinfo'),
)
