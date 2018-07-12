export function xmlToJSON(xml: Node): any {
  if (xml.hasChildNodes()) {
    let allTextChildren = xml.childNodes.length === 1 && xml.childNodes.item(0).nodeType === Node.TEXT_NODE;
    
    if (allTextChildren) {
      let obj: Record<string, any> = {};
      
      for(let i=0; i<xml.childNodes.length; i++) {
        let item = xml.childNodes.item(i);
        
        obj[item.nodeName] = item.nodeValue;
      }
      
      return obj;
    }
    
    let elementChildNodes = [];
    
    for(let i=0; i<xml.childNodes.length; i++) {
      let item = xml.childNodes.item(i);
      
      if (item.nodeType === Node.ELEMENT_NODE) {
        elementChildNodes.push(item);
      }
    }
    
    let allSameChildTag = true,
      commonNodeName = elementChildNodes[0].nodeName;
    
    for(let i=1; i<elementChildNodes.length; i++) {
      let item = elementChildNodes[i];
      
      if (item.nodeName !== commonNodeName) {
        allSameChildTag = false;
        break;
      }
    }
    
    if (xml.childNodes.length > 1 && allSameChildTag) {
      let arr: Array<any> = [];
    
      for(var i=0; i<elementChildNodes.length; i++) {
        let item = elementChildNodes[i]; 
        arr.push(xmlToJSON(item));
      }
  
      return arr;
    }
    
    let obj: Record<string, any> = {};
    
    for(var i=0; i<elementChildNodes.length; i++) {
      let item = elementChildNodes[i];
      
      let nodeName: string = item.nodeName;
      
      if (nodeName in obj) {
        if (!Array.isArray(obj[nodeName].push)) {
          obj[nodeName] = [obj[nodeName]];
        }
        
        obj[nodeName].push(xmlToJSON(item));
      } else {
        obj[nodeName] = xmlToJSON(item);
      }
    }
  
    return obj;
  }
  
  if (xml.nodeType === Node.ELEMENT_NODE) {
    let obj: Record<string, any> = {};
    
    for (let i=0; i<(xml as HTMLElement).attributes.length; i++) {
      let attr = (xml as HTMLElement).attributes.item(i);

      obj[attr.nodeName] = attr.nodeValue;
    }
    
    return obj;
  }
  
  return xml.nodeValue;
}
