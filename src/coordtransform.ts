/**
 * 经纬度坐标转换相关工具函数
 * 支持任意 JavaScript 环境或框架
 * 
 * 坐标系说明：
 * - WGS-84: GPS 原始坐标系，国际标准
 * - GCJ-02: 火星坐标系，中国标准（国测局坐标系），谷歌、高德使用
 * - BD-09: 百度坐标系，在 GCJ-02 基础上再次加密
 */

// 常量定义
const X_PI = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const A = 6378245.0; // 长半轴
const EE = 0.00669342162296594323; // 偏心率平方

/**
 * 判断是否是国外（非中国）坐标
 * 中国的经纬度范围大约为：经度 73.66 ~ 135.05、纬度 3.86 ~ 53.55
 * 
 * @param lng - 经度
 * @param lat - 纬度
 * @returns 返回 true（在国外）、false（在国内）
 * 
 * @example
 * ```typescript
 * out_of_china(116.397128, 39.916527); // false (北京)
 * out_of_china(0, 0); // true (国外)
 * ```
 */
export function out_of_china(lng: number, lat: number): boolean {
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

/**
 * 转换经度
 */
function transformLng(lng: number, lat: number): number {
  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) +
      20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) +
      40.0 * Math.sin((lng / 3.0) * PI)) *
      2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
}

/**
 * 转换纬度
 */
function transformLat(lng: number, lat: number): number {
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) +
      20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) +
      40.0 * Math.sin((lat / 3.0) * PI)) *
      2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) +
      320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

/**
 * WGS-84 转 GCJ-02
 * 
 * @param lng - 经度
 * @param lat - 纬度
 * @returns 返回经、纬度组成的数组 [lng, lat]
 * 
 * @example
 * ```typescript
 * const [lng, lat] = wgs84togcj02(116.397128, 39.916527);
 * ```
 */
export function wgs84togcj02(lng: number, lat: number): Array<number> {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  }
  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  let radlat = (lat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - EE * magic * magic;
  let sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / (((A * (1 - EE)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((A / sqrtmagic) * Math.cos(radlat) * PI);
  let mglat = lat + dlat;
  let mglng = lng + dlng;
  return [mglng, mglat];
}

/**
 * GCJ-02 转换为 WGS-84
 * 
 * @param lng - 经度
 * @param lat - 纬度
 * @returns 返回经、纬度组成的数组 [lng, lat]
 * 
 * @example
 * ```typescript
 * const [lng, lat] = gcj02towgs84(116.403873, 39.915119);
 * ```
 */
export function gcj02towgs84(lng: number, lat: number): Array<number> {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  }
  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  let radlat = (lat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - EE * magic * magic;
  let sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / (((A * (1 - EE)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((A / sqrtmagic) * Math.cos(radlat) * PI);
  let mglat = lat + dlat;
  let mglng = lng + dlng;
  return [lng * 2 - mglng, lat * 2 - mglat];
}

/**
 * 百度坐标系 BD-09 与火星坐标系 GCJ-02 的转换（即百度转谷歌、高德）
 * 
 * @param lng - 经度
 * @param lat - 纬度
 * @returns 返回经、纬度组成的数组 [lng, lat]
 * 
 * @example
 * ```typescript
 * const [lng, lat] = bd09togcj02(116.397128, 39.916527);
 * ```
 */
export function bd09togcj02(lng: number, lat: number): Array<number> {
  let x = lng - 0.0065;
  let y = lat - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  let gglng = z * Math.cos(theta);
  let gglat = z * Math.sin(theta);
  return [gglng, gglat];
}

/**
 * 火星坐标系 GCJ-02 与百度坐标系 BD-09 的转换（即谷歌、高德转百度）
 * 
 * @param lng - 经度
 * @param lat - 纬度
 * @returns 返回经、纬度组成的数组 [lng, lat]
 * 
 * @example
 * ```typescript
 * const [lng, lat] = gcj02tobd09(116.397128, 39.916527);
 * ```
 */
export function gcj02tobd09(lng: number, lat: number): Array<number> {
  let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
  let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
  let bdlng = z * Math.cos(theta) + 0.0065;
  let bdlat = z * Math.sin(theta) + 0.006;
  return [bdlng, bdlat];
}

