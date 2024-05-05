import { Object3D, Plane, Vector2, Vector3 } from 'three';
const planeHelper = new Plane();
const vectorHelper = new Vector3();
const sides = [
    //left
    new Plane().setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), new Vector3(-0.5, 0, 0)),
    //right
    new Plane().setFromNormalAndCoplanarPoint(new Vector3(-1, 0, 0), new Vector3(0.5, 0, 0)),
    //bottom
    new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3(0, -0.5, 0)),
    //top
    new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, -1, 0), new Vector3(0, 0.5, 0)),
];
const distancesHelper = [0, 0, 0, 0];
export function makePanelRaycast(mesh) {
    return (raycaster, intersects) => {
        const matrixWorld = mesh.matrixWorld;
        planeHelper.constant = 0;
        planeHelper.normal.set(0, 0, 1);
        planeHelper.applyMatrix4(matrixWorld);
        if (planeHelper.distanceToPoint(raycaster.ray.origin) <= 0 ||
            raycaster.ray.intersectPlane(planeHelper, vectorHelper) == null) {
            return;
        }
        const normal = planeHelper.normal.clone();
        for (let i = 0; i < 4; i++) {
            const side = sides[i];
            planeHelper.copy(side).applyMatrix4(matrixWorld);
            if ((distancesHelper[i] = planeHelper.distanceToPoint(vectorHelper)) < 0) {
                return;
            }
        }
        intersects.push({
            distance: vectorHelper.distanceTo(raycaster.ray.origin),
            object: mesh,
            point: vectorHelper.clone(),
            uv: new Vector2(distancesHelper[0] / (distancesHelper[0] + distancesHelper[1]), distancesHelper[3] / (distancesHelper[2] + distancesHelper[3])),
            normal,
        });
    };
}
export function makeClippedRaycast(mesh, fn, rootObject, clippingRect, orderInfo) {
    return (raycaster, intersects) => {
        const obj = rootObject instanceof Object3D ? rootObject : rootObject.current;
        if (obj == null || orderInfo.value == null) {
            return;
        }
        const { majorIndex, minorIndex, elementType } = orderInfo.value;
        const oldLength = intersects.length;
        fn.call(mesh, raycaster, intersects);
        const clippingPlanes = clippingRect?.value?.planes;
        const outerMatrixWorld = obj.matrixWorld;
        outer: for (let i = intersects.length - 1; i >= oldLength; i--) {
            const intersection = intersects[i];
            intersection.distance -=
                majorIndex * 0.01 +
                    elementType * 0.001 + //1-10
                    minorIndex * 0.00001; //1-100
            if (clippingPlanes == null) {
                continue;
            }
            for (let ii = 0; ii < 4; ii++) {
                planeHelper.copy(clippingPlanes[ii]).applyMatrix4(outerMatrixWorld);
                if (planeHelper.distanceToPoint(intersection.point) < 0) {
                    intersects.splice(i, 1);
                    continue outer;
                }
            }
        }
    };
}
