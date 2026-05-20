'use client';

import type { TipoDocumento } from "@/lib/contabiliClient";

/**
 * Campos compartidos del huésped en formularios de reserva (habitación y pasadía).
 * Todos obligatorios (decisión del cliente).
 */

const PAISES: Array<{ code: string; nombre: string }> = [
  { code: "PA", nombre: "Panamá" },
  { code: "US", nombre: "Estados Unidos" },
  { code: "CA", nombre: "Canadá" },
  { code: "MX", nombre: "México" },
  { code: "CO", nombre: "Colombia" },
  { code: "CR", nombre: "Costa Rica" },
  { code: "ES", nombre: "España" },
  { code: "AR", nombre: "Argentina" },
  { code: "BR", nombre: "Brasil" },
  { code: "CL", nombre: "Chile" },
  { code: "PE", nombre: "Perú" },
  { code: "EC", nombre: "Ecuador" },
  { code: "VE", nombre: "Venezuela" },
  { code: "DO", nombre: "República Dominicana" },
  { code: "GT", nombre: "Guatemala" },
  { code: "SV", nombre: "El Salvador" },
  { code: "HN", nombre: "Honduras" },
  { code: "NI", nombre: "Nicaragua" },
  { code: "FR", nombre: "Francia" },
  { code: "DE", nombre: "Alemania" },
  { code: "IT", nombre: "Italia" },
  { code: "GB", nombre: "Reino Unido" },
  { code: "OT", nombre: "Otro" },
];

export interface HuespedData {
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  documentoTipo: TipoDocumento;
  documentoNumero: string;
}

export function HuespedFormFields({
  value,
  onChange,
  language,
}: {
  value: HuespedData;
  onChange: (next: HuespedData) => void;
  language: 'es' | 'en';
}) {
  const set = <K extends keyof HuespedData>(k: K, v: HuespedData[K]) => onChange({ ...value, [k]: v });

  const labelClass = "text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1";
  const inputClass = "w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary";

  return (
    <>
      <label className="block">
        <span className={labelClass}>{language === 'es' ? 'Nombre completo (nombre y apellido)' : 'Full name'}</span>
        <input
          type="text"
          required
          value={value.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          placeholder={language === 'es' ? 'Juan Pérez' : 'Jane Doe'}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          required
          value={value.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="juan@example.com"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>{language === 'es' ? 'Teléfono' : 'Phone'}</span>
        <input
          type="tel"
          required
          value={value.telefono}
          onChange={(e) => set('telefono', e.target.value)}
          placeholder="+507 6000-0000"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>{language === 'es' ? 'País' : 'Country'}</span>
        <select required value={value.pais} onChange={(e) => set('pais', e.target.value)} className={inputClass}>
          {PAISES.map((p) => (
            <option key={p.code} value={p.code}>{p.nombre}</option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-3 gap-2">
        <label className="block col-span-1">
          <span className={labelClass}>{language === 'es' ? 'Tipo de ID' : 'ID type'}</span>
          <select
            required
            value={value.documentoTipo}
            onChange={(e) => set('documentoTipo', e.target.value as TipoDocumento)}
            className={inputClass}
          >
            <option value="cedula_pa">{language === 'es' ? 'Cédula PA' : 'PA Cédula'}</option>
            <option value="pasaporte">{language === 'es' ? 'Pasaporte' : 'Passport'}</option>
            <option value="otro">{language === 'es' ? 'Otro ID' : 'Other ID'}</option>
          </select>
        </label>
        <label className="block col-span-2">
          <span className={labelClass}>{language === 'es' ? 'Número de documento' : 'Document number'}</span>
          <input
            type="text"
            required
            minLength={4}
            value={value.documentoNumero}
            onChange={(e) => set('documentoNumero', e.target.value)}
            placeholder={value.documentoTipo === 'cedula_pa' ? '8-123-4567' : 'AB1234567'}
            className={inputClass}
          />
        </label>
      </div>
    </>
  );
}

export function huespedVacio(): HuespedData {
  return {
    nombre: '',
    email: '',
    telefono: '',
    pais: 'PA',
    documentoTipo: 'cedula_pa',
    documentoNumero: '',
  };
}

export function validarHuesped(h: HuespedData, language: 'es' | 'en'): string | null {
  const es = language === 'es';
  if (!h.nombre.trim() || h.nombre.trim().split(/\s+/).filter(Boolean).length < 2) {
    return es ? 'Ingresa nombre y apellido' : 'Enter first and last name';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(h.email.trim())) {
    return es ? 'Email no válido' : 'Invalid email';
  }
  if (h.telefono.trim().length < 7) {
    return es ? 'Teléfono requerido' : 'Phone required';
  }
  if (!h.pais) {
    return es ? 'Selecciona un país' : 'Select a country';
  }
  if (h.documentoNumero.trim().length < 4) {
    return es ? 'Número de documento requerido' : 'Document number required';
  }
  return null;
}
