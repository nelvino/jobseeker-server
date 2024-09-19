import DataLoader from 'dataloader';
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}
// in order to make less calls to the database, we use the dataloader to preload the data before using it, but we add it to the context in server.js 
// so its always called again when needed, to avoid cashing issues. 
export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    console.log('[companyLoader] ids:', ids);
    const companies = await getCompanyTable().select().whereIn('id', ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}