import { xmlToJSON } from "../Util/xmlToJson";

export function loadXML<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    //similiar to json except we convert the object
    const request = new XMLHttpRequest();
    request.open('GET', url);
    
    request.overrideMimeType("text/xml")
    
    request.onreadystatechange = () => {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        resolve(xmlToJSON(request.responseXML));
      }
    };
    
    request.send();
  });
}
