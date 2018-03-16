jsPlumb.ready(function () {

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        //DragOptions: { cursor: 'pointer', zIndex: 2000 },
        Endpoint: ["Dot", {radius: 1}],
        //Connector:"StateMachine",
        //HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2 },
        ConnectionOverlays: [
            // [ "Arrow", {
            //     location: 1,
            //     id: "arrow",
            //     width: 14,
            //     length: 14,
            //     foldback: 0.8
            // }],
            //[ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
        ],
        Container: "sl-connector"
    });

    instance.registerConnectionType("sl-basic", {
        anchor: "Continuous",
        connector: "Flowchart"
    });

    window.jsp = instance;

    var canvas = document.getElementById("sl-connector");

    var sl_nodes = jsPlumb.getSelector("#sl-connector .sl-node");
    var sl_tubes = jsPlumb.getSelector("#sl-connector .sl-tube");
    var sl_cores = jsPlumb.getSelector("#sl-connector .sl-core");

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: instance.bind("click", instance.deleteConnection), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        if (c.sourceId.includes('core-')) {
            instance.deleteConnection(c);
        }
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
        // console.log('connection:', info.connection.id)
        // info.connection.getOverlay("label").setLabel(info.connection.id);
    });

    // bind a double click listener to "canvas"; add new node when this occurs.
    // jsPlumb.on(canvas, "dblclick", function(e) {
    //     newNode(e.offsetX, e.offsetY);
    // });


    function parseURLParams (url) {
        url = url || location.search.substr(1);
        return decodeURIComponent(url).split('&').reduce((function(result, pair) {
          var t = pair.split('=');
          result[t[0]] = t[1];
          return result;
        }), {});
    };

    function initSelect (e) {
        var select = document.getElementById("connection_type");
        var params = parseURLParams();
        if (params.connection_type) {
            select.value = params.connection_type;
        }
        select.addEventListener("change", function(e) {
            document.getElementById("sl-options-form").submit();
        });
    }
    initSelect();

    function getConnectorType () {
        return jsPlumb.getSelector('#connection_type')[0].value;
    }


    function _connectorStyle(el) {
        var types = {
            cable: { strokeWidth: 6 },
            tube: { strokeWidth: 16 },
            core: { strokeWidth: 6 }
        }
        var options = {};
        if (el.style.backgroundColor) {
            options.color = el.style.backgroundColor;
        }
        var _options = Object.assign({}, types[el.dataset.type] || {}, options);

        return {
            stroke: _options.color,
            strokeWidth: _options.strokeWidth,
            outlineStroke: '#FFF',
            outlineWidth: 1
        };
    }


    function _makeTarget (el) {
        var connectorStyle;
        if (el.dataset.type == 'tube' || el.dataset.type == 'core') {
            connectorStyle = _connectorStyle(el);
        }

        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "ContinuousLeft",
            connectorStyle: connectorStyle,
            allowLoopback: false
        });
    }


    function _makeSource (el) {
        var connectorStyle;
        var connectorName = 'Flowchart';
        if (el.dataset.type == 'core') {
            connectorStyle = _connectorStyle(el);
            connectorName = getConnectorType(); // Straight
        }

        instance.makeSource(el, {
            //filter: ".ep",
            anchor: "ContinuousRight",
            connector: [ connectorName, {
                //stub: [20, 40],
                gap: -4,
                cornerRadius: 1,
                //alwaysRespectStubs: true
            } ],
            connectorStyle: connectorStyle,
            //connectionType: "sl-basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: 1,
            onMaxConnections: function (info, e) {
                console.error("Maximum connections (" + info.maxConnections + ") reached");
            }
        });
    }



    //
    // initialise element as connection targets and source.
    //
    var initNode = function(el) {

        // initialise draggable elements.
        //instance.draggable(el);

        _makeSource(el);

        _makeTarget(el);

        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
    };

    var newNode = function(x, y) {
        var d = document.createElement("div");
        var id = jsPlumbUtil.uuid();
        d.className = "w";
        d.id = id;
        d.innerHTML = id.substring(0, 7) + "<div class=\"ep\"></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        return d;
    };

    // suspend drawing and initialise.
    instance.batch(function () {
        for (var i = 0; i < sl_nodes.length; i++) {
            initNode(sl_nodes[i], true);
        }

        // and finally, make a few connections
        // instance.connect({
        //     source: "cable-1",
        //     target: "tube-1",
        //     //anchor: "ContinuousRight", //faces 
        //     connector: "Flowchart",
        //     paintStyle: {
        //         strokeWidth: 10,
        //         stroke: '#4600FF'
        //     }
        // });

        instance.connect({ source: "cable-1", target: "tube-1"  });
        instance.connect({ source: "cable-1", target: "tube-2"  });
        instance.connect({ source: "cable-1", target: "tube-3" });

        instance.connect({ source: "tube-1", target: "core-11"  });
        instance.connect({ source: "tube-1", target: "core-12"  });
        instance.connect({ source: "tube-1", target: "core-13"  });
        instance.connect({ source: "tube-1", target: "core-14"  });
        instance.connect({ source: "tube-1", target: "core-15"  });
        instance.connect({ source: "tube-1", target: "core-16"  });
        instance.connect({ source: "tube-1", target: "core-17"  });
        instance.connect({ source: "tube-1", target: "core-18"  });

        instance.connect({ source: "tube-2", target: "core-21"  });
        instance.connect({ source: "tube-2", target: "core-22"  });
        instance.connect({ source: "tube-2", target: "core-23"  });
        instance.connect({ source: "tube-2", target: "core-24"  });

        instance.connect({ source: "tube-3", target: "core-31"  });
        instance.connect({ source: "tube-3", target: "core-32"  });
        instance.connect({ source: "tube-3", target: "core-33"  });
        instance.connect({ source: "tube-3", target: "core-34"  });
        instance.connect({ source: "tube-3", target: "core-35"  });
        instance.connect({ source: "tube-3", target: "core-36"  });

    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);

});
