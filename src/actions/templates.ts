"use server";

import { query } from '@/lib/db';

interface Document {
  co_tipo_doc: string
  nom_archivo: string
}

export async function getTemplates(){
  try {
    const result = await query('SELECT co_tipo_doc, co_dep, bl_doc, nom_archivo FROM idosgd.tdtr_plantilla_docx;', []);
    return result;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}

export async function getTemplatesNull(){
  try {
    const result = await query('SELECT co_tipo_doc, co_dep, bl_doc, nom_archivo FROM idosgd.tdtr_plantilla_docx WHERE bl_doc IS NULL;', []);
    return result;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}

export async function getTemplatesData(){
  try {
    const result = await query<Document>('SELECT co_tipo_doc, nom_archivo FROM idosgd.tdtr_plantilla_docx WHERE bl_doc IS NOT NULL;', []);
    return result;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}