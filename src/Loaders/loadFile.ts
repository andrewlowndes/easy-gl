export function loadFile(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    
    request.overrideMimeType("text/plain")
    
    request.onreadystatechange = () => {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        resolve(request.responseText);
      }
    };
    
    request.send();
  });
}