<script type="text/javascript">
// var customOptions =
//         {
//         'className' : 'results-censo2010',
//         'className' : 'click-census-analysis'
//         }
L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on('click', this.getFeatureInfo, this);
  },

  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfo, this);
  },

  getFeatureInfo: function (evt) {
    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
        showResults = L.Util.bind(this.showGetFeatureInfo, this);
    var layername = this.wmsParams.layers;
    showResults(evt.latlng, layername, url);
  },

  getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
        size = this._map.getSize(),

        params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: this.wmsParams.styles,
          transparent: this.wmsParams.transparent,
          version: this.wmsParams.version,
          format: this.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: this.wmsParams.layers,
          query_layers: this.wmsParams.layers,
          info_format: 'application/json'
        };

    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

    return this._url + L.Util.getParamString(params, this._url, true);
  },

  showGetFeatureInfo: function (latlng, layername, url) {
    var pcontent = '';
    var e = this;

    $.ajax({
        url: '{% url "get_featureinfo" %}',
        type: 'POST',
        data: {'layername':layername,
               'url': url,
               csrfmiddlewaretoken: '{{ csrf_token }}'
              },
        dataType: 'json',
        success: function(data) {
            // var census = new ContantsCensus();
            var jdata = data.properties;
            var desc = data.attr_desc;
            pcontent += '<table class="table table-hover table-striped table-bordered table-condensed"><thead><tr><th>Atributo</th><th>Valor</th></tr></thead><tbody>'
            if(!jQuery.isEmptyObject(desc)){
            //   if (census.getConstants()) {
            //     $.each(jdata, function(key, value){
            //         if(value==null){
            //             value='';
            //         }
            //         if(!isNaN(value)){
            //             if(value.toString().indexOf('.') != -1){
            //                 var arr = value.toString().split('.');
            //                 var trunc = arr[1].substring(0, 2);
            //                 pcontent += '<tr><td>'+desc[key]+'</td><td>'+arr[0]+'.'+trunc+'</td>';
            //             } else{
            //                 pcontent += '<tr><td>'+desc[key]+'</td><td>'+value+'</td>';
            //             }
            //         } else {
            //             pcontent += '<tr><td>'+desc[key]+'</td><td>'+value+'</td>';
            //         }
            //     });
            //     var container = $('<div />');
            // container.on('click', 'div.click-census-analysis', function() {
            //   if (typeof($(".layer-selected").attr('id')) != "undefined") {
            //         var swt_id = $(".layer-selected").attr('id').slice(1);
            //         var lay_id = $("#"+swt_id).attr('data-regid');
            //         if (typeof(lay_id) != "undefined") {
            //            census.getResultsCensus(jdata,lay_id);
            //         }
            //     }
            //    });
            // pcontent += '<tr><td class="click-census-analysis" style="background-color: #97bd3d; color: #FFFFFF;">Analisis para el objeto seleccionado</td><td class="click-census-analysis" style="background-color: #97bd3d; color: #FFFFFF; cursor: pointer;"><div class="click-census-analysis"><i class="fa fa-pagelines fa-2x" title="Analisis para el objeto seleccionado"></i></div></td></tr>';
            // pcontent += '</tbody></table>';
            // container.html(pcontent);
            // L.popup()
            //   .setLatLng(latlng)
            //   .setContent(container[0], customOptions)
            //   .openOn(e._map);
            //   }else{
                $.each(jdata, function(key, value){
                    if(value==null){
                        value='';
                    }
                    if(!isNaN(value)){
                        if(value.toString().indexOf('.') != -1){
                            var arr = value.toString().split('.');
                            var trunc = arr[1].substring(0, 2);
                            pcontent += '<tr><td>'+desc[key]+'</td><td>'+arr[0]+'.'+trunc+'</td>';
                        } else{
                            pcontent += '<tr><td>'+desc[key]+'</td><td>'+value+'</td>';
                        }
                    } else {
                        pcontent += '<tr><td>'+desc[key]+'</td><td>'+value+'</td>';
                    }
                });
                  pcontent += '</tbody></table>'
                  L.popup()
                  .setLatLng(latlng)
                  .setContent(pcontent)
                  .openOn(e._map);
            //  }

            }
            else{
                $.each(jdata, function(key, value){
                    //pcontent += '<div><b>'+key+'</b> = '+value+'<br></div>';
                    pcontent += '<tr><td>'+key+'</td><td>'+value+'</td>';
                });
                pcontent += '</tbody></table>'
                L.popup()
                  .setLatLng(latlng)
                  .setContent(pcontent)
                  .openOn(e._map);
                }
        },
        error: function() {
            console.log('There is an error in the response');
        }
    });
  }
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);
};
</script>
