import { mat4 } from "gl-matrix";

export function poseToMatrix(out: mat4, pose: VRPose) {
  // If the orientation or position are null, provide defaults.
  const q = pose.orientation ? pose.orientation : [0, 0, 0, 1],
    v = pose.position ? pose.position : [0, 0, 0],
    x2 = q[0] + q[0],
    y2 = q[1] + q[1],
    z2 = q[2] + q[2],
    xx = q[0] * x2,
    xy = q[0] * y2,
    xz = q[0] * z2,
    yy = q[1] * y2,
    yz = q[1] * z2,
    zz = q[2] * z2,
    wx = q[3] * x2,
    wy = q[3] * y2,
    wz = q[3] * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}
