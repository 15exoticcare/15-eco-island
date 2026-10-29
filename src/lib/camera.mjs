export function zoomAt(camera,factor,x,y){
 const scale=Math.max(.1,Math.min(2.8,camera.scale*factor));
 return {scale,x:x-(x-camera.x)*scale/camera.scale,y:y-(y-camera.y)*scale/camera.scale};
}
