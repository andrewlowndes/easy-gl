# Easy GL
Various helper functions to perform WebGL operations.

> WARNING: API in flux and liable to change until v1 release

## Included functions

### Animation
createRenderer

### Controls
freenavControls,
orbitControls

### Interfaces
Buffer,
ElementBuffer,
Framebuffer,
Group,
Material,
Obj,
ObjBuffers,
Renderer,
ShaderAttribute,
ShaderProgram,
ShaderUniform,
Texture,
Triangle,
TypedArray

### Loaders
loadFile,
loadJSON,
loadMtl,
loadObj,
loadProgram,
loadTexture,
loadXML

### Util
poseToMatrix,
convertTrianglesToBufferArrays,
dirname,
framebufferToImage,
isPowerOf2,
mergeObjBuffers,
xmlToJSON

### WebGL
createBuffer,
createContext,
createElementBuffer,
createFramebuffer,
createProgram,
createTexture,
generateMipmap

## Using in node
Install via `npm install apl-easy-gl`, then import via ES6 Modules:
```typescript
import { windingOrder } from 'apl-easy-gl';
```

## Using in the browser
Add the script tag below or download it an bundle it with your own scripts.
```html
<script src="http://unpkg.com/apl-easy-2d/lib/apl-easy-gl.min.js"></script>
```

If you need to use a function that requires the 3rd-party library and have not included them separetely then include the umd which comes bundled with all dependencies.

```html
<script src="http://unpkg.com/apl-easy-2d/lib/apl-easy-gl.umd.js"></script>
```

## Roadmap
- Add unit tests to all functions
- Generate full API docs from type definitions
- Add more helper functions including WebVR setup

## Licence
All code is licenced under MIT.
