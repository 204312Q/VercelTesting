// import { CONFIG } from 'src/global-config';
// import { getPosts } from 'src/actions/blog-ssr';

// import { PostListHomeView } from 'src/sections/blog/view';

// // ----------------------------------------------------------------------

// export const metadata = { title: `Post list - ${CONFIG.appName}` };

// export default async function Page() {
//   // const { posts } = await getPosts();

//   return <h1>Post List</h1>;

//   // try {
//   //   const { posts } = await getPosts();
//   //   return <PostListHomeView posts={posts} />;
//   // } catch (error) {
//   //   console.error('Error fetching posts:', error);
//   //   return <div>Error loading posts</div>; // Don't throw or return error object
//   // }
// }

import { CONFIG } from 'src/global-config';
// import { getPosts } from 'src/actions/blog-ssr';
// import { PostListHomeView } from 'src/sections/blog/view';

// export const metadata = { title: `Post list - ${CONFIG.appName}` };

export default function Page() {
  return <h1>Just a test page</h1>;
}


