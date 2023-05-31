import { Timestamp } from 'firebase/firestore';
import { Result } from 'lighthouse';

export type ISitePage = {
  id?: string;
  title: string;
  value: string;
};

export interface ISite {
  id: string;
  site_name: string;
  sitemap: string;
  project_type: string;
  active: boolean;
  sites: ISitePage[];
  createdDate: Timestamp;
  updatedDate: Timestamp;
}

export interface IPerformance {
  performance: Performance
  accessibility: Accessibility
  'best-practices': BestPractices
  seo: Seo
  pwa: Pwa
}

export interface Performance {
  title: string
  supportedModes: string[]
  auditRefs: AuditRef[]
  id: string
  score: number
}


export interface Accessibility {
  title: string
  description: string
  manualDescription: string
  supportedModes: string[]
  auditRefs: AuditRef[]
  id: string
  score: number
}

export interface BestPractices {
  title: string
  supportedModes: string[]
  auditRefs: AuditRef[]
  id: string
  score: number
}


export interface Seo {
  title: string
  description: string
  manualDescription: string
  supportedModes: string[]
  auditRefs: AuditRef[]
  id: string
  score: number
}


export interface Pwa {
  title: string
  description: string
  manualDescription: string
  supportedModes: string[]
  auditRefs: AuditRef[]
  id: string
  score: number
}

export interface AuditRef {
  id: string
  weight: number
  group?: string
  acronym?: string
  relevantAudits?: string[]
}


export interface ISitePerformance {
  performance:Record<string, Result.Category>;
  siteid:string;
  sitename:string;
  pagename:string;
  type:string;
  filename:string;
  screenShot:string;
}
