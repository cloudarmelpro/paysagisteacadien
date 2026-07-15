/** Types partagés de l'application. */

export interface Service {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  images: string[];
}

export interface NavItem {
  title: string;
  href: string;
  external?: boolean;
}
