
/* IMPORTANT:
    Because req is a global rather than a private variable,
    only a single call to fromXML may be called at a time.
 */
var req = null;
var reqXMLObject = null;

function xmlObject()
    {
    this.name = "";
    this.value = "";
    this.children = Array();
    this.urlCallback = null;
    this.iterator = -1;
    }


xmlObject.prototype.getFirstObject = function(objectName)
    {
    for (var i = 0; i < this.children.length; i++)
        {
        if (this.children[i].name == objectName)
            {
            this.iterator = i;
            return this.children[i];
            }
        }

    this.iterator = -1;
    return null;
    }


xmlObject.prototype.getNextObject = function(objectName)
    {
    if (this.iterator == -1)
        return null;

    for (var i = this.iterator + 1; i < this.children.length; i++)
        {
        if (this.children[i].name == objectName)
            {
            this.iterator = i;
            return this.children[i];
            }
        }

    this.iterator = -1;
    return null;
    }


xmlObject.prototype.setCallback = function(newCallback)
    {
    this.urlCallback = newCallback;
    }


xmlObject.prototype.toString = function()
    {
//    alert("xmlObject.dump");
    var resultStr = xmlObjectToStringWorker(this, 0);
    return resultStr;
    }


// Convert an XML data source to an array of Objects.
xmlObject.prototype.fromXML = function(doc)
    {
//    alert("xmlObject.fromXML");
    var root = doc.documentElement;
    this.name = root.nodeName;
    if (root.hasChildNodes() && root.firstChild)
        {
        this.value = root.firstChild.nodeValue;
        xmlToObjectWorker(this, root);
        }
    else
        {
        this.value = "";
        this.children = Array();
        }
    }



// retrieve XML from a URL
xmlObject.prototype.fromURL = function(url)
    {
//    alert("fromURL: url = " + url);
    this.value = "";
    this.children = Array();

    // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest)
        {
        try
            {
            req = new XMLHttpRequest();
            }
        catch(e)
            {
            req = null;
            }

        if (req)
            {
//            req.xmlObject = this;
            reqXMLObject = this;
            req.onreadystatechange = processRequestXMLObject;
            req.open("GET", url, true);
            req.send("");
            }
        }
    // branch for IE/Windows ActiveX version
    else if (window.ActiveXObject)
        {
        try
            {
            req = new ActiveXObject("Msxml2.XMLHTTP");
            }
        catch(e)
            {
            try
                {
                req = new ActiveXObject("Microsoft.XMLHTTP");
                }
            catch(e)
                {
                req = null;
                }
            }

        if (req)
            {
//            alert("fromURL 1");
//            req.xmlObject = this; // IE 6 does not allow this.
            reqXMLObject = this;
//            alert("fromURL 2");
            req.onreadystatechange = processRequestXMLObject;
            req.open("GET", url, true);
            req.send(null);
            }
        }
    }



function processRequestXMLObject()
    {
//    alert("processRequestXMLObject working");
    if (req && req.readyState == 4 && req.status == 200)
        {
//        alert("processRequestXMLObject finished");
        var xmlDoc = req.responseXML;

//        var txtDoc = req.responseText;
//        var debugDiv = document.getElementById("debugOutput");
//        debugDiv.innerHTML = txtDoc;

        if (xmlDoc)
            {
            reqXMLObject.fromXML(xmlDoc);
            if (reqXMLObject.urlCallback)
                {
//                alert("calling reqXMLObject.urlCallback");
                reqXMLObject.urlCallback(reqXMLObject);
                }
//            req.xmlObject.fromXML(xmlDoc);
//            if (req.xmlObject.urlCallback)
//                req.xmlObject.urlCallback(req.xmlObject);
            }
        }
/*
    else if (req)
        {
        var debugOutput = "";
//        debugDiv.style.backgroundColor = "red";
        try
            {
            switch (req.readyState)
                {
                case 0:
                    debugOutput += "bad req: readyState = 'Object has not started loading data yet.'<br>";
                    break;
                case 1:
                    debugOutput += "bad req: readyState = 'Data is loading.'<br>";
                    break;
                case 2:
                    debugOutput += "bad req: readyState = 'Data is loaded, but object may be starting up.'<br>";
                    break;
                case 3:
                    debugOutput += "bad req: readyState = 'Data may not be fully loaded.'<br>";
                    break;
                case 4:
                    debugOutput += "bad req: readyState = 'Element and data are fully loaded.'<br>";
                    break;
                default:
                    debugOutput += "bad req: readyState = " + req.readyState + "<br>";
                    break;
                }

            debugOutput += "  status = " + req.status.toString();
            }
        catch(e)
            {
            debugOutput += "  Exception = '" + e.name + "'  message = '" + e.message + "'  <br>";
            }

        if (debugOutput != "")
            {
            var debugDiv = document.getElementById("debugOutput");
            debugDiv.innerHTML = debugOutput;
            }
        }
*/
    }


// Recursive!
function xmlObjectToStringWorker(parentObject, depth)
    {
    var returnStr = "";
//    for (var offset = 0; offset < depth; offset++)
//        returnStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    if (parentObject.value)
//        returnStr += parentObject.name + " : " + parentObject.value + "<br>";
        returnStr += parentObject.name + " : " + parentObject.value;
    else
//        returnStr += parentObject.name + "<br>";
        returnStr += parentObject.name;

    for (var i = 0; i < parentObject.children.length; i++)
        returnStr += xmlObjectToStringWorker(parentObject.children[i], depth + 1);

    return returnStr;
    }


// Recursive!
function xmlToObjectWorker(parentObject, nextNode)
    {
    if (nextNode.hasChildNodes())
        {
        var childNode = nextNode.childNodes;
        for (var i = 0; i < childNode.length; i++)
            {
            if (childNode[i].hasChildNodes())
                {
                var nextXMLObject = new xmlObject();
                nextXMLObject.name = childNode[i].nodeName;
                nextXMLObject.value = childNode[i].firstChild.nodeValue;
                parentObject.children[parentObject.children.length] = nextXMLObject;
                xmlToObjectWorker(nextXMLObject, childNode[i]);
                }
            }
        }
    }
