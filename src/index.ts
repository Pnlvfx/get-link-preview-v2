import { parser } from 'html-metadata-parser';
import { APIOutput } from './types';

const getMetadata = async (url: string) => {
  return parser(url);
};

export const getLinkPreview = async (url: string): Promise<APIOutput> => {
  url = url.toLowerCase();
  url = url.includes('://') ? url : 'http://' + url;

  const isUrlValid = /[\w#%()+./:=?@~]{2,256}\.[a-z]{2,6}\b([\w#%&+./:=?@~-]*)/gi.test(url);

  if (!url || !isUrlValid) throw new Error('Invalid URL');

  const { hostname } = new URL(url);
  const metadata = await getMetadata(url);
  if (!metadata) throw new Error('Cannot find metadata for the given url');
  const { images, og, meta } = metadata;

  const image = og.image || images ? images?.at(0) : `${process.env.SERVER_URL}/img-placeholder.jpg`;
  const description = og.description || meta.description || undefined;
  const title = og.title || meta.title || '';
  const siteName = og.site_name || '';

  return {
    title,
    description,
    image,
    siteName,
    hostname,
  };
};
