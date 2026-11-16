/**
 * La web vive bajo /web del dominio del hotel
 * (https://hotelcandyrose.devstack.agency/web). Next antepone el basePath
 * solo a <Link>, router y assets propios; las rutas escritas a mano en
 * fetch(), <img src> y metadata hay que pasarlas por withBase().
 */
export const BASE_PATH = "/web";

export const SITE_URL = `https://hotelcandyrose.devstack.agency${BASE_PATH}`;

export function withBase(ruta: string): string {
  return `${BASE_PATH}${ruta}`;
}
