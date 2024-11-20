"use server";

import { query } from '@/lib/db';
import { Buffer } from 'buffer';

interface Document {
  co_tipo_doc: string
  nom_archivo: string
}

interface Option {
  value: string
  label: string;
}

export async function getTemplatesNull(){
  try {
    const result = await query<Option>(
      "SELECT co_tipo_doc as value, nom_archivo as label FROM idosgd.tdtr_plantilla_docx WHERE bl_doc IS NULL ORDER BY nom_archivo ASC;", 
      []
    );
    return result;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}

export async function getTemplatesData() {
  try {
    const result = await query<Document>(
      'SELECT co_tipo_doc, nom_archivo FROM idosgd.tdtr_plantilla_docx WHERE bl_doc IS NOT NULL ORDER BY nom_archivo ASC;', 
      []
    );
    return result;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}

export async function downloadTemplateById(templateId: string) {
  try {
    const result = await query<{ bl_doc: Buffer, nom_archivo: string }>(
      'SELECT bl_doc, nom_archivo FROM idosgd.tdtr_plantilla_docx WHERE co_tipo_doc = $1;',
      [templateId]
    );

    if (result.length === 0) {
      return {
        status: 500,
        message: 'No se encontró la plantilla',
        fileName: '',
        fileContent: '',
      }
    }

    const { bl_doc, nom_archivo } = result[0];

    if (!bl_doc) {
      return {
        status: 400,
        message: 'Plantilla sin contenido',
        fileName: '',
        fileContent: '',
      }
    }

    const fileContentBase64 = bl_doc.toString('base64');

    return {
      status: 200,
      message: 'Plantilla obtenida con éxito',
      fileName: nom_archivo,
      fileContent: fileContentBase64,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Error: ' + error,
      fileName: '',
      fileContent: '',
    }
  }
}

export async function uploadTemplate(templateId: string, file: File) {
  try {
    // Convertir el archivo a ArrayBuffer y luego a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = Buffer.from(arrayBuffer);

    // Ejecuta la consulta de actualización en PostgreSQL
    const result = await query(
      `
      UPDATE idosgd.tdtr_plantilla_docx
      SET bl_doc = $1
      WHERE co_dep = $2 AND co_tipo_doc = $3
      RETURNING *;
      `,
      [fileContent, '00000', templateId]
    );

    console.log({ fileContent, arrayBuffer, result });

    return { status: 200, message: 'Plantilla actualizada exitosamente.' };
  } catch (error) {
    return { status: 500, message: 'Error interno del servidor. ' + error };
  }
}

