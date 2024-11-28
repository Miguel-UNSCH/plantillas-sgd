"use server";

import { query } from '@/lib/db';

interface Option {
  value: string;
  label: string;
}

export async function getDocumentsProf() {
  try {
    const result = await query(
      `SELECT cdoc_tipdoc, cdoc_desdoc
      FROM idosgd.si_mae_tipo_doc
      WHERE cdoc_grupo='02'
      ORDER BY cdoc_desdoc ASC;`, 
      []
    );
    return result;
  } catch (error) {
    console.error('Error al obtener los documentos del profesional: ', error);
    return [];
  }
}

export async function getDocumentsAll() {
  try {
    const result = await query<Option>(
      `SELECT cdoc_tipdoc as value, cdoc_desdoc as label
      FROM idosgd.si_mae_tipo_doc
      WHERE cdoc_grupo NOT IN ('02')
      ORDER BY cdoc_desdoc ASC;`,
      []
    );
    return result;
  } catch (error) {
    console.error('Error al obtener todos los documentos: ', error);
    return [];
  }
}

export async function saveDocument(cdoc_tipdoc: string){
  try {
    await query(
      `UPDATE idosgd.si_mae_tipo_doc
      SET cdoc_grupo='02'
      WHERE cdoc_tipdoc=$1;`,
      [
        cdoc_tipdoc
      ]
    );
    return {
      status: 200,
      message: 'Guardado correctamente.',
    }
  } catch (error) {
    console.error('Error al guardar el documento: ', error);
    return {
      status: 500,
      message: 'Error al guardar el documento: ' + error,
    }
  }
}

export async function removeDocument(cdoc_tipdoc: string){
  try {
    await query(
      `UPDATE idosgd.si_mae_tipo_doc
      SET cdoc_grupo='01'
      WHERE cdoc_tipdoc=$1;`,
      [
        cdoc_tipdoc
      ]
    );
    return {
      status: 200,
      message: 'Guardado correctamente.',
    }
  } catch (error) {
    console.error('Error al guardar el documento: ', error);
    return {
      status: 500,
      message: 'Error al guardar el documento: ' + error,
    }
  }
}