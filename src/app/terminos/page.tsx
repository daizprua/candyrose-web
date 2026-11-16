import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { obtenerTextoLegal } from '@/lib/contabiliClient';
import { markdownAHtml } from '@/lib/markdown-simple';
import { SITE_URL, withBase } from '@/lib/base-path';

export const metadata: Metadata = {
  title: 'Términos y condiciones de reserva · Hotel Candy Rose',
  description:
    'Condiciones de reserva del Hotel Candy Rose en Isla Grande, Colón, Panamá: tarifas e ITBMS, horarios de entrada y salida, cancelación, no-show, pasadías, facturación electrónica y ley aplicable.',
  alternates: { canonical: `${SITE_URL}/terminos` },
  robots: { index: true, follow: true },
};

// Texto vigente desde el sistema (lo edita gerencia); si el sistema no
// responde, se muestra la versión original incluida en la web.
export const revalidate = 300;

function fechaLarga(iso: string | null): string {
  if (!iso) return '16 de noviembre de 2026';
  return new Date(iso).toLocaleDateString('es-PA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Panama' });
}

export default async function TerminosPage() {
  const texto = await obtenerTextoLegal('terminos').catch(() => null);
  if (texto?.contenido) {
    return (
      <LegalPage titulo={texto.titulo} actualizado={fechaLarga(texto.actualizadoAt)}>
        <div dangerouslySetInnerHTML={{ __html: markdownAHtml(texto.contenido) }} />
      </LegalPage>
    );
  }
  return <ContenidoOriginal />;
}

