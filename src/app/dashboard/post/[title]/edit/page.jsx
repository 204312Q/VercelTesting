import { kebabCase } from 'es-toolkit';

import { CONFIG } from 'src/global-config';
// import axios, { endpoints } from 'src/lib/axios';

// import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post edit | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  // const { title } = params;

  // const { post } = await getPost(title);

  // return <PostEditView post={post} />;
  return <h1>Edit Post</h1>; // Placeholder for the post edit view
}

// ----------------------------------------------------------------------

// async function getPost(title) {
//   const URL = title ? `${endpoints.post.details}?title=${title}` : '';

//   const res = await axios.get(URL);

//   return res.data;
// }

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
// const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
// export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
// export async function generateStaticParams() {
//   if (CONFIG.isStaticExport) {
//     const res = await axios.get(endpoints.post.list);

//     return res.data.posts.map((post) => ({ title: kebabCase(post.title) }));
//   }
//   return [];
// }
