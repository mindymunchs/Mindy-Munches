export function setSEO({ title, description, ogImage, canonical } = {}) {
  document.title = title
    ? `${title} | Mindy Munchs`
    : 'Mindy Munchs | Premium Makhana & Sattu Superfoods';

  const desc = document.querySelector('meta[name="description"]');
  if (desc && description) desc.setAttribute('content', description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogImg = document.querySelector('meta[property="og:image"]');
  const canonicalTag = document.querySelector('link[rel="canonical"]');

  if (ogTitle) ogTitle.setAttribute('content', document.title);
  if (ogDesc && description) ogDesc.setAttribute('content', description);
  if (ogImg && ogImage) ogImg.setAttribute('content', ogImage);
  if (canonicalTag && canonical) canonicalTag.setAttribute('href', canonical);
}
