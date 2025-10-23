import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/articles/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'blog/categories/names/:name',
    renderMode: RenderMode.Server,
  },
  {
    path: 'blog/archives/:year/:month',
    renderMode: RenderMode.Server,
  },
  {
    path: 'user/edit/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'blog/tags/names/:name',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
