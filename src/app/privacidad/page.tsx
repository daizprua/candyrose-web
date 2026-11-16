import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { SITE_URL, withBase } from '@/lib/base-path';

export const metadata: Metadata = {
  title: 'Política de privacidad · Hotel Candy Rose',
  description:
    'Cómo trata el Hotel Candy Rose (Candy Rose S.A.) los datos personales de sus huéspedes y clientes conforme a la Ley 81 de 2019 de Panamá: finalidades, base legal, destinatarios, conservación y derechos ARCO.',
  alternates: { canonical: `${SITE_URL}/privacidad` },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <LegalPage titulo="Política de privacidad" actualizado="16 de noviembre de 2026">
      <p>
        En el Hotel Candy Rose protegemos los datos personales de nuestros huéspedes, clientes y visitantes del sitio web. Esta política
        explica qué datos tratamos, para qué, con quién los compartimos y cómo puede ejercer sus derechos, conforme a la{' '}
        <strong>Ley 81 de 26 de marzo de 2019</strong> sobre protección de datos personales y su reglamento, el{' '}
        <strong>Decreto Ejecutivo 285 de 28 de mayo de 2021</strong>.
      </p>

      <h2 id="responsable">1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Candy Rose S.A.</strong>, nombre comercial <strong>Hotel Candy Rose</strong></li>
        <li>RUC 61895-38-350572</li>
        <li>Domicilio: Isla Grande, provincia de Colón, República de Panamá</li>
        <li>Teléfono y WhatsApp: <a href="tel:+50763894132">+507 6389-4132</a></li>
        <li>Correo electrónico: <a href="mailto:hotelcandyrose@gmail.com">hotelcandyrose@gmail.com</a></li>
        <li>Sitio web: <a href={SITE_URL}>{SITE_URL}</a></li>
      </ul>

      <h2 id="datos">2. Datos que recogemos</h2>
      <ul>
        <li><strong>Identificación:</strong> nombre y apellidos, país o nacionalidad.</li>
        <li><strong>Contacto:</strong> correo electrónico y número de teléfono o WhatsApp.</li>
        <li>
          <strong>Documento de identidad:</strong> tipo y número de cédula o pasaporte, necesarios para el registro de huéspedes. Al
          llegar al hotel podemos solicitar el documento físico para verificarlo.
        </li>
        <li>
          <strong>Datos de la reserva:</strong> fechas de entrada y salida o de visita, tipo de habitación o pasadía, número de adultos,
          número y edades de los niños, notas o solicitudes especiales, importes y estado de la reserva.
        </li>
        <li>
          <strong>Datos fiscales:</strong> nombre o razón social, RUC o cédula y dígito verificador, cuando se solicita la factura a
          nombre de una persona o empresa determinada.
        </li>
        <li>
          <strong>Datos técnicos:</strong> información básica del navegador y del dispositivo que se genera al usar el sitio y la
          verificación anti-bots (ver las secciones 7 y 8).
        </li>
      </ul>
      <p>
        No solicitamos datos sensibles. Le pedimos no incluirlos en el campo de notas, salvo información de salud o accesibilidad que
        usted decida compartir para que podamos atenderle mejor; en ese caso la usaremos solo con ese fin.
      </p>

      <h2 id="finalidades">3. Para qué usamos sus datos</h2>
      <ul>
        <li>Gestionar su reserva de hospedaje o pasadía: confirmarla, modificarla, cancelarla y prestar los servicios contratados.</li>
        <li>Llevar el registro de huéspedes que exigen las autoridades de la República de Panamá.</li>
        <li>Emitir la factura electrónica y cumplir las obligaciones fiscales ante la Dirección General de Ingresos (DGI).</li>
        <li>
          Enviarle comunicaciones relacionadas con su estadía por correo electrónico o WhatsApp: confirmación y código de reserva,
          indicaciones de llegada, avisos de cambios y la factura.
        </li>
        <li>Atender sus consultas, reclamos y solicitudes de ejercicio de derechos.</li>
        <li>Proteger el sitio contra el uso automatizado o fraudulento y mantener su seguridad.</li>
      </ul>
      <p>
        No usamos sus datos para enviarle publicidad sin su consentimiento previo, ni los vendemos o cedemos a terceros con fines
        comerciales.
      </p>

      <h2 id="base-legal">4. Base legal del tratamiento</h2>
      <ul>
        <li><strong>Ejecución del contrato</strong> de hospedaje o de pasadía que usted solicita al reservar.</li>
        <li>
          <strong>Cumplimiento de obligaciones legales</strong>, como el registro de huéspedes y la facturación electrónica.
        </li>
        <li>
          <strong>Consentimiento</strong>, que usted otorga al enviar el formulario de reserva y que puede revocar en cualquier momento
          sin efectos retroactivos, para los tratamientos que se basen en él.
        </li>
        <li>
          <strong>Interés legítimo</strong> del Hotel en la seguridad del sitio y la prevención del fraude, respetando sus derechos.
        </li>
      </ul>

      <h2 id="destinatarios">5. Con quién compartimos sus datos</h2>
      <ul>
        <li>
          <strong>Proveedor de facturación electrónica autorizado</strong> por la DGI, para emitir y transmitir la factura fiscal.
        </li>
        <li><strong>Dirección General de Ingresos (DGI)</strong>, por medio de la factura electrónica.</li>
        <li>
          <strong>Autoridades competentes</strong>, cuando la ley lo exija (por ejemplo, el registro de huéspedes) o en respuesta a una
          orden de autoridad.
        </li>
        <li>
          <strong>Proveedores tecnológicos</strong> que alojan el sitio, el sistema de gestión del hotel y sus bases de datos, y que
          prestan servicios de mensajería (correo y WhatsApp) y de verificación anti-bots. Actúan por cuenta del Hotel, bajo
          obligaciones de confidencialidad y seguridad, y no pueden usar los datos para fines propios.
        </li>
      </ul>
      <p>
        Algunos de estos proveedores pueden estar ubicados o almacenar información fuera de Panamá. En esos casos, la transferencia se
        realiza con las garantías que exigen la Ley 81 de 2019 y su reglamento.
      </p>

      <h2 id="pagos">6. Pagos con tarjeta</h2>
      <p>
        El sitio web <strong>no solicita ni almacena</strong> datos de tarjetas de crédito o débito. Los pagos se realizan en el hotel o
        por los medios de pago que se le indiquen, y los datos de su tarjeta los procesan directamente el banco o la entidad de pago
        correspondiente.
      </p>

      <h2 id="turnstile">7. Protección contra bots (Cloudflare Turnstile)</h2>
      <p>
        Los formularios de reserva usan <strong>Cloudflare Turnstile</strong> para comprobar que la solicitud la hace una persona y no un
        programa automatizado. Para ello, Cloudflare puede tratar datos técnicos del navegador y del dispositivo, como la dirección IP y
        señales de interacción, únicamente con fines de seguridad. Ese tratamiento se rige además por la política de privacidad de
        Cloudflare.
      </p>

      <h2 id="cookies">8. Cookies y almacenamiento local</h2>
      <p>
        El sitio no utiliza cookies de publicidad ni de seguimiento. Solo usa almacenamiento técnico necesario para su funcionamiento:
      </p>
      <ul>
        <li>
          <strong>Idioma:</strong> el almacenamiento local de su navegador (localStorage) guarda el idioma que eligió para mantenerlo al
          pasar de una página a otra.
        </li>
        <li>
          <strong>Captcha:</strong> Cloudflare Turnstile puede usar almacenamiento técnico propio para completar la verificación
          anti-bots.
        </li>
      </ul>
      <p>
        Puede borrar o bloquear este almacenamiento desde la configuración de su navegador. Si lo bloquea, el sitio volverá al idioma
        predeterminado y es posible que la verificación anti-bots no funcione correctamente.
      </p>

      <h2 id="conservacion">9. Cuánto tiempo conservamos sus datos</h2>
      <p>
        Conservamos sus datos mientras sean necesarios para gestionar su reserva y su estadía y, después, durante los plazos que exijan
        la normativa fiscal, comercial y de registro de huéspedes, o el tiempo necesario para atender posibles reclamos. Vencidos esos
        plazos, los datos se eliminan o se anonimizan de forma segura.
      </p>

      <h2 id="derechos">10. Sus derechos</h2>
      <p>Como titular de los datos, usted puede ejercer en cualquier momento los derechos de:</p>
      <ul>
        <li><strong>Acceso:</strong> saber qué datos suyos tratamos y cómo.</li>
        <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
        <li>
          <strong>Cancelación:</strong> pedir la eliminación de sus datos cuando ya no sean necesarios, salvo que debamos conservarlos por
          obligación legal.
        </li>
        <li><strong>Oposición:</strong> oponerse a un tratamiento por motivos fundados y legítimos.</li>
        <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado y de uso común.</li>
      </ul>
      <p>
        Para ejercerlos, escriba a <a href="mailto:hotelcandyrose@gmail.com">hotelcandyrose@gmail.com</a> indicando su nombre, el derecho
        que desea ejercer y, si lo tiene, el código de su reserva. Podremos pedirle que acredite su identidad para proteger sus datos.
        Responderemos dentro de los plazos que establecen la Ley 81 de 2019 y su reglamento. El ejercicio de estos derechos es gratuito.
      </p>
      <p>
        Si considera que su solicitud no fue atendida correctamente, puede presentar una reclamación ante la{' '}
        <strong>Autoridad Nacional de Transparencia y Acceso a la Información (ANTAI)</strong>, autoridad de control en materia de
        protección de datos personales en Panamá.
      </p>

      <h2 id="seguridad">11. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger sus datos contra pérdida, acceso no autorizado, alteración o
        divulgación: conexión cifrada (HTTPS), acceso restringido al personal que lo necesita para su trabajo, credenciales protegidas y
        copias de seguridad. Ningún sistema es completamente infalible; si se produjera un incidente de seguridad que afecte sus datos,
        actuaremos conforme a lo que establece la ley.
      </p>

      <h2 id="menores">12. Menores de edad</h2>
      <p>
        Las reservas deben realizarlas personas mayores de edad. Los datos de menores (por ejemplo, su edad o su documento para el
        registro de huéspedes) solo se tratan cuando los facilita su padre, madre, tutor o el adulto responsable de la reserva, y
        únicamente para las finalidades descritas en esta política.
      </p>

      <h2 id="cambios">13. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. Publicaremos la nueva versión en esta
        página con su fecha de actualización y, si el cambio es relevante, se lo informaremos por los medios de contacto que tengamos.
      </p>

      <h2 id="contacto">14. Contacto</h2>
      <p>
        Para cualquier consulta sobre esta política o sobre sus datos: Candy Rose S.A. (Hotel Candy Rose), Isla Grande, Colón, Panamá ·
        Teléfono y WhatsApp <a href="tel:+50763894132">+507 6389-4132</a> · Correo{' '}
        <a href="mailto:hotelcandyrose@gmail.com">hotelcandyrose@gmail.com</a>. Consulte también nuestros{' '}
        <a href={withBase('/terminos')}>Términos y condiciones de reserva</a>.
      </p>
    </LegalPage>
  );
}
