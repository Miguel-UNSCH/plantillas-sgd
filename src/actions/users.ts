"use server";

import { query } from '@/lib/db';

export async function getUsers(){
  try {
    const result = await query('SELECT cod_user, cdes_user, cclave FROM idosgd.seg_usuarios1;', []);
    return result;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}