function ContenidoOriginal() {
  return (
    <LegalPage titulo="Términos y condiciones de reserva" actualizado="16 de noviembre de 2026">
      <p>
        Estos términos y condiciones regulan las reservas de hospedaje y de pasadías realizadas a través del sitio web{' '}
        <a href={SITE_URL}>hotelcandyrose.devstack.agency/web</a> (el &laquo;Sitio&raquo;) y la estadía en el Hotel Candy Rose.
        Al confirmar una reserva, el cliente declara haberlos leído y aceptado. Le recomendamos guardar o imprimir una copia.
      </p>

      <h2 id="responsable">1. Quiénes somos</h2>
      <p>
        El Sitio y el hotel son operados por <strong>Candy Rose S.A.</strong>, sociedad anónima panameña con nombre comercial
        <strong> Hotel Candy Rose</strong>, RUC 61895-38-350572, con domicilio en Isla Grande, provincia de Colón, República de
        Panamá (en adelante, &laquo;el Hotel&raquo;).
      </p>
      <ul>
        <li>Teléfono y WhatsApp: <a href="tel:+50763894132">+507 6389-4132</a></li>
        <li>Correo electrónico: <a href="mailto:hotelcandyrose@gmail.com">hotelcandyrose@gmail.com</a></li>
        <li>Sitio web: <a href={SITE_URL}>{SITE_URL}</a></li>
      </ul>

      <h2 id="reservas">2. Reservas por el Sitio y confirmación</h2>
      <p>
        El cliente selecciona fechas, número de huéspedes y tipo de habitación o pasadía, y completa sus datos personales. Antes de
        confirmar, el Sitio muestra el detalle de la reserva, el subtotal, el impuesto aplicable y el total. La reserva se considera
        aceptada por el Hotel cuando el Sitio muestra el <strong>código de reserva</strong>, que además se envía al correo electrónico
        y/o al WhatsApp indicados por el cliente. Esa confirmación incluye las condiciones particulares de la reserva, que
        prevalecen sobre estas condiciones generales en lo que las modifiquen.
      </p>
      <p>
        El cliente es responsable de que los datos suministrados sean veraces y completos, y de revisar la confirmación al
        recibirla. Si detecta un error, debe comunicarlo de inmediato por los medios de contacto indicados. La persona que reserva
        debe ser mayor de edad y tener capacidad legal para contratar; cuando reserva en nombre de otras personas, declara contar con
        su autorización para facilitar sus datos.
      </p>
      <p>
        La disponibilidad mostrada en el Sitio se actualiza en tiempo real, pero puede variar mientras el cliente completa el proceso.
        Si por un error técnico evidente se publicara un precio manifiestamente equivocado, o si la habitación dejara de estar
        disponible antes de la confirmación, el Hotel lo informará al cliente y le ofrecerá una alternativa o la anulación de la
        reserva sin costo.
      </p>

      <h2 id="tarifas">3. Tarifas, impuestos y pago</h2>
      <p>
        Las tarifas se expresan en <strong>balboas (B/.)</strong>, moneda de curso legal en la República de Panamá equivalente al dólar
        de los Estados Unidos de América (USD) a la par. Los importes pueden mostrarse con el símbolo &laquo;$&raquo;.
      </p>
      <p>
        Las tarifas de hospedaje <strong>no incluyen el ITBMS de 10%</strong> aplicable a los servicios de alojamiento, que se suma y se
        desglosa antes de confirmar la reserva. Las pasadías y demás servicios llevan el ITBMS que corresponda según la ley, también
        desglosado antes de confirmar. Los cargos por huéspedes adicionales, cuando apliquen, se muestran en el resumen de la reserva.
      </p>
      <p>
        Salvo que la confirmación indique otra cosa, la reserva realizada por el Sitio no se cobra por anticipado y el pago se realiza
        en el Hotel al momento del check-in, por los medios de pago aceptados (transferencia bancaria, Yappy, tarjeta Clave, Visa,
        Mastercard o efectivo). Los consumos adicionales durante la estadía se liquidan antes de la salida.
      </p>

      <h2 id="horarios">4. Horarios de entrada (check-in) y salida (check-out)</h2>
      <ul>
        <li><strong>Entrada:</strong> de 3:00 p. m. a 8:00 p. m.</li>
        <li><strong>Salida:</strong> hasta las 12:00 p. m.</li>
      </ul>
      <p>
        Si la confirmación de la reserva indica un horario distinto, prevalece el indicado en la confirmación. Las llegadas fuera de
        horario, así como la entrada anticipada o la salida tardía, deben coordinarse previamente con el Hotel y están sujetas a
        disponibilidad, pudiendo generar un cargo adicional que se informará antes de aplicarlo.
      </p>
      <p>
        Al momento del check-in, cada huésped debe presentar un documento de identidad válido (cédula o pasaporte) para el registro de
        huéspedes exigido por las autoridades. El Hotel podrá negar el alojamiento a quien no presente su identificación.
      </p>

      <h2 id="cancelacion">5. Política de cancelación y no-show</h2>
      <ul>
        <li>
          <strong>Cancelación gratuita</strong> hasta <strong>72 horas antes</strong> de la hora de llegada (check-in) prevista en la
          reserva.
        </li>
        <li>
          <strong>Cancelación dentro de las 72 horas</strong> previas a la llegada: se cobra el <strong>100% del importe de la primera
          noche</strong>.
        </li>
        <li>
          <strong>No presentación (no-show):</strong> si el huésped no se presenta en la fecha de llegada sin haber cancelado, el Hotel
          podrá cobrar una penalidad según su política vigente, que se informará en la confirmación de la reserva.
        </li>
        <li>
          <strong>Salidas anticipadas:</strong> una vez iniciada la estadía, no se realizan reembolsos por salidas anticipadas
          motivadas por causas ajenas a la operación del Hotel.
        </li>
      </ul>
      <p>
        Las cancelaciones deben solicitarse por correo electrónico o WhatsApp indicando el código de reserva. La fecha y hora de
        recepción del mensaje determinan el plazo aplicable. Cuando proceda una devolución, se realizará por el mismo medio de pago
        utilizado, dentro de un plazo razonable y conforme a la legislación de protección al consumidor.
      </p>

      <h2 id="modificaciones">6. Modificaciones</h2>
      <p>
        Las solicitudes de cambio de fechas, tipo de habitación o número de huéspedes se atienden a través de los medios de contacto y
        están sujetas a disponibilidad y a la tarifa vigente al momento del cambio, que puede ser distinta a la de la reserva original.
        El Hotel confirmará por escrito la modificación aceptada. Una modificación solicitada dentro de las 72 horas previas a la
        llegada que reduzca el número de noches podrá tratarse como una cancelación parcial conforme a la sección anterior.
      </p>

      <h2 id="pasadias">7. Pasadías</h2>
      <p>
        La pasadía da derecho al uso de las instalaciones y servicios descritos en el Sitio para la fecha de visita elegida, dentro
        del horario que indique el Hotel. No incluye alojamiento. Los precios por adulto y por niño se muestran en el Sitio y llevan el
        ITBMS que corresponda. El cambio de fecha está sujeto a disponibilidad y debe solicitarse antes de la fecha reservada. El
        traslado en lancha hasta el Hotel es un servicio externo que no está incluido en la pasadía, salvo indicación expresa.
      </p>

      <h2 id="menores">8. Menores de edad y huéspedes adicionales</h2>
      <p>
        Cada tipo de habitación tiene una capacidad máxima de adultos y de niños, que se indica al reservar; no se admiten más
        personas que las registradas en la reserva. La edad máxima para ser considerado niño se muestra en el formulario de reserva;
        los mayores de esa edad se registran como adultos. Los huéspedes adicionales a los incluidos en la tarifa generan el cargo por
        noche que se informa antes de confirmar.
      </p>
      <p>
        Los menores de edad deben alojarse acompañados de su padre, madre o tutor, o de un adulto responsable debidamente autorizado,
        quien responde por su cuidado durante toda la estadía, incluido el uso de la piscina, el jacuzzi, el muelle y el mar.
      </p>

      <h2 id="conducta">9. Conducta, daños y objetos perdidos</h2>
      <p>
        Los huéspedes y visitantes deben respetar las normas internas del Hotel, el descanso de los demás huéspedes y las
        indicaciones del personal. El Hotel podrá dar por terminada la estadía de quien incurra en conductas que pongan en riesgo la
        seguridad de las personas o de las instalaciones, o que infrinjan la ley, con los efectos económicos que correspondan
        conforme a estas condiciones y a la ley.
      </p>
      <p>
        El huésped responde por los daños que él, sus acompañantes o sus invitados causen a las habitaciones, mobiliario o
        instalaciones, más allá del desgaste normal, y el Hotel podrá cobrar el costo razonable de reparación o reposición, previa
        comunicación al huésped.
      </p>
      <p>
        Los objetos olvidados que el personal encuentre se registran y se guardan por un período razonable. Para recuperarlos, el
        huésped debe contactar al Hotel; los gastos de envío, si los hubiera, corren por su cuenta. Se recomienda no dejar objetos de
        valor sin vigilancia, sin perjuicio de la responsabilidad que la ley atribuya al Hotel.
      </p>

      <h2 id="facturacion">10. Facturación electrónica</h2>
      <p>
        El Hotel emite <strong>factura electrónica</strong> conforme al sistema de facturación de la Dirección General de Ingresos (DGI) de
        Panamá, a través de un proveedor autorizado. La factura fiscal se envía al correo electrónico o al WhatsApp del cliente. Si
        requiere la factura a nombre de una empresa, el cliente debe facilitar los datos fiscales completos y correctos (nombre o
        razón social, RUC o cédula y dígito verificador) antes de su emisión. Una vez emitida, la factura solo puede corregirse
        mediante los documentos que permita la normativa fiscal (por ejemplo, nota de crédito).
      </p>

      <h2 id="fuerza-mayor">11. Fuerza mayor y caso fortuito</h2>
      <p>
        Ninguna de las partes será responsable por el incumplimiento de sus obligaciones causado por hechos de fuerza mayor o caso
        fortuito, tales como fenómenos naturales, mal tiempo que impida la navegación, emergencias sanitarias, disposiciones de las
        autoridades, protestas o cierres de vías, o interrupciones generales de servicios públicos. En esos casos, el Hotel y el
        cliente procurarán acordar una nueva fecha o la solución que corresponda conforme a la ley.
      </p>

      <h2 id="consumidor">12. Derechos del consumidor y reclamos</h2>
      <p>
        Nada en estos términos limita los derechos que la <strong>Ley 45 de 31 de octubre de 2007</strong> reconoce al consumidor. Cualquier
        reclamo puede presentarse al Hotel por los medios de contacto indicados, y el Hotel responderá a la mayor brevedad. El cliente
        conserva su derecho de acudir a la Autoridad de Protección al Consumidor y Defensa de la Competencia (ACODECO).
      </p>

      <h2 id="privacidad">13. Datos personales</h2>
      <p>
        El tratamiento de los datos personales del cliente se rige por nuestra{' '}
        <a href={withBase('/privacidad')}>Política de privacidad</a>.
      </p>

      <h2 id="ley">14. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Panamá. Cualquier controversia se someterá a los tribunales
        competentes de la República de Panamá, sin perjuicio de los derechos del consumidor ante ACODECO y de los fueros que la ley
        le reconozca.
      </p>

      <h2 id="cambios">15. Cambios a estos términos</h2>
      <p>
        El Hotel puede actualizar estos términos. La versión aplicable a cada reserva es la vigente en el momento de su confirmación.
        La fecha de la última actualización figura al inicio de esta página.
      </p>

      <h2 id="contacto">16. Contacto</h2>
      <p>
        Candy Rose S.A. (Hotel Candy Rose) · Isla Grande, Colón, Panamá · Teléfono y WhatsApp{' '}
        <a href="tel:+50763894132">+507 6389-4132</a> · Correo{' '}
        <a href="mailto:hotelcandyrose@gmail.com">hotelcandyrose@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
